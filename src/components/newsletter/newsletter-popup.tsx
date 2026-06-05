'use client';

import { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

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
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-surface border border-outline-variant p-10 shadow-2xl focus:outline-none">
          <Dialog.Close asChild>
            <button onClick={dismiss} className="absolute top-4 right-4 text-on-surface-variant hover:text-primary" aria-label="Fermer">
              <X className="w-5 h-5" />
            </button>
          </Dialog.Close>

          {couponCode ? (
            <div className="text-center space-y-6">
              <h2 className="font-serif text-2xl font-medium text-primary">Merci !</h2>
              <p className="font-sans text-sm text-on-surface-variant">Voici ton code de r&eacute;duction :</p>
              <div className="bg-surface-container-low border border-outline-variant px-4 py-3">
                <span className="font-sans text-lg font-bold tracking-wider text-primary">{couponCode}</span>
              </div>
              <p className="font-sans text-xs text-on-surface-variant">5% de r&eacute;duction sur ta premi&egrave;re commande.</p>
              <button onClick={dismiss} className="w-full bg-primary text-on-primary py-4 font-sans text-[11px] uppercase tracking-[0.2em] font-semibold hover:bg-secondary transition-colors">
                C&apos;est not&eacute; !
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center space-y-3">
                <h2 className="font-serif text-3xl font-light text-primary tracking-tight">
                  5% de <span className="italic">r&eacute;duction</span>
                </h2>
                <p className="font-serif italic text-sm text-on-surface-variant">
                  Inscris-toi pour recevoir ton code promo exclusif.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ton@email.com"
                  required
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant font-sans text-sm focus:outline-none focus:border-secondary transition-colors disabled:opacity-50"
                />
                {error && <p className="font-sans text-xs text-red-600">{error}</p>}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary text-on-primary py-4 font-sans text-[11px] uppercase tracking-[0.2em] font-semibold hover:bg-secondary transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Inscription...' : "S'abonner"}
                </button>
              </form>

              <button onClick={dismiss} className="w-full text-center font-sans text-xs text-on-surface-variant hover:text-primary uppercase tracking-wider">
                Non merci
              </button>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
