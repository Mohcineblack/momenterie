"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { EditorHeader } from "@/components/editor/editor-header";
import { DatePrintControls } from "@/components/editor/dateprint/dateprint-controls";
import { DatePrintPreview } from "@/components/editor/dateprint/dateprint-preview";
import { useDatePrintStore } from "@/store/dateprint-store";
import { useCartStore } from "@/store/cart-store";
import { toast } from "sonner";
import { DatePrintCustomization } from "@/types";

function DatePrintEditorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productSlug = searchParams.get("product");

  const { addItem } = useCartStore();
  const { date, title, subtitle, style, resetEditor } = useDatePrintStore();

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
    const savedState = localStorage.getItem("dateprint-editor-draft");
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        const store = useDatePrintStore.getState();
        if (parsed.date) store.setDate(new Date(parsed.date));
        if (parsed.title) store.setTitle(parsed.title);
        if (parsed.subtitle) store.setSubtitle(parsed.subtitle);
        if (parsed.style) store.setStyle(parsed.style);
      } catch (error) {
        console.error("Failed to load saved state:", error);
      }
    }
  }, []);

  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      const state = useDatePrintStore.getState();
      localStorage.setItem(
        "dateprint-editor-draft",
        JSON.stringify({
          date: state.date,
          title: state.title,
          subtitle: state.subtitle,
          style: state.style,
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
    if (!date) {
      toast.error("Please select a date");
      return;
    }

    if (!title) {
      toast.error("Please enter a title");
      return;
    }

    if (!product || !selectedVariant) {
      toast.error("Please select a product variant");
      return;
    }

    try {
      const state = useDatePrintStore.getState();

      const customizationData: DatePrintCustomization = {
        date: state.date?.toISOString() || new Date().toISOString(),
        eventName: state.title,
        style: {
          typography: state.style.fontFamily,
          colorScheme: state.style.id,
        },
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
        previewImageUrl: "/images/products/date-print-preview.jpg",
      });

      toast.success("Added to cart!");

      // Clear draft and reset editor
      localStorage.removeItem("dateprint-editor-draft");
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
        title="Date Print Designer"
        onSave={handleSaveDraft}
        onAddToCart={handleAddToCart}
        isSaving={isSaving}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Panel - Controls */}
          <div className="space-y-6">
            <DatePrintControls
              product={product}
              selectedVariant={selectedVariant}
              onVariantChange={setSelectedVariant}
            />
          </div>

          {/* Right Panel - Preview */}
          <div className="lg:sticky lg:top-8 h-fit">
            <DatePrintPreview />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DatePrintEditorPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DatePrintEditorPage />
    </Suspense>
  );
}
