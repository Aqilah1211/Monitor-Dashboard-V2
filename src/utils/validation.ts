/**
 * Validation utilities untuk spreadsheet dan konfigurasi
 */

export interface ValidationResult {
  valid: boolean;
  message: string;
  code: 'OK' | 'INVALID_FORMAT' | 'EMPTY' | 'TOO_SHORT' | 'INVALID_CHARS' | 'NETWORK_ERROR' | 'UNKNOWN';
  details?: string;
}

/**
 * Validasi format Spreadsheet ID
 * Google Sheets ID biasanya format: 1E4UBDg9M0RKTvtJCXUOg4IWQmvl1mdmIqeN9CyRw5qs (44 chars, alphanumeric + underscore/dash)
 */
export function validateSpreadsheetId(id: string): ValidationResult {
  if (!id || !id.trim()) {
    return {
      valid: false,
      message: 'ID Spreadsheet tidak boleh kosong',
      code: 'EMPTY'
    };
  }

  const trimmed = id.trim();

  // Extract ID dari URL jika user paste full URL
  let extractedId = trimmed;
  const urlMatch = trimmed.match(/\/d\/([a-zA-Z0-9-_]+)/);
  if (urlMatch) {
    extractedId = urlMatch[1];
  }

  // Format check: 20+ karakter, alphanumeric + dash/underscore
  if (extractedId.length < 20) {
    return {
      valid: false,
      message: 'ID Spreadsheet terlalu pendek',
      code: 'TOO_SHORT',
      details: `Diterima ${extractedId.length} karakter, minimum 20 karakter`
    };
  }

  // Check invalid characters
  if (!/^[a-zA-Z0-9\-_]+$/.test(extractedId)) {
    return {
      valid: false,
      message: 'ID Spreadsheet mengandung karakter tidak valid',
      code: 'INVALID_CHARS',
      details: 'Hanya alfanumerik, dash (-), dan underscore (_) yang diizinkan'
    };
  }

  return {
    valid: true,
    message: `ID valid: ${extractedId.substring(0, 10)}...${extractedId.substring(extractedId.length - 4)}`,
    code: 'OK'
  };
}

/**
 * Validasi sheet name
 */
export function validateSheetName(name: string): ValidationResult {
  if (!name || !name.trim()) {
    return {
      valid: false,
      message: 'Nama sheet tidak boleh kosong',
      code: 'EMPTY'
    };
  }

  const trimmed = name.trim();

  if (trimmed.length < 1) {
    return {
      valid: false,
      message: 'Nama sheet minimal 1 karakter',
      code: 'TOO_SHORT'
    };
  }

  if (trimmed.length > 100) {
    return {
      valid: false,
      message: 'Nama sheet maksimal 100 karakter',
      code: 'TOO_SHORT'
    };
  }

  return {
    valid: true,
    message: `Sheet name valid: "${trimmed}"`,
    code: 'OK'
  };
}

/**
 * Validasi konfigurasi lengkap
 */
export function validateConfig(spreadsheetId: string, sheetNames: string[]): ValidationResult {
  // Validasi ID
  const idValidation = validateSpreadsheetId(spreadsheetId);
  if (!idValidation.valid) {
    return idValidation;
  }

  // Validasi konfigurasi lengkap
  if (!sheetNames || sheetNames.length === 0) {
    return {
      valid: false,
      message: 'Minimal 1 sheet harus dikonfigurasi',
      code: 'INVALID_FORMAT'
    };
  }

  // Validasi setiap sheet
  for (const sheetName of sheetNames) {
    const sheetValidation = validateSheetName(sheetName);
    if (!sheetValidation.valid) {
      return {
        valid: false,
        message: `Sheet tidak valid: ${sheetName}`,
        code: 'INVALID_FORMAT',
        details: sheetValidation.message
      };
    }
  }

  return {
    valid: true,
    message: `Konfigurasi valid: ${sheetNames.length} sheet`,
    code: 'OK'
  };
}

/**
 * Check apakah spreadsheet bisa diakses
 * Test dengan fetch ke Google Sheets API endpoint
 */
export async function testSpreadsheetAccess(
  spreadsheetId: string,
  sheetName: string,
  timeout: number = 10000
): Promise<ValidationResult> {
  try {
    // Build URL
    const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;

    // Test dengan fetch
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(url, {
      method: 'GET',
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    // Handle different HTTP statuses
    if (response.status === 404) {
      return {
        valid: false,
        message: '404 - Spreadsheet tidak ditemukan atau tidak di-share public',
        code: 'NETWORK_ERROR',
        details: 'Pastikan spreadsheet sudah di-share ke "Anyone with link" atau "Public"'
      };
    }

    if (response.status === 403) {
      return {
        valid: false,
        message: '403 - Akses ditolak (Permission Denied)',
        code: 'NETWORK_ERROR',
        details: 'Spreadsheet perlu di-share lebih publik. Buka Share menu dan pilih "Anyone with the link"'
      };
    }

    if (!response.ok) {
      return {
        valid: false,
        message: `HTTP Error ${response.status}: ${response.statusText}`,
        code: 'NETWORK_ERROR',
        details: 'Terjadi error saat mengakses spreadsheet'
      };
    }

    // Try to parse response
    const text = await response.text();
    if (!text || text.length < 10) {
      return {
        valid: false,
        message: 'Response kosong dari spreadsheet',
        code: 'NETWORK_ERROR',
        details: 'Spreadsheet mungkin tidak memiliki data atau terjadi error lain'
      };
    }

    return {
      valid: true,
      message: `✅ Spreadsheet dapat diakses (${text.length} bytes diterima)`,
      code: 'OK'
    };
  } catch (error) {
    const err = error as Error;

    if (err.name === 'AbortError') {
      return {
        valid: false,
        message: 'Timeout - Server tidak merespons dalam waktu yang ditentukan',
        code: 'NETWORK_ERROR',
        details: 'Periksa koneksi internet Anda atau coba lagi nanti'
      };
    }

    if (err.message.includes('CORS')) {
      return {
        valid: false,
        message: 'CORS Error - Browser tidak bisa akses spreadsheet',
        code: 'NETWORK_ERROR',
        details: 'Periksa browser console (F12) untuk detail error'
      };
    }

    return {
      valid: false,
      message: `Network Error: ${err.message}`,
      code: 'NETWORK_ERROR',
      details: 'Periksa koneksi internet dan pastikan spreadsheet bisa diakses dari browser'
    };
  }
}

/**
 * Format error message untuk UI
 */
export function formatErrorMessage(result: ValidationResult): string {
  if (result.valid) return result.message;

  let message = result.message;
  if (result.details) {
    message += `\n\n📌 ${result.details}`;
  }

  return message;
}

/**
 * Get troubleshooting suggestions based on error code
 */
export function getTroubleshootingSteps(result: ValidationResult): string[] {
  const steps: Record<string, string[]> = {
    INVALID_FORMAT: [
      '✓ Copy ID dari URL: https://docs.google.com/spreadsheets/d/[ID]/edit',
      '✓ Pastikan ID minimal 20 karakter',
      '✓ Hanya gunakan alfanumerik, dash, underscore'
    ],
    EMPTY: [
      '✓ Masukkan Spreadsheet ID terlebih dahulu',
      '✓ ID bisa ditemukan di URL Google Sheets'
    ],
    TOO_SHORT: [
      '✓ ID atau sheet name terlalu pendek',
      '✓ Copy ID lengkap dari URL spreadsheet'
    ],
    INVALID_CHARS: [
      '✓ Hapus spasi dan karakter khusus',
      '✓ Hanya alfanumerik, dash, underscore yang diizinkan'
    ],
    NETWORK_ERROR: [
      '✓ Verifikasi spreadsheet di-share PUBLIC',
      '✓ Buka: https://docs.google.com/spreadsheets/d/[ID]/edit',
      '✓ Klik "Share" → Ubah ke "Anyone with the link"',
      '✓ Test kembali dengan "Tes Koneksi" button'
    ],
    UNKNOWN: [
      '✓ Cek browser console (F12) untuk detail error',
      '✓ Reload halaman dan coba ulang',
      '✓ Verifikasi koneksi internet'
    ]
  };

  return steps[result.code] || steps.UNKNOWN;
}
