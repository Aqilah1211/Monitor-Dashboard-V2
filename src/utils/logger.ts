/**
 * Logger utility untuk debugging
 * Stores logs di localStorage dan memory untuk inspection
 */

export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

export interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  message: string;
  data?: any;
  source?: string;
  userAgent?: string;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 500;
  private isDev = false;
  private isVercel = false;

  constructor() {
    this.isDev = !this.isProduction();
    this.isVercel = this.detectVercel();

    // Load previous logs from localStorage
    try {
      const stored = localStorage.getItem('_app_logs');
      if (stored) {
        const parsed = JSON.parse(stored);
        this.logs = parsed.slice(-this.maxLogs);
      }
    } catch (e) {
      // Ignore localStorage errors
    }
  }

  private isProduction(): boolean {
    // Check if running in production environment
    return typeof window !== 'undefined' && !window.location.hostname.includes('localhost');
  }

  private detectVercel(): boolean {
    return (
      typeof window !== 'undefined' &&
      (window.location.hostname === 'monitor-dashboard-v2.vercel.app' ||
        window.location.hostname.endsWith('.vercel.app'))
    );
  }

  private formatTimestamp(date: Date): string {
    return date.toISOString().split('T')[1].substring(0, 12);
  }

  private addLog(level: LogLevel, message: string, data?: any, source?: string): void {
    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      message,
      data,
      source: source || 'APP',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined
    };

    this.logs.push(entry);

    // Keep only last maxLogs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Save to localStorage
    try {
      localStorage.setItem('_app_logs', JSON.stringify(this.logs));
    } catch (e) {
      // Ignore localStorage errors (quota exceeded, etc)
    }

    // Console output
    this.printToConsole(entry);
  }

  private printToConsole(entry: LogEntry): void {
    const timestamp = this.formatTimestamp(entry.timestamp);
    const prefix = `[${timestamp}] [${entry.level}]`;
    const source = entry.source ? ` {${entry.source}}` : '';
    const message = `${prefix}${source} ${entry.message}`;

    const styles: Record<LogLevel, string> = {
      DEBUG: 'color: #666; font-size: 12px;',
      INFO: 'color: #0066cc; font-weight: bold;',
      WARN: 'color: #ff9900; font-weight: bold;',
      ERROR: 'color: #cc0000; font-weight: bold; font-size: 14px;'
    };

    try {
      console.log(`%c${message}`, styles[entry.level]);
      if (entry.data) {
        console.log('  Data:', entry.data);
      }
    } catch (e) {
      // Fallback untuk browser yang tidak support console.log styling
      console.log(message, entry.data || '');
    }
  }

  debug(message: string, data?: any, source?: string): void {
    this.addLog('DEBUG', message, data, source);
  }

  info(message: string, data?: any, source?: string): void {
    this.addLog('INFO', message, data, source);
  }

  warn(message: string, data?: any, source?: string): void {
    this.addLog('WARN', message, data, source);
  }

  error(message: string, data?: any, source?: string): void {
    this.addLog('ERROR', message, data, source);

    // Send error to external service jika di production/Vercel
    if (this.isVercel) {
      this.sendErrorToService(message, data);
    }
  }

  private async sendErrorToService(message: string, data?: any): Promise<void> {
    try {
      // Future: Send ke API endpoint jika diperlukan
      // Format: { message, data, timestamp, url, userAgent }
      void message;
      void data;
    } catch (e) {
      // Ignore error sending errors
    }
  }

  /**
   * Get all logs
   */
  getAllLogs(): LogEntry[] {
    return [...this.logs];
  }

  /**
   * Get logs by level
   */
  getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter((log) => log.level === level);
  }

  /**
   * Get recent logs
   */
  getRecentLogs(count: number = 50): LogEntry[] {
    return this.logs.slice(-count);
  }

  /**
   * Export logs as JSON
   */
  exportLogs(): string {
    return JSON.stringify(
      {
        exported: new Date().toISOString(),
        isDev: this.isDev,
        isVercel: this.isVercel,
        logs: this.logs
      },
      null,
      2
    );
  }

  /**
   * Export logs as CSV
   */
  exportLogsCSV(): string {
    const headers = ['Timestamp', 'Level', 'Source', 'Message', 'Data'];
    const rows = this.logs.map((log) => [
      log.timestamp.toISOString(),
      log.level,
      log.source || '',
      log.message,
      JSON.stringify(log.data || '')
    ]);

    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');

    return csv;
  }

  /**
   * Clear all logs
   */
  clearLogs(): void {
    this.logs = [];
    try {
      localStorage.removeItem('_app_logs');
    } catch (e) {
      // Ignore
    }
  }

  /**
   * Get debug info
   */
  getDebugInfo(): {
    isDev: boolean;
    isVercel: boolean;
    environment: string;
    logCount: number;
    userAgent: string;
  } {
    return {
      isDev: this.isDev,
      isVercel: this.isVercel,
      environment: typeof window !== 'undefined' ? window.location.hostname : 'unknown',
      logCount: this.logs.length,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown'
    };
  }
}

// Singleton instance
export const logger = new Logger();

// Expose to window untuk debugging di console
if (typeof window !== 'undefined') {
  (window as any).__logger = logger;
  (window as any).__getLogs = () => logger.getAllLogs();
  (window as any).__exportLogs = () => {
    const data = logger.exportLogsCSV();
    const blob = new Blob([data], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logs-${new Date().getTime()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };
}
