import { useEffect, useState } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useSchoolSearch } from '../hooks/useSchoolSearch';
import SchoolSearch from '../components/troubles/SchoolSearch';
import SchoolTable from '../components/troubles/SchoolTable';
import { School } from '../types/school';
import { LoadingSkeleton } from '../components';
import { logger } from '../utils/logger';

export function Troubles() {
  const { data, isLoading, fetchData } = useApp();
  const [schoolData, setSchoolData] = useState<School[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Initialize hook
  const {
    query,
    searchType,
    filteredSchools,
    isSearching,
    handleSearch,
    clearSearch,
    setSearchType: updateSearchType,
  } = useSchoolSearch({ schools: schoolData });

  /**
   * Convert app data to School type
   */
  useEffect(() => {
    if (data?.all) {
      const converted = data.all.map((item: any, idx: number) => ({
        id: item.npsn || `school-${idx}`,
        npsn: item.npsn || '-',
        schoolName: item.nama || '-',
        province: item.direktorat || '-',
        status: determineStatus(item),
        problemDetail: item.kendala || undefined,
        installationDate: item.tanggal || undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        // Keep original data
        ...item,
      }));

      setSchoolData(converted);
      logger.debug('Troubles: School data loaded', { count: converted.length });
    }
  }, [data]);

  /**
   * Determine status dari data
   */
  const determineStatus = (item: any): School['status'] => {
    if (!item.status) return 'pending';

    const status = item.status.toLowerCase();
    if (status.includes('selesai') || status.includes('installed')) return 'installed';
    if (status.includes('proses') || status.includes('progress')) return 'in_progress';

    // Check if has problem
    if (item.kendala && item.kendala.length > 2) return 'problem';

    return 'pending';
  };

  /**
   * Handle refresh data
   */
  const handleRefresh = () => {
    setIsRefreshing(true);
    try {
      fetchData();
      logger.info('Troubles: Data refreshed');
    } finally {
      setTimeout(() => setIsRefreshing(false), 1000);
    }
  };

  /**
   * Calculate statistics
   */
  const totalSchools = schoolData.length;
  const problemCount = schoolData.filter((s) => s.status === 'problem').length;

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">⚠️ Kelola Masalah Instalasi</h1>
          <p className="text-slate-600 text-sm mt-2">
            Total {totalSchools} sekolah • {problemCount} ada masalah
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-500 text-white rounded-lg transition-colors font-medium text-sm"
        >
          <RefreshCw
            className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`}
          />
          Refresh
        </button>
      </div>

      {/* Description */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 mb-1">Fitur Pencarian Lanjutan</h3>
            <p className="text-sm text-blue-800">
              Gunakan fitur pencarian di bawah untuk menemukan sekolah berdasarkan NPSN atau nama sekolah.
              Anda dapat memilih mode pencarian untuk hasil yang lebih spesifik.
            </p>
          </div>
        </div>
      </div>

      {/* School Search */}
      <SchoolSearch
        query={query}
        searchType={searchType}
        isSearching={isSearching}
        resultsCount={filteredSchools.length}
        totalCount={totalSchools}
        onSearch={handleSearch}
        onClear={clearSearch}
        onSearchTypeChange={updateSearchType}
        searchHistory={[]}
        onHistorySelect={(q) => handleSearch(q, searchType)}
      />

      {/* Stats Row */}
      {query && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: 'Total Difilter',
              value: filteredSchools.length,
              color: 'bg-blue-50 text-blue-700 border-blue-200',
            },
            {
              label: 'Terpasang',
              value: filteredSchools.filter((s) => s.status === 'installed').length,
              color: 'bg-green-50 text-green-700 border-green-200',
            },
            {
              label: 'Pending',
              value: filteredSchools.filter((s) => s.status === 'pending').length,
              color: 'bg-yellow-50 text-yellow-700 border-yellow-200',
            },
            {
              label: 'Ada Masalah',
              value: filteredSchools.filter((s) => s.status === 'problem').length,
              color: 'bg-red-50 text-red-700 border-red-200',
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className={`px-4 py-3 rounded-lg border ${stat.color}`}
            >
              <div className="text-xs font-medium opacity-75">{stat.label}</div>
              <div className="text-2xl font-bold mt-1">{stat.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* School Table */}
      <SchoolTable
        data={filteredSchools}
        highlightTerms={(text) => {
          const parts = query
            .split(/\s+/)
            .filter((q) => q.trim())
            .reduce(
              (acc, q) => {
                return acc.flatMap((part) => {
                  if (!part.isHighlighted) {
                    const regex = new RegExp(`(${q})`, 'gi');
                    const matches = part.text.split(regex);
                    return matches
                      .filter((m) => m.length > 0)
                      .map((m) => ({
                        text: m,
                        isHighlighted: regex.test(m),
                      }));
                  }
                  return [part];
                });
              },
              [{ text, isHighlighted: false }]
            );
          return parts;
        }}
        isLoading={isSearching}
        emptyMessage={
          query
            ? `Tidak ada sekolah yang cocok untuk "${query}" (Mode: ${searchType})`
            : 'Mulai pencarian untuk melihat sekolah'
        }
      />

      {/* Additional Info */}
      {filteredSchools.length > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-800">
            ✓ Menampilkan <span className="font-semibold">{filteredSchools.length}</span> dari{' '}
            <span className="font-semibold">{totalSchools}</span> sekolah
          </p>
        </div>
      )}
    </div>
  );
}
