import { redirect, notFound } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { ArrowLeft, Package, Truck, CheckCircle2, MapPin } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface PageProps {
  params: Promise<{ orderId: string }>;
}

export default async function OrderDetailPage({ params }: PageProps) {
  const { orderId } = await params;
  const session = await auth();

  if (!session?.user) {
    redirect('/login?callbackUrl=/account/orders');
  }

  // Fetch order
  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
      userId: session.user.id, // Ensure user owns this order
    },
    include: {
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
    notFound();
  }

  const getStatusStep = (status: string): number => {
    switch (status) {
      case 'PENDING':
        return 1;
      case 'PROCESSING':
      case 'IN_PRODUCTION':
        return 2;
      case 'SHIPPED':
        return 3;
      case 'DELIVERED':
        return 4;
      default:
        return 0;
    }
  };

  const currentStep = getStatusStep(order.status);

  const statusSteps = [
    { id: 1, name: 'Order Confirmed', icon: CheckCircle2 },
    { id: 2, name: 'Processing', icon: Package },
    { id: 3, name: 'Shipped', icon: Truck },
    { id: 4, name: 'Delivered', icon: CheckCircle2 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href="/account/orders"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Orders
        </Link>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                Order #{order.orderNumber}
              </h1>
              <p className="text-sm text-gray-600">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>

          {/* Status Timeline */}
          <div className="relative">
            <div className="flex items-center justify-between">
              {statusSteps.map((step, index) => {
                const isCompleted = currentStep >= step.id;
                const isCurrent = currentStep === step.id;
                const Icon = step.icon;

                return (
                  <div key={step.id} className="flex flex-col items-center flex-1 relative">
                    {/* Connector Line */}
                    {index < statusSteps.length - 1 && (
                      <div
                        className={`absolute top-6 left-1/2 w-full h-1 ${
                          isCompleted ? 'bg-green-500' : 'bg-gray-200'
                        }`}
                        style={{ transform: 'translateY(-50%)' }}
                      />
                    )}

                    {/* Step Circle */}
                    <div
                      className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                        isCompleted
                          ? 'bg-green-500 text-white'
                          : isCurrent
                          ? 'bg-gray-900 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>

                    {/* Step Label */}
                    <p
                      className={`text-xs sm:text-sm text-center ${
                        isCompleted || isCurrent ? 'font-medium text-gray-900' : 'text-gray-600'
                      }`}
                    >
                      {step.name}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tracking Number */}
          {order.trackingNumber && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900">
                <span className="font-semibold">Tracking Number:</span> {order.trackingNumber}
              </p>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Order Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-bold mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-4 pb-4 border-b border-gray-200 last:border-b-0 last:pb-0"
                  >
                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Package className="w-10 h-10 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.product.name}</h3>
                      {item.variant && (
                        <p className="text-sm text-gray-600 mt-1">{item.variant.name}</p>
                      )}
                      <p className="text-sm text-gray-600 mt-1">Quantity: {item.quantity}</p>
                      {item.customizationData && (
                        <p className="text-xs text-gray-500 mt-2">
                          Personalized
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{formatPrice(item.price)}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Total: {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Summary & Addresses */}
          <div className="lg:col-span-1 space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-bold mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-900">
                    {formatPrice(order.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-gray-900">
                    {order.shippingCost === 0 ? 'Free' : formatPrice(order.shippingCost)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium text-gray-900">{formatPrice(order.tax)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span className="font-medium">-{formatPrice(order.discount)}</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-3 flex justify-between">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="font-bold text-xl text-gray-900">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Shipping Address
              </h2>
              <div className="text-sm text-gray-700 space-y-1">
                <p className="font-medium">
                  {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                </p>
                <p>{order.shippingAddress.street}</p>
                {order.shippingAddress.street2 && <p>{order.shippingAddress.street2}</p>}
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                </p>
                {order.shippingAddress.state && <p>{order.shippingAddress.state}</p>}
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
