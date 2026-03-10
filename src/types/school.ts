/**
 * School Types and Interfaces
 * Comprehensive type definitions for school data and search functionality
 */

/**
 * Status type untuk instalasi sekolah
 */
export type SchoolStatus = 'installed' | 'pending' | 'in_progress' | 'problem';

/**
 * Mode pencarian sekolah
 */
export type SearchMode = 'all' | 'npsn' | 'name';

/**
 * Interface untuk data sekolah
 */
export interface School {
  id: string;
  npsn: string;
  schoolName: string;
  province: string;
  city?: string;
  district?: string;
  address?: string;
  status: SchoolStatus;
  problemDetail?: string;
  installationDate?: string;
  createdAt: string;
  updatedAt: string;
  // Fields dari data yang ada
  nama?: string;
  direktorat?: string;
  tanggal?: string;
  kendala?: string;
  [key: string]: any;
}

/**
 * Interface untuk filter pencarian
 */
export interface SearchFilters {
  query: string;
  searchType: SearchMode;
  province?: string;
  status?: SchoolStatus;
  dateFrom?: string;
  dateTo?: string;
}

/**
 * Interface untuk hasil pencarian
 */
export interface SearchResults {
  data: School[];
  total: number;
  filtered: number;
  query: string;
  searchType: SearchMode;
}

/**
 * Interface untuk statistik pencarian
 */
export interface SearchStatistics {
  totalSchools: number;
  installedCount: number;
  pendingCount: number;
  inProgressCount: number;
  problemCount: number;
  searchTime: number;
}

/**
 * Interface untuk highlight dalam pencarian
 */
export interface HighlightedText {
  text: string;
  isHighlighted: boolean;
}

/**
 * Interface untuk history pencarian
 */
export interface SearchHistory {
  query: string;
  timestamp: Date;
  resultsCount: number;
}
