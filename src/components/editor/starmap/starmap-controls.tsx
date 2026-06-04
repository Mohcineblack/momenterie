'use client';

import { useState } from 'react';
import { useStarMapStore } from '@/store/starmap-store';
import { STARMAP_STYLES } from '@/lib/render/styles';
import { Calendar, Clock, MapPin, Type, Star, Grid3x3 } from 'lucide-react';
import { geocodeLocation } from '@/lib/mapbox';
import { toast } from 'sonner';

export function StarMapControls() {
  const {
    location,
    date,
    time,
    title,
    subtitle,
    showConstellations,
    showGrid,
    style,
    setLocation,
    setDate,
    setTime,
    setTitle,
    setSubtitle,
    setShowConstellations,
    setShowGrid,
    setStyle,
  } = useStarMapStore();

  const [locationSearch, setLocationSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleLocationSearch = async () => {
    if (!locationSearch.trim()) {
      toast.error('Please enter a location');
      return;
    }

    setIsSearching(true);
    try {
      const result = await geocodeLocation(locationSearch);
      if (result.features && result.features.length > 0) {
        const feature = result.features[0];
        setLocation({
          lat: feature.center[1],
          lng: feature.center[0],
          placeName: feature.place_name,
        });
        toast.success('Location set successfully');
      } else {
        toast.error('Location not found');
      }
    } catch (error) {
      toast.error('Failed to find location');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Location */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <MapPin className="inline w-4 h-4 mr-1" />
          Location *
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={locationSearch}
            onChange={(e) => setLocationSearch(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLocationSearch()}
            placeholder="e.g., Paris, France"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
          <button
            onClick={handleLocationSearch}
            disabled={isSearching}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {isSearching ? 'Searching...' : 'Set'}
          </button>
        </div>
        {location && (
          <div className="mt-2 p-3 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm font-medium text-green-900">{location.placeName}</p>
            <p className="text-xs text-green-700 mt-1">
              {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
            </p>
          </div>
        )}
      </div>

      {/* Date */}
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
          <Calendar className="inline w-4 h-4 mr-1" />
          Date *
        </label>
        <input
          id="date"
          type="date"
          value={date.toISOString().split('T')[0]}
          onChange={(e) => setDate(new Date(e.target.value))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
        />
      </div>

      {/* Time */}
      <div>
        <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
          <Clock className="inline w-4 h-4 mr-1" />
          Time *
        </label>
        <input
          id="time"
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
        />
        <p className="text-xs text-gray-500 mt-1">Local time at the selected location</p>
      </div>

      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          <Type className="inline w-4 h-4 mr-1" />
          Title *
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Our First Date"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          maxLength={50}
        />
        <p className="text-xs text-gray-500 mt-1">{title.length}/50 characters</p>
      </div>

      {/* Subtitle */}
      <div>
        <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700 mb-2">
          Subtitle (optional)
        </label>
        <input
          id="subtitle"
          type="text"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          placeholder="e.g., A night to remember"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          maxLength={50}
        />
        <p className="text-xs text-gray-500 mt-1">{subtitle.length}/50 characters</p>
      </div>

      {/* Display Options */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Display Options
        </label>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={showConstellations}
              onChange={(e) => setShowConstellations(e.target.checked)}
              className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
            />
            <div>
              <span className="text-sm font-medium text-gray-900 flex items-center gap-2">
                <Star className="w-4 h-4" />
                Show Constellations
              </span>
              <p className="text-xs text-gray-500">Display constellation lines</p>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={showGrid}
              onChange={(e) => setShowGrid(e.target.checked)}
              className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
            />
            <div>
              <span className="text-sm font-medium text-gray-900 flex items-center gap-2">
                <Grid3x3 className="w-4 h-4" />
                Show Coordinate Grid
              </span>
              <p className="text-xs text-gray-500">Display celestial grid</p>
            </div>
          </label>
        </div>
      </div>

      {/* Style */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Map Style
        </label>
        <div className="grid grid-cols-2 gap-3">
          {STARMAP_STYLES.map((mapStyle) => (
            <button
              key={mapStyle.id}
              onClick={() => setStyle(mapStyle)}
              className={`relative p-3 rounded-lg border-2 transition-all ${
                style.id === mapStyle.id
                  ? 'border-gray-900 ring-2 ring-gray-900 ring-opacity-20'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* Color Preview */}
              <div className="flex gap-1 mb-2">
                <div
                  className="h-6 flex-1 rounded"
                  style={{ backgroundColor: mapStyle.colors.background }}
                />
                <div
                  className="h-6 flex-1 rounded"
                  style={{ backgroundColor: mapStyle.colors.stars }}
                />
                <div
                  className="h-6 flex-1 rounded"
                  style={{ backgroundColor: mapStyle.colors.constellation }}
                />
              </div>

              {/* Style Name */}
              <p className="text-xs font-medium text-center">{mapStyle.name}</p>

              {/* Selected Badge */}
              {style.id === mapStyle.id && (
                <div className="absolute top-1 right-1 w-5 h-5 bg-gray-900 rounded-full flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t pt-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">About Star Maps</h3>
        <ul className="text-xs text-gray-600 space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-gray-400">•</span>
            <span>Shows the exact position of stars at your chosen moment</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-gray-400">•</span>
            <span>Calculated using astronomical data</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-gray-400">•</span>
            <span>Includes major constellations and bright stars</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-gray-400">•</span>
            <span>Perfect for commemorating special moments</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
