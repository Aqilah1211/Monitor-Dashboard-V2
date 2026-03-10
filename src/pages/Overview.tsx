import { useEffect } from 'react';
import { StatsGrid } from '../components/dashboard/StatsGrid';
import { ProgressChart } from '../components/dashboard/ProgressChart';
import { ActivityLog } from '../components/dashboard/ActivityLog';
import { LastUpdated } from '../components/dashboard/LastUpdated';
import { LoadingSkeleton } from '../components/dashboard/LoadingSkeleton';
import { RawDataViewer } from '../components/debug/RawDataViewer';
import { useApp } from '../context/AppContext';

export function Overview() {
  const { data, config, fetchData, isLoading } = useApp();

  useEffect(() => {
    // Auto-fetch data jika belum ada dan config sudah tersedia
    if (!data && config.spreadsheetId && config.currentSheet) {
      console.log('🚀 Auto-fetching data on mount...');
      fetchData();
    }
  }, []); // Empty deps = hanya run sekali saat mount

  // Tampilkan loading skeleton saat data sedang di-fetch
  if (isLoading || !data) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header dengan Last Updated */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">📊 Dashboard</h1>
        </div>
      </div>

      {/* Last Updated indicator */}
      <LastUpdated />

      {/* Main content */}
      <StatsGrid />
      <ProgressChart />
      <ActivityLog />
      <RawDataViewer />
    </div>
  );
}
