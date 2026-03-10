/**
 * DateFilterControl - Komponen UI untuk mengontrol date filter dashboard
 * Terhubung dengan DateFilterContext untuk state management
 */

import { useState, useEffect } from 'react';
import { Calendar, X } from 'lucide-react';
import { useDateFilter } from '@/context/DateFilterContext';
import { formatDateID } from '@/utils/dateUtils';

/**
 * DateFilterControl Component
 * Menyediakan UI untuk memilih periode atau custom date range
 */
export default function DateFilterControl() {
  const { startDate, endDate, period, setPeriod, setCustomRange, reset } =
    useDateFilter();

  // Local state untuk custom range input
  const [tempStartDate, setTempStartDate] = useState<string>('');
  const [tempEndDate, setTempEndDate] = useState<string>('');
  const [showCustomInput, setShowCustomInput] = useState(period === 'custom');

  /**
   * Convert Date ke string format YYYY-MM-DD untuk input type="date"
   */
  const dateToInputFormat = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  /**
   * Convert string YYYY-MM-DD ke Date object
   */
  const inputFormatToDate = (dateString: string): Date | null => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString + 'T00:00:00');
      return date;
    } catch (error) {
      console.error('Error parsing date:', error);
      return null;
    }
  };

  /**
   * Initialize temporary dates saat custom dipilih
   */
  useEffect(() => {
    if (period === 'custom') {
      setShowCustomInput(true);
      setTempStartDate(dateToInputFormat(startDate));
      setTempEndDate(dateToInputFormat(endDate));
    } else {
      setShowCustomInput(false);
    }
  }, [period, startDate, endDate]);

  /**
   * Handle preset period button click
   */
  const handlePeriodSelect = (selectedPeriod: 'today' | 'week' | 'month') => {
    setPeriod(selectedPeriod);
    setShowCustomInput(false);
  };

  /**
   * Handle custom period button click
   */
  const handleCustomClick = () => {
    if (!showCustomInput) {
      setShowCustomInput(true);
      setTempStartDate(dateToInputFormat(startDate));
      setTempEndDate(dateToInputFormat(endDate));
    } else {
      setShowCustomInput(false);
    }
  };

  /**
   * Apply custom date range
   */
  const handleApplyCustomRange = () => {
    const start = inputFormatToDate(tempStartDate);
    const end = inputFormatToDate(tempEndDate);

    if (start && end) {
      setCustomRange(start, end);
      setShowCustomInput(false);
    } else {
      alert('Mohon pilih tanggal awal dan akhir yang valid');
    }
  };

  /**
   * Cancel custom input
   */
  const handleCancelCustom = () => {
    setShowCustomInput(false);
    setTempStartDate(dateToInputFormat(startDate));
    setTempEndDate(dateToInputFormat(endDate));
  };

  /**
   * Get period label untuk display
   */
  const getPeriodLabel = (p: string) => {
    switch (p) {
      case 'today':
        return 'Hari Ini';
      case 'week':
        return 'Minggu Ini';
      case 'month':
        return 'Bulan Ini';
      case 'custom':
        return 'Kustom';
      default:
        return '';
    }
  };

  /**
   * Button style based on active state
   */
  const getButtonClass = (isActive: boolean) => {
    if (isActive) {
      return 'bg-blue-600 text-white border border-blue-600 hover:bg-blue-700';
    }
    return 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50';
  };

  return (
    <div className="w-full space-y-3">
      {/* Preset Period Buttons */}
      <div className="flex flex-col gap-2 md:flex-row md:gap-3">
        {/* Hari Ini Button */}
        <button
          onClick={() => handlePeriodSelect('today')}
          className={`flex-1 px-3 py-2 rounded-md font-medium transition-colors text-sm md:text-base ${getButtonClass(
            period === 'today'
          )}`}
        >
          Hari Ini
        </button>

        {/* Minggu Ini Button */}
        <button
          onClick={() => handlePeriodSelect('week')}
          className={`flex-1 px-3 py-2 rounded-md font-medium transition-colors text-sm md:text-base ${getButtonClass(
            period === 'week'
          )}`}
        >
          Minggu Ini
        </button>

        {/* Bulan Ini Button */}
        <button
          onClick={() => handlePeriodSelect('month')}
          className={`flex-1 px-3 py-2 rounded-md font-medium transition-colors text-sm md:text-base ${getButtonClass(
            period === 'month'
          )}`}
        >
          Bulan Ini
        </button>

        {/* Kustom Button */}
        <button
          onClick={handleCustomClick}
          className={`flex-1 px-3 py-2 rounded-md font-medium transition-colors text-sm md:text-base flex items-center justify-center gap-2 ${getButtonClass(
            period === 'custom'
          )}`}
        >
          <Calendar size={16} />
          Kustom
        </button>
      </div>

      {/* Custom Date Range Inputs */}
      {showCustomInput && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-md space-y-3">
          <div className="flex flex-col gap-2 md:flex-row md:gap-3 md:items-center">
            {/* Start Date Input */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dari Tanggal
              </label>
              <input
                type="date"
                value={tempStartDate}
                onChange={(e) => setTempStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* End Date Input */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sampai Tanggal
              </label>
              <input
                type="date"
                value={tempEndDate}
                onChange={(e) => setTempEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 justify-end">
            <button
              onClick={handleCancelCustom}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              onClick={handleApplyCustomRange}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            >
              Terapkan
            </button>
          </div>
        </div>
      )}

      {/* Display Selected Date Range */}
      <div className="flex items-center justify-between pt-2 px-3 py-2 bg-gray-50 rounded-md border border-gray-200">
        <div className="text-sm text-gray-700">
          <span className="font-medium">{getPeriodLabel(period)}:</span>
          <span className="ml-2 text-gray-600">
            {formatDateID(startDate)} - {formatDateID(endDate)}
          </span>
        </div>

        {/* Reset Button */}
        {period !== 'week' && (
          <button
            onClick={reset}
            className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors"
            title="Reset ke minggu ini"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Day Count Info */}
      <div className="text-xs text-gray-500 px-3">
        <span>
          {Math.ceil(
            (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
          ) + 1}{' '}
          hari terpilih
        </span>
      </div>
    </div>
  );
}
