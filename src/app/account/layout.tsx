import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import Link from 'next/link';
import { User, Package, MapPin, Settings, LogOut } from 'lucide-react';
import { AccountNavClient } from '@/components/account/account-nav-client';

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect('/login?callbackUrl=/account');

  const navItems = [
    { href: '/account', label: 'Mon compte', icon: 'User' },
    { href: '/account/orders', label: 'Mes commandes', icon: 'Package' },
    { href: '/account/addresses', label: 'Mes adresses', icon: 'MapPin' },
    { href: '/account/settings', label: 'Param\u00e8tres', icon: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-24">
              <div className="mb-4 pb-4 border-b">
                <p className="font-semibold text-gray-900">{session.user.name || 'Mon compte'}</p>
                <p className="text-sm text-gray-500 truncate">{session.user.email}</p>
              </div>
              <AccountNavClient items={navItems} />
            </div>
          </aside>

          {/* Main content */}
          <main className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
