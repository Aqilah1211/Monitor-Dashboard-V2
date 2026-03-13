export interface SchoolData {
  id: number;
  npsn: string;
  nama: string;
  direktorat: string;
  tanggal: string;
  status: string;
  kendala: string;
  raw: string[];
}

export interface ProcessedData {
  all: SchoolData[];
  installed: SchoolData[];
  pending: SchoolData[];
  trouble: SchoolData[];
}

export interface FilterState {
  search: string;
  dateStart: Date | null;
  dateEnd: Date | null;
}

export interface SheetConfig {
  spreadsheetId: string;
  sheetList: string[];
  currentSheet: string | null;
}

export interface ActivityLog {
  id: number;
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
  timestamp: Date;
}

export interface AppState {
  config: SheetConfig;
  data: ProcessedData | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  filters: FilterState;
  logs: ActivityLog[];
}

export interface AppContextType extends AppState {
  loadConfig: () => void;
  saveConfig: (config: Partial<SheetConfig>) => void;
  fetchData: () => Promise<void>;
  changeSheet: (sheetName: string) => void;
  updateFilters: (filters: Partial<FilterState>) => void;
  addLog: (message: string, type?: ActivityLog['type']) => void;
  clearLogs: () => void;
  clearCache: () => void;
}

export type TabType = 'overview' | 'trouble' | 'installed' | 'pending' | 'settings';
