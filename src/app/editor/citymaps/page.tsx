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
import { ArrowLeft, MapPin, Type, LayoutTemplate, ShoppingBag } from "lucide-react";
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
  const [activeTab, setActiveTab] = useState<"location" | "text" | "style">("location");

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

      {/* Left: Preview area */}
      <div className="flex-1 relative flex flex-col bg-surface-container-lowest">
        <div className="absolute top-4 left-4 z-10 hidden md:block">
          <Link href={`/products/${productSlug || "custom-city-map"}`} className="flex items-center gap-2 text-on-surface-variant hover:text-primary text-sm font-sans tracking-wide">
            <ArrowLeft className="w-4 h-4" /> Back to Product
          </Link>
        </div>

        {/* Map Editor */}
        <div className="flex-1 relative" style={{ minHeight: "400px" }}>
          <CityMapEditorComponent />
        </div>

        {/* Preview */}
        <div className="p-6 bg-surface border-t border-outline-variant">
          <div className="max-w-[300px] mx-auto">
            <CityMapPreview />
          </div>
        </div>
      </div>

      {/* Right: Controls panel */}
      <div className="w-full md:w-[450px] lg:w-[500px] bg-surface border-t md:border-t-0 md:border-l border-outline-variant flex flex-col max-h-screen overflow-hidden">
        <div className="p-6 md:p-8 border-b border-outline-variant">
          <h1 className="font-serif text-2xl font-medium text-primary mb-2">Design Your Map</h1>
          <p className="font-sans text-sm text-on-surface-variant">Customize location, text, and style.</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-outline-variant">
          {([
            { key: "location", icon: MapPin, label: "Location" },
            { key: "text", icon: Type, label: "Text" },
            { key: "style", icon: LayoutTemplate, label: "Style" },
          ] as const).map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex-1 flex flex-col items-center justify-center p-4 gap-2 font-sans text-xs uppercase tracking-wider font-semibold transition-colors ${
                activeTab === key ? "text-primary border-b-2 border-primary" : "text-on-surface-variant hover:bg-surface-container-lowest"
              }`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          {activeTab === "location" && (
            <div className="space-y-6">
              <EditorControls />
            </div>
          )}
          {activeTab === "text" && (
            <div className="space-y-6">
              <EditorControls />
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

export default function CityMapEditorPageWrapper() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="font-sans text-on-surface-variant">Loading...</p></div>}>
      <CityMapEditorPage />
    </Suspense>
  );
}
