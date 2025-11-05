'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { EditorHeader } from '@/components/editor/editor-header';
import { JewelryControls } from '@/components/editor/jewelry/jewelry-controls';
import { JewelryPreview } from '@/components/editor/jewelry/jewelry-preview';
import { useJewelryStore } from '@/store/jewelry-store';
import { useCartStore } from '@/store/cart-store';
import { toast } from 'sonner';
import { Save, ShoppingCart } from 'lucide-react';

export default function JewelryEditorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productSlug = searchParams.get('product');

  const { addItem } = useCartStore();
  const { location, date, resetEditor } = useJewelryStore();

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
    const savedState = localStorage.getItem('jewelry-editor-draft');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        const store = useJewelryStore.getState();
        if (parsed.location) store.setLocation(parsed.location);
        if (parsed.date) store.setDate(new Date(parsed.date));
      } catch (error) {
        console.error('Failed to load saved state:', error);
      }
    }
  }, []);

  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      const state = useJewelryStore.getState();
      localStorage.setItem(
        'jewelry-editor-draft',
        JSON.stringify({
          location: state.location,
          date: state.date,
        })
      );
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

    if (!date) {
      toast.error('Please select a date');
      return;
    }

    if (!product || !selectedVariant) {
      toast.error('Please select a product variant');
      return;
    }

    try {
      const state = useJewelryStore.getState();

      // Generate preview image (simplified for jewelry)
      const previewData = {
        location: state.location,
        date: state.date?.toISOString(),
        variant: selectedVariant.name,
      };

      const customizationData = {
        location: state.location,
        date: state.date?.toISOString(),
        variant: selectedVariant.name,
      };

      addItem({
        productId: product.id,
        productName: product.name,
        productSlug: product.slug,
        variantId: selectedVariant.id,
        variantName: selectedVariant.name,
        quantity: 1,
        price: product.basePrice + selectedVariant.priceModifier,
        customizationData,
        previewImageUrl: '/images/products/necklace-1.jpg', // Use default image for now
      });

      toast.success('Added to cart!');

      // Clear draft and reset editor
      localStorage.removeItem('jewelry-editor-draft');
      resetEditor();

      // Redirect to cart after short delay
      setTimeout(() => {
        router.push('/cart');
      }, 1000);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast.error('Failed to add to cart');
    }
  };

  const finalPrice = product && selectedVariant
    ? product.basePrice + selectedVariant.priceModifier
    : 0;

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <EditorHeader
        title="Star Map Jewelry Designer"
        productName={product?.name || 'Loading...'}
        price={finalPrice}
        onSaveDraft={handleSaveDraft}
        isSaving={isSaving}
        onAddToCart={handleAddToCart}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Panel - Controls */}
          <div className="space-y-6">
            <JewelryControls
              product={product}
              selectedVariant={selectedVariant}
              onVariantChange={setSelectedVariant}
            />
          </div>

          {/* Right Panel - Preview */}
          <div className="lg:sticky lg:top-8 h-fit">
            <JewelryPreview />
          </div>
        </div>
      </div>
    </div>
  );
}
