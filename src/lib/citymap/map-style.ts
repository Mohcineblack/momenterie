import type { StyleSpecification } from "maplibre-gl";
import { EMapStyle, COLOR_THEME, rgbToHex } from "@/lib/citymap/citymap-model";

/**
 * Free, no-key vector tiles (OpenFreeMap, OpenMapTiles schema).
 * We render the tiles client-side and color every feature per theme —
 * the legitimate equivalent of momenterie's private styled tile server.
 */
const OPENFREEMAP_SOURCE = "https://tiles.openfreemap.org/planet";

/* --- color helpers --- */
function parseRgb(rgb: string): [number, number, number] {
  const [r, g, b] = rgb.split(",").map((n) => parseInt(n.trim(), 10));
  return [r, g, b];
}
function mix(aRgb: string, bRgb: string, t: number): string {
  const a = parseRgb(aRgb);
  const b = parseRgb(bRgb);
  const c = a.map((v, i) => Math.round(v + (b[i] - v) * t));
  return `#${c.map((v) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, "0")).join("")}`;
}

/** Signature water color per style (the distinctive accent of each map). */
const WATER_RGB: Record<EMapStyle, string> = {
  [EMapStyle.GLACIER]: "184, 205, 217",
  [EMapStyle.NAUTIC]: "150, 170, 165",
  [EMapStyle.WEBMAP]: "170, 200, 222",
  [EMapStyle.LIGHTBLUE]: "168, 184, 216",
  [EMapStyle.DARK]: "30, 30, 30",
  [EMapStyle.BLUE]: "10, 26, 90",
  [EMapStyle.PINK]: "232, 184, 200",
  [EMapStyle.RED]: "180, 70, 70",
  [EMapStyle.LIGHT]: "201, 214, 221",
  [EMapStyle.SEPIA]: "216, 203, 176",
};

export interface FeaturePalette {
  background: string;
  water: string;
  landuse: string;
  park: string;
  road: string;
  majorRoad: string;
  building: string;
  boundary: string;
}

/** Derive a cohesive, monochrome-tinted palette from the theme (base + accent). */
export function getFeaturePalette(style: EMapStyle): FeaturePalette {
  const theme = COLOR_THEME[style];
  const base = theme.base;
  const accent = theme.accent;
  return {
    background: rgbToHex(base),
    water: rgbToHex(WATER_RGB[style]),
    landuse: mix(base, accent, 0.06),
    park: mix(base, accent, 0.12),
    road: mix(base, accent, 0.18),
    majorRoad: mix(base, accent, 0.34),
    building: mix(base, accent, 0.1),
    boundary: mix(base, accent, 0.26),
  };
}

/** Build a complete MapLibre style (no labels) colored for the given theme. */
export function buildMapStyle(style: EMapStyle): StyleSpecification {
  const p = getFeaturePalette(style);
  return {
    version: 8,
    glyphs: "https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf",
    sources: {
      openmaptiles: { type: "vector", url: OPENFREEMAP_SOURCE },
    },
    layers: [
      { id: "background", type: "background", paint: { "background-color": p.background } },
      {
        id: "landuse",
        type: "fill",
        source: "openmaptiles",
        "source-layer": "landuse",
        paint: { "fill-color": p.landuse },
      },
      {
        id: "landcover",
        type: "fill",
        source: "openmaptiles",
        "source-layer": "landcover",
        paint: { "fill-color": p.park, "fill-opacity": 0.7 },
      },
      {
        id: "park",
        type: "fill",
        source: "openmaptiles",
        "source-layer": "park",
        paint: { "fill-color": p.park },
      },
      {
        id: "water",
        type: "fill",
        source: "openmaptiles",
        "source-layer": "water",
        paint: { "fill-color": p.water },
      },
      {
        id: "waterway",
        type: "line",
        source: "openmaptiles",
        "source-layer": "waterway",
        paint: { "line-color": p.water, "line-width": 1 },
      },
      {
        id: "building",
        type: "fill",
        source: "openmaptiles",
        "source-layer": "building",
        minzoom: 13,
        paint: { "fill-color": p.building, "fill-opacity": 0.7 },
      },
      {
        id: "road-minor",
        type: "line",
        source: "openmaptiles",
        "source-layer": "transportation",
        filter: ["!in", "class", "motorway", "trunk", "primary"],
        paint: {
          "line-color": p.road,
          "line-width": ["interpolate", ["linear"], ["zoom"], 10, 0.5, 16, 3],
        },
      },
      {
        id: "road-major",
        type: "line",
        source: "openmaptiles",
        "source-layer": "transportation",
        filter: ["in", "class", "motorway", "trunk", "primary"],
        paint: {
          "line-color": p.majorRoad,
          "line-width": ["interpolate", ["linear"], ["zoom"], 8, 0.8, 16, 5],
        },
      },
      {
        id: "boundary",
        type: "line",
        source: "openmaptiles",
        "source-layer": "boundary",
        filter: ["<=", "admin_level", 4],
        paint: { "line-color": p.boundary, "line-width": 0.6, "line-dasharray": [3, 2] },
      },
    ],
  };
}
