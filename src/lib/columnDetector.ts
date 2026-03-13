/**
 * Dynamic Google Sheets Column Detector
 * 
 * Maps spreadsheet columns dynamically based on header names
 * instead of relying on hard-coded indices
 */

export interface ColumnMapping {
  NPSN: number;
  NAMA: number;
  DIREKTORAT: number;
  TANGGAL: number;
  STATUS: number;
  KENDALA: number;
}

/**
 * Keywords to search for each column
 * Used to match header names flexibly
 */
const COLUMN_KEYWORDS: Record<keyof ColumnMapping, string[]> = {
  NPSN: ['npsn', 'nomor pokok sekolah', 'sekolah nasional'],
  NAMA: ['nama', 'nama sekolah', 'sekolah'],
  DIREKTORAT: ['direktorat', 'provinsi', 'dinas', 'lokasi'],
  TANGGAL: ['tanggal', 'tgl', 'date', 'waktu', 'instalasi'],
  STATUS: ['status', 'kondisi', 'state', 'keadaan'],
  KENDALA: ['kendala', 'masalah', 'problem', 'issue', 'catatan']
};

/**
 * Fallback column indices (last known good values)
 */
const DEFAULT_COLUMN_MAP: ColumnMapping = {
  NPSN: 3,
  NAMA: 8,
  DIREKTORAT: 1,
  TANGGAL: 15,
  STATUS: 17,
  KENDALA: 18
};

/**
 * Normalize header text for comparison
 */
function normalizeHeaderText(text: string): string {
  return (text || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, '') // Remove special chars
    .replace(/\s+/g, ''); // Remove spaces
}

/**
 * Find column index by header name
 */
function findColumnIndex(
  headerRow: string[],
  keywords: string[],
  columnName: string
): number | null {
  for (let i = 0; i < headerRow.length; i++) {
    const normalized = normalizeHeaderText(headerRow[i]);
    
    // Check if normalized header matches any keywords
    for (const keyword of keywords) {
      const normalizedKeyword = normalizeHeaderText(keyword);
      if (normalized.includes(normalizedKeyword) || normalizedKeyword.includes(normalized)) {
        console.log(`✅ Detected column "${columnName}" at index ${i} (header: "${headerRow[i]}")`);
        return i;
      }
    }
  }
  
  return null;
}

/**
 * Detect column mapping from spreadsheet header row
 * Falls back to default indices if columns cannot be detected
 */
export function detectColumnMapping(headerRow: string[]): ColumnMapping {
  console.log('🔍 Detecting column mapping from header row...');
  console.log('📋 Header:', headerRow);

  const detectedMap: Partial<ColumnMapping> = {};
  const missingColumns: string[] = [];

  // Try to detect each column
  for (const [columnName, keywords] of Object.entries(COLUMN_KEYWORDS)) {
    const columnKey = columnName as keyof ColumnMapping;
    const index = findColumnIndex(headerRow, keywords, columnName);
    
    if (index !== null) {
      detectedMap[columnKey] = index;
    } else {
      missingColumns.push(columnName);
    }
  }

  // If we found at least 4 out of 6 columns, use detected mapping
  const detectedCount = Object.keys(detectedMap).length;
  if (detectedCount >= 4) {
    const result: ColumnMapping = {
      NPSN: detectedMap.NPSN ?? DEFAULT_COLUMN_MAP.NPSN,
      NAMA: detectedMap.NAMA ?? DEFAULT_COLUMN_MAP.NAMA,
      DIREKTORAT: detectedMap.DIREKTORAT ?? DEFAULT_COLUMN_MAP.DIREKTORAT,
      TANGGAL: detectedMap.TANGGAL ?? DEFAULT_COLUMN_MAP.TANGGAL,
      STATUS: detectedMap.STATUS ?? DEFAULT_COLUMN_MAP.STATUS,
      KENDALA: detectedMap.KENDALA ?? DEFAULT_COLUMN_MAP.KENDALA
    };

    console.log('✅ Column detection successful:', result);
    
    if (missingColumns.length > 0) {
      console.warn(
        `⚠️  Could not detect columns: ${missingColumns.join(', ')}. Using defaults.`
      );
    }

    return result;
  }

  // If detection failed, warn and use defaults
  console.warn(
    `⚠️  Could not detect most columns (only found ${detectedCount}). Using fallback defaults.`,
    DEFAULT_COLUMN_MAP
  );
  console.warn(
    '💡 To fix, ensure your spreadsheet has headers matching: NPSN, NAMA, DIREKTORAT, TANGGAL, STATUS, KENDALA'
  );

  return DEFAULT_COLUMN_MAP;
}

/**
 * Validate that all required columns are present in the data
 */
export function validateRowLength(
  row: string[],
  columnMap: ColumnMapping,
  rowIndex: number
): boolean {
  const maxColumnIndex = Math.max(...Object.values(columnMap));
  
  if (row.length <= maxColumnIndex) {
    console.warn(
      `⚠️  Row #${rowIndex} is too short (${row.length} columns, ` +
      `expected at least ${maxColumnIndex + 1})`
    );
    return false;
  }

  return true;
}

/**
 * Safely extract value from row
 */
export function getRowValue(row: string[], index: number): string {
  if (!row || index >= row.length) {
    return '';
  }
  return (row[index] || '').trim();
}

/**
 * Get column statistics for debugging
 */
export function getColumnStats(rows: string[][]): Record<number, {count: number, samples: string[]}> {
  const stats: Record<number, {count: number, samples: Set<string>}> = {};

  for (const row of rows.slice(1, Math.min(100, rows.length))) { // Sample first 100 rows
    for (let i = 0; i < row.length; i++) {
      if (!stats[i]) {
        stats[i] = { count: 0, samples: new Set() };
      }
      
      const value = (row[i] || '').trim();
      if (value) {
        stats[i].count++;
        if (stats[i].samples.size < 3) {
          stats[i].samples.add(value.substring(0, 50)); // First 50 chars
        }
      }
    }
  }

  // Convert Set to array for logging
  return Object.entries(stats).reduce((acc, [idx, data]) => {
    acc[parseInt(idx)] = {
      count: data.count,
      samples: Array.from(data.samples)
    };
    return acc;
  }, {} as Record<number, {count: number, samples: string[]}>);
}
