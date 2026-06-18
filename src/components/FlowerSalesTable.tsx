import type { FlowerSalesStat } from '@/types/stats';

interface FlowerSalesTableProps {
  sales: FlowerSalesStat[];
}

export default function FlowerSalesTable({ sales }: FlowerSalesTableProps) {
  if (sales.length === 0) {
    return (
      <div className="rounded-2xl bg-white shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🌸 各类鲜花销售统计</h3>
        <p className="text-center text-gray-400 py-8">暂无数据</p>
      </div>
    );
  }

  const totalQuantity = sales.reduce((sum, s) => sum + s.totalQuantity, 0);
  const totalAmount = sales.reduce((sum, s) => sum + s.totalAmount, 0);

  return (
    <div className="rounded-2xl bg-white shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-5">🌸 各类鲜花销售统计</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="pb-3 text-left text-sm font-medium text-gray-500">花材名称</th>
              <th className="pb-3 text-right text-sm font-medium text-gray-500">销售数量</th>
              <th className="pb-3 text-right text-sm font-medium text-gray-500">占比</th>
              <th className="pb-3 text-right text-sm font-medium text-gray-500">销售金额</th>
              <th className="pb-3 text-right text-sm font-medium text-gray-500">金额占比</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {sales.map((item) => (
              <tr key={item.flowerId} className="hover:bg-gray-50/50 transition-colors">
                <td className="py-3.5 text-sm font-medium text-gray-800">{item.flowerName}</td>
                <td className="py-3.5 text-sm text-right text-gray-600">{item.totalQuantity} 枝</td>
                <td className="py-3.5 text-sm text-right text-gray-500">
                  {((item.totalQuantity / totalQuantity) * 100).toFixed(1)}%
                </td>
                <td className="py-3.5 text-sm text-right text-pink-600 font-semibold">¥{item.totalAmount.toFixed(2)}</td>
                <td className="py-3.5 text-sm text-right text-gray-500">
                  {((item.totalAmount / totalAmount) * 100).toFixed(1)}%
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
