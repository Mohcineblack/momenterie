import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Package, ChevronRight, Search } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export default async function OrdersPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login?callbackUrl=/account/orders');
  }

  // Fetch user's orders
  const orders = await prisma.order.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      items: {
        include: {
          product: true,
          variant: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    const normalized = status.toLowerCase().replace(/_/g, ' ');
    return normalized.charAt(0).toUpperCase() + normalized.slice(1);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Mes commandes</h1>
      </div>

        {orders.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h2>
            <p className="text-gray-600 mb-6">
              Start shopping and your orders will appear here
            </p>
            <Link
              href="/collections/all"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              Browse Products
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        ) : (
          /* Orders List */
          <div className="space-y-4">
            {orders.map((order) => {
              const firstItem = order.items[0];
              const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

              return (
                <Link
                  key={order.id}
                  href={`/account/orders/${order.id}`}
                  className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-200 hover:border-gray-300"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      {/* Order Info */}
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">
                          Order #{order.orderNumber}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>

                      {/* Status Badge */}
                      <span
                        className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusText(order.status)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        {/* Items Preview */}
                        <div className="flex items-center gap-4 mb-3">
                          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Package className="w-8 h-8 text-gray-400" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {firstItem.product.name}
                              {order.items.length > 1 && ` +${order.items.length - 1} more`}
                            </p>
                            <p className="text-sm text-gray-600">
                              {totalItems} {totalItems === 1 ? 'item' : 'items'}
                            </p>
                          </div>
                        </div>

                        {/* Total */}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                          <span className="text-sm text-gray-600">Total</span>
                          <span className="text-lg font-bold text-gray-900">
                            {formatPrice(order.total)}
                          </span>
                        </div>
                      </div>

                      {/* View Details Arrow */}
                      <div className="ml-6">
                        <ChevronRight className="w-6 h-6 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  {/* Tracking Info (if available) */}
                  {order.trackingNumber && (
                    <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Tracking:</span> {order.trackingNumber}
                      </p>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        )}
    </div>
  );
}
