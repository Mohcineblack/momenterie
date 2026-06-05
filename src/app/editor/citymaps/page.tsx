"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CityMapEditor as CityMapEditorComponent } from "@/components/editor/citymap/citymap-editor";
import { CityMapPreview } from "@/components/editor/citymap/citymap-preview";
import { EditorControls } from "@/components/editor/citymap/editor-controls";
import { FrameUpsell } from "@/components/editor/frame-upsell";
import { useCityMapStore } from "@/store/citymap-store";
import { toast } from "sonner";
import { useCartStore } from "@/store/cart-store";
import { formatPrice } from "@/lib/utils";
import type { CitymapSpec } from "@/lib/render/spec";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import Link from "next/link";

function CityMapEditorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productSlug = searchParams.get("product");

  const { addItem } = useCartStore();
  const { location, title, subtitle, date, mapStyle, zoom, resetEditor } = useCityMapStore();

  const [mounted, setMounted] = useState(false);
  const [product, setProduct] = useState<any>(null);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [frameColor, setFrameColor] = useState("black");

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!productSlug) return;
    fetch(`/api/products/${productSlug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setProduct(data.data);
          if (data.data.variants?.length > 0) {
            const sorted = [...data.data.variants].sort((a: any, b: any) => a.priceModifier - b.priceModifier);
            setSelectedVariant(sorted[0]);
          }
        }
      })
      .catch(() => toast.error("Failed to load product"));
  }, [productSlug]);

  const handleAddToCart = () => {
    if (!location) { toast.error("Please select a location"); return; }
    if (!title) { toast.error("Please enter a title"); return; }
    if (!product || !selectedVariant) { toast.error("Product not loaded"); return; }

    const customizationData: CitymapSpec = {
      productType: "citymap",
      location, zoom, bearing: 0,
      mapStyleId: mapStyle.id, title, subtitle, date,
      showCoordinates: true, markers: [], photoUrls: [],
      size: selectedVariant.size || "30x40",
      material: (selectedVariant.material || "poster").toLowerCase(),
      ...(selectedVariant.material === "Framed" && { frameColor }),
    };

    addItem({
      productId: product.id, productName: product.name, productSlug: product.slug,
      variantId: selectedVariant.id, variantName: selectedVariant.name,
      quantity: 1, basePrice: product.basePrice, variantPrice: selectedVariant.priceModifier,
      customizationData,
    });

    toast.success("Added to cart!");
    localStorage.removeItem("citymap-editor-draft");
    resetEditor();
    router.push("/cart");
  };

  if (!mounted) return <div className="min-h-screen flex items-center justify-center bg-surface"><p className="font-sans text-on-surface-variant">Loading editor...</p></div>;

  const currentPrice = product ? product.basePrice + (selectedVariant?.priceModifier || 0) : 0;

  return (
    <div className="flex flex-col min-h-screen bg-surface md:flex-row -mt-[72px] pt-[72px]">
      {/* Mobile header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-outline-variant">
        <Link href={`/products/${productSlug || "custom-city-map"}`} className="text-on-surface-variant hover:text-primary">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <span className="font-serif font-medium text-primary">City Map Studio</span>
        <div className="w-5" />
      </div>

      {/* Left: The poster frame with the map INSIDE it */}
      <div className="flex-1 flex flex-col items-center justify-start bg-surface-container-lowest p-6 md:p-12 overflow-y-auto">
        <div className="hidden md:flex items-center self-start mb-6">
          <Link href={`/products/${productSlug || "custom-city-map"}`} className="flex items-center gap-2 text-on-surface-variant hover:text-primary text-sm font-sans tracking-wide">
            <ArrowLeft className="w-4 h-4" /> Back to Product
          </Link>
        </div>

        {/* The poster frame — map is rendered inside */}
        <div className="w-full max-w-[480px] border border-outline-variant shadow-2xl bg-white">
          {/* Map area (interactive — user drags to position) */}
          <div className="relative w-full" style={{ aspectRatio: "1/1" }}>
            <CityMapEditorComponent />
          </div>

          {/* Text area below the map (title, subtitle, coordinates) */}
          <div className="px-6 py-8 text-center bg-white border-t border-outline-variant">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-primary uppercase tracking-widest mb-1">
              {title || location?.placeName || "YOUR TITLE"}
            </h2>
            {(subtitle || date) && (
              <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">
                {subtitle || date}
              </p>
            )}
            {location && (
              <p className="font-mono text-[9px] text-on-surface-variant mt-2 tracking-wider opacity-60">
                {Math.abs(location.lat).toFixed(4)}° {location.lat >= 0 ? "N" : "S"} · {Math.abs(location.lng).toFixed(4)}° {location.lng >= 0 ? "E" : "W"}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Right: Controls panel */}
      <div className="w-full md:w-[420px] lg:w-[460px] bg-surface border-t md:border-t-0 md:border-l border-outline-variant flex flex-col max-h-screen overflow-hidden">
        <div className="p-6 md:p-8 border-b border-outline-variant">
          <h1 className="font-serif text-2xl font-medium text-primary mb-1">Design Your Map</h1>
          <p className="font-sans text-sm text-on-surface-variant">Customize location, text, and style.</p>
        </div>

        {/* All controls */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
          <EditorControls />

          {product && selectedVariant && (
            <div className="pt-6 border-t border-outline-variant">
              <FrameUpsell
                variants={product.variants}
                selectedVariant={selectedVariant}
                basePrice={product.basePrice}
                onVariantChange={setSelectedVariant}
                onFrameColorChange={setFrameColor}
              />
            </div>
          )}
        </div>

        {/* Footer CTA */}
        <div className="p-6 md:p-8 bg-surface-container-low border-t border-outline-variant">
          <div className="flex items-center justify-between mb-4">
            <span className="font-serif text-xl font-medium text-primary">Total</span>
            <span className="font-sans text-xl font-semibold text-primary">{formatPrice(currentPrice)}</span>
          </div>
          <button
            onClick={handleAddToCart}
            className="flex items-center justify-center w-full gap-2 bg-primary text-on-primary py-4 font-sans text-[11px] uppercase tracking-[0.1em] font-semibold hover:bg-secondary transition-colors shadow-md"
          >
            <ShoppingBag className="w-4 h-4" /> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CityMapEditorPageWrapper() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-surface"><p className="font-sans text-on-surface-variant">Loading...</p></div>}>
      <CityMapEditorPage />
    </Suspense>
  );
}
