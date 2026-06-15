// ============================================================
// FLOCO — Product Store
// ============================================================

import { create } from 'zustand';
import type { Product, FilterState, CategorySlug } from '@/types';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { useRegionStore } from '@/store/regionStore';
import { getProductPrice } from '@/lib/price';

interface ProductState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  filters: FilterState;
  loadProducts: () => Promise<void>;
  setFilter: (key: keyof FilterState, value: string | number | [number, number] | CategorySlug | 'all') => void;
  resetFilters: () => void;
  getFilteredProducts: () => Product[];
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: number, data: Partial<Product>) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
}

const defaultFilters: FilterState = {
  search: '',
  category: 'all',
  priceRange: [0, 200000],
  sort: 'popular',
};

// Helper to map DB row to Product interface
function mapDbToProduct(row: any): Product {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    price: row.price ? Number(row.price) : null,
    oldPrice: row.old_price ? Number(row.old_price) : null,
    prices: row.prices || {},
    oldPrices: row.old_prices || {},
    category: row.category as CategorySlug,
    composition: Array.isArray(row.composition) ? row.composition : JSON.parse(row.composition || '[]'),
    size: row.size,
    image: row.image,
    images: Array.isArray(row.images) ? row.images : JSON.parse(row.images || '[]'),
    isPopular: row.is_popular,
    isNew: row.is_new,
    inStock: row.in_stock,
    tags: Array.isArray(row.tags) ? row.tags : JSON.parse(row.tags || '[]'),
    cities: Array.isArray(row.cities) ? row.cities : JSON.parse(row.cities || '["almaty"]'),
  };
}

// Helper to map Product interface to DB row
function mapProductToDb(p: Partial<Product>): any {
  const row: any = {};
  if (p.name !== undefined) row.name = p.name;
  if (p.slug !== undefined) row.slug = p.slug;
  if (p.description !== undefined) row.description = p.description;
  if (p.price !== undefined) row.price = p.price;
  if (p.oldPrice !== undefined) row.old_price = p.oldPrice;
  if (p.prices !== undefined) row.prices = p.prices;
  if (p.oldPrices !== undefined) row.old_prices = p.oldPrices;
  if (p.category !== undefined) row.category = p.category;
  if (p.image !== undefined) row.image = p.image;
  if (p.images !== undefined) row.gallery = p.images;
  if (p.composition !== undefined) row.composition = p.composition;
  if (p.size !== undefined) row.size = p.size;
  if (p.isPopular !== undefined) row.is_featured = p.isPopular;
  if (p.isNew !== undefined) row.is_new = p.isNew;
  if (p.inStock !== undefined) row.in_stock = p.inStock;
  if (p.tags !== undefined) row.tags = p.tags;
  if (p.cities !== undefined) row.cities = p.cities;
  return row;
}

async function loadLocalProducts(): Promise<Product[]> {
  const res = await fetch('/data/products.json');
  if (!res.ok) throw new Error('Failed to load local products');
  const data = await res.json();
  return data.map((p: any) => ({
    ...p,
    cities: p.cities || ['almaty', 'astana', 'tashkent', 'bishkek', 'dushanbe'],
  }));
}

export const useProductStore = create<ProductState>()((set, get) => ({
  products: [],
  isLoading: false,
  error: null,
  filters: defaultFilters,

  loadProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      if (!isSupabaseConfigured || !supabase) {
        const localData = await loadLocalProducts();
        set({ products: localData, isLoading: false });
        return;
      }

      const { data, error } = await supabase.from('products').select('*');
      
      if (error) {
        console.warn('Failed to fetch from Supabase, loading local JSON fallback', error);
        const localData = await loadLocalProducts();
        set({ products: localData, isLoading: false });
        return;
      }

      if (data && data.length > 0) {
        set({ products: data.map(mapDbToProduct), isLoading: false });
      } else {
        const localData = await loadLocalProducts();
        set({ products: localData, isLoading: false });
      }
    } catch (error) {
      try {
        const localData = await loadLocalProducts();
        set({ products: localData, isLoading: false });
      } catch {
        set({ error: (error as Error).message, isLoading: false });
      }
    }
  },

  setFilter: (key, value) => {
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    }));
  },

  resetFilters: () => set({ filters: defaultFilters }),

  getFilteredProducts: () => {
    const { products, filters } = get();
    let filtered = [...products].filter((p) => p.inStock);

    // City Filter
    const currentCity = useRegionStore.getState().city;
    filtered = filtered.filter((p) => p.cities.includes(currentCity));

    const currentCountry = useRegionStore.getState().country;
    
    // Search
    if (filters.search) {
      const query = filters.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          (p.tags && p.tags.some((t) => t.toLowerCase().includes(query)))
      );
    }

    // Category
    if (filters.category !== 'all') {
      filtered = filtered.filter((p) => p.category === filters.category);
    }

    // Price range
    filtered = filtered.filter((p) => {
      const price = getProductPrice(p, currentCountry) ?? 0;
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });

    // Sort
    switch (filters.sort) {
      case 'price-asc':
        filtered.sort((a, b) => (getProductPrice(a, currentCountry) ?? 0) - (getProductPrice(b, currentCountry) ?? 0));
        break;
      case 'price-desc':
        filtered.sort((a, b) => (getProductPrice(b, currentCountry) ?? 0) - (getProductPrice(a, currentCountry) ?? 0));
        break;
      case 'newest':
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case 'popular':
      default:
        filtered.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
        break;
    }

    return filtered;
  },

  addProduct: async (product) => {
    if (!supabase) throw new Error('Supabase is not configured');

    const dbData = mapProductToDb(product);
    const { data, error } = await supabase.from('products').insert(dbData).select().single();
    
    if (error) throw new Error(error.message);
    
    if (data) {
      set((state) => ({ products: [...state.products, mapDbToProduct(data)] }));
    }
  },

  updateProduct: async (id, data) => {
    if (!supabase) throw new Error('Supabase is not configured');

    const dbData = mapProductToDb(data);
    const { error } = await supabase.from('products').update(dbData).eq('id', id);
    
    if (error) throw new Error(error.message);

    set((state) => ({
      products: state.products.map((p) => (p.id === id ? { ...p, ...data } : p)),
    }));
  },

  deleteProduct: async (id) => {
    if (!supabase) throw new Error('Supabase is not configured');

    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw new Error(error.message);

    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    }));
  },
}));
