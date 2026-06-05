'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useCartStore } from '@/store/cart-store';
import { useState } from 'react';
import { NavigationProgress } from './navigation-progress';

export function Header() {
  const pathname = usePathname();
  const { getTotalItems, openCart } = useCartStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const cartItemsCount = getTotalItems();

  const navigation = [
    { name: 'City Maps', href: '/collections/city-maps' },
    { name: 'Star Maps', href: '/collections/star-maps' },
    { name: 'Id\u00e9es cadeaux', href: '/occasions' },
    { name: 'Collections', href: '/collections/all' },
  ];

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/95 backdrop-blur border-b border-outline-variant">
      <div className="flex justify-between items-center px-6 md:px-[48px] py-4 max-w-[1280px] mx-auto h-[72px]">
        {/* Brand */}
        <Link href="/" className="flex items-center">
          <span className="font-serif text-2xl font-semibold tracking-tight italic text-primary">Momenterie</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-8">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`font-sans text-[11px] uppercase tracking-[0.15em] font-medium transition-colors ${
                pathname === item.href ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-6 font-sans text-[11px] uppercase tracking-[0.15em] font-medium text-primary">
          <Link href="/search" className="hover:text-secondary transition-colors hidden md:block">
            Search
          </Link>
          <button onClick={openCart} className="hover:text-secondary transition-colors relative">
            Cart ({cartItemsCount})
          </button>
          <Link href="/account" className="hover:text-secondary transition-colors hidden md:block">
            Account
          </Link>
          <button
            className="md:hidden text-on-surface-variant hover:text-primary transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5 stroke-[1.5]" /> : <Menu className="w-5 h-5 stroke-[1.5]" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-outline-variant bg-surface px-6 py-6 space-y-4">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block font-sans text-[11px] uppercase tracking-[0.15em] font-medium text-on-surface-variant hover:text-primary transition-colors"
            >
              {item.name}
            </Link>
          ))}
          <Link
            href="/account"
            onClick={() => setMobileMenuOpen(false)}
            className="block font-sans text-[11px] uppercase tracking-[0.15em] font-medium text-on-surface-variant hover:text-primary transition-colors"
          >
            Account
          </Link>
        </div>
      )}
      <NavigationProgress />
    </header>
  );
}
