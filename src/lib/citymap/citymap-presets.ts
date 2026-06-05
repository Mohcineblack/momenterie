import {
  EMapStyle,
  ETextLayout,
  ETextVariant,
  EShapeOverlay,
  EPosterPadding,
  EGradientOverlay,
  EDesignCategory,
} from "@/lib/citymap/citymap-model";

/** Named designs — exact ids from the momenterie source. */
export enum EDesignId {
  LEON = "LEON",
  SOPHIE = "SOPHIE",
  JEANNE = "JEANNE",
  DEVIN = "DEVIN",
  DUSK = "DUSK",
  LOUISE = "LOUISE",
  ROMEO = "ROMEO",
  NINO = "NINO",
  PIA = "PIA",
  KAI = "KAI",
  BRUNO = "BRUNO",
  NILS = "NILS",
  MATE = "MATE",
  NOVA = "NOVA",
  ANOUK = "ANOUK",
  CHERIE = "CHERIE",
  FINN = "FINN",
  JULIETTE = "JULIETTE",
  CUPIDO = "CUPIDO",
  FELIX = "FELIX",
  CLARA = "CLARA",
  HUGO = "HUGO",
  SIMONE = "SIMONE",
  NATALIA = "NATALIA",
  UMBERTO = "UMBERTO",
  ANNA = "ANNA",
  AURORA = "AURORA",
  ESTELLE = "ESTELLE",
  FRIDA = "FRIDA",
  LEONARDO = "LEONARDO",
  CLAUDE = "CLAUDE",
  CLAIRE = "CLAIRE",
  JULES = "JULES",
  ARIA = "ARIA",
  LAILA = "LAILA",
  KAETHE = "KAETHE",
  LUNA = "LUNA",
  JACKY = "JACKY",
}

/** Source text-layout (base_variation) → our (textLayout, textVariant). */
type TL = { layout: ETextLayout; variant: ETextVariant };
const RETRO_DEFAULT: TL = { layout: ETextLayout.RETRO, variant: ETextVariant.DEFAULT };
const RETRO_LARGE: TL = { layout: ETextLayout.RETRO, variant: ETextVariant.DEFAULT };
const NEWSPAPER_DEFAULT: TL = { layout: ETextLayout.NEWSPAPER, variant: ETextVariant.DEFAULT };
const NEWSPAPER_COAST: TL = { layout: ETextLayout.NEWSPAPER, variant: ETextVariant.DEFAULT };
const NEWSPAPER_MODERN: TL = { layout: ETextLayout.NEWSPAPER, variant: ETextVariant.DEFAULT };
const BURGER_ITALIC: TL = { layout: ETextLayout.BURGER, variant: ETextVariant.DEFAULT };
const BURGER_REGULAR: TL = { layout: ETextLayout.BURGER, variant: ETextVariant.DEFAULT };
const BURGER_PLAYFUL: TL = { layout: ETextLayout.BURGER, variant: ETextVariant.PLAYFUL };
const DEDICATION_RETRO: TL = { layout: ETextLayout.DEDICATION, variant: ETextVariant.DEFAULT };
const DEDICATION_PLAYFUL: TL = { layout: ETextLayout.DEDICATION, variant: ETextVariant.PLAYFUL };
const DEDICATION_UP: TL = { layout: ETextLayout.DEDICATION, variant: ETextVariant.DEFAULT };

export interface DesignPreset {
  id: EDesignId;
  name: string;
  mapStyle: EMapStyle;
  posterPadding: EPosterPadding;
  gradientOverlay: EGradientOverlay;
  shapeOverlay: EShapeOverlay;
  shapeOverlayOpacity: number;
  showOutline: boolean;
  textLayout: ETextLayout;
  textVariant: ETextVariant;
}

function def(
  id: EDesignId,
  mapStyle: EMapStyle,
  posterPadding: EPosterPadding,
  gradientOverlay: EGradientOverlay,
  shapeOverlay: EShapeOverlay,
  shapeOverlayOpacity: number,
  showOutline: boolean,
  tl: TL
): DesignPreset {
  return {
    id,
    name: id.charAt(0) + id.slice(1).toLowerCase(),
    mapStyle,
    posterPadding,
    gradientOverlay,
    shapeOverlay,
    shapeOverlayOpacity,
    showOutline,
    textLayout: tl.layout,
    textVariant: tl.variant,
  };
}

/** The exact design definitions (j1) from the momenterie bundle. */
export const CITYMAP_DESIGNS: Record<EDesignId, DesignPreset> = {
  [EDesignId.LEON]: def(EDesignId.LEON, EMapStyle.GLACIER, EPosterPadding.LARGE, EGradientOverlay.NONE, EShapeOverlay.NONE, 0, false, RETRO_DEFAULT),
  [EDesignId.SOPHIE]: def(EDesignId.SOPHIE, EMapStyle.GLACIER, EPosterPadding.LARGE, EGradientOverlay.BOTTOM, EShapeOverlay.NONE, 0, true, NEWSPAPER_DEFAULT),
  [EDesignId.JEANNE]: def(EDesignId.JEANNE, EMapStyle.GLACIER, EPosterPadding.SMALL, EGradientOverlay.BOTTOM, EShapeOverlay.NONE, 0, false, BURGER_REGULAR),
  [EDesignId.DEVIN]: def(EDesignId.DEVIN, EMapStyle.DARK, EPosterPadding.LARGE, EGradientOverlay.AROUND, EShapeOverlay.NONE, 0, true, RETRO_LARGE),
  [EDesignId.DUSK]: def(EDesignId.DUSK, EMapStyle.NAUTIC, EPosterPadding.NONE, EGradientOverlay.NONE, EShapeOverlay.NONE, 0, false, RETRO_DEFAULT),
  [EDesignId.LOUISE]: def(EDesignId.LOUISE, EMapStyle.WEBMAP, EPosterPadding.LARGE, EGradientOverlay.BOTTOM, EShapeOverlay.NONE, 0, true, NEWSPAPER_DEFAULT),
  [EDesignId.ROMEO]: def(EDesignId.ROMEO, EMapStyle.SEPIA, EPosterPadding.SMALL, EGradientOverlay.AROUND, EShapeOverlay.HEART, 0.1, false, BURGER_ITALIC),
  [EDesignId.NINO]: def(EDesignId.NINO, EMapStyle.DARK, EPosterPadding.SMALL, EGradientOverlay.AROUND, EShapeOverlay.HEART, 0.3, true, NEWSPAPER_MODERN),
  [EDesignId.PIA]: def(EDesignId.PIA, EMapStyle.GLACIER, EPosterPadding.NONE, EGradientOverlay.NONE, EShapeOverlay.NONE, 0, false, RETRO_DEFAULT),
  [EDesignId.KAI]: def(EDesignId.KAI, EMapStyle.LIGHTBLUE, EPosterPadding.LARGE, EGradientOverlay.NONE, EShapeOverlay.NONE, 0, false, RETRO_DEFAULT),
  [EDesignId.BRUNO]: def(EDesignId.BRUNO, EMapStyle.LIGHT, EPosterPadding.LARGE, EGradientOverlay.NONE, EShapeOverlay.NONE, 0, true, RETRO_DEFAULT),
  [EDesignId.NILS]: def(EDesignId.NILS, EMapStyle.NAUTIC, EPosterPadding.NONE, EGradientOverlay.BOTTOM, EShapeOverlay.NONE, 0, false, RETRO_LARGE),
  [EDesignId.MATE]: def(EDesignId.MATE, EMapStyle.GLACIER, EPosterPadding.SMALL, EGradientOverlay.NONE, EShapeOverlay.CIRCLE, 0.85, true, RETRO_LARGE),
  [EDesignId.NOVA]: def(EDesignId.NOVA, EMapStyle.GLACIER, EPosterPadding.NONE, EGradientOverlay.AROUND, EShapeOverlay.NONE, 0, false, NEWSPAPER_MODERN),
  [EDesignId.ANOUK]: def(EDesignId.ANOUK, EMapStyle.LIGHT, EPosterPadding.LARGE, EGradientOverlay.NONE, EShapeOverlay.NONE, 0, false, RETRO_DEFAULT),
  [EDesignId.CHERIE]: def(EDesignId.CHERIE, EMapStyle.RED, EPosterPadding.LARGE, EGradientOverlay.AROUND, EShapeOverlay.HEART, 0.15, true, NEWSPAPER_COAST),
  [EDesignId.FINN]: def(EDesignId.FINN, EMapStyle.BLUE, EPosterPadding.SMALL, EGradientOverlay.AROUND, EShapeOverlay.HEART, 0.15, true, NEWSPAPER_DEFAULT),
  [EDesignId.JULIETTE]: def(EDesignId.JULIETTE, EMapStyle.PINK, EPosterPadding.SMALL, EGradientOverlay.AROUND, EShapeOverlay.HEART, 0, false, BURGER_ITALIC),
  [EDesignId.CUPIDO]: def(EDesignId.CUPIDO, EMapStyle.GLACIER, EPosterPadding.SMALL, EGradientOverlay.NONE, EShapeOverlay.HEART, 0.75, true, DEDICATION_UP),
  [EDesignId.FELIX]: def(EDesignId.FELIX, EMapStyle.NAUTIC, EPosterPadding.SMALL, EGradientOverlay.NONE, EShapeOverlay.HEART, 0.55, false, DEDICATION_PLAYFUL),
  [EDesignId.CLARA]: def(EDesignId.CLARA, EMapStyle.GLACIER, EPosterPadding.NONE, EGradientOverlay.NONE, EShapeOverlay.NONE, 0, false, DEDICATION_RETRO),
  [EDesignId.HUGO]: def(EDesignId.HUGO, EMapStyle.NAUTIC, EPosterPadding.NONE, EGradientOverlay.NONE, EShapeOverlay.NONE, 0, false, DEDICATION_PLAYFUL),
  [EDesignId.SIMONE]: def(EDesignId.SIMONE, EMapStyle.SEPIA, EPosterPadding.SMALL, EGradientOverlay.TOP_BOTTOM, EShapeOverlay.NONE, 0, false, DEDICATION_RETRO),
  [EDesignId.NATALIA]: def(EDesignId.NATALIA, EMapStyle.LIGHT, EPosterPadding.SMALL, EGradientOverlay.NONE, EShapeOverlay.NONE, 0, true, DEDICATION_RETRO),
  [EDesignId.UMBERTO]: def(EDesignId.UMBERTO, EMapStyle.WEBMAP, EPosterPadding.NONE, EGradientOverlay.NONE, EShapeOverlay.NONE, 0, false, DEDICATION_UP),
  [EDesignId.ANNA]: def(EDesignId.ANNA, EMapStyle.LIGHTBLUE, EPosterPadding.LARGE, EGradientOverlay.NONE, EShapeOverlay.NONE, 0, true, DEDICATION_UP),
  [EDesignId.AURORA]: def(EDesignId.AURORA, EMapStyle.RED, EPosterPadding.SMALL, EGradientOverlay.NONE, EShapeOverlay.HEART, 0.6, true, DEDICATION_UP),
  [EDesignId.ESTELLE]: def(EDesignId.ESTELLE, EMapStyle.SEPIA, EPosterPadding.LARGE, EGradientOverlay.BOTTOM, EShapeOverlay.NONE, 0, true, BURGER_ITALIC),
  [EDesignId.FRIDA]: def(EDesignId.FRIDA, EMapStyle.NAUTIC, EPosterPadding.SMALL, EGradientOverlay.BOTTOM, EShapeOverlay.NONE, 0, false, BURGER_PLAYFUL),
  [EDesignId.LEONARDO]: def(EDesignId.LEONARDO, EMapStyle.LIGHTBLUE, EPosterPadding.LARGE, EGradientOverlay.BOTTOM, EShapeOverlay.NONE, 0, true, NEWSPAPER_COAST),
  [EDesignId.CLAUDE]: def(EDesignId.CLAUDE, EMapStyle.LIGHT, EPosterPadding.SMALL, EGradientOverlay.AROUND, EShapeOverlay.NONE, 0, true, BURGER_PLAYFUL),
  [EDesignId.CLAIRE]: def(EDesignId.CLAIRE, EMapStyle.LIGHTBLUE, EPosterPadding.SMALL, EGradientOverlay.BOTTOM, EShapeOverlay.NONE, 0, false, BURGER_ITALIC),
  [EDesignId.JULES]: def(EDesignId.JULES, EMapStyle.NAUTIC, EPosterPadding.SMALL, EGradientOverlay.BOTTOM, EShapeOverlay.NONE, 0, false, BURGER_ITALIC),
  [EDesignId.ARIA]: def(EDesignId.ARIA, EMapStyle.DARK, EPosterPadding.SMALL, EGradientOverlay.NONE, EShapeOverlay.CIRCLE, 0.6, true, DEDICATION_UP),
  [EDesignId.LAILA]: def(EDesignId.LAILA, EMapStyle.DARK, EPosterPadding.NONE, EGradientOverlay.AROUND, EShapeOverlay.NONE, 0, false, BURGER_ITALIC),
  [EDesignId.KAETHE]: def(EDesignId.KAETHE, EMapStyle.DARK, EPosterPadding.SMALL, EGradientOverlay.BOTTOM, EShapeOverlay.NONE, 0, false, DEDICATION_PLAYFUL),
  [EDesignId.LUNA]: def(EDesignId.LUNA, EMapStyle.BLUE, EPosterPadding.NONE, EGradientOverlay.AROUND, EShapeOverlay.NONE, 0, false, RETRO_LARGE),
  [EDesignId.JACKY]: def(EDesignId.JACKY, EMapStyle.DARK, EPosterPadding.LARGE, EGradientOverlay.NONE, EShapeOverlay.NONE, 0, true, RETRO_DEFAULT),
};

/** Designs shown per category (exact lists from the source). */
export const DESIGNS_BY_CATEGORY: Record<EDesignCategory, EDesignId[]> = {
  [EDesignCategory.BESTSELLER]: [EDesignId.LEON, EDesignId.SOPHIE, EDesignId.JEANNE, EDesignId.DEVIN, EDesignId.DUSK, EDesignId.LOUISE, EDesignId.ROMEO, EDesignId.NINO],
  [EDesignCategory.MINIMALISTIC]: [EDesignId.PIA, EDesignId.KAI, EDesignId.BRUNO, EDesignId.NILS, EDesignId.SOPHIE, EDesignId.MATE, EDesignId.NOVA, EDesignId.ANOUK],
  [EDesignCategory.HEART]: [EDesignId.CHERIE, EDesignId.FINN, EDesignId.ROMEO, EDesignId.JULIETTE, EDesignId.CUPIDO, EDesignId.FELIX, EDesignId.NINO],
  [EDesignCategory.TEXT]: [EDesignId.CLARA, EDesignId.HUGO, EDesignId.SIMONE, EDesignId.NATALIA, EDesignId.UMBERTO, EDesignId.ANNA, EDesignId.AURORA],
  [EDesignCategory.HANDWRITING]: [EDesignId.ESTELLE, EDesignId.ROMEO, EDesignId.FRIDA, EDesignId.LEONARDO, EDesignId.CLAUDE, EDesignId.CLAIRE, EDesignId.JULES],
  [EDesignCategory.DARK]: [EDesignId.DEVIN, EDesignId.ARIA, EDesignId.LAILA, EDesignId.KAETHE, EDesignId.LUNA, EDesignId.JACKY],
};

/** Headline suggestions per category (French, matching the source editor's tone). */
export const HEADLINE_SUGGESTIONS: Record<EDesignCategory, string[]> = {
  [EDesignCategory.BESTSELLER]: ["Là où tout a commencé", "Nos coordonnées", "Un lieu, mille souvenirs", "Notre endroit"],
  [EDesignCategory.HEART]: ["Amour au premier regard", "Notre premier baiser", "Premier contact visuel", "La demande en mariage", "Baisers au clair de lune", "Amour éternel"],
  [EDesignCategory.DARK]: ["Sous les étoiles", "Notre nuit", "Là où la nuit nous a réunis", "Minuit à deux"],
  [EDesignCategory.MINIMALISTIC]: ["Chez nous", "Notre ville", "Ici", "Notre repère"],
  [EDesignCategory.TEXT]: ["Notre histoire commence ici", "Le jour où tout a changé", "Une dédicace pour toujours", "Nos mots, notre lieu"],
  [EDesignCategory.HANDWRITING]: ["Avec amour", "Pour toujours", "Notre voyage", "À jamais ensemble"],
};
