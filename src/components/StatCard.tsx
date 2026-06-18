import { type ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: ReactNode;
  gradient: string;
}

export default function StatCard({ title, value, subtitle, icon, gradient }: StatCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
          {subtitle && (
            <p className="mt-1 text-xs text-gray-400">{subtitle}</p>
          )}
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg`}>
          {icon}
        </div>
      </div>
      <div className={`absolute -right-8 -bottom-8 h-32 w-32 rounded-full bg-gradient-to-br ${gradient} opacity-5`} />
    </div>
  );
}
