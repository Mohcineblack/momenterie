import { redirect, notFound } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { ArrowLeft, Package, MapPin, CreditCard } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { OrderStatusUpdater } from '@/components/admin/order-status-updater';
import { FulfillmentPanel } from '@/components/admin/fulfillment-panel';

interface PageProps {
  params: Promise<{ orderId: string }>;
}

export default async function AdminOrderDetailPage({ params }: PageProps) {
  const { orderId } = await params;
  const session = await auth();

  if (!session?.user || session.user.role !== 'admin') {
    redirect('/');
  }

  const order = await prisma.order.findUnique({
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
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Orders
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                Order #{order.orderNumber}
              </h1>
              <p className="text-gray-600">
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
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status Management */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h2 className="text-lg font-bold mb-4">Order Management</h2>
              <OrderStatusUpdater order={order} />
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Package className="w-5 h-5" />
                Order Items
              </h2>
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
                        <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                          <strong>Customization:</strong>
                          <pre className="mt-1 text-gray-600 overflow-x-auto">
                            {JSON.stringify(item.customizationData, null, 2)}
                          </pre>
                        </div>
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

            {/* Customer Information */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h2 className="text-lg font-bold mb-4">Customer Information</h2>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Name</label>
                  <p className="text-gray-900">{order.user.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <p className="text-gray-900">{order.user.email}</p>
                </div>
                {order.user.image && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Avatar</label>
                    <img
                      src={order.user.image}
                      alt={order.user.name || 'User'}
                      className="w-12 h-12 rounded-full mt-1"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Order Summary
              </h2>
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

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="text-sm">
                  <p className="text-gray-600 mb-1">Payment Status</p>
                  <p
                    className={`font-medium ${
                      order.paymentStatus === 'PAID'
                        ? 'text-green-600'
                        : order.paymentStatus === 'REFUNDED'
                        ? 'text-gray-600'
                        : 'text-red-600'
                    }`}
                  >
                    {order.paymentStatus.toUpperCase()}
                  </p>
                </div>
                {order.paymentIntentId && (
                  <div className="text-xs text-gray-500 mt-2">
                    Payment ID: {order.paymentIntentId}
                  </div>
                )}
              </div>
            </div>

            {/* Fulfillment Panel */}
            {(order.status === 'IN_PRODUCTION' ||
              order.status === 'SHIPPED' ||
              order.status === 'DELIVERED' ||
              order.prodigiOrderId ||
              order.fulfillmentError) && (
              <FulfillmentPanel
                order={{
                  id: order.id,
                  status: order.status,
                  prodigiOrderId: order.prodigiOrderId,
                  supplierCostCents: order.supplierCostCents,
                  carrier: order.carrier,
                  trackingUrl: order.trackingUrl,
                  shippedAt: order.shippedAt ? order.shippedAt.toISOString() : null,
                  fulfillmentError: order.fulfillmentError,
                }}
              />
            )}

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
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

            {/* Billing Address */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h2 className="text-lg font-bold mb-4">Billing Address</h2>
              <div className="text-sm text-gray-700 space-y-1">
                <p className="font-medium">
                  {order.billingAddress.firstName} {order.billingAddress.lastName}
                </p>
                <p>{order.billingAddress.street}</p>
                {order.billingAddress.street2 && <p>{order.billingAddress.street2}</p>}
                <p>
                  {order.billingAddress.city}, {order.billingAddress.postalCode}
                </p>
                {order.billingAddress.state && <p>{order.billingAddress.state}</p>}
                <p>{order.billingAddress.country}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
