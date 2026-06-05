import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { OCCASION_COLLECTIONS, getOccasionBySlug } from '@/lib/occasion-collections';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { Star } from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return OCCASION_COLLECTIONS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const occasion = getOccasionBySlug(slug);
  if (!occasion) return { title: 'Not Found' };
  return {
    title: `${occasion.title} — Momenterie`,
    description: occasion.description,
  };
}

export default async function OccasionPage({ params }: PageProps) {
  const { slug } = await params;
  const occasion = getOccasionBySlug(slug);
  if (!occasion) notFound();

  const products = await prisma.product.findMany({
    where: { category: { slug: { in: occasion.categorySlugs } } },
    include: {
      category: true,
      _count: { select: { reviews: true } },
    },
  });

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{occasion.title}</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{occasion.description}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="group border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="aspect-square bg-gray-100 relative overflow-hidden">
                {product.images[0] && (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}
              </div>
              <div className="p-4">
                <p className="text-xs text-gray-500 mb-1">{product.category.name}</p>
                <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="font-bold">{formatPrice(product.basePrice)}</span>
                  {product._count.reviews > 0 && (
                    <span className="flex items-center gap-1 text-sm text-gray-500">
                      <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                      {product._count.reviews}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
