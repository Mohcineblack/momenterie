"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { EditorHeader } from "@/components/editor/editor-header";
import { PhotoPrintUploader } from "@/components/editor/photoprint/photoprint-uploader";
import { PhotoPrintControls } from "@/components/editor/photoprint/photoprint-controls";
import { PhotoPrintPreview } from "@/components/editor/photoprint/photoprint-preview";
import { usePhotoPrintStore } from "@/store/photoprint-store";
import { useCartStore } from "@/store/cart-store";
import { toast } from "sonner";
import { PhotoPrintCustomization } from "@/types";
import { Save, ShoppingCart } from "lucide-react";

function PhotoPrintEditorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productSlug = searchParams.get("product");

  const { addItem } = useCartStore();
  const { imageUrl, size, frame, resetEditor } = usePhotoPrintStore();

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
        console.error("Failed to load product:", error);
        toast.error("Failed to load product information");
      });
  }, [productSlug]);

  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      const state = usePhotoPrintStore.getState();
      localStorage.setItem(
        "photoprint-editor-draft",
        JSON.stringify({
          imageUrl: state.imageUrl,
          size: state.size,
          frame: state.frame,
        })
      );
      toast.success("Draft saved successfully");
    } catch (error) {
      toast.error("Failed to save draft");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddToCart = async () => {
    if (!imageUrl) {
      toast.error("Please upload a photo");
      return;
    }

    if (!product || !selectedVariant) {
      toast.error("Product information is not loaded yet");
      return;
    }

    try {
      const customizationData: PhotoPrintCustomization = {
        imageUrl,
      };

      addItem({
        productId: product.id,
        productName: product.name,
        productSlug: product.slug,
        variantId: selectedVariant.id,
        variantName: selectedVariant.name,
        quantity: 1,
        basePrice: product.basePrice,
        variantPrice: selectedVariant.priceModifier,
        customizationData,
        previewImageUrl: imageUrl,
      });

      toast.success("Added to cart!");

      // Clear draft and reset editor
      localStorage.removeItem("photoprint-editor-draft");
      resetEditor();

      // Redirect to cart
      router.push("/cart");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart");
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
        title="Photo Print Editor"
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
              <h2 className="text-xl font-bold mb-4">Customize Your Print</h2>
              <PhotoPrintControls />
            </div>
          </div>

          {/* Right Column - Upload & Preview */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Uploader */}
            {!imageUrl && (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 border-b">
                  <h3 className="font-semibold">Upload Your Photo</h3>
                  <p className="text-sm text-gray-600">
                    Choose a high-quality image for the best print quality
                  </p>
                </div>
                <div className="p-6">
                  <PhotoPrintUploader />
                </div>
              </div>
            )}

            {/* Preview */}
            {imageUrl && (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 border-b">
                  <h3 className="font-semibold">Preview</h3>
                  <p className="text-sm text-gray-600">
                    This is how your print will look
                  </p>
                </div>
                <div className="p-6 bg-gray-50">
                  <PhotoPrintPreview />
                </div>
              </div>
            )}
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

export default function PhotoPrintEditorPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PhotoPrintEditorPage />
    </Suspense>
  );
}
