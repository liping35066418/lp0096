import { useState, useEffect, useMemo } from 'react';
import { DollarSign, ShoppingBag, Users, Flower2, ChevronDown } from 'lucide-react';
import StatCard from '@/components/StatCard';
import TopFlowers from '@/components/TopFlowers';
import FlowerSalesTable from '@/components/FlowerSalesTable';
import { type StatsData, type ApiResponse, type StatsDimension, type FlowerSalesStat } from '@/types/stats';

type Period = 'day' | 'week';

interface CategorySalesStat {
  key: string;
  name: string;
  totalQuantity: number;
  totalAmount: number;
}

function aggregateByCategory(sales: FlowerSalesStat[]): CategorySalesStat[] {
  const map = new Map<string, CategorySalesStat>();
  for (const item of sales) {
    const existing = map.get(item.category);
    if (existing) {
      existing.totalQuantity += item.totalQuantity;
      existing.totalAmount += item.totalAmount;
    } else {
      map.set(item.category, {
        key: `cat:${item.category}`,
        name: item.category,
        totalQuantity: item.totalQuantity,
        totalAmount: item.totalAmount,
      });
    }
  }
  return Array.from(map.values()).sort((a, b) => b.totalQuantity - a.totalQuantity);
}

export default function Home() {
  const [period, setPeriod] = useState<Period>('day');
  const [dimension, setDimension] = useState<StatsDimension>('item');
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [data, setData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/stats?period=${period}`);
        const result: ApiResponse<StatsData> = await response.json();
        if (result.success && result.data) {
          setData(result.data);
        } else {
          setError(result.error || '获取数据失败');
        }
      } catch (err) {
        setError('网络错误，请稍后重试');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [period]);

  useEffect(() => {
    setSelectedKey(null);
  }, [dimension, period]);

  const processedData = useMemo(() => {
    if (!data) return null;

    if (dimension === 'item') {
      const topList = data.topFlowers.map((f) => ({
        key: f.flowerId,
        name: f.flowerName,
        totalQuantity: f.totalQuantity,
        totalAmount: f.totalAmount,
      }));

      let tableList = data.flowerSales.map((f) => ({
        key: f.flowerId,
        name: f.flowerName,
        totalQuantity: f.totalQuantity,
        totalAmount: f.totalAmount,
      }));

      if (selectedKey) {
        tableList = tableList.filter((t) => t.key === selectedKey);
      }

      return { topList, tableList };
    } else {
      const categoryTop = aggregateByCategory(data.flowerSales).slice(0, 5);

      let tableList = aggregateByCategory(data.flowerSales);

      if (selectedKey) {
        tableList = tableList.filter((t) => t.key === selectedKey);
      }

      return { topList: categoryTop, tableList };
    }
  }, [data, dimension, selectedKey]);

  const formatDateRange = (start: string, end: string): string => {
    if (start === end) return start;
    return `${start} ~ ${end}`;
  };

  const calcFormulaTip = (): string => {
    if (period === 'day') {
      return '指标说明：营业额 = Σ 订单金额 | 客单价 = 营业额 ÷ 订单数 | 销量 = Σ 各花材售出数量';
    }
    return '指标说明：近7天汇总数据，每日订单数据简单累加得出';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <span className="text-3xl">💐</span>
                鲜花小店经营数据看板
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                {data ? `统计周期：${formatDateRange(data.dateRange.start, data.dateRange.end)}` : '加载中...'}
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="inline-flex rounded-xl bg-white p-1 shadow-sm border border-gray-100">
                <button
                  onClick={() => setPeriod('day')}
                  className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                    period === 'day'
                      ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  单日统计
                </button>
                <button
                  onClick={() => setPeriod('week')}
                  className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                    period === 'week'
                      ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  单周统计
                </button>
              </div>

              <div className="relative">
                <select
                  value={dimension}
                  onChange={(e) => setDimension(e.target.value as StatsDimension)}
                  className="appearance-none pl-4 pr-10 py-2.5 rounded-xl bg-white shadow-sm border border-gray-100 text-sm font-medium text-gray-700 cursor-pointer hover:border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-300 transition-all"
                >
                  <option value="item">按单品</option>
                  <option value="category">按品类</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
          <p className="mt-3 text-xs text-gray-400">{calcFormulaTip()}</p>
        </header>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="text-gray-400">加载数据中...</div>
          </div>
        ) : data ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
              <StatCard
                title="总营业额"
                value={`¥${data.summary.totalRevenue.toFixed(2)}`}
                subtitle="全部成交订单金额之和"
                icon={<DollarSign className="h-6 w-6" />}
                gradient="from-pink-500 to-rose-500"
              />
              <StatCard
                title="订单总数"
                value={data.summary.orderCount.toString()}
                subtitle="成交订单笔数"
                icon={<ShoppingBag className="h-6 w-6" />}
                gradient="from-amber-500 to-orange-500"
              />
              <StatCard
                title="平均客单价"
                value={`¥${data.summary.avgOrderValue.toFixed(2)}`}
                subtitle="营业额 ÷ 订单数"
                icon={<Users className="h-6 w-6" />}
                gradient="from-violet-500 to-purple-500"
              />
              <StatCard
                title="鲜花销售总量"
                value={`${data.summary.totalFlowerQuantity} 枝`}
                subtitle="所有花材售出总数"
                icon={<Flower2 className="h-6 w-6" />}
                gradient="from-emerald-500 to-teal-500"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              <div className="lg:col-span-2">
                <TopFlowers
                  items={processedData!.topList}
                  selectedKey={selectedKey}
                  onSelect={setSelectedKey}
                  dimension={dimension}
                />
              </div>
              <div className="lg:col-span-3">
                <FlowerSalesTable
                  items={processedData!.tableList}
                  dimension={dimension}
                  totalQuantity={data.summary.totalFlowerQuantity}
                  totalAmount={data.summary.totalRevenue}
                />
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
