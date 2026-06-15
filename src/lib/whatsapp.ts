// ============================================================
// FLOCO — WhatsApp Integration
// ============================================================

import type { CartItem, OrderData } from '@/types';
import { formatPrice } from './formatters';

/**
 * Build the WhatsApp order message
 */
export function buildOrderMessage(
  order: OrderData,
  items: CartItem[],
  total: number
): string {
  const itemLines = items
    .map(
      (item) =>
        `• ${item.product.name} — ${formatPrice(item.product.price)}${item.quantity > 1 ? ` × ${item.quantity}` : ''}${item.comment ? `\n  💬 ${item.comment}` : ''}`
    )
    .join('\n');

  const message = `Здравствуйте! 🌸

*Новый заказ FLOCO*

👤 *Имя:* ${order.name}
📱 *Телефон:* ${order.phone}

📅 *Дата доставки:* ${order.deliveryDate}
🕐 *Время доставки:* ${order.deliveryTime}

📍 *Адрес:*
${order.address}
${order.cardText ? `\n💌 *Открытка:*\n${order.cardText}` : ''}
${order.isAnonymous ? '\n🙈 *Анонимная доставка*' : ''}

🛒 *Заказ:*

${itemLines}

💰 *Итого: ${formatPrice(total)}*

Свяжитесь со мной для подтверждения заказа.`;

  return message;
}

/**
 * Open WhatsApp with the order message
 */
export function openWhatsApp(phone: string, message: string): void {
  const cleanPhone = phone.replace(/\D/g, '');
  const encoded = encodeURIComponent(message);
  const url = `https://wa.me/${cleanPhone}?text=${encoded}`;
  window.open(url, '_blank');
}

/**
 * Compose and send order via WhatsApp
 */
export function sendOrderWhatsApp(
  phone: string,
  order: OrderData,
  items: CartItem[],
  total: number
): void {
  const message = buildOrderMessage(order, items, total);
  openWhatsApp(phone, message);
}
