import { create } from 'zustand';

export interface Location {
  lat: number;
  lng: number;
  placeName: string;
}

export interface MapStyle {
  id: string;
  name: string;
  colors: {
    water: string;
    land: string;
    roads: string;
    buildings: string;
    text: string;
    background: string;
  };
}

export const MAP_STYLES: MapStyle[] = [
  {
    id: 'classic',
    name: 'Classic',
    colors: {
      water: '#9BB8CD',
      land: '#F3F3F3',
      roads: '#FFFFFF',
      buildings: '#E0E0E0',
      text: '#1A1A1A',
      background: '#FFFFFF',
    },
  },
  {
    id: 'dark',
    name: 'Dark',
    colors: {
      water: '#1A1A1A',
      land: '#2D2D2D',
      roads: '#404040',
      buildings: '#1A1A1A',
      text: '#FFFFFF',
      background: '#1A1A1A',
    },
  },
  {
    id: 'minimal',
    name: 'Minimal',
    colors: {
      water: '#E8E8E8',
      land: '#FFFFFF',
      roads: '#D0D0D0',
      buildings: '#F5F5F5',
      text: '#333333',
      background: '#FFFFFF',
    },
  },
  {
    id: 'vintage',
    name: 'Vintage',
    colors: {
      water: '#B5C9D1',
      land: '#F7F3E9',
      roads: '#E8DCC4',
      buildings: '#D4C5AA',
      text: '#5D4E37',
      background: '#FAF8F1',
    },
  },
  {
    id: 'ocean',
    name: 'Ocean',
    colors: {
      water: '#0077BE',
      land: '#F0F8FF',
      roads: '#E0F0FF',
      buildings: '#D0E8FF',
      text: '#003D5C',
      background: '#F8FCFF',
    },
  },
  {
    id: 'forest',
    name: 'Forest',
    colors: {
      water: '#4A90A4',
      land: '#E8F5E9',
      roads: '#C8E6C9',
      buildings: '#A5D6A7',
      text: '#1B5E20',
      background: '#F1F8F4',
    },
  },
];

interface CityMapState {
  location: Location | null;
  title: string;
  subtitle: string;
  date: string;
  mapStyle: MapStyle;
  zoom: number;

  // Actions
  setLocation: (location: Location) => void;
  setTitle: (title: string) => void;
  setSubtitle: (subtitle: string) => void;
  setDate: (date: string) => void;
  setMapStyle: (style: MapStyle) => void;
  setZoom: (zoom: number) => void;
  resetEditor: () => void;
}

const DEFAULT_STYLE = MAP_STYLES[0];

export const useCityMapStore = create<CityMapState>((set) => ({
  location: null,
  title: '',
  subtitle: '',
  date: '',
  mapStyle: DEFAULT_STYLE,
  zoom: 13,

  setLocation: (location) => set({ location }),
  setTitle: (title) => set({ title }),
  setSubtitle: (subtitle) => set({ subtitle }),
  setDate: (date) => set({ date }),
  setMapStyle: (mapStyle) => set({ mapStyle }),
  setZoom: (zoom) => set({ zoom }),
  resetEditor: () => set({
    location: null,
    title: '',
    subtitle: '',
    date: '',
    mapStyle: DEFAULT_STYLE,
    zoom: 13,
  }),
}));
