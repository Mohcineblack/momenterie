import { create } from 'zustand';

interface JewelryState {
  location: string;
  date: Date | null;
  latitude: number | null;
  longitude: number | null;

  setLocation: (location: string) => void;
  setDate: (date: Date | null) => void;
  setCoordinates: (lat: number, lng: number) => void;
  resetEditor: () => void;
}

const defaultState = {
  location: '',
  date: null,
  latitude: null,
  longitude: null,
};

export const useJewelryStore = create<JewelryState>((set) => ({
  ...defaultState,

  setLocation: (location: string) => set({ location }),
  setDate: (date: Date | null) => set({ date }),
  setCoordinates: (lat: number, lng: number) =>
    set({ latitude: lat, longitude: lng }),
  resetEditor: () => set(defaultState),
}));
