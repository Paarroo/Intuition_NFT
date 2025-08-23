import useSWR from "swr";

// Types matching our API responses
export interface NFTAttribute {
  trait_type: string;
  value: string | number;
}

export interface NFTMetaData {
  animation_url?: string;
  attributes?: NFTAttribute[];
  description?: string;
  image?: string;
  name?: string;
  token_id?: string | number;
}

interface UseNFTReturn {
  nft: NFTMetaData | undefined;
  isLoading: boolean;
  isError: boolean;
  error?: any;
  mutate: () => void;
}

/**
 * Hook to fetch individual NFT metadata using SWR
 * @param tokenId - The token ID to fetch (1-9999)
 * @param options - SWR options
 * @returns NFT data, loading state, error state, and mutate function
 */
export function useNFT(tokenId: number | string | null, options: any = {}): UseNFTReturn {
  // Don't make request if tokenId is invalid
  const shouldFetch = tokenId && !isNaN(Number(tokenId)) && Number(tokenId) >= 1 && Number(tokenId) <= 9999;

  const { data, error, isLoading, mutate } = useSWR(shouldFetch ? `/api/nfts/${tokenId}` : null, {
    // Aggressive caching for NFT metadata (rarely changes)
    dedupingInterval: 5 * 60 * 1000, // 5 minutes
    revalidateOnFocus: false,
    revalidateIfStale: false,
    // Custom error handling
    onError: (error: any) => {
      console.error(`Error fetching NFT ${tokenId}:`, error);
    },
    ...options,
  });

  return {
    nft: data,
    isLoading: !!(isLoading && shouldFetch),
    isError: !!(error && shouldFetch),
    error,
    mutate,
  };
}

/**
 * Hook to prefetch NFT metadata (for optimization)
 * @param tokenId - Token ID to prefetch
 */
export function usePrefetchNFT(tokenId: number | string) {
  const shouldPrefetch = tokenId && !isNaN(Number(tokenId)) && Number(tokenId) >= 1 && Number(tokenId) <= 9999;

  useSWR(shouldPrefetch ? `/api/nfts/${tokenId}` : null, {
    dedupingInterval: 10 * 60 * 1000, // 10 minutes for prefetch
    revalidateOnMount: false,
    revalidateOnFocus: false,
    revalidateIfStale: false,
  });
}
