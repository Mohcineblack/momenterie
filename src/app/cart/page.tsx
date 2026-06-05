'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/store/cart-store';
import { calculateShippingCost, calculateTax, formatPrice } from '@/lib/utils';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { FREE_SHIPPING_THRESHOLD_CENTS } from '@/lib/shipping-config';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, getItemPrice } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return <div className="min-h-[50vh] flex items-center justify-center"><p className="font-sans text-on-surface-variant">Loading...</p></div>;

  const subtotal = getTotalPrice();
  const shipping = calculateShippingCost('FR', subtotal);
  const tax = calculateTax(subtotal, 'FR');
  const total = subtotal + shipping + tax;

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
        <ShoppingBag className="w-16 h-16 text-surface-container-high mb-6" />
        <h1 className="font-serif text-3xl font-medium text-primary mb-4">Your cart is empty</h1>
        <p className="font-serif italic text-on-surface-variant mb-8">Start creating your personalized moment.</p>
        <Link href="/collections/all" className="bg-primary text-on-primary px-8 py-4 font-sans text-[11px] uppercase tracking-[0.2em] font-semibold hover:bg-secondary transition-colors">
          Explore Collections
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto px-6 md:px-[48px] py-12 md:py-24">
      <div className="mb-12">
        <h1 className="font-serif text-4xl lg:text-5xl font-medium text-primary mb-4 tracking-tight">Your Cart</h1>
        <div className="w-12 h-[1px] bg-secondary" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
        {/* Items */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-8">
          {items.map((item) => {
            const itemPrice = getItemPrice(item);
            return (
              <div key={item.id} className="flex flex-col sm:flex-row gap-6 pb-8 border-b border-outline-variant">
                <div className="w-full sm:w-32 aspect-[4/5] bg-surface-container relative overflow-hidden flex-shrink-0 border border-outline-variant">
                  {item.previewImageUrl ? (
                    <Image src={item.previewImageUrl} alt={item.productName} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-surface-container-high">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <Link href={`/products/${item.productSlug}`} className="font-serif text-xl font-medium text-primary hover:text-secondary transition-colors">
                        {item.productName}
                      </Link>
                      <span className="font-sans font-semibold text-primary">{formatPrice(itemPrice * item.quantity)}</span>
                    </div>
                    {item.variantName && (
                      <p className="font-sans text-sm text-on-surface-variant mb-3">{item.variantName}</p>
                    )}
                  </div>

                  <div className="flex justify-between items-end">
                    <div className="flex items-center border border-outline-variant">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-1 text-on-surface-variant hover:text-primary transition-colors font-sans">-</button>
                      <span className="px-3 py-1 font-sans text-sm font-medium">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-1 text-on-surface-variant hover:text-primary transition-colors font-sans">+</button>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1 font-sans text-xs uppercase tracking-wider font-semibold">
                      <Trash2 className="w-4 h-4" /> <span className="hidden sm:inline">Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-5 xl:col-span-4">
          <div className="bg-surface-container-lowest border border-outline-variant p-6 md:p-8 sticky top-32">
            <h2 className="font-serif text-2xl font-medium text-primary mb-6">Order Summary</h2>

            <div className="space-y-4 font-sans text-sm mb-6 border-b border-outline-variant pb-6">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Subtotal</span>
                <span className="font-medium text-primary">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Shipping</span>
                <span className="font-medium text-secondary">{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
              </div>
              {tax > 0 && (
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Tax</span>
                  <span className="font-medium text-primary">{formatPrice(tax)}</span>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center mb-8">
              <span className="font-sans text-lg font-semibold text-primary uppercase tracking-wide">Total</span>
              <span className="font-serif text-3xl font-medium text-primary">{formatPrice(total)}</span>
            </div>

            <Link href="/checkout" className="flex items-center justify-center w-full gap-2 bg-primary text-on-primary py-4 font-sans text-xs uppercase tracking-[0.1em] font-semibold hover:bg-secondary transition-colors group">
              Proceed to Checkout <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            {subtotal < FREE_SHIPPING_THRESHOLD_CENTS && (
              <p className="font-sans text-xs text-on-surface-variant mt-4 text-center">
                Plus que {formatPrice(FREE_SHIPPING_THRESHOLD_CENTS - subtotal)} pour la livraison gratuite
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
