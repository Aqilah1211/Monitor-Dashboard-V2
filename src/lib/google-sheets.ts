import Papa from 'papaparse';

const API_BASE = 'https://docs.google.com/spreadsheets/d';

export const GoogleSheets = {
  buildCSVUrl(spreadsheetId: string, sheetName: string): string {
    return `${API_BASE}/${spreadsheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;
  },

  extractSheetIdFromUrl(url: string): string {
    const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : url.trim();
  },

  cleanSpreadsheetId(input: string): string {
    // Extract just the ID part, removing any labels or extra text
    // Handles formats like:
    // - "1E4UBDg9M0RKTvtJCXUOg4IWQmvl1mdmIqeN9CyRw5qs"
    // - "Spreadsheet ID: 1E4UBDg9M0RKTvtJCXUOg4IWQmvl1mdmIqeN9CyRw5qs"
    // - "https://docs.google.com/spreadsheets/d/1E4UBDg9M0RKTvtJCXUOg4IWQmvl1mdmIqeN9CyRw5qs/..."
    
    let cleaned = input.trim();
    
    // If it's a URL, extract the ID
    if (cleaned.includes('/d/')) {
      return this.extractSheetIdFromUrl(cleaned);
    }
    
    // Remove labels like "Spreadsheet ID: " or similar
    cleaned = cleaned.replace(/^.*?:\s*/g, '');
    
    // Extract the ID part (alphanumeric, hyphens, underscores)
    // IDs are typically 44 characters long
    const match = cleaned.match(/([a-zA-Z0-9-_]{20,})/);
    return match ? match[1].trim() : cleaned.trim();
  },

  async fetchCSV(url: string): Promise<string> {
    console.log('📡 Fetching CSV dari:', url);
    const response = await fetch(url);
    if (!response.ok) {
      console.error('❌ Fetch error:', response.status, response.statusText);
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const text = await response.text();
    console.log('✅ CSV berhasil diambil, size:', text.length, 'bytes');
    return text;
  },

  parseCSV<T = any[]>(csvText: string): T[] {
    try {
      const { data } = Papa.parse(csvText, {
        header: false,
        skipEmptyLines: true,
        dynamicTyping: false
      });
      console.log('📊 CSV parsed:', data.length, 'rows');
      if (data.length > 0) {
        console.log('📋 Header row:', data[0]);
        console.log('📝 Sample row:', data[1]);
      }
      return data as T[];
    } catch (error) {
      console.error('❌ Parse error:', error);
      throw error;
    }
  },

  async fetchSheetData<T = any[]>(spreadsheetId: string, sheetName: string): Promise<T[]> {
    const url = this.buildCSVUrl(spreadsheetId, sheetName);
    const csvText = await this.fetchCSV(url);
    return this.parseCSV<T>(csvText);
  }
};
