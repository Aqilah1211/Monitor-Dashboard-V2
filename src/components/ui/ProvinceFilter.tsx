import { useState, useRef, useEffect } from 'react';
import { MapPin, ChevronDown, Search, X } from 'lucide-react';
import { getProvinceStatistics } from '@/utils/schoolLocationUtils';

interface ProvinceFilterProps {
  onChange: (province: string) => void;
  defaultValue?: string;
  label?: string;
}

export default function ProvinceFilter({
  onChange,
  defaultValue = 'Semua Provinsi',
  label = 'Provinsi',
}: ProvinceFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState(defaultValue);
  const [searchQuery, setSearchQuery] = useState('');
  const [statistics, setStatistics] = useState<
    Array<{ province: string; code: string; count: number }>
  >([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Load province statistics
  useEffect(() => {
    const stats = getProvinceStatistics();
    setStatistics(stats);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Filter provinces based on search query
  const filteredProvinces = statistics.filter((stat) =>
    stat.province.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (province: string) => {
    setSelectedProvince(province);
    onChange(province);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleClear = () => {
    setSelectedProvince('Semua Provinsi');
    onChange('Semua Provinsi');
    setSearchQuery('');
  };

  return (
    <div className="w-full" ref={dropdownRef}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-2">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-slate-600" />
            {label}
          </div>
        </label>
      )}

      {/* Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2.5 flex items-center justify-between bg-white border border-slate-300 rounded-lg hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
      >
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-slate-600" />
          <span className="text-slate-700 font-medium">{selectedProvince}</span>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-slate-600 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-slate-300 rounded-lg shadow-lg">
          {/* Search Input */}
          <div className="sticky top-0 p-3 border-b border-slate-200 bg-white">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Cari provinsi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          {/* Options */}
          <div className="max-h-64 overflow-y-auto">
            {/* Semua Provinsi Option */}
            <button
              onClick={() => handleSelect('Semua Provinsi')}
              className={`w-full text-left px-4 py-2.5 hover:bg-blue-50 transition-colors duration-150 flex items-center justify-between group ${
                selectedProvince === 'Semua Provinsi'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-slate-700'
              }`}
            >
              <span className="font-medium">Semua Provinsi</span>
              <span className={`text-sm font-semibold ${
                selectedProvince === 'Semua Provinsi'
                  ? 'text-blue-600'
                  : 'text-slate-500 group-hover:text-slate-700'
              }`}>
                {statistics.reduce((sum, stat) => sum + stat.count, 0)}
              </span>
            </button>

            {/* Separator */}
            <div className="border-t border-slate-200 my-1" />

            {/* Province Options */}
            {filteredProvinces.length > 0 ? (
              filteredProvinces.map((stat) => (
                <button
                  key={stat.province}
                  onClick={() => handleSelect(stat.province)}
                  className={`w-full text-left px-4 py-2.5 hover:bg-blue-50 transition-colors duration-150 flex items-center justify-between group ${
                    selectedProvince === stat.province
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold bg-slate-200 text-slate-700 px-2 py-0.5 rounded group-hover:bg-slate-300 transition-colors">
                      {stat.code}
                    </span>
                    <span>{stat.province}</span>
                  </div>
                  <span className={`text-sm font-semibold ${
                    selectedProvince === stat.province
                      ? 'text-blue-600'
                      : 'text-slate-500 group-hover:text-slate-700'
                  }`}>
                    {stat.count}
                  </span>
                </button>
              ))
            ) : (
              <div className="px-4 py-6 text-center text-slate-500">
                <Search className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                <p className="text-sm">Provinsi tidak ditemukan</p>
              </div>
            )}
          </div>

          {/* Footer */}
          {selectedProvince !== 'Semua Provinsi' && (
            <div className="border-t border-slate-200 p-2 flex gap-2">
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 px-3 py-1.5 text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors font-medium"
              >
                Tutup
              </button>
              <button
                onClick={handleClear}
                className="flex-1 px-3 py-1.5 text-sm text-white bg-red-500 hover:bg-red-600 rounded transition-colors font-medium flex items-center justify-center gap-1"
              >
                <X className="w-4 h-4" />
                Reset
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
