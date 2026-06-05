"use client";

import { Suspense, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { ArrowRight, ZoomIn, ZoomOut, MapPin, Palette, MapPinned, Type, Sparkles, Package } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { useCitymapEditor } from "@/store/citymap-editor-store";
import { formatPrice } from "@/lib/utils";
import type { CitymapSpec } from "@/lib/render/spec";
import {
  getMapStyleDef,
  rgbToHex,
  POSTER_PADDING_PX,
  EPrintType,
  EPrintSize,
  EFrameColor,
} from "@/lib/citymap/citymap-model";
import { CitymapText } from "@/components/editor/citymap/citymap-text";
import {
  LocationPanel,
  StylePanel,
  MarkersPanel,
  TextPanel,
  ProductPanel,
} from "@/components/editor/citymap/citymap-panels";
import { DesignPanel } from "@/components/editor/citymap/citymap-design-panel";

// Leaflet must load client-side only.
const CitymapMap = dynamic(
  () => import("@/components/editor/citymap/citymap-map").then((m) => m.CitymapMap),
  { ssr: false, loading: () => <div className="w-full h-full bg-surface-dim animate-pulse" /> }
);

const TABS = [
  { id: "location", label: "Lieu", icon: MapPin },
  { id: "style", label: "Style", icon: Palette },
  { id: "markers", label: "Marqueurs", icon: MapPinned },
  { id: "text", label: "Texte", icon: Type },
  { id: "design", label: "Design", icon: Sparkles },
  { id: "product", label: "Produit", icon: Package },
] as const;

type TabId = (typeof TABS)[number]["id"];

const SIZE_MAP: Record<EPrintSize, CitymapSpec["size"]> = {
  [EPrintSize._30X40]: "30x40",
  [EPrintSize._45X60]: "45x60",
  [EPrintSize._50X70]: "50x70",
  [EPrintSize._60X80]: "60x80",
};

function CityMapEditorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productSlug = searchParams.get("product");

  const { addItem } = useCartStore();
  const store = useCitymapEditor();

  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("location");
  const [product, setProduct] = useState<any>(null);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);

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

  if (!mounted) {
    return <div className="min-h-screen flex items-center justify-center bg-surface"><p className="font-sans text-on-surface-variant">Loading…</p></div>;
  }

  const styleDef = getMapStyleDef(store.mapStyle);
  const base = rgbToHex(styleDef.theme.base);
  const pad = POSTER_PADDING_PX[store.posterPadding];
  const currentPrice = product ? product.basePrice + (selectedVariant?.priceModifier || 0) : 0;

  function handleAddToCart() {
    if (!store.location) { toast.error("Choisissez un lieu"); return; }
    if (!product || !selectedVariant) { toast.error("Produit non chargé"); return; }

    const spec: CitymapSpec = {
      productType: "citymap",
      location: store.location,
      zoom: store.zoom,
      bearing: 0,
      mapStyleId: store.mapStyle.toLowerCase(),
      title: store.headline,
      subtitle: store.subheadline,
      date: store.tagline,
      showCoordinates: store.showCoordinates,
      markers: store.markers.map((m) => ({
        lat: m.lat,
        lng: m.lng,
        label: m.text || undefined,
        icon: m.type === "icon" ? m.icon : undefined,
        photoUrl: m.photoUrl || undefined,
      })),
      photoUrls: store.markers.filter((m) => m.photoUrl).map((m) => m.photoUrl as string),
      size: SIZE_MAP[store.printSize],
      material: store.printType === EPrintType.POSTER_FRAMED ? "framed" : "poster",
      ...(store.printType === EPrintType.POSTER_FRAMED && { frameColor: store.frameColor.toLowerCase() }),
    };

    addItem({
      productId: product.id, productName: product.name, productSlug: product.slug,
      variantId: selectedVariant.id, variantName: selectedVariant.name,
      quantity: 1, basePrice: product.basePrice, variantPrice: selectedVariant.priceModifier,
      customizationData: spec,
    });

    toast.success("Ajouté au panier !");
    store.resetEditor();
    router.push("/cart");
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-surface -mt-[72px] pt-[72px]">
      {/* Left: poster preview */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 bg-surface-container-lowest relative">
        {/* zoom controls, top-right outside frame */}
        <div className="absolute top-6 right-6 lg:top-10 lg:right-10 flex gap-1 z-10">
          <button onClick={() => store.setZoom(Math.min(store.zoom + 1, 18))} aria-label="Zoom in" className="w-8 h-8 bg-white/90 backdrop-blur border border-outline-variant flex items-center justify-center text-primary hover:bg-white">
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => store.setZoom(Math.max(store.zoom - 1, 3))} aria-label="Zoom out" className="w-8 h-8 bg-white/90 backdrop-blur border border-outline-variant flex items-center justify-center text-primary hover:bg-white">
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
        </div>

        <div
          className="w-full max-w-[520px] border border-outline-variant shadow-xl"
          style={{ backgroundColor: base, padding: pad }}
        >
          <div
            className="relative"
            style={{
              outline: store.showOutline ? `3px solid ${rgbToHex(styleDef.theme.accent)}` : "none",
              outlineOffset: "-3px",
            }}
          >
            <div className="relative w-full" style={{ aspectRatio: "4/5" }}>
              <CitymapMap />
            </div>
            <CitymapText />
          </div>
        </div>
      </div>

      {/* Right: tabbed controls */}
      <div className="w-full lg:w-[440px] xl:w-[480px] bg-surface border-t lg:border-t-0 lg:border-l border-outline-variant flex flex-col">
        {/* Tab bar */}
        <div className="flex border-b border-outline-variant overflow-x-auto">
          {TABS.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex-1 min-w-[64px] flex flex-col items-center gap-1 py-3 px-2 transition-colors ${activeTab === t.id ? "text-primary border-b-2 border-primary" : "text-on-surface-variant hover:text-primary"}`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-sans text-[9px] uppercase tracking-[0.1em] font-bold">{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Panel body */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
          {activeTab === "location" && <LocationPanel />}
          {activeTab === "style" && <StylePanel />}
          {activeTab === "markers" && <MarkersPanel />}
          {activeTab === "text" && <TextPanel />}
          {activeTab === "design" && <DesignPanel />}
          {activeTab === "product" && <ProductPanel />}
        </div>

        {/* Footer: price + CTA */}
        <div className="p-6 lg:p-8 border-t border-outline-variant bg-surface">
          <div className="flex items-end justify-between mb-4">
            <div>
              <span className="font-sans text-[10px] uppercase tracking-[0.15em] font-bold text-on-surface-variant block">Total</span>
              <span className="font-serif text-3xl font-medium text-primary">{formatPrice(currentPrice)}</span>
            </div>
            <span className="font-sans text-xs text-on-surface-variant">Livraison offerte</span>
          </div>
          <button onClick={handleAddToCart} className="flex items-center justify-center w-full gap-2 bg-primary text-on-primary py-4 font-sans text-[11px] uppercase tracking-[0.15em] font-bold hover:bg-secondary transition-colors group">
            Ajouter au panier <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CityMapEditorPageWrapper() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-surface"><p className="font-sans text-on-surface-variant">Loading…</p></div>}>
      <CityMapEditorPage />
    </Suspense>
  );
}
