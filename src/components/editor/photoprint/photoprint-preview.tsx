'use client';

import { usePhotoPrintStore, PRINT_SIZES, FRAME_OPTIONS } from '@/store/photoprint-store';
import Image from 'next/image';
import { X } from 'lucide-react';

export function PhotoPrintPreview() {
  const { imageUrl, size, frame, setImage } = usePhotoPrintStore();

  if (!imageUrl) {
    return null;
  }

  const sizeInfo = PRINT_SIZES.find((s) => s.id === size);
  const frameInfo = FRAME_OPTIONS.find((f) => f.id === frame);

  const handleChangeImage = () => {
    setImage(null, null);
  };

  const getFrameStyle = () => {
    switch (frame) {
      case 'black':
        return 'border-[16px] border-black';
      case 'white':
        return 'border-[16px] border-white shadow-lg';
      case 'oak':
        return 'border-[16px] border-amber-700';
      default:
        return '';
    }
  };

  const getAspectRatio = () => {
    switch (size) {
      case 'a4':
      case 'a3':
      case 'a2':
        return 'aspect-[297/420]'; // A-series aspect ratio
      case '50x70':
        return 'aspect-[50/70]';
      default:
        return 'aspect-[3/4]';
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Preview */}
      <div className="relative max-w-md mx-auto">
        <div className={`relative ${getAspectRatio()} ${getFrameStyle()} rounded-lg overflow-hidden shadow-2xl`}>
          <Image
            src={imageUrl}
            alt="Photo print preview"
            fill
            className="object-cover"
            unoptimized
          />

          {/* Change Image Button */}
          <button
            onClick={handleChangeImage}
            className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all backdrop-blur-sm z-10"
            title="Change image"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Outer shadow for depth */}
        {frame !== 'none' && (
          <div className="absolute inset-0 rounded-lg shadow-2xl pointer-events-none"></div>
        )}
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
          <span className="text-sm text-gray-600">Frame:</span>
          <span className="text-sm font-medium text-gray-900">{frameInfo?.name}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Paper:</span>
          <span className="text-sm font-medium text-gray-900">Museum-Quality Archival</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Finish:</span>
          <span className="text-sm font-medium text-gray-900">Matte</span>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">What's Included:</h4>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>✓ Museum-quality giclée print on archival paper</li>
          {frame !== 'none' && <li>✓ Handcrafted {frameInfo?.description} frame</li>}
          {frame !== 'none' && <li>✓ Ready to hang with mounting hardware</li>}
          <li>✓ Protective packaging for safe delivery</li>
          <li>✓ Made in Germany with premium materials</li>
        </ul>
      </div>

      {/* Tips */}
      <div className="bg-gray-50 rounded-lg p-4 max-w-md mx-auto">
        <h4 className="text-sm font-medium text-gray-700 mb-2">💡 Pro Tips:</h4>
        <ul className="text-xs text-gray-600 space-y-1.5">
          <li>• High-resolution images (at least 2000px) produce the best results</li>
          <li>• Images will be printed to fill the selected size</li>
          <li>• Framed prints come ready to hang</li>
          <li>• {frame === 'none' ? 'Add a frame for a complete ready-to-hang solution' : `${frameInfo?.name} frame complements most interiors`}</li>
        </ul>
      </div>
    </div>
  );
}
