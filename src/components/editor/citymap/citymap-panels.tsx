"use client";

import { useRef, useState } from "react";
import { Plus, Trash2, MapPin, Search, ImagePlus } from "lucide-react";
import { useCitymapEditor } from "@/store/citymap-editor-store";
import { MarkerIconView } from "@/components/editor/citymap/marker-icon-view";
import {
  MAP_STYLE_LIST,
  rgbToHex,
  EShapeOverlay,
  EPosterPadding,
  EGradientOverlay,
  GRADIENT_OVERLAY_LABEL,
  ETextLayout,
  ETextVariant,
  EFont,
  FONT_LABEL,
  TEXT_LAYOUT_LIST,
  MARKER_ICON_LIST,
  MARKER_COLORS,
  EMarkerSize,
  EMarkerColorLayer,
  EPrintType,
  EPrintSize,
  PRINT_SIZE_LABEL,
  EFrameColor,
} from "@/lib/citymap/citymap-model";

const sectionLabel = "font-sans text-[10px] uppercase tracking-[0.15em] font-bold text-primary";

/* ============================ LOCATION ============================ */

function getZoomForPlace(type: string, cls: string, bbox?: string[]): number {
  if (bbox?.length === 4) {
    const span = Math.abs(parseFloat(bbox[1]) - parseFloat(bbox[0]));
    if (span < 0.005) return 17;
    if (span < 0.02) return 16;
    if (span < 0.05) return 15;
    if (span < 0.15) return 14;
    if (span < 0.5) return 13;
    if (span < 1.5) return 12;
    if (span < 5) return 10;
    if (span < 15) return 8;
    return 6;
  }
  if (type === "house" || type === "building") return 17;
  if (cls === "tourism" || cls === "amenity" || cls === "historic") return 16;
  if (["neighbourhood", "suburb", "quarter", "village", "town"].includes(type)) return 14;
  if (type === "city") return 12;
  if (type === "state" || type === "region") return 8;
  if (type === "country") return 6;
  return 14;
}

export function LocationPanel() {
  const location = useCitymapEditor((s) => s.location);
  const setLocation = useCitymapEditor((s) => s.setLocation);
  const setZoom = useCitymapEditor((s) => s.setZoom);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const timer = useRef<NodeJS.Timeout | null>(null);

  function search(q: string) {
    setQuery(q);
    if (!q.trim()) { setResults([]); setOpen(false); return; }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      try {
        const params = new URLSearchParams({ format: "json", q, limit: "6", "accept-language": "fr", addressdetails: "1", dedupe: "1" });
        if (location) {
          const b = 0.5;
          params.set("viewbox", `${location.lng - b},${location.lat - b},${location.lng + b},${location.lat + b}`);
        } else {
          params.set("viewbox", "-5.1,41.3,9.6,51.1");
          params.set("countrycodes", "fr");
        }
        const res = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, { headers: { "User-Agent": "Momenterie/1.0" } });
        const data = await res.json();
        if (data?.length) { setResults(data); setOpen(true); }
      } catch {}
    }, 250);
  }

  function pick(r: any) {
    setLocation({ lat: parseFloat(r.lat), lng: parseFloat(r.lon), placeName: r.display_name });
    setQuery(r.display_name.split(",")[0]);
    setZoom(getZoomForPlace(r.type, r.class, r.boundingbox));
    setOpen(false);
  }

  const coords = location
    ? `${Math.abs(location.lat).toFixed(4)}° ${location.lat >= 0 ? "N" : "S"}, ${Math.abs(location.lng).toFixed(4)}° ${location.lng >= 0 ? "E" : "W"}`
    : "";

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          value={query || (location?.placeName ?? "")}
          onChange={(e) => search(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="Rechercher une ville, une adresse…"
          className="w-full bg-surface-container-lowest border border-outline-variant px-4 py-3 pr-10 font-sans text-sm text-primary focus:outline-none focus:border-primary"
        />
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
        {open && results.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-outline-variant shadow-lg z-30 max-h-56 overflow-y-auto">
            {results.map((r) => (
              <button key={r.place_id} onClick={() => pick(r)} className="w-full px-4 py-3 text-left hover:bg-surface-dim border-b border-outline-variant last:border-0">
                <p className="font-sans text-sm font-medium text-primary">{r.display_name.split(",")[0]}</p>
                <p className="font-sans text-xs text-on-surface-variant truncate">{r.display_name.split(",").slice(1).join(",")}</p>
              </button>
            ))}
          </div>
        )}
      </div>
      {location && (
        <div className="flex items-center gap-2 text-on-surface-variant">
          <MapPin className="w-3.5 h-3.5" />
          <span className="font-sans text-xs">{coords}</span>
        </div>
      )}
      <p className="font-sans text-xs text-on-surface-variant">Faites glisser la carte pour ajuster le cadrage.</p>
    </div>
  );
}

/* ============================ STYLE ============================ */

export function StylePanel() {
  const mapStyle = useCitymapEditor((s) => s.mapStyle);
  const setMapStyle = useCitymapEditor((s) => s.setMapStyle);
  const shapeOverlay = useCitymapEditor((s) => s.shapeOverlay);
  const setShapeOverlay = useCitymapEditor((s) => s.setShapeOverlay);
  const posterPadding = useCitymapEditor((s) => s.posterPadding);
  const setPosterPadding = useCitymapEditor((s) => s.setPosterPadding);
  const showOutline = useCitymapEditor((s) => s.showOutline);
  const setShowOutline = useCitymapEditor((s) => s.setShowOutline);
  const gradientOverlay = useCitymapEditor((s) => s.gradientOverlay);
  const setGradientOverlay = useCitymapEditor((s) => s.setGradientOverlay);

  return (
    <div className="space-y-6">
      <div>
        <p className={sectionLabel}>Couleur de la carte</p>
        <div className="grid grid-cols-5 gap-2 mt-3">
          {MAP_STYLE_LIST.map((st) => (
            <button
              key={st.id}
              onClick={() => setMapStyle(st.id)}
              title={st.name}
              className={`relative aspect-square border-2 overflow-hidden transition-colors ${mapStyle === st.id ? "border-primary" : "border-outline-variant hover:border-on-surface-variant"}`}
              style={{ backgroundColor: rgbToHex(st.theme.base) }}
            >
              <span className="absolute inset-x-1 bottom-1 h-1.5 rounded" style={{ backgroundColor: rgbToHex(st.theme.accent) }} />
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className={sectionLabel}>Forme</p>
        <div className="grid grid-cols-3 gap-2 mt-3">
          {[
            { id: EShapeOverlay.NONE, label: "Aucune" },
            { id: EShapeOverlay.CIRCLE, label: "Cercle" },
            { id: EShapeOverlay.HEART, label: "Cœur" },
          ].map((o) => (
            <button key={o.id} onClick={() => setShapeOverlay(o.id)} className={`px-3 py-2 border text-[11px] font-medium transition-colors ${shapeOverlay === o.id ? "border-primary bg-primary text-on-primary" : "border-outline-variant text-primary hover:border-on-surface-variant"}`}>
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className={sectionLabel}>Marge du poster</p>
        <div className="grid grid-cols-3 gap-2 mt-3">
          {[
            { id: EPosterPadding.NONE, label: "Aucune" },
            { id: EPosterPadding.SMALL, label: "Petite" },
            { id: EPosterPadding.LARGE, label: "Grande" },
          ].map((o) => (
            <button key={o.id} onClick={() => setPosterPadding(o.id)} className={`px-3 py-2 border text-[11px] font-medium transition-colors ${posterPadding === o.id ? "border-primary bg-primary text-on-primary" : "border-outline-variant text-primary hover:border-on-surface-variant"}`}>
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <label className="flex items-center justify-between cursor-pointer">
        <span className={sectionLabel}>Contour</span>
        <input type="checkbox" checked={showOutline} disabled={posterPadding === EPosterPadding.NONE} onChange={(e) => setShowOutline(e.target.checked)} className="accent-primary w-4 h-4 disabled:opacity-40" />
      </label>

      <div>
        <p className={sectionLabel}>Dégradé</p>
        <div className="grid grid-cols-2 gap-2 mt-3">
          {Object.values(EGradientOverlay).map((g) => (
            <button key={g} onClick={() => setGradientOverlay(g)} className={`px-3 py-2 border text-[11px] font-medium transition-colors ${gradientOverlay === g ? "border-primary bg-primary text-on-primary" : "border-outline-variant text-primary hover:border-on-surface-variant"}`}>
              {GRADIENT_OVERLAY_LABEL[g]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================ MARKERS ============================ */

export function MarkersPanel() {
  const markers = useCitymapEditor((s) => s.markers);
  const selectedId = useCitymapEditor((s) => s.selectedMarkerId);
  const addMarker = useCitymapEditor((s) => s.addMarker);
  const addPhotoMarker = useCitymapEditor((s) => s.addPhotoMarker);
  const updateMarker = useCitymapEditor((s) => s.updateMarker);
  const removeMarker = useCitymapEditor((s) => s.removeMarker);
  const selectMarker = useCitymapEditor((s) => s.selectMarker);
  const fileRef = useRef<HTMLInputElement>(null);

  const selected = markers.find((m) => m.id === selectedId) ?? null;

  function onPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => addPhotoMarker(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => addMarker()} className="flex items-center justify-center gap-2 px-3 py-3 border border-outline-variant text-[11px] font-medium text-primary hover:border-primary">
          <Plus className="w-4 h-4" /> Symbole
        </button>
        <button onClick={() => fileRef.current?.click()} className="flex items-center justify-center gap-2 px-3 py-3 border border-outline-variant text-[11px] font-medium text-primary hover:border-primary">
          <ImagePlus className="w-4 h-4" /> Photo
        </button>
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={onPhoto} />
      </div>

      {markers.length > 0 && (
        <div className="space-y-1.5">
          {markers.map((m) => (
            <div key={m.id} className={`flex items-center gap-2 px-2 py-2 border cursor-pointer ${selectedId === m.id ? "border-primary" : "border-outline-variant"}`} onClick={() => selectMarker(m.id)}>
              <span className="w-7 h-7 flex items-center justify-center shrink-0">
                {m.type === "photo" && m.photoUrl ? (
                  <img src={m.photoUrl} alt="" className="w-6 h-6 rounded-full object-cover" />
                ) : (
                  <MarkerIconView icon={m.icon} color={"#" + m.color.replace("#", "")} colorLayer={m.colorLayer} pixelSize={24} />
                )}
              </span>
              <span className="flex-1 font-sans text-xs text-primary truncate">{m.text || (m.type === "photo" ? "Photo" : m.icon.replace("PIN_", "").toLowerCase())}</span>
              <button onClick={(e) => { e.stopPropagation(); removeMarker(m.id); }} className="text-on-surface-variant hover:text-error p-1">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div className="space-y-4 pt-4 border-t border-outline-variant">
          <div>
            <label className={sectionLabel}>Texte du marqueur</label>
            <input value={selected.text} onChange={(e) => updateMarker(selected.id, { text: e.target.value })} placeholder="ex. Notre maison" className="mt-2 w-full bg-surface-container-lowest border border-outline-variant px-3 py-2 font-sans text-sm text-primary focus:outline-none focus:border-primary" />
          </div>

          {selected.type === "icon" && (
            <div>
              <label className={sectionLabel}>Symbole</label>
              <div className="grid grid-cols-6 gap-1.5 mt-2">
                {MARKER_ICON_LIST.map((ic) => (
                  <button key={ic} onClick={() => updateMarker(selected.id, { icon: ic })} className={`aspect-square flex items-center justify-center border ${selected.icon === ic ? "border-primary" : "border-outline-variant hover:border-on-surface-variant"}`}>
                    <MarkerIconView icon={ic} color={"#" + selected.color.replace("#", "")} colorLayer={selected.colorLayer} pixelSize={26} />
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className={sectionLabel}>Couleur</label>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {MARKER_COLORS.map((c) => (
                <button key={c} onClick={() => updateMarker(selected.id, { color: c })} title={"#" + c} className={`w-6 h-6 rounded-full border-2 ${selected.color === c ? "border-primary scale-110" : "border-outline-variant"}`} style={{ backgroundColor: "#" + c }} />
              ))}
            </div>
          </div>

          {selected.type === "icon" && (
            <div>
              <label className={sectionLabel}>Couleur appliquée à</label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {[
                  { id: EMarkerColorLayer.MARKER, label: "Marqueur" },
                  { id: EMarkerColorLayer.SYMBOL, label: "Symbole" },
                ].map((o) => (
                  <button key={o.id} onClick={() => updateMarker(selected.id, { colorLayer: o.id })} className={`px-3 py-2 border text-[11px] font-medium ${selected.colorLayer === o.id ? "border-primary bg-primary text-on-primary" : "border-outline-variant text-primary"}`}>
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className={sectionLabel}>Taille</label>
            <div className="grid grid-cols-5 gap-1.5 mt-2">
              {Object.values(EMarkerSize).map((sz) => (
                <button key={sz} onClick={() => updateMarker(selected.id, { size: sz })} className={`px-2 py-2 border text-[10px] font-medium ${selected.size === sz ? "border-primary bg-primary text-on-primary" : "border-outline-variant text-primary"}`}>
                  {sz[0] + (sz.startsWith("X") ? sz[1] : "")}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================ TEXT ============================ */

export function TextPanel() {
  const s = useCitymapEditor();
  const input = "w-full bg-surface-container-lowest border border-outline-variant px-3 py-2.5 font-sans text-sm text-primary focus:outline-none focus:border-primary";
  const activeLayout = TEXT_LAYOUT_LIST.find((l) => l.id === s.textLayout);

  return (
    <div className="space-y-5">
      <div>
        <p className={sectionLabel}>Disposition</p>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {TEXT_LAYOUT_LIST.map((l) => (
            <button key={l.id} onClick={() => s.setTextLayout(l.id)} className={`px-3 py-2 border text-[11px] font-medium ${s.textLayout === l.id ? "border-primary bg-primary text-on-primary" : "border-outline-variant text-primary hover:border-on-surface-variant"}`}>
              {l.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <label className={sectionLabel}>Titre</label>
          <input value={s.headline} onChange={(e) => s.setHeadline(e.target.value)} placeholder="Paris" className={`mt-2 ${input}`} />
        </div>
        <div>
          <label className={sectionLabel}>Sous-titre</label>
          <input value={s.subheadline} onChange={(e) => s.setSubheadline(e.target.value)} placeholder="Coordonnées / lieu" className={`mt-2 ${input}`} />
        </div>
        <div>
          <label className={sectionLabel}>Légende</label>
          <input value={s.tagline} onChange={(e) => s.setTagline(e.target.value)} placeholder="Là où tout a commencé" className={`mt-2 ${input}`} />
        </div>
        {activeLayout?.hasDedication && (
          <div>
            <label className={sectionLabel}>Dédicace</label>
            <textarea value={s.dedication} onChange={(e) => s.setDedication(e.target.value)} rows={3} placeholder="Un petit mot…" className={`mt-2 ${input} resize-none`} />
          </div>
        )}
      </div>

      <div>
        <p className={sectionLabel}>Police</p>
        <div className="space-y-2 mt-2">
          {Object.values(EFont).map((f) => (
            <button key={f} onClick={() => s.setFont(f)} className={`w-full px-3 py-2 border text-left text-sm ${s.font === f ? "border-primary" : "border-outline-variant hover:border-on-surface-variant"}`}>
              {FONT_LABEL[f]}
            </button>
          ))}
        </div>
      </div>

      <label className="flex items-center justify-between cursor-pointer">
        <span className={sectionLabel}>Écriture cursive</span>
        <input type="checkbox" checked={s.textVariant === ETextVariant.PLAYFUL} onChange={(e) => s.setTextVariant(e.target.checked ? ETextVariant.PLAYFUL : ETextVariant.DEFAULT)} className="accent-primary w-4 h-4" />
      </label>

      <label className="flex items-center justify-between cursor-pointer">
        <span className={sectionLabel}>Afficher les coordonnées</span>
        <input type="checkbox" checked={s.showCoordinates} onChange={(e) => s.setShowCoordinates(e.target.checked)} className="accent-primary w-4 h-4" />
      </label>
    </div>
  );
}

/* ============================ PRODUCT ============================ */

export function ProductPanel() {
  const printType = useCitymapEditor((s) => s.printType);
  const setPrintType = useCitymapEditor((s) => s.setPrintType);
  const printSize = useCitymapEditor((s) => s.printSize);
  const setPrintSize = useCitymapEditor((s) => s.setPrintSize);
  const frameColor = useCitymapEditor((s) => s.frameColor);
  const setFrameColor = useCitymapEditor((s) => s.setFrameColor);

  return (
    <div className="space-y-6">
      <div>
        <p className={sectionLabel}>Type</p>
        <div className="grid grid-cols-2 gap-2 mt-3">
          {[
            { id: EPrintType.POSTER, label: "Poster" },
            { id: EPrintType.POSTER_FRAMED, label: "Encadré" },
          ].map((o) => (
            <button key={o.id} onClick={() => setPrintType(o.id)} className={`px-3 py-3 border text-[11px] font-medium ${printType === o.id ? "border-primary bg-primary text-on-primary" : "border-outline-variant text-primary hover:border-on-surface-variant"}`}>
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className={sectionLabel}>Taille</p>
        <div className="grid grid-cols-2 gap-2 mt-3">
          {Object.values(EPrintSize).map((sz) => (
            <button key={sz} onClick={() => setPrintSize(sz)} className={`px-3 py-3 border text-[11px] font-medium ${printSize === sz ? "border-primary bg-primary text-on-primary" : "border-outline-variant text-primary hover:border-on-surface-variant"}`}>
              {PRINT_SIZE_LABEL[sz]}
            </button>
          ))}
        </div>
      </div>

      {printType === EPrintType.POSTER_FRAMED && (
        <div>
          <p className={sectionLabel}>Couleur du cadre</p>
          <div className="flex gap-3 mt-3">
            {[
              { id: EFrameColor.WHITE, hex: "#FFFFFF" },
              { id: EFrameColor.BLACK, hex: "#1A1A1A" },
            ].map((o) => (
              <button key={o.id} onClick={() => setFrameColor(o.id)} className={`w-10 h-10 rounded-full border-2 ${frameColor === o.id ? "border-primary scale-110" : "border-outline-variant"}`} style={{ backgroundColor: o.hex }} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
