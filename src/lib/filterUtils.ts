/**
 * Filter Utility Functions
 * Untuk date handling dan filtering operations
 */

import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

/**
 * Date Range Type
 */
export interface DateRange {
  start: Date;
  end: Date;
}

/**
 * Filter State Type
 */
export interface FilterState {
  dateRange: DateRange | null;
  provinces: string[];
  status: string[];
  searchText: string;
}

/**
 * Predefined date ranges
 */
export type DateRangeType = 'today' | 'yesterday' | 'thisWeek' | 'lastWeek' | 'thisMonth' | 'lastMonth' | 'thisYear' | 'custom';

/**
 * Get date range based on type
 */
export function getDateRange(type: DateRangeType, customStart?: Date, customEnd?: Date): DateRange {
  const today = new Date();

  switch (type) {
    case 'today':
      return {
        start: startOfDay(today),
        end: endOfDay(today)
      };

    case 'yesterday':
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      return {
        start: startOfDay(yesterday),
        end: endOfDay(yesterday)
      };

    case 'thisWeek':
      return {
        start: startOfWeek(today, { locale: idLocale, weekStartsOn: 1 }),
        end: endOfWeek(today, { locale: idLocale, weekStartsOn: 1 })
      };

    case 'lastWeek':
      const lastWeekDate = new Date(today);
      lastWeekDate.setDate(lastWeekDate.getDate() - 7);
      return {
        start: startOfWeek(lastWeekDate, { locale: idLocale, weekStartsOn: 1 }),
        end: endOfWeek(lastWeekDate, { locale: idLocale, weekStartsOn: 1 })
      };

    case 'thisMonth':
      return {
        start: startOfMonth(today),
        end: endOfMonth(today)
      };

    case 'lastMonth':
      const lastMonthDate = new Date(today);
      lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
      return {
        start: startOfMonth(lastMonthDate),
        end: endOfMonth(lastMonthDate)
      };

    case 'thisYear':
      return {
        start: startOfYear(today),
        end: endOfYear(today)
      };

    case 'custom':
      if (!customStart || !customEnd) {
        throw new Error('Custom date range requires both start and end dates');
      }
      return {
        start: startOfDay(customStart),
        end: endOfDay(customEnd)
      };

    default:
      return {
        start: startOfDay(today),
        end: endOfDay(today)
      };
  }
}

/**
 * Format date untuk display (Indonesia locale)
 */
export function formatDateID(date: Date): string {
  return format(date, 'dd MMMM yyyy', { locale: idLocale });
}

/**
 * Format date range untuk display
 */
export function formatDateRangeID(range: DateRange): string {
  if (range.start.getTime() === range.end.getTime()) {
    return formatDateID(range.start);
  }
  return `${formatDateID(range.start)} - ${formatDateID(range.end)}`;
}

/**
 * Check if date is in range
 */
export function isDateInRange(date: Date | string, range: DateRange): boolean {
  const checkDate = typeof date === 'string' ? new Date(date) : date;
  return checkDate >= range.start && checkDate <= range.end;
}

/**
 * Get days difference
 */
export function getDaysDifference(start: Date, end: Date): number {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.round((end.getTime() - start.getTime()) / msPerDay) + 1;
}

/**
 * Format date untuk API/storage (ISO string)
 */
export function formatDateISO(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Parse date dari string
 */
export function parseDate(dateString: string): Date {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date: ${dateString}`);
  }
  return date;
}

/**
 * Status options untuk filtering
 */
export const STATUS_OPTIONS = [
  { id: 'terpasang', label: 'Terpasang', color: 'bg-green-100 text-green-800', icon: '✅' },
  { id: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: '⏳' },
  { id: 'kendala', label: 'Ada Kendala', color: 'bg-red-100 text-red-800', icon: '⚠️' },
  { id: 'proses', label: 'Dalam Proses', color: 'bg-blue-100 text-blue-800', icon: '🔄' },
];

/**
 * Get status label
 */
export function getStatusLabel(statusId: string): string {
  const option = STATUS_OPTIONS.find((o) => o.id === statusId);
  return option?.label || statusId;
}

/**
 * Get status color
 */
export function getStatusColor(statusId: string): string {
  const option = STATUS_OPTIONS.find((o) => o.id === statusId);
  return option?.color || '';
}

/**
 * Normalize filter state (remove empty values)
 */
export function normalizeFilterState(state: FilterState): FilterState {
  return {
    dateRange: state.dateRange,
    provinces: state.provinces.filter((p) => p),
    status: state.status.filter((s) => s),
    searchText: state.searchText.trim()
  };
}

/**
 * Check if filter is active (has any filter applied)
 */
export function isFilterActive(state: FilterState): boolean {
  return (
    state.dateRange !== null ||
    state.provinces.length > 0 ||
    state.status.length > 0 ||
    state.searchText.length > 0
  );
}

/**
 * Get filter summary untuk display
 */
export function getFilterSummary(state: FilterState): string[] {
  const summary: string[] = [];

  if (state.dateRange) {
    summary.push(`📅 ${formatDateRangeID(state.dateRange)}`);
  }

  if (state.provinces.length > 0) {
    const count = state.provinces.length;
    summary.push(`📍 ${count} provinsi`);
  }

  if (state.status.length > 0) {
    const labels = state.status.map((s) => getStatusLabel(s));
    summary.push(`📊 ${labels.join(', ')}`);
  }

  if (state.searchText) {
    summary.push(`🔍 "${state.searchText}"`);
  }

  return summary;
}

/**
 * Reset filter to default state
 */
export function resetFilter(): FilterState {
  return {
    dateRange: null,
    provinces: [],
    status: [],
    searchText: ''
  };
}

/**
 * Default filter state
 */
export const DEFAULT_FILTER_STATE: FilterState = {
  dateRange: null,
  provinces: [],
  status: [],
  searchText: ''
};
