'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CityMapEditor } from '@/components/editor/citymap/citymap-editor';
import { CityMapPreview } from '@/components/editor/citymap/citymap-preview';
import { EditorHeader } from '@/components/editor/editor-header';
import { EditorControls } from '@/components/editor/citymap/editor-controls';
import { useCityMapStore } from '@/store/citymap-store';
import { ArrowLeft, Save, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useCartStore } from '@/store/cart-store';

export default function CityMapEditorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productSlug = searchParams.get('product');

  const { addItem } = useCartStore();
  const { location, title, subtitle, date, mapStyle, resetEditor } = useCityMapStore();

  const [mounted, setMounted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [product, setProduct] = useState<any>(null);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch product data
  useEffect(() => {
    if (!productSlug) return;

    fetch(`/api/products/${productSlug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setProduct(data.data);
          // Set default variant (first one or cheapest)
          if (data.data.variants && data.data.variants.length > 0) {
            const sortedVariants = [...data.data.variants].sort(
              (a, b) => a.priceModifier - b.priceModifier
            );
            setSelectedVariant(sortedVariants[0]);
          }
        }
      })
      .catch((error) => {
        console.error('Failed to load product:', error);
        toast.error('Failed to load product information');
      });
  }, [productSlug]);

  useEffect(() => {
    // Load saved state from localStorage if available
    const savedState = localStorage.getItem('citymap-editor-draft');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        // Restore state through store actions
      } catch (error) {
        console.error('Failed to load saved state:', error);
      }
    }
  }, []);

  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      const state = useCityMapStore.getState();
      localStorage.setItem('citymap-editor-draft', JSON.stringify({
        location: state.location,
        title: state.title,
        subtitle: state.subtitle,
        date: state.date,
        mapStyle: state.mapStyle,
        zoom: state.zoom,
      }));
      toast.success('Draft saved successfully');
    } catch (error) {
      toast.error('Failed to save draft');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddToCart = async () => {
    if (!location) {
      toast.error('Please select a location on the map');
      return;
    }

    if (!title) {
      toast.error('Please enter a title for your map');
      return;
    }

    if (!product || !selectedVariant) {
      toast.error('Product information is not loaded yet');
      return;
    }

    try {
      const customizationData = {
        location: {
          lat: location.lat,
          lng: location.lng,
          placeName: location.placeName,
        },
        title,
        subtitle,
        date,
        mapStyle: {
          id: mapStyle.id,
          name: mapStyle.name,
        },
        zoom: useCityMapStore.getState().zoom,
      };

      addItem({
        id: `${product.id}-${selectedVariant.id}-${Date.now()}`,
        productId: product.id,
        variantId: selectedVariant.id,
        quantity: 1,
        customizationData,
      });

      toast.success('Added to cart!');

      // Clear draft and reset editor
      localStorage.removeItem('citymap-editor-draft');
      resetEditor();

      // Redirect to cart
      router.push('/cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <EditorHeader
        title="City Map Editor"
        onSave={handleSaveDraft}
        onAddToCart={handleAddToCart}
        isSaving={isSaving}
      />

      {/* Main Editor Layout */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Controls */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h2 className="text-xl font-bold mb-4">Customize Your Map</h2>
              <EditorControls />
            </div>
          </div>

          {/* Right Column - Map Editor & Preview */}
          <div className="lg:col-span-2 space-y-6">
            {/* Interactive Map Editor */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 border-b">
                <h3 className="font-semibold">Map Position</h3>
                <p className="text-sm text-gray-600">
                  Search for a location and adjust the map to your preferred view
                </p>
              </div>
              <div className="relative" style={{ height: '500px' }}>
                <CityMapEditor />
              </div>
            </div>

            {/* Preview Card */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 border-b">
                <h3 className="font-semibold">Preview</h3>
                <p className="text-sm text-gray-600">
                  This is how your final print will look
                </p>
              </div>
              <div className="p-6 bg-gray-50">
                <CityMapPreview />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Footer Actions */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4">
        <div className="flex gap-3">
          <button
            onClick={handleSaveDraft}
            disabled={isSaving}
            className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-900 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            Save Draft
          </button>
          <button
            onClick={handleAddToCart}
            className="flex-1 px-4 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-5 h-5" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
