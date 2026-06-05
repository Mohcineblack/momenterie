'use client';

import { useState } from 'react';
import { Frame } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface Variant {
  id: number;
  name: string;
  sku: string;
  size: string | null;
  material: string | null;
  color: string | null;
  priceModifier: number;
}

interface FrameUpsellProps {
  variants: Variant[];
  selectedVariant: Variant | null;
  basePrice: number;
  onVariantChange: (variant: Variant) => void;
  onFrameColorChange?: (color: string) => void;
}

const FRAME_COLORS = [
  { id: 'black', label: 'Noir', hex: '#1a1a1a' },
  { id: 'oak', label: 'Nature', hex: '#c4a776' },
  { id: 'white', label: 'Blanc', hex: '#f5f5f5' },
];

export function FrameUpsell({
  variants,
  selectedVariant,
  basePrice,
  onVariantChange,
  onFrameColorChange,
}: FrameUpsellProps) {
  const [frameColor, setFrameColor] = useState('black');

  const isFramed = selectedVariant?.material === 'Framed';
  const currentSize = selectedVariant?.size;

  // Find the matching framed/poster variant for the current size
  const framedVariant = variants.find(
    (v) => v.material === 'Framed' && v.size === currentSize
  );
  const posterVariant = variants.find(
    (v) => v.material === 'Poster' && v.size === currentSize
  );

  if (!framedVariant || !posterVariant) return null;

  const framedPrice = basePrice + framedVariant.priceModifier;
  const priceDifference = framedVariant.priceModifier - (selectedVariant?.priceModifier ?? 0);

  function handleToggleFrame() {
    if (isFramed) {
      onVariantChange(posterVariant!);
    } else {
      onVariantChange(framedVariant!);
      onFrameColorChange?.(frameColor);
    }
  }

  function handleColorChange(color: string) {
    setFrameColor(color);
    onFrameColorChange?.(color);
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4 space-y-3">
      <button
        onClick={handleToggleFrame}
        className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-colors ${
          isFramed
            ? 'border-gray-900 bg-gray-50'
            : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        <Frame className={`w-5 h-5 ${isFramed ? 'text-gray-900' : 'text-gray-400'}`} />
        <div className="flex-1 text-left">
          <p className="font-medium text-gray-900">Ajouter un cadre</p>
          <p className="text-xs text-gray-500">Cadre pin FSC, vitrage acrylique anti-UV</p>
        </div>
        <span className="text-sm font-medium text-gray-700">
          {!isFramed && '+'}{formatPrice(priceDifference > 0 ? priceDifference : framedVariant.priceModifier - posterVariant.priceModifier)}
        </span>
      </button>

      {isFramed && (
        <div className="pl-3 space-y-2">
          <p className="text-sm font-medium text-gray-700">Couleur du cadre</p>
          <div className="flex gap-3">
            {FRAME_COLORS.map((color) => (
              <button
                key={color.id}
                onClick={() => handleColorChange(color.id)}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg border-2 transition-colors ${
                  frameColor === color.id ? 'border-gray-900' : 'border-transparent hover:border-gray-200'
                }`}
              >
                <div
                  className="w-8 h-8 rounded-full border border-gray-300"
                  style={{ backgroundColor: color.hex }}
                />
                <span className="text-xs text-gray-600">{color.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
