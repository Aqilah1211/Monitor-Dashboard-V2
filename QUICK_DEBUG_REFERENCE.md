# 🚀 QUICK DEBUGGING REFERENCE

## 🔴 Problem: 404 NOT FOUND

### Instant Check (30 seconds)
```
1. Open: https://docs.google.com/spreadsheets/d/[YOUR_ID]/edit
2. Klik Share → Check "Anyone with the link" 
3. ✓ Done
```

### Test Connection (Settings Page)
```
1. Go to: https://monitor-dashboard-v2.vercel.app/settings
2. Paste Spreadsheet ID
3. Paste Sheet Name
4. Click "🧪 Tes Koneksi"
5. Read error message
```

### Browser Console (F12 → Console)
```javascript
// View recent logs
__getLogs().slice(-10)

// Download logs as CSV
__exportLogs()

// Check errors only
__getLogs().filter(l => l.level === 'ERROR')
```

---

## 🟡 Problem: Not Sure What's Wrong

### 3-Step Debugging
```
Step 1: Browser Tools
F12 → Console → __getLogs() → Analyze

Step 2: Health Check
https://monitor-dashboard-v2.vercel.app/api/health?spreadsheetId=YOUR_ID&sheetName=YOUR_SHEET

Step 3: Vercel Logs
https://vercel.com/dashboard/ifp-dashboard → Deployments → Logs
```

---

## 🟢 All Tools Available

| Tool | Location | Usage |
|------|----------|-------|
| **Validation** | `src/utils/validation.ts` | Check ID/sheet format |
| **Logger** | `src/utils/logger.ts` | Debug logs |
| **Error Boundary** | `src/components/ErrorBoundary.tsx` | Catch errors |
| **Health Check** | `api/health.ts` | Monitor connectivity |
| **Full Checklist** | `DEBUGGING_CHECKLIST.md` | Step-by-step guide |
| **Full Guide** | `DEBUGGING_GUIDE.md` | Complete reference |

---

## 📌 Key Commands

```javascript
// Browser Console
__getLogs()                    // All logs
__getLogs().slice(-50)         // Last 50
__exportLogs()                 // Download CSV
logger.clearLogs()             // Clear
logger.getDebugInfo()          // Environment info

// Terminal
npm run build                  // Build check
npm run dev                    // Local dev
git status                     // Git status
```

---

## ✅ Checklist

- [ ] Spreadsheet is PUBLIC (Anyone with link)
- [ ] Sheet name is EXACT (no spaces in ID)
- [ ] Test in Settings page succeeds
- [ ] No errors in browser console (F12)
- [ ] Vercel deployment is latest
- [ ] Cache cleared if needed

**Status: READY ✅**
