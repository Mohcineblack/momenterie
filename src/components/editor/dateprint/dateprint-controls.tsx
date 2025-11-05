'use client';

import { useDatePrintStore, dateStyles } from '@/store/dateprint-store';
import { Calendar as CalendarIcon, Type, Palette } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface DatePrintControlsProps {
  product: any;
  selectedVariant: any;
  onVariantChange: (variant: any) => void;
}

export function DatePrintControls({
  product,
  selectedVariant,
  onVariantChange,
}: DatePrintControlsProps) {
  const { date, title, subtitle, style, setDate, setTitle, setSubtitle, setStyle } =
    useDatePrintStore();

  return (
    <div className="space-y-6">
      {/* Date Selection */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <CalendarIcon className="w-5 h-5" />
          Special Date
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Choose the date you want to commemorate
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

      {/* Text Customization */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Type className="w-5 h-5" />
          Text
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Our Wedding Day"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              maxLength={50}
            />
            <p className="text-xs text-gray-500 mt-1">
              {title.length}/50 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subtitle (optional)
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="e.g., The day we said I do"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              maxLength={100}
            />
            <p className="text-xs text-gray-500 mt-1">
              {subtitle.length}/100 characters
            </p>
          </div>
        </div>
      </div>

      {/* Style Selection */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Palette className="w-5 h-5" />
          Design Style
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {dateStyles.map((styleOption) => {
            const isSelected = style.id === styleOption.id;
            return (
              <button
                key={styleOption.id}
                onClick={() => setStyle(styleOption)}
                className={`relative p-4 rounded-lg border-2 transition-all ${
                  isSelected
                    ? 'border-gray-900 ring-2 ring-gray-900 ring-offset-2'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div
                  className="w-full h-20 rounded mb-3 flex items-center justify-center"
                  style={{
                    backgroundColor: styleOption.backgroundColor,
                    color: styleOption.textColor,
                  }}
                >
                  <div className="text-center">
                    <div className="text-xs font-semibold">01</div>
                    <div className="text-2xl font-bold">JAN</div>
                    <div className="text-xs">2024</div>
                  </div>
                </div>
                <div className="text-xs font-medium text-center">
                  {styleOption.name}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Variant Selection */}
      {product && product.variants && product.variants.length > 0 && (
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Size & Material</h3>
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
                      {variant.size && (
                        <div className="text-sm text-gray-600">{variant.size}</div>
                      )}
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
    </div>
  );
}
