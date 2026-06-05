import { create } from 'zustand';
import { MAP_STYLES, type PosterMapStyle, type TextLayout, type ColorVariant } from '@/lib/render/styles';

export interface Location {
  lat: number;
  lng: number;
  placeName: string;
}

export type MapStyle = PosterMapStyle;

interface CityMapState {
  location: Location | null;
  title: string;
  subtitle: string;
  date: string;
  mapStyle: MapStyle;
  textLayout: TextLayout;
  colorVariant: ColorVariant | null;
  zoom: number;

  setLocation: (location: Location) => void;
  setTitle: (title: string) => void;
  setSubtitle: (subtitle: string) => void;
  setDate: (date: string) => void;
  setMapStyle: (style: MapStyle) => void;
  setTextLayout: (layout: TextLayout) => void;
  setColorVariant: (variant: ColorVariant | null) => void;
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
  textLayout: DEFAULT_STYLE.defaultTextLayout,
  colorVariant: null,
  zoom: 13,

  setLocation: (location) => set({ location }),
  setTitle: (title) => set({ title }),
  setSubtitle: (subtitle) => set({ subtitle }),
  setDate: (date) => set({ date }),
  setMapStyle: (mapStyle) => set({ mapStyle, textLayout: mapStyle.defaultTextLayout, colorVariant: null }),
  setTextLayout: (textLayout) => set({ textLayout }),
  setColorVariant: (colorVariant) => set({ colorVariant }),
  setZoom: (zoom) => set({ zoom }),
  resetEditor: () => set({
    location: null,
    title: '',
    subtitle: '',
    date: '',
    mapStyle: DEFAULT_STYLE,
    textLayout: DEFAULT_STYLE.defaultTextLayout,
    colorVariant: null,
    zoom: 13,
  }),
}));
