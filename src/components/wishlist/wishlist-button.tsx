'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useWishlistStore } from '@/store/wishlist-store';
import { toast } from 'sonner';

interface WishlistButtonProps {
  productId: number;
  productName: string;
  productSlug: string;
  productImage: string;
  productPrice: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'icon' | 'button';
}

export function WishlistButton({
  productId,
  productName,
  productSlug,
  productImage,
  productPrice,
  size = 'md',
  variant = 'icon',
}: WishlistButtonProps) {
  const { addItem, removeItem, isInWishlist } = useWishlistStore();
  const [mounted, setMounted] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);

  useEffect(() => {
    setMounted(true);
    setInWishlist(isInWishlist(productId));
  }, [productId, isInWishlist]);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (inWishlist) {
      removeItem(productId);
      setInWishlist(false);
      toast.success('Removed from wishlist');
    } else {
      addItem({
        productId,
        productName,
        productSlug,
        productImage,
        productPrice,
        addedAt: Date.now(),
      });
      setInWishlist(true);
      toast.success('Added to wishlist!');
    }
  };

  if (!mounted) {
    return null;
  }

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  if (variant === 'button') {
    return (
      <button
        onClick={handleToggle}
        className={`flex items-center gap-2 px-4 py-2 border-2 rounded-lg transition-all ${
          inWishlist
            ? 'border-red-500 bg-red-50 text-red-600 hover:bg-red-100'
            : 'border-gray-300 text-gray-700 hover:border-gray-400'
        }`}
      >
        <Heart
          className={`${iconSizes[size]} ${inWishlist ? 'fill-current' : ''}`}
        />
        <span className="font-medium">
          {inWishlist ? 'In Wishlist' : 'Add to Wishlist'}
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center transition-all ${
        inWishlist
          ? 'bg-red-500 text-white hover:bg-red-600'
          : 'bg-white border-2 border-gray-300 text-gray-600 hover:border-red-500 hover:text-red-500'
      }`}
      title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart className={`${iconSizes[size]} ${inWishlist ? 'fill-current' : ''}`} />
    </button>
  );
}
