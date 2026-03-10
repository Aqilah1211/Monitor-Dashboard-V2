import { useState } from 'react';
import { AlertCircle, CheckCircle2, Loader, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { GoogleSheets } from '../lib/google-sheets';
import { diagnosticCheckSpreadsheet, generateDiagnosticsReport } from '../lib/googleSheetsDiagnostics';
import { logger } from '../utils/logger';

export function Settings() {
  const { config, saveConfig, addLog } = useApp();
  const [sid, setSid] = useState(config.spreadsheetId);
  const [sheets, setSheets] = useState(config.sheetList.join(', '));
  const [testLoading, setTestLoading] = useState(false);
  const [testResult, setTestResult] = useState<{
    status: 'idle' | 'success' | 'error';
    message: string;
  }>({ status: 'idle', message: '' });

  /**
   * Validasi format Spreadsheet ID
   */
  const validateSpreadsheetId = (id: string): { valid: boolean; message: string } => {
    const cleaned = GoogleSheets.cleanSpreadsheetId(id);
    
    // Check minimal length (Google Sheets IDs are typically 44 chars)
    if (cleaned.length < 20) {
      return {
        valid: false,
        message: '❌ ID Spreadsheet terlalu pendek. Pastikan Anda menyalin ID yang lengkap.',
      };
    }

    // Check format (alphanumeric, hyphen, underscore)
    if (!/^[a-zA-Z0-9-_]+$/.test(cleaned)) {
      return {
        valid: false,
        message: '❌ Format ID Spreadsheet tidak valid. Hanya boleh berisi huruf, angka, hyphen, dan underscore.',
      };
    }

    return { valid: true, message: '✅ Format ID valid' };
  };

  /**
   * Test apakah spreadsheet bisa diakses dengan diagnostics
   */
  const handleTestConnection = async () => {
    if (!sid.trim()) {
      setTestResult({
        status: 'error',
        message: '❌ Masukkan Spreadsheet ID terlebih dahulu',
      });
      logger.warn('Test connection failed: empty spreadsheet ID', {}, 'Settings');
      return;
    }

    const validation = validateSpreadsheetId(sid);
    if (!validation.valid) {
      setTestResult({
        status: 'error',
        message: validation.message,
      });
      logger.warn(`Test connection failed: invalid ID format - ${validation.message}`, {}, 'Settings');
      return;
    }

    setTestLoading(true);
    setTestResult({ status: 'idle', message: 'Menjalankan diagnostics...' });

    try {
      const cleanedSid = GoogleSheets.cleanSpreadsheetId(sid);
      const sheetList = sheets
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      
      if (sheetList.length === 0) {
        throw new Error('Masukkan minimal 1 nama sheet');
      }

      logger.info(`🧪 Starting diagnostics test`, { spreadsheetId: cleanedSid, sheet: sheetList[0] }, 'Settings');

      // Run diagnostic check
      const diagnosticResult = await diagnosticCheckSpreadsheet(cleanedSid, sheetList[0]);
      const report = generateDiagnosticsReport(diagnosticResult);
      
      logger.debug('Diagnostics report generated', { diagnosticResult, report }, 'Settings');

      // Determine status
      if (diagnosticResult.errors.length > 0) {
        setTestResult({
          status: 'error',
          message: diagnosticResult.errors[0], // Show first error
        });
        logger.error(`Spreadsheet test failed: ${diagnosticResult.errors[0]}`, { errors: diagnosticResult.errors }, 'Settings');
      } else if (diagnosticResult.warnings.length > 0) {
        setTestResult({
          status: 'success',
          message: `✅ Spreadsheet berhasil diakses! Ditemukan ${diagnosticResult.rowCount} baris data.\n\n⚠️ Perhatian: ${diagnosticResult.warnings[0]}`,
        });
        logger.warn(`Spreadsheet test warning: ${diagnosticResult.warnings[0]}`, { warnings: diagnosticResult.warnings }, 'Settings');
        addLog(`✅ Spreadsheet ${cleanedSid.substring(0, 8)}... berhasil diuji (dengan warning)`, 'success');
      } else if (diagnosticResult.accessible && diagnosticResult.hasData) {
        setTestResult({
          status: 'success',
          message: `✅ Spreadsheet berhasil diakses!\n📊 Data ditemukan: ${diagnosticResult.rowCount} baris, ${diagnosticResult.columnCount} kolom.`,
        });
        logger.info(`✅ Spreadsheet test successful`, { rowCount: diagnosticResult.rowCount, columnCount: diagnosticResult.columnCount }, 'Settings');
        addLog(`✅ Spreadsheet ${cleanedSid.substring(0, 8)}... berhasil diuji`, 'success');
      } else if (diagnosticResult.accessible && !diagnosticResult.hasData) {
        setTestResult({
          status: 'error',
          message: `⚠️ Spreadsheet accessible tapi tidak ada data.\nMungkin sheet "${sheetList[0]}" kosong atau nama sheet salah.`,
        });
        logger.warn(`Spreadsheet has no data`, { sheet: sheetList[0] }, 'Settings');
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Error tidak diketahui';
      setTestResult({
        status: 'error',
        message: errorMsg,
      });
      logger.error('Test connection failed with exception', { error: errorMsg }, 'Settings');
    } finally {
      setTestLoading(false);
    }
  };

  /**
   * Handle Save dengan validasi
   */
  const handleSave = async () => {
    if (!sid || !sheets) {
      setTestResult({
        status: 'error',
        message: '❌ Data tidak boleh kosong!',
      });
      logger.warn('Save failed: empty fields', {}, 'Settings');
      return;
    }

    const validation = validateSpreadsheetId(sid);
    if (!validation.valid) {
      setTestResult({
        status: 'error',
        message: validation.message,
      });
      logger.warn(`Save failed: invalid spreadsheet ID - ${validation.message}`, {}, 'Settings');
      return;
    }

    // Clean up the Spreadsheet ID
    const cleanedSid = GoogleSheets.cleanSpreadsheetId(sid);
    const sheetList = sheets
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    logger.info('Saving configuration', { originalSid: sid, cleanedSid, sheetList }, 'Settings');

    saveConfig({ spreadsheetId: cleanedSid, sheetList, currentSheet: sheetList[0] });
    setTestResult({
      status: 'success',
      message: '✅ Pengaturan disimpan. Memuat ulang...',
    });
    addLog('Pengaturan disimpan. Memuat ulang...', 'success');

    // Tunggu sebentar sebelum reload biar config tersimpan
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  const handleReset = () => {
    localStorage.removeItem('ifp_sid');
    localStorage.removeItem('ifp_sheets');
    setTestResult({ status: 'idle', message: '' });
    setSid('');
    setSheets('');
    addLog('Pengaturan direset ke default', 'warning');
    setTimeout(() => window.location.reload(), 1000);
  };

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>⚙️ Pengaturan Data</CardTitle>
        <p className="text-slate-500 text-sm">
          Ubah ID Spreadsheet dan kelola daftar Sheet (tab). Gunakan tombol "Tes Koneksi"
          sebelum menyimpan untuk memastikan spreadsheet accessible.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Test Result Message */}
        {testResult.status !== 'idle' && (
          <div
            className={`p-4 rounded-lg flex gap-3 items-start ${
              testResult.status === 'success'
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}
          >
            {testResult.status === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            )}
            <div
              className={testResult.status === 'success' ? 'text-green-800' : 'text-red-800'}
            >
              <p className="text-sm font-medium whitespace-pre-wrap">{testResult.message}</p>
            </div>
          </div>
        )}

        {/* Spreadsheet ID Input */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase mb-2">
            Spreadsheet ID
          </label>
          <input
            type="text"
            value={sid}
            onChange={(e) => setSid(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="ID dari URL spreadsheet..."
          />
          <p className="text-[10px] text-slate-400 mt-2 italic">
            💡 Copy dari URL: https://docs.google.com/spreadsheets/d/
            <strong>[ID_DISINI]</strong>/edit
          </p>
        </div>

        {/* Sheet Names Input */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase mb-2">
            Daftar Sheet (Pisahkan dengan koma)
          </label>
          <textarea
            value={sheets}
            onChange={(e) => setSheets(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Contoh: 5, Rekap, Januari, Februari"
          />
          <p className="text-[10px] text-slate-400 mt-2 italic">
            *Masukkan nama tab (sheet) pada spreadsheet Anda. Harus public/shareable.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-col gap-3">
          {/* Test Connection Button */}
          <button
            onClick={handleTestConnection}
            disabled={testLoading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-amber-50 text-amber-700 border border-amber-200 font-bold rounded-xl hover:bg-amber-100 transition-all disabled:opacity-50"
          >
            {testLoading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Sedang menguji...
              </>
            ) : (
              '🧪 Tes Koneksi'
            )}
          </button>

          {/* Save & Reset Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="flex-1 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
            >
              ✅ Simpan Perubahan
            </button>
            <button
              onClick={handleReset}
              className="flex-1 px-6 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all"
            >
              🔄 Gunakan Default
            </button>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg space-y-3">
          <h4 className="font-semibold text-blue-900 text-sm flex items-center gap-2">
            <Info size={16} /> Panduan Setup:
          </h4>
          <ol className="text-xs text-blue-800 space-y-2 list-decimal list-inside">
            <li><strong>Copy Spreadsheet ID</strong> dari URL: https://docs.google.com/spreadsheets/d/<strong>[ID_DISINI]</strong>/edit</li>
            <li><strong>Share Spreadsheet</strong> → Buka Share button → <strong>Ubah ke "Anyone with the link"</strong></li>
            <li><strong>Masukkan ID & Sheet Name</strong> di form di atas</li>
            <li><strong>Klik "🧪 Tes Koneksi"</strong> untuk verifikasi sebelum simpan</li>
          </ol>
        </div>

        {/* Troubleshooting Box */}
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg space-y-3">
          <h4 className="font-semibold text-red-900 text-sm">🔧 Troubleshooting Jika Masih Error 404:</h4>
          <div className="text-xs text-red-800 space-y-2">
            <div>
              <strong>❌ Error: "404 Not Found"</strong>
              <p className="mt-1 ml-2">Kemungkinan penyebab:</p>
              <ul className="list-disc list-inside ml-2 mt-1">
                <li>Spreadsheet ID salah (copy ulang dari URL)</li>
                <li>Spreadsheet tidak di-share ke "Anyone" (PENTING!)</li>
                <li>Nama sheet tidak sesuai (cek tab name di spreadsheet)</li>
                <li>Spreadsheet dihapus atau tidak accessible</li>
              </ul>
            </div>
            
            <div className="mt-3">
              <strong>❌ Error: "403 Forbidden"</strong>
              <p className="mt-1 ml-2">Solusi:</p>
              <ul className="list-disc list-inside ml-2 mt-1">
                <li>Buka Spreadsheet di browser</li>
                <li>Klik tombol <strong>Share</strong> (kanan atas)</li>
                <li>Ubah akses menjadi <strong>"Anyone with the link"</strong> atau <strong>"Public"</strong></li>
                <li>Copy link dan ambil ID dari URL</li>
              </ul>
            </div>

            <div className="mt-3">
              <strong>❌ Error: "Network error"</strong>
              <p className="mt-1 ml-2">Solusi:</p>
              <ul className="list-disc list-inside ml-2 mt-1">
                <li>Pastikan internet connection aktif</li>
                <li>Coba refresh page (Ctrl+R)</li>
                <li>Cek apakah browser blok akses ke Google Sheets</li>
                <li>Buka console (F12) untuk melihat error detail</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
