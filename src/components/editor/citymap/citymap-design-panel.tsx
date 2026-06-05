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
import { DESIGN_PRESETS, HEADLINE_SUGGESTIONS } from "@/lib/citymap/citymap-presets";

const sectionLabel = "font-sans text-[10px] uppercase tracking-[0.15em] font-bold text-primary";
const CATEGORIES = Object.values(EDesignCategory);

export function DesignPanel() {
  const applyDesign = useCitymapEditor((s) => s.applyDesign);
  const setHeadline = useCitymapEditor((s) => s.setHeadline);
  const mapStyle = useCitymapEditor((s) => s.mapStyle);
  const textLayout = useCitymapEditor((s) => s.textLayout);

  const [category, setCategory] = useState<EDesignCategory>(EDesignCategory.BESTSELLER);

  const presets = DESIGN_PRESETS[category];
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
        <div className="grid grid-cols-3 gap-2 mt-3">
          {presets.map((p) => {
            const def = getMapStyleDef(p.mapStyle);
            const active = mapStyle === p.mapStyle && textLayout === p.textLayout;
            return (
              <button
                key={p.id}
                onClick={() => applyDesign({ mapStyle: p.mapStyle, textLayout: p.textLayout, textVariant: p.textVariant, shapeOverlay: p.shapeOverlay })}
                className={`relative border-2 transition-colors ${active ? "border-primary" : "border-outline-variant hover:border-on-surface-variant"}`}
              >
                <div className="aspect-[4/5] flex flex-col" style={{ backgroundColor: rgbToHex(def.theme.base) }}>
                  <div className="flex-1 flex items-center justify-center">
                    {p.shapeOverlay === EShapeOverlay.HEART ? (
                      <span style={{ color: rgbToHex(def.theme.accent), fontSize: 22 }}>♥</span>
                    ) : p.shapeOverlay === EShapeOverlay.CIRCLE ? (
                      <span className="w-7 h-7 rounded-full border-2" style={{ borderColor: rgbToHex(def.theme.accent) }} />
                    ) : (
                      <span className="w-8 h-1 rounded" style={{ backgroundColor: rgbToHex(def.theme.accent) }} />
                    )}
                  </div>
                  <div className="h-1/4 flex items-center justify-center" style={{ backgroundColor: rgbToHex(def.theme.base) }}>
                    <span className="w-1/2 h-1 rounded" style={{ backgroundColor: rgbToHex(def.theme.accent), opacity: 0.7 }} />
                  </div>
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
