import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { FREE_SHIPPING_THRESHOLD_CENTS } from "@/lib/shipping-config";

/**
 * Merge Tailwind CSS classes with proper precedence
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format integer cents to a localized currency string.
 */
export function formatPrice(amountCents: number, currency: string = 'EUR'): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency,
  }).format(amountCents / 100);
}

/**
 * Format date to localized string
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
}

/**
 * Format date and time
 */
export function formatDateTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
}

/**
 * Generate unique ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

/**
 * Slugify a string
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

/**
 * Truncate text to a specific length
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length).trim() + '...';
}

/**
 * Calculate average rating
 */
export function calculateAverageRating(reviews: Array<{ rating: number }>): number {
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Calculate discount percentage
 */
export function calculateDiscountPercentage(originalPrice: number, discountedPrice: number): number {
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
}

/**
 * Get initials from name
 */
export function getInitials(name: string): string {
  const parts = name.split(' ');
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Check if device is mobile
 */
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
}

/**
 * Generate order number
 */
export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `MOM-${timestamp}-${random}`;
}

/**
 * Calculate shipping cost based on country and total
 */
export function calculateShippingCost(country: string, totalCents: number): number {
  // Free shipping over threshold
  if (totalCents >= FREE_SHIPPING_THRESHOLD_CENTS) return 0;

  // EU countries
  const euCountries = ['DE', 'AT', 'FR', 'BE', 'NL', 'IT', 'ES', 'PT', 'PL', 'CZ', 'DK', 'SE'];
  if (euCountries.includes(country)) return 495;

  // Switzerland
  if (country === 'CH') return 995;

  // UK
  if (country === 'GB') return 795;

  // Rest of world
  return 1495;
}

/**
 * Calculate tax based on country
 */
export const DESTINATION_VAT_RATES: Record<string, number> = {
  DE: 0.19,
  FR: 0.20,
  AT: 0.20,
  NL: 0.21,
  IT: 0.22,
  BE: 0.21,
};

/** VAT mode: 'franchise_en_base' = 0 tax (micro-entreprise), 'standard' = destination rates */
export type VatMode = 'franchise_en_base' | 'standard';

export function getVatMode(): VatMode {
  return (process.env.NEXT_PUBLIC_VAT_MODE as VatMode) || 'franchise_en_base';
}

/** Legal mention required under franchise en base de TVA */
export const VAT_LEGAL_MENTION = 'TVA non applicable, article 293 B du CGI';

export function calculateTax(subtotalCents: number, country: string): number {
  if (getVatMode() === 'franchise_en_base') return 0;
  const rate = DESTINATION_VAT_RATES[country.toUpperCase()] ?? 0;
  return Math.round(subtotalCents * rate);
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
