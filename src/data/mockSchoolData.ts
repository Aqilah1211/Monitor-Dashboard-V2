import { SchoolData } from '@/types';

/**
 * Mock data untuk development
 * 50+ sekolah dari berbagai provinsi di Indonesia
 * Digunakan untuk testing tanpa fetch dari Google Sheets
 */
export const mockSchoolData: SchoolData[] = [
  // DKI Jakarta
  {
    id: 1,
    npsn: '20107001',
    nama: 'SMA Negeri 1 Jakarta',
    direktorat: 'DKI Jakarta',
    tanggal: '2025-12-15',
    status: 'selesai',
    kendala: '',
    raw: ['20107001', 'SMA Negeri 1 Jakarta', 'DKI Jakarta', '2025-12-15', 'selesai'],
  },
  {
    id: 2,
    npsn: '20107002',
    nama: 'SMA Negeri 2 Jakarta',
    direktorat: 'DKI Jakarta',
    tanggal: '2025-12-10',
    status: 'selesai',
    kendala: '',
    raw: ['20107002', 'SMA Negeri 2 Jakarta', 'DKI Jakarta', '2025-12-10', 'selesai'],
  },
  {
    id: 3,
    npsn: '20107003',
    nama: 'SMA Negeri 3 Jakarta',
    direktorat: 'DKI Jakarta',
    tanggal: '2026-01-20',
    status: 'proses',
    kendala: 'Menunggu persetujuan pimpinan',
    raw: ['20107003', 'SMA Negeri 3 Jakarta', 'DKI Jakarta', '2026-01-20', 'proses'],
  },

  // Jawa Barat
  {
    id: 4,
    npsn: '20201001',
    nama: 'SMA Negeri 1 Bandung',
    direktorat: 'Jawa Barat',
    tanggal: '2025-11-05',
    status: 'selesai',
    kendala: '',
    raw: ['20201001', 'SMA Negeri 1 Bandung', 'Jawa Barat', '2025-11-05', 'selesai'],
  },
  {
    id: 5,
    npsn: '20201002',
    nama: 'SMA Negeri 5 Bandung',
    direktorat: 'Jawa Barat',
    tanggal: '2025-12-20',
    status: 'selesai',
    kendala: '',
    raw: ['20201002', 'SMA Negeri 5 Bandung', 'Jawa Barat', '2025-12-20', 'selesai'],
  },
  {
    id: 6,
    npsn: '20201501',
    nama: 'SMA Negeri 1 Bogor',
    direktorat: 'Jawa Barat',
    tanggal: '2026-02-15',
    status: 'proses',
    kendala: 'Bermasalah dengan instalasi jaringan',
    raw: ['20201501', 'SMA Negeri 1 Bogor', 'Jawa Barat', '2026-02-15', 'proses'],
  },
  {
    id: 7,
    npsn: '20208701',
    nama: 'SMA Negeri 1 Depok',
    direktorat: 'Jawa Barat',
    tanggal: '2026-01-15',
    status: 'proses',
    kendala: '',
    raw: ['20208701', 'SMA Negeri 1 Depok', 'Jawa Barat', '2026-01-15', 'proses'],
  },

  // Jawa Tengah
  {
    id: 8,
    npsn: '20330001',
    nama: 'SMA Negeri 1 Semarang',
    direktorat: 'Jawa Tengah',
    tanggal: '2025-10-20',
    status: 'selesai',
    kendala: '',
    raw: ['20330001', 'SMA Negeri 1 Semarang', 'Jawa Tengah', '2025-10-20', 'selesai'],
  },
  {
    id: 9,
    npsn: '20730001',
    nama: 'SMA Negeri 1 Solo',
    direktorat: 'Jawa Tengah',
    tanggal: '2025-11-28',
    status: 'selesai',
    kendala: '',
    raw: ['20730001', 'SMA Negeri 1 Solo', 'Jawa Tengah', '2025-11-28', 'selesai'],
  },
  {
    id: 10,
    npsn: '20633001',
    nama: 'SMA Negeri 1 Pekalongan',
    direktorat: 'Jawa Tengah',
    tanggal: '2026-02-01',
    status: 'proses',
    kendala: 'Perlu training operator',
    raw: ['20633001', 'SMA Negeri 1 Pekalongan', 'Jawa Tengah', '2026-02-01', 'proses'],
  },

  // Jawa Timur
  {
    id: 11,
    npsn: '20531001',
    nama: 'SMA Negeri 1 Surabaya',
    direktorat: 'Jawa Timur',
    tanggal: '2025-09-15',
    status: 'selesai',
    kendala: '',
    raw: ['20531001', 'SMA Negeri 1 Surabaya', 'Jawa Timur', '2025-09-15', 'selesai'],
  },
  {
    id: 12,
    npsn: '20531005',
    nama: 'SMA Negeri 5 Surabaya',
    direktorat: 'Jawa Timur',
    tanggal: '2025-12-05',
    status: 'selesai',
    kendala: '',
    raw: ['20531005', 'SMA Negeri 5 Surabaya', 'Jawa Timur', '2025-12-05', 'selesai'],
  },
  {
    id: 13,
    npsn: '20465001',
    nama: 'SMA Negeri 1 Malang',
    direktorat: 'Jawa Timur',
    tanggal: '2025-10-10',
    status: 'selesai',
    kendala: '',
    raw: ['20465001', 'SMA Negeri 1 Malang', 'Jawa Timur', '2025-10-10', 'selesai'],
  },
  {
    id: 14,
    npsn: '20571001',
    nama: 'SMA Negeri 1 Gresik',
    direktorat: 'Jawa Timur',
    tanggal: '2026-01-25',
    status: 'proses',
    kendala: 'Menunggu komponen tambahan',
    raw: ['20571001', 'SMA Negeri 1 Gresik', 'Jawa Timur', '2026-01-25', 'proses'],
  },

  // Banten
  {
    id: 15,
    npsn: '20602001',
    nama: 'SMA Negeri 1 Tangerang',
    direktorat: 'Banten',
    tanggal: '2025-11-15',
    status: 'selesai',
    kendala: '',
    raw: ['20602001', 'SMA Negeri 1 Tangerang', 'Banten', '2025-11-15', 'selesai'],
  },
  {
    id: 16,
    npsn: '20610001',
    nama: 'SMA Negeri 1 Serang',
    direktorat: 'Banten',
    tanggal: '2026-01-10',
    status: 'proses',
    kendala: '',
    raw: ['20610001', 'SMA Negeri 1 Serang', 'Banten', '2026-01-10', 'proses'],
  },

  // DI Yogyakarta
  {
    id: 17,
    npsn: '20401001',
    nama: 'SMA Negeri 1 Yogyakarta',
    direktorat: 'DI Yogyakarta',
    tanggal: '2025-08-20',
    status: 'selesai',
    kendala: '',
    raw: ['20401001', 'SMA Negeri 1 Yogyakarta', 'DI Yogyakarta', '2025-08-20', 'selesai'],
  },
  {
    id: 18,
    npsn: '20401002',
    nama: 'SMA Negeri 2 Yogyakarta',
    direktorat: 'DI Yogyakarta',
    tanggal: '2025-09-25',
    status: 'selesai',
    kendala: '',
    raw: ['20401002', 'SMA Negeri 2 Yogyakarta', 'DI Yogyakarta', '2025-09-25', 'selesai'],
  },

  // Sumatera Utara
  {
    id: 19,
    npsn: '20112001',
    nama: 'SMA Negeri 1 Medan',
    direktorat: 'Sumatera Utara',
    tanggal: '2025-09-30',
    status: 'selesai',
    kendala: '',
    raw: ['20112001', 'SMA Negeri 1 Medan', 'Sumatera Utara', '2025-09-30', 'selesai'],
  },
  {
    id: 20,
    npsn: '20112004',
    nama: 'SMA Negeri 4 Medan',
    direktorat: 'Sumatera Utara',
    tanggal: '2026-01-05',
    status: 'proses',
    kendala: 'Bermasalah dengan power supply',
    raw: ['20112004', 'SMA Negeri 4 Medan', 'Sumatera Utara', '2026-01-05', 'proses'],
  },

  // Sumatera Barat
  {
    id: 21,
    npsn: '20128001',
    nama: 'SMA Negeri 1 Padang',
    direktorat: 'Sumatera Barat',
    tanggal: '2025-10-15',
    status: 'selesai',
    kendala: '',
    raw: ['20128001', 'SMA Negeri 1 Padang', 'Sumatera Barat', '2025-10-15', 'selesai'],
  },
  {
    id: 22,
    npsn: '20128002',
    nama: 'SMA Negeri 2 Padang',
    direktorat: 'Sumatera Barat',
    tanggal: '2026-02-10',
    status: 'proses',
    kendala: '',
    raw: ['20128002', 'SMA Negeri 2 Padang', 'Sumatera Barat', '2026-02-10', 'proses'],
  },

  // Riau
  {
    id: 23,
    npsn: '20160001',
    nama: 'SMA Negeri 1 Pekanbaru',
    direktorat: 'Riau',
    tanggal: '2025-11-20',
    status: 'selesai',
    kendala: '',
    raw: ['20160001', 'SMA Negeri 1 Pekanbaru', 'Riau', '2025-11-20', 'selesai'],
  },
  {
    id: 24,
    npsn: '20164001',
    nama: 'SMA Negeri 1 Dumai',
    direktorat: 'Riau',
    tanggal: '2026-01-30',
    status: 'proses',
    kendala: 'Menunggu approval dari dinas',
    raw: ['20164001', 'SMA Negeri 1 Dumai', 'Riau', '2026-01-30', 'proses'],
  },

  // Jambi
  {
    id: 25,
    npsn: '20183001',
    nama: 'SMA Negeri 1 Jambi',
    direktorat: 'Jambi',
    tanggal: '2025-12-01',
    status: 'selesai',
    kendala: '',
    raw: ['20183001', 'SMA Negeri 1 Jambi', 'Jambi', '2025-12-01', 'selesai'],
  },

  // Sumatera Selatan
  {
    id: 26,
    npsn: '20217001',
    nama: 'SMA Negeri 1 Palembang',
    direktorat: 'Sumatera Selatan',
    tanggal: '2025-10-25',
    status: 'selesai',
    kendala: '',
    raw: ['20217001', 'SMA Negeri 1 Palembang', 'Sumatera Selatan', '2025-10-25', 'selesai'],
  },
  {
    id: 27,
    npsn: '20217002',
    nama: 'SMA Negeri 2 Palembang',
    direktorat: 'Sumatera Selatan',
    tanggal: '2026-02-05',
    status: 'proses',
    kendala: '',
    raw: ['20217002', 'SMA Negeri 2 Palembang', 'Sumatera Selatan', '2026-02-05', 'proses'],
  },

  // Lampung
  {
    id: 28,
    npsn: '20271001',
    nama: 'SMA Negeri 1 Bandar Lampung',
    direktorat: 'Lampung',
    tanggal: '2025-11-10',
    status: 'selesai',
    kendala: '',
    raw: ['20271001', 'SMA Negeri 1 Bandar Lampung', 'Lampung', '2025-11-10', 'selesai'],
  },

  // Kalimantan Barat
  {
    id: 29,
    npsn: '20610001',
    nama: 'SMA Negeri 1 Pontianak',
    direktorat: 'Kalimantan Barat',
    tanggal: '2025-12-18',
    status: 'selesai',
    kendala: '',
    raw: ['20610001', 'SMA Negeri 1 Pontianak', 'Kalimantan Barat', '2025-12-18', 'selesai'],
  },
  {
    id: 30,
    npsn: '20614001',
    nama: 'SMA Negeri 1 Singkawang',
    direktorat: 'Kalimantan Barat',
    tanggal: '2026-01-20',
    status: 'proses',
    kendala: 'Perlu maintenance rutin',
    raw: ['20614001', 'SMA Negeri 1 Singkawang', 'Kalimantan Barat', '2026-01-20', 'proses'],
  },

  // Kalimantan Tengah
  {
    id: 31,
    npsn: '20710001',
    nama: 'SMA Negeri 1 Palangka Raya',
    direktorat: 'Kalimantan Tengah',
    tanggal: '2025-11-05',
    status: 'selesai',
    kendala: '',
    raw: ['20710001', 'SMA Negeri 1 Palangka Raya', 'Kalimantan Tengah', '2025-11-05', 'selesai'],
  },

  // Kalimantan Selatan
  {
    id: 32,
    npsn: '20870001',
    nama: 'SMA Negeri 1 Banjarmasin',
    direktorat: 'Kalimantan Selatan',
    tanggal: '2025-10-30',
    status: 'selesai',
    kendala: '',
    raw: ['20870001', 'SMA Negeri 1 Banjarmasin', 'Kalimantan Selatan', '2025-10-30', 'selesai'],
  },

  // Kalimantan Timur
  {
    id: 33,
    npsn: '20910001',
    nama: 'SMA Negeri 1 Samarinda',
    direktorat: 'Kalimantan Timur',
    tanggal: '2025-09-20',
    status: 'selesai',
    kendala: '',
    raw: ['20910001', 'SMA Negeri 1 Samarinda', 'Kalimantan Timur', '2025-09-20', 'selesai'],
  },
  {
    id: 34,
    npsn: '20910006',
    nama: 'SMA Negeri 6 Samarinda',
    direktorat: 'Kalimantan Timur',
    tanggal: '2026-02-20',
    status: 'proses',
    kendala: '',
    raw: ['20910006', 'SMA Negeri 6 Samarinda', 'Kalimantan Timur', '2026-02-20', 'proses'],
  },
  {
    id: 35,
    npsn: '20915001',
    nama: 'SMA Negeri 1 Balikpapan',
    direktorat: 'Kalimantan Timur',
    tanggal: '2025-12-08',
    status: 'selesai',
    kendala: '',
    raw: ['20915001', 'SMA Negeri 1 Balikpapan', 'Kalimantan Timur', '2025-12-08', 'selesai'],
  },

  // Sulawesi Utara
  {
    id: 36,
    npsn: '20110001',
    nama: 'SMA Negeri 1 Manado',
    direktorat: 'Sulawesi Utara',
    tanggal: '2025-11-25',
    status: 'selesai',
    kendala: '',
    raw: ['20110001', 'SMA Negeri 1 Manado', 'Sulawesi Utara', '2025-11-25', 'selesai'],
  },
  {
    id: 37,
    npsn: '20110002',
    nama: 'SMA Negeri 2 Manado',
    direktorat: 'Sulawesi Utara',
    tanggal: '2026-01-15',
    status: 'proses',
    kendala: 'Bermasalah dengan sistem',
    raw: ['20110002', 'SMA Negeri 2 Manado', 'Sulawesi Utara', '2026-01-15', 'proses'],
  },

  // Sulawesi Tengah
  {
    id: 38,
    npsn: '20710001',
    nama: 'SMA Negeri 1 Palu',
    direktorat: 'Sulawesi Tengah',
    tanggal: '2025-12-30',
    status: 'selesai',
    kendala: '',
    raw: ['20710001', 'SMA Negeri 1 Palu', 'Sulawesi Tengah', '2025-12-30', 'selesai'],
  },

  // Sulawesi Selatan
  {
    id: 39,
    npsn: '20730001',
    nama: 'SMA Negeri 1 Makassar',
    direktorat: 'Sulawesi Selatan',
    tanggal: '2025-09-10',
    status: 'selesai',
    kendala: '',
    raw: ['20730001', 'SMA Negeri 1 Makassar', 'Sulawesi Selatan', '2025-09-10', 'selesai'],
  },
  {
    id: 40,
    npsn: '20730003',
    nama: 'SMA Negeri 3 Makassar',
    direktorat: 'Sulawesi Selatan',
    tanggal: '2025-11-15',
    status: 'selesai',
    kendala: '',
    raw: ['20730003', 'SMA Negeri 3 Makassar', 'Sulawesi Selatan', '2025-11-15', 'selesai'],
  },
  {
    id: 41,
    npsn: '20750001',
    nama: 'SMA Negeri 1 Palopo',
    direktorat: 'Sulawesi Selatan',
    tanggal: '2026-01-08',
    status: 'proses',
    kendala: '',
    raw: ['20750001', 'SMA Negeri 1 Palopo', 'Sulawesi Selatan', '2026-01-08', 'proses'],
  },

  // Sulawesi Tenggara
  {
    id: 42,
    npsn: '20741001',
    nama: 'SMA Negeri 1 Kendari',
    direktorat: 'Sulawesi Tenggara',
    tanggal: '2025-10-05',
    status: 'selesai',
    kendala: '',
    raw: ['20741001', 'SMA Negeri 1 Kendari', 'Sulawesi Tenggara', '2025-10-05', 'selesai'],
  },

  // Maluku
  {
    id: 43,
    npsn: '20810001',
    nama: 'SMA Negeri 1 Ambon',
    direktorat: 'Maluku',
    tanggal: '2025-12-12',
    status: 'selesai',
    kendala: '',
    raw: ['20810001', 'SMA Negeri 1 Ambon', 'Maluku', '2025-12-12', 'selesai'],
  },

  // Papua
  {
    id: 44,
    npsn: '21010001',
    nama: 'SMA Negeri 1 Jayapura',
    direktorat: 'Papua',
    tanggal: '2025-08-30',
    status: 'selesai',
    kendala: '',
    raw: ['21010001', 'SMA Negeri 1 Jayapura', 'Papua', '2025-08-30', 'selesai'],
  },

  // Bali
  {
    id: 45,
    npsn: '20402001',
    nama: 'SMA Negeri 1 Denpasar',
    direktorat: 'Bali',
    tanggal: '2025-07-15',
    status: 'selesai',
    kendala: '',
    raw: ['20402001', 'SMA Negeri 1 Denpasar', 'Bali', '2025-07-15', 'selesai'],
  },
  {
    id: 46,
    npsn: '20402003',
    nama: 'SMA Negeri 3 Denpasar',
    direktorat: 'Bali',
    tanggal: '2025-11-20',
    status: 'selesai',
    kendala: '',
    raw: ['20402003', 'SMA Negeri 3 Denpasar', 'Bali', '2025-11-20', 'selesai'],
  },
  {
    id: 47,
    npsn: '20404001',
    nama: 'SMA Negeri 1 Ubud',
    direktorat: 'Bali',
    tanggal: '2026-02-28',
    status: 'proses',
    kendala: 'Menunggu inspeksi final',
    raw: ['20404001', 'SMA Negeri 1 Ubud', 'Bali', '2026-02-28', 'proses'],
  },

  // Nusa Tenggara Barat
  {
    id: 48,
    npsn: '20510001',
    nama: 'SMA Negeri 1 Mataram',
    direktorat: 'Nusa Tenggara Barat',
    tanggal: '2025-09-05',
    status: 'selesai',
    kendala: '',
    raw: ['20510001', 'SMA Negeri 1 Mataram', 'Nusa Tenggara Barat', '2025-09-05', 'selesai'],
  },

  // Nusa Tenggara Timur
  {
    id: 49,
    npsn: '20530001',
    nama: 'SMA Negeri 1 Kupang',
    direktorat: 'Nusa Tenggara Timur',
    tanggal: '2025-10-12',
    status: 'selesai',
    kendala: '',
    raw: ['20530001', 'SMA Negeri 1 Kupang', 'Nusa Tenggara Timur', '2025-10-12', 'selesai'],
  },

  // Aceh
  {
    id: 50,
    npsn: '20101001',
    nama: 'SMA Negeri 1 Banda Aceh',
    direktorat: 'Aceh',
    tanggal: '2025-11-08',
    status: 'selesai',
    kendala: '',
    raw: ['20101001', 'SMA Negeri 1 Banda Aceh', 'Aceh', '2025-11-08', 'selesai'],
  },
  {
    id: 51,
    npsn: '20101003',
    nama: 'SMA Negeri 3 Banda Aceh',
    direktorat: 'Aceh',
    tanggal: '2026-01-12',
    status: 'proses',
    kendala: 'Perlu adjust setting jaringan',
    raw: ['20101003', 'SMA Negeri 3 Banda Aceh', 'Aceh', '2026-01-12', 'proses'],
  },

  // Bengkulu
  {
    id: 52,
    npsn: '20173001',
    nama: 'SMA Negeri 1 Bengkulu',
    direktorat: 'Bengkulu',
    tanggal: '2025-12-22',
    status: 'selesai',
    kendala: '',
    raw: ['20173001', 'SMA Negeri 1 Bengkulu', 'Bengkulu', '2025-12-22', 'selesai'],
  },
];

/**
 * Fungsi untuk mendapatkan mock data
 */
export function getMockSchoolData(): SchoolData[] {
  return mockSchoolData;
}

/**
 * Fungsi untuk mendapatkan mock data dengan kategori
 */
export function getMockProcessedData() {
  const all = mockSchoolData;
  const installed = all.filter((item) =>
    item.status.toLowerCase().includes('selesai')
  );
  const pending = all.filter(
    (item) => !item.status.toLowerCase().includes('selesai')
  );
  const trouble = all.filter((item) => item.kendala.length > 2);

  return {
    all,
    installed,
    pending,
    trouble,
  };
}

/**
 * Fungsi untuk export as CSV
 */
export function exportMockDataAsCSV(): string {
  const headers = ['ID', 'NPSN', 'Nama', 'Direktorat', 'Tanggal', 'Status', 'Kendala'];
  const rows = mockSchoolData.map((item) => [
    item.id,
    item.npsn,
    item.nama,
    item.direktorat,
    item.tanggal,
    item.status,
    item.kendala,
  ]);

  const csv = [
    headers.join(','),
    ...rows.map((row) => row.join(',')),
  ].join('\n');

  return csv;
}
