'use client';

import { useEffect, useRef, useState } from 'react';
import { useCityMapStore } from '@/store/citymap-store';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

export function CityMapPreview() {
  const previewContainer = useRef<HTMLDivElement>(null);
  const previewMap = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const { location, title, subtitle, date, mapStyle, zoom } = useCityMapStore();

  // Initialize preview map
  useEffect(() => {
    if (!previewContainer.current || !location) return;

    // Clean up existing map
    if (previewMap.current) {
      previewMap.current.remove();
    }

    // Create new map
    previewMap.current = new mapboxgl.Map({
      container: previewContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [location.lng, location.lat],
      zoom: zoom,
      interactive: false, // Disable interactions for preview
      attributionControl: false,
    });

    previewMap.current.on('load', () => {
      setMapLoaded(true);
    });

    return () => {
      if (previewMap.current) {
        previewMap.current.remove();
        previewMap.current = null;
      }
    };
  }, [location]);

  // Update map style colors
  useEffect(() => {
    if (!previewMap.current || !mapLoaded) return;

    try {
      // Apply custom colors to map layers
      const map = previewMap.current;

      // Water
      if (map.getLayer('water')) {
        map.setPaintProperty('water', 'fill-color', mapStyle.colors.water);
      }

      // Land/background
      if (map.getLayer('land')) {
        map.setPaintProperty('land', 'fill-color', mapStyle.colors.land);
      }

      // Roads
      if (map.getLayer('road')) {
        map.setPaintProperty('road', 'line-color', mapStyle.colors.roads);
      }

      // Buildings
      if (map.getLayer('building')) {
        map.setPaintProperty('building', 'fill-color', mapStyle.colors.buildings);
      }

      // Labels
      const labelLayers = ['place-city', 'place-town', 'poi-label', 'road-label'];
      labelLayers.forEach((layerId) => {
        if (map.getLayer(layerId)) {
          map.setPaintProperty(layerId, 'text-color', mapStyle.colors.text);
        }
      });
    } catch (error) {
      console.error('Error applying map styles:', error);
    }
  }, [mapStyle, mapLoaded]);

  // Update map position and zoom
  useEffect(() => {
    if (!previewMap.current || !location) return;

    previewMap.current.jumpTo({
      center: [location.lng, location.lat],
      zoom: zoom,
    });
  }, [location, zoom]);

  if (!location) {
    return (
      <div
        className="w-full rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center"
        style={{
          aspectRatio: '2/3',
          backgroundColor: '#f9f9f9',
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
          <p className="text-sm text-gray-500">
            Search for a location on the map to see your preview
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full mx-auto max-w-md">
      <div
        className="relative rounded-lg overflow-hidden shadow-xl"
        style={{
          aspectRatio: '2/3',
          backgroundColor: mapStyle.colors.background,
        }}
      >
        {/* Map Section (70% of height) */}
        <div className="absolute top-0 left-0 right-0" style={{ height: '70%' }}>
          <div
            ref={previewContainer}
            className="w-full h-full"
            style={{ filter: 'contrast(1.1) saturate(0.9)' }}
          />

          {/* Loading overlay */}
          {!mapLoaded && (
            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        {/* Text Section (30% of height) */}
        <div
          className="absolute bottom-0 left-0 right-0 flex flex-col items-center justify-center px-8 py-6"
          style={{
            height: '30%',
            backgroundColor: mapStyle.colors.background,
            color: mapStyle.colors.text,
          }}
        >
          {/* Title */}
          {title && (
            <h2
              className="text-2xl font-bold text-center mb-2"
              style={{ color: mapStyle.colors.text }}
            >
              {title}
            </h2>
          )}

          {/* Subtitle */}
          {subtitle && (
            <p
              className="text-sm text-center mb-1 opacity-80"
              style={{ color: mapStyle.colors.text }}
            >
              {subtitle}
            </p>
          )}

          {/* Date */}
          {date && (
            <p
              className="text-xs text-center opacity-60"
              style={{ color: mapStyle.colors.text }}
            >
              {date}
            </p>
          )}

          {/* Coordinates */}
          <div className="mt-3 flex items-center gap-2 text-xs opacity-50">
            <span style={{ color: mapStyle.colors.text }}>
              {location.lat.toFixed(4)}° N
            </span>
            <span style={{ color: mapStyle.colors.text }}>•</span>
            <span style={{ color: mapStyle.colors.text }}>
              {location.lng.toFixed(4)}° E
            </span>
          </div>
        </div>
      </div>

      {/* Frame Shadow */}
      <div className="absolute inset-0 rounded-lg shadow-2xl pointer-events-none border-8 border-white"></div>
    </div>
  );
}
