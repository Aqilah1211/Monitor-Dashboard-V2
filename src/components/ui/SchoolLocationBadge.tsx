import { useState } from 'react';
import { MapPin } from 'lucide-react';
import { getSchoolLocation } from '@/data/schoolLocations';
import { extractProvinceFromSchoolName } from '@/utils/schoolLocationUtils';

interface SchoolLocationBadgeProps {
  schoolName: string;
}

export default function SchoolLocationBadge({
  schoolName,
}: SchoolLocationBadgeProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  // Try to get location from database
  const schoolLocation = getSchoolLocation(schoolName);

  let displayText: string;
  let tooltipText: string;
  let isFound = true;

  if (schoolLocation) {
    displayText = `${schoolLocation.province} - ${schoolLocation.city}`;
    tooltipText = `📍 ${schoolLocation.province}\n${schoolLocation.city}\n${schoolLocation.district}`;
  } else {
    // Try to extract province from school name
    const province = extractProvinceFromSchoolName(schoolName);
    if (province) {
      displayText = province;
      tooltipText = `Provinsi: ${province}`;
    } else {
      displayText = 'Lokasi tidak diketahui';
      tooltipText = 'Lokasi sekolah tidak dapat dideteksi';
      isFound = false;
    }
  }

  return (
    <div className="relative inline-block">
      <div
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium cursor-help transition-colors duration-200 ${
          isFound
            ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
        }`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
        <span className="truncate">{displayText}</span>
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-md whitespace-pre-line pointer-events-none shadow-lg">
          {tooltipText}
          {/* Tooltip Arrow */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
        </div>
      )}
    </div>
  );
}
