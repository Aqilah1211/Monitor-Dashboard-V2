import React, { useState, useMemo } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';
import { useUnifiedFilter } from '../../hooks/useUnifiedFilter';
import { PROVINCES, getRegions, getProvincesByRegion, PROVINCE_COLORS } from '../../data/provinces';
import { logger } from '../../utils/logger';

/**
 * ProvinceMultiSelect Component
 * Multi-select dropdown for filtering by provinces with region grouping
 * Integrates with useUnifiedFilter hook for state management
 */

export const ProvinceMultiSelect: React.FC = () => {
  const filter = useUnifiedFilter();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRegions, setExpandedRegions] = useState<Set<string>>(new Set());

  // Get regions and organize provinces by region
  const regions = getRegions();

  // Filter provinces based on search term
  const filteredProvinces = useMemo(() => {
    const filtered: Record<string, typeof PROVINCES> = {};

    regions.forEach((region) => {
      const provincesByRegion = getProvincesByRegion(region);
      const filteredBySearch = provincesByRegion.filter((province) =>
        province.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      if (filteredBySearch.length > 0) {
        filtered[region] = filteredBySearch;
      }
    });

    return filtered;
  }, [searchTerm, regions]);

  /**
   * Toggle province selection
   */
  const handleToggleProvince = (provinceId: string) => {
    try {
      if (filter.isProvinceSelected(provinceId)) {
        filter.removeProvinces([provinceId]);
        logger.debug('ProvinceMultiSelect: Province removed', { provinceId });
      } else {
        filter.addProvinces([provinceId]);
        logger.debug('ProvinceMultiSelect: Province added', { provinceId });
      }
    } catch (error) {
      logger.error('ProvinceMultiSelect: Failed to toggle province', { provinceId, error });
    }
  };

  /**
   * Toggle region expansion
   */
  const handleToggleRegion = (region: string) => {
    const newExpandedRegions = new Set(expandedRegions);
    if (newExpandedRegions.has(region)) {
      newExpandedRegions.delete(region);
    } else {
      newExpandedRegions.add(region);
    }
    setExpandedRegions(newExpandedRegions);
  };

  /**
   * Select all provinces in a region
   */
  const handleSelectAllRegion = (region: string) => {
    try {
      const provincesByRegion = getProvincesByRegion(region);
      const provinceIds = provincesByRegion.map((p) => p.id);
      filter.addProvinces(provinceIds);
      logger.debug('ProvinceMultiSelect: Region selected', { region, count: provinceIds.length });
    } catch (error) {
      logger.error('ProvinceMultiSelect: Failed to select region', { region, error });
    }
  };

  /**
   * Deselect all provinces in a region
   */
  const handleDeselectAllRegion = (region: string) => {
    try {
      const provincesByRegion = getProvincesByRegion(region);
      const provinceIds = provincesByRegion.map((p) => p.id);
      filter.removeProvinces(provinceIds);
      logger.debug('ProvinceMultiSelect: Region deselected', { region, count: provinceIds.length });
    } catch (error) {
      logger.error('ProvinceMultiSelect: Failed to deselect region', { region, error });
    }
  };

  /**
   * Select all provinces
   */
  const handleSelectAll = () => {
    try {
      const allProvinceIds = PROVINCES.map((p) => p.id);
      filter.setProvinces(allProvinceIds);
      logger.debug('ProvinceMultiSelect: All provinces selected', { count: allProvinceIds.length });
    } catch (error) {
      logger.error('ProvinceMultiSelect: Failed to select all', { error });
    }
  };

  /**
   * Clear all selections
   */
  const handleClearAll = () => {
    try {
      filter.clearProvinces();
      logger.debug('ProvinceMultiSelect: All provinces cleared');
    } catch (error) {
      logger.error('ProvinceMultiSelect: Failed to clear all', { error });
    }
  };

  /**
   * Get display text for selected provinces
   */
  const getDisplayText = (): string => {
    const count = filter.getDetailedFilterCount().provinces;
    if (count === 0) return 'Pilih Provinsi';
    if (count === 1) {
      const province = PROVINCES.find((p) => filter.isProvinceSelected(p.id));
      return province?.name || 'Pilih Provinsi';
    }
    return `${count} Provinsi Dipilih`;
  };

  /**
   * Get selected province names for pills
   */
  const getSelectedProvinces = useMemo(() => {
    return PROVINCES.filter((p) => filter.isProvinceSelected(p.id));
  }, [filter.getDetailedFilterCount().provinces]);

  return (
    <div className="relative inline-block w-full sm:w-auto">
      {/* Main Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full sm:w-auto flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 transition-all duration-200 ${
          isOpen
            ? 'border-green-500 bg-green-50 text-green-700'
            : 'border-gray-300 bg-white text-gray-700 hover:border-green-400'
        }`}
      >
        <div className="flex items-center gap-2 flex-1">
          <div className="w-4 h-4 rounded-full bg-gradient-to-r from-green-400 to-green-600" />
          <span className="text-sm font-medium">{getDisplayText()}</span>
        </div>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Selected Provinces Pills */}
      {getSelectedProvinces.length > 0 && !isOpen && (
        <div className="mt-2 flex flex-wrap gap-2">
          {getSelectedProvinces.slice(0, 3).map((province) => (
            <span
              key={province.id}
              className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium"
            >
              {province.name}
              <button
                onClick={() => handleToggleProvince(province.id)}
                className="ml-1 hover:text-green-900"
              >
                <X size={14} />
              </button>
            </span>
          ))}
          {getSelectedProvinces.length > 3 && (
            <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
              +{getSelectedProvinces.length - 3} lainnya
            </span>
          )}
        </div>
      )}

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-4 space-y-3">
            {/* Search Input */}
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari provinsi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-500"
                autoFocus
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleSelectAll}
                className="flex-1 px-3 py-1.5 text-xs font-medium text-green-600 bg-green-50 rounded hover:bg-green-100 transition-colors"
              >
                Pilih Semua
              </button>
              <button
                onClick={handleClearAll}
                className="flex-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
              >
                Hapus Semua
              </button>
            </div>

            {/* Regions and Provinces */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {Object.entries(filteredProvinces).map(([region, provincesInRegion]) => {
                const regionColor = PROVINCE_COLORS[region as keyof typeof PROVINCE_COLORS] || '#6B7280';
                const isRegionExpanded = expandedRegions.has(region);
                const allRegionSelected = provincesInRegion.every((p) =>
                  filter.isProvinceSelected(p.id)
                );
                const someRegionSelected = provincesInRegion.some((p) =>
                  filter.isProvinceSelected(p.id)
                );

                return (
                  <div key={region} className="border border-gray-200 rounded-lg overflow-hidden">
                    {/* Region Header */}
                    <div
                      className="flex items-center justify-between gap-2 p-3 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
                      onClick={() => handleToggleRegion(region)}
                    >
                      <div className="flex items-center gap-2 flex-1">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: regionColor }}
                        />
                        <span className="text-sm font-semibold text-gray-700">{region}</span>
                        <span className="text-xs text-gray-500">
                          ({provincesInRegion.length})
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        {someRegionSelected && (
                          <div className="w-4 h-4 rounded border border-green-500 bg-green-50 flex items-center justify-center">
                            <div
                              className={`w-2 h-2 rounded-sm transition-all ${
                                allRegionSelected ? 'bg-green-500' : 'bg-gray-300'
                              }`}
                            />
                          </div>
                        )}
                        <ChevronDown
                          size={16}
                          className={`text-gray-500 transition-transform ${
                            isRegionExpanded ? 'rotate-180' : ''
                          }`}
                        />
                      </div>
                    </div>

                    {/* Region Action Buttons */}
                    {isRegionExpanded && (
                      <div className="flex gap-1 px-3 pt-2 bg-white border-b border-gray-200">
                        <button
                          onClick={() => handleSelectAllRegion(region)}
                          className="flex-1 px-2 py-1 text-xs font-medium text-green-600 bg-green-50 rounded hover:bg-green-100 transition-colors"
                        >
                          Semua
                        </button>
                        <button
                          onClick={() => handleDeselectAllRegion(region)}
                          className="flex-1 px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                        >
                          Hapus
                        </button>
                      </div>
                    )}

                    {/* Provinces List */}
                    {isRegionExpanded && (
                      <div className="space-y-0 p-2 bg-white">
                        {provincesInRegion.map((province) => {
                          const isSelected = filter.isProvinceSelected(province.id);
                          return (
                            <label
                              key={province.id}
                              className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 cursor-pointer transition-colors"
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleToggleProvince(province.id)}
                                className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer"
                              />
                              <span className="text-sm text-gray-700 flex-1">{province.name}</span>
                              <span className="text-xs text-gray-400">{province.code}</span>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}

              {Object.keys(filteredProvinces).length === 0 && (
                <div className="py-8 text-center">
                  <p className="text-sm text-gray-500">Tidak ada provinsi yang sesuai</p>
                </div>
              )}
            </div>
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

export default ProvinceMultiSelect;
