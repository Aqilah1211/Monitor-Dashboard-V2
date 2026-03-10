import { MapPin, Building2, Map } from 'lucide-react';
import { getSchoolLocation } from '@/utils/schoolLocationUtils';

interface SchoolLocationCardProps {
  schoolName: string;
  showMap?: boolean;
}

// Helper function to determine island by province
function getIslandColor(
  province: string
): { border: string; bg: string; indicator: string } {
  // Sumatera - Merah
  if (
    [
      'Aceh',
      'Sumatera Utara',
      'Sumatera Barat',
      'Riau',
      'Jambi',
      'Sumatera Selatan',
      'Bangka Belitung',
      'Lampung',
      'Kepulauan Riau',
    ].includes(province)
  ) {
    return {
      border: 'border-l-4 border-l-red-500',
      bg: 'bg-red-50',
      indicator: 'bg-red-100 text-red-800',
    };
  }

  // Jawa - Biru
  if (
    [
      'DKI Jakarta',
      'Jawa Barat',
      'Jawa Tengah',
      'DI Yogyakarta',
      'Jawa Timur',
      'Banten',
    ].includes(province)
  ) {
    return {
      border: 'border-l-4 border-l-blue-500',
      bg: 'bg-blue-50',
      indicator: 'bg-blue-100 text-blue-800',
    };
  }

  // Kalimantan - Hijau
  if (
    [
      'Kalimantan Barat',
      'Kalimantan Tengah',
      'Kalimantan Selatan',
      'Kalimantan Timur',
      'Kalimantan Utara',
    ].includes(province)
  ) {
    return {
      border: 'border-l-4 border-l-green-500',
      bg: 'bg-green-50',
      indicator: 'bg-green-100 text-green-800',
    };
  }

  // Sulawesi - Kuning
  if (
    [
      'Sulawesi Utara',
      'Gorontalo',
      'Sulawesi Tengah',
      'Sulawesi Selatan',
      'Sulawesi Tenggara',
    ].includes(province)
  ) {
    return {
      border: 'border-l-4 border-l-yellow-500',
      bg: 'bg-yellow-50',
      indicator: 'bg-yellow-100 text-yellow-800',
    };
  }

  // Bali & Nusa Tenggara - Ungu
  if (
    [
      'Bali',
      'Nusa Tenggara Barat',
      'Nusa Tenggara Timur',
    ].includes(province)
  ) {
    return {
      border: 'border-l-4 border-l-purple-500',
      bg: 'bg-purple-50',
      indicator: 'bg-purple-100 text-purple-800',
    };
  }

  // Maluku & Papua - Oranye
  if (
    [
      'Maluku',
      'Maluku Utara',
      'Papua Barat',
      'Papua',
    ].includes(province)
  ) {
    return {
      border: 'border-l-4 border-l-orange-500',
      bg: 'bg-orange-50',
      indicator: 'bg-orange-100 text-orange-800',
    };
  }

  // Default - Slate
  return {
    border: 'border-l-4 border-l-slate-300',
    bg: 'bg-slate-50',
    indicator: 'bg-slate-100 text-slate-700',
  };
}

export default function SchoolLocationCard({
  schoolName,
  showMap = true,
}: SchoolLocationCardProps) {
  const schoolLocation = getSchoolLocation(schoolName);

  if (!schoolLocation) {
    return (
      <div className="p-4 border-l-4 border-l-slate-300 bg-slate-50 rounded-r-lg shadow-sm">
        <p className="text-slate-600 text-sm">
          Informasi lokasi tidak tersedia untuk "{schoolName}"
        </p>
      </div>
    );
  }

  const colors = getIslandColor(schoolLocation.province);

  const handleOpenMaps = () => {
    const query = encodeURIComponent(
      `${schoolLocation.name}, ${schoolLocation.city}, ${schoolLocation.province}`
    );
    window.open(`https://www.google.com/maps/search/${query}`, '_blank');
  };

  return (
    <div
      className={`${colors.border} ${colors.bg} rounded-r-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200`}
    >
      <div className="p-4">
        {/* Nama Sekolah */}
        <div className="flex items-start gap-2 mb-3">
          <Building2 className="w-5 h-5 text-slate-600 flex-shrink-0 mt-0.5" />
          <h3 className="font-bold text-slate-900 text-base leading-tight">
            {schoolLocation.name}
          </h3>
        </div>

        {/* Lokasi Details */}
        <div className="space-y-2 ml-7">
          {/* Provinsi */}
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${colors.indicator}`}
            >
              <MapPin className="w-3.5 h-3.5" />
              {schoolLocation.province}
            </span>
          </div>

          {/* Kota */}
          <div className="flex items-center gap-2 text-sm text-slate-700">
            <span className="font-medium">📍 Kota:</span>
            <span>{schoolLocation.city}</span>
          </div>

          {/* Kecamatan */}
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span className="font-medium">🏘️ Kecamatan:</span>
            <span>{schoolLocation.district}</span>
          </div>
        </div>

        {/* Map Button */}
        {showMap && (
          <button
            onClick={handleOpenMaps}
            className="mt-4 w-full px-3 py-2 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
          >
            <Map className="w-4 h-4" />
            Lihat di Peta
          </button>
        )}
      </div>
    </div>
  );
}
