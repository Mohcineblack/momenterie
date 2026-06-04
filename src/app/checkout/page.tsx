"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart-store";
import { ShippingForm } from "@/components/checkout/shipping-form";
import { BillingForm } from "@/components/checkout/billing-form";
import { PaymentForm } from "@/components/checkout/payment-form";
import { OrderSummary } from "@/components/checkout/order-summary";
import { CheckoutSteps } from "@/components/checkout/checkout-steps";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { CheckoutFormData } from "@/types";
import { calculateShippingCost, calculateTax } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<CheckoutFormData>>({});
  const [clientSecret, setClientSecret] = useState<string>("");
  const [orderId, setOrderId] = useState<string>("");
  const [serverTotals, setServerTotals] = useState<{
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
  } | null>(null);
  const [isCreatingIntent, setIsCreatingIntent] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Redirect if cart is empty
    if (mounted && items.length === 0) {
      router.push("/cart");
    }
  }, [mounted, items, router]);

  const subtotal = getTotalPrice();
  const shippingCountry = formData.shipping?.country || "DE";
  const shipping = calculateShippingCost(shippingCountry, subtotal);
  const tax = calculateTax(subtotal, shippingCountry);
  const total = subtotal + shipping + tax;

  const handleShippingComplete = async (data: CheckoutFormData["shipping"]) => {
    setFormData((prev) => ({ ...prev, shipping: data }));
    setCurrentStep(2);
  };

  const handleBillingComplete = async (data: CheckoutFormData["billing"]) => {
    setFormData((prev) => ({ ...prev, billing: data }));

    // Create the order and PaymentIntent together so Stripe metadata can carry orderId.
    setIsCreatingIntent(true);
    try {
      const response = await fetch("/api/checkout/create-order-and-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shipping: formData.shipping,
          billing: data,
          items: items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
            customizationData: item.customizationData,
            previewImageUrl: item.previewImageUrl,
          })),
        }),
      });

      const result = await response.json();

      if (result.success && result.data?.clientSecret && result.data?.orderId) {
        setClientSecret(result.data.clientSecret);
        setOrderId(result.data.orderId);
        setServerTotals({
          subtotal: result.data.subtotal,
          shipping: result.data.shipping,
          tax: result.data.tax,
          total: result.data.total,
        });
        setCurrentStep(3);
      } else {
        alert("Failed to initialize payment. Please try again.");
      }
    } catch (error) {
      console.error("Error creating payment intent:", error);
      alert("Failed to initialize payment. Please try again.");
    } finally {
      setIsCreatingIntent(false);
    }
  };

  if (!mounted) {
    return <CheckoutSkeleton />;
  }

  if (items.length === 0) {
    return null; // Will redirect
  }

  const steps = [
    { number: 1, title: "Shipping", description: "Delivery address" },
    { number: 2, title: "Billing", description: "Payment address" },
    { number: 3, title: "Payment", description: "Complete order" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Cart
          </Link>
          <h1 className="text-3xl font-bold">Checkout</h1>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <CheckoutSteps steps={steps} currentStep={currentStep} />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Forms */}
          <div className="lg:col-span-2">
            {currentStep === 1 && (
              <ShippingForm
                onComplete={handleShippingComplete}
                initialData={formData.shipping}
              />
            )}

            {currentStep === 2 && (
              <BillingForm
                onComplete={handleBillingComplete}
                onBack={() => setCurrentStep(1)}
                initialData={formData.billing}
                shippingAddress={formData.shipping}
                isLoading={isCreatingIntent}
              />
            )}

            {currentStep === 3 && clientSecret && orderId && (
              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret,
                  appearance: {
                    theme: "stripe",
                    variables: {
                      colorPrimary: "#1a1a1a",
                    },
                  },
                }}
              >
                <PaymentForm
                  clientSecret={clientSecret}
                  onBack={() => setCurrentStep(2)}
                  checkoutData={{
                    orderId,
                    total: serverTotals?.total ?? total,
                  }}
                />
              </Elements>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <OrderSummary
              items={items}
              subtotal={serverTotals?.subtotal ?? subtotal}
              shipping={serverTotals?.shipping ?? shipping}
              tax={serverTotals?.tax ?? tax}
              total={serverTotals?.total ?? total}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckoutSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="h-10 bg-gray-200 rounded w-48 mb-8 animate-pulse" />
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-12 bg-gray-200 rounded animate-pulse"
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-6 bg-gray-200 rounded animate-pulse"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
