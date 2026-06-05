'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Package, MapPin, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const ICONS: Record<string, any> = { User, Package, MapPin, Settings };

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

export function AccountNavClient({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {items.map((item) => {
        const Icon = ICONS[item.icon] || User;
        const active = pathname === item.href || (item.href !== '/account' && pathname.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              active ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            )}
          >
            <Icon className="w-4 h-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
