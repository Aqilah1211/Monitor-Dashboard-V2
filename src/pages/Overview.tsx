import { useEffect } from 'react';
import { StatsGrid } from '../components/dashboard/StatsGrid';
import { ProgressChart } from '../components/dashboard/ProgressChart';
import { ActivityLog } from '../components/dashboard/ActivityLog';
import { RawDataViewer } from '../components/debug/RawDataViewer';
import { useApp } from '../context/AppContext';

export function Overview() {
  const { data, config, fetchData } = useApp();

  useEffect(() => {
    // Auto-fetch data jika belum ada dan config sudah tersedia
    if (!data && config.spreadsheetId && config.currentSheet) {
      console.log('🚀 Auto-fetching data on mount...');
      fetchData();
    }
  }, []); // Empty deps = hanya run sekali saat mount

  return (
    <div>
      <StatsGrid />
      <ProgressChart />
      <ActivityLog />
      <RawDataViewer />
    </div>
  );
}
