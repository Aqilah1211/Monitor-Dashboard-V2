import { useEffect, useState, useMemo } from 'react';
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
import { useUnifiedFilter } from '../hooks/useUnifiedFilter';
import { SchoolData } from '../types';
import { getProvinceStatisticsFromData } from '../utils/schoolLocationUtils';

// ✅ DateRange now comes from filterUtils via useUnifiedFilter

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
  const filter = useUnifiedFilter(); // ✅ Use unified filter instead of legacy states

  // Dashboard state management
  const [dashboardState, setDashboardState] = useState<DashboardState>({
    loading: false,
    lastUpdated: null,
    error: null,
  });

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
  }, [config.spreadsheetId, config.currentSheet, fetchData]); // 🔥 Add dependencies!

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

  // ✅ Compute filtered data based on unified filter state
  const { filteredData, filteredStats, isFilterActive } = useMemo(() => {
    if (!data || !data.all) {
      return {
        filteredData: [],
        filteredStats: { total: 0, installed: 0, pending: 0, trouble: 0 },
        isFilterActive: false
      };
    }

    let result = data.all;

    // Apply date range filter
    if (filter.dateRange) {
      const startDate = startOfDay(filter.dateRange.start);
      const endDate = endOfDay(filter.dateRange.end);

      result = result.filter((item: SchoolData) => {
        try {
          const itemDate = parseISO(item.tanggal);
          return isWithinInterval(itemDate, { start: startDate, end: endDate });
        } catch {
          return false;
        }
      });
    }

    // Apply province filter
    if (filter.provinces.length > 0) {
      result = result.filter((item: SchoolData) => 
        filter.provinces.some(province => 
          item.direktorat.toLowerCase().includes(province.toLowerCase())
        )
      );
    }

    // Apply status filter
    if (filter.status.length > 0) {
      result = result.filter((item: SchoolData) =>
        filter.status.some(status => {
          const itemStatus = item.status.toLowerCase();
          const filterStatus = status.toLowerCase();
          return itemStatus.includes(filterStatus);
        })
      );
    }

    // Apply search filter
    if (filter.searchText) {
      const searchLower = filter.searchText.toLowerCase();
      result = result.filter((item: SchoolData) =>
        item.npsn.toLowerCase().includes(searchLower) ||
        item.nama.toLowerCase().includes(searchLower) ||
        item.direktorat.toLowerCase().includes(searchLower)
      );
    }

    // Calculate filtered statistics
    const stats: FilteredStats = {
      total: result.length,
      installed: result.filter((item: SchoolData) =>
        item.status.toLowerCase().includes('selesai')
      ).length,
      pending: result.filter((item: SchoolData) =>
        !item.status.toLowerCase().includes('selesai') &&
        (!item.kendala || item.kendala.trim().length === 0)
      ).length,
      trouble: result.filter((item: SchoolData) =>
        item.kendala && item.kendala.trim().length > 0
      ).length,
    };

    // Check if filter is active (any filter applied)
    const isActive =
      filter.dateRange !== null ||
      filter.provinces.length > 0 ||
      filter.status.length > 0 ||
      filter.searchText.length > 0;

    console.log('✅ Filtered data updated:', {
      dateRange: filter.dateRange,
      provinces: filter.provinces,
      status: filter.status,
      searchText: filter.searchText,
      resultCount: result.length,
      stats
    });

    return {
      filteredData: result,
      filteredStats: stats,
      isFilterActive: isActive
    };
  }, [data, filter.dateRange, filter.provinces, filter.status, filter.searchText]);

  // Handle province selection from chart
  const handleProvinceSelect = (_province: string) => {
    // Note: Province filtering is now handled by UnifiedFilter component
    // Optional: scroll to statistics section
    const statsElement = document.querySelector('[data-section="statistics"]');
    if (statsElement) {
      statsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // ✅ Safe data access helpers (declared early for use in computations)
  const totalSchools = data?.all?.length ?? 0;
  const allSchoolsData = data?.all ?? [];

  // Mock data untuk testing DateSummaryStats
  // Format: { id, name, date, status }
  // ✅ Safe access with null checks
  const mockSummaryData = (allSchoolsData)?.map((item: SchoolData) => {
    let status: 'terpasang' | 'pending' | 'problem' | 'proses' = 'pending';
    
    const itemStatus = item.status?.toLowerCase().trim() || '';
    const itemKendala = item.kendala?.trim() || '';

    if (itemStatus.includes('selesai')) {
      status = 'terpasang';
    } else if (itemKendala.length > 0) {
      // ✅ Fixed: any non-empty kendala = problem, not > 2 chars
      status = 'problem';
    } else if (itemStatus.includes('proses')) {
      status = 'proses';
    }

    return {
      id: item.npsn,
      name: item.nama,
      date: new Date(item.tanggal),
      status: status,
    };
  }) || [];

  // Remove this useEffect - no longer needed with unified filter
  // (Previously logged when legacy dateRange and selectedProvince changed)

  // Tampilkan loading skeleton saat data sedang di-fetch atau state loading aktif
  if (isLoading || dashboardState.loading || !data) {
    return <LoadingSkeleton />;
  }

  // 🔥 DYNAMIC: Compute province stats dari actual data (NOT hardcoded!)
  const allSchools = data?.all ?? [];
  const provinceStats = getProvinceStatisticsFromData(allSchools);
  const topProvince = provinceStats?.[0];

  // Tambilk last updated time dengan safety check
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
                Total {totalSchools} sekolah dipantau
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
              <span className="font-bold">{totalSchools}</span> sekolah
            </p>
          </div>
        )}

      {/* Statistics Grid - Show EmptyState jika tidak ada data */}
      {filteredData.length > 0 ? (
        <div data-section="statistics">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Statistik{' '}
            {filter.provinces.length > 0
              ? `- ${filter.provinces.join(', ')}`
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
                {totalSchools > 0 ? ((filteredStats.total / totalSchools) * 100).toFixed(1) : '0'}%
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
