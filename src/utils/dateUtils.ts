/**
 * DateUtils - Utility functions untuk penanganan tanggal dengan Indonesia locale
 * Menggunakan date-fns library dengan timezone awareness
 */

import {
  format,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  isPast,
  isFuture,
} from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

/**
 * Format tanggal ke format "DD MMMM YYYY" (Indonesia)
 * Contoh: 10 Maret 2025
 *
 * @param date - Tanggal yang akan diformat
 * @returns String tanggal terformat
 */
export function formatDateID(date: Date): string {
  try {
    return format(new Date(date), 'dd MMMM yyyy', { locale: idLocale });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Tanggal tidak valid';
  }
}

/**
 * Format tanggal dan waktu ke format "DD MMM YYYY, HH:mm" (Indonesia)
 * Contoh: 10 Mar 2025, 14:30
 *
 * @param date - Tanggal yang akan diformat
 * @returns String tanggal dan waktu terformat
 */
export function formatDateTimeID(date: Date): string {
  try {
    return format(new Date(date), 'dd MMM yyyy, HH:mm', { locale: idLocale });
  } catch (error) {
    console.error('Error formatting datetime:', error);
    return 'Tanggal tidak valid';
  }
}

/**
 * Dapatkan waktu relatif dari sekarang (Indonesia)
 * Contoh: "baru saja", "5 menit yang lalu", "2 hari yang lalu"
 *
 * @param date - Tanggal referensi
 * @returns String waktu relatif
 */
export function getRelativeTime(date: Date): string {
  try {
    const now = new Date();
    const dateObj = new Date(date);

    // Handle future dates
    if (isFuture(dateObj)) {
      const minutesDiff = differenceInMinutes(dateObj, now);
      const hoursDiff = differenceInHours(dateObj, now);
      const daysDiff = differenceInDays(dateObj, now);

      if (minutesDiff < 1) return 'dalam beberapa detik';
      if (minutesDiff < 60) return `dalam ${minutesDiff} menit`;
      if (hoursDiff < 24) return `dalam ${hoursDiff} jam`;
      if (daysDiff < 7) return `dalam ${daysDiff} hari`;
      if (daysDiff < 30) return `dalam ${Math.floor(daysDiff / 7)} minggu`;
      return `dalam ${Math.floor(daysDiff / 30)} bulan`;
    }

    // Handle past dates
    if (isPast(dateObj)) {
      const minutesDiff = differenceInMinutes(now, dateObj);
      const hoursDiff = differenceInHours(now, dateObj);
      const daysDiff = differenceInDays(now, dateObj);

      if (minutesDiff < 1) return 'baru saja';
      if (minutesDiff < 60) return `${minutesDiff} menit yang lalu`;
      if (hoursDiff < 24) return `${hoursDiff} jam yang lalu`;
      if (daysDiff < 7) return `${daysDiff} hari yang lalu`;
      if (daysDiff < 30) return `${Math.floor(daysDiff / 7)} minggu yang lalu`;
      return `${Math.floor(daysDiff / 30)} bulan yang lalu`;
    }

    return 'hari ini';
  } catch (error) {
    console.error('Error calculating relative time:', error);
    return 'Waktu tidak valid';
  }
}

/**
 * Dapatkan range tanggal berdasarkan periode
 * Mengembalikan start dan end date dengan timezone awareness
 *
 * @param period - Periode: 'today', 'week', 'month', 'year'
 * @returns Object dengan properti start dan end (Date)
 */
export function getDateRange(
  period: 'today' | 'week' | 'month' | 'year'
): { start: Date; end: Date } {
  const today = new Date();

  switch (period) {
    case 'today':
      return {
        start: startOfDay(today),
        end: endOfDay(today),
      };

    case 'week':
      return {
        start: startOfWeek(today, { locale: idLocale, weekStartsOn: 0 }),
        end: endOfWeek(today, { locale: idLocale, weekStartsOn: 0 }),
      };

    case 'month':
      return {
        start: startOfMonth(today),
        end: endOfMonth(today),
      };

    case 'year':
      return {
        start: startOfYear(today),
        end: endOfYear(today),
      };

    default:
      return {
        start: startOfDay(today),
        end: endOfDay(today),
      };
  }
}

/**
 * Cek apakah suatu tanggal berada dalam range tertentu
 * Inclusive di kedua sisi
 *
 * @param date - Tanggal yang dicek
 * @param start - Tanggal awal range
 * @param end - Tanggal akhir range
 * @returns Boolean - true jika date berada dalam range
 */
export function isDateInRange(date: Date, start: Date, end: Date): boolean {
  try {
    const dateObj = new Date(date);
    const startObj = new Date(start);
    const endObj = new Date(end);

    // Normalize to start of day for comparison
    dateObj.setHours(0, 0, 0, 0);
    startObj.setHours(0, 0, 0, 0);
    endObj.setHours(0, 0, 0, 0);

    return dateObj >= startObj && dateObj <= endObj;
  } catch (error) {
    console.error('Error checking date in range:', error);
    return false;
  }
}

/**
 * Hitung perbedaan hari antara dua tanggal
 * Berikan nilai negatif jika end < start
 *
 * @param start - Tanggal awal
 * @param end - Tanggal akhir
 * @returns Jumlah hari perbedaan
 */
export function getDaysDifference(start: Date, end: Date): number {
  try {
    const startObj = new Date(start);
    const endObj = new Date(end);

    // Normalize to start of day for accurate calculation
    startObj.setHours(0, 0, 0, 0);
    endObj.setHours(0, 0, 0, 0);

    return differenceInDays(endObj, startObj);
  } catch (error) {
    console.error('Error calculating days difference:', error);
    return 0;
  }
}

/**
 * Dapatkan informasi lengkap tanggal (Indonesia)
 * Berguna untuk debug dan logging
 *
 * @param date - Tanggal yang dianalisa
 * @returns Object dengan berbagai format tanggal
 */
export function getDateInfo(date: Date) {
  try {
    const dateObj = new Date(date);

    return {
      iso: dateObj.toISOString(),
      formatted: formatDateID(dateObj),
      formattedDateTime: formatDateTimeID(dateObj),
      relativeTime: getRelativeTime(dateObj),
      dayName: format(dateObj, 'EEEE', { locale: idLocale }),
      monthName: format(dateObj, 'MMMM', { locale: idLocale }),
      time: format(dateObj, 'HH:mm:ss', { locale: idLocale }),
      timestamp: dateObj.getTime(),
    };
  } catch (error) {
    console.error('Error getting date info:', error);
    return null;
  }
}

/**
 * Parse tanggal dari string dengan format tertentu
 * Mendukung format: "DD/MM/YYYY", "DD-MM-YYYY", "YYYY-MM-DD"
 *
 * @param dateString - String tanggal
 * @param format - Format string (default: "DD/MM/YYYY")
 * @returns Date object atau null jika parsing gagal
 */
export function parseLocalDate(
  dateString: string,
  dateFormat: string = 'dd/MM/yyyy'
): Date | null {
  try {
    if (!dateString || !dateString.trim()) {
      return null;
    }

    // Simple date parsing for Indonesian format
    if (dateFormat === 'dd/MM/yyyy' && dateString.includes('/')) {
      const parts = dateString.split('/');
      if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
        const year = parseInt(parts[2], 10);

        const date = new Date(year, month, day, 0, 0, 0, 0);

        // Validate the parsed date
        if (
          date.getFullYear() === year &&
          date.getMonth() === month &&
          date.getDate() === day
        ) {
          return date;
        }
      }
    }

    return null;
  } catch (error) {
    console.error('Error parsing local date:', error);
    return null;
  }
}

/**
 * Get current time dengan timezone aware
 *
 * @returns Current Date object
 */
export function getCurrentDateTime(): Date {
  return new Date();
}

/**
 * Check apakah date1 lebih awal dari date2
 *
 * @param date1 - Tanggal pertama
 * @param date2 - Tanggal kedua
 * @returns Boolean
 */
export function isDateBefore(date1: Date, date2: Date): boolean {
  try {
    return new Date(date1).getTime() < new Date(date2).getTime();
  } catch (error) {
    console.error('Error comparing dates:', error);
    return false;
  }
}

/**
 * Check apakah date1 lebih akhir dari date2
 *
 * @param date1 - Tanggal pertama
 * @param date2 - Tanggal kedua
 * @returns Boolean
 */
export function isDateAfter(date1: Date, date2: Date): boolean {
  try {
    return new Date(date1).getTime() > new Date(date2).getTime();
  } catch (error) {
    console.error('Error comparing dates:', error);
    return false;
  }
}

/**
 * Check apakah kedua tanggal sama (dalam hari yang sama)
 *
 * @param date1 - Tanggal pertama
 * @param date2 - Tanggal kedua
 * @returns Boolean
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  try {
    const d1 = new Date(date1);
    const d2 = new Date(date2);

    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  } catch (error) {
    console.error('Error comparing same day:', error);
    return false;
  }
}
