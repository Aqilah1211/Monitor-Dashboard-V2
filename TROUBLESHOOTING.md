# 🔍 TROUBLESHOOTING GUIDE - IFP Dashboard

## ❌ Data Tidak Muncul Setelah Paste Spreadsheet ID

### **Kemungkinan Penyebab:**

#### **1. Spreadsheet Access Permission** ⚠️
```
❌ Spreadsheet private atau restricted
✅ Harus di-share dengan "Anyone with the link" atau "Public"
```

**Cara perbaiki:**
1. Google Sheets URL → Klik **Share**
2. Pilih **"Viewer"** dan set ke **"Anyone with the link"**

---

#### **2. COLUMN_MAP Tidak Sesuai Struktur** 📊

Struktur spreadsheet Anda mungkin berbeda dari default.

**File:** `src/hooks/useGoogleSheets.ts` (Line 8-15)

**Default (Salah):**
```typescript
const COLUMN_MAP = {
  NPSN: 3,        // Kolom ke-3
  NAMA: 8,        // Kolom ke-8  
  DIREKTORAT: 1,  // Kolom ke-1
  TANGGAL: 19,    // Kolom ke-19
  STATUS: 20,     // Kolom ke-20
  KENDALA: 21     // Kolom ke-21
}
```

**Cara Mencari Posisi yang Benar:**

1. Buka Dashboard → Settings
2. Input Spreadsheet ID dan Sheet Name
3. Klik "Sync Now"
4. Buka Browser Console (F12 → Console tab)
5. Cari log: **"Raw Array"** atau **"Header row"**
6. Hitung posisi kolom (mulai dari 0):

```
Contoh output console:
Header row: [
  "No",          // Index 0
  "Direktorat",  // Index 1 ← DIREKTORAT
  "Provinsi",    // Index 2
  "NPSN",        // Index 3 ← NPSN
  ...
  "Nama Sekolah",// Index 8 ← NAMA
  ...
  "Tanggal",     // Index 19 ← TANGGAL
  "Status",      // Index 20 ← STATUS
  "Kendala"      // Index 21 ← KENDALA
]
```

**Update COLUMN_MAP sesuai posisi yang ditemukan:**

```typescript
const COLUMN_MAP = {
  NPSN: 3,        // ← Sesuaikan dengan posisi di spreadsheet Anda
  NAMA: 8,
  DIREKTORAT: 1,
  TANGGAL: 19,
  STATUS: 20,
  KENDALA: 21
}
```

---

#### **3. Status Filter Tidak Cocok** 📋

Default code mencari **"selesai"** dalam status.

**File:** `src/hooks/useGoogleSheets.ts` (Line 40)

```typescript
const isInstalled = item.status.includes('selesai');
```

**Jika di spreadsheet Anda gunakan:**
- ✅ "Sudah Terpasang"
- ✅ "Done"
- ✅ "Terinstall"

**Ubah jadi:**
```typescript
const isInstalled = item.status.toLowerCase().includes('terpasang') 
                 || item.status.toLowerCase().includes('selesai')
                 || item.status.toLowerCase().includes('done');
```

---

#### **4. Sheet Name/Tab Salah** 📑

Pastikan nama sheet di Settings **PERSIS sama** dengan tab di spreadsheet.

**❌ Salah:**
```
Settings: "5, Rekap"
Spreadsheet tab: "5", "Rekapitulasi"  ← Nama beda!
```

**✅ Benar:**
```
Settings: "5, Rekapitulasi"
Spreadsheet tab: "5", "Rekapitulasi"  ← Sama persis
```

---

#### **5. Browser Console Error** 🖥️

Buka F12 → Console tab, cari error messages seperti:

```
❌ "HTTP 404: Forbidden"
   → Spreadsheet tidak bisa diakses (permission issue)

❌ "CSV berhasil diambil, size: 0 bytes"
   → Data kosong atau sheet tidak ada

❌ "Row tidak valid di index 1"
   → Row terlalu pendek, mungkin COLUMN_MAP posisi salah
```

---

## 🛠️ DEBUGGING STEPS

### **Step 1: Aktifkan Raw Data Viewer**
- Buka Dashboard
- Scroll ke bawah → Klik "Raw Data Viewer"
- Lihat data pertama yang ter-fetch

### **Step 2: Cek Browser Console (F12)**
Cari logs yang dimulai dengan:
- 🚀 (blue) = Proses dimulai
- ✅ (green) = Berhasil
- ⚠️ (yellow) = Warning
- ❌ (red) = Error

### **Step 3: Test CSV URL Langsung**
Buat URL test:
```
https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet=5
```

Ganti `{SPREADSHEET_ID}` dengan ID Anda. Buka di browser:
- ✅ Jika download file CSV → Connection OK
- ❌ Jika error page → Check permission

---

## 📞 COMMON FIXES

| Error | Solusi |
|-------|--------|
| "Sheet ID atau nama sheet belum diatur" | Isi Settings dengan benar, reload |
| "HTTP 403: Forbidden" | Sharesheet ke "Anyone with the link" |
| "Data loading but empty" | Check COLUMN_MAP positions |
| "Installed count = 0" | Update status filter keyword |
| "No data at all" | Verify sheet name is correct |

---

## 💡 TIPS

1. **Baca Console Logs** - Most errors ada di console
2. **Verify Spreadsheet Akses** - Coba buka CSV URL langsung di browser
3. **Update COLUMN_MAP** - Ini yang paling sering jadi masalah
4. **Check Sheet Name** - Harus persis sama dengan di spreadsheet
5. **Reload Browser** - Kadang perlu hard refresh (Ctrl+Shift+R)

---

## 📝 CONTOH SPREADSHEET STRUCTURE

Jika spreadsheet Anda struktur seperti ini:

```
| 0  | 1       | 2      | 3    | ... | 8          | ... | 19   | 20     | 21     |
|----|---------+--------+------+-----+------------+-----+------+--------+--------|
| No | Dir     | Prov   | NPSN | ... | Nama       | ... | Tgl  | Status | Kendala|
| 1  | Dikdas  | Jabar  | 123  | ... | SMPN 5     | ... | 2/10 | Selesai| -      |
| 2  | Dikdas  | Jatim  | 456  | ... | SMA 1      | ... | 2/11 | Pending| Error  |
```

**COLUMN_MAP yang benar:**
```typescript
const COLUMN_MAP = {
  NPSN: 3,        // Kolom No. 3
  NAMA: 8,        // Kolom No. 8
  DIREKTORAT: 1,  // Kolom No. 1
  TANGGAL: 19,    // Kolom No. 19
  STATUS: 20,     // Kolom No. 20
  KENDALA: 21     // Kolom No. 21
}
```

---

**Masih error? Buka Console (F12) dan paste error message lengkapnya!** 🚀
