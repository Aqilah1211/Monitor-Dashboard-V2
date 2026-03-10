# 🔧 Debugging Checklist - 404 NOT_FOUND Error di Vercel

## 📋 CHECKLIST DEBUGGING PRIORITAS TINGGI

### 1️⃣ Setup & Konfigurasi Spreadsheet
- [ ] **Verifikasi Spreadsheet ID Format**
  - Spreadsheet ID harus 20+ karakter (alphanumeric + dash/underscore)
  - Format: https://docs.google.com/spreadsheets/d/**[SPREADSHEET_ID]**/edit
  - Contoh valid: `1E4UBDg9M0RKTvtJCXUOg4IWQmvl1mdmIqeN9CyRw5qs`

- [ ] **PENTING: Share Spreadsheet ke Public**
  - Buka spreadsheet di browser
  - Klik tombol "Share" (pojok kanan atas)
  - Ubah permission menjadi "Anyone with the link" atau "Public"
  - JANGAN pilih "Specific people" - itu akan error 403/404
  - Pastikan access level = "Viewer" atau lebih tinggi

- [ ] **Verifikasi Sheet Name**
  - Nama sheet harus exact sesuai dengan tab di spreadsheet
  - Nama tab terlihat di bawah spreadsheet (misal: "LJCOMP", "5", "Rekap")
  - JANGAN gunakan GID (angka internal), gunakan nama tab
  - Periksa ada spasi atau karakter khusus?

- [ ] **Test di Browser (Manual Check)**
  - Copy URL ini ke browser:
    ```
    https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/gviz/tq?tqx=out:csv&sheet=[SHEET_NAME]
    ```
  - Ganti `[SPREADSHEET_ID]` dan `[SHEET_NAME]`
  - Jika error 404/403 → spreadsheet belum di-share public
  - Jika berhasil → lihat CSV data di browser

### 2️⃣ Environment Variables (Vercel Dashboard)
- [ ] Buka https://vercel.com/dashboard
- [ ] Pilih project `ifp-dashboard`
- [ ] Ke Settings → Environment Variables
- [ ] Periksa apakah ada env vars yang dibutuhkan:
  - `VITE_GOOGLE_SHEETS_API_KEY` (jika ada)
  - `VITE_SPREADSHEET_ID` (jika di-hardcode)
  - Jika ada, pastikan nilainya valid dan ter-update
- [ ] **Jika update env vars** → MUST REDEPLOY aplikasi

### 3️⃣ Vercel Deployment Logs
- [ ] Akses https://vercel.com/dashboard/ifp-dashboard
- [ ] Klik "Deployments" tab
- [ ] Lihat deployment terbaru (biasanya paling atas)
- [ ] Klik untuk lihat "Build Logs" dan "Function Logs"
- [ ] Cari error messages:
  - ❌ "404 Not Found" → spreadsheet tidak di-share
  - ❌ "403 Forbidden" → permission issue
  - ❌ "Network timeout" → internet issue
  - ❌ "Invalid spreadsheet ID" → check format ID

### 4️⃣ Test di Browser Console (Developer Tools)
- [ ] Buka aplikasi di Vercel: https://monitor-dashboard-v2.vercel.app
- [ ] Tekan `F12` untuk buka Developer Tools
- [ ] Masuk ke tab "Console"
- [ ] Ketik ini untuk lihat recent logs:
  ```javascript
  __getLogs()
  ```
- [ ] Ketik ini untuk export logs jadi CSV:
  ```javascript
  __exportLogs()
  ```
- [ ] Cari error messages di console
- [ ] Cek "Network" tab → lihat requests yang gagal (red)
  - Klik request yang merah
  - Lihat "Response" → error message apa?

### 5️⃣ Clear Cache & Redeploy
- [ ] **Clear Vercel Cache:**
  - Buka https://vercel.com/dashboard/ifp-dashboard
  - Klik "Settings"
  - Cari "Deployments" section
  - Klik "Clear Function Cache" atau "Clear All"

- [ ] **Force Redeploy:**
  - Option A: Buka Vercel Dashboard → "Deployments" → klik "..." pada latest → "Redeploy"
  - Option B: Di local, jalankan:
    ```bash
    git commit --allow-empty -m "chore: trigger redeploy"
    git push
    ```

### 6️⃣ Test di Vercel Preview (Staging) Dulu
- [ ] Jangan test langsung di Production
- [ ] Buat branch baru untuk test:
  ```bash
  git checkout -b test/spreadsheet-fix
  ```
- [ ] Update settings di branch ini
- [ ] Push ke GitHub
- [ ] Vercel otomatis buat Preview Deployment
- [ ] Buka Preview URL (biasanya ada di PR atau Vercel dashboard)
- [ ] Test di preview dulu sebelum merge ke main
- [ ] Jika berhasil di preview → merge ke main → production auto-deploy

### 7️⃣ Network & CORS Issues
- [ ] Periksa koneksi internet (Wifi/4G nyala?)
- [ ] Coba buka ini di browser:
  ```
  https://docs.google.com/spreadsheets/d/1E4UBDg9M0RKTvtJCXUOg4IWQmvl1mdmIqeN9CyRw5qs/edit
  ```
- [ ] Jika bisa diakses dari browser (tidak blank) → konfigurasi benar
- [ ] Jika error 404/403 di browser juga → spreadsheet problem, bukan aplikasi

### 8️⃣ Advanced Debugging
- [ ] **Test Health Check Endpoint:**
  ```
  https://monitor-dashboard-v2.vercel.app/api/health?spreadsheetId=YOUR_ID&sheetName=YOUR_SHEET
  ```
  - Ini akan return detailed health status
  - Bisa lihat error detail dalam response

- [ ] **Check Spreadsheet Validation:**
  - Buka Settings page di aplikasi
  - Masukkan Spreadsheet ID
  - Klik "🧪 Tes Koneksi"
  - Baca error message yang muncul
  - Follow suggestions untuk fix

- [ ] **Enable Debug Mode:**
  - Buka browser console (F12 → Console)
  - Ketik:
    ```javascript
    localStorage.setItem('_debug', 'true');
    location.reload();
    ```
  - Aplikasi akan log lebih detail ke console
  - Lihat console untuk error messages

---

## 🚨 ERROR RESOLUTION GUIDE

### 404 NOT FOUND
**Penyebab Utama:** Spreadsheet tidak di-share public

**Solusi:**
```
1. Buka spreadsheet di Google Drive
2. Klik "Share" (pojok kanan atas)
3. Ubah ke "Anyone with the link"
4. Copy link dan test di aplikasi
5. Tunggu 30 detik, kemudian reload aplikasi
```

### 403 FORBIDDEN
**Penyebab:** Permission denied / spreadsheet tidak accessible

**Solusi:**
```
1. Pastikan spreadsheet di-share ke "Public" atau "Anyone with link"
2. Periksa access level = "Viewer" minimum
3. Jangan gunakan "Specific people" option
```

### Network Timeout
**Penyebab:** Internet lambat atau server Google Sheets down

**Solusi:**
```
1. Periksa koneksi internet
2. Coba lagi dalam 1-2 menit
3. Coba di browser berbeda
```

### Invalid Spreadsheet ID
**Penyebab:** Format ID salah

**Solusi:**
```
1. Copy ID dari URL: https://docs.google.com/spreadsheets/d/[ID]/edit
2. Pastikan ID minimal 20 karakter
3. Jangan include "/edit" atau domain di ID
```

---

## 📊 TESTING SPREADSHEET

### Spreadsheet untuk Testing
- **ID:** `1E4UBDg9M0RKTvtJCXUOg4IWQmvl1mdmIqeN9CyRw5qs`
- **Sheet Name:** `LJCOMP`
- **Status:** Public (SUDAH di-share)
- **Data:** 40+ rows dengan columns: NPSN, Direktur, Nama, Alamat, Status, Dates

### Testing Steps
```bash
1. Buka https://monitor-dashboard-v2.vercel.app/settings
2. Masukkan ID: 1E4UBDg9M0RKTvtJCXUOg4IWQmvl1mdmIqeN9CyRw5qs
3. Masukkan Sheet: LJCOMP
4. Klik "🧪 Tes Koneksi"
5. Tunggu response (should berhasil dalam 5-10 detik)
6. Jika berhasil → klik "✅ Simpan Perubahan"
7. Buka Overview → lihat data muncul?
```

---

## 🔗 USEFUL COMMANDS (Di Terminal/PowerShell)

### Build & Deploy
```bash
# Build app
npm run build

# Check TypeScript errors
npm run build

# View logs (jika deployed)
vercel logs
```

### Git Commands
```bash
# Create test branch
git checkout -b test/spreadsheet-check

# Commit changes
git add .
git commit -m "test: Update spreadsheet config"
git push origin test/spreadsheet-check

# Merge to main
git checkout main
git pull
git merge test/spreadsheet-check
git push
```

---

## 📞 SUPPORT & RESOURCES

### If Still Getting 404:
1. ✓ Pastikan spreadsheet di-share PUBLIC (bukan Private)
2. ✓ Verifikasi sheet name exact sesuai tab name
3. ✓ Test URL di browser (lihat error muncul atau tidak)
4. ✓ Clear Vercel cache dan redeploy
5. ✓ Download logs via console (`__exportLogs()`)
6. ✓ Check Vercel deployment logs untuk error detail

### Debug Commands (Browser Console)
```javascript
// Lihat recent logs
__getLogs()

// Export logs jadi CSV
__exportLogs()

// Lihat debug info
logger.getDebugInfo()

// Clear logs
logger.clearLogs()

// Manual test spreadsheet
fetch('https://docs.google.com/spreadsheets/d/[ID]/gviz/tq?tqx=out:csv&sheet=[NAME]')
  .then(r => r.text())
  .then(console.log)
```

### Vercel Dashboard URLs
- Dashboard: https://vercel.com/dashboard
- Project: https://vercel.com/dashboard/ifp-dashboard
- Deployments: https://vercel.com/dashboard/ifp-dashboard/deployments
- Settings: https://vercel.com/dashboard/ifp-dashboard/settings

---

## ✅ CHECKLIST COMPLETION

Sebelum claim "FIXED":
- [ ] Spreadsheet sudah di-share PUBLIC
- [ ] Sheet name sudah verified benar
- [ ] Testing manual di browser berhasil
- [ ] Cache Vercel sudah cleared
- [ ] App sudah redeploy (latest commit deployed)
- [ ] Data muncul di Dashboard
- [ ] No 404 errors di browser console
- [ ] Vercel health check endpoint return 200-OK

**Status: READY FOR PRODUCTION ✅**

---

**Last Updated:** March 10, 2026  
**Version:** 2.0.0  
**Environment:** Vercel Production + Local Development
