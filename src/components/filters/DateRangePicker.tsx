import React, { useState } from 'react';
import { ChevronDown, Calendar } from 'lucide-react';
import { useUnifiedFilter } from '../../hooks/useUnifiedFilter';
import {
  getDateRange,
  formatDateRangeID,
  getDaysDifference,
  DateRangeType,
} from '../../lib/filterUtils';
import { logger } from '../../utils/logger';

/**
 * DateRangePicker Component
 * Provides preset date range selection and custom date range options
 * Integrates with useUnifiedFilter hook for state management
 */

interface DateRangePreset {
  label: string;
  type: DateRangeType;
  description?: string;
}

const DATE_RANGE_PRESETS: DateRangePreset[] = [
  { label: 'Hari Ini', type: 'today', description: 'Data hari ini' },
  { label: 'Kemarin', type: 'yesterday', description: 'Data kemarin' },
  { label: 'Minggu Ini', type: 'thisWeek', description: 'Senin - Hari ini' },
  { label: 'Minggu Lalu', type: 'lastWeek', description: '7 hari terakhir' },
  { label: 'Bulan Ini', type: 'thisMonth', description: '1 - Hari ini (bulan ini)' },
  { label: 'Bulan Lalu', type: 'lastMonth', description: '30 hari terakhir' },
  { label: 'Tahun Ini', type: 'thisYear', description: 'Jan - Hari ini (tahun ini)' },
];

export const DateRangePicker: React.FC = () => {
  const filter = useUnifiedFilter();
  const [isOpen, setIsOpen] = useState(false);
  const [showCustom, setShowCustom] = useState(false);
  const [customStart, setCustomStart] = useState<string>(
    filter.dateRange?.start instanceof Date
      ? filter.dateRange.start.toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0]
  );
  const [customEnd, setCustomEnd] = useState<string>(
    filter.dateRange?.end instanceof Date
      ? filter.dateRange.end.toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0]
  );

  /**
   * Handle preset selection
   */
  const handlePresetSelect = (type: DateRangeType) => {
    try {
      const range = getDateRange(type);
      filter.setDateRange(range);
      setShowCustom(false);
      setIsOpen(false);
      logger.debug('DateRangePicker: Preset selected', { type });
    } catch (error) {
      logger.error('DateRangePicker: Failed to select preset', { type, error });
    }
  };

  /**
   * Handle custom date range apply
   */
  const handleCustomApply = () => {
    try {
      const startDate = new Date(customStart);
      const endDate = new Date(customEnd);

      // Validate dates
      if (startDate > endDate) {
        logger.warn('DateRangePicker: Custom date range invalid', {
          start: customStart,
          end: customEnd,
        });
        return;
      }

      // Set custom date range
      filter.setDateRange({ start: startDate, end: endDate });
      setShowCustom(false);
      setIsOpen(false);
      logger.debug('DateRangePicker: Custom date range applied', { startDate, endDate });
    } catch (error) {
      logger.error('DateRangePicker: Failed to apply custom date range', { error });
    }
  };

  /**
   * Reset to today
   */
  const handleReset = () => {
    try {
      const range = getDateRange('today');
      filter.setDateRange(range);
      setShowCustom(false);
      setIsOpen(false);
      logger.debug('DateRangePicker: Reset to today');
    } catch (error) {
      logger.error('DateRangePicker: Failed to reset date range', { error });
    }
  };

  /**
   * Get current range display text
   */
  const getCurrentRangeText = (): string => {
    if (!filter.dateRange) return 'Pilih Tanggal';

    // Check if matches any preset
    for (const preset of DATE_RANGE_PRESETS) {
      const presetRange = getDateRange(preset.type);
      if (
        presetRange.start.getTime() === filter.dateRange.start.getTime() &&
        presetRange.end.getTime() === filter.dateRange.end.getTime()
      ) {
        return preset.label;
      }
    }

    // Return custom range formatted
    return formatDateRangeID(filter.dateRange);
  };

  /**
   * Get current range info text
   */
  const getRangeInfo = (): string => {
    if (!filter.dateRange) return '';

    const daysDiff = getDaysDifference(filter.dateRange.start, filter.dateRange.end);
    const dayText = daysDiff === 1 ? 'hari' : 'hari';

    return `(${daysDiff} ${dayText})`;
  };

  return (
    <div className="relative inline-block w-full sm:w-auto">
      {/* Main Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full sm:w-auto flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 transition-all duration-200 ${
          isOpen
            ? 'border-blue-500 bg-blue-50 text-blue-700'
            : 'border-gray-300 bg-white text-gray-700 hover:border-blue-400'
        }`}
      >
        <Calendar size={18} />
        <div className="flex flex-col items-start">
          <span className="text-sm font-medium">{getCurrentRangeText()}</span>
          <span className="text-xs text-gray-500">{getRangeInfo()}</span>
        </div>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-4">
            {/* Preset Options */}
            {!showCustom && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Pilihan Cepat</h3>

                {/* Preset Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  {DATE_RANGE_PRESETS.map((preset) => (
                    <button
                      key={preset.type}
                      onClick={() => handlePresetSelect(preset.type)}
                      className="p-2 text-left rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all"
                    >
                      <div className="text-sm font-medium text-gray-700">{preset.label}</div>
                      {preset.description && (
                        <div className="text-xs text-gray-500">{preset.description}</div>
                      )}
                    </button>
                  ))}
                </div>

                {/* Custom Date Range Option */}
                <button
                  onClick={() => setShowCustom(true)}
                  className="w-full mt-4 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  Rentang Kustom
                </button>

                {/* Reset Button */}
                <button
                  onClick={handleReset}
                  className="w-full px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Reset
                </button>
              </div>
            )}

            {/* Custom Date Range Form */}
            {showCustom && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-700">Rentang Kustom</h3>

                <div className="space-y-2">
                  <label className="block text-xs font-medium text-gray-600">Tanggal Mulai</label>
                  <input
                    type="date"
                    value={customStart}
                    onChange={(e) => setCustomStart(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-medium text-gray-600">Tanggal Akhir</label>
                  <input
                    type="date"
                    value={customEnd}
                    onChange={(e) => setCustomEnd(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setShowCustom(false)}
                    className="flex-1 px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleCustomApply}
                    className="flex-1 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={customStart > customEnd}
                  >
                    Terapkan
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Close hint */}
          <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 rounded-b-lg">
            <p className="text-xs text-gray-500">Klik di luar untuk menutup</p>
          </div>
        </div>
      )}

      {/* Overlay to close dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default DateRangePicker;
