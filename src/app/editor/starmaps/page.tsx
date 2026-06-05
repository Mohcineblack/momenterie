"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { StarMapControls } from "@/components/editor/starmap/starmap-controls";
import { StarMapPreview } from "@/components/editor/starmap/starmap-preview";
import { FrameUpsell } from "@/components/editor/frame-upsell";
import { useStarMapStore } from "@/store/starmap-store";
import { useCartStore } from "@/store/cart-store";
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils";
import type { StarmapSpec } from "@/lib/render/spec";
import { ArrowLeft, MapPin, Type, LayoutTemplate, ShoppingBag } from "lucide-react";
import Link from "next/link";

function toDateTimeUtc(date: Date, time: string): string {
  const d = new Date(date);
  const [h, m] = (time || "22:00").split(":").map(Number);
  d.setHours(h, m, 0, 0);
  return d.toISOString();
}

function StarMapEditorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productSlug = searchParams.get("product");

  const { addItem } = useCartStore();
  const { location, date, time, title, subtitle, style, showConstellations, showGrid, resetEditor } = useStarMapStore();

  const [mounted, setMounted] = useState(false);
  const [product, setProduct] = useState<any>(null);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [frameColor, setFrameColor] = useState("black");
  const [activeTab, setActiveTab] = useState<"details" | "style">("details");

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

    const customizationData: StarmapSpec = {
      productType: "starmap",
      location, datetimeUtc: toDateTimeUtc(date, time),
      title, subtitle, styleId: style.id,
      showConstellations, showGrid, showMilkyWay: true, magnitudeLimit: 6.5,
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
    localStorage.removeItem("starmap-editor-draft");
    resetEditor();
    router.push("/cart");
  };

  if (!mounted) return <div className="min-h-screen flex items-center justify-center bg-surface"><p className="font-sans text-on-surface-variant">Loading editor...</p></div>;

  const currentPrice = product ? product.basePrice + (selectedVariant?.priceModifier || 0) : 0;

  return (
    <div className="flex flex-col min-h-screen bg-surface md:flex-row -mt-[72px] pt-[72px]">
      {/* Mobile header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-outline-variant">
        <Link href={`/products/${productSlug || "custom-star-map"}`} className="text-on-surface-variant hover:text-primary">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <span className="font-serif font-medium text-primary">Star Map Studio</span>
        <div className="w-5" />
      </div>

      {/* Left: Preview */}
      <div className="flex-1 relative flex items-center justify-center p-6 md:p-12 bg-surface-container-lowest">
        <div className="absolute top-4 left-4 z-10 hidden md:block">
          <Link href={`/products/${productSlug || "custom-star-map"}`} className="flex items-center gap-2 text-on-surface-variant hover:text-primary text-sm font-sans tracking-wide">
            <ArrowLeft className="w-4 h-4" /> Back to Product
          </Link>
        </div>
        <div className="w-full max-w-[400px]">
          <StarMapPreview />
        </div>
      </div>

      {/* Right: Controls panel */}
      <div className="w-full md:w-[450px] lg:w-[500px] bg-surface border-t md:border-t-0 md:border-l border-outline-variant flex flex-col max-h-screen overflow-hidden">
        <div className="p-6 md:p-8 border-b border-outline-variant">
          <h1 className="font-serif text-2xl font-medium text-primary mb-2">Design Your Star Map</h1>
          <p className="font-sans text-sm text-on-surface-variant">Customize location, date, and style.</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-outline-variant">
          <button
            onClick={() => setActiveTab("details")}
            className={`flex-1 flex flex-col items-center justify-center p-4 gap-2 font-sans text-xs uppercase tracking-wider font-semibold transition-colors ${activeTab === "details" ? "text-primary border-b-2 border-primary" : "text-on-surface-variant hover:bg-surface-container-lowest"}`}
          >
            <MapPin className="w-5 h-5" /> Details
          </button>
          <button
            onClick={() => setActiveTab("style")}
            className={`flex-1 flex flex-col items-center justify-center p-4 gap-2 font-sans text-xs uppercase tracking-wider font-semibold transition-colors ${activeTab === "style" ? "text-primary border-b-2 border-primary" : "text-on-surface-variant hover:bg-surface-container-lowest"}`}
          >
            <LayoutTemplate className="w-5 h-5" /> Style
          </button>
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          {activeTab === "details" && (
            <div className="space-y-6">
              <StarMapControls />
            </div>
          )}
          {activeTab === "style" && (
            <div className="space-y-6">
              {product && selectedVariant && (
                <FrameUpsell
                  variants={product.variants}
                  selectedVariant={selectedVariant}
                  basePrice={product.basePrice}
                  onVariantChange={setSelectedVariant}
                  onFrameColorChange={setFrameColor}
                />
              )}
            </div>
          )}
        </div>

        {/* Footer CTA */}
        <div className="p-6 md:p-8 bg-surface-container-low border-t border-outline-variant">
          <div className="flex items-center justify-between mb-6">
            <span className="font-serif text-xl font-medium text-primary">Total</span>
            <span className="font-sans text-xl font-semibold text-primary">{formatPrice(currentPrice)}</span>
          </div>
          <button
            onClick={handleAddToCart}
            className="flex items-center justify-center w-full gap-2 bg-primary text-on-primary py-4 font-sans text-xs uppercase tracking-[0.1em] font-semibold hover:bg-secondary transition-colors shadow-md"
          >
            <ShoppingBag className="w-4 h-4" /> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default function StarMapEditorPageWrapper() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="font-sans text-on-surface-variant">Loading...</p></div>}>
      <StarMapEditorPage />
    </Suspense>
  );
}
