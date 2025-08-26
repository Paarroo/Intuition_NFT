import React, { useEffect, useState } from "react";
import { GlassmorphismCard } from "./GlassmorphismCard";

interface NetworkStatusProps {
  onRetry?: () => void;
  className?: string;
}

export const NetworkStatus: React.FC<NetworkStatusProps> = ({ onRetry, className = "" }) => {
  const [isOnline, setIsOnline] = useState(true);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (wasOffline && onRetry) {
        setTimeout(onRetry, 500);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
    };

    setIsOnline(navigator.onLine);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [onRetry, wasOffline]);

  if (isOnline && !wasOffline) {
    return null;
  }

  return (
    <GlassmorphismCard
      variant={isOnline ? "success" : "warning"}
      size="sm"
      className={`fixed top-20 right-4 z-50 ${className}`}
    >
      <div className="flex items-center gap-2 p-2">
        <div className={`w-2 h-2 rounded-full ${isOnline ? "bg-green-400" : "bg-yellow-400"}`} />
        <span className="text-xs font-medium">{isOnline ? "Connection restored" : "Connection lost"}</span>
        {isOnline && onRetry && (
          <button onClick={onRetry} className="btn btn-ghost btn-xs ml-2">
            Refresh
          </button>
        )}
      </div>
    </GlassmorphismCard>
  );
};

interface LoadingWithRetryProps {
  loading: boolean;
  error: Error | null;
  onRetry: () => void;
  retryCount: number;
  maxRetries: number;
  children: React.ReactNode;
  loadingComponent?: React.ReactNode;
  className?: string;
}

export const LoadingWithRetry: React.FC<LoadingWithRetryProps> = ({
  loading,
  error,
  onRetry,
  retryCount,
  maxRetries,
  children,
  loadingComponent,
  className = "",
}) => {
  if (loading) {
    return (
      <div className={className}>
        {loadingComponent || (
          <GlassmorphismCard variant="transparent" size="md" className="text-center p-6">
            <div className="loading loading-spinner loading-lg mx-auto mb-4"></div>
            <p className="text-sm opacity-70">Loading...</p>
          </GlassmorphismCard>
        )}
      </div>
    );
  }

  if (error) {
    return (
      <div className={className}>
        <GlassmorphismCard variant="danger" size="md" className="text-center p-6">
          <div className="space-y-4">
            <div className="text-3xl">⚠️</div>
            <h3 className="text-lg font-semibold">Loading failed</h3>
            <p className="text-sm opacity-80">{error.message || "An error occurred while loading data"}</p>
            <div className="flex gap-2 justify-center">
              <button onClick={onRetry} className="btn btn-primary btn-sm" disabled={retryCount >= maxRetries}>
                {retryCount >= maxRetries ? "Max retries reached" : `Retry ${retryCount > 0 ? `(${retryCount})` : ""}`}
              </button>
            </div>
          </div>
        </GlassmorphismCard>
      </div>
    );
  }

  return <>{children}</>;
};

export default NetworkStatus;
