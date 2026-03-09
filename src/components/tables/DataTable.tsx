import { memo, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { SchoolData } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

interface DataTableProps {
  type: 'trouble' | 'installed' | 'pending';
}

export const DataTable = memo(function DataTable({ type }: DataTableProps) {
  const { data, filters } = useApp();

  const dataSource = useMemo(() => {
    if (!data) return [];
    return data[type] || [];
  }, [data, type]);

  const filteredData = useMemo(() => {
    return dataSource.filter((item: SchoolData) => {
      if (filters.search) {
        const search = filters.search.toLowerCase();
        return item.npsn.includes(search) || item.nama.toLowerCase().includes(search);
      }
      return true;
    });
  }, [dataSource, filters.search]);

  const titles: Record<typeof type, string> = {
    trouble: 'Daftar Kendala',
    installed: 'Sekolah Terpasang',
    pending: 'Sekolah Pending'
  };

  if (!data) {
    return (
      <Card>
        <CardContent className="py-20 text-center text-slate-400">Memuat data...</CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>{titles[type]}</CardTitle>
      </CardHeader>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-center w-16 text-[10px] font-bold text-slate-400 uppercase">#</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase">NPSN</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase">Sekolah</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase">
                {type === 'trouble' ? 'Detail Kendala' : type === 'installed' ? 'Tanggal' : 'Direktorat'}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-sm">
            {filteredData.length > 0 ? (
              filteredData.map((item: SchoolData, index: number) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-all">
                  <td className="px-6 py-4 text-center font-bold text-slate-300">{index + 1}</td>
                  <td className="px-6 py-4 font-mono text-blue-600 font-bold">{item.npsn}</td>
                  <td className="px-6 py-4 font-semibold text-slate-700">{item.nama}</td>
                  <td className="px-6 py-4">
                    {type === 'trouble' && (
                      <span className="bg-rose-50 text-rose-600 px-3 py-1 rounded-lg text-xs font-bold border border-rose-100">
                        {item.kendala}
                      </span>
                    )}
                    {type === 'installed' && (
                      <span className="text-emerald-600 font-bold">{item.tanggal}</span>
                    )}
                    {type === 'pending' && (
                      <span className="text-slate-500">{item.direktorat}</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-20 text-center text-slate-400">Data tidak ditemukan.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
});
