import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { User, Package, MapPin, Mail, Calendar } from 'lucide-react';

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login?callbackUrl=/account');
  }

  // Fetch user data with order count
  const [user, orderCount] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
      },
    }),
    prisma.order.count({
      where: { userId: session.user.id },
    }),
  ]);

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Account</h1>
          <p className="text-gray-600">Manage your account and orders</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-4 mb-6">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name || 'User'}
                    className="w-16 h-16 rounded-full"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 text-gray-700">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>
                    Member since {new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Package className="w-4 h-4 text-gray-400" />
                  <span>
                    {orderCount} {orderCount === 1 ? 'order' : 'orders'} placed
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Orders */}
              <Link
                href="/account/orders"
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow border border-gray-200 hover:border-gray-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Package className="w-6 h-6 text-gray-700" />
                  </div>
                  <span className="text-2xl font-bold text-gray-900">{orderCount}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">My Orders</h3>
                <p className="text-sm text-gray-600">
                  View and track your orders
                </p>
              </Link>

              {/* Addresses */}
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 opacity-60">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-gray-700" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Addresses</h3>
                <p className="text-sm text-gray-600">
                  Manage saved addresses
                </p>
                <p className="text-xs text-gray-500 mt-2">Coming soon</p>
              </div>
            </div>

            {/* Account Info */}
            <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Account Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Name
                  </label>
                  <p className="mt-1 text-gray-900">{user.name || 'Not set'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </label>
                  <p className="mt-1 text-gray-900">{user.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
