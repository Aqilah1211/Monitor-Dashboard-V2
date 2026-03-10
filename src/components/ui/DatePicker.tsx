import { useState, useCallback } from 'react';
import { Calendar } from 'lucide-react';
import { format, addDays, startOfMonth, endOfMonth, subDays } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

interface DatePickerProps {
  // Callback saat range berubah
  onChange: (dates: { startDate: Date; endDate: Date }) => void;

  // Nilai awal (optional)
  initialStartDate?: Date;
  initialEndDate?: Date;

  // Label untuk input (optional)
  label?: string;
}

export default function DatePicker({
  onChange,
  initialStartDate,
  initialEndDate,
  label = 'Rentang Tanggal'
}: DatePickerProps) {
  const today = new Date();
  
  // State untuk tanggal
  const [startDate, setStartDate] = useState<Date>(
    initialStartDate || subDays(today, 7)
  );
  const [endDate, setEndDate] = useState<Date>(
    initialEndDate || today
  );

  // State untuk error validation
  const [error, setError] = useState<string>('');

  // Handle perubahan tanggal mulai
  const handleStartDateChange = useCallback((value: string) => {
    try {
      // Parse DD/MM/YYYY
      const [day, month, year] = value.split('/');
      const newDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

      if (isNaN(newDate.getTime())) {
        setError('Format tanggal tidak valid');
        return;
      }

      // Validasi: tanggal mulai tidak boleh > tanggal akhir
      if (newDate > endDate) {
        setError('Tanggal mulai tidak boleh lebih besar dari tanggal akhir');
        return;
      }

      setStartDate(newDate);
      setError('');
      onChange({ startDate: newDate, endDate });
    } catch {
      setError('Format tanggal tidak valid (DD/MM/YYYY)');
    }
  }, [endDate, onChange]);

  // Handle perubahan tanggal akhir
  const handleEndDateChange = useCallback((value: string) => {
    try {
      // Parse DD/MM/YYYY
      const [day, month, year] = value.split('/');
      const newDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

      if (isNaN(newDate.getTime())) {
        setError('Format tanggal tidak valid');
        return;
      }

      // Validasi: tanggal akhir tidak boleh < tanggal mulai
      if (newDate < startDate) {
        setError('Tanggal akhir tidak boleh lebih kecil dari tanggal mulai');
        return;
      }

      setEndDate(newDate);
      setError('');
      onChange({ startDate, endDate: newDate });
    } catch {
      setError('Format tanggal tidak valid (DD/MM/YYYY)');
    }
  }, [startDate, onChange]);

  // Preset buttons dengan fungsi
  const presets = [
    {
      label: 'Hari Ini',
      apply: () => {
        const today = new Date();
        setStartDate(today);
        setEndDate(today);
        setError('');
        onChange({ startDate: today, endDate: today });
      }
    },
    {
      label: 'Kemarin',
      apply: () => {
        const yesterday = subDays(new Date(), 1);
        setStartDate(yesterday);
        setEndDate(yesterday);
        setError('');
        onChange({ startDate: yesterday, endDate: yesterday });
      }
    },
    {
      label: '7 Hari Terakhir',
      apply: () => {
        const end = new Date();
        const start = subDays(end, 7);
        setStartDate(start);
        setEndDate(end);
        setError('');
        onChange({ startDate: start, endDate: end });
      }
    },
    {
      label: '30 Hari Terakhir',
      apply: () => {
        const end = new Date();
        const start = subDays(end, 30);
        setStartDate(start);
        setEndDate(end);
        setError('');
        onChange({ startDate: start, endDate: end });
      }
    },
    {
      label: 'Bulan Ini',
      apply: () => {
        const start = startOfMonth(new Date());
        const end = endOfMonth(new Date());
        setStartDate(start);
        setEndDate(end);
        setError('');
        onChange({ startDate: start, endDate: end });
      }
    }
  ];

  // Format tanggal ke DD/MM/YYYY
  const formatDate = (date: Date): string => {
    return format(date, 'dd/MM/yyyy', { locale: idLocale });
  };

  return (
    <div className="space-y-3 w-full">
      {/* Label */}
      <label className="block text-sm font-bold text-slate-700">{label}</label>

      {/* Preset Buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        {presets.map((preset) => (
          <button
            key={preset.label}
            onClick={preset.apply}
            className="px-3 py-2 text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Date Inputs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Start Date Input */}
        <div className="relative">
          <label className="block text-xs font-semibold text-slate-600 mb-2">
            Tanggal Mulai
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="DD/MM/YYYY"
              value={formatDate(startDate)}
              onChange={(e) => handleStartDateChange(e.target.value)}
              className="w-full px-4 py-3 pr-10 bg-white border-2 border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-sm font-medium"
            />
            <Calendar className="absolute right-3 top-3 w-5 h-5 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* End Date Input */}
        <div className="relative">
          <label className="block text-xs font-semibold text-slate-600 mb-2">
            Tanggal Akhir
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="DD/MM/YYYY"
              value={formatDate(endDate)}
              onChange={(e) => handleEndDateChange(e.target.value)}
              className="w-full px-4 py-3 pr-10 bg-white border-2 border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-sm font-medium"
            />
            <Calendar className="absolute right-3 top-3 w-5 h-5 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-lg p-3">
          <p className="text-xs text-rose-600 font-medium">⚠️ {error}</p>
        </div>
      )}

      {/* Display Range Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-xs text-blue-700 font-medium">
          📅 Range: {formatDate(startDate)} hingga {formatDate(endDate)}
          {' '}
          <span className="text-blue-600">
            ({Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1} hari)
          </span>
        </p>
      </div>
    </div>
  );
}
