/**
 * GoogleSheetsDiagnostics - Debugging tool untuk Google Sheets integration
 * Membantu user identify masalah dengan Spreadsheet ID & Sheet configuration
 */

import { GoogleSheets } from '../lib/google-sheets';

/**
 * Test Google Sheets accessibility & structure
 */
export async function diagnosticCheckSpreadsheet(
  spreadsheetId: string,
  sheetName: string
): Promise<{
  spreadsheetId: boolean;      // Valid format
  urlBuilt: string;             // Generated URL
  accessible: boolean;          // Can fetch
  responseStatus: number | null;
  hasData: boolean;             // Has rows
  columnCount: number | null;   // Columns in first row
  rowCount: number | null;      // Total rows
  sampleData: string[] | null;  // First data row
  errors: string[];             // All errors encountered
  warnings: string[];           // Warnings
}> {
  const errors: string[] = [];
  const warnings: string[] = [];
  let urlBuilt = '';
  let accessible = false;
  let responseStatus: number | null = null;
  let hasData = false;
  let columnCount: number | null = null;
  let rowCount: number | null = null;
  let sampleData: string[] | null = null;

  try {
    // 1. Validasi format ID
    const cleanedId = GoogleSheets.cleanSpreadsheetId(spreadsheetId);
    const isValidFormat = /^[a-zA-Z0-9-_]{20,}$/.test(cleanedId);

    if (!isValidFormat) {
      errors.push(`❌ Format ID tidak valid: "${cleanedId}"`);
      return {
        spreadsheetId: false,
        urlBuilt,
        accessible,
        responseStatus,
        hasData,
        columnCount,
        rowCount,
        sampleData,
        errors,
        warnings,
      };
    }

    // 2. Build dan test URL
    try {
      urlBuilt = GoogleSheets.buildCSVUrl(cleanedId, sheetName);
      console.log('🔗 Generated URL:', urlBuilt);
    } catch (err) {
      errors.push(`❌ Gagal build URL: ${err instanceof Error ? err.message : 'Unknown'}`);
      return {
        spreadsheetId: true,
        urlBuilt,
        accessible,
        responseStatus,
        hasData,
        columnCount,
        rowCount,
        sampleData,
        errors,
        warnings,
      };
    }

    // 3. Test accessibility
    try {
      const response = await fetch(urlBuilt, {
        method: 'GET',
        headers: { 'Accept': 'text/csv' }
      });

      responseStatus = response.status;
      console.log(`📡 Response status: ${response.status}`);

      if (response.status === 403) {
        errors.push(
          `❌ 403 Forbidden - Spreadsheet tidak accessible!\n` +
          `Solusi: Buka Spreadsheet → Share → Ubah ke "Anyone with the link" atau "Public"`
        );
      } else if (response.status === 404) {
        errors.push(
          `❌ 404 Not Found - Kemungkinan:\n` +
          `1. Spreadsheet ID salah\n` +
          `2. Sheet name "${sheetName}" tidak ada di spreadsheet\n` +
          `3. Spreadsheet dihapus atau privacy setting terlalu ketat`
        );
      } else if (!response.ok) {
        errors.push(`❌ HTTP ${response.status} - ${response.statusText}`);
      }

      if (response.ok) {
        accessible = true;
        const csvText = await response.text();
        const lines = csvText.split('\n').filter(line => line.trim());
        
        if (lines.length === 0) {
          warnings.push(`⚠️ CSV response kosong atau tidak valid`);
        } else {
          rowCount = lines.length;
          const firstRow = lines[0].split(',');
          columnCount = firstRow.length;
          hasData = lines.length > 1;

          if (hasData) {
            sampleData = lines[1].split(',');
          }

          console.log(`📊 Data found - Rows: ${rowCount}, Columns: ${columnCount}`);
          
          // Check if data sesuai COLUMN_MAP
          const COLUMN_MAP = { NPSN: 3, NAMA: 8, DIREKTORAT: 1, TANGGAL: 15, STATUS: 17, KENDALA: 18 };
          const requiredColumns = Math.max(...Object.values(COLUMN_MAP));
          
          if (columnCount < requiredColumns) {
            warnings.push(
              `⚠️ Spreadsheet hanya punya ${columnCount} kolom, tapi COLUMN_MAP memerlukan minimal ${requiredColumns} kolom.\n` +
              `Kemungkinan struktur sheet berbeda dengan expected format.`
            );
          }
        }
      }
    } catch (fetchErr) {
      errors.push(
        `❌ Network error saat fetch: ${fetchErr instanceof Error ? fetchErr.message : 'Unknown'}\n` +
        `Kemungkinan:\n1. CORS issue\n2. Internet connection\n3. Google Sheets API blocked`
      );
    }

    return {
      spreadsheetId: true,
      urlBuilt,
      accessible,
      responseStatus,
      hasData,
      columnCount,
      rowCount,
      sampleData,
      errors,
      warnings,
    };
  } catch (err) {
    errors.push(`❌ Unexpected error: ${err instanceof Error ? err.message : 'Unknown'}`);
    return {
      spreadsheetId: false,
      urlBuilt,
      accessible,
      responseStatus,
      hasData,
      columnCount,
      rowCount,
      sampleData,
      errors,
      warnings,
    };
  }
}

/**
 * Generate human-readable diagnostics report
 */
export function generateDiagnosticsReport(result: Awaited<ReturnType<typeof diagnosticCheckSpreadsheet>>): string {
  let report = '📋 DIAGNOSTICS REPORT\n';
  report += '═'.repeat(50) + '\n\n';

  report += `✓ Spreadsheet ID Format: ${result.spreadsheetId ? '✅ Valid' : '❌ Invalid'}\n`;
  report += `✓ CSV URL Built: ${result.urlBuilt ? '✅ Yes' : '❌ No'}\n`;
  report += `✓ Accessible: ${result.accessible ? '✅ Yes' : '❌ No'} (HTTP ${result.responseStatus})\n`;
  report += `✓ Has Data: ${result.hasData ? '✅ Yes' : '❌ No'}\n`;
  report += `✓ Columns: ${result.columnCount || 'N/A'}\n`;
  report += `✓ Rows: ${result.rowCount || 'N/A'}\n\n`;

  if (result.errors.length > 0) {
    report += '❌ ERRORS:\n';
    result.errors.forEach(e => {
      report += `   ${e}\n\n`;
    });
  }

  if (result.warnings.length > 0) {
    report += '⚠️  WARNINGS:\n';
    result.warnings.forEach(w => {
      report += `   ${w}\n\n`;
    });
  }

  if (result.accessible && !result.errors.length) {
    report += '✅ DIAGNOSIS: Spreadsheet accessible & configured correctly!\n';
  }

  return report;
}
