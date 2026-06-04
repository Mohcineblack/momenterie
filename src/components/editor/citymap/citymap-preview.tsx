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

    return () => {
      cancelled = true;
    };
  }, [location, title, subtitle, date, mapStyle.id, zoom]);

  if (!location) {
    return (
      <div
        className="w-full rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center"
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
              <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No location selected</h3>
          <p className="text-sm text-gray-500">Search for a location on the map to see your preview</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full mx-auto max-w-md">
      <div
        className="relative rounded-lg overflow-hidden shadow-xl"
        style={{
          aspectRatio: "2/3",
          backgroundColor: mapStyle.colors.background,
        }}
        dangerouslySetInnerHTML={{ __html: svg }}
      />

      <div className="absolute inset-0 rounded-lg shadow-2xl pointer-events-none border-8 border-white" />
    </div>
  );
}

async function loadPreviewFeatures(bbox: {
  north: number;
  south: number;
  east: number;
  west: number;
}): Promise<OverpassElement[]> {
  const centerLat = (bbox.north + bbox.south) / 2;
  const centerLng = (bbox.east + bbox.west) / 2;
  const nodes: OverpassElement[] = [];
  const ways: OverpassElement[] = [];
  let id = 1;

  for (let i = -4; i <= 4; i += 1) {
    const lat = bbox.south + ((i + 4) / 8) * (bbox.north - bbox.south);
    nodes.push({ type: "node", id: id++, lat, lon: bbox.west });
    nodes.push({ type: "node", id: id++, lat, lon: bbox.east });
    ways.push({ type: "way", id: id++, nodes: [id - 3, id - 2], tags: { highway: i % 2 === 0 ? "primary" : "residential" } });
  }

  for (let i = -3; i <= 3; i += 1) {
    const lon = bbox.west + ((i + 3) / 6) * (bbox.east - bbox.west);
    nodes.push({ type: "node", id: id++, lat: bbox.south, lon });
    nodes.push({ type: "node", id: id++, lat: bbox.north, lon });
    ways.push({ type: "way", id: id++, nodes: [id - 3, id - 2], tags: { highway: "residential" } });
  }

  nodes.push({ type: "node", id: id++, lat: centerLat + 0.02, lon: bbox.west + 0.02 });
  nodes.push({ type: "node", id: id++, lat: centerLat + 0.02, lon: bbox.east - 0.02 });
  nodes.push({ type: "node", id: id++, lat: centerLat - 0.02, lon: bbox.east - 0.02 });
  nodes.push({ type: "node", id: id++, lat: centerLat - 0.02, lon: bbox.west + 0.02 });
  ways.push({ type: "way", id: id++, nodes: [id - 5, id - 4, id - 3, id - 2, id - 5], tags: { natural: "water", name: "River" } });

  return [...nodes, ...ways, { type: "node", id: id++, lat: centerLat, lon: centerLng, tags: { place: "city", name: "Center" } }];
}
