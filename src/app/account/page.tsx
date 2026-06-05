import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Package, MapPin } from 'lucide-react';

export default async function AccountPage() {
  const session = await auth();
  const userId = session!.user!.id;

  const [orderCount, addressCount] = await Promise.all([
    prisma.order.count({ where: { userId } }),
    prisma.address.count({ where: { userId } }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Tableau de bord</h1>

      <div className="grid sm:grid-cols-2 gap-4">
        <Link
          href="/account/orders"
          className="border border-gray-200 rounded-lg p-5 hover:border-gray-300 hover:shadow-sm transition-all"
        >
          <Package className="w-8 h-8 text-gray-700 mb-3" />
          <h3 className="font-semibold text-gray-900">{orderCount} commande{orderCount !== 1 ? 's' : ''}</h3>
          <p className="text-sm text-gray-600">Voir et suivre mes commandes</p>
        </Link>

        <Link
          href="/account/addresses"
          className="border border-gray-200 rounded-lg p-5 hover:border-gray-300 hover:shadow-sm transition-all"
        >
          <MapPin className="w-8 h-8 text-gray-700 mb-3" />
          <h3 className="font-semibold text-gray-900">{addressCount} adresse{addressCount !== 1 ? 's' : ''}</h3>
          <p className="text-sm text-gray-600">G\u00e9rer mes adresses de livraison</p>
        </Link>
      </div>
    </div>
  );
}
