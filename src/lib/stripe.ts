import Stripe from "stripe";

export const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY || "sk_test_missing_build_time_key",
  {
  apiVersion: "2025-02-24.acacia",
  typescript: true,
  }
);

function assertStripeConfigured() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not defined");
  }
}

export async function createPaymentIntent(
  amountOrParams:
    | number
    | {
        amount: number;
        currency?: string;
        metadata?: Record<string, string>;
      },
  metadata: Record<string, string> = {}
) {
  try {
    assertStripeConfigured();
    const amount =
      typeof amountOrParams === "number" ? amountOrParams : amountOrParams.amount;
    const currency =
      typeof amountOrParams === "number"
        ? "eur"
        : (amountOrParams.currency || "eur").toLowerCase();
    const paymentMetadata =
      typeof amountOrParams === "number"
        ? metadata
        : amountOrParams.metadata || {};

    const paymentIntentParams: Stripe.PaymentIntentCreateParams = {
      amount,
      currency,
      metadata: paymentMetadata,
    };

    if (typeof amountOrParams === "number") {
      paymentIntentParams.automatic_payment_methods = {
        enabled: true,
      };
    }

    return await stripe.paymentIntents.create(paymentIntentParams);
  } catch (error) {
    console.error("Error creating payment intent:", error);
    throw error;
  }
}

export function formatPrice(amountCents: number, currency: string = "EUR"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amountCents / 100);
}

export function calculateOrderTotal({
  subtotal,
  shippingCost = 0,
  taxRate = 0,
  discount = 0,
  discountPercentage = 0,
}: {
  subtotal: number;
  shippingCost?: number;
  taxRate?: number;
  discount?: number;
  discountPercentage?: number;
}) {
  const percentageDiscount = subtotal * (discountPercentage / 100);
  const totalDiscount = Math.min(subtotal, discount + percentageDiscount);
  const taxableSubtotal = subtotal - totalDiscount;
  const tax = Math.round(taxableSubtotal * taxRate);
  const total = taxableSubtotal + shippingCost + tax;

  return {
    subtotal,
    subtotalAfterDiscount: taxableSubtotal,
    shippingCost,
    discount: totalDiscount,
    tax,
    total,
  };
}

export async function createCheckoutSession(
  lineItems: Stripe.Checkout.SessionCreateParams.LineItem[],
  metadata: Record<string, string>,
  successUrl: string,
  cancelUrl: string
) {
  try {
    assertStripeConfigured();
    return await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata,
      shipping_address_collection: {
        allowed_countries: [
          "DE",
          "AT",
          "CH",
          "FR",
          "BE",
          "NL",
          "IT",
          "ES",
          "PT",
          "GB",
          "US",
        ],
      },
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    throw error;
  }
}

export async function retrievePaymentIntent(paymentIntentId: string) {
  try {
    assertStripeConfigured();
    return await stripe.paymentIntents.retrieve(paymentIntentId);
  } catch (error) {
    console.error("Error retrieving payment intent:", error);
    throw error;
  }
}

export async function refundPayment(paymentIntentId: string, amount?: number) {
  try {
    assertStripeConfigured();
    return await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount,
    });
  } catch (error) {
    console.error("Error creating refund:", error);
    throw error;
  }
}
