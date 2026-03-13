/**
 * Custom Hook: usePagination
 * Manage pagination state and compute paginated data
 */

import { useState, useCallback, useMemo } from 'react';

export interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalItems: number;
}

export interface PaginationResult<T> {
  data: T[];
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  goToPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  setPageSize: (size: number) => void;
  reset: () => void;
}

/**
 * Pagination hook for managing paginated data
 * 
 * @param items - Array of items to paginate
 * @param initialPageSize - Items per page (default: 50)
 * @returns Pagination state and controls
 */
export function usePagination<T>(
  items: T[],
  initialPageSize: number = 50
): PaginationResult<T> {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSizeState] = useState(initialPageSize);

  // Calculate total pages
  const totalPages = useMemo(
    () => Math.ceil(items.length / pageSize),
    [items.length, pageSize]
  );

  // Get paginated data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return items.slice(startIndex, endIndex);
  }, [items, currentPage, pageSize]);

  // Navigation functions
  const goToPage = useCallback((page: number) => {
    const pageNum = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(pageNum);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [totalPages]);

  const nextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  const previousPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  const setPageSize = useCallback((size: number) => {
    if (size > 0) {
      setPageSizeState(size);
      setCurrentPage(1); // Reset to first page when page size changes
    }
  }, []);

  const reset = useCallback(() => {
    setCurrentPage(1);
  }, []);

  return {
    data: paginatedData,
    currentPage,
    pageSize,
    totalItems: items.length,
    totalPages,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
    goToPage,
    nextPage,
    previousPage,
    setPageSize,
    reset
  };
}
