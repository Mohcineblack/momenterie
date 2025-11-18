import { create } from 'zustand';

export interface Location {
  lat: number;
  lng: number;
  placeName: string;
}

export interface StarMapStyle {
  id: string;
  name: string;
  colors: {
    background: string;
    stars: string;
    constellation: string;
    text: string;
  };
}

export const STARMAP_STYLES: StarMapStyle[] = [
  {
    id: 'classic',
    name: 'Classic Night',
    colors: {
      background: '#0A1128',
      stars: '#FFFFFF',
      constellation: '#4A90E2',
      text: '#FFFFFF',
    },
  },
  {
    id: 'navy',
    name: 'Navy Blue',
    colors: {
      background: '#001F3F',
      stars: '#FFD700',
      constellation: '#87CEEB',
      text: '#FFFFFF',
    },
  },
  {
    id: 'purple',
    name: 'Purple Night',
    colors: {
      background: '#1A0B2E',
      stars: '#FFFFFF',
      constellation: '#B565D8',
      text: '#E0BBE4',
    },
  },
  {
    id: 'red',
    name: 'Red Sky',
    colors: {
      background: '#2C0000',
      stars: '#FFE4B5',
      constellation: '#FF6B6B',
      text: '#FFE4B5',
    },
  },
  {
    id: 'minimal',
    name: 'Minimal Black',
    colors: {
      background: '#000000',
      stars: '#FFFFFF',
      constellation: '#CCCCCC',
      text: '#FFFFFF',
    },
  },
  {
    id: 'vintage',
    name: 'Vintage Paper',
    colors: {
      background: '#F4ECD8',
      stars: '#2C1810',
      constellation: '#8B7355',
      text: '#2C1810',
    },
  },
];

interface StarMapState {
  location: Location | null;
  date: Date;
  time: string; // HH:MM format
  title: string;
  subtitle: string;
  showConstellations: boolean;
  showGrid: boolean;
  style: StarMapStyle;

  // Actions
  setLocation: (location: Location) => void;
  setDate: (date: Date) => void;
  setTime: (time: string) => void;
  setTitle: (title: string) => void;
  setSubtitle: (subtitle: string) => void;
  setShowConstellations: (show: boolean) => void;
  setShowGrid: (show: boolean) => void;
  setStyle: (style: StarMapStyle) => void;
  resetEditor: () => void;
}

const DEFAULT_STYLE = STARMAP_STYLES[0];

export const useStarMapStore = create<StarMapState>((set) => ({
  location: null,
  date: new Date(),
  time: '23:00',
  title: '',
  subtitle: '',
  showConstellations: true,
  showGrid: false,
  style: DEFAULT_STYLE,

  setLocation: (location) => set({ location }),
  setDate: (date) => set({ date }),
  setTime: (time) => set({ time }),
  setTitle: (title) => set({ title }),
  setSubtitle: (subtitle) => set({ subtitle }),
  setShowConstellations: (showConstellations) => set({ showConstellations }),
  setShowGrid: (showGrid) => set({ showGrid }),
  setStyle: (style) => set({ style }),
  resetEditor: () => set({
    location: null,
    date: new Date(),
    time: '23:00',
    title: '',
    subtitle: '',
    showConstellations: true,
    showGrid: false,
    style: DEFAULT_STYLE,
  }),
}));
