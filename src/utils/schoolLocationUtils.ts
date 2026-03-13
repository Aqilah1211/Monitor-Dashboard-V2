import {
  getSchoolLocationDatabase,
  getAllProvinces,
  SchoolLocation,
} from '@/data/schoolLocations';

// City to Province mapping for keyword detection
const cityToProvinceMap: Record<string, string> = {
  // DKI Jakarta
  'jakarta': 'DKI Jakarta',
  'jakarta pusat': 'DKI Jakarta',
  'jakarta selatan': 'DKI Jakarta',
  'jakarta barat': 'DKI Jakarta',
  'jakarta timur': 'DKI Jakarta',
  'jakarta utara': 'DKI Jakarta',

  // Jawa Barat
  'bandung': 'Jawa Barat',
  'bogor': 'Jawa Barat',
  'depok': 'Jawa Barat',
  'bekasi': 'Jawa Barat',
  'cirebon': 'Jawa Barat',
  'garut': 'Jawa Barat',
  'tasikmalaya': 'Jawa Barat',
  'ciamis': 'Jawa Barat',
  'pangandaran': 'Jawa Barat',

  // Jawa Tengah
  'semarang': 'Jawa Tengah',
  'solo': 'Jawa Tengah',
  'surakarta': 'Jawa Tengah',
  'yogyakarta': 'DI Yogyakarta',
  'pekalongan': 'Jawa Tengah',
  'tegal': 'Jawa Tengah',
  'purwokerto': 'Jawa Tengah',
  'salatiga': 'Jawa Tengah',
  'kudus': 'Jawa Tengah',

  // Jawa Timur
  'surabaya': 'Jawa Timur',
  'malang': 'Jawa Timur',
  'gresik': 'Jawa Timur',
  'sidoarjo': 'Jawa Timur',
  'pasuruan': 'Jawa Timur',
  'mojokerto': 'Jawa Timur',
  'batu': 'Jawa Timur',
  'tuban': 'Jawa Timur',
  'blitar': 'Jawa Timur',

  // Banten
  'tangerang': 'Banten',
  'serang': 'Banten',
  'cilegon': 'Banten',
  'pandeglang': 'Banten',

  // DI Yogyakarta
  'yogya': 'DI Yogyakarta',
  'bantul': 'DI Yogyakarta',
  'sleman': 'DI Yogyakarta',
  'kulon progo': 'DI Yogyakarta',

  // Sumatera Utara
  'medan': 'Sumatera Utara',
  'pematangsiantar': 'Sumatera Utara',
  'binjai': 'Sumatera Utara',
  'tebing tinggi': 'Sumatera Utara',

  // Sumatera Barat
  'padang': 'Sumatera Barat',
  'bukittinggi': 'Sumatera Barat',
  'payakumbuh': 'Sumatera Barat',
  'pariaman': 'Sumatera Barat',

  // Riau
  'pekanbaru': 'Riau',
  'dumai': 'Riau',

  // Jambi
  'jambi': 'Jambi',
  'sungai penuh': 'Jambi',

  // Sumatera Selatan
  'palembang': 'Sumatera Selatan',
  'lahat': 'Sumatera Selatan',
  'prabumulih': 'Sumatera Selatan',

  // Lampung
  'bandar lampung': 'Lampung',
  'metro': 'Lampung',
  'pringsewu': 'Lampung',

  // Bangka Belitung
  'pangkal pinang': 'Bangka Belitung',
  'bangka': 'Bangka Belitung',
  'belitung': 'Bangka Belitung',

  // Kepulauan Riau
  'tanjung pinang': 'Kepulauan Riau',
  'batam': 'Kepulauan Riau',

  // Sulawesi Utara
  'manado': 'Sulawesi Utara',
  'bitung': 'Sulawesi Utara',
  'tomohon': 'Sulawesi Utara',

  // Gorontalo
  'gorontalo': 'Gorontalo',

  // Sulawesi Tengah
  'palu': 'Sulawesi Tengah',

  // Sulawesi Selatan
  'makassar': 'Sulawesi Selatan',
  'pare-pare': 'Sulawesi Selatan',
  'palopo': 'Sulawesi Selatan',
  'pinrang': 'Sulawesi Selatan',

  // Sulawesi Tenggara
  'kendari': 'Sulawesi Tenggara',
  'baubau': 'Sulawesi Tenggara',

  // Maluku
  'ambon': 'Maluku',
  'tual': 'Maluku',

  // Maluku Utara
  'ternate': 'Maluku Utara',
  'tidore': 'Maluku Utara',

  // Papua Barat
  'manokwari': 'Papua Barat',
  'sorong': 'Papua Barat',

  // Papua
  'jayapura': 'Papua',
  'timika': 'Papua',

  // Kalimantan Barat
  'pontianak': 'Kalimantan Barat',
  'singkawang': 'Kalimantan Barat',

  // Kalimantan Tengah
  'palangka raya': 'Kalimantan Tengah',
  'sampit': 'Kalimantan Tengah',

  // Kalimantan Selatan
  'banjarmasin': 'Kalimantan Selatan',
  'martapura': 'Kalimantan Selatan',

  // Kalimantan Timur
  'samarinda': 'Kalimantan Timur',
  'balikpapan': 'Kalimantan Timur',
  'bontang': 'Kalimantan Timur',

  // Kalimantan Utara
  'tarakan': 'Kalimantan Utara',
  'tanjung selor': 'Kalimantan Utara',

  // Bali
  'denpasar': 'Bali',
  'ubud': 'Bali',
  'kuta': 'Bali',
  'sanur': 'Bali',

  // Nusa Tenggara Barat
  'mataram': 'Nusa Tenggara Barat',
  'lombok': 'Nusa Tenggara Barat',

  // Nusa Tenggara Timur
  'kupang': 'Nusa Tenggara Timur',
  'maumere': 'Nusa Tenggara Timur',
  'dili': 'Nusa Tenggara Timur',

  // Aceh
  'banda aceh': 'Aceh',
  'lhokseumawe': 'Aceh',
  'langsa': 'Aceh',

  // Bengkulu
  'bengkulu': 'Bengkulu',
  'curup': 'Bengkulu',
};

// Province code mapping
const provinceCodeMap: Record<string, string> = {
  'Aceh': 'AC',
  'Sumatera Utara': 'SU',
  'Sumatera Barat': 'SB',
  'Riau': 'RI',
  'Jambi': 'JB',
  'Sumatera Selatan': 'SS',
  'Bangka Belitung': 'BB',
  'Lampung': 'LA',
  'Kepulauan Riau': 'KR',
  'DKI Jakarta': 'JK',
  'Jawa Barat': 'JB',
  'Jawa Tengah': 'JT',
  'DI Yogyakarta': 'YG',
  'Jawa Timur': 'JE',
  'Banten': 'BT',
  'Bali': 'BA',
  'Nusa Tenggara Barat': 'NB',
  'Nusa Tenggara Timur': 'NT',
  'Kalimantan Barat': 'KB',
  'Kalimantan Tengah': 'KT',
  'Kalimantan Selatan': 'KS',
  'Kalimantan Timur': 'KE',
  'Kalimantan Utara': 'KU',
  'Sulawesi Utara': 'SN',
  'Sulawesi Tengah': 'ST',
  'Sulawesi Selatan': 'SL',
  'Sulawesi Tenggara': 'SG',
  'Gorontalo': 'GO',
  'Maluku': 'MA',
  'Maluku Utara': 'MU',
  'Papua Barat': 'PB',
  'Papua': 'PA',
};

/**
 * Extract province from school name using keyword matching
 * @param schoolName - School name (e.g., "SMA Negeri 1 Jakarta")
 * @returns Province name or null if not found
 */
export function extractProvinceFromSchoolName(schoolName: string): string | null {
  if (!schoolName) return null;

  const lowerName = schoolName.toLowerCase();

  // Check each city keyword
  for (const [city, province] of Object.entries(cityToProvinceMap)) {
    if (lowerName.includes(city)) {
      return province;
    }
  }

  return null;
}

/**
 * Get province code from province name
 * @param provinceName - Province name (e.g., "DKI Jakarta")
 * @returns Province code (e.g., "JK")
 */
export function getProvinceCode(provinceName: string): string {
  if (!provinceName) return 'XX';
  return provinceCodeMap[provinceName] || 'XX';
}

/**
 * Search schools by name with optional province filter
 * @param query - Search query
 * @param province - Optional province filter
 * @returns Array of matching schools
 */
export function searchSchools(query: string, province?: string): SchoolLocation[] {
  const database = getSchoolLocationDatabase();
  const lowerQuery = query.toLowerCase();

  let results = database.filter((school) =>
    school.name.toLowerCase().includes(lowerQuery) ||
    school.city.toLowerCase().includes(lowerQuery) ||
    school.district.toLowerCase().includes(lowerQuery)
  );

  // Filter by province if provided
  if (province) {
    results = results.filter(
      (school) => school.province.toLowerCase() === province.toLowerCase()
    );
  }

  return results;
}

/**
 * Get schools grouped by province
 * @returns Object with provinces as keys and school arrays as values
 */
export function getSchoolsGroupedByProvince(): Record<string, SchoolLocation[]> {
  const database = getSchoolLocationDatabase();
  const grouped: Record<string, SchoolLocation[]> = {};

  // Initialize with all provinces
  getAllProvinces().forEach((province) => {
    grouped[province] = [];
  });

  // Group schools
  database.forEach((school) => {
    if (grouped[school.province]) {
      grouped[school.province].push(school);
    } else {
      grouped[school.province] = [school];
    }
  });

  return grouped;
}

/**
 * Get school statistics by province - DYNAMIC version using actual school data
 * @param schools - Array of actual school data from Google Sheets
 * @returns Object with province names, school counts, and codes (sorted by count DESC)
 */
export function getProvinceStatisticsFromData(schools: any[]): Array<{
  province: string;
  code: string;
  count: number;
}> {
  const grouped: Record<string, number> = {};

  // Group schools by province (direktorat)
  schools.forEach((school) => {
    const province = school.direktorat || 'Unknown';
    grouped[province] = (grouped[province] || 0) + 1;
  });

  // Convert to array and sort by count descending
  const stats: Array<{
    province: string;
    code: string;
    count: number;
  }> = Object.entries(grouped).map(([province, count]) => ({
    province,
    code: getProvinceCode(province),
    count,
  }));

  return stats.sort((a, b) => b.count - a.count);
}

/**
 * Get school statistics by province (LEGACY - uses hardcoded data)
 * @returns Object with province names, school counts, and codes
 */
export function getProvinceStatistics(): Array<{
  province: string;
  code: string;
  count: number;
}> {
  const grouped = getSchoolsGroupedByProvince();
  const stats: Array<{
    province: string;
    code: string;
    count: number;
  }> = [];

  for (const [province, schools] of Object.entries(grouped)) {
    stats.push({
      province,
      code: getProvinceCode(province),
      count: schools.length,
    });
  }

  return stats.sort((a, b) => b.count - a.count);
}

/**
 * Find similar schools by name (fuzzy match)
 * @param schoolName - School name to search
 * @param maxResults - Max results to return
 * @returns Array of similar schools
 */
export function findSimilarSchools(
  schoolName: string,
  maxResults: number = 5
): SchoolLocation[] {
  const database = getSchoolLocationDatabase();
  const lowerName = schoolName.toLowerCase();

  // Calculate similarity score
  const scored = database.map((school) => {
    const lowerSchoolName = school.name.toLowerCase();
    let score = 0;

    // Exact match
    if (lowerSchoolName === lowerName) score = 100;
    // Contains query
    else if (lowerSchoolName.includes(lowerName)) score = 80;
    // Query contains name
    else if (lowerName.includes(lowerSchoolName)) score = 60;
    // Word match
    else {
      const nameWords = lowerName.split(' ');
      const schoolWords = lowerSchoolName.split(' ');
      const matches = nameWords.filter((word) =>
        schoolWords.some((sWord) => sWord.includes(word) || word.includes(sWord))
      ).length;
      score = (matches / Math.max(nameWords.length, schoolWords.length)) * 50;
    }

    return { school, score };
  });

  return scored
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
    .map(({ school }) => school);
}

/**
 * Get schools by city
 * @param cityName - City name
 * @returns Array of schools in that city
 */
export function getSchoolsByCity(cityName: string): SchoolLocation[] {
  const database = getSchoolLocationDatabase();
  return database.filter(
    (school) => school.city.toLowerCase() === cityName.toLowerCase()
  );
}

/**
 * Get cities available in database
 * @returns Sorted array of unique city names
 */
export function getAllCities(): string[] {
  const database = getSchoolLocationDatabase();
  const cities = new Set(database.map((school) => school.city));
  return Array.from(cities).sort();
}
