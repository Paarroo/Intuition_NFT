import React, { Component, ReactNode } from "react";
import { GlassmorphismCard } from "./GlassmorphismCard";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  retryCount: number;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, retryCount: 0 };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, retryCount: 0 };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      retryCount: prevState.retryCount + 1,
    }));
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <GlassmorphismCard variant="danger" size="lg" className="text-center p-8">
          <div className="space-y-4">
            <div className="text-4xl">⚠️</div>
            <h3 className="text-xl font-semibold">Something went wrong</h3>
            <p className="text-sm opacity-80">An error occurred while loading this content. Please try again.</p>
            {this.state.error && (
              <details className="text-left">
                <summary className="cursor-pointer text-xs opacity-60 hover:opacity-100">Technical Details</summary>
                <pre className="text-xs mt-2 p-2 bg-black/20 rounded overflow-auto">{this.state.error.message}</pre>
              </details>
            )}
            <div className="flex gap-2 justify-center">
              <button
                onClick={this.handleRetry}
                className="btn btn-primary btn-sm"
                disabled={this.state.retryCount >= 3}
              >
                {this.state.retryCount >= 3
                  ? "Max retries reached"
                  : `Retry ${this.state.retryCount > 0 ? `(${this.state.retryCount + 1})` : ""}`}
              </button>
              <button onClick={() => window.location.reload()} className="btn btn-ghost btn-sm">
                Reload Page
              </button>
            </div>
          </div>
        </GlassmorphismCard>
      );
    }

    return this.props.children;
  }
}

export const NFTErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ErrorBoundary
      fallback={
        <div className="glassmorphism-card rounded-3xl p-6 w-full max-w-[320px] sm:max-w-[280px] h-[700px] flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="text-3xl">⚠️</div>
            <p className="text-sm font-medium">Failed to load NFT</p>
            <button onClick={() => window.location.reload()} className="btn btn-primary btn-xs">
              Retry
            </button>
          </div>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
};

export default ErrorBoundary;
