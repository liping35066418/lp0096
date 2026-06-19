import type { Order, OrderItem } from './flowers.js';
import { flowers } from './flowers.js';

function mulberry32(seed: number): () => number {
  let t = seed >>> 0;
  return function (): number {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = t;
    r = Math.imul(r ^ (r >>> 15), r | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function hashDate(date: Date): number {
  const str = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  let hash = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function getDayRng(date: Date, dayOffset: number): () => number {
  const baseSeed = hashDate(date);
  return mulberry32(baseSeed + dayOffset * 7919);
}

function generateOrderItems(rng: () => number): OrderItem[] {
  const itemCount = Math.floor(rng() * 4) + 1;
  const selectedFlowerIds = new Set<string>();
  const items: OrderItem[] = [];

  while (selectedFlowerIds.size < itemCount) {
    const flower = flowers[Math.floor(rng() * flowers.length)];
    if (selectedFlowerIds.has(flower.id)) continue;
    selectedFlowerIds.add(flower.id);
    const quantity = Math.floor(rng() * 10) + 1;
    items.push({
      flowerId: flower.id,
      flowerName: flower.name,
      quantity,
      unitPrice: flower.unitPrice,
      subtotal: flower.unitPrice * quantity,
    });
  }

  return items;
}

function formatDate(date: Date, rng: () => number): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(Math.floor(rng() * 12) + 8).padStart(2, '0');
  const minutes = String(Math.floor(rng() * 60)).padStart(2, '0');
  const seconds = String(Math.floor(rng() * 60)).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function generateOrders(): Order[] {
  const orders: Order[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let orderCounter = 1;

  for (let dayOffset = 6; dayOffset >= 0; dayOffset--) {
    const date = new Date(today);
    date.setDate(date.getDate() - dayOffset);
    const rng = getDayRng(today, dayOffset);
    const ordersPerDay = dayOffset === 0 ? 35 : Math.floor(rng() * 20) + 15;

    for (let i = 0; i < ordersPerDay; i++) {
      const items = generateOrderItems(rng);
      const totalAmount = items.reduce((sum, item) => sum + item.subtotal, 0);
      const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
      const orderNo = `FH${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${String(orderCounter).padStart(5, '0')}`;

      orders.push({
        id: `O${String(orderCounter).padStart(8, '0')}`,
        orderNo,
        createdAt: formatDate(date, rng),
        items,
        totalAmount,
        totalQuantity,
      });

      orderCounter++;
    }
  }

  return orders;
}

export const orders: Order[] = generateOrders();
export { flowers } from './flowers.js';
