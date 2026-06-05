import { Truck } from 'lucide-react';
import { FREE_SHIPPING_THRESHOLD_CENTS } from '@/lib/shipping-config';

export function AnnouncementBar() {
  const thresholdEuros = (FREE_SHIPPING_THRESHOLD_CENTS / 100).toFixed(0);

  return (
    <div className="bg-gray-900 text-white text-center py-2 text-sm">
      <div className="container mx-auto px-4 flex items-center justify-center gap-2">
        <Truck className="w-4 h-4" />
        <span>Livraison gratuite dès {thresholdEuros} €</span>
      </div>
    </div>
  );
}
