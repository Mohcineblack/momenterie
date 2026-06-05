import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full py-24 border-t border-outline-variant bg-surface-container-lowest text-on-surface mt-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-6 md:px-[48px] max-w-[1280px] mx-auto">
        <div className="col-span-1 flex flex-col gap-6">
          <span className="font-serif text-2xl font-semibold italic tracking-tight text-primary">Momenterie</span>
          <p className="font-serif italic text-sm text-on-surface-variant max-w-xs">
            Museum Quality Guaranteed.<br/>
            Personalized art that endures.
          </p>
        </div>

        <div className="col-span-1 flex flex-col gap-4">
          <h4 className="font-sans text-[10px] font-bold uppercase tracking-widest text-primary mb-2">Explorer</h4>
          <Link href="/collections/city-maps" className="font-sans text-sm text-on-surface-variant hover:text-primary transition-colors">City Maps</Link>
          <Link href="/collections/star-maps" className="font-sans text-sm text-on-surface-variant hover:text-primary transition-colors">Star Maps</Link>
          <Link href="/collections/all" className="font-sans text-sm text-on-surface-variant hover:text-primary transition-colors">Collections</Link>
          <Link href="/occasions" className="font-sans text-sm text-on-surface-variant hover:text-primary transition-colors">Id&eacute;es cadeaux</Link>
        </div>

        <div className="col-span-1 flex flex-col gap-4">
          <h4 className="font-sans text-[10px] font-bold uppercase tracking-widest text-primary mb-2">Support</h4>
          <Link href="/faq" className="font-sans text-sm text-on-surface-variant hover:text-primary transition-colors">FAQ</Link>
          <Link href="/legal/livraison" className="font-sans text-sm text-on-surface-variant hover:text-primary transition-colors">Livraison</Link>
          <Link href="/account/orders" className="font-sans text-sm text-on-surface-variant hover:text-primary transition-colors">Suivre ma commande</Link>
        </div>

        <div className="col-span-1 flex flex-col gap-4">
          <h4 className="font-sans text-[10px] font-bold uppercase tracking-widest text-primary mb-2">L&eacute;gal</h4>
          <Link href="/legal/mentions-legales" className="font-sans text-sm text-on-surface-variant hover:text-primary transition-colors">Mentions l&eacute;gales</Link>
          <Link href="/legal/cgv" className="font-sans text-sm text-on-surface-variant hover:text-primary transition-colors">CGV</Link>
          <Link href="/legal/confidentialite" className="font-sans text-sm text-on-surface-variant hover:text-primary transition-colors">Confidentialit&eacute;</Link>
          <Link href="/legal/retractation" className="font-sans text-sm text-on-surface-variant hover:text-primary transition-colors">R&eacute;tractation</Link>
        </div>
      </div>

      <div className="px-6 md:px-[48px] max-w-[1280px] mx-auto mt-16 pt-8 border-t border-outline-variant flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-[0.2em] font-medium text-on-surface-variant">
        <p>&copy; 2026 Momenterie. TVA non applicable, art. 293 B du CGI.</p>
        <div className="flex gap-8">
          <span>Instagram</span>
          <Link href="/legal/confidentialite">Privacy</Link>
          <Link href="/legal/cgv">Terms</Link>
        </div>
      </div>
    </footer>
  );
}
