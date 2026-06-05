"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useCitymapEditor } from "@/store/citymap-editor-store";
import {
  EShapeOverlay,
  EGradientOverlay,
  EMarkerType,
  EMarkerSize,
  MARKER_SIZE,
  getMapStyleDef,
  rgbToHex,
} from "@/lib/citymap/citymap-model";
import { markerDivHtml } from "@/lib/citymap/marker-render";
import {
  SHAPE_HEART_PATH,
  SHAPE_HEART_VIEWBOX,
  SHAPE_CIRCLE,
  SHAPE_CIRCLE_VIEWBOX,
} from "@/lib/citymap/marker-icons";

const TILES = {
  light: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png",
  dark: "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png",
};

/** Tile CSS filter that gently tints toward the style's accent hue. */
function tileFilter(accentRgb: string, dark: boolean): string {
  const [r, g, b] = accentRgb.split(",").map((n) => parseInt(n.trim(), 10));
  // grayscale-ish accent (near neutral) → minimal tint
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const sat = max === 0 ? 0 : (max - min) / max;
  if (sat < 0.15) {
    return dark ? "saturate(0.6)" : "saturate(0.85) brightness(1.02)";
  }
  const hue = Math.round((Math.atan2(Math.sqrt(3) * (g - b), 2 * r - g - b) * 180) / Math.PI);
  return dark
    ? `saturate(1.1) hue-rotate(${hue}deg) brightness(0.95)`
    : `saturate(1.05) hue-rotate(${hue}deg)`;
}

export function CitymapMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileRef = useRef<L.TileLayer | null>(null);
  const markerLayerRef = useRef<L.LayerGroup | null>(null);

  const location = useCitymapEditor((s) => s.location);
  const zoom = useCitymapEditor((s) => s.zoom);
  const mapStyle = useCitymapEditor((s) => s.mapStyle);
  const markers = useCitymapEditor((s) => s.markers);
  const shapeOverlay = useCitymapEditor((s) => s.shapeOverlay);
  const gradientOverlay = useCitymapEditor((s) => s.gradientOverlay);
  const setLocation = useCitymapEditor((s) => s.setLocation);
  const setZoom = useCitymapEditor((s) => s.setZoom);
  const updateMarker = useCitymapEditor((s) => s.updateMarker);
  const selectMarker = useCitymapEditor((s) => s.selectMarker);

  const styleDef = getMapStyleDef(mapStyle);

  // init
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, {
      center: [location?.lat ?? 48.8566, location?.lng ?? 2.3522],
      zoom: zoom,
      zoomControl: false,
      attributionControl: false,
    });
    const tile = L.tileLayer(styleDef.dark ? TILES.dark : TILES.light, { maxZoom: 19 }).addTo(map);
    const group = L.layerGroup().addTo(map);
    tileRef.current = tile;
    markerLayerRef.current = group;
    mapRef.current = map;

    map.on("zoomend", () => setZoom(map.getZoom()));
    map.on("moveend", () => {
      const c = map.getCenter();
      const cur = useCitymapEditor.getState().location;
      setLocation({ lat: c.lat, lng: c.lng, placeName: cur?.placeName ?? "" });
    });

    applyTint();
    renderMarkers();
    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // tiles + tint on style change
  useEffect(() => {
    if (!mapRef.current || !tileRef.current) return;
    tileRef.current.setUrl(styleDef.dark ? TILES.dark : TILES.light);
    applyTint();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapStyle]);

  // recenter when location changes externally (search)
  useEffect(() => {
    if (!location || !mapRef.current) return;
    const c = mapRef.current.getCenter();
    if (Math.abs(c.lat - location.lat) > 1e-6 || Math.abs(c.lng - location.lng) > 1e-6) {
      mapRef.current.setView([location.lat, location.lng], zoom, { animate: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location?.lat, location?.lng]);

  // sync zoom from store (external buttons)
  useEffect(() => {
    if (!mapRef.current) return;
    if (Math.round(mapRef.current.getZoom()) !== Math.round(zoom)) {
      mapRef.current.setZoom(zoom, { animate: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoom]);

  // re-render markers when they change
  useEffect(() => {
    renderMarkers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markers]);

  function applyTint() {
    const pane = containerRef.current?.querySelector(".leaflet-tile-pane") as HTMLElement | null;
    if (pane) pane.style.filter = tileFilter(styleDef.theme.accent, styleDef.dark);
  }

  function renderMarkers() {
    const group = markerLayerRef.current;
    const map = mapRef.current;
    if (!group || !map) return;
    group.clearLayers();

    for (const m of markers) {
      let leafletMarker: L.Marker;
      if (m.type === EMarkerType.PHOTO && m.photoUrl) {
        const [w] = MARKER_SIZE[m.size].size;
        const px = Math.max(w, 40);
        const ring = "#" + (m.color.startsWith("#") ? m.color.slice(1) : m.color);
        const html = `<div class="citymap-marker citymap-marker--photo" style="width:${px}px;height:${px}px;border-color:${ring}"><img src="${m.photoUrl}" alt="" /></div>`;
        const icon = L.divIcon({
          className: "citymap-divicon",
          html,
          iconSize: [px, px],
          iconAnchor: [px / 2, px / 2],
        });
        leafletMarker = L.marker([m.lat, m.lng], { icon, draggable: true });
      } else {
        const html = markerDivHtml(m.icon, m.size, m.color, m.colorLayer, m.text || undefined);
        const [w, h] = MARKER_SIZE[m.size].size;
        const [ax, ay] = MARKER_SIZE[m.size].anchor;
        const icon = L.divIcon({
          className: "citymap-divicon",
          html,
          iconSize: [w, h],
          iconAnchor: [ax, ay],
        });
        leafletMarker = L.marker([m.lat, m.lng], { icon, draggable: true });
      }

      leafletMarker.on("click", () => selectMarker(m.id));
      leafletMarker.on("dragend", () => {
        const ll = leafletMarker.getLatLng();
        updateMarker(m.id, { lat: ll.lat, lng: ll.lng });
      });
      leafletMarker.addTo(group);
    }
  }

  const clipId = shapeOverlay === EShapeOverlay.HEART ? "cm-heart-clip" : "cm-circle-clip";
  const showShape = shapeOverlay !== EShapeOverlay.NONE;

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* SVG clip-path defs for shape masks */}
      {showShape && (
        <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
          <defs>
            <clipPath id="cm-heart-clip" clipPathUnits="objectBoundingBox">
              {/* normalized heart path (488x417 → 0..1) */}
              <path
                transform="scale(0.0020491803 0.0023980815)"
                d={SHAPE_HEART_PATH}
              />
            </clipPath>
            <clipPath id="cm-circle-clip" clipPathUnits="objectBoundingBox">
              <circle cx="0.5" cy="0.5" r="0.46" />
            </clipPath>
          </defs>
        </svg>
      )}

      <div
        ref={containerRef}
        className="w-full h-full"
        style={showShape ? { clipPath: `url(#${clipId})` } : undefined}
      />

      {/* gradient overlay — exact CSS from the source (color via --cm-gradient-color) */}
      {gradientOverlay !== EGradientOverlay.NONE && (
        <div
          className={`citymap-gradient gradient--${gradientOverlay}`}
          style={{ ["--cm-gradient-color" as string]: styleDef.theme.base }}
        />
      )}

      {/* shape outline stroke */}
      {showShape && (
        <svg
          className="pointer-events-none absolute inset-0 w-full h-full"
          viewBox={shapeOverlay === EShapeOverlay.HEART ? SHAPE_HEART_VIEWBOX : SHAPE_CIRCLE_VIEWBOX}
          preserveAspectRatio="none"
        >
          {shapeOverlay === EShapeOverlay.HEART ? (
            <path d={SHAPE_HEART_PATH} fill="none" stroke={rgbToHex(styleDef.theme.accent)} strokeWidth="3" vectorEffect="non-scaling-stroke" />
          ) : (
            <circle
              cx={SHAPE_CIRCLE.cx}
              cy={SHAPE_CIRCLE.cy}
              r={SHAPE_CIRCLE.r}
              fill="none"
              stroke={rgbToHex(styleDef.theme.accent)}
              strokeWidth="3"
              vectorEffect="non-scaling-stroke"
            />
          )}
        </svg>
      )}
    </div>
  );
}
