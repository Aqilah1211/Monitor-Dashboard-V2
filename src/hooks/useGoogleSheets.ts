import { useCallback } from 'react';
import { GoogleSheets } from '../lib/google-sheets';
import { SchoolData, ProcessedData } from '../types';
import {
  detectColumnMapping,
  validateRowLength,
  getRowValue,
  getColumnStats,
  ColumnMapping
} from '../lib/columnDetector';

// Fallback for initial state (will be updated based on header detection)
let COLUMN_MAP: ColumnMapping = {
  NPSN: 3,
  NAMA: 8,
  DIREKTORAT: 1,
  TANGGAL: 15,
  STATUS: 17,
  KENDALA: 18
};

export function useGoogleSheets() {
  const normalizeStatus = (status: string | undefined): string => {
    return (status || '').toLowerCase().trim();
  };

  /**
   * Helper: Check if item is installed
   */
  const isItemInstalled = (status: string): boolean => {
    const normalized = normalizeStatus(status);
    return normalized.includes('selesai') || normalized.includes('terpasang');
  };

  /**
   * Helper: Check if item has trouble
   */
  const itemHasTrouble = (kendala: string): boolean => {
    return (kendala || '').trim().length > 0;
  };

  /**
   * Helper: Check if item is in progress
   */
  const isItemInProgress = (status: string): boolean => {
    const normalized = normalizeStatus(status);
    return normalized.includes('proses') || normalized.includes('proses instalasi');
  };

  const transformRow = (row: string[], rowIndex: number, columnMap: ColumnMapping): SchoolData | null => {
    // ✅ Validate row has required columns before processing
    if (!validateRowLength(row, columnMap, rowIndex)) {
      if (rowIndex === 1) {
        console.warn('⚠️  First data row validation failed - checking column mapping');
      }
      return null;
    }

    // ✅ Safely extract values using helper
    const npsn = getRowValue(row, columnMap.NPSN);
    const nama = getRowValue(row, columnMap.NAMA);
    const direktorat = getRowValue(row, columnMap.DIREKTORAT);
    const tanggal = getRowValue(row, columnMap.TANGGAL);
    const status = getRowValue(row, columnMap.STATUS);
    const kendala = getRowValue(row, columnMap.KENDALA);

    // Skip rows with empty NPSN (likely empty rows or notes)
    if (!npsn) {
      return null;
    }

    return {
      id: rowIndex,
      npsn,
      nama,
      direktorat,
      tanggal,
      status: normalizeStatus(status),
      kendala,
      raw: row
    };
  };

  const categorizeItems = (items: SchoolData[]) => {
    return items.reduce((acc, item) => {
      // ✅ Use robust status checking with proper null/undefined handling
      const kendala = item.kendala?.trim() || '';

      // Determine primary status
      const installed = isItemInstalled(item.status);
      const inProgress = isItemInProgress(item.status);
      const trouble = itemHasTrouble(kendala);

      // Categorize item (can appear in multiple categories)
      if (installed) {
        acc.installed.push(item);
      }

      if (trouble) {
        acc.trouble.push(item);
      }

      // Pending is neither installed nor in progress
      if (!installed && !inProgress) {
        acc.pending.push(item);
      }

      // Log any edge cases for debugging
      if (installed && trouble) {
        console.debug(`[Categorize] Item installed but has trouble (NPSN: ${item.npsn}):`, kendala);
      }

      if (!installed && !inProgress && !trouble) {
        console.debug(`[Categorize] Item is pending (NPSN: ${item.npsn})`);
      }

      return acc;
    }, {
      installed: [] as SchoolData[],
      pending: [] as SchoolData[],
      trouble: [] as SchoolData[]
    });
  };

  const processRows = useCallback((rows: string[][]): ProcessedData => {
    console.log('🔄 Processing:', rows.length, 'total rows');
    
    if (rows.length === 0) {
      console.warn('⚠️  Empty data - no rows to process');
      return { all: [], installed: [], pending: [], trouble: [] };
    }

    // ✅ DYNAMIC COLUMN DETECTION: Detect columns from first row
    const headerRow = rows[0];
    const detectedMap = detectColumnMapping(headerRow);
    
    // Update the global COLUMN_MAP with detected values
    COLUMN_MAP = detectedMap;
    
    // Get statistics for debugging
    const stats = getColumnStats(rows);
    console.log('📊 Column statistics:', stats);

    // Transform data rows (skip header at rows[0])
    const items = rows
      .slice(1)
      .map((row, idx) => transformRow(row, idx + 1, COLUMN_MAP))
      .filter((item): item is SchoolData => item !== null);

    console.log('✅ Successfully transformed:', items.length, 'items');

    const categorized = categorizeItems(items);
    console.log('📊 Categorization:', {
      all: items.length,
      installed: categorized.installed.length,
      pending: categorized.pending.length,
      trouble: categorized.trouble.length
    });

    return {
      all: items,
      ...categorized
    };
  }, []);

  const fetchData = useCallback(
    async (spreadsheetId: string, sheetName: string) => {
      const rows = await GoogleSheets.fetchSheetData<string[]>(spreadsheetId, sheetName);
      return processRows(rows);
    },
    [processRows]
  );

  return {
    fetchData,
    extractSheetIdFromUrl: GoogleSheets.extractSheetIdFromUrl
  };
}
