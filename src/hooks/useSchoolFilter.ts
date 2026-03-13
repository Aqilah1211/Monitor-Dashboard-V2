/**
 * School Filter Hook
 * Handles search and filter logic for school data
 */

import { useState, useCallback, useMemo } from 'react';
import { SchoolData } from '../types';

export interface SchoolFilter {
  search: string;
  startDate?: Date | null;
  endDate?: Date | null;
  province?: string;
}

export interface FilterResults {
  filtered: SchoolData[];
  total: number;
  resultCount: number;
  filters: SchoolFilter;
  setFilters: (filters: SchoolFilter) => void;
  updateSearch: (search: string) => void;
  updateDateRange: (start: Date | null, end: Date | null) => void;
  updateProvince: (province?: string) => void;
  resetFilters: () => void;
}

const DEFAULT_FILTER: SchoolFilter = {
  search: '',
  startDate: null,
  endDate: null,
  province: undefined
};

export function useSchoolFilter(data: SchoolData[]): FilterResults {
  const [filters, setFilters] = useState<SchoolFilter>(DEFAULT_FILTER);

  // Apply all filters
  const filtered = useMemo(() => {
    return data.filter((school) => {
      // Search filter (NPSN or Nama)
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          school.npsn.toLowerCase().includes(searchLower) ||
          school.nama.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Date range filter
      if (filters.startDate || filters.endDate) {
        const schoolDate = school.tanggal ? new Date(school.tanggal) : null;
        if (schoolDate) {
          if (filters.startDate && schoolDate < filters.startDate) return false;
          if (filters.endDate && schoolDate > filters.endDate) return false;
        }
      }

      // Province filter
      if (filters.province) {
        if (school.direktorat !== filters.province) return false;
      }

      return true;
    });
  }, [data, filters]);

  const updateSearch = useCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search }));
  }, []);

  const updateDateRange = useCallback((start: Date | null, end: Date | null) => {
    setFilters((prev) => ({ ...prev, startDate: start, endDate: end }));
  }, []);

  const updateProvince = useCallback((province?: string) => {
    setFilters((prev) => ({ ...prev, province }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTER);
  }, []);

  return {
    filtered,
    total: data.length,
    resultCount: filtered.length,
    filters,
    setFilters,
    updateSearch,
    updateDateRange,
    updateProvince,
    resetFilters
  };
}
