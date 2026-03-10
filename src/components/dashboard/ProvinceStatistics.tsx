import { useState, useMemo } from 'react';
import { Eye, EyeOff, TrendingUp } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface ProvinceData {
  province: string;
  count: number;
}

interface ProvinceStatisticsProps {
  data: ProvinceData[];
  onProvinceSelect?: (province: string) => void;
}

// Color palette for bars
const COLORS = [
  '#3b82f6', // blue
  '#ef4444', // red
  '#10b981', // green
  '#f59e0b', // amber
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#f97316', // orange
  '#6366f1', // indigo
  '#14b8a6', // teal
  '#d946ef', // fuchsia
  '#0ea5e9', // sky
];

export default function ProvinceStatistics({
  data,
  onProvinceSelect,
}: ProvinceStatisticsProps) {
  const [showAll, setShowAll] = useState(false);

  // Sort data by count and take top 5 or all
  const displayData = useMemo(() => {
    const sorted = [...data].sort((a, b) => b.count - a.count);
    return showAll ? sorted : sorted.slice(0, 5);
  }, [data, showAll]);

  // Assign colors to provinces
  const dataWithColors = useMemo(() => {
    return displayData.map((item, index) => ({
      ...item,
      color: COLORS[index % COLORS.length],
    }));
  }, [displayData]);

  const totalSchools = useMemo(() => {
    return displayData.reduce((sum, item) => sum + item.count, 0);
  }, [displayData]);

  const handleBarClick = (province: string) => {
    if (onProvinceSelect) {
      onProvinceSelect(province);
    }
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-200">
          <p className="font-semibold text-slate-900">{data.province}</p>
          <p className="text-sm text-blue-600 font-semibold">
            {data.count} sekolah
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {((data.count / totalSchools) * 100).toFixed(1)}% dari total
          </p>
        </div>
      );
    }
    return null;
  };

  if (!data || data.length === 0) {
    return (
      <div className="p-6 bg-slate-50 rounded-lg border border-slate-200 text-center">
        <p className="text-slate-600">Tidak ada data provinsi tersedia</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-slate-900">
            Distribusi Sekolah per Provinsi
          </h2>
        </div>
        <button
          onClick={() => setShowAll(!showAll)}
          className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium text-sm rounded-lg transition-colors"
        >
          {showAll ? (
            <>
              <Eye className="w-4 h-4" />
              Top 5
            </>
          ) : (
            <>
              <EyeOff className="w-4 h-4" />
              Lihat Semua
            </>
          )}
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-blue-600 font-medium">Total Provinsi</p>
          <p className="text-2xl font-bold text-blue-700 mt-1">
            {displayData.length}
          </p>
        </div>
        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
          <p className="text-xs text-green-600 font-medium">Total Sekolah</p>
          <p className="text-2xl font-bold text-green-700 mt-1">
            {totalSchools}
          </p>
        </div>
        <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
          <p className="text-xs text-purple-600 font-medium">Rata-rata</p>
          <p className="text-2xl font-bold text-purple-700 mt-1">
            {(totalSchools / displayData.length).toFixed(1)}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <ResponsiveContainer width="100%" height={Math.max(300, displayData.length * 40)}>
          <BarChart
            data={dataWithColors}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 200, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis type="number" />
            <YAxis
              dataKey="province"
              type="category"
              width={190}
              tick={{ fontSize: 13, fill: '#475569' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="count"
              onClick={(data: any) => handleBarClick(data.province)}
              animationDuration={500}
              radius={[0, 8, 8, 0]}
              className="cursor-pointer hover:opacity-80 transition-opacity"
            >
              {dataWithColors.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top 5 Details */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-slate-900 mb-3 text-sm">
          📊 {showAll ? 'Semua Provinsi' : 'Top 5'} Ranking
        </h3>
        <div className="space-y-2">
          {displayData.map((item, index) => {
            const percentage = ((item.count / totalSchools) * 100).toFixed(1);
            return (
              <div
                key={item.province}
                className="flex items-center justify-between p-2 bg-white rounded-lg hover:shadow-sm transition-shadow cursor-pointer"
                onClick={() => handleBarClick(item.province)}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {index + 1}. {item.province}
                    </p>
                    <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${(item.count / Math.max(...displayData.map(d => d.count))) * 100}%`,
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-3">
                  <p className="text-sm font-bold text-slate-900">
                    {item.count}
                  </p>
                  <p className="text-xs text-slate-500">{percentage}%</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Info Message */}
      <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
        💡 Klik pada bar chart atau item ranking untuk filter dashboard berdasarkan
        provinsi
      </div>
    </div>
  );
}
