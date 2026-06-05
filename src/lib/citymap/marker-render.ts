import { MARKER_ICON_SVG } from "@/lib/citymap/marker-icons";
import {
  EMarkerIcon,
  EMarkerSize,
  EMarkerColorLayer,
  MARKER_SIZE,
  resolveMarkerColors,
} from "@/lib/citymap/citymap-model";

/**
 * Render a marker icon to an SVG string with the chosen size + colors applied.
 * Mirrors the Vue editor: pin background = {{MARKER}}, inner symbol = {{SYMBOL}}.
 */
export function renderMarkerSvg(
  icon: EMarkerIcon,
  size: EMarkerSize,
  color: string,
  colorLayer: EMarkerColorLayer = EMarkerColorLayer.MARKER
): string {
  const tpl = MARKER_ICON_SVG[icon] ?? MARKER_ICON_SVG[EMarkerIcon.PIN_HEART];
  const [w, h] = MARKER_SIZE[size].size;
  const { backgroundColor, foregroundColor } = resolveMarkerColors(color, colorLayer);
  return tpl
    .replace(/\{\{W\}\}/g, String(w))
    .replace(/\{\{H\}\}/g, String(h))
    .replace(/\{\{MARKER\}\}/g, backgroundColor)
    .replace(/\{\{SYMBOL\}\}/g, foregroundColor);
}

/**
 * Build the HTML used by a Leaflet divIcon for an icon marker.
 * The wrapper offsets so the pin tip sits on the coordinate (anchor).
 */
export function markerDivHtml(
  icon: EMarkerIcon,
  size: EMarkerSize,
  color: string,
  colorLayer: EMarkerColorLayer,
  label?: string
): string {
  const svg = renderMarkerSvg(icon, size, color, colorLayer);
  const labelHtml = label
    ? `<span class="citymap-marker__label">${escapeHtml(label)}</span>`
    : "";
  return `<div class="citymap-marker">${svg}${labelHtml}</div>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
