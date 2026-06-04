import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CustomizationData } from '@/types';

export interface CartItem {
  id: string;
  productId: number;
  productName: string;
  productSlug: string;
  variantId?: number;
  variantName?: string;
  quantity: number;
  basePrice: number;
  variantPrice: number;
  customizationData: CustomizationData;
  previewImageUrl?: string;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;

  // Actions
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateItem: (id: string, updates: Partial<CartItem>) => void;
  clearCart: () => void;

  // Cart drawer
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;

  // Computed values
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getItemPrice: (item: CartItem) => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) => {
        const id =
          typeof crypto !== 'undefined' && 'randomUUID' in crypto
            ? crypto.randomUUID()
            : `${item.productId}-${item.variantId || 'default'}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        set((state) => ({
          items: [...state.items, { ...item, id }],
          isOpen: true, // Auto-open cart when item added
        }));
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        }));
      },

      updateItem: (id, updates) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [], isOpen: false });
      },

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => {
          return total + get().getItemPrice(item) * item.quantity;
        }, 0);
      },

      getItemPrice: (item) => {
        return item.basePrice + item.variantPrice;
      },
    }),
    {
      name: 'momenterie-cart',
      storage: createJSONStorage(() => localStorage),
      // Only persist items, not UI state like isOpen
      partialize: (state) => ({ items: state.items }),
    }
  )
);
