'use client';

import { useEffect, useRef } from 'react';
import { useStarMapStore } from '@/store/starmap-store';
import { calculateStarPositions } from '@/lib/astronomy';

export function StarMapCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { location, date, time, style, showConstellations, showGrid } = useStarMapStore();

  useEffect(() => {
    if (!canvasRef.current || !location) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const width = canvas.width;
    const height = canvas.height;

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
        height
      );

      // Draw coordinate grid if enabled
      if (showGrid) {
        ctx.strokeStyle = style.colors.constellation;
        ctx.globalAlpha = 0.1;
        ctx.lineWidth = 1;

        // Vertical lines
        for (let x = 0; x <= width; x += width / 8) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }

        // Horizontal lines
        for (let y = 0; y <= height; y += height / 8) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }

        ctx.globalAlpha = 1;
      }

      // Draw constellation lines if enabled
      if (showConstellations && stars.length > 0) {
        ctx.strokeStyle = style.colors.constellation;
        ctx.globalAlpha = 0.3;
        ctx.lineWidth = 1;

        // Draw simple lines connecting nearby stars of same constellation
        for (let i = 0; i < stars.length; i++) {
          for (let j = i + 1; j < stars.length; j++) {
            if (stars[i].constellation === stars[j].constellation) {
              const dx = stars[j].x - stars[i].x;
              const dy = stars[j].y - stars[i].y;
              const distance = Math.sqrt(dx * dx + dy * dy);

              // Only connect if stars are reasonably close
              if (distance < 150) {
                ctx.beginPath();
                ctx.moveTo(stars[i].x, stars[i].y);
                ctx.lineTo(stars[j].x, stars[j].y);
                ctx.stroke();
              }
            }
          }
        }

        ctx.globalAlpha = 1;
      }

      // Draw stars
      ctx.fillStyle = style.colors.stars;
      stars.forEach((star) => {
        // Star size based on magnitude
        const radius = star.magnitude;

        // Draw star with a glow effect
        const gradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, radius * 2);
        gradient.addColorStop(0, style.colors.stars);
        gradient.addColorStop(0.5, style.colors.stars + '80'); // 50% opacity
        gradient.addColorStop(1, style.colors.stars + '00'); // 0% opacity

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(star.x, star.y, radius * 2, 0, Math.PI * 2);
        ctx.fill();

        // Draw solid star center
        ctx.fillStyle = style.colors.stars;
        ctx.beginPath();
        ctx.arc(star.x, star.y, radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw star labels for bright stars
      ctx.fillStyle = style.colors.text;
      ctx.font = '10px sans-serif';
      ctx.globalAlpha = 0.6;
      stars
        .filter((star) => star.magnitude > 3)
        .slice(0, 20) // Only label brightest stars
        .forEach((star) => {
          ctx.fillText(star.name, star.x + 5, star.y - 5);
        });
      ctx.globalAlpha = 1;
    } catch (error) {
      console.error('Error rendering star map:', error);

      // Show error message on canvas
      ctx.fillStyle = style.colors.text;
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Error rendering star map', width / 2, height / 2);
      ctx.font = '12px sans-serif';
      ctx.fillText('Please check your location and date settings', width / 2, height / 2 + 20);
    }
  }, [location, date, time, style, showConstellations, showGrid]);

  if (!location) {
    return (
      <div
        className="w-full rounded-lg flex items-center justify-center"
        style={{
          height: '400px',
          backgroundColor: '#0A1128',
        }}
      >
        <div className="text-center text-white/60">
          <svg
            className="w-16 h-16 mx-auto mb-4 opacity-50"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
          </svg>
          <p className="text-lg font-medium">No location selected</p>
          <p className="text-sm mt-2">Enter a location to see the night sky</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="w-full rounded-lg"
        style={{
          backgroundColor: style.colors.background,
          maxHeight: '400px',
          objectFit: 'contain',
        }}
      />

      {/* Info overlay */}
      <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm">
        <p className="font-medium">{location.placeName}</p>
        <p className="text-xs opacity-75">
          {date.toLocaleDateString()} at {time}
        </p>
      </div>
    </div>
  );
}
