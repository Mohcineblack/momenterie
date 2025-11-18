import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate } from "@/lib/utils";
import { CheckCircle2, Package, Truck, Mail, ArrowRight } from "lucide-react";

interface PageProps {
  params: Promise<{ orderId: string }>;
}

export const metadata: Metadata = {
  title: "Order Confirmation - Momenterie",
  description: "Thank you for your order!",
};

export default async function OrderConfirmationPage({ params }: PageProps) {
  const { orderId } = await params;
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          product: true,
          variant: true,
        },
      },
      shippingAddress: true,
      billingAddress: true,
      user: true,
    },
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Thank You for Your Order!</h1>
          <p className="text-xl text-gray-600 mb-2">
            Your order has been received and is being processed.
          </p>
          <p className="text-gray-600">
            Order number:{" "}
            <span className="font-semibold text-gray-900">
              {order.orderNumber}
            </span>
          </p>
        </div>

        {/* Order Status Steps */}
        <div className="bg-white rounded-lg p-8 shadow-sm mb-8">
          <h2 className="text-xl font-bold mb-6">What happens next?</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Order Confirmed</h3>
                <p className="text-sm text-gray-600">
                  We've received your order and payment.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Preparing Your Order</h3>
                <p className="text-sm text-gray-600">
                  We're creating your personalized items with care.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <Truck className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Shipping</h3>
                <p className="text-sm text-gray-600">
                  We'll send you tracking information once shipped.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <Mail className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Delivery</h3>
                <p className="text-sm text-gray-600">
                  Estimated delivery: 5-7 business days
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-lg p-8 shadow-sm mb-8">
          <h2 className="text-xl font-bold mb-6">Order Details</h2>

          {/* Items */}
          <div className="space-y-4 mb-6">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 pb-4 border-b last:border-b-0"
              >
                <div className="relative w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                  {item.previewImageUrl && (
                    <Image
                      src={item.previewImageUrl}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>

                <div className="flex-1">
                  <h4 className="font-medium">{item.product.name}</h4>
                  {item.variant && (
                    <p className="text-sm text-gray-600 mt-1">
                      {item.variant.name}
                    </p>
                  )}
                  <p className="text-sm text-gray-600 mt-1">
                    Quantity: {item.quantity}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-semibold">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="space-y-2 pt-4 border-t">
            <div className="flex justify-between text-gray-700">
              <span>Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Shipping</span>
              <span>
                {order.shippingCost === 0
                  ? "FREE"
                  : formatPrice(order.shippingCost)}
              </span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Tax</span>
              <span>{formatPrice(order.tax)}</span>
            </div>
            <div className="flex justify-between text-xl font-bold pt-2 border-t">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Addresses */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="font-semibold mb-4">Shipping Address</h3>
            <address className="not-italic text-gray-700 text-sm leading-relaxed">
              {order.shippingAddress.firstName} {order.shippingAddress.lastName}
              <br />
              {order.shippingAddress.company && (
                <>
                  {order.shippingAddress.company}
                  <br />
                </>
              )}
              {order.shippingAddress.street}
              <br />
              {order.shippingAddress.street2 && (
                <>
                  {order.shippingAddress.street2}
                  <br />
                </>
              )}
              {order.shippingAddress.city}, {order.shippingAddress.postalCode}
              <br />
              {order.shippingAddress.country}
            </address>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="font-semibold mb-4">Billing Address</h3>
            <address className="not-italic text-gray-700 text-sm leading-relaxed">
              {order.billingAddress.firstName} {order.billingAddress.lastName}
              <br />
              {order.billingAddress.company && (
                <>
                  {order.billingAddress.company}
                  <br />
                </>
              )}
              {order.billingAddress.street}
              <br />
              {order.billingAddress.street2 && (
                <>
                  {order.billingAddress.street2}
                  <br />
                </>
              )}
              {order.billingAddress.city}, {order.billingAddress.postalCode}
              <br />
              {order.billingAddress.country}
            </address>
          </div>
        </div>

        {/* Email Confirmation */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex gap-4">
            <Mail className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">
                Confirmation Email Sent
              </h3>
              <p className="text-sm text-blue-800">
                We've sent an order confirmation to{" "}
                <strong>{order.user.email}</strong>. Please check your inbox
                (and spam folder) for details.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/account/orders"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
          >
            View Order Status
            <ArrowRight className="w-5 h-5" />
          </Link>

          <Link
            href="/collections/all"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Continue Shopping
          </Link>
        </div>

        {/* Support */}
        <div className="text-center mt-12 text-gray-600">
          <p className="mb-2">Need help with your order?</p>
          <a
            href="mailto:support@momenterie.com"
            className="text-gray-900 font-medium hover:underline"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
