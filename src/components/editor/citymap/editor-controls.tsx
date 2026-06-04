'use client';

import { useCityMapStore } from '@/store/citymap-store';
import { MAP_STYLES } from '@/lib/render/styles';
import { Calendar, Type, MapPin } from 'lucide-react';

export function EditorControls() {
  const {
    location,
    title,
    subtitle,
    date,
    mapStyle,
    setTitle,
    setSubtitle,
    setDate,
    setMapStyle,
  } = useCityMapStore();

  return (
    <div className="space-y-6">
      {/* Location Info */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <MapPin className="inline w-4 h-4 mr-1" />
          Selected Location
        </label>
        {location ? (
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm font-medium text-gray-900">{location.placeName}</p>
            <p className="text-xs text-gray-500 mt-1">
              {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
            </p>
          </div>
        ) : (
          <p className="text-sm text-gray-500 p-3 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            Search for a location on the map
          </p>
        )}
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
          placeholder="e.g., Berlin, Germany"
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
          placeholder="e.g., Where we first met"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          maxLength={50}
        />
        <p className="text-xs text-gray-500 mt-1">{subtitle.length}/50 characters</p>
      </div>

      {/* Date */}
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
          <Calendar className="inline w-4 h-4 mr-1" />
          Date (optional)
        </label>
        <input
          id="date"
          type="text"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          placeholder="e.g., July 15, 2024"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          maxLength={30}
        />
        <p className="text-xs text-gray-500 mt-1">Format: Month Day, Year</p>
      </div>

      {/* Map Style */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Map Style
        </label>
        <div className="grid grid-cols-2 gap-3">
          {MAP_STYLES.map((style) => (
            <button
              key={style.id}
              onClick={() => setMapStyle(style)}
              className={`relative p-3 rounded-lg border-2 transition-all ${
                mapStyle.id === style.id
                  ? 'border-gray-900 ring-2 ring-gray-900 ring-opacity-20'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* Color Preview */}
              <div className="grid grid-cols-3 gap-1 mb-2">
                <div
                  className="h-6 rounded"
                  style={{ backgroundColor: style.colors.background }}
                />
                <div
                  className="h-6 rounded"
                  style={{ backgroundColor: style.colors.land }}
                />
                <div
                  className="h-6 rounded"
                  style={{ backgroundColor: style.colors.water }}
                />
              </div>

              {/* Style Name */}
              <p className="text-xs font-medium text-center">{style.name}</p>

              {/* Selected Badge */}
              {mapStyle.id === style.id && (
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
        <h3 className="text-sm font-medium text-gray-700 mb-2">Tips</h3>
        <ul className="text-xs text-gray-600 space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-gray-400">•</span>
            <span>Search for your location using the search bar on the map</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-gray-400">•</span>
            <span>Drag the map to adjust the position and zoom level</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-gray-400">•</span>
            <span>Choose a style that matches your interior decor</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-gray-400">•</span>
            <span>Add a meaningful title and date to personalize your map</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
