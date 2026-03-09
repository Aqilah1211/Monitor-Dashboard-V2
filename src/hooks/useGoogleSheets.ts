import { useCallback } from 'react';
import { GoogleSheets } from '../lib/google-sheets';
import { SchoolData, ProcessedData } from '../types';

const COLUMN_MAP = {
  NPSN: 3,
  NAMA: 8,
  DIREKTORAT: 1,
  TANGGAL: 15,
  STATUS: 17,
  KENDALA: 18
} as const;

export function useGoogleSheets() {
  const normalizeStatus = (status: string | undefined): string => {
    return (status || '').toLowerCase().trim();
  };

  const transformRow = (row: string[], rowIndex: number): SchoolData | null => {
    if (!row || row.length <= COLUMN_MAP.NPSN) {
      if (rowIndex === 1) {
        console.warn('⚠️  Row tidak valid di index', rowIndex, '- length:', row?.length || 0);
        console.warn('⚠️  Cek COLUMN_MAP - kemungkinan struktur spreadsheet berbeda');
      }
      return null;
    }

    return {
      id: rowIndex,
      npsn: row[COLUMN_MAP.NPSN] || '',
      nama: row[COLUMN_MAP.NAMA] || '',
      direktorat: row[COLUMN_MAP.DIREKTORAT] || '',
      tanggal: row[COLUMN_MAP.TANGGAL] || '',
      status: normalizeStatus(row[COLUMN_MAP.STATUS]),
      kendala: (row[COLUMN_MAP.KENDALA] || '').trim(),
      raw: row
    };
  };

  const categorizeItems = (items: SchoolData[]) => {
    return items.reduce((acc, item) => {
      const isInstalled = item.status.includes('selesai');
      const hasTrouble = item.kendala.length > 2;

      if (isInstalled) {
        acc.installed.push(item);
      } else {
        acc.pending.push(item);
      }

      if (hasTrouble) {
        acc.trouble.push(item);
      }

      return acc;
    }, { installed: [] as SchoolData[], pending: [] as SchoolData[], trouble: [] as SchoolData[] });
  };

  const processRows = useCallback((rows: string[][]): ProcessedData => {
    console.log('🔄 Processing:', rows.length, 'total rows');
    console.log('📋 Column positions:', COLUMN_MAP);
    
    const items = rows
      .slice(1)
      .map((row, idx) => transformRow(row, idx + 1))
      .filter((item): item is SchoolData => item !== null);

    console.log('✅ Berhasil di-transform:', items.length, 'items');

    const categorized = categorizeItems(items);
    console.log('📊 Kategorisasi:', {
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
