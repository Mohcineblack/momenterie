'use client';

import { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Mail, Gift } from 'lucide-react';

const POPUP_DISMISSED_KEY = 'momenterie_newsletter_dismissed';
const POPUP_DELAY_MS = 5000;

export function NewsletterPopup() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (localStorage.getItem(POPUP_DISMISSED_KEY)) return;

    const timer = setTimeout(() => setOpen(true), POPUP_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  function dismiss() {
    setOpen(false);
    localStorage.setItem(POPUP_DISMISSED_KEY, '1');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Erreur');

      setCouponCode(data.couponCode || null);
      localStorage.setItem(POPUP_DISMISSED_KEY, '1');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={(v) => { if (!v) dismiss(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-white rounded-2xl p-8 shadow-xl focus:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
          <Dialog.Close asChild>
            <button
              onClick={dismiss}
              className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 rounded-full"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </Dialog.Close>

          {couponCode ? (
            <div className="text-center space-y-4">
              <div className="mx-auto w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
                <Gift className="w-7 h-7 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Merci !</h2>
              <p className="text-gray-600">
                Voici ton code de réduction :
              </p>
              <div className="bg-gray-100 rounded-lg px-4 py-3">
                <span className="text-lg font-mono font-bold text-gray-900">{couponCode}</span>
              </div>
              <p className="text-sm text-gray-500">
                Utilise-le lors de ta prochaine commande pour bénéficier de 5% de réduction.
              </p>
              <button
                onClick={dismiss}
                className="w-full py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                C&apos;est noté !
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="text-center space-y-2">
                <div className="mx-auto w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center">
                  <Mail className="w-7 h-7 text-gray-900" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  5% de réduction sur ta première commande !
                </h2>
                <p className="text-gray-600 text-sm">
                  Inscris-toi à notre newsletter pour recevoir ton code promo exclusif.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ton@email.com"
                  required
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent disabled:opacity-50"
                />
                {error && <p className="text-red-600 text-sm">{error}</p>}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Inscription...' : "S'abonner"}
                </button>
              </form>

              <button
                onClick={dismiss}
                className="w-full text-center text-sm text-gray-500 hover:text-gray-700"
              >
                Non merci
              </button>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
