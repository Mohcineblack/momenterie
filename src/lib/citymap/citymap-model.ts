// Citymap editor data model — ported from the momenterie Vue editor.
// Defines the full customization domain: map styles + color themes, fonts,
// marker icons/sizes, shape overlays, poster padding, text layouts, and print options.

/* ------------------------------------------------------------------ */
/* Map styles + color themes                                          */
/* ------------------------------------------------------------------ */

export enum EMapStyle {
  GLACIER = "GLACIER",
  NAUTIC = "NAUTIC",
  WEBMAP = "WEBMAP",
  LIGHTBLUE = "LIGHTBLUE",
  DARK = "DARK",
  BLUE = "BLUE",
  PINK = "PINK",
  RED = "RED",
  LIGHT = "LIGHT",
  SEPIA = "SEPIA",
}

export interface ColorTheme {
  /** RGB string "r, g, b" for the base (background/paper) color */
  base: string;
  /** RGB string "r, g, b" for the accent (text/marker/lines) color */
  accent: string;
}

/** Color theme per map style (from the Vue editor's `Ro` map). */
export const COLOR_THEME: Record<EMapStyle, ColorTheme> = {
  [EMapStyle.GLACIER]: { base: "255, 255, 255", accent: "90, 90, 90" },
  [EMapStyle.NAUTIC]: { base: "255, 250, 234", accent: "149, 62, 32" },
  [EMapStyle.WEBMAP]: { base: "255, 255, 255", accent: "112, 112, 112" },
  [EMapStyle.LIGHTBLUE]: { base: "255, 255, 255", accent: "57, 68, 98" },
  [EMapStyle.DARK]: { base: "0, 0, 0", accent: "255, 255, 255" },
  [EMapStyle.BLUE]: { base: "2, 9, 64", accent: "255, 255, 255" },
  [EMapStyle.PINK]: { base: "210, 135, 157", accent: "255, 255, 255" },
  [EMapStyle.RED]: { base: "203, 54, 54", accent: "255, 255, 255" },
  [EMapStyle.LIGHT]: { base: "255, 255, 255", accent: "40, 40, 40" },
  [EMapStyle.SEPIA]: { base: "255, 255, 255", accent: "128, 112, 107" },
};

export interface MapStyleDef {
  id: EMapStyle;
  /** Display name shown in the style picker */
  name: string;
  theme: ColorTheme;
  /** Whether this style reads as a dark background (drives tile base + UI). */
  dark: boolean;
}

const STYLE_NAMES: Record<EMapStyle, string> = {
  [EMapStyle.GLACIER]: "Glacier",
  [EMapStyle.NAUTIC]: "Nautic",
  [EMapStyle.WEBMAP]: "Webmap",
  [EMapStyle.LIGHTBLUE]: "Light Blue",
  [EMapStyle.DARK]: "Dark",
  [EMapStyle.BLUE]: "Blue",
  [EMapStyle.PINK]: "Pink",
  [EMapStyle.RED]: "Red",
  [EMapStyle.LIGHT]: "Light",
  [EMapStyle.SEPIA]: "Sepia",
};

function isDarkBase(theme: ColorTheme): boolean {
  const [r, g, b] = theme.base.split(",").map((n) => parseInt(n.trim(), 10));
  return r * 0.299 + g * 0.587 + b * 0.114 < 128;
}

export const MAP_STYLE_LIST: MapStyleDef[] = (Object.values(EMapStyle) as EMapStyle[]).map((id) => ({
  id,
  name: STYLE_NAMES[id],
  theme: COLOR_THEME[id],
  dark: isDarkBase(COLOR_THEME[id]),
}));

export function getMapStyleDef(id: EMapStyle | string): MapStyleDef {
  return MAP_STYLE_LIST.find((s) => s.id === id) ?? MAP_STYLE_LIST[0];
}

/* ------------------------------------------------------------------ */
/* Fonts                                                              */
/* ------------------------------------------------------------------ */

export enum EFont {
  CORMORANT = "cormorant-garamond",
  BLOOMING_SECONDARY = "blooming-secondary-momenterie",
  GALANO_GROTESQUE = "galano-grotesque",
}

export const FONT_FAMILY: Record<EFont, string> = {
  [EFont.CORMORANT]: "var(--citymap-cormorant)",
  [EFont.BLOOMING_SECONDARY]: "var(--citymap-script)",
  [EFont.GALANO_GROTESQUE]: "var(--citymap-galano)",
};

export const FONT_LABEL: Record<EFont, string> = {
  [EFont.CORMORANT]: "Cormorant Garamond",
  [EFont.BLOOMING_SECONDARY]: "Blooming Secondary Momenterie",
  [EFont.GALANO_GROTESQUE]: "Galano Grotesque",
};

/* ------------------------------------------------------------------ */
/* Markers                                                            */
/* ------------------------------------------------------------------ */

export enum EMarkerType {
  ICON = "icon",
  PHOTO = "photo",
}

export enum EMarkerIcon {
  PIN_HEART = "PIN_HEART",
  PIN_HOUSE = "PIN_HOUSE",
  PIN_CIRCLE = "PIN_CIRCLE",
  PIN_STAR = "PIN_STAR",
  PIN_RINGS = "PIN_RINGS",
  PIN_STUDY = "PIN_STUDY",
  PIN_KEY = "PIN_KEY",
  PIN_DIAMOND = "PIN_DIAMOND",
  PIN_PAW = "PIN_PAW",
  PIN_PALMTREE = "PIN_PALMTREE",
  PIN_AIRPLANE = "PIN_AIRPLANE",
}

export const MARKER_ICON_LIST: EMarkerIcon[] = Object.values(EMarkerIcon);

export enum EMarkerSize {
  XSMALL = "XSMALL",
  SMALL = "SMALL",
  MEDIUM = "MEDIUM",
  LARGE = "LARGE",
  XLARGE = "XLARGE",
}

export interface MarkerSizeDef {
  size: [number, number];
  anchor: [number, number];
}

export const MARKER_SIZE: Record<EMarkerSize, MarkerSizeDef> = {
  [EMarkerSize.XSMALL]: { size: [16, 16], anchor: [8, 16] },
  [EMarkerSize.SMALL]: { size: [24, 24], anchor: [12, 24] },
  [EMarkerSize.MEDIUM]: { size: [32, 32], anchor: [16, 32] },
  [EMarkerSize.LARGE]: { size: [40, 40], anchor: [20, 40] },
  [EMarkerSize.XLARGE]: { size: [48, 48], anchor: [24, 48] },
};

/** Which layer a chosen color applies to. */
export enum EMarkerColorLayer {
  MARKER = "marker",
  SYMBOL = "symbol",
}

/** Default marker color palette (hex, no leading #). */
export const MARKER_COLORS: string[] = [
  "E86B6C", "201F1E", "DDB44C", "87C0E0", "B72619",
  "92B2D5", "9FBA7E", "619DB0", "F14E89", "F6C342",
  "70DBB2", "EEB03B", "61B8E7", "415286", "75AB93",
  "BE8F5B", "84746E", "FFFFFF",
];

/* ------------------------------------------------------------------ */
/* Shape overlay                                                      */
/* ------------------------------------------------------------------ */

export enum EShapeOverlay {
  NONE = "NONE",
  CIRCLE = "CIRCLE",
  HEART = "HEART",
}

/* ------------------------------------------------------------------ */
/* Poster padding                                                     */
/* ------------------------------------------------------------------ */

export enum EPosterPadding {
  NONE = "NONE",
  SMALL = "SMALL",
  LARGE = "LARGE",
}

export const POSTER_PADDING_PX: Record<EPosterPadding, string> = {
  [EPosterPadding.NONE]: "0px",
  [EPosterPadding.SMALL]: "24px",
  [EPosterPadding.LARGE]: "48px",
};

/* ------------------------------------------------------------------ */
/* Gradient overlay                                                   */
/* ------------------------------------------------------------------ */

export enum EGradientOverlay {
  NONE = "none",
  BOTTOM = "bottom",
  TOP_BOTTOM = "top-bottom",
  AROUND = "around",
}

export const GRADIENT_OVERLAY_LABEL: Record<EGradientOverlay, string> = {
  [EGradientOverlay.NONE]: "Aucun",
  [EGradientOverlay.BOTTOM]: "Bas",
  [EGradientOverlay.TOP_BOTTOM]: "Haut & bas",
  [EGradientOverlay.AROUND]: "Autour",
};

/* ------------------------------------------------------------------ */
/* Text layouts                                                       */
/* ------------------------------------------------------------------ */

export enum ETextLayout {
  REGULAR = "regular",
  RETRO = "retro",
  NEWSPAPER = "newspaper",
  BURGER = "burger",
  DEDICATION = "dedication",
}

/** Text variation — 'playful' swaps the headline to the script font. */
export enum ETextVariant {
  DEFAULT = "default",
  PLAYFUL = "playful",
}

export interface TextLayoutDef {
  id: ETextLayout;
  /** UI label (FR, matching the source editor) */
  label: string;
  /** Whether a dedication field is shown for this layout */
  hasDedication: boolean;
}

export const TEXT_LAYOUT_LIST: TextLayoutDef[] = [
  { id: ETextLayout.REGULAR, label: "Meilleure vente", hasDedication: false },
  { id: ETextLayout.RETRO, label: "Rétro", hasDedication: false },
  { id: ETextLayout.NEWSPAPER, label: "Journal", hasDedication: false },
  { id: ETextLayout.BURGER, label: "Beaucoup de texte", hasDedication: false },
  { id: ETextLayout.DEDICATION, label: "Dédicace", hasDedication: true },
];

/* ------------------------------------------------------------------ */
/* Product options                                                    */
/* ------------------------------------------------------------------ */

export enum EPrintType {
  POSTER = "POSTER",
  POSTER_FRAMED = "POSTER_FRAMED",
}

export enum EPrintSize {
  _30X40 = "30X40",
  _45X60 = "45X60",
  _50X70 = "50X70",
  _60X80 = "60X80",
}

export const PRINT_SIZE_LABEL: Record<EPrintSize, string> = {
  [EPrintSize._30X40]: "30 × 40 cm",
  [EPrintSize._45X60]: "45 × 60 cm",
  [EPrintSize._50X70]: "50 × 70 cm",
  [EPrintSize._60X80]: "60 × 80 cm",
};

export enum EFrameColor {
  WHITE = "WHITE",
  BLACK = "BLACK",
}

export const FRAME_COLOR_HEX: Record<EFrameColor, string> = {
  [EFrameColor.WHITE]: "#FFFFFF",
  [EFrameColor.BLACK]: "#1A1A1A",
};

/* ------------------------------------------------------------------ */
/* Design categories (for presets + headline suggestions)             */
/* ------------------------------------------------------------------ */

export enum EDesignCategory {
  BESTSELLER = "BESTSELLER",
  HEART = "HEART",
  DARK = "DARK",
  MINIMALISTIC = "MINIMALISTIC",
  TEXT = "TEXT",
  HANDWRITING = "HANDWRITING",
}

export const DESIGN_CATEGORY_EMOJI: Record<EDesignCategory, string> = {
  [EDesignCategory.BESTSELLER]: "⭐",
  [EDesignCategory.HEART]: "🩷",
  [EDesignCategory.DARK]: "🌚",
  [EDesignCategory.MINIMALISTIC]: "☁️",
  [EDesignCategory.TEXT]: "💬",
  [EDesignCategory.HANDWRITING]: "✍️",
};

export const DESIGN_CATEGORY_LABEL: Record<EDesignCategory, string> = {
  [EDesignCategory.BESTSELLER]: "Populaire",
  [EDesignCategory.HEART]: "Amour",
  [EDesignCategory.DARK]: "Sombre",
  [EDesignCategory.MINIMALISTIC]: "Minimaliste",
  [EDesignCategory.TEXT]: "Avec texte",
  [EDesignCategory.HANDWRITING]: "Manuscrit",
};

/* ------------------------------------------------------------------ */
/* Color helpers                                                      */
/* ------------------------------------------------------------------ */

/** "r, g, b" -> "#rrggbb" */
export function rgbToHex(rgb: string): string {
  const [r, g, b] = rgb.split(",").map((n) => parseInt(n.trim(), 10));
  return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
}

/** Relative luminance for WCAG contrast. Accepts hex with/without #. */
function luminance(hex: string): number {
  const h = hex.replace("#", "");
  const rgb = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
  const [r, g, b] = rgb.map((c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Contrast ratio between two hex colors (1..21). */
export function contrast(a: string, b: string): number {
  const l1 = luminance(a);
  const l2 = luminance(b);
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

export interface MarkerColors {
  backgroundColor: string;
  foregroundColor: string;
}

/**
 * Resolve the marker pin + symbol colors given the chosen color and layer.
 * Mirrors the Vue editor's `rt` helper.
 */
export function resolveMarkerColors(color: string, layer: EMarkerColorLayer = EMarkerColorLayer.SYMBOL): MarkerColors {
  const hex = color.startsWith("#") ? color : "#" + color;
  const opposite = contrast("#FFFFFF", hex) > 1.2 ? "#FFFFFF" : "#000000";
  return {
    backgroundColor: layer === EMarkerColorLayer.MARKER ? hex : opposite,
    foregroundColor: layer === EMarkerColorLayer.SYMBOL ? hex : opposite,
  };
}
