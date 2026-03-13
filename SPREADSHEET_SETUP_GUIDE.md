# 📊 PANDUAN LENGKAP SETUP SPREADSHEET GOOGLE SHEETS

## ❌ MASALAH UMUM ERROR 404

Setiap kali ganti spreadsheet error 404? **Masalahnya adalah:**

1. **Spreadsheet tidak di-share publik** ← Yang paling sering!
2. **Nama sheet (tab) salah** ← Case-sensitive!
3. **Kolom tidak sesuai format** ← Sistem tidak bisa deteksi
4. **Cache data lama masih ada** ← Sudah di-fix, auto clear sekarang

---

## ✅ LANGKAH-LANGKAH SETUP BENAR

### 1️⃣ BUAT SPREADSHEET DI GOOGLE SHEETS

```
https://docs.google.com/spreadsheets → Buat spreadsheet baru
```

**Beri nama yang jelas:** `Data Sekolah` atau `Master TV Hisense`

---

### 2️⃣ SETUP KOLOM DENGAN BENAR

**Row 1 (Header) - WAJIB persis seperti ini:**

| NPSN | NAMA | DIREKTORAT | TANGGAL | STATUS | KENDALA |
|------|------|-----------|---------|--------|----------|

**PENTING:**
- Nama kolom CASE-SENSITIVE (harus HURUF BESAR semua)
- Urutan kolom tidak perlu sama, yang penting nama headernya
- Minimal harus ada 6 kolom ini

---

### 3️⃣ COPY DATA TEMPLATE

**Contoh 20 sekolah (copy-paste ke Sheet Anda):**

```
NPSN	NAMA	DIREKTORAT	TANGGAL	STATUS	KENDALA
20107001	SMA Negeri 1 Jakarta	DKI Jakarta	2025-12-15	selesai	
20107002	SMA Negeri 2 Jakarta	DKI Jakarta	2025-12-10	selesai	
20107003	SMA Negeri 3 Jakarta	DKI Jakarta	2026-01-20	proses	Menunggu persetujuan
20201001	SMA Negeri 1 Bandung	Jawa Barat	2025-11-05	selesai	
20201002	SMA Negeri 2 Bandung	Jawa Barat	2025-11-08	selesai	
20201003	SMA Negeri 3 Bandung	Jawa Barat	2026-01-15	proses	Belum ada persetujuan
20301001	SMA Negeri 1 Semarang	Jawa Tengah	2025-10-20	selesai	
20301002	SMA Negeri 2 Semarang	Jawa Tengah	2026-02-01	pending	
20401001	SMA Negeri 1 Yogyakarta	DI Yogyakarta	2025-09-10	selesai	
20401002	SMA Negeri 2 Yogyakarta	DI Yogyakarta	2026-01-25	proses	Menunggu sparepart
20501001	SMA Negeri 1 Surabaya	Jawa Timur	2025-08-15	selesai	
20501002	SMA Negeri 2 Surabaya	Jawa Timur	2026-03-01	pending	
20501003	SMA Negeri 3 Surabaya	Jawa Timur	2025-12-01	selesai	Masalah koneksi WiFi
20601001	SMA Negeri 1 Medan	Sumatera Utara	2025-11-20	selesai	
20601002	SMA Negeri 2 Medan	Sumatera Utara	2026-02-15	proses	Koordinasi dengan dinas
20701001	SMA Negeri 1 Palembang	Sumatera Selatan	2025-10-10	selesai	
20701002	SMA Negeri 2 Palembang	Sumatera Selatan	2026-01-30	pending	
20801001	SMA Negeri 1 Makassar	Sulawesi Selatan	2025-09-05	selesai	
20801002	SMA Negeri 2 Makassar	Sulawesi Selatan	2026-02-20	proses	Perlu kalibrasi
20901001	SMA Negeri 1 Denpasar	Bali	2025-11-12	selesai	
```

**Cara paste:**
1. Pilih sel A1 di spreadsheet Anda
2. Paste (Ctrl+V)
3. Google Sheets otomatis split kolom dengan Tab separator ✅

---

### 4️⃣ SHARE SPREADSHEET PUBLIK ⚠️ PALING PENTING

Ini yang 90% penyebab error 404!

1. **Buka spreadsheet** di Google Drive
2. **Klik tombol SHARE** (pojok kanan atas, icon berbagi)
3. **Ubah setting menjadi:**
   
   ![image](https://user-images.githubusercontent.com/48...-share.png)
   
   **Pilih: "Akses publik" → "Siapa saja dengan link"**

4. **Copy link spreadsheet**:
   ```
   https://docs.google.com/spreadsheets/d/1E4UBDg9M0RKTvtJCXUOg4IWQmvl1mdmIqeN9CyRw5qs/edit#gid=0
   ```

5. **Extract Spreadsheet ID** (bagian besar di tengah):
   ```
   1E4UBDg9M0RKTvtJCXUOg4IWQmvl1mdmIqeN9CyRw5qs
   ```

---

### 5️⃣ INPUT KE APLIKASI

1. **Buka**: https://ifp-dashboard.vercel.app
2. **Klik tab**: ⚙️ Settings (pojok kanan bawah)
3. **Masukkan**:
   - **Spreadsheet ID**: `1E4UBDg9M0RKTvtJCXUOg4IWQmvl1mdmIqeN9CyRw5qs`
   - **Nama Sheet**: `Sheet1` (atau nama sheet Anda)

4. **Klik tombol HIJAU**: "🧪 Tes Koneksi"
5. **TUNGGU~** sampe muncul ✅ "Spreadsheet berhasil diakses!"
6. **Baru klik**: "💾 Simpan Pengaturan"

---

## 📋 REFERENSI FORMAT KOLOM

### NPSN
- **Tipe**: Teks/Angka
- **Contoh**: `20107001`
- **Wajib**: YA (jika kosong, row akan dihapus)

### NAMA
- **Tipe**: Teks
- **Contoh**: `SMA Negeri 1 Jakarta`
- **Max char**: Bebas

### DIREKTORAT
- **Tipe**: Teks (nama provinsi)
- **Contoh**: `DKI Jakarta`, `Jawa Barat`, `Jawa Timur`
- **Preview**: Akan muncul di filter dropdown

### TANGGAL
- **Tipe**: Tanggal
- **Format BENAR**: 
  - `2025-12-15` (YYYY-MM-DD) ✅
  - `15/12/2025` (DD/MM/YYYY) ✅
- **Format SALAH**: 
  - `15-12-2025` ❌
  - `2025/12/15` ❌
- **Google Sheets Auto-convert**: Jika Anda paste format apapun, Sheets bisa auto-convert

### STATUS
- **Tipe**: Teks
- **Nilai yang dikenali**:

| Status | Kategori | Apa artinya |
|--------|----------|----------|
| `selesai` | Installed | Pemasangan sudah selesai |
| `terpasang` | Installed | Sama dengan selesai |
| `proses` | Pending | Masih proses instalasi |
| `proses instalasi` | Pending | Detail proses instalasi |
| `pending` | Pending | Belum mulai instalasi |
| Nilai lain | Pending | Dianggap pending |

**PENTING**: Case-insensitive (SELESAI = selesai = Selesai) ✅

### KENDALA
- **Tipe**: Teks (optional)
- **Contoh**: `Menunggu persetujuan`, `Masalah koneksi`, kosong jika tidak ada
- **Fungsi**: Jika ada isi → row masuk kategori "Troubles" di aplikasi

---

## 🔍 TROUBLESHOOTING

### ❌ Error: "404 NOT_FOUND"

**Penyebab**: Spreadsheet tidak bisa diakses
- [ ] Cek apakah sudah di-share publik? **Go to Step 4️⃣**
- [ ] Cek Spreadsheet ID benar? Copy ulang dari URL
- [ ] Cek Sheet name benar? (case-sensitive!)
- [ ] Tunggu 5 detik, coba Test Koneksi lagi

---

### ❌ Error: "Spreadsheet accessible tapi tidak ada data"

**Penyebab**: Sheet kosong atau nama sheet salah
- [ ] Buka spreadsheet → cek ada data di sheet A1?
- [ ] Nama sheet benar? Contoh: `Sheet1`, `Data Sekolah`, `Master`
- [ ] Header row ada di row 1? (NPSN, NAMA, DIREKTORAT, dll)

---

### ❌ Error: "Format ID Spreadsheet tidak valid"

**Penyebab**: ID terlalu pendek atau format salah
- [ ] Copy ID dari browser URL bar yang benar
- [ ] Jangan copy link penuh, ambil ID bagian tengah saja
- [ ] Contoh SALAH: `https://docs.google.com/spreadsheets/d/...`
- [ ] Contoh BENAR: `1E4UBDg9M0RKTvtJCXUOg4IWQmvl1mdmIqeN9CyRw5qs`

---

### ❌ Spreadsheet berhasil tapi data tidak muncul

**Penyebab**: Kolom format salah
- [ ] Header harus PERSIS: NPSN, NAMA, DIREKTORAT, TANGGAL, STATUS, KENDALA
- [ ] Case-sensitive (harus HURUF BESAR)
- [ ] Pastikan tidak ada space kosong sebelum/sesudah nama kolom
- [ ] Aplikasi akan auto-detect kolom, otomatis split data per kolom

---

### ⚠️ Data ditampilkan tapi tidak lengkap

**Penyebab**: Ada baris dengan NPSN kosong
- [ ] Aplikasi skip otomatis baris tanpa NPSN
- [ ] Cek apakah ada baris kosong atau notes?
- [ ] Hapus baris kosong, tinggal data valid saja

---

## 🚀 BEST PRACTICES

### ✅ DO:
- Gunakan nama sheet yang jelas: `Data Sekolah`, `Master`, `TV Hisense`
- Share ke "Siapa saja dengan link" untuk akses publik
- Tes koneksi SEBELUM klik Simpan
- Simpen backup data di Excel lokal
- Update data secara regular

### ❌ DON'T:
- Jangan share ke "Restricted" atau "Specific people"
- Jangan ubah nama kolom (harus tetap: NPSN, NAMA, DIREKTORAT, dll)
- Jangan hapus header row
- Jangan ganti sheet tanpa update nama di aplikasi
- Jangan paste data tanpa verifikasi format

---

## 📞 PERLU BANTUAN?

Jika masih error setelah ikuti semua steps:

1. **Clear browser cache**: Ctrl+Shift+Del → Clear cache
2. **Refresh aplikasi**: F5 atau Ctrl+R
3. **Logout dan login ulang**
4. **Coba spreadsheet baru** dengan template di bawah

---

## 📑 CHECKLIST FINAL

Sebelum production, pastikan:

- [ ] Spreadsheet dibuat dan ada data
- [ ] Header row: NPSN, NAMA, DIREKTORAT, TANGGAL, STATUS, KENDALA
- [ ] Minimal 10 baris data (untuk testing)
- [ ] Share setting: "Siapa saja dengan link"
- [ ] Copy Spreadsheet ID dari URL
- [ ] Paste ke Settings → Tes Koneksi
- [ ] Status: ✅ "Spreadsheet berhasil diakses!"
- [ ] Klik Simpan Pengaturan
- [ ] Refresh aplikasi
- [ ] Data muncul di Overview, Installed, Pending, Troubles tabs ✅

---

**Selesai! 🎉 Aplikasi siap digunakan.**
