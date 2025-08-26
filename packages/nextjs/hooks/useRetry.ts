import React, { useCallback, useState } from "react";

interface RetryOptions {
  maxRetries?: number;
  delayMs?: number;
  backoffMultiplier?: number;
  onRetry?: (attempt: number, error: Error) => void;
}

interface RetryState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  retryCount: number;
}

interface RetryActions {
  retry: () => Promise<void>;
  reset: () => void;
}

export function useRetry<T>(asyncFn: () => Promise<T>, options: RetryOptions = {}): RetryState<T> & RetryActions {
  const { maxRetries = 3, delayMs = 1000, backoffMultiplier = 2, onRetry } = options;

  const [state, setState] = useState<RetryState<T>>({
    data: null,
    loading: false,
    error: null,
    retryCount: 0,
  });

  const executeWithRetry = useCallback(
    async (attempt = 0): Promise<void> => {
      setState(prev => ({ ...prev, loading: true, error: null }));

      try {
        const result = await asyncFn();
        setState(prev => ({
          ...prev,
          data: result,
          loading: false,
          error: null,
          retryCount: attempt,
        }));
      } catch (error) {
        const err = error as Error;

        if (attempt < maxRetries) {
          const delay = delayMs * Math.pow(backoffMultiplier, attempt);

          onRetry?.(attempt + 1, err);

          setState(prev => ({
            ...prev,
            loading: false,
            error: err,
            retryCount: attempt + 1,
          }));

          setTimeout(() => {
            executeWithRetry(attempt + 1);
          }, delay);
        } else {
          setState(prev => ({
            ...prev,
            loading: false,
            error: err,
            retryCount: attempt,
          }));
        }
      }
    },
    [asyncFn, maxRetries, delayMs, backoffMultiplier, onRetry],
  );

  const retry = useCallback(() => executeWithRetry(), [executeWithRetry]);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
      retryCount: 0,
    });
  }, []);

  return {
    ...state,
    retry,
    reset,
  };
}

export function useAsyncRetry<T>(
  asyncFn: () => Promise<T>,
  dependencies: React.DependencyList = [],
  options: RetryOptions = {},
) {
  const retryState = useRetry(asyncFn, options);

  React.useEffect(() => {
    retryState.retry();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [retryState.retry, ...dependencies]);

  return retryState;
}

export const retryAsync = async <T>(fn: () => Promise<T>, options: RetryOptions = {}): Promise<T> => {
  const { maxRetries = 3, delayMs = 1000, backoffMultiplier = 2 } = options;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }

      const delay = delayMs * Math.pow(backoffMultiplier, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw new Error("Max retries reached");
};
