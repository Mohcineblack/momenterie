import { create } from 'zustand';
import type { CustomizationData } from '@/types';

interface CustomizerStore {
  // Current product being customized
  productId: number | null;
  productSlug: string | null;
  productName: string | null;
  basePrice: number;

  // Selected variant
  variantId: number | null;
  variantPrice: number;

  // Customization data
  customizationData: Partial<CustomizationData>;

  // Preview state
  previewImageUrl: string | null;
  isGeneratingPreview: boolean;

  // Validation
  validationErrors: Record<string, string>;
  isValid: boolean;

  // Actions
  setProduct: (productId: number, productSlug: string, productName: string, basePrice: number) => void;
  setVariant: (variantId: number | null, variantPrice: number) => void;
  updateCustomization: (data: Partial<CustomizationData>) => void;
  setPreviewImage: (url: string) => void;
  setGeneratingPreview: (isGenerating: boolean) => void;
  setValidationErrors: (errors: Record<string, string>) => void;
  setIsValid: (isValid: boolean) => void;
  reset: () => void;
  getTotalPrice: () => number;
}

const initialState = {
  productId: null,
  productSlug: null,
  productName: null,
  basePrice: 0,
  variantId: null,
  variantPrice: 0,
  customizationData: {},
  previewImageUrl: null,
  isGeneratingPreview: false,
  validationErrors: {},
  isValid: false,
};

export const useCustomizerStore = create<CustomizerStore>((set, get) => ({
  ...initialState,

  setProduct: (productId, productSlug, productName, basePrice) => {
    set({
      productId,
      productSlug,
      productName,
      basePrice,
    });
  },

  setVariant: (variantId, variantPrice) => {
    set({ variantId, variantPrice });
  },

  updateCustomization: (data) => {
    set((state) => ({
      customizationData: {
        ...state.customizationData,
        ...data,
      },
    }));
  },

  setPreviewImage: (url) => {
    set({ previewImageUrl: url });
  },

  setGeneratingPreview: (isGenerating) => {
    set({ isGeneratingPreview: isGenerating });
  },

  setValidationErrors: (errors) => {
    set({
      validationErrors: errors,
      isValid: Object.keys(errors).length === 0,
    });
  },

  setIsValid: (isValid) => {
    set({ isValid });
  },

  reset: () => {
    set(initialState);
  },

  getTotalPrice: () => {
    const state = get();
    return state.basePrice + state.variantPrice;
  },
}));
