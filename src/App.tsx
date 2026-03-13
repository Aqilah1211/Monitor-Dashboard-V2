import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Layout } from './components/layout/Layout';
import { ErrorBoundary } from './components/ErrorBoundary';
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
      <Route 
        path="/overview" 
        element={
          <ErrorBoundary fallback={<div className="p-4 text-red-600">Error loading Overview page</div>}>
            <Overview />
          </ErrorBoundary>
        } 
      />
      <Route 
        path="/trouble" 
        element={
          <ErrorBoundary fallback={<div className="p-4 text-red-600">Error loading Troubles page</div>}>
            <Troubles />
          </ErrorBoundary>
        } 
      />
      <Route 
        path="/installed" 
        element={
          <ErrorBoundary fallback={<div className="p-4 text-red-600">Error loading Installed page</div>}>
            <Installed />
          </ErrorBoundary>
        } 
      />
      <Route 
        path="/pending" 
        element={
          <ErrorBoundary fallback={<div className="p-4 text-red-600">Error loading Pending page</div>}>
            <Pending />
          </ErrorBoundary>
        } 
      />
      <Route 
        path="/settings" 
        element={
          <ErrorBoundary fallback={<div className="p-4 text-red-600">Error loading Settings page</div>}>
            <Settings />
          </ErrorBoundary>
        } 
      />
      <Route path="*" element={<Navigate to="/overview" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <BrowserRouter>
          <Layout>
            <AppRoutes />
          </Layout>
        </BrowserRouter>
      </AppProvider>
    </ErrorBoundary>
  );
}
