"use client";

import {
  ETextLayout,
  ETextVariant,
  EFont,
  FONT_FAMILY,
  getMapStyleDef,
  rgbToHex,
} from "@/lib/citymap/citymap-model";
import { useCitymapEditor } from "@/store/citymap-editor-store";

interface CitymapTextProps {
  coordinates?: string;
}

/**
 * Poster text block. Faithful to the momenterie source layouts:
 * - retro      : centered, spaced uppercase headline
 * - newspaper  : headline + subtitle flanked by decorative rules
 * - burger     : large Cormorant (or script) headline, uppercase sub/tagline
 * - dedication : two-column grid (headline left, dedication right)
 * - regular    : clean centered default
 */
export function CitymapText({ coordinates }: CitymapTextProps) {
  const headline = useCitymapEditor((s) => s.headline);
  const subheadline = useCitymapEditor((s) => s.subheadline);
  const tagline = useCitymapEditor((s) => s.tagline);
  const dedication = useCitymapEditor((s) => s.dedication);
  const layout = useCitymapEditor((s) => s.textLayout);
  const variant = useCitymapEditor((s) => s.textVariant);
  const font = useCitymapEditor((s) => s.font);
  const showCoordinates = useCitymapEditor((s) => s.showCoordinates);
  const mapStyle = useCitymapEditor((s) => s.mapStyle);
  const location = useCitymapEditor((s) => s.location);

  const theme = getMapStyleDef(mapStyle).theme;
  const accent = rgbToHex(theme.accent);
  const base = rgbToHex(theme.base);

  const coords =
    coordinates ??
    (location && showCoordinates
      ? `${Math.abs(location.lat).toFixed(4)}° ${location.lat >= 0 ? "N" : "S"}, ${Math.abs(location.lng).toFixed(4)}° ${location.lng >= 0 ? "E" : "W"}`
      : "");

  const title = headline || "PARIS";
  const sub = subheadline || coords;
  const playful = variant === ETextVariant.PLAYFUL;

  // headline face: playful → script; otherwise per layout (Galano for editorial layouts, selected/Cormorant for burger/regular)
  const editorial = layout === ETextLayout.NEWSPAPER || layout === ETextLayout.RETRO || layout === ETextLayout.DEDICATION;
  const headlineFont = playful
    ? FONT_FAMILY[EFont.BLOOMING_SECONDARY]
    : editorial
      ? FONT_FAMILY[EFont.GALANO_GROTESQUE]
      : FONT_FAMILY[font];
  const bodyFont = FONT_FAMILY[EFont.GALANO_GROTESQUE];

  const wrapper: React.CSSProperties = {
    backgroundColor: base,
    ["--cm-fg" as string]: theme.accent,
    color: accent,
  };
  const headlineStyle: React.CSSProperties = { fontFamily: headlineFont, color: accent };
  const bodyStyle: React.CSSProperties = { fontFamily: bodyFont, color: accent };

  const cls = `citymap-text cm--${layout} ${playful ? "cm--playful" : "cm--default"}`;

  if (layout === ETextLayout.DEDICATION) {
    return (
      <div className={cls} style={wrapper}>
        <div className="cm-left">
          <p className="cm-headline" style={headlineStyle}>{title}</p>
          {sub && <p className="cm-subtitle" style={bodyStyle}>{sub}</p>}
          {tagline && <p className="cm-tagline" style={bodyStyle}>{tagline}</p>}
        </div>
        <div className="cm-right">
          {dedication && <p className="cm-dedication" style={bodyStyle}>{dedication}</p>}
        </div>
      </div>
    );
  }

  if (layout === ETextLayout.NEWSPAPER) {
    return (
      <div className={cls} style={wrapper}>
        <p className="cm-headline" style={headlineStyle}>{title}</p>
        <div className="cm-subtext">
          {sub && <p className="cm-subtitle cm-subtitle--ruled" style={bodyStyle}>{sub}</p>}
          {tagline && <p className="cm-tagline" style={bodyStyle}>{tagline}</p>}
        </div>
      </div>
    );
  }

  // retro / burger / regular share the centered structure
  return (
    <div className={cls} style={wrapper}>
      <p className="cm-headline" style={headlineStyle}>{title}</p>
      <div className="cm-subtext">
        {sub && <p className="cm-subtitle" style={bodyStyle}>{sub}</p>}
        {tagline && <p className="cm-tagline" style={bodyStyle}>{tagline}</p>}
      </div>
    </div>
  );
}
