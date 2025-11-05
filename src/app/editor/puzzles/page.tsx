"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { EditorHeader } from "@/components/editor/editor-header";
import { PuzzleUploader } from "@/components/editor/puzzle/puzzle-uploader";
import { PuzzleControls } from "@/components/editor/puzzle/puzzle-controls";
import { PuzzlePreview } from "@/components/editor/puzzle/puzzle-preview";
import { usePuzzleStore } from "@/store/puzzle-store";
import { useCartStore } from "@/store/cart-store";
import { toast } from "sonner";
import { PuzzleCustomization } from "@/types";
import { Save, ShoppingCart } from "lucide-react";

function PuzzleEditorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productSlug = searchParams.get("product");

  const { addItem } = useCartStore();
  const { imageUrl, pieces, finish, resetEditor } = usePuzzleStore();

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
          // Find variant that matches piece count, or use first variant
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

  // Load saved draft
  useEffect(() => {
    const savedState = localStorage.getItem("puzzle-editor-draft");
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        if (parsed.imageUrl) {
          const { setImage, setPieces, setFinish } = usePuzzleStore.getState();
          // Note: Can't restore File object from localStorage
          // User will need to re-upload if they refresh
          setPieces(parsed.pieces || 252);
          setFinish(parsed.finish || "glossy");
        }
      } catch (error) {
        console.error("Failed to load saved state:", error);
      }
    }
  }, []);

  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      const state = usePuzzleStore.getState();
      localStorage.setItem(
        "puzzle-editor-draft",
        JSON.stringify({
          imageUrl: state.imageUrl,
          pieces: state.pieces,
          finish: state.finish,
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
      toast.error("Please upload an image for your puzzle");
      return;
    }

    if (!product || !selectedVariant) {
      toast.error("Product information is not loaded yet");
      return;
    }

    try {
      const customizationData: PuzzleCustomization = {
        imageUrl,
        pieceCount: pieces,
      };

      addItem({
        productId: product.id,
        productName: product.name,
        productSlug: product.slug,
        variantId: selectedVariant.id,
        variantName: selectedVariant.name,
        quantity: 1,
        basePrice: parseFloat(product.price),
        variantPrice: parseFloat(selectedVariant.price),
        customizationData,
        previewImageUrl: imageUrl,
      });

      toast.success("Added to cart!");

      // Clear draft and reset editor
      localStorage.removeItem("puzzle-editor-draft");
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
        title="Puzzle Editor"
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
              <h2 className="text-xl font-bold mb-4">Customize Your Puzzle</h2>
              <PuzzleControls />
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
                    Choose a high-quality image for the best puzzle quality
                  </p>
                </div>
                <div className="p-6">
                  <PuzzleUploader />
                </div>
              </div>
            )}

            {/* Preview */}
            {imageUrl && (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 border-b">
                  <h3 className="font-semibold">Preview</h3>
                  <p className="text-sm text-gray-600">
                    This is how your puzzle will look
                  </p>
                </div>
                <div className="p-6 bg-gray-50">
                  <PuzzlePreview />
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

export default function PuzzleEditorPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PuzzleEditorPage />
    </Suspense>
  );
}
