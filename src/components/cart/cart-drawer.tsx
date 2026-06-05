'use client';

import { useCartStore } from '@/store/cart-store';
import { X, Trash2 } from 'lucide-react';
import { CartItem } from './cart-item';
import { formatPrice } from '@/lib/utils';
import { FREE_SHIPPING_THRESHOLD_CENTS } from '@/lib/shipping-config';
import Link from 'next/link';
import { useEffect } from 'react';

export function CartDrawer() {
  const { items, isOpen, closeCart, getTotalPrice } = useCartStore();
  const totalPrice = getTotalPrice();

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/30 z-50 backdrop-blur-sm" onClick={closeCart} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-surface z-50 shadow-2xl flex flex-col border-l border-outline-variant">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-outline-variant">
          <h2 className="font-serif text-xl font-medium text-primary">Your Cart</h2>
          <button onClick={closeCart} className="text-on-surface-variant hover:text-primary transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="text-center py-16">
              <p className="font-serif italic text-on-surface-variant mb-6">Your cart is empty</p>
              <Link
                href="/collections/all"
                onClick={closeCart}
                className="inline-flex items-center bg-primary text-on-primary px-6 py-3 font-sans text-[11px] uppercase tracking-[0.2em] font-semibold hover:bg-secondary transition-colors"
              >
                Explore Collections
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <CartItem key={`${item.productId}-${item.variantId}`} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-outline-variant p-6 space-y-4">
            {/* Free shipping progress */}
            {totalPrice < FREE_SHIPPING_THRESHOLD_CENTS ? (
              <p className="font-sans text-xs text-on-surface-variant text-center">
                Plus que {formatPrice(FREE_SHIPPING_THRESHOLD_CENTS - totalPrice)} pour la livraison gratuite
              </p>
            ) : (
              <p className="font-sans text-xs text-secondary text-center font-semibold uppercase tracking-wider">
                Livraison gratuite
              </p>
            )}

            {/* Total */}
            <div className="flex items-center justify-between">
              <span className="font-sans text-sm uppercase tracking-wider font-semibold text-primary">Total</span>
              <span className="font-serif text-2xl font-medium text-primary">{formatPrice(totalPrice)}</span>
            </div>

            {/* Actions */}
            <Link
              href="/checkout"
              onClick={closeCart}
              className="flex items-center justify-center w-full bg-primary text-on-primary py-4 font-sans text-[11px] uppercase tracking-[0.1em] font-semibold hover:bg-secondary transition-colors"
            >
              Proceed to Checkout
            </Link>
            <Link
              href="/cart"
              onClick={closeCart}
              className="block w-full py-3 text-center font-sans text-[11px] uppercase tracking-[0.1em] font-medium text-on-surface-variant hover:text-primary transition-colors border border-outline-variant"
            >
              View Cart
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
