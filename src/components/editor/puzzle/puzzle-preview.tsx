'use client';

import { usePuzzleStore, PUZZLE_SIZES } from '@/store/puzzle-store';
import Image from 'next/image';
import { X } from 'lucide-react';

export function PuzzlePreview() {
  const { imageUrl, pieces, finish, setImage, setIsUploading } = usePuzzleStore();

  if (!imageUrl) {
    return null;
  }

  const sizeInfo = PUZZLE_SIZES.find((s) => s.pieces === pieces);

  const handleChangeImage = () => {
    // Reset the image to allow uploading a new one
    setImage(null, null);
  };

  return (
    <div className="space-y-6">
      {/* Main Preview */}
      <div className="relative max-w-md mx-auto">
        {/* Puzzle Image */}
        <div
          className={`
            relative rounded-lg overflow-hidden shadow-2xl
            ${finish === 'glossy' ? 'shadow-xl' : 'shadow-md'}
          `}
          style={{
            aspectRatio: '4/3',
          }}
        >
          <Image
            src={imageUrl}
            alt="Puzzle preview"
            fill
            className={`object-cover ${finish === 'matte' ? 'saturate-95' : ''}`}
            unoptimized
          />

          {/* Glossy overlay effect */}
          {finish === 'glossy' && (
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none"></div>
          )}

          {/* Puzzle piece grid overlay (subtle) */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(0,0,0,0.02) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(0,0,0,0.02) 1px, transparent 1px)
              `,
              backgroundSize: pieces === 100
                ? '40px 40px'
                : pieces === 252
                ? '30px 30px'
                : pieces === 500
                ? '20px 20px'
                : '15px 15px',
            }}
          ></div>

          {/* Change Image Button */}
          <button
            onClick={handleChangeImage}
            className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all backdrop-blur-sm"
            title="Change image"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Shadow/Frame */}
        <div className="absolute inset-0 rounded-lg shadow-2xl pointer-events-none"></div>
      </div>

      {/* Details */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-3 max-w-md mx-auto">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Size:</span>
          <span className="text-sm font-medium text-gray-900">
            {sizeInfo?.name} ({sizeInfo?.description})
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Finish:</span>
          <span className="text-sm font-medium text-gray-900 capitalize">{finish}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Material:</span>
          <span className="text-sm font-medium text-gray-900">Premium Chipboard</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Includes:</span>
          <span className="text-sm font-medium text-gray-900">Reference Image & Gift Box</span>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">What's Included:</h4>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>✓ Your custom photo puzzle with {pieces} pieces</li>
          <li>✓ High-quality reference image card</li>
          <li>✓ Sturdy gift-ready box with your photo</li>
          <li>✓ Printed in Germany with eco-friendly materials</li>
        </ul>
      </div>

      {/* Tips */}
      <div className="bg-gray-50 rounded-lg p-4 max-w-md mx-auto">
        <h4 className="text-sm font-medium text-gray-700 mb-2">💡 Pro Tips:</h4>
        <ul className="text-xs text-gray-600 space-y-1.5">
          <li>• Not happy with the image? Click the × button to upload a different one</li>
          <li>• Images with more detail make for more challenging puzzles</li>
          <li>• {finish === 'glossy' ? 'Glossy finish enhances colors' : 'Matte finish reduces glare'}</li>
        </ul>
      </div>
    </div>
  );
}
