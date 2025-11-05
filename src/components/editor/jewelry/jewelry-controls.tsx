'use client';

import { useState } from 'react';
import { useJewelryStore } from '@/store/jewelry-store';
import { Calendar as CalendarIcon, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { LocationSearch } from '@/components/editor/location-search';

interface JewelryControlsProps {
  product: any;
  selectedVariant: any;
  onVariantChange: (variant: any) => void;
}

export function JewelryControls({
  product,
  selectedVariant,
  onVariantChange,
}: JewelryControlsProps) {
  const { location, date, setLocation, setDate, setCoordinates } = useJewelryStore();
  const [isLocationOpen, setIsLocationOpen] = useState(false);

  const handleLocationSelect = (place: any) => {
    setLocation(place.display_name);
    setCoordinates(parseFloat(place.lat), parseFloat(place.lon));
    setIsLocationOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Date Selection */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <CalendarIcon className="w-5 h-5" />
          Special Date
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Select the date for your star map engraving
        </p>
        <Popover>
          <PopoverTrigger asChild>
            <button className="w-full px-4 py-3 border border-gray-300 rounded-lg text-left hover:border-gray-400 transition-colors">
              {date ? format(date, 'PPP') : 'Select a date'}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date || undefined}
              onSelect={(newDate) => setDate(newDate || null)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Location Selection */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Location
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Where were you on this special date?
        </p>
        <Popover open={isLocationOpen} onOpenChange={setIsLocationOpen}>
          <PopoverTrigger asChild>
            <button className="w-full px-4 py-3 border border-gray-300 rounded-lg text-left hover:border-gray-400 transition-colors">
              {location || 'Search for a location...'}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-[400px] p-0" align="start">
            <LocationSearch onSelect={handleLocationSelect} />
          </PopoverContent>
        </Popover>
      </div>

      {/* Variant Selection */}
      {product && product.variants && product.variants.length > 0 && (
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Material & Length</h3>
          <div className="space-y-3">
            {product.variants.map((variant: any) => {
              const isSelected = selectedVariant?.id === variant.id;
              const price = product.basePrice + variant.priceModifier;

              return (
                <button
                  key={variant.id}
                  onClick={() => onVariantChange(variant)}
                  className={`w-full px-4 py-3 rounded-lg border-2 text-left transition-all ${
                    isSelected
                      ? 'border-gray-900 bg-gray-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{variant.name}</div>
                      <div className="text-sm text-gray-600">
                        {variant.material}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">€{price.toFixed(2)}</div>
                      {variant.priceModifier !== 0 && (
                        <div className="text-xs text-gray-500">
                          {variant.priceModifier > 0 ? '+' : ''}
                          €{variant.priceModifier.toFixed(2)}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Info Card */}
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
        <h4 className="font-semibold text-blue-900 mb-2">About Star Map Jewelry</h4>
        <p className="text-sm text-blue-800">
          Each piece features the exact constellation pattern from your chosen date and
          location, beautifully engraved on a high-quality pendant. A unique and
          meaningful gift to treasure forever.
        </p>
      </div>
    </div>
  );
}
