/**
 * Data Caching Hook
 * Menyimpan data di localStorage untuk performa loading cepat
 */

import { useCallback } from 'react';
import { ProcessedData } from '../types';

interface CacheData {
  data: ProcessedData;
  timestamp: number;
  version: number;
}

const CACHE_KEY = 'ifp_data_cache';
const CACHE_VERSION = 1;
const CACHE_TTL = 30 * 60 * 1000; // 30 menit (dalam ms)
const STALE_AFTER = 60 * 1000; // 1 menit (data dianggap expired untuk refresh)

export function useDataCache() {
  /**
   * Ambil cached data dari localStorage
   */
  const getCachedData = useCallback((): ProcessedData | null => {
    try {
      const stored = localStorage.getItem(CACHE_KEY);
      if (!stored) return null;

      const cache: CacheData = JSON.parse(stored);
      const age = Date.now() - cache.timestamp;

      // Jika cache sudah terlalu tua (30 menit), buang
      if (age > CACHE_TTL) {
        localStorage.removeItem(CACHE_KEY);
        return null;
      }

      // Jika version berbeda, buang
      if (cache.version !== CACHE_VERSION) {
        localStorage.removeItem(CACHE_KEY);
        return null;
      }

      return cache.data;
    } catch (error) {
      console.warn('[Cache] Failed to load cached data:', error);
      return null;
    }
  }, []);

  /**
   * Simpan data ke localStorage
   */
  const setCachedData = useCallback((data: ProcessedData): void => {
    try {
      const cache: CacheData = {
        data,
        timestamp: Date.now(),
        version: CACHE_VERSION
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    } catch (error) {
      console.warn('[Cache] Failed to save cache:', error);
    }
  }, []);

  /**
   * Cek apakah cache masih "fresh" (tidak perlu refresh)
   * Return false jika cache sudah tua (> 1 menit)
   */
  const isCacheFresh = useCallback((): boolean => {
    try {
      const stored = localStorage.getItem(CACHE_KEY);
      if (!stored) return false;

      const cache: CacheData = JSON.parse(stored);
      const age = Date.now() - cache.timestamp;

      // True jika cache masih < 1 menit
      return age < STALE_AFTER;
    } catch {
      return false;
    }
  }, []);

  /**
   * Hapus cache
   */
  const clearCache = useCallback((): void => {
    try {
      localStorage.removeItem(CACHE_KEY);
    } catch (error) {
      console.warn('[Cache] Failed to clear cache:', error);
    }
  }, []);

  return {
    getCachedData,
    setCachedData,
    isCacheFresh,
    clearCache,
    CACHE_TTL,
    STALE_AFTER
  };
}
