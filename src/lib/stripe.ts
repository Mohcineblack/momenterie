import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not defined");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-02-24.acacia",
  typescript: true,
});

export async function createPaymentIntent(
  amount: number,
  metadata: Record<string, string>
) {
  try {
    return await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: "eur",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    throw error;
  }
}

export async function createCheckoutSession(
  lineItems: Stripe.Checkout.SessionCreateParams.LineItem[],
  metadata: Record<string, string>,
  successUrl: string,
  cancelUrl: string
) {
  try {
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
    return await stripe.paymentIntents.retrieve(paymentIntentId);
  } catch (error) {
    console.error("Error retrieving payment intent:", error);
    throw error;
  }
}

export async function refundPayment(paymentIntentId: string, amount?: number) {
  try {
    return await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: amount ? Math.round(amount * 100) : undefined,
    });
  } catch (error) {
    console.error("Error creating refund:", error);
    throw error;
  }
}
