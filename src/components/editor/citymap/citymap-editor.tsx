'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useCityMapStore } from '@/store/citymap-store';
import { Search, Loader2 } from 'lucide-react';

// Set Mapbox access token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

interface SearchResult {
  id: string;
  place_name: string;
  center: [number, number];
}

export function CityMapEditor() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);

  const { location, setLocation, setZoom, zoom, mapStyle } = useCityMapStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [13.4050, 52.5200], // Berlin default
      zoom: 13,
      attributionControl: false,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Apply style colors once map loads
    map.current.on('style.load', () => {
      applyStyleColors();
    });

    // Add zoom change listener
    map.current.on('zoom', () => {
      if (map.current) {
        setZoom(map.current.getZoom());
      }
    });

    // Initialize marker (hidden initially)
    marker.current = new mapboxgl.Marker({
      color: '#1a1a1a',
      draggable: true,
    });

    // Handle marker drag
    marker.current.on('dragend', async () => {
      if (marker.current) {
        const lngLat = marker.current.getLngLat();

        // Reverse geocode to get place name
        try {
          const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${lngLat.lng},${lngLat.lat}.json?access_token=${mapboxgl.accessToken}`
          );
          const data = await response.json();

          if (data.features && data.features.length > 0) {
            setLocation({
              lat: lngLat.lat,
              lng: lngLat.lng,
              placeName: data.features[0].place_name,
            });
          }
        } catch (error) {
          console.error('Reverse geocoding failed:', error);
          setLocation({
            lat: lngLat.lat,
            lng: lngLat.lng,
            placeName: `${lngLat.lat.toFixed(4)}, ${lngLat.lng.toFixed(4)}`,
          });
        }
      }
    });

    // Handle map click to place marker
    map.current.on('click', async (e) => {
      const { lng, lat } = e.lngLat;

      // Reverse geocode
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}`
        );
        const data = await response.json();

        if (data.features && data.features.length > 0) {
          setLocation({
            lat,
            lng,
            placeName: data.features[0].place_name,
          });

          // Place marker
          if (marker.current && map.current) {
            marker.current.setLngLat([lng, lat]).addTo(map.current);
          }
        }
      } catch (error) {
        console.error('Reverse geocoding failed:', error);
      }
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Update marker position when location changes
  useEffect(() => {
    if (location && map.current && marker.current) {
      marker.current.setLngLat([location.lng, location.lat]).addTo(map.current);
      map.current.flyTo({
        center: [location.lng, location.lat],
        zoom: zoom,
        duration: 1000,
      });
    }
  }, [location]);

  // Apply map style colors when style changes
  useEffect(() => {
    applyStyleColors();
  }, [mapStyle.id]);

  function applyStyleColors() {
    const m = map.current;
    if (!m || !m.isStyleLoaded()) return;

    const colors = mapStyle.colors;
    const layers = m.getStyle()?.layers || [];

    try {
      // Set background
      if (m.getLayer('background')) m.setPaintProperty('background', 'background-color', colors.land);

      for (const layer of layers) {
        const id = layer.id;
        const type = layer.type;

        // Hide all POI, label, icon layers for a clean map look
        if (type === 'symbol') {
          m.setLayoutProperty(id, 'visibility', 'none');
          continue;
        }

        // Water fills
        if (id.includes('water') && type === 'fill') {
          m.setPaintProperty(id, 'fill-color', colors.water);
          continue;
        }

        // Road lines
        if ((id.includes('road') || id.includes('bridge') || id.includes('tunnel')) && type === 'line') {
          const isMajor = id.includes('motorway') || id.includes('trunk') || id.includes('primary');
          m.setPaintProperty(id, 'line-color', isMajor ? colors.majorRoads : colors.roads);
          m.setPaintProperty(id, 'line-opacity', 0.9);
          continue;
        }

        // Building fills
        if (id.includes('building') && type === 'fill') {
          m.setPaintProperty(id, 'fill-color', colors.buildings);
          continue;
        }

        // Landuse/landcover/park fills
        if ((id.includes('landuse') || id.includes('landcover') || id.includes('park') || id.includes('national')) && type === 'fill') {
          m.setPaintProperty(id, 'fill-color', colors.landuse);
          continue;
        }

        // Hide everything else that's a fill we didn't handle (transit, etc)
        if (type === 'fill' && !id.includes('water') && !id.includes('building') && !id.includes('land')) {
          m.setPaintProperty(id, 'fill-opacity', 0.3);
        }
      }
    } catch {}
  }

  // Search functionality
  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          query
        )}.json?access_token=${mapboxgl.accessToken}&limit=5&types=place,locality,neighborhood,address`
      );
      const data = await response.json();

      if (data.features) {
        setSearchResults(data.features);
        setShowResults(true);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectResult = (result: SearchResult) => {
    const [lng, lat] = result.center;

    setLocation({
      lat,
      lng,
      placeName: result.place_name,
    });

    setSearchQuery(result.place_name);
    setShowResults(false);

    // Fly to location
    if (map.current) {
      map.current.flyTo({
        center: [lng, lat],
        zoom: 13,
        duration: 2000,
      });
    }

    // Place marker
    if (marker.current && map.current) {
      marker.current.setLngLat([lng, lat]).addTo(map.current);
    }
  };

  return (
    <div className="relative w-full h-full">
      {/* Map Container */}
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
}
