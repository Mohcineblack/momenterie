import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { sendOrderConfirmationEmail } from '@/lib/email';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
  typescript: true,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      console.error('Missing stripe-signature header');
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json(
        { error: `Webhook signature verification failed: ${err.message}` },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      case 'charge.refunded':
        await handleChargeRefunded(event.data.object as Stripe.Charge);
        break;

      case 'payment_intent.canceled':
        await handlePaymentIntentCanceled(event.data.object as Stripe.PaymentIntent);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log('PaymentIntent succeeded:', paymentIntent.id);

  try {
    // Find the order by payment intent ID
    const order = await prisma.order.findFirst({
      where: { paymentIntentId: paymentIntent.id },
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
      console.error('Order not found for PaymentIntent:', paymentIntent.id);
      return;
    }

    // Update order status
    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: 'paid',
        status: 'processing',
      },
    });

    console.log('Order updated successfully:', order.orderNumber);

    // Send order confirmation email
    try {
      await sendOrderConfirmationEmail({
        to: order.user.email!,
        customerName: order.user.name || 'Customer',
        orderNumber: order.orderNumber,
        orderDate: order.createdAt,
        items: order.items.map((item) => ({
          name: item.product.name,
          variant: item.variant?.name || 'Standard',
          quantity: item.quantity,
          price: item.price,
          image: item.product.images[0] || '/images/placeholder.jpg',
        })),
        subtotal: order.subtotal,
        shipping: order.shippingCost,
        tax: order.tax,
        total: order.total,
        shippingAddress: order.shippingAddress,
      });
      console.log('Order confirmation email sent to:', order.user.email);
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Don't fail the webhook if email fails
    }
  } catch (error) {
    console.error('Error handling payment_intent.succeeded:', error);
    throw error;
  }
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log('PaymentIntent failed:', paymentIntent.id);

  try {
    // Find the order
    const order = await prisma.order.findFirst({
      where: { paymentIntentId: paymentIntent.id },
    });

    if (!order) {
      console.error('Order not found for failed PaymentIntent:', paymentIntent.id);
      return;
    }

    // Update order status to failed
    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: 'failed',
        status: 'cancelled',
        notes: `Payment failed: ${paymentIntent.last_payment_error?.message || 'Unknown error'}`,
      },
    });

    console.log('Order marked as failed:', order.orderNumber);

    // TODO: Send payment failed email notification
  } catch (error) {
    console.error('Error handling payment_intent.failed:', error);
    throw error;
  }
}

async function handleChargeRefunded(charge: Stripe.Charge) {
  console.log('Charge refunded:', charge.id);

  try {
    // Find the order by payment intent ID
    const order = await prisma.order.findFirst({
      where: { paymentIntentId: charge.payment_intent as string },
    });

    if (!order) {
      console.error('Order not found for refunded Charge:', charge.id);
      return;
    }

    // Update order status
    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: 'refunded',
        status: 'refunded',
        notes: 'Payment refunded',
      },
    });

    console.log('Order marked as refunded:', order.orderNumber);

    // TODO: Send refund confirmation email
  } catch (error) {
    console.error('Error handling charge.refunded:', error);
    throw error;
  }
}

async function handlePaymentIntentCanceled(paymentIntent: Stripe.PaymentIntent) {
  console.log('PaymentIntent canceled:', paymentIntent.id);

  try {
    // Find the order
    const order = await prisma.order.findFirst({
      where: { paymentIntentId: paymentIntent.id },
    });

    if (!order) {
      console.error('Order not found for canceled PaymentIntent:', paymentIntent.id);
      return;
    }

    // Update order status
    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: 'cancelled',
        status: 'cancelled',
        notes: 'Payment cancelled',
      },
    });

    console.log('Order marked as cancelled:', order.orderNumber);
  } catch (error) {
    console.error('Error handling payment_intent.canceled:', error);
    throw error;
  }
}
