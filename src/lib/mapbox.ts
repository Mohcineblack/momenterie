import mapboxgl from 'mapbox-gl';

if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
  throw new Error('NEXT_PUBLIC_MAPBOX_TOKEN is not defined');
}

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export interface GeocodeResult {
  place_name: string;
  center: [number, number]; // [lng, lat]
  bbox?: [number, number, number, number];
  context?: Array<{
    id: string;
    text: string;
  }>;
}

export interface GeocodeResponse {
  type: 'FeatureCollection';
  features: GeocodeResult[];
}

/**
 * Geocode a location query to get coordinates
 */
export async function geocodeLocation(query: string): Promise<GeocodeResponse> {
  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}&limit=5`
    );

    if (!response.ok) {
      throw new Error('Geocoding failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Error geocoding location:', error);
    throw error;
  }
}

/**
 * Reverse geocode coordinates to get address
 */
export async function reverseGeocode(lng: number, lat: number): Promise<GeocodeResponse> {
  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`
    );

    if (!response.ok) {
      throw new Error('Reverse geocoding failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    throw error;
  }
}

/**
 * Create a new Mapbox map instance
 */
export function createMapInstance(
  container: string | HTMLElement,
  options: {
    center: [number, number];
    zoom: number;
    style?: string;
    interactive?: boolean;
  }
) {
  return new mapboxgl.Map({
    container,
    style: options.style || 'mapbox://styles/mapbox/streets-v12',
    center: options.center,
    zoom: options.zoom,
    interactive: options.interactive !== false,
  });
}

/**
 * Capture map as image (returns data URL)
 */
export async function captureMapAsImage(map: mapboxgl.Map): Promise<string> {
  return new Promise((resolve) => {
    map.once('idle', () => {
      const canvas = map.getCanvas();
      resolve(canvas.toDataURL('image/png'));
    });
  });
}

/**
 * Available map styles
 */
export const MAP_STYLES = {
  streets: 'mapbox://styles/mapbox/streets-v12',
  light: 'mapbox://styles/mapbox/light-v11',
  dark: 'mapbox://styles/mapbox/dark-v11',
  satellite: 'mapbox://styles/mapbox/satellite-v9',
  satelliteStreets: 'mapbox://styles/mapbox/satellite-streets-v12',
  outdoors: 'mapbox://styles/mapbox/outdoors-v12',
  navigation: 'mapbox://styles/mapbox/navigation-day-v1',
  navigationNight: 'mapbox://styles/mapbox/navigation-night-v1',
} as const;

export type MapStyle = keyof typeof MAP_STYLES;
