import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { GoogleSheets } from '../lib/google-sheets';

export function Settings() {
  const { config, saveConfig, addLog } = useApp();
  const [sid, setSid] = useState(config.spreadsheetId);
  const [sheets, setSheets] = useState(config.sheetList.join(', '));

  const handleSave = async () => {
    if (!sid || !sheets) {
      alert('Data tidak boleh kosong!');
      return;
    }
    
    // Clean up the Spreadsheet ID to remove any labels or extra text
    const cleanedSid = GoogleSheets.cleanSpreadsheetId(sid);
    const sheetList = sheets.split(',').map(s => s.trim()).filter(Boolean);
    
    console.log('📝 Saving config - Original SID:', sid);
    console.log('📝 Saving config - Cleaned SID:', cleanedSid);
    console.log('📝 Saving config - Sheet List:', sheetList);
    
    saveConfig({ spreadsheetId: cleanedSid, sheetList, currentSheet: sheetList[0] });
    addLog('Pengaturan disimpan. Memuat ulang...', 'success');
    
    // Tunggu sebentar sebelum reload biar config tersimpan
    setTimeout(() => {
      window.location.reload();
    }, 800);
  };

  const handleReset = () => {
    localStorage.removeItem('ifp_sid');
    localStorage.removeItem('ifp_sheets');
    addLog('Pengaturan direset ke default', 'warning');
    setTimeout(() => window.location.reload(), 1000);
  };

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Pengaturan Data</CardTitle>
        <p className="text-slate-500 text-sm">Ubah ID Spreadsheet dan kelola daftar Sheet (tab).</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Spreadsheet ID</label>
          <input
            type="text"
            value={sid}
            onChange={(e) => setSid(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="ID dari URL spreadsheet..."
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Daftar Sheet (Pisahkan dengan koma)</label>
          <textarea
            value={sheets}
            onChange={(e) => setSheets(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Contoh: 5, Rekap, Januari, Februari"
          />
          <p className="text-[10px] text-slate-400 mt-2 italic">*Masukkan nama tab atau GID sheet Anda.</p>
        </div>
        <div className="pt-2 flex gap-3">
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
          >
            Simpan Perubahan
          </button>
          <button
            onClick={handleReset}
            className="px-6 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all"
          >
            Gunakan Default
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
