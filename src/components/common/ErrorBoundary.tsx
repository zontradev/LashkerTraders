import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, ShieldAlert } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    // Keep a diagnostic record in session
    try {
      console.error('[Lashker Traders UI Error Boundary]:', error, errorInfo);
    } catch {
      // Safe fallback
    }
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  private handleHardReload = () => {
    try {
      // Clear any corrupted local state if needed
      window.location.reload();
    } catch {
      window.location.href = '/';
    }
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-xs">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                কিছু একটা ঠিক নেই / Something Went Wrong
              </h2>
              <p className="text-sm text-slate-600">
                দুঃখিত, পেজটি লোড করার সময় একটি সাময়িক সমস্যা দেখা দিয়েছে। দয়া করে আবার চেষ্টা করুন।
              </p>
              <p className="text-xs text-slate-400">
                A temporary UI rendering exception occurred. Your cart data is safe.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleHardReload}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm transition-all shadow-md shadow-sky-600/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>রিফ্রেশ করুন / Refresh Page</span>
              </button>

              <button
                type="button"
                onClick={this.handleReset}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>হোমপেজে যান / Home</span>
              </button>
            </div>

            {/* Error diagnostics for troubleshooting */}
            {this.state.error && (
              <details className="text-left bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs text-slate-500">
                <summary className="cursor-pointer font-semibold text-slate-700 select-none flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-slate-500" />
                  <span>কারিগরি বিবরণী / Technical Details</span>
                </summary>
                <pre className="mt-2 p-2 bg-slate-900 text-slate-100 rounded-lg overflow-x-auto text-[11px] font-mono whitespace-pre-wrap">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
