"use client";

import { useState, useEffect } from "react";
import { MapPin, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface LocationSearchProps {
  onLocationSelect: (location: {
    name: string;
    lat: number;
    lng: number;
  }) => void;
  placeholder?: string;
}

export function LocationSearch({
  onLocationSelect,
  placeholder = "Search location...",
}: LocationSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (query.length < 3) {
      setResults([]);
      return;
    }

    const searchLocation = async () => {
      setIsSearching(true);
      try {
        // Using Mapbox Geocoding API
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            query
          )}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}&limit=5`
        );
        const data = await response.json();
        setResults(data.features || []);
        setShowResults(true);
      } catch (error) {
        console.error("Error searching location:", error);
      } finally {
        setIsSearching(false);
      }
    };

    const debounce = setTimeout(searchLocation, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleSelectLocation = (result: any) => {
    const [lng, lat] = result.center;
    onLocationSelect({
      name: result.place_name,
      lat,
      lng,
    });
    setQuery(result.place_name);
    setShowResults(false);
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="pl-10"
          onFocus={() => results.length > 0 && setShowResults(true)}
        />
      </div>

      {showResults && results.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {results.map((result) => (
            <button
              key={result.id}
              onClick={() => handleSelectLocation(result)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-start gap-3 border-b last:border-b-0"
            >
              <MapPin className="w-4 h-4 text-gray-400 mt-1 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {result.text}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {result.place_name}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {isSearching && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
