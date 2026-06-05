import { Metadata } from 'next';
import Link from 'next/link';
import { OCCASION_COLLECTIONS } from '@/lib/occasion-collections';
import { Gift } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Idées cadeaux personnalisés — Momenterie',
  description: 'Trouvez le cadeau personnalisé parfait pour chaque occasion : couple, anniversaire, naissance, mariage, et plus.',
};

export default function OccasionsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Idées cadeaux</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Trouvez le cadeau personnalisé parfait pour chaque occasion.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {OCCASION_COLLECTIONS.map((occasion) => (
            <Link
              key={occasion.slug}
              href={`/occasions/${occasion.slug}`}
              className="group p-6 border border-gray-200 rounded-xl hover:border-gray-900 hover:shadow-md transition-all"
            >
              <Gift className="w-8 h-8 text-gray-400 group-hover:text-gray-900 transition-colors mb-3" />
              <h2 className="font-semibold text-gray-900 mb-2">{occasion.title}</h2>
              <p className="text-sm text-gray-600 line-clamp-2">{occasion.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
