import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import {
  renderOrderItem,
  sendConfirmationEmail,
} from "@/trigger/order-tasks";

type WebhookReservation = "reserved" | "duplicate-unprocessed" | "processed";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    if (!signature) {
      console.error("Missing stripe-signature header");
      return NextResponse.json(
        { error: "Missing stripe-signature header" },
        { status: 400 }
      );
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error("STRIPE_WEBHOOK_SECRET is not configured");
      return NextResponse.json(
        { error: "Webhook secret is not configured" },
        { status: 500 }
      );
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message);
      return NextResponse.json(
        { error: `Webhook signature verification failed: ${err.message}` },
        { status: 400 }
      );
    }

    const reservation = await reserveWebhookEvent(event);

    if (reservation === "processed") {
      return NextResponse.json({ received: true }, { status: 200 });
    }

    if (reservation === "duplicate-unprocessed") {
      return NextResponse.json({ received: true }, { status: 200 });
    }

    try {
      switch (event.type) {
        case "payment_intent.succeeded":
          await handlePaymentIntentSucceeded(
            event.data.object as Stripe.PaymentIntent
          );
          break;

        case "payment_intent.payment_failed":
          await handlePaymentIntentFailed(
            event.data.object as Stripe.PaymentIntent
          );
          break;

        case "charge.refunded":
          await handleChargeRefunded(event.data.object as Stripe.Charge);
          break;

        case "payment_intent.canceled":
          await handlePaymentIntentCanceled(
            event.data.object as Stripe.PaymentIntent
          );
          break;

        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      await prisma.stripeWebhookEvent.update({
        where: { eventId: event.id },
        data: { processedAt: new Date() },
      });
    } catch (error) {
      await prisma.stripeWebhookEvent
        .delete({ where: { eventId: event.id } })
        .catch(() => undefined);
      throw error;
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

async function reserveWebhookEvent(
  event: Stripe.Event
): Promise<WebhookReservation> {
  try {
    await prisma.stripeWebhookEvent.create({
      data: { eventId: event.id, type: event.type },
    });
    return "reserved";
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      const existingEvent = await prisma.stripeWebhookEvent.findUnique({
        where: { eventId: event.id },
      });

      return existingEvent?.processedAt ? "processed" : "duplicate-unprocessed";
    }

    throw error;
  }
}

function isUniqueConstraintError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2002"
  );
}

async function handlePaymentIntentSucceeded(
  paymentIntent: Stripe.PaymentIntent
) {
  console.log("PaymentIntent succeeded:", paymentIntent.id);

  try {
    const orderId = paymentIntent.metadata.orderId;
    if (!orderId) {
      console.error("PaymentIntent missing orderId metadata:", paymentIntent.id);
      return;
    }

    const order = await prisma.order.findFirst({
      where: { id: orderId },
      include: {
        user: true,
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
        shippingAddress: true,
        billingAddress: true,
      },
    });

    if (!order) {
      console.error("Order not found for PaymentIntent:", paymentIntent.id);
      return;
    }

    if (order.paymentStatus === "PAID") {
      console.log("Order already paid:", order.orderNumber);
    } else {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: "PAID",
          status: "PROCESSING",
        },
      });

      console.log("Order updated successfully:", order.orderNumber);
    }

    await sendConfirmationEmail.trigger(
      { orderId: order.id },
      { idempotencyKey: `confirmation-email-${order.id}` }
    );

    await Promise.all(
      order.items.map((item) =>
        renderOrderItem.trigger(
          { orderItemId: item.id },
          { idempotencyKey: `render-order-item-${item.id}` }
        )
      )
    );
  } catch (error) {
    console.error("Error handling payment_intent.succeeded:", error);
    throw error;
  }
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log("PaymentIntent failed:", paymentIntent.id);

  try {
    const orderId = paymentIntent.metadata.orderId;
    const order = await prisma.order.findFirst({
      where: orderId ? { id: orderId } : { paymentIntentId: paymentIntent.id },
    });

    if (!order) {
      console.error(
        "Order not found for failed PaymentIntent:",
        paymentIntent.id
      );
      return;
    }

    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: "FAILED",
        status: "CANCELLED",
        notes: `Payment failed: ${paymentIntent.last_payment_error?.message || "Unknown error"}`,
      },
    });

    console.log("Order marked as failed:", order.orderNumber);

    // TODO: Send payment failed email notification
  } catch (error) {
    console.error("Error handling payment_intent.failed:", error);
    throw error;
  }
}

async function handleChargeRefunded(charge: Stripe.Charge) {
  console.log("Charge refunded:", charge.id);

  try {
    // Find the order by payment intent ID
    const order = await prisma.order.findFirst({
      where: { paymentIntentId: charge.payment_intent as string },
    });

    if (!order) {
      console.error("Order not found for refunded Charge:", charge.id);
      return;
    }

    // Update order status
    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: "REFUNDED",
        status: "REFUNDED",
        notes: "Payment refunded",
      },
    });

    console.log("Order marked as refunded:", order.orderNumber);

    // TODO: Send refund confirmation email
  } catch (error) {
    console.error("Error handling charge.refunded:", error);
    throw error;
  }
}

async function handlePaymentIntentCanceled(
  paymentIntent: Stripe.PaymentIntent
) {
  console.log("PaymentIntent canceled:", paymentIntent.id);

  try {
    const orderId = paymentIntent.metadata.orderId;
    const order = await prisma.order.findFirst({
      where: orderId ? { id: orderId } : { paymentIntentId: paymentIntent.id },
    });

    if (!order) {
      console.error(
        "Order not found for canceled PaymentIntent:",
        paymentIntent.id
      );
      return;
    }

    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: "CANCELLED",
        status: "CANCELLED",
        notes: "Payment cancelled",
      },
    });

    console.log("Order marked as cancelled:", order.orderNumber);
  } catch (error) {
    console.error("Error handling payment_intent.canceled:", error);
    throw error;
  }
}
