import { Calendar } from 'lucide-react';
import { format, isToday, isSameDay } from 'date-fns';
import { id } from 'date-fns/locale';

interface DateRangeDisplayProps {
  startDate: Date;
  endDate: Date;
}

export default function DateRangeDisplay({ startDate, endDate }: DateRangeDisplayProps) {
  const formatDateIndonesia = (date: Date, formatStr: string) => {
    return format(date, formatStr, { locale: id });
  };

  let displayText: string;

  // Jika tanggal sama
  if (isSameDay(startDate, endDate)) {
    // Jika hari ini
    if (isToday(startDate)) {
      displayText = `Hari Ini (${formatDateIndonesia(startDate, 'd MMM yyyy')})`;
    } else {
      displayText = formatDateIndonesia(startDate, 'd MMMM yyyy');
    }
  } else {
    // Jika berbeda, tampilkan range
    const start = formatDateIndonesia(startDate, 'd MMMM yyyy');
    const end = formatDateIndonesia(endDate, 'd MMMM yyyy');
    displayText = `${start} - ${end}`;
  }

  return (
    <div className="flex items-center gap-2 text-slate-700">
      <Calendar className="w-4 h-4 text-slate-600" />
      <span className="text-sm font-medium">{displayText}</span>
    </div>
  );
}
