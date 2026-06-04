"use client";

import { useMemo } from "react";
import { useStarMapStore } from "@/store/starmap-store";
import { renderStarmapArtworkSvg } from "@/lib/render/starmap-artwork";
import type { StarmapSpec } from "@/lib/render/spec";

export function StarMapPreview() {
  const { location, date, time, title, subtitle, style, showConstellations, showGrid } =
    useStarMapStore();

  const svg = useMemo(() => {
    if (!location) return "";

    const spec: StarmapSpec = {
      productType: "starmap",
      location,
      datetimeUtc: toDateTimeUtc(date, time),
      title,
      subtitle,
      styleId: style.id,
      showConstellations,
      showGrid,
      showMilkyWay: true,
      magnitudeLimit: 6.5,
      size: "30x40",
      material: "poster",
    };

    return renderStarmapArtworkSvg(spec);
  }, [location, date, time, title, subtitle, style.id, showConstellations, showGrid]);

  if (!location) {
    return (
      <div
        className="w-full rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center max-w-md mx-auto"
        style={{
          aspectRatio: "2/3",
          backgroundColor: "#f9f9f9",
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
          <p className="text-sm text-gray-500">Configure your star map to see the preview</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative max-w-md mx-auto">
      <div
        className="w-full rounded-lg shadow-2xl overflow-hidden"
        style={{
          aspectRatio: "2/3",
          backgroundColor: style.colors.background,
        }}
        dangerouslySetInnerHTML={{ __html: svg }}
      />

      <div className="absolute inset-0 rounded-lg shadow-2xl pointer-events-none border-8 border-white" />
    </div>
  );
}

function toDateTimeUtc(date: Date, time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  const dateTime = new Date(date);
  dateTime.setHours(hours || 0, minutes || 0, 0, 0);
  return dateTime.toISOString();
}
