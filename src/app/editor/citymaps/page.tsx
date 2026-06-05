"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CityMapEditor as CityMapEditorComponent } from "@/components/editor/citymap/citymap-editor";
import { useCityMapStore } from "@/store/citymap-store";
import { toast } from "sonner";
import { useCartStore } from "@/store/cart-store";
import { formatPrice } from "@/lib/utils";
import type { CitymapSpec } from "@/lib/render/spec";
import { MapPin, Palette, Type, ArrowRight, ZoomIn, ZoomOut, Search, Heart } from "lucide-react";
import { MAP_STYLES, TEXT_LAYOUTS } from "@/lib/render/styles";
import { FrameUpsell } from "@/components/editor/frame-upsell";
import mapboxgl from "mapbox-gl";

function CityMapEditorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productSlug = searchParams.get("product");

  const { addItem } = useCartStore();
  const { location, title, subtitle, date, mapStyle, zoom, textLayout, colorVariant, setTitle, setSubtitle, setDate, setMapStyle, setZoom, setLocation, setTextLayout, setColorVariant } = useCityMapStore();

  const [mounted, setMounted] = useState(false);
  const [product, setProduct] = useState<any>(null);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [frameColor, setFrameColor] = useState("black");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);

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

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) { setSearchResults([]); setShowResults(false); return; }
    try {
      const proximity = location ? `${location.lng},${location.lat}` : "2.3522,48.8566";
      const res = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}&limit=5&language=fr&types=place,locality,neighborhood,poi,address&proximity=${proximity}`);
      const data = await res.json();
      if (data.features) { setSearchResults(data.features); setShowResults(true); }
    } catch {}
  };

  const handleSelectLocation = (result: any) => {
    const [lng, lat] = result.center;
    setLocation({ lat, lng, placeName: result.place_name });
    setSearchQuery(result.place_name);
    setShowResults(false);
  };

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
    resetEditor();
    router.push("/cart");
  };

  const { resetEditor } = useCityMapStore();

  if (!mounted) return <div className="min-h-screen flex items-center justify-center bg-surface"><p className="font-sans text-on-surface-variant">Loading...</p></div>;

  const currentPrice = product ? product.basePrice + (selectedVariant?.priceModifier || 0) : 0;
  const activeColors = colorVariant?.colors ?? mapStyle.colors;

  const formatCoords = (lat: number, lng: number) =>
    `${Math.abs(lat).toFixed(4)}\u00b0 ${lat >= 0 ? "N" : "S"}, ${Math.abs(lng).toFixed(4)}\u00b0 ${lng >= 0 ? "E" : "W"}`;

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-surface -mt-[72px] pt-[72px]">
      {/* Left: Poster frame with map inside */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 bg-surface-container-lowest relative">
        {/* The poster */}
        <div className="w-full max-w-[560px] bg-white border border-outline-variant shadow-xl">
          {/* Map area */}
          <div className="relative w-full" style={{ aspectRatio: "4/5" }}>
            {mapStyle.mask === "heart" && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                <defs>
                  <clipPath id="heart-clip" clipPathUnits="objectBoundingBox">
                    <path d="M0.5,0.9 C0.5,0.9 0.05,0.6 0.05,0.35 C0.05,0.15 0.2,0.05 0.35,0.15 C0.42,0.2 0.48,0.28 0.5,0.35 C0.52,0.28 0.58,0.2 0.65,0.15 C0.8,0.05 0.95,0.15 0.95,0.35 C0.95,0.6 0.5,0.9 0.5,0.9 Z" />
                  </clipPath>
                </defs>
              </svg>
            )}
            <div
              className="w-full h-full"
              style={mapStyle.mask === "heart" ? { clipPath: "url(#heart-clip)" } : undefined}
            >
              <CityMapEditorComponent />
            </div>
            {mapStyle.mask === "heart" && (
              <div className="absolute inset-0 pointer-events-none z-20">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path
                    d="M50,90 C50,90 5,60 5,35 C5,15 20,5 35,15 C42,20 48,28 50,35 C52,28 58,20 65,15 C80,5 95,15 95,35 C95,60 50,90 50,90 Z"
                    fill="none"
                    stroke={mapStyle.colors.text}
                    strokeWidth="0.5"
                  />
                </svg>
              </div>
            )}
          </div>

          {/* Title area below map */}
          <div className="px-6 py-6 text-center border-t border-outline-variant" style={{ backgroundColor: activeColors.background }}>
            {textLayout === "cursive" ? (
              <>
                <h2 className="font-serif text-2xl md:text-3xl italic" style={{ color: activeColors.text }}>
                  {title || "Paris"}
                </h2>
                <p className="font-sans text-[10px] mt-2 tracking-[0.15em]" style={{ color: activeColors.text, opacity: 0.6 }}>
                  {subtitle || (location ? formatCoords(location.lat, location.lng) : "")}
                </p>
              </>
            ) : textLayout === "verbose" ? (
              <>
                <div className="flex items-center gap-2 justify-center mb-2">
                  <span className="flex-1 h-px" style={{ backgroundColor: activeColors.text, opacity: 0.3 }} />
                  <span className="font-sans text-[8px] uppercase tracking-[0.2em]" style={{ color: activeColors.text, opacity: 0.5 }}>★</span>
                  <span className="flex-1 h-px" style={{ backgroundColor: activeColors.text, opacity: 0.3 }} />
                </div>
                <h2 className="font-serif text-3xl md:text-4xl font-bold uppercase tracking-[0.2em]" style={{ color: activeColors.text }}>
                  {title || "PARIS"}
                </h2>
                <p className="font-sans text-[10px] mt-2 tracking-[0.15em]" style={{ color: activeColors.text, opacity: 0.6 }}>
                  {subtitle || (location ? formatCoords(location.lat, location.lng) : "")}
                </p>
                {date && <p className="font-sans text-[9px] mt-1 tracking-[0.1em]" style={{ color: activeColors.text, opacity: 0.4 }}>{date}</p>}
              </>
            ) : textLayout === "minimal" ? (
              <>
                <h2 className="font-sans text-lg md:text-xl font-light uppercase tracking-[0.3em]" style={{ color: activeColors.text }}>
                  {title || "PARIS"}
                </h2>
              </>
            ) : (
              <>
                <h2 className="font-serif text-2xl md:text-3xl font-bold uppercase tracking-[0.15em]" style={{ color: activeColors.text }}>
                  {title || "PARIS"}
                </h2>
                <p className="font-sans text-[10px] mt-2 tracking-[0.15em]" style={{ color: activeColors.text, opacity: 0.6 }}>
                  {subtitle || (location ? formatCoords(location.lat, location.lng) : "")}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Zoom controls */}
        <div className="absolute right-8 bottom-1/3 flex flex-col gap-2">
          <button onClick={() => setZoom(Math.min(zoom + 1, 18))} className="w-10 h-10 bg-white border border-outline-variant flex items-center justify-center text-primary hover:bg-surface-dim transition-colors">
            <ZoomIn className="w-4 h-4" />
          </button>
          <button onClick={() => setZoom(Math.max(zoom - 1, 8))} className="w-10 h-10 bg-white border border-outline-variant flex items-center justify-center text-primary hover:bg-surface-dim transition-colors">
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Right: Controls */}
      <div className="w-full lg:w-[420px] xl:w-[460px] bg-surface border-t lg:border-t-0 lg:border-l border-outline-variant flex flex-col">
        <div className="flex-1 overflow-y-auto p-8 lg:p-10 space-y-10">
          {/* Header */}
          <div>
            <h1 className="font-serif text-3xl italic font-medium text-primary">Personalize</h1>
            <p className="font-sans text-sm text-on-surface-variant mt-1">Curating your moment</p>
          </div>

          {/* 1. Location */}
          <div>
            <h3 className="flex items-center gap-2 font-sans text-[11px] uppercase tracking-[0.15em] font-bold text-primary mb-4">
              <MapPin className="w-4 h-4" /> 1. Location
            </h3>
            <div className="relative">
              <input
                type="text"
                value={searchQuery || (location?.placeName ?? "")}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => searchResults.length > 0 && setShowResults(true)}
                placeholder="Paris, France"
                className="w-full bg-surface-container-lowest border border-outline-variant px-4 py-3 pr-10 font-sans text-sm text-primary focus:outline-none focus:border-primary transition-colors"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
              {showResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-outline-variant shadow-lg z-20 max-h-48 overflow-y-auto">
                  {searchResults.map((result: any) => (
                    <button
                      key={result.id}
                      onClick={() => handleSelectLocation(result)}
                      className="w-full px-4 py-3 text-left hover:bg-surface-dim border-b border-outline-variant last:border-0 transition-colors"
                    >
                      <p className="font-sans text-sm font-medium text-primary">{result.place_name.split(",")[0]}</p>
                      <p className="font-sans text-xs text-on-surface-variant">{result.place_name.split(",").slice(1).join(",")}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {location && (
              <div className="flex justify-between mt-2">
                <span className="font-sans text-xs text-on-surface-variant">Center Coordinates</span>
                <span className="font-sans text-xs font-semibold text-primary">{formatCoords(location.lat, location.lng)}</span>
              </div>
            )}
          </div>

          {/* 2. Style */}
          <div>
            <h3 className="flex items-center gap-2 font-sans text-[11px] uppercase tracking-[0.15em] font-bold text-primary mb-4">
              <Palette className="w-4 h-4" /> 2. Style
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {MAP_STYLES.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setMapStyle(style)}
                  className={`relative border-2 transition-colors ${
                    mapStyle.id === style.id ? "border-primary" : "border-outline-variant hover:border-on-surface-variant"
                  }`}
                >
                  <div className="aspect-square relative overflow-hidden" style={{ backgroundColor: style.colors.land }}>
                    {style.mask === "heart" && (
                      <Heart className="absolute inset-0 m-auto w-5 h-5 text-primary opacity-40" />
                    )}
                    <div className="absolute inset-1 opacity-50" style={{ background: `linear-gradient(135deg, ${style.colors.roads} 1px, transparent 1px), linear-gradient(45deg, ${style.colors.majorRoads} 1px, transparent 1px)`, backgroundSize: "6px 6px" }} />
                    <div className="absolute bottom-0 left-0 right-0 h-1/4" style={{ backgroundColor: style.colors.water, opacity: 0.6 }} />
                  </div>
                  <p className="text-[9px] font-medium text-center py-1 truncate">{style.name}</p>
                  {mapStyle.id === style.id && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-on-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Color Variants */}
            {mapStyle.colorVariants.length > 0 && (
              <div className="mt-4">
                <p className="font-sans text-[10px] uppercase tracking-[0.15em] font-bold text-primary mb-2">Personnaliser la couleur</p>
                <div className="flex flex-wrap gap-2">
                  {mapStyle.colorVariants.map((variant) => {
                    const isActive = colorVariant?.id === variant.id || (!colorVariant && variant.colors.water === mapStyle.colors.water);
                    return (
                      <button
                        key={variant.id}
                        onClick={() => setColorVariant(variant)}
                        title={variant.label}
                        className={`w-7 h-7 rounded-full border-2 transition-all ${isActive ? "border-primary scale-110" : "border-outline-variant hover:border-on-surface-variant"}`}
                        style={{ background: `linear-gradient(135deg, ${variant.colors.land} 50%, ${variant.colors.water} 50%)` }}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {/* Text Layout */}
            <div className="mt-4">
              <p className="font-sans text-[10px] uppercase tracking-[0.15em] font-bold text-primary mb-2">Disposition du texte</p>
              <div className="grid grid-cols-2 gap-2">
                {TEXT_LAYOUTS.map((layout) => (
                  <button
                    key={layout.id}
                    onClick={() => setTextLayout(layout.id)}
                    className={`px-3 py-2 border text-[10px] font-medium transition-colors ${
                      textLayout === layout.id ? "border-primary bg-primary text-on-primary" : "border-outline-variant text-primary hover:border-on-surface-variant"
                    }`}
                  >
                    {layout.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Text */}
          <div>
            <h3 className="flex items-center gap-2 font-sans text-[11px] uppercase tracking-[0.15em] font-bold text-primary mb-4">
              <Type className="w-4 h-4" /> 3. Text
            </h3>
            <div className="space-y-4">
              <div>
                <label className="font-sans text-[10px] uppercase tracking-[0.15em] font-bold text-primary block mb-2">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Paris"
                  className="w-full bg-surface-container-lowest border border-outline-variant px-4 py-3 font-sans text-sm text-primary focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="font-sans text-[10px] uppercase tracking-[0.15em] font-bold text-primary block mb-2">Subtitle (coordinates/tagline)</label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder={location ? formatCoords(location.lat, location.lng) : "48\u00b0 51' 29\" N 2\u00b0 17' 40\" E"}
                  className="w-full bg-surface-container-lowest border border-outline-variant px-4 py-3 font-sans text-sm text-primary focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Frame upsell */}
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

        {/* Footer: Price + CTA */}
        <div className="p-8 lg:p-10 border-t border-outline-variant bg-surface">
          <div className="flex items-end justify-between mb-6">
            <div>
              <span className="font-sans text-[10px] uppercase tracking-[0.15em] font-bold text-on-surface-variant block">Total</span>
              <span className="font-serif text-3xl font-medium text-primary">{formatPrice(currentPrice)}</span>
            </div>
            <span className="font-sans text-xs text-on-surface-variant">Free global shipping</span>
          </div>
          <button
            onClick={handleAddToCart}
            className="flex items-center justify-center w-full gap-2 bg-primary text-on-primary py-4 font-sans text-[11px] uppercase tracking-[0.15em] font-bold hover:bg-secondary transition-colors group"
          >
            Add to Cart <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
