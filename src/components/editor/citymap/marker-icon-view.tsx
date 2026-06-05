"use client";

import { EMarkerIcon, EMarkerSize, EMarkerColorLayer } from "@/lib/citymap/citymap-model";
import { renderMarkerSvg } from "@/lib/citymap/marker-render";

interface MarkerIconViewProps {
  icon: EMarkerIcon;
  color: string;
  colorLayer?: EMarkerColorLayer;
  /** Render size in px (the inner SVG keeps its 32x32 viewBox aspect). */
  pixelSize?: number;
  className?: string;
}

/**
 * Renders a single marker icon as inline SVG for use in pickers / previews.
 */
export function MarkerIconView({
  icon,
  color,
  colorLayer = EMarkerColorLayer.MARKER,
  pixelSize = 32,
  className,
}: MarkerIconViewProps) {
  // Always render at MEDIUM (32x32) and scale via CSS for crisp picker thumbnails.
  const svg = renderMarkerSvg(icon, EMarkerSize.MEDIUM, color, colorLayer);
  return (
    <span
      className={className}
      style={{ display: "inline-flex", width: pixelSize, height: pixelSize }}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
