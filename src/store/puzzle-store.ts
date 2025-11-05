import { create } from 'zustand';

export interface PuzzleConfig {
  pieces: number;
  finish: 'glossy' | 'matte';
}

export const PUZZLE_SIZES = [
  { pieces: 100, name: '100 pieces', description: 'Small (7" x 9")', priceModifier: 0 },
  { pieces: 252, name: '252 pieces', description: 'Medium (10" x 14")', priceModifier: 5 },
  { pieces: 500, name: '500 pieces', description: 'Large (16" x 20")', priceModifier: 10 },
  { pieces: 1000, name: '1000 pieces', description: 'Extra Large (19" x 27")', priceModifier: 20 },
];

export const FINISHES = [
  { id: 'glossy', name: 'Glossy', description: 'Shiny, vibrant colors', priceModifier: 0 },
  { id: 'matte', name: 'Matte', description: 'No glare, soft finish', priceModifier: 2 },
];

interface PuzzleState {
  imageUrl: string | null;
  imageFile: File | null;
  pieces: number;
  finish: 'glossy' | 'matte';
  uploadProgress: number;
  isUploading: boolean;

  // Actions
  setImage: (url: string, file: File) => void;
  setPieces: (pieces: number) => void;
  setFinish: (finish: 'glossy' | 'matte') => void;
  setUploadProgress: (progress: number) => void;
  setIsUploading: (isUploading: boolean) => void;
  resetEditor: () => void;
}

export const usePuzzleStore = create<PuzzleState>((set) => ({
  imageUrl: null,
  imageFile: null,
  pieces: 252, // Default medium size
  finish: 'glossy',
  uploadProgress: 0,
  isUploading: false,

  setImage: (url, file) => set({ imageUrl: url, imageFile: file }),
  setPieces: (pieces) => set({ pieces }),
  setFinish: (finish) => set({ finish }),
  setUploadProgress: (uploadProgress) => set({ uploadProgress }),
  setIsUploading: (isUploading) => set({ isUploading }),
  resetEditor: () => set({
    imageUrl: null,
    imageFile: null,
    pieces: 252,
    finish: 'glossy',
    uploadProgress: 0,
    isUploading: false,
  }),
}));
