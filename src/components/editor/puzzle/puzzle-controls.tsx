'use client';

import { usePuzzleStore, PUZZLE_SIZES, FINISHES } from '@/store/puzzle-store';
import { Puzzle, Sparkles } from 'lucide-react';

export function PuzzleControls() {
  const { pieces, finish, setPieces, setFinish, imageUrl } = usePuzzleStore();

  return (
    <div className="space-y-6">
      {/* Image Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Photo Status
        </label>
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

      {/* Puzzle Size */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          <Puzzle className="inline w-4 h-4 mr-1" />
          Puzzle Size
        </label>
        <div className="space-y-2">
          {PUZZLE_SIZES.map((size) => (
            <button
              key={size.pieces}
              onClick={() => setPieces(size.pieces)}
              disabled={!imageUrl}
              className={`
                w-full p-4 rounded-lg border-2 text-left transition-all
                ${pieces === size.pieces
                  ? 'border-gray-900 bg-gray-50 ring-2 ring-gray-900 ring-opacity-20'
                  : 'border-gray-200 hover:border-gray-300'
                }
                ${!imageUrl ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{size.name}</p>
                  <p className="text-sm text-gray-600 mt-0.5">{size.description}</p>
                </div>
                {size.priceModifier > 0 && (
                  <span className="text-sm font-medium text-gray-700">
                    +€{size.priceModifier}
                  </span>
                )}
              </div>

              {/* Selected indicator */}
              {pieces === size.pieces && (
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

      {/* Finish */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          <Sparkles className="inline w-4 h-4 mr-1" />
          Finish
        </label>
        <div className="grid grid-cols-2 gap-3">
          {FINISHES.map((finishOption) => (
            <button
              key={finishOption.id}
              onClick={() => setFinish(finishOption.id as 'glossy' | 'matte')}
              disabled={!imageUrl}
              className={`
                relative p-4 rounded-lg border-2 text-center transition-all
                ${finish === finishOption.id
                  ? 'border-gray-900 bg-gray-50 ring-2 ring-gray-900 ring-opacity-20'
                  : 'border-gray-200 hover:border-gray-300'
                }
                ${!imageUrl ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <p className="font-semibold text-gray-900 text-sm mb-1">
                {finishOption.name}
              </p>
              <p className="text-xs text-gray-600">{finishOption.description}</p>

              {finishOption.priceModifier > 0 && (
                <p className="text-xs font-medium text-gray-700 mt-2">
                  +€{finishOption.priceModifier}
                </p>
              )}

              {/* Selected indicator */}
              {finish === finishOption.id && (
                <div className="absolute top-1 right-1 w-5 h-5 bg-gray-900 rounded-full flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-white"
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
        <h3 className="text-sm font-medium text-gray-700 mb-2">About Your Puzzle</h3>
        <ul className="text-xs text-gray-600 space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-gray-400">•</span>
            <span>Premium chipboard for durability</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-gray-400">•</span>
            <span>Precision-cut interlocking pieces</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-gray-400">•</span>
            <span>Vibrant, fade-resistant printing</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-gray-400">•</span>
            <span>Includes reference image</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-gray-400">•</span>
            <span>Comes in a sturdy gift box</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
