import { create } from 'zustand';

export const PRINT_SIZES = [
  { id: 'a4', name: 'A4', description: '210 x 297 mm', priceModifier: 0 },
  { id: 'a3', name: 'A3', description: '297 x 420 mm', priceModifier: 10 },
  { id: 'a2', name: 'A2', description: '420 x 594 mm', priceModifier: 25 },
  { id: '50x70', name: '50x70 cm', description: 'Large format', priceModifier: 35 },
];

export const FRAME_OPTIONS = [
  { id: 'none', name: 'No Frame', description: 'Print only', priceModifier: 0 },
  { id: 'black', name: 'Black Frame', description: 'Modern black wood', priceModifier: 15 },
  { id: 'white', name: 'White Frame', description: 'Classic white wood', priceModifier: 15 },
  { id: 'oak', name: 'Oak Frame', description: 'Natural oak wood', priceModifier: 20 },
];

interface PhotoPrintState {
  imageUrl: string | null;
  imageFile: File | null;
  size: string;
  frame: string;
  uploadProgress: number;
  isUploading: boolean;

  // Actions
  setImage: (url: string, file: File) => void;
  setSize: (size: string) => void;
  setFrame: (frame: string) => void;
  setUploadProgress: (progress: number) => void;
  setIsUploading: (isUploading: boolean) => void;
  resetEditor: () => void;
}

export const usePhotoPrintStore = create<PhotoPrintState>((set) => ({
  imageUrl: null,
  imageFile: null,
  size: 'a4',
  frame: 'none',
  uploadProgress: 0,
  isUploading: false,

  setImage: (url, file) => set({ imageUrl: url, imageFile: file }),
  setSize: (size) => set({ size }),
  setFrame: (frame) => set({ frame }),
  setUploadProgress: (uploadProgress) => set({ uploadProgress }),
  setIsUploading: (isUploading) => set({ isUploading }),
  resetEditor: () => set({
    imageUrl: null,
    imageFile: null,
    size: 'a4',
    frame: 'none',
    uploadProgress: 0,
    isUploading: false,
  }),
}));
