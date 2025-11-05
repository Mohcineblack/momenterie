'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { EditorHeader } from '@/components/editor/editor-header';
import { StarMapControls } from '@/components/editor/starmap/starmap-controls';
import { StarMapCanvas } from '@/components/editor/starmap/starmap-canvas';
import { StarMapPreview } from '@/components/editor/starmap/starmap-preview';
import { useStarMapStore } from '@/store/starmap-store';
import { useCartStore } from '@/store/cart-store';
import { toast } from 'sonner';
import { Save, ShoppingCart } from 'lucide-react';

export default function StarMapEditorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productSlug = searchParams.get('product');

  const { addItem } = useCartStore();
  const { location, date, time, title, subtitle, style, showConstellations, showGrid, resetEditor } =
    useStarMapStore();

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

  // Load saved draft
  useEffect(() => {
    const savedState = localStorage.getItem('starmap-editor-draft');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        const store = useStarMapStore.getState();
        if (parsed.location) store.setLocation(parsed.location);
        if (parsed.date) store.setDate(new Date(parsed.date));
        if (parsed.time) store.setTime(parsed.time);
        if (parsed.title) store.setTitle(parsed.title);
        if (parsed.subtitle) store.setSubtitle(parsed.subtitle);
      } catch (error) {
        console.error('Failed to load saved state:', error);
      }
    }
  }, []);

  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      const state = useStarMapStore.getState();
      localStorage.setItem('starmap-editor-draft', JSON.stringify({
        location: state.location,
        date: state.date,
        time: state.time,
        title: state.title,
        subtitle: state.subtitle,
        showConstellations: state.showConstellations,
        showGrid: state.showGrid,
        style: { id: state.style.id, name: state.style.name },
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
      toast.error('Please select a location');
      return;
    }

    if (!title) {
      toast.error('Please enter a title for your star map');
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
        date: date.toISOString(),
        time,
        title,
        subtitle,
        showConstellations,
        showGrid,
        style: {
          id: style.id,
          name: style.name,
        },
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
      localStorage.removeItem('starmap-editor-draft');
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
        title="Star Map Editor"
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
              <h2 className="text-xl font-bold mb-4">Customize Your Star Map</h2>
              <StarMapControls />
            </div>
          </div>

          {/* Right Column - Canvas & Preview */}
          <div className="lg:col-span-2 space-y-6">
            {/* Star Canvas */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 border-b">
                <h3 className="font-semibold">Night Sky Simulation</h3>
                <p className="text-sm text-gray-600">
                  View the stars as they appeared at your chosen moment
                </p>
              </div>
              <div className="p-6 bg-gray-900">
                <StarMapCanvas />
              </div>
            </div>

            {/* Preview */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 border-b">
                <h3 className="font-semibold">Preview</h3>
                <p className="text-sm text-gray-600">
                  This is how your final print will look
                </p>
              </div>
              <div className="p-6 bg-gray-50">
                <StarMapPreview />
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
