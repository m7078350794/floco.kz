import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CountryId = 'kz' | 'uz' | 'kg' | 'tj';
export type CityId = 'almaty' | 'astana' | 'tashkent' | 'bishkek' | 'dushanbe';

export interface City {
  id: CityId;
  name: string;
}

export interface Country {
  id: CountryId;
  name: string;
  cities: City[];
  defaultLang: string;
  availableLangs: string[];
}

export const COUNTRIES: Record<CountryId, Country> = {
  kz: {
    id: 'kz',
    name: 'Казахстан',
    defaultLang: 'ru',
    availableLangs: ['ru', 'en', 'kk'],
    cities: [
      { id: 'almaty', name: 'Алматы' },
      { id: 'astana', name: 'Астана' },
    ],
  },
  uz: {
    id: 'uz',
    name: 'Узбекистан',
    defaultLang: 'ru',
    availableLangs: ['ru', 'en', 'uz'],
    cities: [
      { id: 'tashkent', name: 'Ташкент' },
    ],
  },
  kg: {
    id: 'kg',
    name: 'Кыргызстан',
    defaultLang: 'ru',
    availableLangs: ['ru', 'en', 'ky'],
    cities: [
      { id: 'bishkek', name: 'Бишкек' },
    ],
  },
  tj: {
    id: 'tj',
    name: 'Таджикистан',
    defaultLang: 'ru',
    availableLangs: ['ru', 'en', 'tg'],
    cities: [
      { id: 'dushanbe', name: 'Душанбе' },
    ],
  },
};

interface RegionState {
  country: CountryId;
  city: CityId;
  setRegion: (country: CountryId, city: CityId) => void;
}

export const useRegionStore = create<RegionState>()(
  persist(
    (set) => ({
      country: 'kz',
      city: 'almaty',
      setRegion: (country, city) => set({ country, city }),
    }),
    {
      name: 'floco-region-storage',
    }
  )
);
