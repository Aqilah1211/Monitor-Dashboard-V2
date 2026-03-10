/**
 * SchoolTable Component
 * Tabel untuk menampilkan data sekolah dengan highlight pencarian
 * Responsive design dengan status indicator
 */

import React, { useMemo } from 'react';
import { AlertCircle, Clock, CheckCircle2, Zap } from 'lucide-react';
import { School } from '../../types/school';

interface SchoolTableProps {
  data: School[];
  highlightTerms?: (text: string) => Array<{ text: string; isHighlighted: boolean }>;
  isLoading?: boolean;
  emptyMessage?: string;
}

const STATUS_CONFIG = {
  installed: {
    icon: CheckCircle2,
    label: 'Terpasang',
    color: 'bg-green-50 text-green-700 border-green-200',
    badge: 'bg-green-100 text-green-800',
  },
  pending: {
    icon: Clock,
    label: 'Pending',
    color: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    badge: 'bg-yellow-100 text-yellow-800',
  },
  in_progress: {
    icon: Zap,
    label: 'Sedang Proses',
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    badge: 'bg-blue-100 text-blue-800',
  },
  problem: {
    icon: AlertCircle,
    label: 'Ada Masalah',
    color: 'bg-red-50 text-red-700 border-red-200',
    badge: 'bg-red-100 text-red-800',
  },
};

/**
 * Highlight cell component
 */
const HighlightedCell: React.FC<{
  parts: Array<{ text: string; isHighlighted: boolean }>;
}> = ({ parts }) => {
  return (
    <span>
      {parts.map((part, idx) =>
        part.isHighlighted ? (
          <mark key={idx} className="bg-yellow-200 text-gray-900 font-semibold px-0.5 rounded">
            {part.text}
          </mark>
        ) : (
          <span key={idx}>{part.text}</span>
        )
      )}
    </span>
  );
};

export const SchoolTable: React.FC<SchoolTableProps> = ({
  data,
  highlightTerms,
  isLoading = false,
  emptyMessage = 'Tidak ada data sekolah',
}) => {
  /**
   * Get display data
   */
  const displayData = useMemo(() => {
    return data.map((school) => ({
      ...school,
      displayName: school.schoolName || school.nama || '-',
      displayProvince: school.province || school.direktorat || '-',
    }));
  }, [data]);

  /**
   * Status formatter
   */
  const getStatusIcon = (status: School['status']) => {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
    const Icon = config.icon;
    return <Icon size={16} />;
  };

  /**
   * Format date
   */
  const formatDate = (dateString?: string): string => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <div className="inline-flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse" />
          <span className="text-gray-700 font-medium">Memuat data...</span>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600 font-medium mb-2">Tidak ada hasil</p>
        <p className="text-gray-500 text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-3 text-left font-semibold text-gray-700">NPSN</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Nama Sekolah</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Provinsi</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Status</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Tanggal Instalasi</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Catatan</th>
            </tr>
          </thead>
          <tbody>
            {displayData.map((school, idx) => {
              const statusConfig = STATUS_CONFIG[school.status] || STATUS_CONFIG.pending;
              const nspnParts = highlightTerms ? highlightTerms(school.npsn) : [{ text: school.npsn, isHighlighted: false }];
              const nameParts = highlightTerms ? highlightTerms(school.displayName) : [{ text: school.displayName, isHighlighted: false }];
              const provinceParts = highlightTerms ? highlightTerms(school.displayProvince) : [{ text: school.displayProvince, isHighlighted: false }];

              return (
                <tr
                  key={school.id || idx}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <code className="bg-gray-100 px-2 py-1 rounded text-gray-900 font-mono text-xs">
                      <HighlightedCell parts={nspnParts} />
                    </code>
                  </td>
                  <td className="px-6 py-4 text-gray-900">
                    <HighlightedCell parts={nameParts} />
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    <HighlightedCell parts={provinceParts} />
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusConfig.badge}`}
                    >
                      {getStatusIcon(school.status)}
                      {statusConfig.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{formatDate(school.installationDate || school.tanggal)}</td>
                  <td className="px-6 py-4 text-gray-600 text-xs max-w-xs truncate" title={school.problemDetail || school.kendala || ''}>
                    {school.problemDetail || school.kendala || '-'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden divide-y divide-gray-200">
        {displayData.map((school, idx) => {
          const statusConfig = STATUS_CONFIG[school.status] || STATUS_CONFIG.pending;
          const nspnParts = highlightTerms ? highlightTerms(school.npsn) : [{ text: school.npsn, isHighlighted: false }];
          const nameParts = highlightTerms ? highlightTerms(school.displayName) : [{ text: school.displayName, isHighlighted: false }];
          const provinceParts = highlightTerms ? highlightTerms(school.displayProvince) : [{ text: school.displayProvince, isHighlighted: false }];

          return (
            <div key={school.id || idx} className="p-4 space-y-3">
              {/* NPSN and Status */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">NPSN</div>
                  <code className="bg-gray-100 px-2 py-1 rounded text-gray-900 font-mono text-sm">
                    <HighlightedCell parts={nspnParts} />
                  </code>
                </div>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${statusConfig.badge}`}
                >
                  {getStatusIcon(school.status)}
                  {statusConfig.label}
                </span>
              </div>

              {/* School Name */}
              <div>
                <div className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Nama Sekolah</div>
                <p className="text-sm text-gray-900 font-medium">
                  <HighlightedCell parts={nameParts} />
                </p>
              </div>

              {/* Province and Date */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Provinsi</div>
                  <p className="text-sm text-gray-700">
                    <HighlightedCell parts={provinceParts} />
                  </p>
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Tanggal</div>
                  <p className="text-sm text-gray-700">{formatDate(school.installationDate || school.tanggal)}</p>
                </div>
              </div>

              {/* Problem Detail */}
              {(school.problemDetail || school.kendala) && (
                <div>
                  <div className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Catatan</div>
                  <p className="text-sm text-gray-600 bg-orange-50 px-3 py-2 rounded border border-orange-200">
                    {school.problemDetail || school.kendala}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Stats */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 text-sm text-gray-600">
        Menampilkan <span className="font-semibold text-gray-900">{data.length}</span> sekolah
      </div>
    </div>
  );
};

export default SchoolTable;
