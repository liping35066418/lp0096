import { type StatsDimension } from '@/types/stats';

interface TableItem {
  key: string;
  name: string;
  totalQuantity: number;
  totalAmount: number;
}

interface FlowerSalesTableProps {
  items: TableItem[];
  dimension: StatsDimension;
  totalQuantity: number;
  totalAmount: number;
}

export default function FlowerSalesTable({ items, dimension, totalQuantity, totalAmount }: FlowerSalesTableProps) {
  const title = dimension === 'item' ? '🌸 各类鲜花销售统计' : '🌸 各品类鲜花销售统计';
  const nameColumn = dimension === 'item' ? '花材名称' : '品类名称';

  if (items.length === 0) {
    return (
      <div className="rounded-2xl bg-white shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <p className="text-center text-gray-400 py-8">暂无数据</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-5">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="pb-3 text-left text-sm font-medium text-gray-500">{nameColumn}</th>
              <th className="pb-3 text-right text-sm font-medium text-gray-500">销售数量</th>
              <th className="pb-3 text-right text-sm font-medium text-gray-500">占比</th>
              <th className="pb-3 text-right text-sm font-medium text-gray-500">销售金额</th>
              <th className="pb-3 text-right text-sm font-medium text-gray-500">金额占比</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {items.map((item) => (
              <tr key={item.key} className="hover:bg-gray-50/50 transition-colors">
                <td className="py-3.5 text-sm font-medium text-gray-800">{item.name}</td>
                <td className="py-3.5 text-sm text-right text-gray-600">{item.totalQuantity} 枝</td>
                <td className="py-3.5 text-sm text-right text-gray-500">
                  {totalQuantity > 0 ? ((item.totalQuantity / totalQuantity) * 100).toFixed(1) : '0.0'}%
                </td>
                <td className="py-3.5 text-sm text-right text-pink-600 font-semibold">¥{item.totalAmount.toFixed(2)}</td>
                <td className="py-3.5 text-sm text-right text-gray-500">
                  {totalAmount > 0 ? ((item.totalAmount / totalAmount) * 100).toFixed(1) : '0.0'}%
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-gray-100 bg-gray-50/50">
              <td className="py-3 text-sm font-semibold text-gray-800">合计</td>
              <td className="py-3 text-sm text-right font-semibold text-gray-800">{totalQuantity} 枝</td>
              <td className="py-3 text-sm text-right font-semibold text-gray-800">100%</td>
              <td className="py-3 text-sm text-right font-semibold text-pink-600">¥{totalAmount.toFixed(2)}</td>
              <td className="py-3 text-sm text-right font-semibold text-gray-800">100%</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
