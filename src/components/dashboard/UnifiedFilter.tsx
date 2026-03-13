import React, { useMemo, useState, useCallback } from 'react';
import { Search, RotateCcw, Sliders } from 'lucide-react';
import { useUnifiedFilter } from '../../hooks/useUnifiedFilter';
import { useDebounce } from '../../hooks/useDebounce';
import DateRangePicker from '../filters/DateRangePicker';
import ProvinceMultiSelect from '../filters/ProvinceMultiSelect';
import StatusSelector from '../filters/StatusSelector';
import { getStatusLabel } from '../../lib/filterUtils';
import { PROVINCES } from '../../data/provinces';
import { logger } from '../../utils/logger';

/**
 * UnifiedFilter Component
 * Main container combining all filter sub-components:
 * - DateRangePicker: Date range selection
 * - ProvinceMultiSelect: Province filtering
 * - StatusSelector: Status filtering
 * - Search: Text-based search
 * 
 * Displays active filters and provides reset functionality
 */

export const UnifiedFilter: React.FC = () => {
  const filter = useUnifiedFilter();
  const [searchInput, setSearchInput] = useState(filter.getNormalizedState().searchText);
  const filterCount = filter.getDetailedFilterCount();
  const hasActiveFilters = filter.hasActiveFilters();

  /**
   * ✅ Debounced search handler - prevents excessive re-renders
   * Only calls setSearchText after 300ms of inactivity
   */
  const debouncedSearch = useDebounce(
    useCallback((value: string) => {
      try {
        filter.setSearchText(value);
        logger.debug('UnifiedFilter: Debounced search applied', { searchText: value });
      } catch (error) {
        logger.error('UnifiedFilter: Failed to update search text', { error });
      }
    }, [filter]),
    300 // 300ms debounce delay
  );

  /**
   * Handle search input change - updates local state immediately for responsive UI
   * Actual filter application is debounced
   */
  const handleSearchChange = (value: string) => {
    setSearchInput(value); // Immediate UI update
    debouncedSearch(value); // Debounced filter update
  };

  /**
   * Get display names for selected items
   */
  const getSelectedProvincesText = useMemo(() => {
    const selected = PROVINCES.filter((p) => filter.isProvinceSelected(p.id));
    if (selected.length === 0) return '';
    if (selected.length === 1) return selected[0].name;
    return `${selected[0].name} + ${selected.length - 1} lainnya`;
  }, [filterCount.provinces]);

  /**
   * Get selected statuses display
   */
  const getSelectedStatusesText = useMemo(() => {
    const statuses = filter.getNormalizedState().status;
    if (statuses.length === 0) return '';
    if (statuses.length === 1) return getStatusLabel(statuses[0]);
    return `${getStatusLabel(statuses[0])} + ${statuses.length - 1} lainnya`;
  }, [filterCount.status]);

  /**
   * Handle reset all filters
   */
  const handleResetAllFilters = () => {
    try {
      filter.resetAllFilters();
      logger.info('UnifiedFilter: All filters reset');
    } catch (error) {
      logger.error('UnifiedFilter: Failed to reset all filters', { error });
    }
  };

  return (
    <div className="w-full bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Sliders size={24} />
            <div>
              <h2 className="text-lg font-bold">Filter Data Instalasi</h2>
              <p className="text-sm text-blue-100">
                {hasActiveFilters
                  ? `${filterCount.total} filter aktif`
                  : 'Tidak ada filter aktif'}
              </p>
            </div>
          </div>
          {hasActiveFilters && (
            <button
              onClick={handleResetAllFilters}
              className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium text-sm"
            >
              <RotateCcw size={16} />
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Search Bar */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Pencarian
          </label>
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari berdasarkan nama, lokasi, atau keterangan..."
              value={searchInput}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            ✨ Pencarian akan diterapkan setelah 300ms (untuk performa lebih baik)
          </p>
        </div>

        {/* Filter Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Date Range Picker */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Rentang Tanggal
            </label>
            <DateRangePicker />
          </div>

          {/* Province Multi-Select */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Provinsi
            </label>
            <ProvinceMultiSelect />
          </div>

          {/* Status Selector */}
          <div className="md:col-span-1">
            {/* Empty space for alignment - StatusSelector is full-width below */}
          </div>
        </div>

        {/* Status Selector (Full Width) */}
        <StatusSelector />
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="px-6 py-4 bg-blue-50 border-t border-gray-200">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-700">Filter Aktif:</p>
            <div className="flex flex-wrap gap-2">
              {filter.dateRange && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  📅 {filter.dateRange.start.toLocaleDateString('id-ID')} - {filter.dateRange.end.toLocaleDateString('id-ID')}
                </span>
              )}
              {filterCount.provinces > 0 && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                  📍 {filterCount.provinces} Provinsi: {getSelectedProvincesText}
                </span>
              )}
              {filterCount.status > 0 && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                  ✓ {filterCount.status} Status: {getSelectedStatusesText}
                </span>
              )}
              {filter.getNormalizedState().searchText && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                  🔍 "{filter.getNormalizedState().searchText}"
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <p className="text-xs text-gray-600">
          💡 Semua filter disimpan otomatis ke localStorage dan akan diterapkan ketika data diambil dari spreadsheet
        </p>
      </div>
    </div>
  );
};

export default UnifiedFilter;
