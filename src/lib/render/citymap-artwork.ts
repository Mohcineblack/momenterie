import { getPrintBox, type CitymapSpec } from "@/lib/render/spec";
import { getMapStyle } from "@/lib/render/styles";

export interface OverpassElement {
  type: "node" | "way";
  id: number;
  lat?: number;
  lon?: number;
  nodes?: number[];
  tags?: Record<string, string>;
}

interface Point {
  x: number;
  y: number;
}

export async function renderCitymapArtworkSvg(
  spec: CitymapSpec,
  loadFeatures: (bbox: ReturnType<typeof bboxFor>) => Promise<OverpassElement[]> = getOsmFeatures
): Promise<string> {
  const box = getPrintBox(spec.size);
  const width = box.widthPx;
  const height = box.heightPx;
  const mapHeight = Math.round(height * 0.7);
  const textTop = mapHeight;
  const style = getMapStyle(spec.mapStyleId);
  const bbox = bboxFor(spec.location.lat, spec.location.lng, spec.zoom);
  const features = await loadFeatures(bbox);
  const projected = projectFeatures(features, bbox, width, mapHeight);

  const water = projected.filter((feature) => feature.kind === "water");
  const landuse = projected.filter((feature) => feature.kind === "landuse");
  const roads = projected.filter((feature) => feature.kind === "road");
  const majorRoads = projected.filter((feature) => feature.kind === "major-road");
  const buildings = projected.filter((feature) => feature.kind === "building");
  const labels = projected.filter((feature) => feature.label);
  const center = project(spec.location.lat, spec.location.lng, bbox, width, mapHeight);
  const markers = [
    { ...center, label: spec.location.placeName },
    ...spec.markers.map((marker) => ({
      ...project(marker.lat, marker.lng, bbox, width, mapHeight),
      label: marker.label,
    })),
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="${style.colors.background}"/>
  <g id="map" clip-path="url(#mapClip)">
    <defs><clipPath id="mapClip"><rect x="0" y="0" width="${width}" height="${mapHeight}"/></clipPath></defs>
    <rect width="${width}" height="${mapHeight}" fill="${style.colors.land}"/>
    ${water.map((feature) => polygon(feature.points, style.colors.water, "none", 0)).join("")}
    ${landuse.map((feature) => polygon(feature.points, style.colors.landuse, "none", 0)).join("")}
    ${buildings.map((feature) => polygon(feature.points, style.colors.buildings, "none", 0)).join("")}
    ${roads.map((feature) => polyline(feature.points, style.colors.roads, 10)).join("")}
    ${majorRoads.map((feature) => polyline(feature.points, style.colors.majorRoads, 18)).join("")}
    ${labels.map((feature) => label(feature.points[0], feature.label!, style.colors.text)).join("")}
    ${markers.map((marker) => markerSvg(marker, style.colors.marker, style.colors.background)).join("")}
  </g>
  <rect x="${box.bleedMm * 12}" y="${box.bleedMm * 12}" width="${width - box.bleedMm * 24}" height="${mapHeight - box.bleedMm * 24}" fill="none" stroke="${style.colors.text}" stroke-opacity="0.2" stroke-width="2"/>
  <g id="text" transform="translate(0 ${textTop})">
    <rect width="${width}" height="${height - textTop}" fill="${style.colors.background}"/>
    <text x="${width / 2}" y="${Math.round((height - textTop) * 0.32)}" text-anchor="middle" font-family="Georgia, serif" font-size="${Math.round(width * 0.055)}" font-weight="700" fill="${style.colors.text}">${escapeXml(spec.title || spec.location.placeName)}</text>
    <text x="${width / 2}" y="${Math.round((height - textTop) * 0.49)}" text-anchor="middle" font-family="Arial, sans-serif" font-size="${Math.round(width * 0.024)}" fill="${style.colors.text}" opacity="0.72">${escapeXml(spec.subtitle || spec.date || "")}</text>
    ${spec.showCoordinates ? `<text x="${width / 2}" y="${Math.round((height - textTop) * 0.64)}" text-anchor="middle" font-family="Courier New, monospace" font-size="${Math.round(width * 0.018)}" fill="${style.colors.text}" opacity="0.52">${formatCoordinates(spec.location.lat, spec.location.lng)}</text>` : ""}
  </g>
</svg>`;
}

async function getOsmFeatures(bbox: ReturnType<typeof bboxFor>) {
  try {
    const query = `[out:json][timeout:10];(way["highway"](${bbox.south},${bbox.west},${bbox.north},${bbox.east});way["waterway"](${bbox.south},${bbox.west},${bbox.north},${bbox.east});way["natural"="water"](${bbox.south},${bbox.west},${bbox.north},${bbox.east});way["landuse"](${bbox.south},${bbox.west},${bbox.north},${bbox.east});way["building"](${bbox.south},${bbox.west},${bbox.north},${bbox.east});node["place"](${bbox.south},${bbox.west},${bbox.north},${bbox.east}););out body;>;out skel qt;`;
    const response = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ data: query }),
    });

    if (!response.ok) {
      throw new Error(`Overpass failed: ${response.status}`);
    }

    const json = await response.json();
    return json.elements as OverpassElement[];
  } catch {
    return fallbackFeatures(bbox);
  }
}

function bboxFor(lat: number, lng: number, zoom: number) {
  const span = Math.max(0.01, 0.18 / Math.pow(2, Math.max(0, zoom - 12)));
  return {
    south: lat - span,
    north: lat + span,
    west: lng - span,
    east: lng + span,
  };
}

function projectFeatures(elements: OverpassElement[], bbox: ReturnType<typeof bboxFor>, width: number, height: number) {
  const nodes = new Map<number, { lat: number; lon: number }>();
  elements.forEach((element) => {
    if (element.type === "node" && element.lat !== undefined && element.lon !== undefined) {
      nodes.set(element.id, { lat: element.lat, lon: element.lon });
    }
  });

  return elements.flatMap((element) => {
    if (element.type === "node" && element.lat !== undefined && element.lon !== undefined && element.tags?.place) {
      return [{
        kind: "label",
        label: element.tags.name || element.tags.place,
        points: [project(element.lat, element.lon, bbox, width, height)],
      }];
    }

    if (element.type !== "way" || !element.nodes?.length) return [];

    const points = element.nodes
      .map((id) => nodes.get(id))
      .filter((node): node is { lat: number; lon: number } => Boolean(node))
      .map((node) => project(node.lat, node.lon, bbox, width, height));

    if (points.length < 2) return [];

    return [{
      kind: featureKind(element.tags ?? {}),
      label: element.tags?.name,
      points,
    }];
  });
}

function featureKind(tags: Record<string, string>) {
  if (tags.natural === "water" || tags.waterway) return "water";
  if (tags.building) return "building";
  if (tags.landuse) return "landuse";
  if (["motorway", "trunk", "primary", "secondary"].includes(tags.highway)) return "major-road";
  if (tags.highway) return "road";
  return "landuse";
}

function project(lat: number, lng: number, bbox: ReturnType<typeof bboxFor>, width: number, height: number): Point {
  return {
    x: ((lng - bbox.west) / (bbox.east - bbox.west)) * width,
    y: ((bbox.north - lat) / (bbox.north - bbox.south)) * height,
  };
}

function polygon(points: Point[], fill: string, stroke: string, strokeWidth: number) {
  return `<path d="${pathData(points, true)}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>`;
}

function polyline(points: Point[], stroke: string, strokeWidth: number) {
  return `<path d="${pathData(points, false)}" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" opacity="0.9"/>`;
}

function pathData(points: Point[], close: boolean) {
  return `${points.map((point, index) => `${index === 0 ? "M" : "L"}${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(" ")}${close ? " Z" : ""}`;
}

function label(point: Point, text: string, fill: string) {
  return `<text x="${point.x.toFixed(1)}" y="${point.y.toFixed(1)}" font-family="Arial, sans-serif" font-size="42" fill="${fill}" opacity="0.58">${escapeXml(text)}</text>`;
}

function markerSvg(point: Point & { label?: string }, fill: string, bg: string) {
  return `<g transform="translate(${point.x.toFixed(1)} ${point.y.toFixed(1)})"><circle r="34" fill="${fill}"/><circle r="14" fill="${bg}"/>${point.label ? `<text y="72" text-anchor="middle" font-family="Arial, sans-serif" font-size="32" fill="${fill}">${escapeXml(point.label)}</text>` : ""}</g>`;
}

function fallbackFeatures(bbox: ReturnType<typeof bboxFor>): OverpassElement[] {
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

function formatCoordinates(lat: number, lng: number) {
  return `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? "N" : "S"} · ${Math.abs(lng).toFixed(4)}° ${lng >= 0 ? "E" : "W"}`;
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
