// ============================================================
// FLOCO — Settings Store
// ============================================================

import { create } from 'zustand';
import type { Settings } from '@/types';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { getStorageItem } from '@/lib/storage';

interface SettingsState {
  settings: Settings | null;
  isLoading: boolean;
  isAdmin: boolean;
  loadSettings: () => Promise<void>;
  updateSettings: (data: Partial<Settings>) => Promise<void>;
  checkSession: () => Promise<void>;
  logout: () => Promise<void>;
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
    categories: categories.map((c) => ({
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
  settings: null,
  isLoading: false,
  isAdmin: false,

  loadSettings: async () => {
    set({ isLoading: true });
    try {
      if (!isSupabaseConfigured || !supabase) {
        const settings = await loadLocalSettings();
        set({ settings, isLoading: false });
        return;
      }

      const [settingsRes, categoriesRes] = await Promise.all([
        supabase.from('settings').select('*').eq('id', 1).single(),
        supabase.from('categories').select('*'),
      ]);

      if (settingsRes.error) throw settingsRes.error;

      if (settingsRes.data) {
        set({ settings: mapDbToSettings(settingsRes.data, categoriesRes.data || []), isLoading: false });
      } else {
        const settings = await loadLocalSettings();
        set({ settings, isLoading: false });
      }
    } catch (error) {
      console.error('Failed to load settings from Supabase, loading fallback', error);
      const settings = await loadLocalSettings();
      set({ settings, isLoading: false });
    }
  },

  updateSettings: async (data) => {
    try {
      if (!supabase) {
        set((state) => ({
          settings: state.settings ? { ...state.settings, ...data } : null,
        }));
        return;
      }

      const dbData: any = {};
      if (data.whatsappPhone) dbData.whatsapp_phone = data.whatsappPhone;
      if (data.instagramUrl) dbData.instagram_url = data.instagramUrl;
      if (data.shopName) dbData.shop_name = data.shopName;
      if (data.shopAddress) dbData.shop_address = data.shopAddress;
      if (data.shopCity) dbData.shop_city = data.shopCity;
      if (data.workingHours) dbData.working_hours = data.workingHours;
      if (data.deliveryInfo) dbData.delivery_info = data.deliveryInfo;

      if (Object.keys(dbData).length > 0) {
        const { error } = await supabase.from('settings').update(dbData).eq('id', 1);
        if (error) throw error;
      }

      set((state) => ({
        settings: state.settings ? { ...state.settings, ...data } : null,
      }));
    } catch (error) {
      console.error('Failed to update settings:', error);
    }
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
