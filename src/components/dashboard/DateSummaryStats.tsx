/**
 * DateSummaryStats - Komponen untuk menampilkan statistik berdasarkan filter tanggal
 * Menampilkan ringkasan data pemasangan TV dalam periode tertentu
 */

import React, { useMemo } from 'react';
import { CheckCircle2, Clock, AlertCircle, Wrench } from 'lucide-react';
import { useDateFilter } from '@/context/DateFilterContext';
import { formatDateID, isDateInRange } from '@/utils/dateUtils';

/**
 * Interface untuk data pemasangan TV
 */
interface TVInstallationData {
  id: string;
  name: string;
  date: Date | string;
  status: 'terpasang' | 'pending' | 'problem' | 'proses';
  [key: string]: any; // Allow additional properties
}

/**
 * Interface untuk props component
 */
interface DateSummaryStatsProps {
  data: TVInstallationData[];
}

/**
 * Interface untuk statistik
 */
interface Statistics {
  totalInstalled: number;
  totalPending: number;
  totalProblem: number;
  totalProgress: number;
  total: number;
}

/**
 * Stat Card Component
 */
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  percentage: number;
  color: 'green' | 'yellow' | 'red' | 'blue';
  isEmpty?: boolean;
}

function StatCard({
  icon,
  label,
  value,
  percentage,
  color,
  isEmpty = false,
}: StatCardProps) {
  const getColorClasses = (c: string) => {
    if (isEmpty) {
      return {
        bg: 'bg-gray-50',
        border: 'border-gray-200',
        icon: 'text-gray-400',
        label: 'text-gray-600',
        value: 'text-gray-700',
        percentage: 'text-gray-500',
      };
    }

    switch (c) {
      case 'green':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          icon: 'text-green-600',
          label: 'text-green-900',
          value: 'text-green-700',
          percentage: 'bg-green-100 text-green-800',
        };
      case 'yellow':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          icon: 'text-yellow-600',
          label: 'text-yellow-900',
          value: 'text-yellow-700',
          percentage: 'bg-yellow-100 text-yellow-800',
        };
      case 'red':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          icon: 'text-red-600',
          label: 'text-red-900',
          value: 'text-red-700',
          percentage: 'bg-red-100 text-red-800',
        };
      case 'blue':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          icon: 'text-blue-600',
          label: 'text-blue-900',
          value: 'text-blue-700',
          percentage: 'bg-blue-100 text-blue-800',
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          icon: 'text-gray-400',
          label: 'text-gray-600',
          value: 'text-gray-700',
          percentage: 'text-gray-500',
        };
    }
  };

  const colors = getColorClasses(color);

  return (
    <div
      className={`${colors.bg} border ${colors.border} rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow`}
    >
      {/* Icon */}
      <div className={`${colors.icon} mb-2`}>{icon}</div>

      {/* Label */}
      <p className={`text-sm font-medium ${colors.label} mb-2`}>{label}</p>

      {/* Value */}
      <p className={`text-3xl font-bold ${colors.value} mb-3`}>{value}</p>

      {/* Percentage */}
      {!isEmpty && (
        <div className={`inline-block px-2 py-1 rounded text-sm font-medium ${colors.percentage}`}>
          {percentage}%
        </div>
      )}
    </div>
  );
}

/**
 * DateSummaryStats Component
 * Menampilkan statistik data berdasarkan filter tanggal
 */
export default function DateSummaryStats({ data }: DateSummaryStatsProps) {
  const { startDate, endDate } = useDateFilter();

  /**
   * Calculate statistics based on date filter
   */
  const statistics = useMemo<Statistics>(() => {
    if (!data || data.length === 0) {
      return {
        totalInstalled: 0,
        totalPending: 0,
        totalProblem: 0,
        totalProgress: 0,
        total: 0,
      };
    }

    let installed = 0;
    let pending = 0;
    let problem = 0;
    let progress = 0;

    // Filter data berdasarkan date range
    const filteredData = data.filter((item) => {
      const itemDate = new Date(item.date);
      return isDateInRange(itemDate, startDate, endDate);
    });

    // Count by status
    filteredData.forEach((item) => {
      const status = item.status.toLowerCase();
      if (status === 'terpasang') installed++;
      else if (status === 'pending') pending++;
      else if (status === 'problem') problem++;
      else if (status === 'proses') progress++;
    });

    const total = filteredData.length;

    return {
      totalInstalled: installed,
      totalPending: pending,
      totalProblem: problem,
      totalProgress: progress,
      total,
    };
  }, [data, startDate, endDate]);

  /**
   * Calculate percentage
   */
  const getPercentage = (value: number): number => {
    if (statistics.total === 0) return 0;
    return Math.round((value / statistics.total) * 100);
  };

  const isEmpty = statistics.total === 0;

  return (
    <div className="w-full space-y-4">
      {/* Header dengan period info */}
      <div className="px-1">
        <h3 className="font-semibold text-gray-800 text-base md:text-lg">
          📊 Ringkasan Periode:{' '}
          <span className="text-blue-600">
            {formatDateID(startDate)} s/d {formatDateID(endDate)}
          </span>
        </h3>
        {!isEmpty && (
          <p className="text-sm text-gray-500 mt-1">
            Total {statistics.total} data dalam periode ini
          </p>
        )}
      </div>

      {/* Stats Grid - 4 kolom di desktop, 2 kolom di tablet, 1 kolom di mobile */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
        {/* Installed Card */}
        <StatCard
          icon={
            <CheckCircle2
              size={28}
              className={isEmpty ? undefined : 'text-green-600'}
            />
          }
          label="Terpasang"
          value={statistics.totalInstalled}
          percentage={getPercentage(statistics.totalInstalled)}
          color="green"
          isEmpty={isEmpty}
        />

        {/* Pending Card */}
        <StatCard
          icon={
            <Clock
              size={28}
              className={isEmpty ? undefined : 'text-yellow-600'}
            />
          }
          label="Pending"
          value={statistics.totalPending}
          percentage={getPercentage(statistics.totalPending)}
          color="yellow"
          isEmpty={isEmpty}
        />

        {/* Problem Card */}
        <StatCard
          icon={
            <AlertCircle
              size={28}
              className={isEmpty ? undefined : 'text-red-600'}
            />
          }
          label="Kendala"
          value={statistics.totalProblem}
          percentage={getPercentage(statistics.totalProblem)}
          color="red"
          isEmpty={isEmpty}
        />

        {/* Progress Card */}
        <StatCard
          icon={
            <Wrench
              size={28}
              className={isEmpty ? undefined : 'text-blue-600'}
            />
          }
          label="Proses"
          value={statistics.totalProgress}
          percentage={getPercentage(statistics.totalProgress)}
          color="blue"
          isEmpty={isEmpty}
        />
      </div>

      {/* Empty State Message */}
      {isEmpty && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
          <p className="text-sm text-yellow-800">
            ℹ️ Tidak ada data dalam periode {formatDateID(startDate)} s/d{' '}
            {formatDateID(endDate)}
          </p>
        </div>
      )}

      {/* Summary Info */}
      {!isEmpty && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <div className="text-center">
              <p className="text-xs text-gray-600">Tingkat Keberhasilan</p>
              <p className="text-lg font-bold text-green-600">
                {getPercentage(statistics.totalInstalled)}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-600">Dalam Proses</p>
              <p className="text-lg font-bold text-blue-600">
                {getPercentage(statistics.totalProgress)}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-600">Menunggu</p>
              <p className="text-lg font-bold text-yellow-600">
                {getPercentage(statistics.totalPending)}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-600">Kendala</p>
              <p className="text-lg font-bold text-red-600">
                {getPercentage(statistics.totalProblem)}%
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
