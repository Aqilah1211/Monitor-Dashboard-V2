import { createContext, useContext, useReducer, ReactNode, useCallback, useEffect, useRef } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useGoogleSheets } from '../hooks/useGoogleSheets';
import { useDataCache } from '../hooks/useDataCache';
import { GoogleSheets } from '../lib/google-sheets';
import { AppState, AppContextType, SheetConfig, FilterState, ActivityLog } from '../types';

const STORAGE_KEYS = { SID: 'ifp_sid', SHEETS: 'ifp_sheets' };

const DEFAULT_CONFIG: SheetConfig = {
  spreadsheetId: '',
  sheetList: ['5'],
  currentSheet: '5'
};

const initialState: AppState = {
  config: DEFAULT_CONFIG,
  data: null,
  isLoading: false,
  error: null,
  lastUpdated: null,
  filters: { search: '', dateStart: null, dateEnd: null },
  logs: []
};

type AppAction =
  | { type: 'SET_CONFIG'; payload: Partial<SheetConfig> }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_DATA'; payload: AppState['data'] }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_LAST_UPDATED'; payload: Date }
  | { type: 'UPDATE_FILTERS'; payload: Partial<FilterState> }
  | { type: 'ADD_LOG'; payload: Omit<ActivityLog, 'id' | 'timestamp'> }
  | { type: 'CLEAR_LOGS' };

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_CONFIG':
      return { ...state, config: { ...state.config, ...action.payload } };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_DATA':
      return { ...state, data: action.payload, error: null };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'SET_LAST_UPDATED':
      return { ...state, lastUpdated: action.payload };
    case 'UPDATE_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case 'ADD_LOG':
      const newLog: ActivityLog = {
        ...action.payload,
        id: Date.now(),
        timestamp: new Date()
      };
      return { ...state, logs: [newLog, ...state.logs].slice(0, 50) };
    case 'CLEAR_LOGS':
      return { ...state, logs: [] };
    default:
      return state;
  }
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [storedSid, setStoredSid] = useLocalStorage<string>(STORAGE_KEYS.SID, '');
  const [storedSheets, setStoredSheets] = useLocalStorage<string>(STORAGE_KEYS.SHEETS, '5');
  const { fetchData: fetchSheetData } = useGoogleSheets();
  const { getCachedData, setCachedData, isCacheFresh, clearCache } = useDataCache();

  const loadConfig = useCallback(() => {
    // Clean up the spreadsheet ID in case it has labels or extra text
    const cleanedSid = GoogleSheets.cleanSpreadsheetId(storedSid);
    const sheetList = storedSheets.split(',').map(s => s.trim()).filter(Boolean);
    console.log('📂 Loading config - Original SID:', storedSid);
    console.log('📂 Loading config - Cleaned SID:', cleanedSid);
    dispatch({
      type: 'SET_CONFIG',
      payload: {
        spreadsheetId: cleanedSid,
        sheetList,
        currentSheet: sheetList[0] || null
      }
    });
  }, [storedSid, storedSheets]);

  // 🔥 DECLARE FETCHDATA FIRST (needed by saveConfig)
  const fetchData = useCallback(async (forceRefresh = false) => {
    const { spreadsheetId, currentSheet } = state.config;
    
    console.log('🚀 Start fetchData:', { spreadsheetId, currentSheet, forceRefresh });
    
    if (!spreadsheetId || !currentSheet) {
      const msg = 'Sheet ID atau nama sheet belum diatur';
      console.error('❌', msg);
      dispatch({ type: 'SET_ERROR', payload: msg });
      return;
    }

    // 🔥 FIX: Kalau forceRefresh=true (spreadsheet ID berubah), SKIP cache completely
    let cachedData = null;
    let fresh = false;
    
    if (!forceRefresh) {
      // ✅ SMART CACHING: Check cache only jika tidak forced refresh
      cachedData = getCachedData();
      fresh = isCacheFresh();
      
      if (cachedData && fresh) {
        console.log('⚡ Using FRESH cache (age < 1 min)');
        dispatch({ type: 'SET_DATA', payload: cachedData });
        dispatch({ type: 'SET_LAST_UPDATED', payload: new Date() });
        return; // Tidak perlu fetch, cache masih fresh
      }

      if (cachedData && !fresh) {
        console.log('📦 Using STALE cache (age > 1 min) - fetching fresh data in background');
        // Load stale data immediately, fetch baru di background
        dispatch({ type: 'SET_DATA', payload: cachedData });
        dispatch({ type: 'SET_LOADING', payload: true });
      }
    } else {
      console.log('🔄 Force refresh: BYPASSING all cache');
      dispatch({ type: 'SET_LOADING', payload: true });
    }

    if (!forceRefresh && !cachedData) {
      console.log('❌ No cache - setting loading...');
      dispatch({ type: 'SET_LOADING', payload: true });
    }

    dispatch({ type: 'ADD_LOG', payload: { message: `Memuat data dari "${currentSheet}"...`, type: 'info' } });

    try {
      const data = await Promise.race([
        fetchSheetData(spreadsheetId, currentSheet),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout: Google Sheets response took > 15s')), 15000)
        )
      ]) as any;

      console.log('📦 Data fetched successfully:', data);
      
      // ✅ SAVE TO CACHE
      setCachedData(data);
      
      dispatch({ type: 'SET_DATA', payload: data });
      dispatch({ type: 'SET_LAST_UPDATED', payload: new Date() });
      dispatch({ type: 'ADD_LOG', payload: { message: `Data "${currentSheet}" berhasil dimuat (${data.all.length} items)`, type: 'success' } });
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ Fetch failed:', errMsg);
      
      // 🔥 Provide more helpful error messages for common issues
      let userFriendlyMessage = errMsg;
      
      if (errMsg.includes('404')) {
        userFriendlyMessage = `❌ 404 Error - Spreadsheet tidak ditemukan atau tidak accessible!\n\n` +
          `Kemungkinan penyebab:\n` +
          `1. Spreadsheet ID salah\n` +
          `2. Spreadsheet dihapus\n` +
          `3. Spreadsheet belum di-share ke "Siapa saja dengan link" (public)\n\n` +
          `💡 Solusi: Buka Settings → Tes Koneksi ulang dan pastikan berhasil sebelum Simpan`;
      } else if (errMsg.includes('403')) {
        userFriendlyMessage = `❌ 403 Error - Anda tidak memiliki akses ke spreadsheet ini!\n\n` +
          `Solusi: Share spreadsheet dengan permission "Anyone with the link"`;
      } else if (errMsg.includes('Timeout')) {
        userFriendlyMessage = `⏱️ Timeout - Google Sheets response terlalu lama (>15s)\n\n` +
          `Kemungkinan: Internet connection lambat atau spreadsheet terlalu besar`;
      }
      
      // Jika ada cached data (even stale), jangan tampilkan error
      if (cachedData) {
        console.log('✅ Falling back to cached data');
        dispatch({ type: 'ADD_LOG', payload: { message: `Menggunakan data cache (fetch gagal: ${errMsg})`, type: 'warning' } });
      } else {
        dispatch({ type: 'SET_ERROR', payload: userFriendlyMessage });
        dispatch({ type: 'ADD_LOG', payload: { message: `Gagal memuat data: ${userFriendlyMessage}`, type: 'error' } });
      }
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.config, fetchSheetData, getCachedData, setCachedData, isCacheFresh]);

  // NOW define saveConfig (uses fetchData)
  const saveConfig = useCallback((newConfig: Partial<SheetConfig>) => {
    const oldSid = state.config.spreadsheetId;
    const newSid = newConfig.spreadsheetId;
    const isSpreadsheetIdChanged = newSid && newSid !== oldSid && oldSid !== '';
    
    console.log('💾 Saving config:', { oldSid, newSid, isChanged: isSpreadsheetIdChanged });
    
    if (newConfig.spreadsheetId !== undefined) setStoredSid(newConfig.spreadsheetId);
    if (newConfig.sheetList !== undefined) setStoredSheets(newConfig.sheetList.join(','));
    
    // 🔥 AGGRESSIVE CACHE CLEARING: Clear ALL cache immediately
    console.log('🗑️  Clearing ALL cache keys...');
    try {
      // Clear all known cache keys
      localStorage.removeItem('ifp_app_cache');
      localStorage.removeItem('ifp_cache_timestamp');
      localStorage.removeItem('ifp_data_cache');
      localStorage.removeItem('ifp_filters');
      localStorage.removeItem('ifp_last_updated');
      
      // Also clear sessionStorage
      sessionStorage.clear();
      
      console.log('✅ All cache cleared successfully');
    } catch (err) {
      console.error('⚠️  Error clearing cache:', err);
    }
    
    // Dispatch config update
    dispatch({ type: 'SET_CONFIG', payload: newConfig });
    
    // 🔥 Reset all state when spreadsheet ID changes
    if (isSpreadsheetIdChanged) {
      console.log('🔄 Spreadsheet ID changed - Resetting state completely');
      dispatch({ type: 'SET_DATA', payload: null });
      dispatch({ type: 'SET_ERROR', payload: null });
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'UPDATE_FILTERS', payload: { search: '', dateStart: null, dateEnd: null } });
      
      // 🔥 IMMEDIATE FETCH with forceRefresh=true to bypass cache
      console.log('🚀 Force refreshing data from new spreadsheet...');
      setTimeout(() => {
        fetchData(true); // Force refresh, bypass all cache!
      }, 100);
    }
    
    console.log('✅ Config saved:', newConfig);
  }, [setStoredSid, setStoredSheets, state.config.spreadsheetId, fetchData]);

  const changeSheet = useCallback((sheetName: string) => {
    dispatch({ type: 'SET_CONFIG', payload: { currentSheet: sheetName } });
    dispatch({ type: 'ADD_LOG', payload: { message: `Pindah ke sheet: ${sheetName}`, type: 'info' } });
  }, []);

  const updateFilters = useCallback((filters: Partial<FilterState>) => {
    dispatch({ type: 'UPDATE_FILTERS', payload: filters });
  }, []);

  const addLog = useCallback((message: string, type: ActivityLog['type'] = 'info') => {
    dispatch({ type: 'ADD_LOG', payload: { message, type } });
  }, []);

  const clearLogs = useCallback(() => {
    dispatch({ type: 'CLEAR_LOGS' });
  }, []);

  // ✅ Load config & cache on mount
  useEffect(() => {
    loadConfig();
    
    // Load cached data immediately if available
    const cachedData = getCachedData();
    if (cachedData) {
      console.log('⚡ Loading cached data on mount');
      dispatch({ type: 'SET_DATA', payload: cachedData });
      dispatch({ type: 'SET_LAST_UPDATED', payload: new Date() });
    }
  }, [loadConfig, getCachedData]);

  // 🔥 AUTO-FETCH when config changes (new spreadsheet ID or sheet name)
  // Track previous ID to detect when it actually changed
  const prevSidRef = useRef<string>(state.config.spreadsheetId);
  
  useEffect(() => {
    const { spreadsheetId, currentSheet } = state.config;
    const prevSid = prevSidRef.current;
    const sidChanged: boolean = !!(spreadsheetId && spreadsheetId !== prevSid);
    
    // Update ref
    prevSidRef.current = spreadsheetId;
    
    if (spreadsheetId && currentSheet && !state.data) {
      console.log('🚀 Auto-fetching data after config change:', { spreadsheetId, currentSheet, sidChanged });
      
      // Force refresh if spreadsheet ID actually changed
      fetchData(sidChanged);
    }
  }, [state.config.spreadsheetId, state.config.currentSheet, state.data, fetchData]);

  const value: AppContextType = {
    ...state,
    loadConfig,
    saveConfig,
    fetchData,
    changeSheet,
    updateFilters,
    addLog,
    clearLogs,
    clearCache  // ✅ Expose cache clear function
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
