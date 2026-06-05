import { create } from 'zustand';
import { STARMAP_STYLES, type PosterStarStyle } from '@/lib/render/styles';

export interface Location {
  lat: number;
  lng: number;
  placeName: string;
}

export type StarMapStyle = PosterStarStyle;

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
