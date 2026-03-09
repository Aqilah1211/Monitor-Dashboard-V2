import { memo } from 'react';
import { useApp } from '../../context/AppContext';

export const Header = memo(function Header() {
  const { lastUpdated, fetchData, isLoading } = useApp();

  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-slate-800 leading-none">Dashboard</h2>
        <p className="text-sm text-slate-500">
          Update terakhir: <span className="font-medium">{lastUpdated?.toLocaleTimeString() || '-'}</span>
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => fetchData()}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50"
        >
          <svg className={`h-4 w-4 text-slate-500 ${isLoading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span className="text-sm font-semibold text-slate-600">Sync Now</span>
        </button>
      </div>
    </header>
  );
});
