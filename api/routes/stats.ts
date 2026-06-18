import express, { type Request, type Response } from 'express';
import { orders } from '../data/orders.js';
import type { Order } from '../data/flowers.js';

const router = express.Router();

interface FlowerSalesStat {
  flowerId: string;
  flowerName: string;
  totalQuantity: number;
  totalAmount: number;
}

interface StatsResponse {
  period: 'day' | 'week';
  dateRange: {
    start: string;
    end: string;
  };
  summary: {
    totalRevenue: number;
    orderCount: number;
    avgOrderValue: number;
    totalFlowerQuantity: number;
  };
  flowerSales: FlowerSalesStat[];
  topFlowers: FlowerSalesStat[];
}

function filterOrdersByPeriod(period: 'day' | 'week'): Order[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (period === 'day') {
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= today && orderDate < tomorrow;
    });
  } else {
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 6);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= weekAgo && orderDate < tomorrow;
    });
  }
}

function getDateRange(period: 'day' | 'week'): { start: string; end: string } {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const formatDateStr = (date: Date): string => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  if (period === 'day') {
    const dateStr = formatDateStr(today);
    return { start: dateStr, end: dateStr };
  } else {
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 6);
    return { start: formatDateStr(weekAgo), end: formatDateStr(today) };
  }
}

function calculateFlowerSales(filteredOrders: Order[]): FlowerSalesStat[] {
  const salesMap = new Map<string, FlowerSalesStat>();

  for (const order of filteredOrders) {
    for (const item of order.items) {
      const existing = salesMap.get(item.flowerId);
      if (existing) {
        existing.totalQuantity += item.quantity;
        existing.totalAmount += item.subtotal;
      } else {
        salesMap.set(item.flowerId, {
          flowerId: item.flowerId,
          flowerName: item.flowerName,
          totalQuantity: item.quantity,
          totalAmount: item.subtotal,
        });
      }
    }
  }

  return Array.from(salesMap.values());
}

router.get('/stats', (req: Request, res: Response): void => {
  const period = (req.query.period as 'day' | 'week') || 'day';

  if (period !== 'day' && period !== 'week') {
    res.status(400).json({
      success: false,
      error: 'period 参数必须为 day 或 week',
    });
    return;
  }

  const filteredOrders = filterOrdersByPeriod(period);

  const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const orderCount = filteredOrders.length;
  const avgOrderValue = orderCount > 0 ? Number((totalRevenue / orderCount).toFixed(2)) : 0;
  const totalFlowerQuantity = filteredOrders.reduce((sum, order) => sum + order.totalQuantity, 0);

  const flowerSales = calculateFlowerSales(filteredOrders).sort(
    (a, b) => b.totalQuantity - a.totalQuantity
  );

  const topFlowers = flowerSales.slice(0, 5);

  const response: StatsResponse = {
    period,
    dateRange: getDateRange(period),
    summary: {
      totalRevenue: Number(totalRevenue.toFixed(2)),
      orderCount,
      avgOrderValue,
      totalFlowerQuantity,
    },
    flowerSales,
    topFlowers,
  };

  res.status(200).json({
    success: true,
    data: response,
  });
});

export default router;
