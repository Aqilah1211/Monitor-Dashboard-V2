import { memo } from 'react';
import { useApp } from '../../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

export const ActivityLog = memo(function ActivityLog() {
  const { logs, clearLogs } = useApp();

  const colors: Record<string, string> = {
    info: 'bg-blue-50 border-l-blue-400',
    success: 'bg-emerald-50 border-l-emerald-400',
    error: 'bg-rose-50 border-l-rose-400',
    warning: 'bg-amber-50 border-l-amber-400'
  };

  return (
    <Card className="glass-card p-6 rounded-3xl shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between border-b-0 pb-4">
        <CardTitle className="flex items-center gap-2">
          <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          Aktivitas Terbaru
        </CardTitle>
        {logs.length > 0 && (
          <button onClick={clearLogs} className="text-xs text-slate-500 hover:text-slate-700">
            Clear
          </button>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
          {logs.length === 0 ? (
            <p className="text-center py-10 text-slate-400 text-sm">Belum ada aktivitas</p>
          ) : (
            logs.map((log) => (
              <div key={log.id} className={`p-3 rounded-xl border-l-4 animate-fade-in ${colors[log.type]}`}>
                <p className="font-bold text-xs">{log.message}</p>
                <span className="text-[9px] text-slate-400">{log.timestamp.toLocaleTimeString('id-ID')}</span>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
});
