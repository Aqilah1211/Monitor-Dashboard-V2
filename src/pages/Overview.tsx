import { useEffect, useState } from 'react';
import { format, parseISO, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import { RefreshCw } from 'lucide-react';
import { ProgressChart } from '../components/dashboard/ProgressChart';
import { ActivityLog } from '../components/dashboard/ActivityLog';
import { LastUpdated } from '../components/dashboard/LastUpdated';
import { UnifiedFilter } from '../components/dashboard/UnifiedFilter';
import { LoadingSkeleton, RawDataViewer, ProvinceStatistics, DateSummaryStats } from '../components';
import {
  EmptyState,
} from '../components';
import { DateFilterProvider } from '../context/DateFilterContext';
import { useApp } from '../context/AppContext';
import { SchoolData } from '../types';
import { getProvinceStatistics } from '../utils/schoolLocationUtils';

interface DateRange {
  startDate: Date;
  endDate: Date;
}

interface FilteredStats {
  total: number;
  installed: number;
  pending: number;
  trouble: number;
}

interface DashboardState {
  loading: boolean;
  lastUpdated: Date | null;
  error: string | null;
}

export function Overview() {
  const { data, config, fetchData, isLoading } = useApp();

  // Dashboard state management
  const [dashboardState, setDashboardState] = useState<DashboardState>({
    loading: false,
    lastUpdated: null,
    error: null,
  });

  // Filter states - Legacy states (kept for backward compatibility)
  // Note: UnifiedFilter manages filters independently via its own hook
  const [dateRange] = useState<DateRange>({
    startDate: new Date(),
    endDate: new Date(),
  });
  const [selectedProvince] = useState('Semua Provinsi');
  const [filteredData, setFilteredData] = useState<SchoolData[]>([]);
  const [filteredStats, setFilteredStats] = useState<FilteredStats>({
    total: 0,
    installed: 0,
    pending: 0,
    trouble: 0,
  });
  const [isFilterActive, setIsFilterActive] = useState(false);

  // Auto-fetch data on mount with simulation
  useEffect(() => {
    if (!data && config.spreadsheetId && config.currentSheet) {
      console.log('🚀 Auto-fetching data on mount...');

      // Simulate loading state
      setDashboardState((prev) => ({
        ...prev,
        loading: true,
        error: null,
      }));

      // Simulate network delay
      const timeout = setTimeout(() => {
        fetchData();
        setDashboardState((prev) => ({
          ...prev,
          loading: false,
          lastUpdated: new Date(),
        }));
      }, 1500);

      return () => clearTimeout(timeout);
    }
  }, []);

  // Handle manual refresh
  const handleRefresh = () => {
    setDashboardState((prev) => ({
      ...prev,
      loading: true,
      error: null,
    }));

    const timeout = setTimeout(() => {
      if (config.spreadsheetId && config.currentSheet) {
        fetchData();
      }
      setDashboardState((prev) => ({
        ...prev,
        loading: false,
        lastUpdated: new Date(),
      }));
    }, 1200);

    return () => clearTimeout(timeout);
  };

  // Filter logic - apply both date range and province filters
  useEffect(() => {
    if (!data) {
      setFilteredData([]);
      setFilteredStats({ total: 0, installed: 0, pending: 0, trouble: 0 });
      return;
    }

    let filtered = data.all;

    // Apply date range filter
    if (dateRange.startDate && dateRange.endDate) {
      const startDate = startOfDay(dateRange.startDate);
      const endDate = endOfDay(dateRange.endDate);

      filtered = filtered.filter((item: SchoolData) => {
        try {
          // Parse tanggal dari format yang ada di data
          const itemDate = parseISO(item.tanggal);
          return isWithinInterval(itemDate, { start: startDate, end: endDate });
        } catch {
          return false;
        }
      });
    }

    // Apply province filter
    if (selectedProvince !== 'Semua Provinsi') {
      // Extract province dari nama sekolah dan filter
      filtered = filtered.filter((item: SchoolData) => {
        // Cek direktorat field (yang mungkin berisi provinsi)
        return item.direktorat
          .toLowerCase()
          .includes(selectedProvince.toLowerCase());
      });
    }

    // Calculate filtered statistics
    const stats: FilteredStats = {
      total: filtered.length,
      installed: filtered.filter((item: SchoolData) =>
        item.status.toLowerCase().includes('selesai')
      ).length,
      pending: filtered.filter(
        (item: SchoolData) => !item.status.toLowerCase().includes('selesai')
      ).length,
      trouble: filtered.filter((item: SchoolData) => item.kendala.length > 2)
        .length,
    };

    setFilteredData(filtered);
    setFilteredStats(stats);

    // Check if filter is active
    const filterActive =
      selectedProvince !== 'Semua Provinsi' ||
      (dateRange.startDate &&
        dateRange.endDate &&
        format(dateRange.startDate, 'yyyy-MM-dd') !==
          format(new Date(), 'yyyy-MM-dd'));
    setIsFilterActive(filterActive);

    console.log('✅ Filters applied:', {
      dateRange,
      province: selectedProvince,
      resultCount: filtered.length,
    });
  }, [data, dateRange, selectedProvince]);

  // Handle province selection from chart
  const handleProvinceSelect = (_province: string) => {
    // Note: Province filtering is now handled by UnifiedFilter component
    // Optional: scroll to statistics section
    const statsElement = document.querySelector('[data-section="statistics"]');
    if (statsElement) {
      statsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Mock data untuk testing DateSummaryStats
  // Format: { id, name, date, status }
  const mockSummaryData = data?.all?.map((item: SchoolData) => {
    let status: 'terpasang' | 'pending' | 'problem' | 'proses' = 'pending';
    
    if (item.status.toLowerCase().includes('selesai')) {
      status = 'terpasang';
    } else if (item.kendala && item.kendala.length > 2) {
      status = 'problem';
    } else if (item.status.toLowerCase().includes('proses')) {
      status = 'proses';
    }

    return {
      id: item.npsn,
      name: item.nama,
      date: new Date(item.tanggal),
      status: status,
    };
  }) || [];

  // Debug: Log tanggal setiap kali date filter berubah
  useEffect(() => {
    console.log('📅 Date Filter Changed:', {
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      selectedProvince,
      filteredCount: filteredData.length,
      timestamp: new Date().toLocaleTimeString('id-ID'),
    });
  }, [dateRange, selectedProvince]);

  // Tampilkan loading skeleton saat data sedang di-fetch atau state loading aktif
  if (isLoading || dashboardState.loading || !data) {
    return <LoadingSkeleton />;
  }

  // Ambil jumlah provinsi untuk display
  const provinceStats = getProvinceStatistics();
  const topProvince = provinceStats[0];

  // Format last updated time
  const lastUpdatedTime = dashboardState.lastUpdated
    ? format(dashboardState.lastUpdated, 'HH:mm:ss')
    : 'Tidak ada data';

  return (
    <DateFilterProvider>
      <div className="space-y-6">
        {/* Error Alert */}
        {dashboardState.error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 font-medium">⚠️ {dashboardState.error}</p>
          </div>
        )}

        {/* Header dengan Title, Last Updated dan Refresh Button */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">📊 Dashboard</h1>
            <div className="space-y-1 mt-2">
              <p className="text-slate-600 text-sm">
                Total {data.all.length} sekolah dipantau
              </p>
              <p className="text-xs text-slate-500">
                ⏱️ Terakhir diperbarui:{' '}
                <span className="font-mono font-semibold">{lastUpdatedTime}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={dashboardState.loading}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-500 text-white rounded-lg transition-colors font-medium text-sm"
            >
              <RefreshCw
                className={`w-4 h-4 ${
                  dashboardState.loading ? 'animate-spin' : ''
                }`}
              />
              Refresh
            </button>
            <LastUpdated />
          </div>
        </div>

        {/* Unified Filter Component */}
        <UnifiedFilter />

        {/* Date Summary Stats */}
        <DateSummaryStats data={mockSummaryData} />

        {/* Filter Active Indicator */}
        {isFilterActive && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
              📊 Menampilkan{' '}
              <span className="font-bold">{filteredData.length}</span> dari{' '}
              <span className="font-bold">{data.all.length}</span> sekolah
            </p>
          </div>
        )}

      {/* Statistics Grid - Show EmptyState jika tidak ada data */}
      {filteredData.length > 0 ? (
        <div data-section="statistics">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Statistik{' '}
            {selectedProvince !== 'Semua Provinsi'
              ? `- ${selectedProvince}`
              : ''}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Card */}
            <div
              className={`p-4 rounded-lg border-2 ${
                isFilterActive
                  ? 'border-blue-300 bg-blue-50'
                  : 'border-slate-200 bg-white'
              } shadow-sm hover:shadow-md transition-shadow`}
            >
              <p className="text-sm font-medium text-slate-600">Total Unit</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">
                {filteredStats.total}
              </p>
              <p className="text-xs text-slate-500 mt-2">
                {((filteredStats.total / data.all.length) * 100).toFixed(1)}%
                dari total
              </p>
            </div>

            {/* Installed Card */}
            <div
              className={`p-4 rounded-lg border-2 ${
                isFilterActive
                  ? 'border-green-300 bg-green-50'
                  : 'border-slate-200 bg-white'
              } shadow-sm hover:shadow-md transition-shadow`}
            >
              <p className="text-sm font-medium text-slate-600">Terpasang</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {filteredStats.installed}
              </p>
              <p className="text-xs text-slate-500 mt-2">
                {filteredStats.total > 0
                  ? (
                      (filteredStats.installed / filteredStats.total) *
                      100
                    ).toFixed(1)
                  : 0}
                % progress
              </p>
            </div>

            {/* Pending Card */}
            <div
              className={`p-4 rounded-lg border-2 ${
                isFilterActive
                  ? 'border-yellow-300 bg-yellow-50'
                  : 'border-slate-200 bg-white'
              } shadow-sm hover:shadow-md transition-shadow`}
            >
              <p className="text-sm font-medium text-slate-600">Menunggu</p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">
                {filteredStats.pending}
              </p>
              <p className="text-xs text-slate-500 mt-2">
                {filteredStats.total > 0
                  ? (
                      (filteredStats.pending / filteredStats.total) *
                      100
                    ).toFixed(1)
                  : 0}
                % pending
              </p>
            </div>

            {/* Trouble Card */}
            <div
              className={`p-4 rounded-lg border-2 ${
                isFilterActive
                  ? 'border-red-300 bg-red-50'
                  : 'border-slate-200 bg-white'
              } shadow-sm hover:shadow-md transition-shadow`}
            >
              <p className="text-sm font-medium text-slate-600">Kendala</p>
              <p className="text-3xl font-bold text-red-600 mt-2">
                {filteredStats.trouble}
              </p>
              <p className="text-xs text-slate-500 mt-2">
                {filteredStats.total > 0
                  ? (
                      (filteredStats.trouble / filteredStats.total) *
                      100
                    ).toFixed(1)
                  : 0}
                % bermasalah
              </p>
            </div>
          </div>
        </div>
      ) : (
        <EmptyState
          title="Tidak ada data untuk filter ini"
          message="Coba ubah filter tanggal atau provinsi untuk melihat data"
          icon={undefined}
        />
      )}

      {/* Charts and Activity */}
      {filteredData.length > 0 && (
        <>
          <ProgressChart />
          <ActivityLog />
        </>
      )}

      {/* Province Statistics Chart */}
      <ProvinceStatistics
        data={provinceStats}
        onProvinceSelect={handleProvinceSelect}
      />

      {/* Top Province Info */}
      {topProvince && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            📍 Provinsi dengan Aktivitas Terbanyak
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Provinsi</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">
                {topProvince.province}
              </p>
              <p className="text-sm text-slate-500 mt-2">
                Kode:{' '}
                <span className="font-mono font-semibold">{topProvince.code}</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-600">Total Sekolah</p>
              <p className="text-4xl font-bold text-blue-600 mt-1">
                {topProvince.count}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Debug */}
      <RawDataViewer />
      </div>
    </DateFilterProvider>
  );
}
