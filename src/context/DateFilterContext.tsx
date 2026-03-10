/**
 * DateFilterContext - Context untuk mengelola filter tanggal dashboard
 * Menyediakan state dan fungsi untuk periode dan custom date range
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getDateRange } from '@/utils/dateUtils';

/**
 * Interface untuk DateFilterContext
 */
export interface DateFilterContextType {
  startDate: Date;
  endDate: Date;
  period: 'today' | 'week' | 'month' | 'custom';
  setPeriod: (period: 'today' | 'week' | 'month' | 'custom') => void;
  setCustomRange: (start: Date, end: Date) => void;
  reset: () => void;
}

/**
 * Default value untuk context
 */
const defaultValue: DateFilterContextType = {
  startDate: new Date(),
  endDate: new Date(),
  period: 'week',
  setPeriod: () => {},
  setCustomRange: () => {},
  reset: () => {},
};

/**
 * Create DateFilterContext
 */
const DateFilterContext = createContext<DateFilterContextType>(defaultValue);

/**
 * Interface untuk DateFilterProvider props
 */
interface DateFilterProviderProps {
  children: ReactNode;
}

/**
 * DateFilterProvider Component
 * Menyediakan context untuk filter tanggal ke seluruh aplikasi
 *
 * Usage:
 * <DateFilterProvider>
 *   <YourComponent />
 * </DateFilterProvider>
 */
export function DateFilterProvider({
  children,
}: DateFilterProviderProps) {
  // Initialize dengan periode 'week' (minggu ini)
  const initialRange = getDateRange('week');

  const [period, setPeriodState] = useState<'today' | 'week' | 'month' | 'custom'>(
    'week'
  );
  const [startDate, setStartDate] = useState<Date>(initialRange.start);
  const [endDate, setEndDate] = useState<Date>(initialRange.end);

  /**
   * Handle perubahan periode
   * Automatically update start dan end date berdasarkan periode
   */
  const handleSetPeriod = (newPeriod: 'today' | 'week' | 'month' | 'custom') => {
    setPeriodState(newPeriod);

    // Jika bukan custom, dapatkan range otomatis
    if (newPeriod !== 'custom') {
      const newRange = getDateRange(newPeriod);
      setStartDate(newRange.start);
      setEndDate(newRange.end);
    }
  };

  /**
   * Handle custom date range
   */
  const handleSetCustomRange = (start: Date, end: Date) => {
    // Validasi bahwa start tidak lebih besar dari end
    const validStart = new Date(start);
    const validEnd = new Date(end);

    if (validStart > validEnd) {
      console.warn(
        'Start date tidak boleh lebih besar dari end date. Swap values.'
      );
      setStartDate(validEnd);
      setEndDate(validStart);
    } else {
      setStartDate(validStart);
      setEndDate(validEnd);
    }

    // Set periode ke 'custom'
    setPeriodState('custom');
  };

  /**
   * Reset ke nilai default (periode week, minggu ini)
   */
  const handleReset = () => {
    const defaultRange = getDateRange('week');
    setStartDate(defaultRange.start);
    setEndDate(defaultRange.end);
    setPeriodState('week');
  };

  /**
   * Effect untuk update range ketika periode berubah
   * (bukan custom)
   */
  useEffect(() => {
    if (period !== 'custom') {
      const newRange = getDateRange(period);
      setStartDate(newRange.start);
      setEndDate(newRange.end);
    }
  }, [period]);

  const value: DateFilterContextType = {
    startDate,
    endDate,
    period,
    setPeriod: handleSetPeriod,
    setCustomRange: handleSetCustomRange,
    reset: handleReset,
  };

  return (
    <DateFilterContext.Provider value={value}>
      {children}
    </DateFilterContext.Provider>
  );
}

/**
 * Custom Hook untuk mengakses DateFilterContext
 * Throw error jika digunakan diluar DateFilterProvider
 *
 * Usage:
 * const { startDate, endDate, period, setPeriod } = useDateFilter();
 */
export function useDateFilter(): DateFilterContextType {
  const context = useContext(DateFilterContext);

  if (context === undefined) {
    throw new Error(
      'useDateFilter must be used within a DateFilterProvider. ' +
      'Make sure to wrap your component with <DateFilterProvider>'
    );
  }

  return context;
}

export default DateFilterContext;
