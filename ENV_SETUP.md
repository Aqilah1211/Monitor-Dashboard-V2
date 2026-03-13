# Environment Configuration Setup Guide

This guide explains how to configure environment variables for the IFP Dashboard application.

## Overview

The application uses environment variables for configuration, loaded at build/runtime. Three levels of configuration are provided:

1. **`.env.example`** - Template with all available variables (documented, safe to commit)
2. **`.env.local.example`** - Local development defaults (example for developers)
3. **`.env.production`** - Production defaults (customize for your production environment)

## Getting Started

### Step 1: Create Your Local Environment File

```bash
# Copy the example file
cp .env.local.example .env.local

# Edit with your local settings
# nano .env.local  (or use your editor)
```

### Step 2: Configure Google Sheets URL (Required)

The application requires a Google Sheets CSV export URL to load school data.

**To get your Google Sheets export URL:**

1. Open your Google Sheet in a browser
2. In the URL bar, note your **SPREADSHEET_ID**:
   ```
   https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit
   ```
3. Publish the sheet to web:
   - Click `File` → `Share` → `Publish to web`
   - Select format: CSV
   - Copy the URL provided
4. Paste into `.env.local`:
   ```
   VITE_GOOGLE_SHEETS_URL=https://docs.google.com/spreadsheets/d/YOUR_ID/export?format=csv&gid=0
   ```

**Verify Google Sheet Requirements:**
- Column headers: NPSN, NAMA, DIREKTORAT, TANGGAL, STATUS, KENDALA
- Headers can be in any order (auto-detected)
- At least 6 columns with these names/keywords
- Public read access enabled

### Step 3: Run the Application

```bash
# Development mode
npm run dev

# Production build
npm run build

# Test
npm test
```

## Environment Variables Reference

### Core Configuration

| Variable | Default | Purpose | Example |
|----------|---------|---------|---------|
| `VITE_APP_ENV` | `development` | Environment mode | `development`, `production`, `staging` |
| `VITE_GOOGLE_SHEETS_URL` | *(required)* | Google Sheets CSV export | `https://docs.google.com/spreadsheets/d/...` |
| `VITE_DEBUG_MODE` | `true` (dev), `false` (prod) | Enable console logs | `true` or `false` |

### Performance

| Variable | Default | Purpose |
|----------|---------|---------|
| `VITE_SEARCH_DEBOUNCE` | `300` | Search input debounce (ms) |
| `VITE_DEFAULT_PAGE_SIZE` | `50` | Pagination page size |
| `VITE_REFRESH_INTERVAL` | `1800000` | Google Sheets refresh (ms) |

### Logging

| Variable | Default | Purpose |
|----------|---------|---------|
| `VITE_LOG_LEVEL` | `info` | Log verbosity: `error`, `warn`, `info`, `debug`, `trace` |
| `VITE_LOG_REQUESTS` | `true` (dev), `false` (prod) | Log API requests |

### Data & API

| Variable | Default | Purpose |
|----------|---------|---------|
| `VITE_API_URL` | `http://localhost:3000/api` | Backend API endpoint |
| `VITE_API_TIMEOUT` | `30000` | Request timeout (ms) |

### UI/UX

| Variable | Default | Purpose |
|----------|---------|---------|
| `VITE_LANGUAGE` | `id` | Language: `id` (Indonesian), `en` (English) |
| `VITE_DARK_MODE` | `false` | Enable dark theme |

## Environment-Specific Setup

### Development (Local)

1. Copy `.env.local.example` → `.env.local`
2. Set `VITE_GOOGLE_SHEETS_URL` to your development sheet
3. Set `VITE_DEBUG_MODE=true` for logging
4. Set `VITE_LOG_LEVEL=debug` for detailed logs
5. Reduce `VITE_REFRESH_INTERVAL=300000` (5 min) for faster testing

```bash
# Run with development config
npm run dev
```

### Staging

1. Create `.env.staging` from `.env.example`
2. Set production-like values but with staging URLs
3. Enable analytics but keep debug mode off
4. Use staging Google Sheets

```bash
# Build for staging
VITE_APP_ENV=staging npm run build
```

### Production

1. Use `.env.production` as base
2. Set production Google Sheets URL
3. Set production API endpoints
4. Disable debug mode: `VITE_DEBUG_MODE=false`
5. Enable error reporting: `VITE_ERROR_REPORTING=true`

```bash
# Build for production
npm run build
```

## Security Best Practices

### Do's ✅

- ✅ Use `.env.local` for sensitive local config
- ✅ Add `.env.local`, `.env.*.local`, `.env.production` to `.gitignore`
- ✅ Use `.env.example` for template documentation
- ✅ Rotate API keys regularly
- ✅ Use HTTPS in production URLs
- ✅ Limit CORS origins to specific domains

### Don'ts ❌

- ❌ Commit `.env.local` to git (contains local secrets)
- ❌ Commit API keys or secrets to source control
- ❌ Use hard-coded credentials in code
- ❌ Set sensitive values in `.env.example`
- ❌ Allow wildcard CORS origins in production (`*`)
- ❌ Log sensitive data in production

## Environment Loading Priority

Vite loads environment files in this order (later overrides earlier):

1. `.env` - Shared (not tracked, local machine files)
2. `.env.local` - Local overrides (developers only)
3. `.env.{mode}` - Mode-specific (`.env.production`, `.env.development`)
4. `.env.{mode}.local` - Mode-specific local overrides
5. `process.env.*` - Value from npm command: `VITE_VAR=value npm run build`

## Testing Environment Variables

### Verify Variables are Loaded

```javascript
// In your components or browser console
console.log(import.meta.env.VITE_GOOGLE_SHEETS_URL)
console.log(import.meta.env.VITE_DEBUG_MODE)
```

### Common Issues

**Issue**: "Cannot find Google Sheets URL"
- **Solution**: Check `.env.local` exists and has `VITE_GOOGLE_SHEETS_URL` set
- **Test**: `echo $VITE_GOOGLE_SHEETS_URL` in terminal

**Issue**: Debug logs not showing
- **Solution**: Set `VITE_DEBUG_MODE=true` in `.env.local`
- **Solution**: Set `VITE_LOG_LEVEL=debug`

**Issue**: Config not updating after change
- **Solution**: Restart dev server (`npm run dev`)
- **Solution**: Clear cache: `npm run dev -- --force`

## Example Configurations

### Minimal Setup (Just Google Sheets)

```env
VITE_GOOGLE_SHEETS_URL=https://docs.google.com/spreadsheets/d/YOUR_ID/export?format=csv
```

### Development Setup

```env
VITE_APP_ENV=development
VITE_GOOGLE_SHEETS_URL=https://docs.google.com/spreadsheets/d/YOUR_ID/export?format=csv
VITE_DEBUG_MODE=true
VITE_LOG_LEVEL=debug
VITE_REFRESH_INTERVAL=300000
```

### Production Setup

```env
VITE_APP_ENV=production
VITE_GOOGLE_SHEETS_URL=https://docs.google.com/spreadsheets/d/YOUR_PROD_ID/export?format=csv
VITE_DEBUG_MODE=false
VITE_LOG_LEVEL=warn
VITE_ERROR_REPORTING=true
VITE_REFRESH_INTERVAL=1800000
```

## Deployment to Vercel

1. Set environment variables in Vercel dashboard:
   - Project Settings → Environment Variables
   - Add each variable from `.env.production`

2. Vercel will automatically load variables during build:
   ```bash
   npm run build
   ```

3. Verify on deployed site by checking browser console

## Additional Resources

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Google Sheets Integration](./GOOGLE_SHEETS_SETUP.md)
- [Security Checklist](./SECURITY.md)
- [Deployment Guide](./DEPLOYMENT.md)
