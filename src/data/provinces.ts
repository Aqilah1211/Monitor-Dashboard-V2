/**
 * Data 34 Provinsi Indonesia
 * Untuk filter dashboard
 */

export interface Province {
  id: string;
  name: string;
  code: string;
  region: 'Sumatera' | 'Jawa' | 'Kalimantan' | 'Sulawesi' | 'Bali & Nusa Tenggara' | 'Maluku & Papua';
}

export const PROVINCES: Province[] = [
  // Sumatera
  { id: 'ac', name: 'Aceh', code: 'AC', region: 'Sumatera' },
  { id: 'su', name: 'Sumatera Utara', code: 'SU', region: 'Sumatera' },
  { id: 'sb', name: 'Sumatera Barat', code: 'SB', region: 'Sumatera' },
  { id: 'riau', name: 'Riau', code: 'RIAU', region: 'Sumatera' },
  { id: 'kepri', name: 'Kepulauan Riau', code: 'KEPRI', region: 'Sumatera' },
  { id: 'jambi', name: 'Jambi', code: 'JAMBI', region: 'Sumatera' },
  { id: 'ss', name: 'Sumatera Selatan', code: 'SS', region: 'Sumatera' },
  { id: 'bb', name: 'Bangka Belitung', code: 'BB', region: 'Sumatera' },
  { id: 'bengkulu', name: 'Bengkulu', code: 'BENGKULU', region: 'Sumatera' },
  { id: 'lampung', name: 'Lampung', code: 'LAMPUNG', region: 'Sumatera' },

  // Jawa
  { id: 'dki', name: 'DKI Jakarta', code: 'DKI', region: 'Jawa' },
  { id: 'jabar', name: 'Jawa Barat', code: 'JABAR', region: 'Jawa' },
  { id: 'jateng', name: 'Jawa Tengah', code: 'JATENG', region: 'Jawa' },
  { id: 'diy', name: 'DI Yogyakarta', code: 'DIY', region: 'Jawa' },
  { id: 'jatim', name: 'Jawa Timur', code: 'JATIM', region: 'Jawa' },
  { id: 'banten', name: 'Banten', code: 'BANTEN', region: 'Jawa' },

  // Kalimantan
  { id: 'kalbar', name: 'Kalimantan Barat', code: 'KALBAR', region: 'Kalimantan' },
  { id: 'kalteng', name: 'Kalimantan Tengah', code: 'KALTENG', region: 'Kalimantan' },
  { id: 'kalsel', name: 'Kalimantan Selatan', code: 'KALSEL', region: 'Kalimantan' },
  { id: 'kaltim', name: 'Kalimantan Timur', code: 'KALTIM', region: 'Kalimantan' },
  { id: 'kaltara', name: 'Kalimantan Utara', code: 'KALTARA', region: 'Kalimantan' },

  // Sulawesi
  { id: 'sulut', name: 'Sulawesi Utara', code: 'SULUT', region: 'Sulawesi' },
  { id: 'sulteng', name: 'Sulawesi Tengah', code: 'SULTENG', region: 'Sulawesi' },
  { id: 'sulsel', name: 'Sulawesi Selatan', code: 'SULSEL', region: 'Sulawesi' },
  { id: 'sultra', name: 'Sulawesi Tenggara', code: 'SULTRA', region: 'Sulawesi' },
  { id: 'gorontalo', name: 'Gorontalo', code: 'GORONTALO', region: 'Sulawesi' },

  // Bali & Nusa Tenggara
  { id: 'bali', name: 'Bali', code: 'BALI', region: 'Bali & Nusa Tenggara' },
  { id: 'ntb', name: 'Nusa Tenggara Barat', code: 'NTB', region: 'Bali & Nusa Tenggara' },
  { id: 'ntt', name: 'Nusa Tenggara Timur', code: 'NTT', region: 'Bali & Nusa Tenggara' },

  // Maluku & Papua
  { id: 'maluku', name: 'Maluku', code: 'MALUKU', region: 'Maluku & Papua' },
  { id: 'malut', name: 'Maluku Utara', code: 'MALUT', region: 'Maluku & Papua' },
  { id: 'papua', name: 'Papua', code: 'PAPUA', region: 'Maluku & Papua' },
  { id: 'papbar', name: 'Papua Barat', code: 'PAPBAR', region: 'Maluku & Papua' },
];

/**
 * Get all unique regions
 */
export function getRegions(): string[] {
  const regions = PROVINCES.map((p) => p.region);
  return [...new Set(regions)].sort();
}

/**
 * Get provinces by region
 */
export function getProvincesByRegion(region: string): Province[] {
  return PROVINCES.filter((p) => p.region === region);
}

/**
 * Get province by ID
 */
export function getProvinceById(id: string): Province | undefined {
  return PROVINCES.find((p) => p.id === id);
}

/**
 * Get province names for display
 */
export function getProvinceNames(): Record<string, string> {
  return PROVINCES.reduce(
    (acc, p) => {
      acc[p.id] = p.name;
      return acc;
    },
    {} as Record<string, string>
  );
}

/**
 * Province color mapping for UI
 */
export const PROVINCE_COLORS: Record<string, string> = {
  Sumatera: 'bg-blue-100 text-blue-800 border-blue-300',
  Jawa: 'bg-green-100 text-green-800 border-green-300',
  Kalimantan: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  Sulawesi: 'bg-purple-100 text-purple-800 border-purple-300',
  'Bali & Nusa Tenggara': 'bg-pink-100 text-pink-800 border-pink-300',
  'Maluku & Papua': 'bg-indigo-100 text-indigo-800 border-indigo-300',
};
