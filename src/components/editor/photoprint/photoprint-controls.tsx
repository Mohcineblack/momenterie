'use client';

import { usePhotoPrintStore, PRINT_SIZES, FRAME_OPTIONS } from '@/store/photoprint-store';
import { Maximize2, Frame } from 'lucide-react';

export function PhotoPrintControls() {
  const { imageUrl, size, frame, setSize, setFrame } = usePhotoPrintStore();

  return (
    <div className="space-y-6">
      {/* Photo Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Photo Status</label>
        {imageUrl ? (
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm font-medium text-green-900 flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M5 13l4 4L19 7"></path>
              </svg>
              Photo uploaded
            </p>
          </div>
        ) : (
          <p className="text-sm text-gray-500 p-3 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            Upload a photo to get started
          </p>
        )}
      </div>

      {/* Print Size */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          <Maximize2 className="inline w-4 h-4 mr-1" />
          Print Size
        </label>
        <div className="space-y-2">
          {PRINT_SIZES.map((sizeOption) => (
            <button
              key={sizeOption.id}
              onClick={() => setSize(sizeOption.id)}
              disabled={!imageUrl}
              className={`
                w-full p-4 rounded-lg border-2 text-left transition-all relative
                ${
                  size === sizeOption.id
                    ? 'border-gray-900 bg-gray-50 ring-2 ring-gray-900 ring-opacity-20'
                    : 'border-gray-200 hover:border-gray-300'
                }
                ${!imageUrl ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{sizeOption.name}</p>
                  <p className="text-sm text-gray-600 mt-0.5">{sizeOption.description}</p>
                </div>
                {sizeOption.priceModifier > 0 && (
                  <span className="text-sm font-medium text-gray-700">
                    +€{sizeOption.priceModifier}
                  </span>
                )}
              </div>

              {size === sizeOption.id && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Frame Options */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          <Frame className="inline w-4 h-4 mr-1" />
          Frame
        </label>
        <div className="space-y-2">
          {FRAME_OPTIONS.map((frameOption) => (
            <button
              key={frameOption.id}
              onClick={() => setFrame(frameOption.id)}
              disabled={!imageUrl}
              className={`
                w-full p-4 rounded-lg border-2 text-left transition-all relative
                ${
                  frame === frameOption.id
                    ? 'border-gray-900 bg-gray-50 ring-2 ring-gray-900 ring-opacity-20'
                    : 'border-gray-200 hover:border-gray-300'
                }
                ${!imageUrl ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{frameOption.name}</p>
                  <p className="text-sm text-gray-600 mt-0.5">{frameOption.description}</p>
                </div>
                {frameOption.priceModifier > 0 && (
                  <span className="text-sm font-medium text-gray-700">
                    +€{frameOption.priceModifier}
                  </span>
                )}
              </div>

              {frame === frameOption.id && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t pt-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Print Quality</h3>
        <ul className="text-xs text-gray-600 space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-gray-400">•</span>
            <span>Museum-quality giclée printing</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-gray-400">•</span>
            <span>Archival-quality, acid-free paper</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-gray-400">•</span>
            <span>Vibrant, fade-resistant colors</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-gray-400">•</span>
            <span>Handcrafted wooden frames</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
