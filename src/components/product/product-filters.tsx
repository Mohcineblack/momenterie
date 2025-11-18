'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SlidersHorizontal, X } from 'lucide-react';

interface ProductFiltersProps {
  categories?: Array<{ name: string; slug: string }>;
}

export function ProductFilters({ categories = [] }: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  const currentSort = searchParams.get('sortBy') || 'newest';
  const currentMinPrice = searchParams.get('minPrice') || '';
  const currentMaxPrice = searchParams.get('maxPrice') || '';

  const handleSortChange = (sortBy: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('sortBy', sortBy);
    router.push(`?${params.toString()}`);
  };

  const handlePriceFilter = (minPrice: string, maxPrice: string) => {
    const params = new URLSearchParams(searchParams);
    if (minPrice) params.set('minPrice', minPrice);
    else params.delete('minPrice');
    if (maxPrice) params.set('maxPrice', maxPrice);
    else params.delete('maxPrice');
    router.push(`?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push(window.location.pathname);
  };

  const sortOptions = [
    { value: 'newest', label: 'Newest' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'name-asc', label: 'Name: A to Z' },
    { value: 'name-desc', label: 'Name: Z to A' },
  ];

  const priceRanges = [
    { label: 'Under €25', min: '0', max: '25' },
    { label: '€25 - €50', min: '25', max: '50' },
    { label: '€50 - €100', min: '50', max: '100' },
    { label: 'Over €100', min: '100', max: '' },
  ];

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </button>
      </div>

      {/* Filters Sidebar */}
      <div
        className={`
        ${isOpen ? 'block' : 'hidden'} lg:block
        fixed lg:sticky top-0 left-0 z-40 lg:z-0
        w-full lg:w-64 h-full lg:h-auto
        bg-white lg:bg-transparent
        overflow-y-auto lg:overflow-visible
        p-6 lg:p-0
      `}
      >
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Filters</h3>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Sort By */}
          <div>
            <h3 className="font-semibold mb-3">Sort By</h3>
            <div className="space-y-2">
              {sortOptions.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="sort"
                    value={option.value}
                    checked={currentSort === option.value}
                    onChange={() => handleSortChange(option.value)}
                    className="w-4 h-4 text-gray-900 focus:ring-gray-900"
                  />
                  <span className="text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="pt-6 border-t">
            <h3 className="font-semibold mb-3">Price Range</h3>
            <div className="space-y-2">
              {priceRanges.map((range, index) => (
                <button
                  key={index}
                  onClick={() => handlePriceFilter(range.min, range.max)}
                  className={`
                    w-full text-left px-3 py-2 rounded-lg text-sm transition-colors
                    ${
                      currentMinPrice === range.min && currentMaxPrice === range.max
                        ? 'bg-gray-900 text-white'
                        : 'hover:bg-gray-100 text-gray-700'
                    }
                  `}
                >
                  {range.label}
                </button>
              ))}
            </div>

            {/* Custom Price Range */}
            <div className="mt-4 space-y-2">
              <label className="block text-sm text-gray-700">Custom Range</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={currentMinPrice}
                  onChange={(e) => handlePriceFilter(e.target.value, currentMaxPrice)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={currentMaxPrice}
                  onChange={(e) => handlePriceFilter(currentMinPrice, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Categories */}
          {categories.length > 0 && (
            <div className="pt-6 border-t">
              <h3 className="font-semibold mb-3">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <a
                    key={category.slug}
                    href={`/collections/${category.slug}`}
                    className="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    {category.name}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Clear Filters */}
          {(currentMinPrice || currentMaxPrice || currentSort !== 'newest') && (
            <button
              onClick={clearFilters}
              className="w-full px-4 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
            >
              Clear All Filters
            </button>
          )}
        </div>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
