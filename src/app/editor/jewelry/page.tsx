"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { EditorHeader } from "@/components/editor/editor-header";
import { JewelryControls } from "@/components/editor/jewelry/jewelry-controls";
import { JewelryPreview } from "@/components/editor/jewelry/jewelry-preview";
import { useJewelryStore } from "@/store/jewelry-store";
import { useCartStore } from "@/store/cart-store";
import { toast } from "sonner";
import { JewelryCustomization } from "@/types";

function JewelryEditorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productSlug = searchParams.get("product");

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
        console.error("Failed to load product:", error);
        toast.error("Failed to load product information");
      });
  }, [productSlug]);

  // Load saved draft
  useEffect(() => {
    const savedState = localStorage.getItem("jewelry-editor-draft");
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        const store = useJewelryStore.getState();
        if (parsed.location) store.setLocation(parsed.location);
        if (parsed.date) store.setDate(new Date(parsed.date));
      } catch (error) {
        console.error("Failed to load saved state:", error);
      }
    }
  }, []);

  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      const state = useJewelryStore.getState();
      localStorage.setItem(
        "jewelry-editor-draft",
        JSON.stringify({
          location: state.location,
          date: state.date,
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
    if (!location) {
      toast.error("Please select a location");
      return;
    }

    if (!date) {
      toast.error("Please select a date");
      return;
    }

    if (!product || !selectedVariant) {
      toast.error("Please select a product variant");
      return;
    }

    try {
      const state = useJewelryStore.getState();

      // Extract material and chain length from variant name (e.g., "Gold - 16 inch")
      const variantParts = selectedVariant.name.split(" - ");
      const material = (variantParts[0]?.toLowerCase() || "silver") as
        | "gold"
        | "silver"
        | "rose-gold";
      const chainLength = variantParts[1] || "16 inch";

      const customizationData: JewelryCustomization = {
        date: state.date?.toISOString() || new Date().toISOString(),
        location: {
          lat: state.latitude || 0,
          lng: state.longitude || 0,
        },
        material,
        chainLength,
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
        previewImageUrl: "/images/products/necklace-1.jpg",
      });

      toast.success("Added to cart!");

      // Clear draft and reset editor
      localStorage.removeItem("jewelry-editor-draft");
      resetEditor();

      // Redirect to cart after short delay
      setTimeout(() => {
        router.push("/cart");
      }, 1000);
    } catch (error) {
      console.error("Failed to add to cart:", error);
      toast.error("Failed to add to cart");
    }
  };

  const finalPrice =
    product && selectedVariant
      ? product.basePrice + selectedVariant.priceModifier
      : 0;

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <EditorHeader
        title="Star Map Jewelry Designer"
        onSave={handleSaveDraft}
        onAddToCart={handleAddToCart}
        isSaving={isSaving}
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

export default function JewelryEditorPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <JewelryEditorPage />
    </Suspense>
  );
}
