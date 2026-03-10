import { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatTimestamp, getTimeAgo } from '../../lib/time';

export function LastUpdated() {
  // State untuk trigger re-render setiap 30 detik
  const [, setRefreshCounter] = useState(0);
  const { lastUpdated, isLoading } = useApp();

  useEffect(() => {
    // Update setiap 30 detik untuk menampilkan waktu terbaru
    const interval = setInterval(() => {
      setRefreshCounter((prev) => prev + 1);
    }, 30000); // 30 detik

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
      {/* Ikon refresh */}
      <svg
        className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>

      {/* Teks timestamp */}
      <span>
        Terakhir diperbarui: <span className="font-medium">{getTimeAgo(lastUpdated)}</span>
      </span>

      {/* Tooltip dengan waktu lengkap */}
      <div className="group relative">
        <svg
          className="w-3 h-3 cursor-help opacity-60 hover:opacity-100"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          />
        </svg>

        {/* Tooltip text */}
        <div className="absolute right-0 bottom-full mb-2 hidden group-hover:block bg-slate-800 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10">
          {formatTimestamp(lastUpdated, true)}
        </div>
      </div>
    </div>
  );
}
