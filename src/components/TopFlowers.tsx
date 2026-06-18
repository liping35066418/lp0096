import type { FlowerSalesStat } from '@/types/stats';

interface TopFlowersProps {
  flowers: FlowerSalesStat[];
}

function getRankStyle(rank: number): string {
  switch (rank) {
    case 1:
      return 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white';
    case 2:
      return 'bg-gradient-to-r from-gray-300 to-gray-400 text-white';
    case 3:
      return 'bg-gradient-to-r from-orange-400 to-orange-500 text-white';
    default:
      return 'bg-gray-100 text-gray-600';
  }
}

export default function TopFlowers({ flowers }: TopFlowersProps) {
  if (flowers.length === 0) {
    return (
      <div className="rounded-2xl bg-white shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🏆 热销花材榜单</h3>
        <p className="text-center text-gray-400 py-8">暂无数据</p>
      </div>
    );
  }

  const maxQuantity = Math.max(...flowers.map((f) => f.totalQuantity));

  return (
    <div className="rounded-2xl bg-white shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-5">🏆 热销花材榜单</h3>
      <div className="space-y-4">
        {flowers.map((flower, index) => {
          const rank = index + 1;
          const percentage = (flower.totalQuantity / maxQuantity) * 100;
          return (
            <div key={flower.flowerId} className="flex items-center gap-4">
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold ${getRankStyle(rank)}`}>
                {rank}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-800 truncate">{flower.flowerName}</span>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-gray-500">{flower.totalQuantity} 枝</span>
                    <span className="text-pink-600 font-semibold">¥{flower.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-pink-400 to-rose-500 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
