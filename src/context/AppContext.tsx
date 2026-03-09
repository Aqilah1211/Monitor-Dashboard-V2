import { createContext, useContext, useReducer, ReactNode, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useGoogleSheets } from '../hooks/useGoogleSheets';
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

  const saveConfig = useCallback((newConfig: Partial<SheetConfig>) => {
    if (newConfig.spreadsheetId !== undefined) setStoredSid(newConfig.spreadsheetId);
    if (newConfig.sheetList !== undefined) setStoredSheets(newConfig.sheetList.join(','));
    dispatch({ type: 'SET_CONFIG', payload: newConfig });
    console.log('✅ Config saved:', newConfig);
  }, [setStoredSid, setStoredSheets]);

  const fetchData = useCallback(async () => {
    const { spreadsheetId, currentSheet } = state.config;
    
    console.log('🚀 Start fetchData:', { spreadsheetId, currentSheet });
    
    if (!spreadsheetId || !currentSheet) {
      const msg = 'Sheet ID atau nama sheet belum diatur';
      console.error('❌', msg);
      dispatch({ type: 'SET_ERROR', payload: msg });
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'ADD_LOG', payload: { message: `Memuat data dari "${currentSheet}"...`, type: 'info' } });

    try {
      const data = await fetchSheetData(spreadsheetId, currentSheet);
      console.log('📦 Data fetched successfully:', data);
      dispatch({ type: 'SET_DATA', payload: data });
      dispatch({ type: 'SET_LAST_UPDATED', payload: new Date() });
      dispatch({ type: 'ADD_LOG', payload: { message: `Data "${currentSheet}" berhasil dimuat (${data.all.length} items)`, type: 'success' } });
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ Fetch failed:', errMsg);
      dispatch({ type: 'SET_ERROR', payload: errMsg });
      dispatch({ type: 'ADD_LOG', payload: { message: `Gagal memuat data: ${errMsg}`, type: 'error' } });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.config, fetchSheetData]);

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

  const value: AppContextType = {
    ...state,
    loadConfig,
    saveConfig,
    fetchData,
    changeSheet,
    updateFilters,
    addLog,
    clearLogs
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
