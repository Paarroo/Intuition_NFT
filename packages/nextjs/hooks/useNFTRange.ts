import { useCallback, useEffect, useState } from "react";
import { NFTMetaData } from "./useNFT";
import useSWR from "swr";

interface NFTRangeResponse {
  nfts: NFTMetaData[];
  hasMore: boolean;
  nextCursor: string | null;
  total: number;
  count: number;
}

interface UseNFTRangeParams {
  start?: number;
  limit?: number;
  cursor?: string | null;
}

interface UseNFTRangeReturn {
  nfts: NFTMetaData[] | undefined;
  hasMore: boolean;
  nextCursor: string | null;
  total: number;
  isLoading: boolean;
  isError: boolean;
  error?: any;
  mutate: () => void;
}

/**
 * Hook to fetch a range of NFTs using pagination
 * @param params - Pagination parameters
 * @param options - SWR options
 * @returns Paginated NFT data and pagination info
 */
export function useNFTRange(params: UseNFTRangeParams = {}, options: any = {}): UseNFTRangeReturn {
  const { start = 0, limit = 50, cursor } = params;

  // Validate parameters
  const validLimit = Math.min(Math.max(limit, 1), 100); // Between 1 and 100
  const validStart = Math.max(start, 0); // Non-negative

  // Build query string
  const queryParams = new URLSearchParams();
  if (validStart > 0) queryParams.set("start", validStart.toString());
  if (validLimit !== 50) queryParams.set("limit", validLimit.toString());
  if (cursor) queryParams.set("cursor", cursor);

  const queryString = queryParams.toString();
  const url = `/api/nfts/range${queryString ? "?" + queryString : ""}`;

  const { data, error, isLoading, mutate } = useSWR<NFTRangeResponse>(url, {
    // Less aggressive caching for paginated results
    dedupingInterval: 2 * 60 * 1000, // 2 minutes
    revalidateOnFocus: false,
    revalidateIfStale: true,
    // Custom error handling
    onError: (error: any) => {
      console.error("Error fetching NFT range:", error);
    },
    ...options,
  });

  return {
    nfts: data?.nfts,
    hasMore: data?.hasMore || false,
    nextCursor: data?.nextCursor || null,
    total: data?.total || 0,
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
}

/**
 * Hook for infinite scroll implementation
 * Automatically manages cursor-based pagination
 */
export function useInfiniteNFTs(initialLimit: number = 50) {
  // Store all loaded NFTs and cursor state
  const [allNFTs, setAllNFTs] = useState<NFTMetaData[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Load initial page
  const { nfts, hasMore, nextCursor, isLoading, isError, error } = useNFTRange({
    limit: initialLimit,
    cursor,
  });

  // Update state when new data arrives
  useEffect(() => {
    if (nfts && nfts.length > 0) {
      setAllNFTs(prev => {
        // If cursor is null, this is the first load
        if (cursor === null) {
          return nfts;
        }
        // Otherwise, append new NFTs
        const existingIds = new Set(prev.map(nft => nft.token_id));
        const newNFTs = nfts.filter(nft => !existingIds.has(nft.token_id));
        return [...prev, ...newNFTs];
      });
      setIsLoadingMore(false);
    }
  }, [nfts, cursor]);

  // Function to load more NFTs
  const loadMore = useCallback(() => {
    if (hasMore && nextCursor && !isLoading && !isLoadingMore) {
      setIsLoadingMore(true);
      setCursor(nextCursor);
    }
  }, [hasMore, nextCursor, isLoading, isLoadingMore]);

  // Function to reset and reload from start
  const reset = useCallback(() => {
    setAllNFTs([]);
    setCursor(null);
    setIsLoadingMore(false);
  }, []);

  return {
    nfts: allNFTs,
    hasMore,
    isLoading: isLoading || isLoadingMore,
    isError,
    error,
    loadMore,
    reset,
  };
}
