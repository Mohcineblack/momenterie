'use client';

import { useEffect, useRef } from 'react';
import { useStarMapStore } from '@/store/starmap-store';
import { calculateStarPositions } from '@/lib/astronomy';

export function StarMapPreview() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { location, date, time, title, subtitle, style, showConstellations, showGrid } =
    useStarMapStore();

  useEffect(() => {
    if (!canvasRef.current || !location) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Calculate map height (70% of total)
    const mapHeight = height * 0.7;
    const textHeight = height * 0.3;

    // Clear canvas
    ctx.fillStyle = style.colors.background;
    ctx.fillRect(0, 0, width, height);

    try {
      // Combine date and time
      const [hours, minutes] = time.split(':').map(Number);
      const dateTime = new Date(date);
      dateTime.setHours(hours, minutes, 0, 0);

      // Calculate star positions
      const stars = calculateStarPositions(
        dateTime,
        location.lat,
        location.lng,
        width,
        mapHeight
      );

      // Draw grid if enabled
      if (showGrid) {
        ctx.save();
        ctx.strokeStyle = style.colors.constellation;
        ctx.globalAlpha = 0.1;
        ctx.lineWidth = 1;

        for (let x = 0; x <= width; x += width / 8) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, mapHeight);
          ctx.stroke();
        }

        for (let y = 0; y <= mapHeight; y += mapHeight / 6) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }

        ctx.restore();
      }

      // Draw constellation lines if enabled
      if (showConstellations && stars.length > 0) {
        ctx.save();
        ctx.strokeStyle = style.colors.constellation;
        ctx.globalAlpha = 0.3;
        ctx.lineWidth = 1;

        for (let i = 0; i < stars.length; i++) {
          for (let j = i + 1; j < stars.length; j++) {
            if (stars[i].constellation === stars[j].constellation) {
              const dx = stars[j].x - stars[i].x;
              const dy = stars[j].y - stars[i].y;
              const distance = Math.sqrt(dx * dx + dy * dy);

              if (distance < 120) {
                ctx.beginPath();
                ctx.moveTo(stars[i].x, stars[i].y);
                ctx.lineTo(stars[j].x, stars[j].y);
                ctx.stroke();
              }
            }
          }
        }

        ctx.restore();
      }

      // Draw stars
      stars.forEach((star) => {
        const radius = star.magnitude;

        // Glow effect
        const gradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, radius * 2);
        gradient.addColorStop(0, style.colors.stars);
        gradient.addColorStop(0.5, style.colors.stars + '80');
        gradient.addColorStop(1, style.colors.stars + '00');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(star.x, star.y, radius * 2, 0, Math.PI * 2);
        ctx.fill();

        // Star center
        ctx.fillStyle = style.colors.stars;
        ctx.beginPath();
        ctx.arc(star.x, star.y, radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw text section
      ctx.fillStyle = style.colors.text;
      ctx.textAlign = 'center';

      // Title
      if (title) {
        ctx.font = 'bold 36px serif';
        ctx.fillText(title, width / 2, mapHeight + 60);
      }

      // Subtitle
      if (subtitle) {
        ctx.font = '20px serif';
        ctx.globalAlpha = 0.8;
        ctx.fillText(subtitle, width / 2, mapHeight + 95);
        ctx.globalAlpha = 1;
      }

      // Date and location
      ctx.font = '16px sans-serif';
      ctx.globalAlpha = 0.6;
      const dateStr = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      ctx.fillText(`${dateStr} at ${time}`, width / 2, mapHeight + 130);
      ctx.fillText(location.placeName, width / 2, mapHeight + 150);

      // Coordinates
      ctx.font = '12px monospace';
      ctx.globalAlpha = 0.4;
      ctx.fillText(
        `${location.lat.toFixed(4)}° N, ${location.lng.toFixed(4)}° E`,
        width / 2,
        mapHeight + 175
      );
      ctx.globalAlpha = 1;
    } catch (error) {
      console.error('Error rendering preview:', error);
    }
  }, [location, date, time, title, subtitle, style, showConstellations, showGrid]);

  if (!location) {
    return (
      <div
        className="w-full rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center max-w-md mx-auto"
        style={{
          aspectRatio: '2/3',
          backgroundColor: '#f9f9f9',
        }}
      >
        <div className="text-center p-8">
          <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No data yet</h3>
          <p className="text-sm text-gray-500">
            Configure your star map to see the preview
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative max-w-md mx-auto">
      <canvas
        ref={canvasRef}
        width={600}
        height={900}
        className="w-full rounded-lg shadow-2xl"
        style={{
          backgroundColor: style.colors.background,
        }}
      />

      {/* Frame effect */}
      <div className="absolute inset-0 rounded-lg shadow-2xl pointer-events-none border-8 border-white"></div>
    </div>
  );
}
