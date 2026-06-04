import Image from 'next/image';
import { formatPrice } from '@/lib/utils';
import { ShoppingBag } from 'lucide-react';
import type { CartItem } from '@/store/cart-store';

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

export function OrderSummary({
  items,
  subtotal,
  shipping,
  tax,
  total,
}: OrderSummaryProps) {
  return (
    <div data-testid="order-summary" className="bg-white rounded-lg p-6 shadow-sm sticky top-24">
      <h2 className="text-xl font-bold mb-6">Order Summary</h2>

      {/* Items */}
      <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
        {items.map((item) => {
          const itemPrice = item.basePrice + item.variantPrice;
          const totalItemPrice = itemPrice * item.quantity;

          return (
            <div key={item.id} className="flex gap-4">
              <div className="relative w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                {item.previewImageUrl ? (
                  <Image
                    src={item.previewImageUrl}
                    alt={item.productName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                )}
                {/* Quantity Badge */}
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                  {item.quantity}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm line-clamp-1">
                  {item.productName}
                </h4>
                {item.variantName && (
                  <p className="text-xs text-gray-600 mt-1">{item.variantName}</p>
                )}
                <p className="text-sm font-semibold mt-2">
                  {formatPrice(totalItemPrice)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Price Breakdown */}
      <div className="space-y-3 pt-6 border-t">
        <div className="flex justify-between text-gray-700">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>

        <div className="flex justify-between text-gray-700">
          <span>Shipping</span>
          <span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
        </div>

        <div className="flex justify-between text-gray-700">
          <span>Tax (19%)</span>
          <span>{formatPrice(tax)}</span>
        </div>

        <div className="pt-3 border-t">
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="mt-6 pt-6 border-t space-y-3 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <span className="text-green-600">✓</span>
          <span>Secure checkout</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-green-600">✓</span>
          <span>Free returns within 30 days</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-green-600">✓</span>
          <span>100% satisfaction guaranteed</span>
        </div>
      </div>
    </div>
  );
}
