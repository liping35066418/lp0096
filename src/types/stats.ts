export type StatsDimension = 'item' | 'category';

export interface FlowerSalesStat {
  flowerId: string;
  flowerName: string;
  category: string;
  totalQuantity: number;
  totalAmount: number;
}

export interface StatsSummary {
  totalRevenue: number;
  orderCount: number;
  avgOrderValue: number;
  totalFlowerQuantity: number;
}

export interface StatsData {
  period: 'day' | 'week';
  dateRange: {
    start: string;
    end: string;
  };
  summary: StatsSummary;
  flowerSales: FlowerSalesStat[];
  topFlowers: FlowerSalesStat[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
