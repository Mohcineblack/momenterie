'use client';

import { useCartStore } from '@/store/cart-store';
import { X, ShoppingBag } from 'lucide-react';
import { CartItem } from './cart-item';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';
import { useEffect } from 'react';

export function CartDrawer() {
  const { items, isOpen, closeCart, getTotalPrice } = useCartStore();
  const totalPrice = getTotalPrice();

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        data-testid="cart-drawer"
        className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            <h2 className="text-lg font-semibold">
              Shopping Cart ({items.length})
            </h2>
          </div>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Your cart is empty
              </h3>
              <p className="text-gray-600 mb-6">
                Start adding some amazing personalized gifts!
              </p>
              <Link
                href="/collections/all"
                onClick={closeCart}
                className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t p-6 space-y-4">
            {/* Subtotal */}
            <div className="flex items-center justify-between text-lg font-semibold">
              <span>Subtotal</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>

            <p className="text-sm text-gray-600">
              Shipping and taxes calculated at checkout
            </p>

            {/* Actions */}
            <div className="space-y-2">
              <Link
                href="/checkout"
                onClick={closeCart}
                className="block w-full py-3 bg-gray-900 text-white text-center rounded-lg hover:bg-gray-800 transition-colors font-medium"
              >
                Proceed to Checkout
              </Link>
              <Link
                href="/cart"
                onClick={closeCart}
                className="block w-full py-3 border border-gray-300 text-gray-900 text-center rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                View Cart
              </Link>
            </div>

            {/* Free shipping progress */}
            {totalPrice < 50 && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-900">
                  Add {formatPrice(50 - totalPrice)} more for{' '}
                  <strong>free shipping</strong>!
                </p>
                <div className="mt-2 h-2 bg-blue-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 transition-all duration-300"
                    style={{ width: `${(totalPrice / 50) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {totalPrice >= 50 && (
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <p className="text-sm text-green-900 font-medium">
                  🎉 You qualify for free shipping!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
