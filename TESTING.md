# Testing & QA Guide - IFP Dashboard

## Overview

This guide documents the testing approach and test scenarios for the IFP Dashboard application. The project uses **Vitest** for unit and integration testing with **Testing Library** for component testing.

## Setup

Vitest is configured in `vitest.config.ts` with the following:
- **Environment**: jsdom (for DOM testing)
- **Test files**: `src/**/*.test.ts` and `src/**/*.test.tsx`
- **Setup files**: `src/test/setup.ts` (mocks and initialization)

## Running Tests

```bash
# Run all tests
npm test

# Run tests in UI mode (interactive)
npm run test:ui

# Generate coverage report
npm run test:coverage

# Run tests in watch mode
npm test -- --watch
```

## Test Coverage Goals

### 1. Filter State Management
**File**: `src/lib/filterUtils.ts`
**Test Scenarios**:
- [x] Deserialize filter state from JSON with date validation
- [x] Handle reversed dates by auto-correcting them
- [x] Return default state for invalid JSON input
- [x] Handle null/undefined dates gracefully
- [x] Preserve provinces array and search text

**Manual Test**:
1. Apply filters (date range, provinces, search)
2. Refresh the page
3. Verify filters are restored from localStorage
4. Verify dates are valid Date objects (not strings)

### 2. Google Sheets Column Detection
**File**: `src/lib/columnDetector.ts`
**Test Scenarios**:
- [x] Detect NPSN column with various header names (NPSN, "Nomor Pokok Sekolah Nasional", etc.)
- [x] Handle fuzzy matching for column headers
- [x] Detect all required columns (NAMA, DIREKTORAT, TANGGAL, STATUS, KENDALA)
- [x] Handle reordered columns in spreadsheet
- [x] Return default mapping if detection fails
- [x] Validate row length before processing
- [x] Safe row value extraction with fallback for out-of-bounds indices

**Manual Test**:
1. Modify Google Sheets column order
2. Verify data still loads correctly
3. Check that column detection messages appear in console

### 3. Search Debounce Optimization
**File**: `src/hooks/useDebounce.ts`
**Test Scenarios**:
- [ ] Debounce callback execution by 300ms
- [ ] Reset debounce timer on consecutive calls
- [ ] Pass arguments correctly to debounced callback
- [ ] Cleanup timeout on unmount to prevent memory leaks

**Manual Test**:
1. Type rapidly in the search field
2. Verify API calls don't happen until 300ms after typing stops
3. Check DevTools Network tab:
   - Should see only 1 API call, not 1 per keystroke
   - Reduces 10 keystrokes from 10 requests to 1 request

### 4. Pagination Performance
**File**: `src/hooks/usePagination.ts`
**Test Scenarios**:
- [x] Paginate data with default page size (50 items)
- [x] Navigate to next/previous pages
- [x] Jump to specific page number
- [x] Change page size dynamically
- [x] Prevent navigation beyond page bounds
- [x] Reset pagination state
- [x] Handle empty datasets gracefully
- [x] Auto-scroll to top on page change

**Manual Test**:
1. Navigate to any table view (Troubles, Installed, Pending)
2. Verify only 50 items display initially
3. Click next button → verify new items appear
4. Click previous button → verify correct page loads
5. Change page size to 100 → verify proper pagination
6. Scroll behavior: page should scroll to top automatically

### 5. Data Filtering Integration
**File**: `src/pages/Overview.tsx`
**Test Scenarios**:
- [ ] Filter by date range (start and end dates)
- [ ] Filter by multiple provinces (multi-select)
- [ ] Filter by status (installed/in-progress/pending)
- [ ] Filter by search text (school name)
- [ ] Combine multiple filters simultaneously
- [ ] Clear individual filters
- [ ] Clear all filters at once
- [ ] Verify row count updates correctly

**Manual Test**:
1. Select date range 1-15 January 2025
2. Select provinces: DKI Jakarta, Jawa Barat
3. Select status: Installed
4. Type school name in search
5. Verify displayed data matches all criteria
6. Click clear on one filter
7. Verify data updates with remaining filters applied

### 6. Error Boundary Protection
**File**: `src/App.tsx`
**Test Scenarios**:
- [x] Component errors don't crash entire application
- [x] Error fallback UI displays when component fails
- [x] Other route components remain functional after error
- [x] Page section shows error message

**Manual Test**:
1. Attempt to trigger an error (if possible)
2. Verify error message appears in component area
3. Verify navigation still works
4. Verify other pages still load

### 7. Large Dataset Performance
**Test Scenarios**:
- [x] Load 1000+ school records without UI lag
- [x] Pagination prevents DOM bloat
- [x] Search debounce reduces re-renders
- [x] Filter performance remains acceptable with large data

**Manual Test**:
1. Open DevTools Performance tab
2. Load Overview page with full dataset
3. Type in search field while watching Performance metrics
4. Verify FCP (First Contentful Paint) < 2s
5. Verify smooth interactions during filtering
6. Check that only 50 DOM nodes render per page

### 8. Date Serialization (Critical Bug Fix)
**Test Scenario**:
- [x] [CRITICAL] Prevent "toLocaleDateString is not a function" error
- [x] Store dates as ISO strings in localStorage
- [x] Convert ISO strings back to Date objects on load
- [x] Handle edge cases: null, undefined, invalid dates
- [x] Auto-correct reversed date ranges

**Manual Test**:
1. Set a date filter
2. Refresh page multiple times
3. Verify no "toLocaleDateString" error appears in console
4. Verify filters persist across refreshes
5. Set end date before start date
6. Verify dates auto-swap to correct order

### 9. Status Categorization Accuracy
**Test Scenarios**:
- [x] Correctly identify installed schools (status = "selesai" OR "terpasang")
- [x] Correctly identify in-progress schools (status = "proses")
- [x] Correctly identify schools with troubles (kendala field not empty)
- [x] Handle case-insensitive status matching
- [x] Handle status with variations ("SELESAI", "Selesai", "selesai")

**Manual Test**:
1. Filter by "Installed" - verify only completed installations show
2. Filter by "Troubles" - verify only schools with problems show
3. Filter by "Pending" - verify only not-yet-installed schools show
4. Verify numbers match row counts

## Test Execution Checklist

Before each release, run through these checks:

### Unit Tests
- [ ] `npm test` passes (all tests pass)
- [ ] No type errors or warnings
- [ ] Coverage report generated

### Integration Tests
- [ ] Apply date filter → data updates
- [ ] Apply province filter → data updates
- [ ] Apply status filter → data updates
- [ ] Apply search filter → results update after 300ms debounce
- [ ] Multiple filters work together

### Performance Tests
- [ ] Search doesn't create excessive API calls (debounce working)
- [ ] Pagination renders only page size items
- [ ] Page transitions smooth (< 16ms frame time)
- [ ] No memory leaks after extended use

### Cross-Browser Tests
- [ ] Chrome/Edge: All features work
- [ ] Firefox: All features work
- [ ] Safari: All features work
- [ ] Mobile (375px width): Responsive layout works

### Accessibility Tests
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Color contrast meets WCAG AA
- [ ] Focus indicators visible

## Known Limitations

1. **E2E Tests**: Full end-to-end tests require additional setup (Playwright/Cypress)
2. **Jest Configuration**: Project uses Vitest instead of Jest
3. **React Testing Patterns**: Component tests prefer @testing-library/react patterns

## Test Report Template

```
DATE: [date]
BUILD: [version]
TESTER: [name]

PASSED: ✅ X/Y scenarios
FAILED: ❌ X/Y scenarios
SKIPPED: ⏭️ X/Y scenarios

ISSUES FOUND:
- [Issue 1]: [Severity] [Description]
- [Issue 2]: [Severity] [Description]

RECOMMENDED ACTIONS:
- [Action 1]
- [Action 2]

SIGN-OFF: [ ] Production Ready [ ] Needs Fixes
```

## Continuous Integration

Tests should run automatically on:
- [ ] Pull request creation
- [ ] Before commit (pre-commit hooks)
- [ ] Before deployment

## Troubleshooting

### Tests timeout
- Increase `timeout` option in test file
- Check for missing `await` statements
- Verify mock data returns properly

### Module not found errors
- Check import paths match file locations
- Verify all dependencies installed
- Clear node_modules and reinstall

### jsdom warnings
- Some browser APIs not available in jsdom
- Mock browser APIs in test/setup.ts
- Use `beforeEach` hook for test isolation

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library Best Practices](https://testing-library.com/)
- [React Testing Patterns](https://react.dev/learn/testing-recipes)
- [QA Best Practices](https://www.softwaretestinghelp.com/)
