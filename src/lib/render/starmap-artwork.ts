import * as astronomy from "astronomy-engine";
import { getPrintBox, type StarmapSpec } from "@/lib/render/spec";
import { getStarMapStyle } from "@/lib/render/styles";
import { CONSTELLATION_LINES, YALE_BRIGHT_STAR_SUBSET } from "@/lib/render/star-catalog";

interface PlottedStar {
  name: string;
  x: number;
  y: number;
  radius: number;
}

export function renderStarmapArtworkSvg(spec: StarmapSpec): string {
  const box = getPrintBox(spec.size);
  const width = box.widthPx;
  const height = box.heightPx;
  const skyHeight = Math.round(height * 0.72);
  const style = getStarMapStyle(spec.styleId);
  const stars = plotStars(spec, width, skyHeight);
  const starByName = new Map(stars.map((star) => [star.name, star]));

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="${style.colors.background}"/>
  <g id="sky" clip-path="url(#skyClip)">
    <defs><clipPath id="skyClip"><rect x="0" y="0" width="${width}" height="${skyHeight}"/></clipPath></defs>
    ${spec.showMilkyWay ? `<ellipse cx="${width * 0.55}" cy="${skyHeight * 0.45}" rx="${width * 0.55}" ry="${skyHeight * 0.16}" fill="${style.colors.milkyWay}" opacity="0.16" transform="rotate(-18 ${width * 0.55} ${skyHeight * 0.45})"/>` : ""}
    ${spec.showGrid ? grid(width, skyHeight, style.colors.grid) : ""}
    ${spec.showConstellations ? constellationLines(starByName, style.colors.constellation) : ""}
    ${stars.map((star) => `<circle cx="${star.x.toFixed(1)}" cy="${star.y.toFixed(1)}" r="${star.radius.toFixed(1)}" fill="${style.colors.stars}"/>`).join("")}
  </g>
  <g id="text" transform="translate(0 ${skyHeight})">
    <text x="${width / 2}" y="${Math.round((height - skyHeight) * 0.28)}" text-anchor="middle" font-family="Georgia, serif" font-size="${Math.round(width * 0.052)}" font-weight="700" fill="${style.colors.text}">${escapeXml(spec.title || "The Night Sky")}</text>
    <text x="${width / 2}" y="${Math.round((height - skyHeight) * 0.45)}" text-anchor="middle" font-family="Arial, sans-serif" font-size="${Math.round(width * 0.023)}" fill="${style.colors.text}" opacity="0.72">${escapeXml(spec.subtitle || spec.location.placeName)}</text>
    <text x="${width / 2}" y="${Math.round((height - skyHeight) * 0.62)}" text-anchor="middle" font-family="Courier New, monospace" font-size="${Math.round(width * 0.017)}" fill="${style.colors.text}" opacity="0.52">${escapeXml(new Date(spec.datetimeUtc).toISOString())}</text>
  </g>
</svg>`;
}

function plotStars(spec: StarmapSpec, width: number, height: number): PlottedStar[] {
  const observer = new astronomy.Observer(spec.location.lat, spec.location.lng, 0);
  const time = astronomy.MakeTime(new Date(spec.datetimeUtc));

  return YALE_BRIGHT_STAR_SUBSET.filter((star) => star.magnitude <= spec.magnitudeLimit)
    .flatMap((star) => {
      const hor = astronomy.Horizon(time, observer, star.raHours * 15, star.decDegrees, "normal");
      if (hor.altitude <= 0) return [];

      const azimuthRad = (hor.azimuth * Math.PI) / 180;
      const altitudeRad = (hor.altitude * Math.PI) / 180;
      const radius = Math.min(width, height) * 0.48;
      const r = radius * (1 - Math.sin(altitudeRad));

      return [{
        name: star.name,
        x: width / 2 + r * Math.sin(azimuthRad),
        y: height / 2 - r * Math.cos(azimuthRad),
        radius: Math.max(2.2, 8 - star.magnitude),
      }];
    });
}

function constellationLines(stars: Map<string, PlottedStar>, stroke: string) {
  return CONSTELLATION_LINES.map(([fromName, toName]) => {
    const from = stars.get(fromName);
    const to = stars.get(toName);
    if (!from || !to) return "";

    return `<line x1="${from.x.toFixed(1)}" y1="${from.y.toFixed(1)}" x2="${to.x.toFixed(1)}" y2="${to.y.toFixed(1)}" stroke="${stroke}" stroke-width="3" opacity="0.38"/>`;
  }).join("");
}

function grid(width: number, height: number, stroke: string) {
  const vertical = Array.from({ length: 7 }, (_, index) => {
    const x = (width / 8) * (index + 1);
    return `<line x1="${x}" y1="0" x2="${x}" y2="${height}" stroke="${stroke}" stroke-width="2" opacity="0.12"/>`;
  }).join("");
  const horizontal = Array.from({ length: 5 }, (_, index) => {
    const y = (height / 6) * (index + 1);
    return `<line x1="0" y1="${y}" x2="${width}" y2="${y}" stroke="${stroke}" stroke-width="2" opacity="0.12"/>`;
  }).join("");

  return vertical + horizontal;
}

function escapeXml(value: string) {
  return value.replace(/[<>&'"]/g, (char) => ({
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    "'": "&apos;",
    "\"": "&quot;",
  }[char] ?? char));
}
