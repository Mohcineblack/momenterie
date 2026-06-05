"use client";

import { useState } from "react";
import { useCitymapEditor } from "@/store/citymap-editor-store";
import {
  EDesignCategory,
  DESIGN_CATEGORY_EMOJI,
  DESIGN_CATEGORY_LABEL,
  getMapStyleDef,
  rgbToHex,
  EShapeOverlay,
} from "@/lib/citymap/citymap-model";
import { CITYMAP_DESIGNS, DESIGNS_BY_CATEGORY, HEADLINE_SUGGESTIONS } from "@/lib/citymap/citymap-presets";

const sectionLabel = "font-sans text-[10px] uppercase tracking-[0.15em] font-bold text-primary";
const CATEGORIES = Object.values(EDesignCategory);

export function DesignPanel() {
  const applyDesign = useCitymapEditor((s) => s.applyDesign);
  const setHeadline = useCitymapEditor((s) => s.setHeadline);
  const mapStyle = useCitymapEditor((s) => s.mapStyle);
  const textLayout = useCitymapEditor((s) => s.textLayout);
  const shapeOverlay = useCitymapEditor((s) => s.shapeOverlay);

  const [category, setCategory] = useState<EDesignCategory>(EDesignCategory.BESTSELLER);

  const designIds = DESIGNS_BY_CATEGORY[category];
  const suggestions = HEADLINE_SUGGESTIONS[category];

  return (
    <div className="space-y-6">
      {/* Category chips */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`flex items-center gap-1.5 px-3 py-1.5 border text-[11px] font-medium transition-colors ${category === c ? "border-primary bg-primary text-on-primary" : "border-outline-variant text-primary hover:border-on-surface-variant"}`}
          >
            <span>{DESIGN_CATEGORY_EMOJI[c]}</span>
            {DESIGN_CATEGORY_LABEL[c]}
          </button>
        ))}
      </div>

      {/* Design presets */}
      <div>
        <p className={sectionLabel}>Designs</p>
        <div className="grid grid-cols-4 gap-2 mt-3">
          {designIds.map((id) => {
            const p = CITYMAP_DESIGNS[id];
            const def = getMapStyleDef(p.mapStyle);
            const active = mapStyle === p.mapStyle && textLayout === p.textLayout && shapeOverlay === p.shapeOverlay;
            return (
              <button
                key={id}
                onClick={() => applyDesign({
                  mapStyle: p.mapStyle,
                  posterPadding: p.posterPadding,
                  gradientOverlay: p.gradientOverlay,
                  shapeOverlay: p.shapeOverlay,
                  showOutline: p.showOutline,
                  textLayout: p.textLayout,
                  textVariant: p.textVariant,
                })}
                title={p.name}
                className={`relative border-2 transition-colors ${active ? "border-primary" : "border-outline-variant hover:border-on-surface-variant"}`}
              >
                <div className="aspect-[4/5] flex flex-col items-center justify-center" style={{ backgroundColor: rgbToHex(def.theme.base) }}>
                  {p.shapeOverlay === EShapeOverlay.HEART ? (
                    <span style={{ color: rgbToHex(def.theme.accent), fontSize: 18 }}>♥</span>
                  ) : p.shapeOverlay === EShapeOverlay.CIRCLE ? (
                    <span className="w-6 h-6 rounded-full border-2" style={{ borderColor: rgbToHex(def.theme.accent) }} />
                  ) : (
                    <span className="w-7 h-0.5 rounded" style={{ backgroundColor: rgbToHex(def.theme.accent) }} />
                  )}
                  <span className="mt-1 text-[7px] font-bold uppercase tracking-wider" style={{ color: rgbToHex(def.theme.accent), opacity: 0.7 }}>{p.name}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Headline suggestions */}
      <div>
        <p className={sectionLabel}>Idées de titre</p>
        <div className="flex flex-col gap-2 mt-3">
          {suggestions.map((h) => (
            <button
              key={h}
              onClick={() => setHeadline(h)}
              className="text-left px-3 py-2.5 border border-outline-variant text-sm text-primary hover:border-primary hover:bg-surface-dim transition-colors"
            >
              {h}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
