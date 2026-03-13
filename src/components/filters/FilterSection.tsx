/**
 * Filter Section Component
 * Combines search, date range, and province filters
 */

import { Search, X } from 'lucide-react';
import { SchoolFilter } from '../../hooks/useSchoolFilter';
import { PROVINCES } from '../../data/provinces';
import { useDebounce } from '../../hooks/useDebounce';

interface FilterSectionProps {
  filters: SchoolFilter;
  onSearchChange: (search: string) => void;
  onDateRangeChange: (start: Date | null, end: Date | null) => void;
  onProvinceChange: (province?: string) => void;
  onReset: () => void;
  resultCount: number;
  totalCount: number;
}

export function FilterSection({
  filters,
  onSearchChange,
  onDateRangeChange,
  onProvinceChange,
  onReset,
  resultCount,
  totalCount
}: FilterSectionProps) {
  // Debounce search input for performance
  const debouncedSearch = useDebounce(onSearchChange, 300);

  const handleSearchInput = (value: string) => {
    debouncedSearch(value);
  };

  const hasActiveFilters =
    filters.search || filters.startDate || filters.endDate || filters.province;

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 mb-6 shadow-sm">
      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari berdasarkan NPSN atau Nama Sekolah..."
            defaultValue={filters.search}
            onChange={(e) => handleSearchInput(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
      </div>

      {/* Date Range and Province Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Start Date */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Dari Tanggal
          </label>
          <input
            type="date"
            value={
              filters.startDate
                ? filters.startDate.toISOString().split('T')[0]
                : ''
            }
            onChange={(e) => {
              const start = e.target.value ? new Date(e.target.value) : null;
              onDateRangeChange(start, filters.endDate || null);
            }}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        {/* End Date */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Sampai Tanggal
          </label>
          <input
            type="date"
            value={
              filters.endDate
                ? filters.endDate.toISOString().split('T')[0]
                : ''
            }
            onChange={(e) => {
              const end = e.target.value ? new Date(e.target.value) : null;
              onDateRangeChange(filters.startDate || null, end);
            }}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        {/* Province Filter */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Provinsi
          </label>
          <select
            value={filters.province || ''}
            onChange={(e) => onProvinceChange(e.target.value || undefined)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="">Semua Provinsi</option>
            {PROVINCES.map((province) => (
              <option key={province.id} value={province.name}>
                {province.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Filter Info and Reset Button */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-600">
          {hasActiveFilters && (
            <span>
              Menampilkan <span className="font-bold text-blue-600">{resultCount}</span> dari{' '}
              <span className="font-bold text-blue-600">{totalCount}</span> sekolah
            </span>
          )}
          {!hasActiveFilters && (
            <span>
              Total <span className="font-bold text-slate-700">{totalCount}</span> sekolah
            </span>
          )}
        </div>

        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-3 py-1 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
            Reset Filter
          </button>
        )}
      </div>
    </div>
  );
}
