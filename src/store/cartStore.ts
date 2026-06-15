// ============================================================
// FLOCO — Cart Store (Zustand + localStorage persist)
// ============================================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product } from '@/types';
import { getProductPrice } from '@/lib/price';

interface CartState {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  updateComment: (productId: number, comment: string) => void;
  clearCart: () => void;
  getTotal: (country: string) => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        set((state) => {
          const existing = state.items.find((i) => i.product.id === product.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product.id === product.id
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
            };
          }
          return { items: [...state.items, { product, quantity: 1, comment: '' }] };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.product.id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity < 1) return;
        set((state) => ({
          items: state.items.map((i) =>
            i.product.id === productId ? { ...i, quantity } : i
          ),
        }));
      },

      updateComment: (productId, comment) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.product.id === productId ? { ...i, comment } : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      getTotal: (country: string) => {
        return get().items.reduce(
          (sum, i) => sum + (getProductPrice(i.product, country) ?? 0) * i.quantity,
          0
        );
      },

      getItemCount: () => {
        return get().items.reduce((sum, i) => sum + i.quantity, 0);
      },
    }),
    {
      name: 'floco-cart',
    }
  )
);
