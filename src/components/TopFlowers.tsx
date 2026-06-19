import { type StatsDimension } from '@/types/stats';

interface TopItem {
  key: string;
  name: string;
  totalQuantity: number;
  totalAmount: number;
}

interface TopFlowersProps {
  items: TopItem[];
  selectedKey: string | null;
  onSelect: (key: string | null) => void;
  dimension: StatsDimension;
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

export default function TopFlowers({ items, selectedKey, onSelect, dimension }: TopFlowersProps) {
  const title = dimension === 'item' ? '🏆 热销花材榜单' : '🏆 热销品类榜单';

  if (items.length === 0) {
    return (
      <div className="rounded-2xl bg-white shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <p className="text-center text-gray-400 py-8">暂无数据</p>
      </div>
    );
  }

  const maxQuantity = Math.max(...items.map((f) => f.totalQuantity));

  const handleClick = (key: string) => {
    if (selectedKey === key) {
      onSelect(null);
    } else {
      onSelect(key);
    }
  };

  return (
    <div className="rounded-2xl bg-white shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {selectedKey && (
          <button
            onClick={() => onSelect(null)}
            className="text-xs text-pink-600 hover:text-pink-700 font-medium transition-colors"
          >
            取消筛选
          </button>
        )}
      </div>
      <div className="space-y-3">
        {items.map((item, index) => {
          const rank = index + 1;
          const percentage = (item.totalQuantity / maxQuantity) * 100;
          const isSelected = selectedKey === item.key;
          return (
            <div
              key={item.key}
              onClick={() => handleClick(item.key)}
              className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all ${
                isSelected
                  ? 'bg-pink-50 border-2 border-pink-300 shadow-sm'
                  : 'hover:bg-gray-50 border-2 border-transparent'
              }`}
            >
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold flex-shrink-0 ${getRankStyle(rank)}`}>
                {rank}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-800 truncate">
                    {item.name}
                    {isSelected && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-pink-500 text-white">
                        已选中
                      </span>
                    )}
                  </span>
                  <div className="flex items-center gap-3 text-sm flex-shrink-0 ml-2">
                    <span className="text-gray-500">{item.totalQuantity} 枝</span>
                    <span className="text-pink-600 font-semibold">¥{item.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isSelected
                        ? 'bg-gradient-to-r from-pink-500 to-rose-600'
                        : 'bg-gradient-to-r from-pink-400 to-rose-500'
                    }`}
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
