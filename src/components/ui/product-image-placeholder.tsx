'use client';

import Image from 'next/image';
import { useState } from 'react';

export function ProductImagePlaceholder({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full h-full bg-surface-container flex items-center justify-center ${className}`}>
      <div className="flex flex-col items-center gap-3 text-surface-container-highest">
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span className="font-sans text-[9px] uppercase tracking-[0.2em] font-medium">No image</span>
      </div>
    </div>
  );
}

interface ProductImageProps {
  src: string | undefined | null;
  alt: string;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  className?: string;
}

export function ProductImage({ src, alt, fill = true, sizes, priority, className = '' }: ProductImageProps) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return <ProductImagePlaceholder />;
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      sizes={sizes}
      priority={priority}
      className={className}
      onError={() => setError(true)}
    />
  );
}
