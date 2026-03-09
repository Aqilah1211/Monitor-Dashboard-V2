import { memo, useState } from 'react';
import { useApp } from '../../context/AppContext';

export const RawDataViewer = memo(function RawDataViewer() {
  const { data } = useApp();
  const [expanded, setExpanded] = useState(false);

  if (!data || data.all.length === 0) return null;

  const firstRow = data.all[0];

  return (
    <div className="mt-8 p-4 bg-slate-900 rounded-xl text-white">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left text-xs font-bold uppercase mb-4 p-2 bg-slate-800 rounded hover:bg-slate-700 transition"
      >
        {expanded ? '▼' : '▶'} Raw Data Viewer (Debugging)
      </button>

      {expanded && (
        <div className="space-y-4 text-xs">
          <div className="bg-slate-800 p-3 rounded font-mono">
            <p className="text-emerald-400 mb-2">First Item Data:</p>
            <pre className="overflow-auto text-slate-300">
              {JSON.stringify(firstRow, null, 2)}
            </pre>
          </div>

          <div className="bg-slate-800 p-3 rounded font-mono">
            <p className="text-emerald-400 mb-2">Raw Array (Posisi Kolom):</p>
            <pre className="overflow-auto text-slate-300">
              {JSON.stringify(firstRow.raw, null, 2)}
            </pre>
          </div>

          <div className="bg-slate-800 p-3 rounded font-mono">
            <p className="text-emerald-400 mb-2">Statistics:</p>
            <div className="text-slate-300 space-y-1">
              <p>Total Rows: {data.all.length}</p>
              <p>Total Columns: {firstRow.raw.length}</p>
              <p>Installed: {data.installed.length}</p>
              <p>Pending: {data.pending.length}</p>
              <p>Trouble: {data.trouble.length}</p>
            </div>
          </div>

          <div className="bg-amber-900 p-3 rounded">
            <p className="text-amber-200 font-bold mb-2">💡 Cara Gunakan:</p>
            <p className="text-amber-100 text-xs">
              Lihat kolom "Raw Array" - buka browser console (F12) untuk melihat detail lengkap.
              <br />
              Update COLUMN_MAP di <code>src/hooks/useGoogleSheets.ts</code> sesuai posisi kolom yang benar.
            </p>
          </div>
        </div>
      )}
    </div>
  );
});
