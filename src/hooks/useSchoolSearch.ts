/**
 * useSchoolSearch Hook
 * Custom hook untuk mengelola logic pencarian sekolah dengan debounce, caching, dan optimisasi performa
 */

import { useCallback, useRef, useState } from 'react';
import { logger } from '../utils/logger';
import { School, SearchMode } from '../types/school';

const DEBOUNCE_DELAY = 300;
const MAX_CACHE_SIZE = 50;
const SEARCH_HISTORY_MAX = 20;

/**
 * useSchoolSearch Hook Props
 */
export interface UseSchoolSearchProps {
  schools: School[];
  debounceMs?: number;
}

/**
 * useSchoolSearch Hook Return Type
 */
export interface UseSchoolSearchReturn {
  // State
  query: string;
  searchType: SearchMode;
  filteredSchools: School[];
  isSearching: boolean;
  hasResults: boolean;
  resultCount: number;

  // Actions
  setQuery: (query: string) => void;
  setSearchType: (type: SearchMode) => void;
  handleSearch: (query: string, type: SearchMode) => void;
  clearSearch: () => void;
  resetFilters: () => void;

  // Derived
  searchSummary: string;
  isEmpty: boolean;
}

/**
 * Custom hook untuk school search functionality
 */
export function useSchoolSearch({
  schools,
  debounceMs = DEBOUNCE_DELAY,
}: UseSchoolSearchProps): UseSchoolSearchReturn {
  // State untuk query dan filter
  const [query, setQuery] = useState<string>('');
  const [searchType, setSearchType] = useState<SearchMode>('all');
  const [filteredSchools, setFilteredSchools] = useState<School[]>(schools);
  const [isSearching, setIsSearching] = useState(false);

  // Cache untuk hasil pencarian
  const cacheRef = useRef<Map<string, School[]>>(new Map());
  const searchHistoryRef = useRef<Array<{ query: string; timestamp: Date; count: number }>>([]);

  // Debounce timer
  const debounceTimerRef = useRef<NodeJS.Timeout>();
  const searchStartTimeRef = useRef<number>(0);

  /**
   * Generate cache key dari query dan filter
   */
  const generateCacheKey = useCallback(
    (q: string, type: SearchMode): string => {
      return `${q.toLowerCase()}:${type}`;
    },
    []
  );

  /**
   * Normalize text untuk pencarian (case-insensitive, remove diacritics)
   */
  const normalizeText = useCallback((text: string): string => {
    return text
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, ''); // Remove diacritics
  }, []);

  /**
   * Check apakah text cocok dengan query
   */
  const matchesQuery = useCallback(
    (text: string, query: string): boolean => {
      const normalizedText = normalizeText(text);
      const normalizedQuery = normalizeText(query);
      return normalizedText.includes(normalizedQuery);
    },
    [normalizeText]
  );

  /**
   * Perform actual search logic
   */
  const performSearch = useCallback(
    (data: School[], q: string, type: SearchMode): School[] => {
      if (!q.trim()) {
        return data;
      }

      const startTime = performance.now();

      try {
        const filtered = data.filter((school) => {
          switch (type) {
            case 'npsn':
              return matchesQuery(school.npsn, q);
            case 'name':
              return matchesQuery(school.schoolName || school.nama || '', q);
            case 'all':
            default:
              return (
                matchesQuery(school.npsn, q) ||
                matchesQuery(school.schoolName || school.nama || '', q) ||
                matchesQuery(school.province || '', q) ||
                matchesQuery(school.city || '', q) ||
                matchesQuery(school.address || '', q)
              );
          }
        });

        const searchTime = performance.now() - startTime;

        logger.debug('School search performed', {
          query: q,
          searchType: type,
          resultsCount: filtered.length,
          searchTime: `${searchTime.toFixed(2)}ms`,
        });

        // Add to search history
        searchHistoryRef.current = [
          { query: q, timestamp: new Date(), count: filtered.length },
          ...searchHistoryRef.current,
        ].slice(0, SEARCH_HISTORY_MAX);

        return filtered;
      } catch (error) {
        logger.error('School search error', { query: q, error });
        throw error;
      }
    },
    [matchesQuery]
  );

  /**
   * Debounced search handler
   */
  const handleSearch = useCallback(
    (q: string, type: SearchMode) => {
      // Clear existing timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      setQuery(q);
      setSearchType(type);
      setIsSearching(true);
      searchStartTimeRef.current = performance.now();

      // Set debounce timer
      debounceTimerRef.current = setTimeout(() => {
        try {
          const cacheKey = generateCacheKey(q, type);

          // Check cache
          if (cacheRef.current.has(cacheKey)) {
            const cachedResult = cacheRef.current.get(cacheKey)!;
            setFilteredSchools(cachedResult);
            setIsSearching(false);
            logger.debug('School search: cache hit', { cacheKey });
            return;
          }

          // Perform search
          const results = performSearch(schools, q, type);
          setFilteredSchools(results);

          // Cache result
          if (cacheRef.current.size >= MAX_CACHE_SIZE) {
            const firstKey = cacheRef.current.keys().next().value;
            if (firstKey) {
              cacheRef.current.delete(firstKey);
            }
          }
          cacheRef.current.set(cacheKey, results);

          setIsSearching(false);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Search failed';
          setIsSearching(false);
          logger.error('School search failed', { error: errorMessage });
        }
      }, debounceMs);
    },
    [schools, performSearch, generateCacheKey, debounceMs]
  );

  /**
   * Clear search
   */
  const clearSearch = useCallback(() => {
    setQuery('');
    setFilteredSchools(schools);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    logger.debug('School search cleared');
  }, [schools]);

  /**
   * Reset filters (same as clearSearch)
   */
  const resetFilters = useCallback(() => {
    clearSearch();
    setSearchType('all');
    logger.debug('School filters reset');
  }, [clearSearch]);

  /**
   * Computed properties
   */
  const hasResults = filteredSchools.length > 0 && query.trim().length > 0;
  const resultCount = filteredSchools.length;
  const isEmpty = query.trim().length === 0;
  const searchSummary = isEmpty
    ? `Total ${schools.length} sekolah`
    : `Ditemukan ${resultCount} dari ${schools.length} sekolah`;

  return {
    // State
    query,
    searchType,
    filteredSchools,
    isSearching,
    hasResults,
    resultCount,

    // Actions
    setQuery,
    setSearchType,
    handleSearch,
    clearSearch,
    resetFilters,

    // Derived
    searchSummary,
    isEmpty,
  };
}
