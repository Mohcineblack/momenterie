"use client";

import { useEffect, useState } from "react";

interface OrderStatusPollerProps {
  orderId: string;
  initialPaymentStatus: string;
  paymentIntentClientSecret?: string;
}

export function OrderStatusPoller({
  orderId,
  initialPaymentStatus,
  paymentIntentClientSecret,
}: OrderStatusPollerProps) {
  const [paymentStatus, setPaymentStatus] = useState(initialPaymentStatus);

  useEffect(() => {
    if (paymentStatus === "PAID") return;

    const intervalId = window.setInterval(async () => {
      const query = paymentIntentClientSecret
        ? `?payment_intent_client_secret=${encodeURIComponent(paymentIntentClientSecret)}`
        : "";
      const response = await fetch(`/api/orders/${orderId}/status${query}`);
      const result = await response.json();

      if (result.success && result.data?.paymentStatus) {
        setPaymentStatus(result.data.paymentStatus);
      }
    }, 3000);

    return () => window.clearInterval(intervalId);
  }, [orderId, paymentIntentClientSecret, paymentStatus]);

  if (paymentStatus === "PAID") {
    return (
      <p className="text-xl text-gray-600 mb-2">
        Your payment is confirmed and your order is being processed.
      </p>
    );
  }

  return (
    <p className="text-xl text-gray-600 mb-2">
      Your order has been received. Payment confirmation is still processing.
    </p>
  );
}
