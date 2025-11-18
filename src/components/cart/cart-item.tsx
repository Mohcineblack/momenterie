'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useCartStore, type CartItem as CartItemType } from '@/store/cart-store';
import { formatPrice } from '@/lib/utils';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { removeItem, updateQuantity, getItemPrice } = useCartStore();
  const itemPrice = getItemPrice(item);
  const totalPrice = itemPrice * item.quantity;

  return (
    <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
      {/* Image */}
      <div className="relative w-20 h-20 flex-shrink-0 bg-white rounded-lg overflow-hidden">
        {item.previewImageUrl ? (
          <Image
            src={item.previewImageUrl}
            alt={item.productName}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <span className="text-xs">No preview</span>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <Link
          href={`/products/${item.productSlug}`}
          className="font-medium text-gray-900 hover:underline line-clamp-1"
        >
          {item.productName}
        </Link>

        {item.variantName && (
          <p className="text-sm text-gray-600 mt-1">{item.variantName}</p>
        )}

        <div className="flex items-center justify-between mt-2">
          {/* Quantity Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="h-4 w-4" />
            </button>

            <span className="w-8 text-center text-sm font-medium">
              {item.quantity}
            </span>

            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {/* Price */}
          <div className="text-right">
            <p className="font-semibold">{formatPrice(totalPrice)}</p>
            {item.quantity > 1 && (
              <p className="text-xs text-gray-600">
                {formatPrice(itemPrice)} each
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Remove Button */}
      <button
        onClick={() => removeItem(item.id)}
        className="p-2 hover:bg-red-50 hover:text-red-600 rounded transition-colors self-start"
        aria-label="Remove item"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
