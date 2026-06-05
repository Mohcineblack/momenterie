export interface MapColorSet {
  water: string;
  land: string;
  landuse: string;
  roads: string;
  majorRoads: string;
  buildings: string;
  text: string;
  background: string;
  marker: string;
}

export interface ColorVariant {
  id: string;
  label: string;
  colors: MapColorSet;
}

export type TextLayout = "standard" | "cursive" | "minimal" | "verbose";
export type MapMask = "none" | "heart";

export interface PosterMapStyle {
  id: string;
  name: string;
  mask: MapMask;
  defaultTextLayout: TextLayout;
  colors: MapColorSet;
  colorVariants: ColorVariant[];
}

export interface PosterStarStyle {
  id: string;
  name: string;
  colors: {
    background: string;
    stars: string;
    constellation: string;
    grid: string;
    milkyWay: string;
    text: string;
  };
}

export const MAP_STYLE_REGISTRY = {
  leon: {
    id: "leon",
    name: "Léon",
    mask: "none",
    defaultTextLayout: "standard",
    colors: { water: "#9BB8CD", land: "#F3F3F3", landuse: "#E6E9DD", roads: "#FFFFFF", majorRoads: "#D8D8D8", buildings: "#E0E0E0", text: "#1A1A1A", background: "#FFFFFF", marker: "#111827" },
    colorVariants: [
      { id: "leon-default", label: "Bleu classique", colors: { water: "#9BB8CD", land: "#F3F3F3", landuse: "#E6E9DD", roads: "#FFFFFF", majorRoads: "#D8D8D8", buildings: "#E0E0E0", text: "#1A1A1A", background: "#FFFFFF", marker: "#111827" } },
      { id: "leon-teal", label: "Vert d'eau", colors: { water: "#5BA4A4", land: "#F3F3F3", landuse: "#E6EDE9", roads: "#FFFFFF", majorRoads: "#D8D8D8", buildings: "#E0E0E0", text: "#1A1A1A", background: "#FFFFFF", marker: "#111827" } },
      { id: "leon-warm", label: "Beige chaud", colors: { water: "#C4A882", land: "#FAF5ED", landuse: "#EDE6D6", roads: "#FFF8F0", majorRoads: "#DDD0BC", buildings: "#E8DFD0", text: "#3D3028", background: "#FAF5ED", marker: "#3D3028" } },
      { id: "leon-grey", label: "Gris mono", colors: { water: "#B0B0B0", land: "#F5F5F5", landuse: "#EBEBEB", roads: "#FFFFFF", majorRoads: "#C8C8C8", buildings: "#E0E0E0", text: "#2A2A2A", background: "#F5F5F5", marker: "#2A2A2A" } },
      { id: "leon-navy", label: "Bleu marine", colors: { water: "#1B3A5C", land: "#F0F4F8", landuse: "#E0E8F0", roads: "#FFFFFF", majorRoads: "#C8D4E0", buildings: "#D8E2EE", text: "#0F2640", background: "#F0F4F8", marker: "#0F2640" } },
      { id: "leon-rose", label: "Rosé", colors: { water: "#D4A5A5", land: "#FDF5F5", landuse: "#F5EAEA", roads: "#FFFFFF", majorRoads: "#E8D0D0", buildings: "#F0E0E0", text: "#4A2828", background: "#FDF5F5", marker: "#4A2828" } },
    ],
  },
  sophie: {
    id: "sophie",
    name: "Sophie",
    mask: "none",
    defaultTextLayout: "verbose",
    colors: { water: "#9BB8CD", land: "#F3F3F3", landuse: "#E6E9DD", roads: "#FFFFFF", majorRoads: "#D8D8D8", buildings: "#E0E0E0", text: "#1A1A1A", background: "#FFFFFF", marker: "#111827" },
    colorVariants: [
      { id: "sophie-default", label: "Classique", colors: { water: "#9BB8CD", land: "#F3F3F3", landuse: "#E6E9DD", roads: "#FFFFFF", majorRoads: "#D8D8D8", buildings: "#E0E0E0", text: "#1A1A1A", background: "#FFFFFF", marker: "#111827" } },
      { id: "sophie-sage", label: "Sauge", colors: { water: "#8BADA3", land: "#F5F7F4", landuse: "#E4ECE6", roads: "#FFFFFF", majorRoads: "#C8D8D0", buildings: "#DBE6DF", text: "#2A3D34", background: "#F5F7F4", marker: "#2A3D34" } },
      { id: "sophie-lavender", label: "Lavande", colors: { water: "#A08DC4", land: "#F8F5FC", landuse: "#EDE8F5", roads: "#FFFFFF", majorRoads: "#D0C4E0", buildings: "#E4DCF0", text: "#2D1F4E", background: "#F8F5FC", marker: "#2D1F4E" } },
      { id: "sophie-peach", label: "Pêche", colors: { water: "#E8A87C", land: "#FEF9F5", landuse: "#F8EDE4", roads: "#FFFFFF", majorRoads: "#EAD0BC", buildings: "#F4E2D4", text: "#4A2D1A", background: "#FEF9F5", marker: "#4A2D1A" } },
    ],
  },
  jeanne: {
    id: "jeanne",
    name: "Jeanne",
    mask: "none",
    defaultTextLayout: "minimal",
    colors: { water: "#E0E0E0", land: "#FAFAFA", landuse: "#F2F2F2", roads: "#E8E8E8", majorRoads: "#D0D0D0", buildings: "#F0F0F0", text: "#555555", background: "#FAFAFA", marker: "#555555" },
    colorVariants: [
      { id: "jeanne-default", label: "Gris léger", colors: { water: "#E0E0E0", land: "#FAFAFA", landuse: "#F2F2F2", roads: "#E8E8E8", majorRoads: "#D0D0D0", buildings: "#F0F0F0", text: "#555555", background: "#FAFAFA", marker: "#555555" } },
      { id: "jeanne-paper", label: "Papier", colors: { water: "#E6DFD4", land: "#FAF8F4", landuse: "#F2EDE4", roads: "#EDE8E0", majorRoads: "#D8D0C4", buildings: "#F0EBE4", text: "#5A5048", background: "#FAF8F4", marker: "#5A5048" } },
      { id: "jeanne-ice", label: "Glacier", colors: { water: "#D8E8F0", land: "#F8FCFE", landuse: "#EEF4F8", roads: "#E4EEF4", majorRoads: "#C8D8E4", buildings: "#E8F0F6", text: "#3A5060", background: "#F8FCFE", marker: "#3A5060" } },
    ],
  },
  devin: {
    id: "devin",
    name: "Devin",
    mask: "none",
    defaultTextLayout: "standard",
    colors: { water: "#0A0A0A", land: "#1A1A1A", landuse: "#151515", roads: "#333333", majorRoads: "#4A4A4A", buildings: "#111111", text: "#FFFFFF", background: "#0A0A0A", marker: "#FFFFFF" },
    colorVariants: [
      { id: "devin-default", label: "Noir total", colors: { water: "#0A0A0A", land: "#1A1A1A", landuse: "#151515", roads: "#333333", majorRoads: "#4A4A4A", buildings: "#111111", text: "#FFFFFF", background: "#0A0A0A", marker: "#FFFFFF" } },
      { id: "devin-midnight", label: "Nuit bleue", colors: { water: "#0A1628", land: "#0F1F35", landuse: "#0C1A2E", roads: "#1E3A5C", majorRoads: "#2A5080", buildings: "#0A1420", text: "#E0F0FF", background: "#0A1628", marker: "#E0F0FF" } },
      { id: "devin-charcoal", label: "Charbon", colors: { water: "#1A1A1A", land: "#2A2A2A", landuse: "#222222", roads: "#444444", majorRoads: "#5A5A5A", buildings: "#1E1E1E", text: "#E8E8E8", background: "#1A1A1A", marker: "#E8E8E8" } },
      { id: "devin-gold", label: "Or noir", colors: { water: "#0A0A0A", land: "#141210", landuse: "#121010", roads: "#3D3425", majorRoads: "#6B5A3A", buildings: "#0E0C0A", text: "#D4A848", background: "#0A0A0A", marker: "#D4A848" } },
    ],
  },
  crepuscule: {
    id: "crepuscule",
    name: "Crépuscule",
    mask: "none",
    defaultTextLayout: "standard",
    colors: { water: "#5C7A56", land: "#E8E0D0", landuse: "#D4CDB8", roads: "#C8B890", majorRoads: "#A09060", buildings: "#D0C8B8", text: "#3A3020", background: "#E8E0D0", marker: "#3A3020" },
    colorVariants: [
      { id: "crepuscule-default", label: "Terre d'ombre", colors: { water: "#5C7A56", land: "#E8E0D0", landuse: "#D4CDB8", roads: "#C8B890", majorRoads: "#A09060", buildings: "#D0C8B8", text: "#3A3020", background: "#E8E0D0", marker: "#3A3020" } },
      { id: "crepuscule-olive", label: "Olive", colors: { water: "#6B8060", land: "#F0EBD8", landuse: "#DED8C0", roads: "#CCC4A0", majorRoads: "#A8A070", buildings: "#D8D2BE", text: "#3A3820", background: "#F0EBD8", marker: "#3A3820" } },
      { id: "crepuscule-rust", label: "Rouille", colors: { water: "#7A5C4A", land: "#F0E8DA", landuse: "#E0D4C0", roads: "#D4C0A0", majorRoads: "#B09070", buildings: "#DAD0BE", text: "#402818", background: "#F0E8DA", marker: "#402818" } },
      { id: "crepuscule-moss", label: "Mousse", colors: { water: "#4A6B50", land: "#E5E8D8", landuse: "#D0D6C0", roads: "#BCC4A0", majorRoads: "#8CA070", buildings: "#CCD4BE", text: "#2A3820", background: "#E5E8D8", marker: "#2A3820" } },
    ],
  },
  louise: {
    id: "louise",
    name: "Louise",
    mask: "none",
    defaultTextLayout: "cursive",
    colors: { water: "#64B5F6", land: "#FFFDE7", landuse: "#C8E6C9", roads: "#FFF9C4", majorRoads: "#FFCC80", buildings: "#F8BBD0", text: "#37474F", background: "#FFFDE7", marker: "#37474F" },
    colorVariants: [
      { id: "louise-default", label: "Pastel joyeux", colors: { water: "#64B5F6", land: "#FFFDE7", landuse: "#C8E6C9", roads: "#FFF9C4", majorRoads: "#FFCC80", buildings: "#F8BBD0", text: "#37474F", background: "#FFFDE7", marker: "#37474F" } },
      { id: "louise-candy", label: "Bonbon", colors: { water: "#F48FB1", land: "#FFF8E1", landuse: "#E1BEE7", roads: "#FFECB3", majorRoads: "#CE93D8", buildings: "#B3E5FC", text: "#4A148C", background: "#FFF8E1", marker: "#4A148C" } },
      { id: "louise-spring", label: "Printemps", colors: { water: "#4FC3F7", land: "#F1F8E9", landuse: "#DCEDC8", roads: "#F0F4C3", majorRoads: "#AED581", buildings: "#C5E1A5", text: "#33691E", background: "#F1F8E9", marker: "#33691E" } },
    ],
  },
  romeo: {
    id: "romeo",
    name: "Roméo",
    mask: "heart",
    defaultTextLayout: "standard",
    colors: { water: "#9BB8CD", land: "#F3F3F3", landuse: "#E6E9DD", roads: "#FFFFFF", majorRoads: "#D8D8D8", buildings: "#E0E0E0", text: "#1A1A1A", background: "#FFFFFF", marker: "#111827" },
    colorVariants: [
      { id: "romeo-default", label: "Classique cœur", colors: { water: "#9BB8CD", land: "#F3F3F3", landuse: "#E6E9DD", roads: "#FFFFFF", majorRoads: "#D8D8D8", buildings: "#E0E0E0", text: "#1A1A1A", background: "#FFFFFF", marker: "#111827" } },
      { id: "romeo-blush", label: "Rose tendre", colors: { water: "#E8A0A0", land: "#FFF5F5", landuse: "#F8E8E8", roads: "#FFFFFF", majorRoads: "#F0D0D0", buildings: "#FAE8E8", text: "#4A2020", background: "#FFF5F5", marker: "#4A2020" } },
      { id: "romeo-gold", label: "Or romantique", colors: { water: "#C8A86C", land: "#FBF8F0", landuse: "#F0E8D8", roads: "#FFFFFF", majorRoads: "#E0D0B0", buildings: "#F0E8D8", text: "#3D3020", background: "#FBF8F0", marker: "#3D3020" } },
    ],
  },
  nino: {
    id: "nino",
    name: "Nino",
    mask: "heart",
    defaultTextLayout: "standard",
    colors: { water: "#0A0A0A", land: "#1A1A1A", landuse: "#151515", roads: "#333333", majorRoads: "#4A4A4A", buildings: "#111111", text: "#FFFFFF", background: "#0A0A0A", marker: "#FFFFFF" },
    colorVariants: [
      { id: "nino-default", label: "Cœur sombre", colors: { water: "#0A0A0A", land: "#1A1A1A", landuse: "#151515", roads: "#333333", majorRoads: "#4A4A4A", buildings: "#111111", text: "#FFFFFF", background: "#0A0A0A", marker: "#FFFFFF" } },
      { id: "nino-wine", label: "Vin rouge", colors: { water: "#1A0808", land: "#200E0E", landuse: "#1A0A0A", roads: "#4A2020", majorRoads: "#6B3030", buildings: "#150808", text: "#F0D0D0", background: "#1A0808", marker: "#F0D0D0" } },
      { id: "nino-navy", label: "Marine profond", colors: { water: "#050D1A", land: "#0A1628", landuse: "#081020", roads: "#1E3050", majorRoads: "#2A4870", buildings: "#060E1A", text: "#D0E0F8", background: "#050D1A", marker: "#D0E0F8" } },
    ],
  },
} satisfies Record<string, PosterMapStyle>;

export const STARMAP_STYLE_REGISTRY = {
  classic: {
    id: "classic",
    name: "Classic Night",
    colors: {
      background: "#0A1128",
      stars: "#FFFFFF",
      constellation: "#4A90E2",
      grid: "#4A90E2",
      milkyWay: "#3B82F6",
      text: "#FFFFFF",
    },
  },
  navy: {
    id: "navy",
    name: "Navy Blue",
    colors: {
      background: "#001F3F",
      stars: "#FFD700",
      constellation: "#87CEEB",
      grid: "#87CEEB",
      milkyWay: "#2563EB",
      text: "#FFFFFF",
    },
  },
  purple: {
    id: "purple",
    name: "Purple Night",
    colors: {
      background: "#1A0B2E",
      stars: "#FFFFFF",
      constellation: "#B565D8",
      grid: "#B565D8",
      milkyWay: "#7C3AED",
      text: "#E0BBE4",
    },
  },
  red: {
    id: "red",
    name: "Red Sky",
    colors: {
      background: "#2C0000",
      stars: "#FFE4B5",
      constellation: "#FF6B6B",
      grid: "#FF6B6B",
      milkyWay: "#B91C1C",
      text: "#FFE4B5",
    },
  },
  minimal: {
    id: "minimal",
    name: "Minimal Black",
    colors: {
      background: "#000000",
      stars: "#FFFFFF",
      constellation: "#CCCCCC",
      grid: "#CCCCCC",
      milkyWay: "#737373",
      text: "#FFFFFF",
    },
  },
  vintage: {
    id: "vintage",
    name: "Vintage Paper",
    colors: {
      background: "#F4ECD8",
      stars: "#2C1810",
      constellation: "#8B7355",
      grid: "#8B7355",
      milkyWay: "#D6C7A6",
      text: "#2C1810",
    },
  },
} satisfies Record<string, PosterStarStyle>;

export const MAP_STYLES = Object.values(MAP_STYLE_REGISTRY);
export const STARMAP_STYLES = Object.values(STARMAP_STYLE_REGISTRY);

export type MapStyleId = keyof typeof MAP_STYLE_REGISTRY;
export type StarMapStyleId = keyof typeof STARMAP_STYLE_REGISTRY;

export function getMapStyle(id: string): PosterMapStyle {
  return MAP_STYLE_REGISTRY[id as MapStyleId] ?? MAP_STYLE_REGISTRY.leon;
}

export function getStarMapStyle(id: string): PosterStarStyle {
  return STARMAP_STYLE_REGISTRY[id as StarMapStyleId] ?? STARMAP_STYLE_REGISTRY.classic;
}

export const TEXT_LAYOUTS: { id: TextLayout; label: string }[] = [
  { id: "standard", label: "Meilleure vente" },
  { id: "cursive", label: "Écriture cursive" },
  { id: "minimal", label: "Minimalist" },
  { id: "verbose", label: "Beaucoup de texte" },
];

