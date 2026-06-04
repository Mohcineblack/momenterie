export interface PosterMapStyle {
  id: string;
  name: string;
  colors: {
    water: string;
    land: string;
    landuse: string;
    roads: string;
    majorRoads: string;
    buildings: string;
    text: string;
    background: string;
    marker: string;
  };
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
  classic: {
    id: "classic",
    name: "Classic",
    colors: {
      water: "#9BB8CD",
      land: "#F3F3F3",
      landuse: "#E6E9DD",
      roads: "#FFFFFF",
      majorRoads: "#D8D8D8",
      buildings: "#E0E0E0",
      text: "#1A1A1A",
      background: "#FFFFFF",
      marker: "#111827",
    },
  },
  dark: {
    id: "dark",
    name: "Dark",
    colors: {
      water: "#111827",
      land: "#2D2D2D",
      landuse: "#243129",
      roads: "#404040",
      majorRoads: "#5A5A5A",
      buildings: "#1A1A1A",
      text: "#FFFFFF",
      background: "#1A1A1A",
      marker: "#F8FAFC",
    },
  },
  minimal: {
    id: "minimal",
    name: "Minimal",
    colors: {
      water: "#E8E8E8",
      land: "#FFFFFF",
      landuse: "#F6F6F6",
      roads: "#D0D0D0",
      majorRoads: "#B8B8B8",
      buildings: "#F5F5F5",
      text: "#333333",
      background: "#FFFFFF",
      marker: "#111111",
    },
  },
  vintage: {
    id: "vintage",
    name: "Vintage",
    colors: {
      water: "#B5C9D1",
      land: "#F7F3E9",
      landuse: "#ECE2C6",
      roads: "#E8DCC4",
      majorRoads: "#C8B487",
      buildings: "#D4C5AA",
      text: "#5D4E37",
      background: "#FAF8F1",
      marker: "#7C2D12",
    },
  },
  ocean: {
    id: "ocean",
    name: "Ocean",
    colors: {
      water: "#0077BE",
      land: "#F0F8FF",
      landuse: "#DFF3FF",
      roads: "#E0F0FF",
      majorRoads: "#8CC8EC",
      buildings: "#D0E8FF",
      text: "#003D5C",
      background: "#F8FCFF",
      marker: "#003D5C",
    },
  },
  forest: {
    id: "forest",
    name: "Forest",
    colors: {
      water: "#4A90A4",
      land: "#E8F5E9",
      landuse: "#CCE8C8",
      roads: "#C8E6C9",
      majorRoads: "#86B983",
      buildings: "#A5D6A7",
      text: "#1B5E20",
      background: "#F1F8F4",
      marker: "#14532D",
    },
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
  return MAP_STYLE_REGISTRY[id as MapStyleId] ?? MAP_STYLE_REGISTRY.classic;
}

export function getStarMapStyle(id: string): PosterStarStyle {
  return STARMAP_STYLE_REGISTRY[id as StarMapStyleId] ?? STARMAP_STYLE_REGISTRY.classic;
}

