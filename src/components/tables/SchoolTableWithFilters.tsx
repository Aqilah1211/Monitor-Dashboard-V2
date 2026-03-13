/**
 * School Table with Filters Component
 * Combines FilterSection and DataTable with filtering logic
 */

import { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { FilterSection } from '../filters/FilterSection';
import { DataTable } from './DataTable';
import { useSchoolFilter } from '../../hooks/useSchoolFilter';
import { Card, CardContent } from '../ui/Card';

interface SchoolTableWithFiltersProps {
  type: 'trouble' | 'installed' | 'pending';
}

export function SchoolTableWithFilters({ type }: SchoolTableWithFiltersProps) {
  const { data } = useApp();

  // Get data for this type
  const dataSource = useMemo(() => {
    if (!data) return [];
    return data[type] || [];
  }, [data, type]);

  // Use school filter hook
  const {
    filtered,
    resultCount,
    total,
    filters,
    updateSearch,
    updateDateRange,
    updateProvince,
    resetFilters
  } = useSchoolFilter(dataSource);

  if (!data) {
    return (
      <Card>
        <CardContent className="py-20 text-center text-slate-400">
          Memuat data...
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      {/* Filter Section */}
      <FilterSection
        filters={filters}
        onSearchChange={updateSearch}
        onDateRangeChange={updateDateRange}
        onProvinceChange={updateProvince}
        onReset={resetFilters}
        resultCount={resultCount}
        totalCount={total}
      />

      {/* Data Table with filtered data */}
      <DataTable type={type} preFilteredData={filtered} />
    </div>
  );
}
