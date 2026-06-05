"use client";

import { useEffect, useState } from "react";
import { useCityMapStore } from "@/store/citymap-store";
import { renderCitymapArtworkSvg, type OverpassElement } from "@/lib/render/citymap-artwork";
import type { CitymapSpec } from "@/lib/render/spec";

export function CityMapPreview() {
  const { location, title, subtitle, date, mapStyle, zoom } = useCityMapStore();
  const [svg, setSvg] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function renderPreview() {
      if (!location) {
        setSvg("");
        return;
      }

      const spec: CitymapSpec = {
        productType: "citymap",
        location,
        zoom,
        bearing: 0,
        mapStyleId: mapStyle.id,
        title,
        subtitle,
        date,
        showCoordinates: true,
        markers: [],
        photoUrls: [],
        size: "30x40",
        material: "poster",
      };
      const nextSvg = await renderCitymapArtworkSvg(spec, loadPreviewFeatures);
      if (!cancelled) {
        setSvg(nextSvg);
      }
    }

    renderPreview();
    return () => { cancelled = true; };
  }, [location, title, subtitle, date, mapStyle.id, zoom]);

  if (!location) {
    return (
      <div className="w-full border border-outline-variant bg-surface-container-lowest flex items-center justify-center" style={{ aspectRatio: "3/4" }}>
        <div className="text-center p-8">
          <svg className="w-12 h-12 mx-auto mb-4 text-surface-container-high" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <p className="font-sans text-xs uppercase tracking-wider text-on-surface-variant">Select a location to preview</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full border border-outline-variant shadow-2xl bg-white">
      <div
        className="w-full [&>svg]:w-full [&>svg]:h-auto [&>svg]:block"
        dangerouslySetInnerHTML={{ __html: svg.replace(/^<\?xml[^>]*\?>/, '') }}
      />
    </div>
  );
}

async function loadPreviewFeatures(bbox: {
  north: number;
  south: number;
  east: number;
  west: number;
}): Promise<OverpassElement[]> {
  // Try real Overpass API first for actual map data
  try {
    const query = `[out:json][timeout:8];(way["highway"](${bbox.south},${bbox.west},${bbox.north},${bbox.east});way["natural"="water"](${bbox.south},${bbox.west},${bbox.north},${bbox.east});way["waterway"](${bbox.south},${bbox.west},${bbox.north},${bbox.east}););out body;>;out skel qt;`;
    const response = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ data: query }),
    });
    if (response.ok) {
      const json = await response.json();
      if (json.elements?.length > 0) return json.elements;
    }
  } catch {}

  // Fallback grid
  const centerLat = (bbox.north + bbox.south) / 2;
  const centerLng = (bbox.east + bbox.west) / 2;
  const nodes: OverpassElement[] = [];
  const ways: OverpassElement[] = [];
  let id = 1;

  for (let i = -4; i <= 4; i++) {
    const lat = bbox.south + ((i + 4) / 8) * (bbox.north - bbox.south);
    nodes.push({ type: "node", id: id++, lat, lon: bbox.west });
    nodes.push({ type: "node", id: id++, lat, lon: bbox.east });
    ways.push({ type: "way", id: id++, nodes: [id - 3, id - 2], tags: { highway: i % 2 === 0 ? "primary" : "residential" } });
  }
  for (let i = -3; i <= 3; i++) {
    const lon = bbox.west + ((i + 3) / 6) * (bbox.east - bbox.west);
    nodes.push({ type: "node", id: id++, lat: bbox.south, lon });
    nodes.push({ type: "node", id: id++, lat: bbox.north, lon });
    ways.push({ type: "way", id: id++, nodes: [id - 3, id - 2], tags: { highway: "residential" } });
  }

  nodes.push({ type: "node", id: id++, lat: centerLat + 0.01, lon: bbox.west + 0.01 });
  nodes.push({ type: "node", id: id++, lat: centerLat + 0.01, lon: bbox.east - 0.01 });
  nodes.push({ type: "node", id: id++, lat: centerLat - 0.01, lon: bbox.east - 0.01 });
  nodes.push({ type: "node", id: id++, lat: centerLat - 0.01, lon: bbox.west + 0.01 });
  ways.push({ type: "way", id: id++, nodes: [id - 5, id - 4, id - 3, id - 2, id - 5], tags: { natural: "water" } });

  return [...nodes, ...ways];
}
