import * as React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    const { hasError, error } = this.state;
    const { children } = this.props;

    if (hasError) {
      let errorMessage = "Si è verificato un errore imprevisto.";
      
      try {
        const parsed = JSON.parse(error?.message || "");
        if (parsed.error && parsed.operationType) {
          errorMessage = `Errore Firestore (${parsed.operationType}): ${parsed.error}`;
        }
      } catch (e) {
        // Not a JSON error
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#f5f5f0]">
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-red-100 max-w-md w-full text-center space-y-6">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">Ops! Qualcosa è andato storto</h2>
              <p className="text-gray-500">{errorMessage}</p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-colors"
            >
              Ricarica App
            </button>
          </div>
        </div>
      );
    }

    return children;
  }
}
