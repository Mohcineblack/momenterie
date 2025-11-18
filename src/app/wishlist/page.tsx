'use client';

import { useState, useEffect } from 'react';
import { useWishlistStore } from '@/store/wishlist-store';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, X, ShoppingCart, ArrowRight } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export default function WishlistPage() {
  const { items, removeItem } = useWishlistStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="w-8 h-8 text-red-500 fill-current" />
            <h1 className="text-4xl font-bold text-gray-900">My Wishlist</h1>
          </div>
          <p className="text-lg text-gray-600">
            {items.length === 0
              ? 'Your wishlist is empty'
              : `${items.length} ${items.length === 1 ? 'item' : 'items'} saved for later`}
          </p>
        </div>

        {items.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-lg shadow-sm p-12 text-center max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No items in your wishlist</h2>
            <p className="text-gray-600 mb-6">
              Start adding products you love to your wishlist
            </p>
            <Link
              href="/collections/all"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              Browse Products
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        ) : (
          /* Wishlist Grid */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <div
                key={item.productId}
                className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow group"
              >
                {/* Remove Button */}
                <div className="relative">
                  <Link href={`/products/${item.productSlug}`}>
                    <div className="relative aspect-square bg-gray-100">
                      <Image
                        src={item.productImage}
                        alt={item.productName}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </Link>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-50 hover:text-red-600 transition-colors"
                    title="Remove from wishlist"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <Link href={`/products/${item.productSlug}`}>
                    <h3 className="font-semibold text-gray-900 mb-2 hover:text-gray-700 line-clamp-2">
                      {item.productName}
                    </h3>
                  </Link>
                  <p className="text-lg font-bold text-gray-900 mb-3">
                    {formatPrice(item.productPrice)}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      href={`/products/${item.productSlug}`}
                      className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium text-center text-sm flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Customize
                    </Link>
                  </div>

                  {/* Added Date */}
                  <p className="text-xs text-gray-500 mt-3">
                    Added {new Date(item.addedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
