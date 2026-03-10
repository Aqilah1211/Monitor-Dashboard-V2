export interface SchoolLocation {
  id: string;
  name: string;
  province: string;
  city: string;
  district: string;
}

const schoolLocations: SchoolLocation[] = [
  // DKI Jakarta
  { id: '1', name: 'SMA Negeri 1 Jakarta', province: 'DKI Jakarta', city: 'Jakarta Pusat', district: 'Menteng' },
  { id: '2', name: 'SMA Negeri 2 Jakarta', province: 'DKI Jakarta', city: 'Jakarta Selatan', district: 'Kebayoran Baru' },
  { id: '3', name: 'SMA Negeri 3 Jakarta', province: 'DKI Jakarta', city: 'Jakarta Barat', district: 'Palmerah' },

  // Jawa Barat
  { id: '4', name: 'SMA Negeri 1 Bandung', province: 'Jawa Barat', city: 'Bandung', district: 'Cidadap' },
  { id: '5', name: 'SMA Negeri 5 Bandung', province: 'Jawa Barat', city: 'Bandung', district: 'Isola' },
  { id: '6', name: 'SMA Negeri 1 Bogor', province: 'Jawa Barat', city: 'Bogor', district: 'Bogor Tengah' },

  // Jawa Tengah
  { id: '7', name: 'SMA Negeri 1 Semarang', province: 'Jawa Tengah', city: 'Semarang', district: 'Gajahmungkur' },
  { id: '8', name: 'SMA Negeri 1 Solo', province: 'Jawa Tengah', city: 'Surakarta', district: 'Serengan' },
  { id: '9', name: 'SMA Negeri 1 Pekalongan', province: 'Jawa Tengah', city: 'Pekalongan', district: 'Pekalongan Utara' },

  // Jawa Timur
  { id: '10', name: 'SMA Negeri 1 Surabaya', province: 'Jawa Timur', city: 'Surabaya', district: 'Wonokromo' },
  { id: '11', name: 'SMA Negeri 5 Surabaya', province: 'Jawa Timur', city: 'Surabaya', district: 'Genteng' },
  { id: '12', name: 'SMA Negeri 1 Malang', province: 'Jawa Timur', city: 'Malang', district: 'Blimbing' },

  // Banten
  { id: '13', name: 'SMA Negeri 1 Tangerang', province: 'Banten', city: 'Tangerang', district: 'Tangerang' },
  { id: '14', name: 'SMA Negeri 1 Serang', province: 'Banten', city: 'Serang', district: 'Serang' },
  { id: '15', name: 'SMA Negeri 1 Cilegon', province: 'Banten', city: 'Cilegon', district: 'Cibanten' },

  // Yogyakarta
  { id: '16', name: 'SMA Negeri 1 Yogyakarta', province: 'DI Yogyakarta', city: 'Yogyakarta', district: 'Gondokusuman' },
  { id: '17', name: 'SMA Negeri 2 Yogyakarta', province: 'DI Yogyakarta', city: 'Yogyakarta', district: 'Jetis' },
  { id: '18', name: 'SMA Negeri 1 Bantul', province: 'DI Yogyakarta', city: 'Bantul', district: 'Bantul' },

  // Sumatera Utara
  { id: '19', name: 'SMA Negeri 1 Medan', province: 'Sumatera Utara', city: 'Medan', district: 'Medan Merdeka' },
  { id: '20', name: 'SMA Negeri 4 Medan', province: 'Sumatera Utara', city: 'Medan', district: 'Pulo Brayan' },
  { id: '21', name: 'SMA Negeri 1 Pematangsiantar', province: 'Sumatera Utara', city: 'Pematangsiantar', district: 'Siantar Timur' },

  // Sumatera Barat
  { id: '22', name: 'SMA Negeri 1 Padang', province: 'Sumatera Barat', city: 'Padang', district: 'Padang Tengah' },
  { id: '23', name: 'SMA Negeri 2 Padang', province: 'Sumatera Barat', city: 'Padang', district: 'Padang Barat' },
  { id: '24', name: 'SMA Negeri 1 Bukittinggi', province: 'Sumatera Barat', city: 'Bukittinggi', district: 'Aur Birugo Tigo Baleh' },

  // Riau
  { id: '25', name: 'SMA Negeri 1 Pekanbaru', province: 'Riau', city: 'Pekanbaru', district: 'Pekanbaru Kota' },
  { id: '26', name: 'SMA Negeri 2 Pekanbaru', province: 'Riau', city: 'Pekanbaru', district: 'Sail' },
  { id: '27', name: 'SMA Negeri 1 Dumai', province: 'Riau', city: 'Dumai', district: 'Dumai Timur' },

  // Jambi
  { id: '28', name: 'SMA Negeri 1 Jambi', province: 'Jambi', city: 'Jambi', district: 'Jambi Timur' },
  { id: '29', name: 'SMA Negeri 2 Jambi', province: 'Jambi', city: 'Jambi', district: 'Jambi Selatan' },
  { id: '30', name: 'SMA Negeri 1 Sungai Penuh', province: 'Jambi', city: 'Sungai Penuh', district: 'Sungai Penuh' },

  // Sumatera Selatan
  { id: '31', name: 'SMA Negeri 1 Palembang', province: 'Sumatera Selatan', city: 'Palembang', district: 'Ilir Barat I' },
  { id: '32', name: 'SMA Negeri 2 Palembang', province: 'Sumatera Selatan', city: 'Palembang', district: 'Ilir Timur I' },
  { id: '33', name: 'SMA Negeri 1 Lahat', province: 'Sumatera Selatan', city: 'Lahat', district: 'Lahat' },

  // Lampung
  { id: '34', name: 'SMA Negeri 1 Bandar Lampung', province: 'Lampung', city: 'Bandar Lampung', district: 'Tanjung Karang pusat' },
  { id: '35', name: 'SMA Negeri 2 Bandar Lampung', province: 'Lampung', city: 'Bandar Lampung', district: 'Tanjung Karang Timur' },
  { id: '36', name: 'SMA Negeri 1 Pringsewu', province: 'Lampung', city: 'Pringsewu', district: 'Pringsewu' },

  // Bangka Belitung
  { id: '37', name: 'SMA Negeri 1 Pangkal Pinang', province: 'Bangka Belitung', city: 'Pangkal Pinang', district: 'Pangkal Pinang' },
  { id: '38', name: 'SMA Negeri 1 Bangka', province: 'Bangka Belitung', city: 'Bangka', district: 'Sungai Liat' },
  { id: '39', name: 'SMA Negeri 1 Belitung', province: 'Bangka Belitung', city: 'Belitung', district: 'Tanjung Pandan' },

  // Kepulauan Riau
  { id: '40', name: 'SMA Negeri 1 Tanjung Pinang', province: 'Kepulauan Riau', city: 'Tanjung Pinang', district: 'Tanjung Pinang Kota' },
  { id: '41', name: 'SMA Negeri 1 Batam', province: 'Kepulauan Riau', city: 'Batam', district: 'Batam Kota' },
  { id: '42', name: 'SMA Negeri 1 Karimun', province: 'Kepulauan Riau', city: 'Karimun', district: 'Karimun' },

  // Sulawesi Utara
  { id: '43', name: 'SMA Negeri 1 Manado', province: 'Sulawesi Utara', city: 'Manado', district: 'Manado' },
  { id: '44', name: 'SMA Negeri 2 Manado', province: 'Sulawesi Utara', city: 'Manado', district: 'Wanea' },
  { id: '45', name: 'SMA Negeri 1 Bitung', province: 'Sulawesi Utara', city: 'Bitung', district: 'Bitung Selatan' },

  // Gorontalo
  { id: '46', name: 'SMA Negeri 1 Gorontalo', province: 'Gorontalo', city: 'Gorontalo', district: 'Gorontalo' },
  { id: '47', name: 'SMA Negeri 2 Gorontalo', province: 'Gorontalo', city: 'Gorontalo', district: 'Kota Timur' },
  { id: '48', name: 'SMA Negeri 1 Manado Bitung', province: 'Gorontalo', city: 'Tilamuta', district: 'Tilamuta' },

  // Sulawesi Tengah
  { id: '49', name: 'SMA Negeri 1 Palu', province: 'Sulawesi Tengah', city: 'Palu', district: 'Palu Barat' },
  { id: '50', name: 'SMA Negeri 2 Palu', province: 'Sulawesi Tengah', city: 'Palu', district: 'Palu Timur' },
  { id: '51', name: 'SMA Negeri 1 Banggai', province: 'Sulawesi Tengah', city: 'Banggai', district: 'Banggai Selatan' },

  // Sulawesi Selatan
  { id: '52', name: 'SMA Negeri 1 Makassar', province: 'Sulawesi Selatan', city: 'Makassar', district: 'Makassar' },
  { id: '53', name: 'SMA Negeri 3 Makassar', province: 'Sulawesi Selatan', city: 'Makassar', district: 'Rappocini' },
  { id: '54', name: 'SMA Negeri 1 Pare-Pare', province: 'Sulawesi Selatan', city: 'Pare-Pare', district: 'Soreang' },

  // Sulawesi Tenggara
  { id: '55', name: 'SMA Negeri 1 Kendari', province: 'Sulawesi Tenggara', city: 'Kendari', district: 'Kendari' },
  { id: '56', name: 'SMA Negeri 2 Kendari', province: 'Sulawesi Tenggara', city: 'Kendari', district: 'Kadia' },
  { id: '57', name: 'SMA Negeri 1 Baubau', province: 'Sulawesi Tenggara', city: 'Baubau', district: 'Baubau' },

  // Maluku
  { id: '58', name: 'SMA Negeri 1 Ambon', province: 'Maluku', city: 'Ambon', district: 'Sirimau' },
  { id: '59', name: 'SMA Negeri 2 Ambon', province: 'Maluku', city: 'Ambon', district: 'Nusaniwe' },
  { id: '60', name: 'SMA Negeri 1 Tual', province: 'Maluku', city: 'Tual', district: 'Tual' },

  // Maluku Utara
  { id: '61', name: 'SMA Negeri 1 Ternate', province: 'Maluku Utara', city: 'Ternate', district: 'Ternate Tengah' },
  { id: '62', name: 'SMA Negeri 2 Ternate', province: 'Maluku Utara', city: 'Ternate', district: 'Gambesi' },
  { id: '63', name: 'SMA Negeri 1 Tidore', province: 'Maluku Utara', city: 'Tidore', district: 'Tidore Tengah' },

  // Papua Barat
  { id: '64', name: 'SMA Negeri 1 Manokwari', province: 'Papua Barat', city: 'Manokwari', district: 'Manokwari Timur' },
  { id: '65', name: 'SMA Negeri 2 Manokwari', province: 'Papua Barat', city: 'Manokwari', district: 'Manokwari Barat' },
  { id: '66', name: 'SMA Negeri 1 Sorong', province: 'Papua Barat', city: 'Sorong', district: 'Sorong' },

  // Papua
  { id: '67', name: 'SMA Negeri 1 Jayapura', province: 'Papua', city: 'Jayapura', district: 'Jayapura Utara' },
  { id: '68', name: 'SMA Negeri 2 Jayapura', province: 'Papua', city: 'Jayapura', district: 'Jayapura Tengah' },
  { id: '69', name: 'SMA Negeri 1 Timika', province: 'Papua', city: 'Timika', district: 'Mimika' },

  // Kalimantan Barat
  { id: '70', name: 'SMA Negeri 1 Pontianak', province: 'Kalimantan Barat', city: 'Pontianak', district: 'Pontianak Kota' },
  { id: '71', name: 'SMA Negeri 2 Pontianak', province: 'Kalimantan Barat', city: 'Pontianak', district: 'Pontianak Utara' },
  { id: '72', name: 'SMA Negeri 1 Singkawang', province: 'Kalimantan Barat', city: 'Singkawang', district: 'Singkawang Selatan' },

  // Kalimantan Tengah
  { id: '73', name: 'SMA Negeri 1 Palangka Raya', province: 'Kalimantan Tengah', city: 'Palangka Raya', district: 'Pahandut' },
  { id: '74', name: 'SMA Negeri 2 Palangka Raya', province: 'Kalimantan Tengah', city: 'Palangka Raya', district: 'Sebangau' },
  { id: '75', name: 'SMA Negeri 1 Sampit', province: 'Kalimantan Tengah', city: 'Sampit', district: 'Sampit' },

  // Kalimantan Selatan
  { id: '76', name: 'SMA Negeri 1 Banjarmasin', province: 'Kalimantan Selatan', city: 'Banjarmasin', district: 'Banjarmasin Tengah' },
  { id: '77', name: 'SMA Negeri 2 Banjarmasin', province: 'Kalimantan Selatan', city: 'Banjarmasin', district: 'Banjarmasin Timur' },
  { id: '78', name: 'SMA Negeri 1 Martapura', province: 'Kalimantan Selatan', city: 'Martapura', district: 'Martapura' },

  // Kalimantan Timur
  { id: '79', name: 'SMA Negeri 1 Samarinda', province: 'Kalimantan Timur', city: 'Samarinda', district: 'Samarinda Kota' },
  { id: '80', name: 'SMA Negeri 6 Samarinda', province: 'Kalimantan Timur', city: 'Samarinda', district: 'Samarinda Ulu' },
  { id: '81', name: 'SMA Negeri 1 Balikpapan', province: 'Kalimantan Timur', city: 'Balikpapan', district: 'Balikpapan Pusat' },

  // Kalimantan Utara
  { id: '82', name: 'SMA Negeri 1 Tarakan', province: 'Kalimantan Utara', city: 'Tarakan', district: 'Tarakan Tengah' },
  { id: '83', name: 'SMA Negeri 2 Tarakan', province: 'Kalimantan Utara', city: 'Tarakan', district: 'Tarakan Timur' },
  { id: '84', name: 'SMA Negeri 1 Tanjung Selor', province: 'Kalimantan Utara', city: 'Tanjung Selor', district: 'Tanjung Selor' },

  // Bali
  { id: '85', name: 'SMA Negeri 1 Denpasar', province: 'Bali', city: 'Denpasar', district: 'Denpasar Selatan' },
  { id: '86', name: 'SMA Negeri 3 Denpasar', province: 'Bali', city: 'Denpasar', district: 'Denpasar Timur' },
  { id: '87', name: 'SMA Negeri 1 Ubud', province: 'Bali', city: 'Ubud', district: 'Ubud' },

  // Nusa Tenggara Barat
  { id: '88', name: 'SMA Negeri 1 Mataram', province: 'Nusa Tenggara Barat', city: 'Mataram', district: 'Mataram' },
  { id: '89', name: 'SMA Negeri 2 Mataram', province: 'Nusa Tenggara Barat', city: 'Mataram', district: 'Ampenan' },
  { id: '90', name: 'SMA Negeri 1 Kupang', province: 'Nusa Tenggara Timur', city: 'Kupang', district: 'Kupang Tengah' },

  // Nusa Tenggara Timur
  { id: '91', name: 'SMA Negeri 2 Kupang', province: 'Nusa Tenggara Timur', city: 'Kupang', district: 'Kupang Timur' },
  { id: '92', name: 'SMA Negeri 1 Maumere', province: 'Nusa Tenggara Timur', city: 'Maumere', district: 'Maumere' },
  { id: '93', name: 'SMA Negeri 1 Dili', province: 'Nusa Tenggara Timur', city: 'Dili', district: 'Dili' },

  // Aceh
  { id: '94', name: 'SMA Negeri 1 Banda Aceh', province: 'Aceh', city: 'Banda Aceh', district: 'Kuta Alam' },
  { id: '95', name: 'SMA Negeri 3 Banda Aceh', province: 'Aceh', city: 'Banda Aceh', district: 'Kuta Rani' },
  { id: '96', name: 'SMA Negeri 1 Lhokseumawe', province: 'Aceh', city: 'Lhokseumawe', district: 'Muara Dua' },

  // Bengkulu
  { id: '97', name: 'SMA Negeri 1 Bengkulu', province: 'Bengkulu', city: 'Bengkulu', district: 'Bengkulu Tengah' },
  { id: '98', name: 'SMA Negeri 2 Bengkulu', province: 'Bengkulu', city: 'Bengkulu', district: 'Bengkulu Selatan' },
  { id: '99', name: 'SMA Negeri 1 Curup', province: 'Bengkulu', city: 'Curup', district: 'Curup' },

  // TimBul (additional records)
  { id: '100', name: 'SMA Negeri 1 Palopo', province: 'Sulawesi Selatan', city: 'Palopo', district: 'Palopo Utara' },
];

/**
 * Get school location by name
 */
export function getSchoolLocation(schoolName: string): SchoolLocation | null {
  return schoolLocations.find(
    (school) => school.name.toLowerCase() === schoolName.toLowerCase()
  ) || null;
}

/**
 * Get all unique provinces
 */
export function getAllProvinces(): string[] {
  const provinces = new Set(schoolLocations.map((school) => school.province));
  return Array.from(provinces).sort();
}

/**
 * Get all schools by province
 */
export function getSchoolsByProvince(province: string): SchoolLocation[] {
  return schoolLocations.filter(
    (school) => school.province.toLowerCase() === province.toLowerCase()
  );
}

/**
 * Get school location database
 */
export function getSchoolLocationDatabase(): SchoolLocation[] {
  return schoolLocations;
}
