// ============================================================
// FLOCO — Settings Store
// ============================================================

import { create } from 'zustand';
import type { Settings } from '@/types';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { getStorageItem } from '@/lib/storage';

interface SettingsState {
  allSettings: Record<string, Settings>;
  isLoading: boolean;
  isAdmin: boolean;
  loadSettings: () => Promise<void>;
  updateSettings: (cityId: string, data: Partial<Settings>) => Promise<void>;
  checkSession: () => Promise<void>;
  logout: () => Promise<void>;
  getSettingsForCity: (cityId: string) => Settings | null;
}

// Helper to map DB row to Settings interface
function mapDbToSettings(row: any, categories: any[]): Settings {
  return {
    whatsappPhone: row.whatsapp_phone,
    instagramUrl: row.instagram_url,
    shopName: row.shop_name,
    shopAddress: row.shop_address,
    shopCity: row.shop_city,
    workingHours: row.working_hours,
    deliveryInfo: row.delivery_info,
    adminPin: '', // Deprecated in favor of Supabase Auth
    categories: categories.map((c: any) => ({
      slug: c.slug,
      name: c.name,
      description: '',
    })),
  };
}

async function loadLocalSettings(): Promise<Settings | null> {
  const localSettings = getStorageItem<Settings | null>('settings', null);
  if (localSettings) return localSettings;

  const response = await fetch('/data/settings.json');
  if (!response.ok) return null;

  return response.json();
}

export const useSettingsStore = create<SettingsState>()((set, get) => ({
  allSettings: {},
  isLoading: false,
  isAdmin: false,

  getSettingsForCity: (cityId: string) => {
    return get().allSettings[cityId] || get().allSettings['almaty'] || null;
  },

  loadSettings: async () => {
    set({ isLoading: true });
    try {
      if (!isSupabaseConfigured || !supabase) {
        const settings = await loadLocalSettings();
        if (settings) {
          set({ allSettings: { almaty: settings }, isLoading: false });
        } else {
          set({ isLoading: false });
        }
        return;
      }

      const [settingsRes, categoriesRes] = await Promise.all([
        supabase.from('settings').select('*'),
        supabase.from('categories').select('*'),
      ]);

      if (settingsRes.error) throw settingsRes.error;

      if (settingsRes.data && settingsRes.data.length > 0) {
        const newAllSettings: Record<string, Settings> = {};
        settingsRes.data.forEach((row) => {
          newAllSettings[row.city_id || 'almaty'] = mapDbToSettings(row, categoriesRes.data || []);
        });
        set({ allSettings: newAllSettings, isLoading: false });
      } else {
        const settings = await loadLocalSettings();
        if (settings) {
          set({ allSettings: { almaty: settings }, isLoading: false });
        } else {
          set({ isLoading: false });
        }
      }
    } catch (error) {
      console.error('Failed to load settings from Supabase, loading fallback', error);
      const settings = await loadLocalSettings();
      if (settings) {
        set({ allSettings: { almaty: settings }, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    }
  },

  updateSettings: async (cityId, data) => {
    if (!supabase) throw new Error('Supabase is not configured');
    const { error } = await supabase.from('settings').update({
      whatsapp_phone: data.whatsappPhone,
      shop_address: data.shopAddress,
      working_hours: data.workingHours,
      delivery_info: data.deliveryInfo,
      updated_at: new Date().toISOString(),
    }).eq('city_id', cityId);

    if (error) throw new Error(error.message);

    set((state) => ({
      allSettings: {
        ...state.allSettings,
        [cityId]: state.allSettings[cityId] ? { ...state.allSettings[cityId], ...data } : data as Settings,
      }
    }));
  },

  checkSession: async () => {
    if (!supabase) {
      set({ isAdmin: false });
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      set({ isAdmin: !!session });

      supabase.auth.onAuthStateChange((_event, session) => {
        set({ isAdmin: !!session });
      });
    } catch (error) {
      console.error('Failed to check Supabase session:', error);
      set({ isAdmin: false });
    }
  },

  logout: async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    set({ isAdmin: false });
  },
}));
