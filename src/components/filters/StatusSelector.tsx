import React, { useMemo } from 'react';
import { Check } from 'lucide-react';
import { useUnifiedFilter } from '../../hooks/useUnifiedFilter';
import { STATUS_OPTIONS, getStatusLabel, getStatusColor } from '../../lib/filterUtils';
import { logger } from '../../utils/logger';

/**
 * StatusSelector Component
 * Checkbox group for filtering by installation status
 * Integrates with useUnifiedFilter hook for state management
 */

export const StatusSelector: React.FC = () => {
  const filter = useUnifiedFilter();

  /**
   * Handle status toggle
   */
  const handleToggleStatus = (status: string) => {
    try {
      if (filter.isStatusSelected(status)) {
        filter.removeStatus([status]);
        logger.debug('StatusSelector: Status removed', { status });
      } else {
        filter.addStatus([status]);
        logger.debug('StatusSelector: Status added', { status });
      }
    } catch (error) {
      logger.error('StatusSelector: Failed to toggle status', { status, error });
    }
  };

  /**
   * Select all statuses
   */
  const handleSelectAll = () => {
    try {
      const allStatuses = STATUS_OPTIONS.map((opt) => opt.id);
      filter.setStatus(allStatuses);
      logger.debug('StatusSelector: All statuses selected', { count: allStatuses.length });
    } catch (error) {
      logger.error('StatusSelector: Failed to select all', { error });
    }
  };

  /**
   * Clear all statuses
   */
  const handleClearAll = () => {
    try {
      filter.clearStatus();
      logger.debug('StatusSelector: All statuses cleared');
    } catch (error) {
      logger.error('StatusSelector: Failed to clear all', { error });
    }
  };

  /**
   * Get selected status count
   */
  const selectedCount = useMemo(() => {
    return filter.getDetailedFilterCount().status;
  }, [filter.getDetailedFilterCount().status]);

  /**
   * Get display text
   */
  const getDisplayText = (): string => {
    if (selectedCount === 0) return 'Pilih Status';
    if (selectedCount === STATUS_OPTIONS.length) return 'Semua Status';
    return `${selectedCount} Status Dipilih`;
  };

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-700">Status Instalasi</h3>
        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
          {getDisplayText()}
        </span>
      </div>

      {/* Status Options */}
      <div className="space-y-2 mb-4">
        {STATUS_OPTIONS.map((option) => {
          const isSelected = filter.isStatusSelected(option.id);
          const statusColor = getStatusColor(option.id);

          return (
            <label
              key={option.id}
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 cursor-pointer transition-all"
            >
              {/* Custom Checkbox */}
              <div
                className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                  isSelected
                    ? 'border-blue-600 bg-blue-600'
                    : 'border-gray-300 bg-white hover:border-blue-400'
                }`}
              >
                {isSelected && <Check size={16} className="text-white" />}
              </div>

              {/* Status Info */}
              <div className="flex items-center gap-3 flex-1">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: statusColor }}
                />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-700">
                    {getStatusLabel(option.id)}
                  </div>
                  <div className="text-xs text-gray-500">{option.icon} {option.label}</div>
                </div>
              </div>

              {/* Hidden checkbox for form support */}
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => handleToggleStatus(option.id)}
                className="hidden"
              />
            </label>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-3 border-t border-gray-200">
        <button
          onClick={handleSelectAll}
          className="flex-1 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
        >
          Pilih Semua
        </button>
        <button
          onClick={handleClearAll}
          className="flex-1 px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Hapus Semua
        </button>
      </div>

      {/* Info Text */}
      <div className="mt-3 p-2 bg-blue-50 rounded-lg">
        <p className="text-xs text-blue-700">
          💡 Pilih satu atau lebih status untuk memfilter data instalasi
        </p>
      </div>
    </div>
  );
};

export default StatusSelector;
