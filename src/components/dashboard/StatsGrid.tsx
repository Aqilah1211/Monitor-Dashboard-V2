import { memo } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../ui/Card';

export const StatsGrid = memo(function StatsGrid() {
  const { data } = useApp();

  const stats = [
    { label: 'Total Unit', value: data?.all.length || 0, color: 'blue', icon: '📊' },
    { label: 'Terpasang', value: data?.installed.length || 0, color: 'emerald', icon: '✅' },
    { label: 'Pending', value: data?.pending.length || 0, color: 'amber', icon: '⏳' },
    { label: 'Kendala', value: data?.trouble.length || 0, color: 'rose', icon: '⚠️' }
  ];

  const colorClasses: Record<string, string> = {
    blue: 'border-l-blue-500',
    emerald: 'border-l-emerald-500',
    amber: 'border-l-amber-500',
    rose: 'border-l-rose-500'
  };

  const textColors: Record<string, string> = {
    blue: 'text-blue-600',
    emerald: 'text-emerald-600',
    amber: 'text-amber-600',
    rose: 'text-rose-600'
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => (
        <Card key={stat.label} className={`p-6 border-l-4 ${colorClasses[stat.color]}`}>
          <div className="flex items-center justify-between mb-2 text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">{stat.label}</span>
            <span className="text-lg">{stat.icon}</span>
          </div>
          <h3 className={`text-3xl font-bold ${textColors[stat.color]}`}>{stat.value}</h3>
        </Card>
      ))}
    </div>
  );
});
