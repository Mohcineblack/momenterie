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
    try {
      m.setPaintProperty('background', 'background-color', colors.land);
      m.getLayer('water') && m.setPaintProperty('water', 'fill-color', colors.water);

      const roadLayers = ['road-street', 'road-minor', 'road-secondary-tertiary', 'road-simple'];
      roadLayers.forEach(id => { m.getLayer(id) && m.setPaintProperty(id, 'line-color', colors.roads); });

      const majorRoadLayers = ['road-primary', 'road-motorway-trunk', 'road-major-link'];
      majorRoadLayers.forEach(id => { m.getLayer(id) && m.setPaintProperty(id, 'line-color', colors.majorRoads); });

      m.getLayer('building') && m.setPaintProperty('building', 'fill-color', colors.buildings);

      const landuseLayers = ['landuse', 'national-park', 'landcover'];
      landuseLayers.forEach(id => { m.getLayer(id) && m.setPaintProperty(id, 'fill-color', colors.landuse); });

      const labelLayers = m.getStyle()?.layers?.filter(l => l.type === 'symbol') || [];
      labelLayers.forEach(l => {
        try { m.setPaintProperty(l.id, 'text-color', colors.text); } catch {}
      });
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
      {/* Search Bar */}
      <div className="absolute top-4 left-4 right-4 z-10">
        <div className="relative bg-white rounded-lg shadow-lg">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                handleSearch(e.target.value);
              }}
              onFocus={() => searchResults.length > 0 && setShowResults(true)}
              placeholder="Search for a location..."
              className="w-full pl-12 pr-12 py-3 rounded-lg border-none focus:ring-2 focus:ring-gray-900"
            />
            {isSearching && (
              <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 animate-spin" />
            )}
          </div>

          {/* Search Results */}
          {showResults && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-64 overflow-y-auto">
              {searchResults.map((result) => (
                <button
                  key={result.id}
                  onClick={() => handleSelectResult(result)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                >
                  <p className="text-sm font-medium text-gray-900">
                    {result.place_name.split(',')[0]}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {result.place_name.split(',').slice(1).join(',')}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Map Container */}
      <div ref={mapContainer} className="w-full h-full" />

      {/* Instructions */}
      {!location && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-full text-sm shadow-lg">
          Click on the map or search for a location
        </div>
      )}
    </div>
  );
}
