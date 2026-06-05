import {
  EMapStyle,
  ETextLayout,
  ETextVariant,
  EShapeOverlay,
  EDesignCategory,
} from "@/lib/citymap/citymap-model";

export interface DesignPreset {
  id: string;
  mapStyle: EMapStyle;
  textLayout: ETextLayout;
  textVariant: ETextVariant;
  shapeOverlay: EShapeOverlay;
}

/** Curated design presets per category (combinations applied via store.applyDesign). */
export const DESIGN_PRESETS: Record<EDesignCategory, DesignPreset[]> = {
  [EDesignCategory.BESTSELLER]: [
    { id: "bs-glacier", mapStyle: EMapStyle.GLACIER, textLayout: ETextLayout.REGULAR, textVariant: ETextVariant.DEFAULT, shapeOverlay: EShapeOverlay.NONE },
    { id: "bs-light", mapStyle: EMapStyle.LIGHT, textLayout: ETextLayout.NEWSPAPER, textVariant: ETextVariant.DEFAULT, shapeOverlay: EShapeOverlay.NONE },
    { id: "bs-dark", mapStyle: EMapStyle.DARK, textLayout: ETextLayout.REGULAR, textVariant: ETextVariant.DEFAULT, shapeOverlay: EShapeOverlay.NONE },
    { id: "bs-sepia", mapStyle: EMapStyle.SEPIA, textLayout: ETextLayout.RETRO, textVariant: ETextVariant.DEFAULT, shapeOverlay: EShapeOverlay.NONE },
  ],
  [EDesignCategory.HEART]: [
    { id: "hr-pink", mapStyle: EMapStyle.PINK, textLayout: ETextLayout.DEDICATION, textVariant: ETextVariant.PLAYFUL, shapeOverlay: EShapeOverlay.HEART },
    { id: "hr-red", mapStyle: EMapStyle.RED, textLayout: ETextLayout.REGULAR, textVariant: ETextVariant.PLAYFUL, shapeOverlay: EShapeOverlay.HEART },
    { id: "hr-glacier", mapStyle: EMapStyle.GLACIER, textLayout: ETextLayout.DEDICATION, textVariant: ETextVariant.PLAYFUL, shapeOverlay: EShapeOverlay.HEART },
  ],
  [EDesignCategory.FAMILY]: [
    { id: "fm-light", mapStyle: EMapStyle.LIGHT, textLayout: ETextLayout.BURGER, textVariant: ETextVariant.DEFAULT, shapeOverlay: EShapeOverlay.NONE },
    { id: "fm-sepia", mapStyle: EMapStyle.SEPIA, textLayout: ETextLayout.DEDICATION, textVariant: ETextVariant.DEFAULT, shapeOverlay: EShapeOverlay.NONE },
    { id: "fm-nautic", mapStyle: EMapStyle.NAUTIC, textLayout: ETextLayout.REGULAR, textVariant: ETextVariant.DEFAULT, shapeOverlay: EShapeOverlay.NONE },
  ],
  [EDesignCategory.TRAVEL]: [
    { id: "tv-lightblue", mapStyle: EMapStyle.LIGHTBLUE, textLayout: ETextLayout.NEWSPAPER, textVariant: ETextVariant.DEFAULT, shapeOverlay: EShapeOverlay.NONE },
    { id: "tv-blue", mapStyle: EMapStyle.BLUE, textLayout: ETextLayout.REGULAR, textVariant: ETextVariant.DEFAULT, shapeOverlay: EShapeOverlay.CIRCLE },
    { id: "tv-nautic", mapStyle: EMapStyle.NAUTIC, textLayout: ETextLayout.RETRO, textVariant: ETextVariant.DEFAULT, shapeOverlay: EShapeOverlay.NONE },
  ],
  [EDesignCategory.HOME]: [
    { id: "hm-glacier", mapStyle: EMapStyle.GLACIER, textLayout: ETextLayout.REGULAR, textVariant: ETextVariant.PLAYFUL, shapeOverlay: EShapeOverlay.CIRCLE },
    { id: "hm-webmap", mapStyle: EMapStyle.WEBMAP, textLayout: ETextLayout.DEDICATION, textVariant: ETextVariant.DEFAULT, shapeOverlay: EShapeOverlay.NONE },
    { id: "hm-sepia", mapStyle: EMapStyle.SEPIA, textLayout: ETextLayout.REGULAR, textVariant: ETextVariant.PLAYFUL, shapeOverlay: EShapeOverlay.NONE },
  ],
};

/** Headline suggestions per category (French, matching the source editor's tone). */
export const HEADLINE_SUGGESTIONS: Record<EDesignCategory, string[]> = {
  [EDesignCategory.BESTSELLER]: [
    "Là où tout a commencé",
    "Nos coordonnées",
    "Un lieu, mille souvenirs",
    "Notre endroit",
  ],
  [EDesignCategory.HEART]: [
    "Amour au premier regard",
    "Notre premier baiser",
    "Premier contact visuel",
    "Notre premier rendez-vous",
    "La demande en mariage",
    "Baisers au clair de lune",
    "Notre ancre de vie",
    "Amour éternel",
  ],
  [EDesignCategory.FAMILY]: [
    "Bonheur familial",
    "Moments de bonheur en famille",
    "Notre petit monde",
    "Notre tribu",
    "Là où notre famille a grandi",
  ],
  [EDesignCategory.TRAVEL]: [
    "Aventures inoubliables",
    "Des instants inoubliables",
    "Notre voyage",
    "Main dans la main autour du monde",
    "Découvrir le monde ensemble",
    "En route vers le paradis",
  ],
  [EDesignCategory.HOME]: [
    "La maison du bonheur",
    "Home sweet home",
    "Notre petit paradis",
    "Là où le cœur se sent chez lui",
    "Notre chez-nous",
  ],
};
