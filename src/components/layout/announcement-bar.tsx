import { FREE_SHIPPING_THRESHOLD_CENTS } from '@/lib/shipping-config';

export function AnnouncementBar() {
  const thresholdEuros = (FREE_SHIPPING_THRESHOLD_CENTS / 100).toFixed(0);

  return (
    <div className="bg-primary text-on-primary text-center py-2.5 font-sans text-[10px] uppercase tracking-[0.2em] font-medium">
      Livraison gratuite d&egrave;s {thresholdEuros} &euro; &mdash; Qualit&eacute; mus&eacute;e garantie
    </div>
  );
}
