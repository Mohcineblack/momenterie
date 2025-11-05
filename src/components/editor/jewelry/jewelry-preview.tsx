'use client';

import { useJewelryStore } from '@/store/jewelry-store';
import { format } from 'date-fns';
import Image from 'next/image';

export function JewelryPreview() {
  const { location, date } = useJewelryStore();

  return (
    <div className="bg-white rounded-xl p-8 border border-gray-200">
      <h3 className="text-lg font-semibold mb-6">Preview</h3>

      {/* Jewelry Image */}
      <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-6">
        <Image
          src="/images/products/necklace-1.jpg"
          alt="Star Map Necklace Preview"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Overlay Text Preview */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          {date && (
            <div className="text-sm font-medium mb-1">
              {format(date, 'MMMM d, yyyy')}
            </div>
          )}
          {location && (
            <div className="text-xs opacity-90">
              {location}
            </div>
          )}
        </div>
      </div>

      {/* Customization Details */}
      <div className="space-y-4">
        <div>
          <div className="text-sm font-medium text-gray-700 mb-1">Date</div>
          <div className="text-sm text-gray-900">
            {date ? format(date, 'PPP') : 'Not selected'}
          </div>
        </div>

        <div>
          <div className="text-sm font-medium text-gray-700 mb-1">Location</div>
          <div className="text-sm text-gray-900">
            {location || 'Not selected'}
          </div>
        </div>

        {date && location && (
          <div className="pt-4 border-t">
            <div className="text-xs text-gray-600">
              The star map will show the exact constellation pattern as seen from{' '}
              <span className="font-medium">{location}</span> on{' '}
              <span className="font-medium">{format(date, 'MMMM d, yyyy')}</span>.
            </div>
          </div>
        )}
      </div>

      {/* Quality Badge */}
      <div className="mt-6 pt-6 border-t">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
            <span className="text-2xl">✨</span>
          </div>
          <div>
            <div className="text-sm font-medium">Premium Quality</div>
            <div className="text-xs text-gray-600">
              Hypoallergenic & tarnish-resistant
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
