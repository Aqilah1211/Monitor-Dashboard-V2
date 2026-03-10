import { Component, ReactNode, ErrorInfo } from 'react';
import { logger } from '../utils/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
}

/**
 * Error Boundary Component
 * Catches React errors dan menampilkan fallback UI
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: ''
    };
  }

  static getDerivedStateFromError(_error: Error): Partial<State> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const errorId = `ERR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    this.setState({
      error,
      errorInfo,
      errorId
    });

    // Log ke logger
    logger.error('React Error Boundary Caught', {
      errorId,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack
    });
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: ''
    });
  };

  handleDownloadLog = (): void => {
    const data = logger.exportLogsCSV();
    const blob = new Blob([data], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `error-logs-${this.state.errorId}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 to-red-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            {/* Error Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-rose-200 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-rose-600 to-red-600 px-6 py-4 text-white">
                <div className="flex items-center gap-3 mb-2">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h1 className="text-2xl font-bold">Oops! Something Went Wrong</h1>
                </div>
                <p className="text-rose-100 text-sm">Error ID: <code className="bg-rose-700 px-2 py-1 rounded font-mono text-xs">{this.state.errorId}</code></p>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Error Message */}
                <div>
                  <h2 className="font-bold text-slate-800 mb-2">Error Message:</h2>
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                    <p className="font-mono text-sm text-rose-600 break-words">
                      {this.state.error?.message || 'Unknown error'}
                    </p>
                  </div>
                </div>

                {/* Stack Trace (Development Only) */}
                {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
                  <details className="cursor-pointer">
                    <summary className="font-semibold text-slate-700 hover:text-slate-900 select-none">
                      📋 Show Stack Trace
                    </summary>
                    <div className="mt-3 bg-slate-100 border border-slate-300 rounded-lg p-4 overflow-auto max-h-64">
                      <pre className="text-xs text-slate-700 font-mono whitespace-pre-wrap break-words">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  </details>
                )}

                {/* Troubleshooting */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h3 className="font-bold text-amber-900 mb-2">🔧 Troubleshooting Steps:</h3>
                  <ul className="text-sm text-amber-800 space-y-1">
                    <li>✓ Refresh the page (Ctrl+R atau Cmd+R)</li>
                    <li>✓ Clear browser cache (Ctrl+Shift+Delete)</li>
                    <li>✓ Try a different browser</li>
                    <li>✓ Check your internet connection</li>
                    <li>✓ Download error logs below for debugging</li>
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-200">
                  <button
                    onClick={this.handleReset}
                    className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all shadow-md"
                  >
                    🔄 Try Again
                  </button>
                  <button
                    onClick={() => window.location.href = '/'}
                    className="px-6 py-2 bg-slate-600 text-white font-semibold rounded-lg hover:bg-slate-700 transition-all shadow-md"
                  >
                    🏠 Go Home
                  </button>
                  <button
                    onClick={this.handleDownloadLog}
                    className="px-6 py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-all shadow-md"
                  >
                    📥 Download Logs
                  </button>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 text-xs text-slate-500">
                <p>
                  Error ID {this.state.errorId} has been logged. If this issue persists, please share the error ID with support.
                </p>
                {process.env.NODE_ENV === 'development' && (
                  <p className="mt-2 text-slate-600">
                    💡 In development mode, you can access logs via browser console: <code className="bg-slate-200 px-2 py-1 rounded font-mono text-xs">__getLogs()</code> or <code className="bg-slate-200 px-2 py-1 rounded font-mono text-xs">__exportLogs()</code>
                  </p>
                )}
              </div>
            </div>

            {/* Dev Info */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
                <p className="font-bold text-blue-900 mb-2">🐛 Debug Info:</p>
                <pre className="text-xs bg-blue-100 p-3 rounded overflow-auto max-h-40 font-mono">
                  {JSON.stringify(logger.getDebugInfo(), null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children || this.props.fallback;
  }
}
