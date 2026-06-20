// ============================================================
// FLOCO — TypeScript Types
// ============================================================

export interface Product {
  id: number;
  name: string;
  slug: string;
  price: number | null;
  oldPrice?: number | null;
  prices: Record<string, number | null>;
  oldPrices: Record<string, number | null>;
  category: CategorySlug;
  description: string;
  composition: string[];
  size: 'S' | 'M' | 'L' | 'XL';
  image: string;
  images?: string[];
  isPopular?: boolean;
  isNew?: boolean;
  inStock: boolean;
  tags?: string[];
  cities: string[];
}

export type CategorySlug =
  | 'mono'
  | 'author'
  | 'box'
  | 'peony-roses'
  | 'wedding'
  | 'gifts';

export interface Category {
  slug: CategorySlug;
  name: string;
  description: string;
  image?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  comment: string;
}

export interface OrderData {
  name: string;
  phone: string;
  deliveryDate: string;
  deliveryTime: string;
  address: string;
  cardText: string;
  isAnonymous: boolean;
}

export interface Review {
  id: number;
  name: string;
  avatar?: string;
  rating: number;
  text: string;
  date: string;
  productName?: string;
}

export interface Settings {
  whatsappPhone: string;
  instagramUrl: string;
  telegramUrl?: string;
  shopName: string;
  shopAddress: string;
  shopCity: string;
  workingHours: string;
  deliveryInfo: string;
  adminPin: string;
  categories: Category[];
}

export type SortOption = 'popular' | 'price-asc' | 'price-desc' | 'newest';

export interface FilterState {
  search: string;
  category: CategorySlug | 'all';
  priceRange: [number, number];
  sort: SortOption;
}
