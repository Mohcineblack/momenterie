"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Lock } from "lucide-react";
import { useCartStore } from "@/store/cart-store";

interface PaymentFormProps {
  clientSecret: string;
  onBack: () => void;
  checkoutData: any;
}

export function PaymentForm({
  clientSecret,
  onBack,
  checkoutData,
}: PaymentFormProps) {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const { clearCart } = useCartStore();

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage("");

    try {
      // Create the order in our database first
      const orderResponse = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shipping: checkoutData.shippingAddress,
          billing: checkoutData.billingAddress,
          items: checkoutData.items,
          subtotal: checkoutData.subtotal,
          shippingCost: checkoutData.shippingCost,
          tax: checkoutData.tax,
          total: checkoutData.total,
        }),
      });

      const orderResult = await orderResponse.json();

      if (!orderResult.success) {
        throw new Error(orderResult.error || "Failed to create order");
      }

      const orderId = orderResult.data.orderId;

      // Confirm the payment with Stripe
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/orders/confirmation/${orderId}`,
        },
        redirect: "if_required",
      });

      if (error) {
        setErrorMessage(error.message || "Payment failed. Please try again.");
        toast.error(error.message || "Payment failed");
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        // Payment successful!
        toast.success("Payment successful!");
        clearCart();
        router.push(`/orders/confirmation/${orderId}`);
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      setErrorMessage(error.message || "An unexpected error occurred");
      toast.error(error.message || "Payment failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-bold mb-6">Payment</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Stripe Payment Element */}
        <div>
          <PaymentElement />
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{errorMessage}</p>
          </div>
        )}

        {/* Security Info */}
        <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
          <Lock className="w-4 h-4" />
          <span>Your payment information is secure and encrypted</span>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={onBack}
            disabled={isProcessing}
            className="flex items-center justify-center gap-2 px-6 py-4 border-2 border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          <button
            type="submit"
            disabled={!stripe || isProcessing}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing payment...
              </>
            ) : (
              <>
                <Lock className="w-5 h-5" />
                Pay{" "}
                {checkoutData.total ? `€${checkoutData.total.toFixed(2)}` : ""}
              </>
            )}
          </button>
        </div>

        {/* Terms */}
        <p className="text-xs text-gray-500 text-center">
          By placing this order, you agree to our{" "}
          <a href="/policies/terms-of-service" className="underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/policies/privacy-policy" className="underline">
            Privacy Policy
          </a>
        </p>
      </form>
    </div>
  );
}
