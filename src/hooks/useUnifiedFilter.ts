/**
 * Custom Hook: useUnifiedFilter
 * Manage unified filter state untuk date, provinces, status, dan search
 */

import { useState, useCallback, useEffect } from 'react';
import { FilterState, DateRange, DEFAULT_FILTER_STATE, isFilterActive, normalizeFilterState } from '../lib/filterUtils';
import { logger } from '../utils/logger';

interface UseUnifiedFilterOptions {
  persistToLocalStorage?: boolean;
  storageKey?: string;
  onFilterChange?: (state: FilterState) => void;
}

export function useUnifiedFilter(options: UseUnifiedFilterOptions = {}) {
  const { persistToLocalStorage = true, storageKey = 'unifiedFilter', onFilterChange } = options;

  // Initialize state from localStorage if available
  const [filterState, setFilterState] = useState<FilterState>(() => {
    if (!persistToLocalStorage) {
      return DEFAULT_FILTER_STATE;
    }

    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        logger.debug('Loaded filter state from localStorage', { parsed }, 'useUnifiedFilter');
        return parsed;
      }
    } catch (err) {
      logger.warn('Failed to load filter state from localStorage', { error: err }, 'useUnifiedFilter');
    }

    return DEFAULT_FILTER_STATE;
  });

  // Save to localStorage whenever filter changes
  useEffect(() => {
    if (!persistToLocalStorage) return;

    try {
      localStorage.setItem(storageKey, JSON.stringify(filterState));
      logger.debug('Saved filter state to localStorage', { filterState }, 'useUnifiedFilter');
    } catch (err) {
      logger.warn('Failed to save filter state to localStorage', { error: err }, 'useUnifiedFilter');
    }
  }, [filterState, persistToLocalStorage, storageKey]);

  // Notify on filter change
  useEffect(() => {
    if (onFilterChange) {
      onFilterChange(filterState);
    }
  }, [filterState, onFilterChange]);

  /**
   * Set date range
   */
  const setDateRange = useCallback((range: DateRange | null) => {
    setFilterState((prev) => {
      const next = { ...prev, dateRange: range };
      logger.debug('Date range filter changed', { range }, 'useUnifiedFilter');
      return next;
    });
  }, []);

  /**
   * Add province(s)
   */
  const addProvinces = useCallback((provinces: string | string[]) => {
    setFilterState((prev) => {
      const toAdd = Array.isArray(provinces) ? provinces : [provinces];
      const updated = [...new Set([...prev.provinces, ...toAdd])];
      logger.debug('Added provinces to filter', { provinces: toAdd }, 'useUnifiedFilter');
      return { ...prev, provinces: updated };
    });
  }, []);

  /**
   * Remove province(s)
   */
  const removeProvinces = useCallback((provinces: string | string[]) => {
    setFilterState((prev) => {
      const toRemove = Array.isArray(provinces) ? provinces : [provinces];
      const updated = prev.provinces.filter((p) => !toRemove.includes(p));
      logger.debug('Removed provinces from filter', { provinces: toRemove }, 'useUnifiedFilter');
      return { ...prev, provinces: updated };
    });
  }, []);

  /**
   * Set province(s)
   */
  const setProvinces = useCallback((provinces: string[]) => {
    setFilterState((prev) => {
      logger.debug('Set provinces filter', { provinces }, 'useUnifiedFilter');
      return { ...prev, provinces };
    });
  }, []);

  /**
   * Check if province is selected
   */
  const isProvinceSelected = useCallback(
    (provinceId: string): boolean => {
      return filterState.provinces.includes(provinceId);
    },
    [filterState.provinces]
  );

  /**
   * Clear all provinces
   */
  const clearProvinces = useCallback(() => {
    setFilterState((prev) => {
      logger.debug('Cleared all provinces', {}, 'useUnifiedFilter');
      return { ...prev, provinces: [] };
    });
  }, []);

  /**
   * Add status filter
   */
  const addStatus = useCallback((status: string | string[]) => {
    setFilterState((prev) => {
      const toAdd = Array.isArray(status) ? status : [status];
      const updated = [...new Set([...prev.status, ...toAdd])];
      logger.debug('Added status to filter', { status: toAdd }, 'useUnifiedFilter');
      return { ...prev, status: updated };
    });
  }, []);

  /**
   * Remove status filter
   */
  const removeStatus = useCallback((status: string | string[]) => {
    setFilterState((prev) => {
      const toRemove = Array.isArray(status) ? status : [status];
      const updated = prev.status.filter((s) => !toRemove.includes(s));
      logger.debug('Removed status from filter', { status: toRemove }, 'useUnifiedFilter');
      return { ...prev, status: updated };
    });
  }, []);

  /**
   * Set status filter
   */
  const setStatus = useCallback((status: string[]) => {
    setFilterState((prev) => {
      logger.debug('Set status filter', { status }, 'useUnifiedFilter');
      return { ...prev, status };
    });
  }, []);

  /**
   * Check if status is selected
   */
  const isStatusSelected = useCallback(
    (statusId: string): boolean => {
      return filterState.status.includes(statusId);
    },
    [filterState.status]
  );

  /**
   * Clear all status filters
   */
  const clearStatus = useCallback(() => {
    setFilterState((prev) => {
      logger.debug('Cleared all status filters', {}, 'useUnifiedFilter');
      return { ...prev, status: [] };
    });
  }, []);

  /**
   * Set search text
   */
  const setSearchText = useCallback((text: string) => {
    setFilterState((prev) => {
      logger.debug('Search text filter changed', { text }, 'useUnifiedFilter');
      return { ...prev, searchText: text };
    });
  }, []);

  /**
   * Reset all filters
   */
  const resetAllFilters = useCallback(() => {
    setFilterState(DEFAULT_FILTER_STATE);
    logger.info('All filters reset to default', {}, 'useUnifiedFilter');
  }, []);

  /**
   * Reset specific filter type
   */
  const resetFilterType = useCallback((type: 'date' | 'provinces' | 'status' | 'search') => {
    setFilterState((prev) => {
      const next = { ...prev };
      switch (type) {
        case 'date':
          next.dateRange = null;
          break;
        case 'provinces':
          next.provinces = [];
          break;
        case 'status':
          next.status = [];
          break;
        case 'search':
          next.searchText = '';
          break;
      }
      logger.debug(`Reset ${type} filter`, {}, 'useUnifiedFilter');
      return next;
    });
  }, []);

  /**
   * Get filter count
   */
  const getFilterCount = useCallback((): number => {
    let count = 0;
    if (filterState.dateRange) count++;
    if (filterState.provinces.length > 0) count += filterState.provinces.length;
    if (filterState.status.length > 0) count += filterState.status.length;
    if (filterState.searchText) count++;
    return count;
  }, [filterState]);

  /**
   * Check if any filter is active
   */
  const hasActiveFilters = useCallback((): boolean => {
    return isFilterActive(filterState);
  }, [filterState]);

  /**
   * Get current filter state (normalized)
   */
  const getNormalizedState = useCallback((): FilterState => {
    return normalizeFilterState(filterState);
  }, [filterState]);

  /**
   * Set entire filter state at once
   */
  const setWholeState = useCallback((state: FilterState) => {
    setFilterState(state);
    logger.debug('Entire filter state updated', { state }, 'useUnifiedFilter');
  }, []);

  /**
   * Get detailed filter counts by type
   */
  const getDetailedFilterCount = useCallback(
    () => ({
      provinces: filterState.provinces.length,
      status: filterState.status.length,
      total: getFilterCount(),
    }),
    [filterState]
  );

  return {
    // State
    filterState,
    dateRange: filterState.dateRange,
    provinces: filterState.provinces,
    status: filterState.status,
    searchText: filterState.searchText,

    // Date methods
    setDateRange,

    // Province methods
    addProvinces,
    removeProvinces,
    setProvinces,
    clearProvinces,
    isProvinceSelected,

    // Status methods
    addStatus,
    removeStatus,
    setStatus,
    clearStatus,
    isStatusSelected,

    // Search methods
    setSearchText,

    // General methods
    resetAllFilters,
    resetFilterType,
    getFilterCount,
    getDetailedFilterCount,
    hasActiveFilters,
    getNormalizedState,
    setWholeState,
  };
}

/**
 * Type export for hook return value
 */
export type UseUnifiedFilterReturn = ReturnType<typeof useUnifiedFilter>;
