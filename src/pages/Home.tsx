import { useState, useEffect } from 'react';
import { DollarSign, ShoppingBag, Users, Flower2 } from 'lucide-react';
import StatCard from '@/components/StatCard';
import TopFlowers from '@/components/TopFlowers';
import FlowerSalesTable from '@/components/FlowerSalesTable';
import type { StatsData, ApiResponse } from '@/types/stats';

type Period = 'day' | 'week';

export default function Home() {
  const [period, setPeriod] = useState<Period>('day');
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

            <div className="flex items-center gap-2">
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
                <TopFlowers flowers={data.topFlowers} />
              </div>
              <div className="lg:col-span-3">
                <FlowerSalesTable sales={data.flowerSales} />
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
