"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
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
import { buildMapStyle } from "@/lib/citymap/map-style";
import { markerDivHtml } from "@/lib/citymap/marker-render";
import {
  SHAPE_HEART_PATH,
  SHAPE_HEART_VIEWBOX,
  SHAPE_CIRCLE,
  SHAPE_CIRCLE_VIEWBOX,
} from "@/lib/citymap/marker-icons";

export function CitymapMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markerObjs = useRef<maplibregl.Marker[]>([]);

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
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: buildMapStyle(mapStyle),
      center: [location?.lng ?? 2.3522, location?.lat ?? 48.8566],
      zoom,
      attributionControl: { compact: true },
      dragRotate: false,
      pitchWithRotate: false,
    });
    mapRef.current = map;

    map.on("zoomend", () => setZoom(Math.round(map.getZoom())));
    map.on("moveend", () => {
      const c = map.getCenter();
      const cur = useCitymapEditor.getState().location;
      setLocation({ lat: c.lat, lng: c.lng, placeName: cur?.placeName ?? "" });
    });
    map.on("load", () => renderMarkers());

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // restyle on theme change (preserves camera)
  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.setStyle(buildMapStyle(mapStyle));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapStyle]);

  // recenter when location changes externally (search)
  useEffect(() => {
    if (!location || !mapRef.current) return;
    const c = mapRef.current.getCenter();
    if (Math.abs(c.lat - location.lat) > 1e-6 || Math.abs(c.lng - location.lng) > 1e-6) {
      mapRef.current.flyTo({ center: [location.lng, location.lat], zoom, duration: 800 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location?.lat, location?.lng]);

  // sync zoom from store (external buttons)
  useEffect(() => {
    if (!mapRef.current) return;
    if (Math.round(mapRef.current.getZoom()) !== Math.round(zoom)) {
      mapRef.current.easeTo({ zoom, duration: 300 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoom]);

  // re-render markers when they change
  useEffect(() => {
    renderMarkers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markers]);

  function renderMarkers() {
    const map = mapRef.current;
    if (!map) return;
    markerObjs.current.forEach((m) => m.remove());
    markerObjs.current = [];

    for (const m of markers) {
      const el = document.createElement("div");
      let anchor: maplibregl.PositionAnchor = "bottom";

      if (m.type === EMarkerType.PHOTO && m.photoUrl) {
        const [w] = MARKER_SIZE[m.size].size;
        const px = Math.max(w, 40);
        const ring = "#" + m.color.replace("#", "");
        el.innerHTML = `<div class="citymap-marker citymap-marker--photo" style="width:${px}px;height:${px}px;border-color:${ring}"><img src="${m.photoUrl}" alt="" /></div>`;
        anchor = "center";
      } else {
        el.innerHTML = markerDivHtml(m.icon, m.size, m.color, m.colorLayer, m.text || undefined);
        anchor = "bottom";
      }

      const marker = new maplibregl.Marker({ element: el, anchor, draggable: true })
        .setLngLat([m.lng, m.lat])
        .addTo(map);

      el.addEventListener("click", () => selectMarker(m.id));
      marker.on("dragend", () => {
        const ll = marker.getLngLat();
        updateMarker(m.id, { lat: ll.lat, lng: ll.lng });
      });
      markerObjs.current.push(marker);
    }
  }

  const clipId = shapeOverlay === EShapeOverlay.HEART ? "cm-heart-clip" : "cm-circle-clip";
  const showShape = shapeOverlay !== EShapeOverlay.NONE;

  return (
    <div className="relative w-full h-full overflow-hidden">
      {showShape && (
        <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
          <defs>
            <clipPath id="cm-heart-clip" clipPathUnits="objectBoundingBox">
              <path transform="scale(0.0020491803 0.0023980815)" d={SHAPE_HEART_PATH} />
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

      {/* gradient overlay — exact CSS from the source */}
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
            <circle cx={SHAPE_CIRCLE.cx} cy={SHAPE_CIRCLE.cy} r={SHAPE_CIRCLE.r} fill="none" stroke={rgbToHex(styleDef.theme.accent)} strokeWidth="3" vectorEffect="non-scaling-stroke" />
          )}
        </svg>
      )}
    </div>
  );
}
