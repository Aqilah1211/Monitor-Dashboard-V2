import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Layout } from './components/layout/Layout';
import { Overview } from './pages/Overview';
import { Troubles } from './pages/Troubles';
import { Installed } from './pages/Installed';
import { Pending } from './pages/Pending';
import { Settings } from './pages/Settings';

function AppRoutes() {
  const { loadConfig, fetchData, config } = useApp();

  useEffect(() => {
    console.log('📱 App initialized - loading config from localStorage...');
    loadConfig();
  }, [loadConfig]);

  useEffect(() => {
    // Auto-fetch setelah config diload
    if (config.spreadsheetId && config.currentSheet && !config.spreadsheetId.startsWith('PLACEHOLDER')) {
      console.log('🔄 Auto-fetching data after config loaded...');
      fetchData();
    }
  }, [config.spreadsheetId, config.currentSheet]);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/overview" replace />} />
      <Route path="/overview" element={<Overview />} />
      <Route path="/trouble" element={<Troubles />} />
      <Route path="/installed" element={<Installed />} />
      <Route path="/pending" element={<Pending />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="*" element={<Navigate to="/overview" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Layout>
          <AppRoutes />
        </Layout>
      </BrowserRouter>
    </AppProvider>
  );
}
