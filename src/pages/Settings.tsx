import { useState } from 'react';
import { AlertCircle, CheckCircle2, Loader } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { GoogleSheets } from '../lib/google-sheets';

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
   * Test apakah spreadsheet bisa diakses
   */
  const handleTestConnection = async () => {
    if (!sid.trim()) {
      setTestResult({
        status: 'error',
        message: '❌ Masukkan Spreadsheet ID terlebih dahulu',
      });
      return;
    }

    const validation = validateSpreadsheetId(sid);
    if (!validation.valid) {
      setTestResult({
        status: 'error',
        message: validation.message,
      });
      return;
    }

    setTestLoading(true);
    setTestResult({ status: 'idle', message: 'Menguji koneksi...' });

    try {
      const cleanedSid = GoogleSheets.cleanSpreadsheetId(sid);
      const sheetList = sheets
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      
      if (sheetList.length === 0) {
        throw new Error('Masukkan minimal 1 nama sheet');
      }

      // Try fetch dari sheet pertama
      const url = GoogleSheets.buildCSVUrl(cleanedSid, sheetList[0]);
      console.log('🧪 Testing URL:', url);
      
      const response = await fetch(url, { method: 'HEAD' });
      
      if (response.ok || response.status === 200) {
        setTestResult({
          status: 'success',
          message: `✅ Spreadsheet berhasil diakses! Sheet "${sheetList[0]}" ditemukan.`,
        });
        addLog(`✅ Spreadsheet ${cleanedSid.substring(0, 8)}... berhasil diuji`, 'success');
      } else if (response.status === 404) {
        throw new Error(
          `❌ Spreadsheet tidak ditemukan (404). Pastikan:\n1. ID Spreadsheet benar\n2. Spreadsheet dibuat public (Share > Anyone)\n3. Sheet "${sheetList[0]}" ada`
        );
      } else {
        throw new Error(
          `❌ Error ${response.status}: ${response.statusText}. Cek apakah spreadsheet accessible.`
        );
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Error tidak diketahui';
      setTestResult({
        status: 'error',
        message: errorMsg,
      });
      console.error('❌ Test failed:', errorMsg);
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
      return;
    }

    const validation = validateSpreadsheetId(sid);
    if (!validation.valid) {
      setTestResult({
        status: 'error',
        message: validation.message,
      });
      return;
    }

    // Clean up the Spreadsheet ID
    const cleanedSid = GoogleSheets.cleanSpreadsheetId(sid);
    const sheetList = sheets
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    console.log('📝 Saving config - Original SID:', sid);
    console.log('📝 Saving config - Cleaned SID:', cleanedSid);
    console.log('📝 Saving config - Sheet List:', sheetList);

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
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-900 text-sm mb-2">ℹ️ Cara menggunakan:</h4>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>✓ Copy Spreadsheet ID dari URL spreadsheet</li>
            <li>✓ Pastikan spreadsheet dibuat <strong>Public</strong> (Share &gt; Anyone)</li>
            <li>✓ Masukkan nama sheet yang ingin dimonitor</li>
            <li>✓ Klik "Tes Koneksi" untuk verifikasi sebelum simpan</li>
            <li>✓ Jika error 404, periksa ID dan akses public spreadsheet</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
