import { Product } from '@/types';

export function getProductPrice(product: Product, country: string): number | null {
  if (product.prices && product.prices[country] !== undefined) {
    return product.prices[country];
  }
  return product.price;
}

export function getProductOldPrice(product: Product, country: string): number | null {
  if (product.oldPrices && product.oldPrices[country] !== undefined) {
    return product.oldPrices[country];
  }
  return product.oldPrice ?? null;
}
