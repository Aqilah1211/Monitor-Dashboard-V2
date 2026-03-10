/**
 * SchoolSearch Component
 * Advanced search bar dengan mode selection, suggestions, dan keyboard shortcuts
 * Responsive design untuk semua device
 */

import React, { useEffect, useState } from 'react';
import { Search, X, Loader, ChevronDown } from 'lucide-react';
import { SearchMode } from '../../types/school';
import { logger } from '../../utils/logger';

interface SchoolSearchProps {
  query: string;
  searchType: SearchMode;
  isSearching: boolean;
  resultsCount: number;
  totalCount: number;
  onSearch: (query: string, type: SearchMode) => void;
  onClear: () => void;
  onSearchTypeChange: (type: SearchMode) => void;
  searchHistory?: Array<{ query: string; timestamp: Date; count: number }>;
  onHistorySelect?: (query: string) => void;
}

const SEARCH_MODES: { value: SearchMode; label: string; description: string }[] = [
  { value: 'all', label: 'Semua', description: 'Cari di semua field' },
  { value: 'npsn', label: 'NPSN', description: 'Cari berdasarkan NPSN' },
  { value: 'name', label: 'Nama Sekolah', description: 'Cari berdasarkan nama' },
];

export const SchoolSearch: React.FC<SchoolSearchProps> = ({
  query,
  searchType,
  isSearching,
  resultsCount,
  totalCount,
  onSearch,
  onClear,
  onSearchTypeChange,
  searchHistory = [],
  onHistorySelect,
}) => {
  const [showModeMenu, setShowModeMenu] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [localQuery, setLocalQuery] = useState(query);

  /**
   * Handle input change
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalQuery(value);
    onSearch(value, searchType);
    setShowHistory(false);
  };

  /**
   * Handle clear
   */
  const handleClear = () => {
    setLocalQuery('');
    onClear();
    setShowHistory(false);
  };

  /**
   * Handle search type change
   */
  const handleSearchTypeChange = (type: SearchMode) => {
    onSearchTypeChange(type);
    setShowModeMenu(false);
    logger.debug('SchoolSearch: Search type changed', { type });
  };

  /**
   * Handle history selection
   */
  const handleHistorySelect = (q: string) => {
    setLocalQuery(q);
    onSearch(q, searchType);
    setShowHistory(false);
    onHistorySelect?.(q);
    logger.debug('SchoolSearch: Selected from history', { query: q });
  };

  /**
   * Update local query when prop changes
   */
  useEffect(() => {
    setLocalQuery(query);
  }, [query]);

  const currentMode = SEARCH_MODES.find((m) => m.value === searchType);
  const hasResults = resultsCount > 0 && localQuery.trim();
  const hasNoResults = resultsCount === 0 && localQuery.trim();

  return (
    <div className="w-full">
      {/* Main Search Bar */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex items-stretch gap-0">
          {/* Search Input */}
          <div className="flex-1 flex items-center gap-3 px-4 py-3">
            <Search
              size={20}
              className={`text-gray-400 transition-colors ${isSearching ? 'text-blue-500' : ''}`}
            />
            <input
              type="text"
              placeholder="Cari sekolah (NPSN atau nama)... (Ctrl+K)"
              value={localQuery}
              onChange={handleInputChange}
              onFocus={() => localQuery && setShowHistory(true)}
              className="flex-1 bg-transparent outline-none text-sm text-gray-900 placeholder-gray-500"
              data-search-input
              aria-label="Pencarian sekolah"
            />

            {/* Clear Button */}
            {localQuery && (
              <button
                onClick={handleClear}
                className="p-1 hover:bg-gray-100 rounded-md transition-colors text-gray-500 hover:text-gray-700"
                title="Clear search (Esc)"
              >
                <X size={18} />
              </button>
            )}

            {/* Loading Indicator */}
            {isSearching && (
              <div className="p-1">
                <Loader size={18} className="text-blue-500 animate-spin" />
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="w-px bg-gray-200" />

          {/* Search Mode Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowModeMenu(!showModeMenu)}
              className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap"
            >
              <span>{currentMode?.label}</span>
              <ChevronDown
                size={16}
                className={`transition-transform ${showModeMenu ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Mode Menu */}
            {showModeMenu && (
              <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="p-2">
                  {SEARCH_MODES.map((mode) => (
                    <button
                      key={mode.value}
                      onClick={() => handleSearchTypeChange(mode.value)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        searchType === mode.value
                          ? 'bg-blue-100 text-blue-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className="font-medium">{mode.label}</div>
                      <div className="text-xs text-gray-500">{mode.description}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Search Stats */}
        {localQuery.trim() && (
          <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            {hasResults && (
              <p className="text-xs text-gray-600">
                Ditemukan <span className="font-semibold text-gray-900">{resultsCount}</span> dari{' '}
                <span className="font-semibold text-gray-900">{totalCount}</span> sekolah
              </p>
            )}
            {hasNoResults && (
              <p className="text-xs text-orange-600">
                Tidak ada hasil untuk "{localQuery}" (Mode: {currentMode?.label})
              </p>
            )}
            <span className="text-xs text-gray-500">
              Tekan <kbd className="bg-gray-200 px-2 py-0.5 rounded">Esc</kbd> untuk hapus
            </span>
          </div>
        )}
      </div>

      {/* Search History */}
      {showHistory && searchHistory.length > 0 && !localQuery && (
        <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div className="px-4 py-2 border-b border-gray-200 bg-gray-50">
            <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Riwayat Pencarian</h4>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {searchHistory.slice(0, 10).map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleHistorySelect(item.query)}
                className="w-full text-left px-4 py-2.5 flex items-center justify-between hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-0"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <Search size={16} className="text-gray-400 flex-shrink-0" />
                  <span className="text-sm text-gray-900 truncate">{item.query}</span>
                </div>
                <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                  {item.count} hasil
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Help Text / Keyboard Shortcuts */}
      {!localQuery && (
        <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
          <div className="flex items-center gap-2 text-gray-500">
            <kbd className="bg-gray-200 px-2 py-1 rounded text-gray-700 font-mono">Ctrl+K</kbd>
            <span>Fokus pencarian</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <kbd className="bg-gray-200 px-2 py-1 rounded text-gray-700 font-mono">Esc</kbd>
            <span>Hapus pencarian</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <span className="font-medium text-gray-700">Tip:</span>
            <span>Ubah mode pencarian untuk hasil lebih spesifik</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchoolSearch;
