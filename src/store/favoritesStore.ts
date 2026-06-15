// ============================================================
// FLOCO — Favorites Store (Zustand + localStorage persist)
// ============================================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FavoritesState {
  ids: number[];
  toggle: (id: number) => void;
  isFavorite: (id: number) => boolean;
  clear: () => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      ids: [],

      toggle: (id) => {
        set((state) => ({
          ids: state.ids.includes(id)
            ? state.ids.filter((i) => i !== id)
            : [...state.ids, id],
        }));
      },

      isFavorite: (id) => get().ids.includes(id),

      clear: () => set({ ids: [] }),
    }),
    { name: 'floco-favorites' }
  )
);
