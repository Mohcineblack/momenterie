'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, User, Search, Menu } from 'lucide-react';
import { useCartStore } from '@/store/cart-store';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export function Header() {
  const pathname = usePathname();
  const { getTotalItems, openCart } = useCartStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const cartItemsCount = getTotalItems();

  const navigation = [
    { name: 'City Maps', href: '/collections/city-maps' },
    { name: 'Star Maps', href: '/collections/star-maps' },
    { name: 'Puzzles', href: '/collections/puzzles' },
    { name: 'Jewelry', href: '/collections/jewelry' },
    { name: 'All Products', href: '/collections/all' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-gray-900">Momenterie</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-gray-900',
                  pathname === item.href
                    ? 'text-gray-900'
                    : 'text-gray-600'
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Link
              href="/search"
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </Link>

            <Link
              href="/account"
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Account"
            >
              <User className="h-5 w-5" />
            </Link>

            <button
              onClick={openCart}
              className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gray-900 text-xs text-white">
                  {cartItemsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 space-y-2 border-t">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'block px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                  pathname === item.href
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50'
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
