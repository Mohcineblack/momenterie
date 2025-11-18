'use client';

import { useState } from 'react';
import { formatPrice } from '@/lib/utils';
import { Check } from 'lucide-react';

interface Variant {
  id: number;
  name: string;
  sku: string;
  priceModifier: number;
  size?: string | null;
  material?: string | null;
  color?: string | null;
  stock: number;
}

interface VariantSelectorProps {
  variants: Variant[];
  basePrice: number;
  onVariantChange?: (variant: Variant) => void;
}

export function VariantSelector({
  variants,
  basePrice,
  onVariantChange,
}: VariantSelectorProps) {
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(
    variants[0]?.id || null
  );

  const selectedVariant = variants.find((v) => v.id === selectedVariantId);
  const totalPrice = basePrice + (selectedVariant?.priceModifier || 0);

  const handleVariantSelect = (variant: Variant) => {
    setSelectedVariantId(variant.id);
    onVariantChange?.(variant);
  };

  // Group variants by type (size, material, color)
  const groupedVariants: Record<string, Variant[]> = {};

  variants.forEach((variant) => {
    if (variant.size) {
      if (!groupedVariants['Size']) groupedVariants['Size'] = [];
      groupedVariants['Size'].push(variant);
    }
    if (variant.material) {
      if (!groupedVariants['Material']) groupedVariants['Material'] = [];
      groupedVariants['Material'].push(variant);
    }
    if (variant.color) {
      if (!groupedVariants['Color']) groupedVariants['Color'] = [];
      groupedVariants['Color'].push(variant);
    }
  });

  // If variants don't have specific attributes, show as list
  const hasGroupedVariants = Object.keys(groupedVariants).length > 0;

  if (!hasGroupedVariants) {
    return (
      <div>
        <h3 className="font-semibold mb-3">Select Option</h3>
        <div className="grid gap-3">
          {variants.map((variant) => {
            const price = basePrice + variant.priceModifier;
            const isSelected = selectedVariantId === variant.id;

            return (
              <button
                key={variant.id}
                onClick={() => handleVariantSelect(variant)}
                className={`relative flex items-center justify-between p-4 border-2 rounded-lg transition-all ${
                  isSelected
                    ? 'border-gray-900 bg-gray-50'
                    : 'border-gray-300 hover:border-gray-400'
                } ${variant.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={variant.stock === 0}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? 'border-gray-900 bg-gray-900' : 'border-gray-300'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <div className="text-left">
                    <div className="font-medium">{variant.name}</div>
                    {variant.stock === 0 && (
                      <div className="text-xs text-red-600">Out of stock</div>
                    )}
                  </div>
                </div>
                <div className="font-semibold">{formatPrice(price)}</div>
              </button>
            );
          })}
        </div>

        {selectedVariant && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Total Price:</span>
              <span className="text-2xl font-bold text-gray-900">
                {formatPrice(totalPrice)}
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Render grouped variants (size, material, color)
  return (
    <div className="space-y-6">
      {Object.entries(groupedVariants).map(([groupName, groupVariants]) => {
        // Get unique values for this group
        const uniqueValues = Array.from(
          new Set(
            groupVariants.map((v) => {
              if (groupName === 'Size') return v.size;
              if (groupName === 'Material') return v.material;
              if (groupName === 'Color') return v.color;
              return null;
            })
          )
        ).filter(Boolean);

        return (
          <div key={groupName}>
            <h3 className="font-semibold mb-3">{groupName}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {uniqueValues.map((value) => {
                const variant = groupVariants.find((v) => {
                  if (groupName === 'Size') return v.size === value;
                  if (groupName === 'Material') return v.material === value;
                  if (groupName === 'Color') return v.color === value;
                  return false;
                });

                if (!variant) return null;

                const isSelected = selectedVariantId === variant.id;
                const price = basePrice + variant.priceModifier;

                return (
                  <button
                    key={variant.id}
                    onClick={() => handleVariantSelect(variant)}
                    className={`relative p-3 border-2 rounded-lg transition-all text-left ${
                      isSelected
                        ? 'border-gray-900 bg-gray-50'
                        : 'border-gray-300 hover:border-gray-400'
                    } ${variant.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={variant.stock === 0}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2">
                        <div className="w-5 h-5 rounded-full bg-gray-900 flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      </div>
                    )}
                    <div className="font-medium">{value}</div>
                    {variant.priceModifier !== 0 && (
                      <div className="text-sm text-gray-600 mt-1">
                        +{formatPrice(variant.priceModifier)}
                      </div>
                    )}
                    {variant.stock === 0 && (
                      <div className="text-xs text-red-600 mt-1">Out of stock</div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {selectedVariant && (
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Total Price:</span>
            <span className="text-2xl font-bold text-gray-900">
              {formatPrice(totalPrice)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
