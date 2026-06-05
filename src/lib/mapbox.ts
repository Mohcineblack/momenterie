export interface GeocodeResult {
  place_name: string;
  center: [number, number]; // [lng, lat]
}

export interface GeocodeResponse {
  type: 'FeatureCollection';
  features: GeocodeResult[];
}

/**
 * Geocode a location query using Nominatim (free)
 */
export async function geocodeLocation(query: string): Promise<GeocodeResponse> {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&accept-language=fr`,
    { headers: { 'User-Agent': 'Momenterie/1.0' } }
  );
  if (!res.ok) throw new Error('Geocoding failed');
  const data = await res.json();
  return {
    type: 'FeatureCollection',
    features: data.map((r: any) => ({
      place_name: r.display_name,
      center: [parseFloat(r.lon), parseFloat(r.lat)] as [number, number],
    })),
  };
}

/**
 * Reverse geocode coordinates using Nominatim (free)
 */
export async function reverseGeocode(lng: number, lat: number): Promise<GeocodeResponse> {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14&accept-language=fr`,
    { headers: { 'User-Agent': 'Momenterie/1.0' } }
  );
  if (!res.ok) throw new Error('Reverse geocoding failed');
  const data = await res.json();
  return {
    type: 'FeatureCollection',
    features: [{ place_name: data.display_name, center: [lng, lat] }],
  };
}
