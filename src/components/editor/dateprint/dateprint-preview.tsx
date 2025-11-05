'use client';

import { useDatePrintStore } from '@/store/dateprint-store';
import { format } from 'date-fns';

export function DatePrintPreview() {
  const { date, title, subtitle, style } = useDatePrintStore();

  return (
    <div className="bg-white rounded-xl p-8 border border-gray-200">
      <h3 className="text-lg font-semibold mb-6">Preview</h3>

      {/* Date Print Preview */}
      <div
        className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-lg flex flex-col items-center justify-center p-12 text-center"
        style={{
          backgroundColor: style.backgroundColor,
          color: style.textColor,
          fontFamily: style.fontFamily,
        }}
      >
        {date ? (
          <>
            {/* Day */}
            <div className="text-8xl font-bold leading-none mb-2">
              {format(date, 'd')}
            </div>

            {/* Month */}
            <div className="text-4xl font-semibold uppercase tracking-wider mb-8">
              {format(date, 'MMMM')}
            </div>

            {/* Year */}
            <div className="text-3xl font-light mb-8">{format(date, 'yyyy')}</div>

            {/* Divider */}
            <div
              className="w-24 h-px mb-8"
              style={{ backgroundColor: style.textColor, opacity: 0.3 }}
            />

            {/* Title */}
            {title && (
              <div className="text-2xl font-semibold mb-3 max-w-full break-words">
                {title}
              </div>
            )}

            {/* Subtitle */}
            {subtitle && (
              <div className="text-lg font-light opacity-80 max-w-full break-words">
                {subtitle}
              </div>
            )}
          </>
        ) : (
          <div className="text-center opacity-40">
            <div className="text-6xl font-bold mb-4">01</div>
            <div className="text-3xl font-semibold uppercase tracking-wider mb-6">
              January
            </div>
            <div className="text-2xl font-light mb-6">2024</div>
            <div className="text-lg">Select a date to preview</div>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="mt-6 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Style:</span>
          <span className="font-medium">{style.name}</span>
        </div>
        {date && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Full Date:</span>
            <span className="font-medium">{format(date, 'PPP')}</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="mt-6 pt-6 border-t">
        <div className="text-xs text-gray-600">
          Your date print will be professionally printed on premium paper with vibrant,
          long-lasting colors. Perfect for framing and displaying your special moments.
        </div>
      </div>
    </div>
  );
}
