# 🔍 DEBUGGING GUIDE - 404 NOT_FOUND Error

## 🚀 Quick Start

**Jika dapat 404 error saat ganti spreadsheet ID:**

1. **Pastikan spreadsheet PUBLIC:**
   - Buka spreadsheet di Google Drive
   - Share → Ubah ke "Anyone with the link"
   - JANGAN "Specific people"

2. **Verifikasi sheet name:**
   - Copy nama tab (misal: "LJCOMP", "5")
   - JANGAN gunakan GID (internal number)

3. **Test di aplikasi:**
   - Buka: https://monitor-dashboard-v2.vercel.app/settings
   - Masukkan ID dan sheet name
   - Klik "🧪 Tes Koneksi"
   - Baca error message

---

## 📊 DEBUGGING TOOLS YANG SUDAH DISEDIAKAN

### 1️⃣ Validation Functions (`src/utils/validation.ts`)
Fungsi untuk validasi spreadsheet ID dan sheet name:

```typescript
import { 
  validateSpreadsheetId, 
  validateSheetName, 
  validateConfig,
  testSpreadsheetAccess,
  getTroubleshootingSteps 
} from '@/utils/validation';

// Check spreadsheet ID format
const result = validateSpreadsheetId('1E4UBDg9M0...');
if (!result.valid) {
  console.log(result.message); // Error message
}

// Test real spreadsheet access
const testResult = await testSpreadsheetAccess(
  spreadsheetId, 
  sheetName
);
if (!testResult.valid) {
  // Get troubleshooting steps
  const steps = getTroubleshootingSteps(testResult);
  console.log(steps);
}
```

### 2️⃣ Logger Utility (`src/utils/logger.ts`)
Comprehensive logging system dengan localStorage persistence:

```typescript
import { logger } from '@/utils/logger';

// Log dengan level
logger.info('Informasi', { spreadsheetId, sheet });
logger.warn('Peringatan', { issue });
logger.error('Error', { message, stack });
logger.debug('Detail debug', { data });

// Akses logs di Browser Console
__getLogs()              // Array all logs
__exportLogs()           // Download CSV
logger.getDebugInfo()    // Get environment info
```

**Console Commands (F12 → Console):**
```javascript
// Lihat 50 log terakhir
__getLogs().slice(-50)

// Export logs sebagai CSV
__exportLogs()

// Cari error
__getLogs().filter(log => log.level === 'ERROR')

// Lihat logs dari source spesifik
__getLogs().filter(log => log.source === 'Settings')

// Debug info
logger.getDebugInfo()
// Output: { isDev, isVercel, environment, logCount, userAgent }
```

### 3️⃣ Error Boundary Component (`src/components/ErrorBoundary.tsx`)
Graceful error handling dengan detailed UI:

```tsx
- Catches React errors automatically
- Shows user-friendly error page
- Provides download logs button
- Development mode dengan stack trace
```

**Error Page Features:**
- Error ID untuk tracking
- Troubleshooting steps
- Log download button
- Console debug helpers

### 4️⃣ Health Check API (`api/health.ts`)
Vercel serverless endpoint untuk monitoring:

```
GET /api/health?spreadsheetId=[ID]&sheetName=[NAME]
```

**Response:**
```json
{
  "status": "healthy|degraded|unhealthy",
  "timestamp": "2026-03-10T12:00:00Z",
  "environment": "monitor-dashboard-v2.vercel.app",
  "services": {
    "api": "ok",
    "googleSheets": "ok|error"
  },
  "checks": [
    {
      "name": "API Server",
      "status": "pass|fail",
      "message": "..."
    }
  ],
  "errors": ["..."],
  "responseTime": "125ms"
}
```

**Testing via Browser:**
```
https://monitor-dashboard-v2.vercel.app/api/health?spreadsheetId=YOUR_ID&sheetName=YOUR_SHEET
```

---

## 🔧 DEBUGGING CHECKLIST

### Step 1: Verify Spreadsheet Settings
- [ ] Open spreadsheet in browser: https://docs.google.com/spreadsheets/d/[ID]/edit
- [ ] Check sharing: Share > Change to "Anyone with the link"
- [ ] Verify sheet name (visible in tab at bottom)
- [ ] Test accessibility (can you open it without login?)

### Step 2: Manual Testing
- [ ] Copy this URL and paste in browser:
  ```
  https://docs.google.com/spreadsheets/d/[YOUR_ID]/gviz/tq?tqx=out:csv&sheet=[YOUR_SHEET]
  ```
- [ ] Replace [YOUR_ID] and [YOUR_SHEET]
- [ ] Do you see CSV data? Yes → problem in app, No → spreadsheet issue

### Step 3: Browser Developer Tools
- [ ] Press F12 to open DevTools
- [ ] Go to Console tab
- [ ] Type: `__getLogs().slice(-10)` to see recent logs
- [ ] Check "Network" tab - click failed request (red)
- [ ] Look at Response - what error?

### Step 4: Application Settings
- [ ] Open: https://monitor-dashboard-v2.vercel.app/settings
- [ ] Enter Spreadsheet ID
- [ ] Enter Sheet Name
- [ ] Click "🧪 Tes Koneksi"
- [ ] Read error message carefully
- [ ] Check "Follow suggestions" link

### Step 5: Vercel Deployment Logs
- [ ] Open: https://vercel.com/dashboard/ifp-dashboard
- [ ] Click "Deployments"
- [ ] Click latest deployment
- [ ] View "Function Logs"
- [ ] Search for error messages

### Step 6: Clear Cache & Redeploy
- [ ] Vercel Dashboard → Settings → Clear Function Cache
- [ ] Wait 2 minutes
- [ ] Or do empty commit: 
  ```bash
  git commit --allow-empty -m "chore: trigger redeploy"
  git push
  ```

---

## 🐛 COMMON ERRORS & SOLUTIONS

### ❌ 404 NOT FOUND
**Cause:** Spreadsheet tidak public

**Solution:**
```
1. Buka spreadsheet
2. Share → Anyone with the link
3. Copy link, test di browser
4. Kembali ke app, test lagi
5. Clear cache di Vercel
```

### ❌ 403 FORBIDDEN
**Cause:** Permission/access denied

**Solution:**
```
1. Verify sharing is PUBLIC
2. Check access level = Viewer (minimum)
3. Remove any IP restrictions
4. Try different browser
```

### ❌ Timeout Error
**Cause:** Network slow, Google Sheets down

**Solution:**
```
1. Check internet connection
2. Try again in 1-2 minutes
3. Try preview deployment first
4. Check Vercel status page
```

### ❌ Invalid Spreadsheet ID
**Cause:** Wrong format or incomplete

**Solution:**
```
1. Copy from URL: get the part after /d/
2. Must be 20+ characters
3. Don't include /edit or domain
4. Only alphanumeric + dash/underscore
```

---

## 📱 DEBUG COMMANDS REFERENCE

### In Browser Console (F12)
```javascript
// View all logs
__getLogs()

// Export logs as CSV
__exportLogs()

// Clear all logs
logger.clearLogs()

// Get debug info
logger.getDebugInfo()

// Manual test
fetch('https://docs.google.com/spreadsheets/d/[ID]/gviz/tq?tqx=out:csv&sheet=[SHEET]')
  .then(r => r.text())
  .then(data => {
    console.log('Success!', data.substring(0, 100));
  })
  .catch(err => {
    console.error('Failed:', err);
  });

// Get recent errors
__getLogs().filter(l => l.level === 'ERROR').slice(-5)

// Get logs from last 5 minutes
const fiveMinutesAgo = new Date(Date.now() - 5*60*1000);
__getLogs().filter(l => l.timestamp > fiveMinutesAgo)
```

### In Terminal
```bash
# Check git status
git status

# View recent commits
git log --oneline -5

# View build logs
npm run build

# Test build locally
npm run preview

# Dev server
npm run dev
```

---

## 🔗 USEFUL LINKS

- **App Production:** https://monitor-dashboard-v2.vercel.app
- **Settings Page:** https://monitor-dashboard-v2.vercel.app/settings
- **Health Check API:** https://monitor-dashboard-v2.vercel.app/api/health
- **Vercel Dashboard:** https://vercel.com/dashboard/ifp-dashboard
- **GitHub Repo:** https://github.com/Aqilah1211/Monitor-Dashboard-V2
- **Debugging Checklist:** [See DEBUGGING_CHECKLIST.md](./DEBUGGING_CHECKLIST.md)

---

## 📋 Integration Examples

### Using Validation in Components
```tsx
import { validateSpreadsheetId } from '@/utils/validation';

function MyComponent() {
  const [id, setId] = useState('');
  const [error, setError] = useState('');

  const handleChange = (newId: string) => {
    setId(newId);
    const result = validateSpreadsheetId(newId);
    setError(result.valid ? '' : result.message);
  };

  return (
    <div>
      <input value={id} onChange={e => handleChange(e.target.value)} />
      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
}
```

### Using Logger in Functions
```tsx
import { logger } from '@/utils/logger';

async function fetchData(id: string, sheet: string) {
  logger.info('Fetching data', { id, sheet });
  
  try {
    const data = await api.getData(id, sheet);
    logger.info('Data fetched successfully', { rows: data.length });
    return data;
  } catch (err) {
    logger.error('Failed to fetch data', { error: err.message });
    throw err;
  }
}
```

### Using Error Boundary
```tsx
import { ErrorBoundary } from '@/components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <YourApp />
    </ErrorBoundary>
  );
}
```

---

## 📞 TROUBLESHOOTING FLOW

```
App shows 404 error?
  ↓
  ├→ Check Vercel logs
  │  ├→ Has error message?
  │  │  ├→ 404? Check spreadsheet is PUBLIC
  │  │  ├→ 403? Check sharing permissions
  │  │  └→ Other? See error details
  │  └→ No error? Might be in browser
  │
  ├→ Check Browser Console (F12)
  │  ├→ Red errors? Fix them
  │  ├→ __getLogs() output helpful?
  │  └→ Export logs for analysis
  │
  ├→ Test Manual URL
  │  ├→ Works? Problem in app config
  │  ├→ 404? Spreadsheet not public
  │  └→ Cannot access? Network issue
  │
  └→ Clear Cache & Redeploy
     ├→ Vercel cache cleared?
     ├→ Redeployed successfully?
     └→ Test again
```

---

## 🎯 BEST PRACTICES

1. **Always use Settings test button before saving**
2. **Check browser console first when debugging**
3. **Verify spreadsheet is publicly shared**
4. **Use health check API to test connectivity**
5. **Export logs when reporting issues**
6. **Clear cache if behavior is weird**
7. **Test in dev/preview before production**

---

**Version:** 2.0.0  
**Last Updated:** March 10, 2026  
**Status:** Production Ready ✅
