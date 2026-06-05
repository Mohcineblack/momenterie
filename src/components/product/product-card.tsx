import Link from 'next/link';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { WishlistButton } from '@/components/wishlist/wishlist-button';
import type { ProductWithRelations } from '@/types';

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    slug: string;
    description: string;
    basePrice: number;
    images: string[];
    featured?: boolean;
    bestseller?: boolean;
    category: {
      name: string;
      slug: string;
    };
    averageRating?: number;
    reviewCount?: number;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const primaryImage = product.images[0] || '/images/placeholder-product.jpg';
  const secondaryImage = product.images[1] || primaryImage;

  return (
    <div
      data-testid="product-card"
      className="group relative bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300"
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {product.bestseller && (
          <span className="px-3 py-1 bg-yellow-400 text-yellow-900 text-xs font-semibold rounded-full">
            Bestseller
          </span>
        )}
        {product.featured && (
          <span className="px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full">
            Featured
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <div className="absolute top-3 right-3 z-10">
        <WishlistButton
          productId={product.id}
          productName={product.name}
          productSlug={product.slug}
          productImage={primaryImage}
          productPrice={product.basePrice}
          size="md"
        />
      </div>

      {/* Product Image */}
      <Link href={`/products/${product.slug}`} className="block relative aspect-square overflow-hidden bg-gray-100">
        <Image
          src={primaryImage}
          alt={product.name}
          fill
          className="object-cover group-hover:opacity-0 transition-opacity duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <Image
          src={secondaryImage}
          alt={product.name}
          fill
          className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button className="px-6 py-2 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-colors">
            Quick View
          </button>
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4">
        {/* Category */}
        <Link
          href={`/collections/${product.category.slug}`}
          className="text-xs text-gray-600 hover:text-gray-900 transition-colors uppercase tracking-wide"
        >
          {product.category.name}
        </Link>

        {/* Product Name */}
        <Link href={`/products/${product.slug}`}>
          <h3 className="mt-2 font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Description */}
        <p className="mt-1 text-sm text-gray-600 line-clamp-2">
          {product.description}
        </p>

        {/* Rating */}
        {product.averageRating && product.reviewCount ? (
          <div className="mt-2 flex items-center gap-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.round(product.averageRating || 0)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {product.averageRating.toFixed(1)} ({product.reviewCount})
            </span>
          </div>
        ) : (
          <div className="mt-2 h-5" /> // Spacer for consistent height
        )}

        {/* Price and CTA */}
        <div className="mt-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500">Starting at</span>
            <p className="text-xl font-bold text-gray-900">
              {formatPrice(product.basePrice)}
            </p>
          </div>

          <Link
            href={`/products/${product.slug}`}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Customize
          </Link>
        </div>
      </div>
    </div>
  );
}
