import type { NextApiRequest, NextApiResponse } from "next";

// Simple in-memory cache
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

// Rate limiting store
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX = 100; // 100 requests per window

// Collection constants
const COLLECTION_ID = "4e382831-8b4a-4ca6-8a02-846161d7f38f";
const PHOSPHOR_API_BASE = "https://public-api.phosphor.xyz/v1/items";

interface NFTMetaData {
  animation_url?: string;
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
  description?: string;
  image?: string;
  name?: string;
}

// Rate limiting middleware
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitStore.get(ip);

  if (!userLimit || now > userLimit.resetTime) {
    // Reset or create new limit window
    rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (userLimit.count >= RATE_LIMIT_MAX) {
    return false;
  }

  userLimit.count++;
  return true;
}

// Security headers
function setSecurityHeaders(res: NextApiResponse) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Cache-Control", "public, max-age=300, s-maxage=300"); // 5 minute cache
}

// Convert Phosphor data to our format
function convertToMetadataFormat(phosphorItem: any): NFTMetaData {
  const attributes = [];

  if (phosphorItem.attributes) {
    // Rarity
    if (phosphorItem.attributes.rarity) {
      attributes.push({
        trait_type: "rarity",
        value: phosphorItem.attributes.rarity,
      });
    }

    // Genesis
    if (phosphorItem.attributes.genesis !== undefined) {
      attributes.push({
        trait_type: "genesis",
        value: phosphorItem.attributes.genesis ? "Yes" : "No",
      });
    }

    // Secret code
    if (phosphorItem.attributes.secret_code) {
      attributes.push({
        trait_type: "secret_code",
        value: phosphorItem.attributes.secret_code,
      });
    }

    // Resonance frequency
    if (phosphorItem.attributes.resonance_frequency !== undefined) {
      attributes.push({
        trait_type: "resonance_frequency",
        value: phosphorItem.attributes.resonance_frequency,
      });
    }
  }

  return {
    animation_url: phosphorItem.attributes?.meta_animation_url || "",
    attributes: attributes,
    description: phosphorItem.attributes?.description || "Intuition Commemorative Genesis NFT. Trust your intuition.",
    image: phosphorItem.attributes?.image_url || "",
    name: phosphorItem.name || `Relic #${phosphorItem.token_id}`,
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow GET requests
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Set security headers
  setSecurityHeaders(res);

  // Get client IP for rate limiting
  const clientIP = (req.headers["x-forwarded-for"] as string) || req.connection.remoteAddress || "unknown";

  // Check rate limit
  if (!checkRateLimit(clientIP)) {
    return res.status(429).json({
      error: "Rate limit exceeded. Try again later.",
    });
  }

  const { tokenId } = req.query;

  // Validate tokenId
  if (!tokenId || Array.isArray(tokenId)) {
    return res.status(400).json({ error: "Invalid token ID" });
  }

  const numericTokenId = parseInt(tokenId, 10);
  if (isNaN(numericTokenId) || numericTokenId < 1 || numericTokenId > 9999) {
    return res.status(400).json({ error: "Token ID must be between 1 and 9999" });
  }

  // Check cache first
  const cacheKey = `nft-${numericTokenId}`;
  const cached = cache.get(cacheKey);
  const now = Date.now();

  if (cached && now - cached.timestamp < CACHE_TTL) {
    return res.status(200).json(cached.data);
  }

  try {
    // Call Phosphor API to find the NFT by token_id
    const url = `${PHOSPHOR_API_BASE}?collection_ids=${COLLECTION_ID}&limit=1000`;

    // We need to paginate through results to find our specific token
    let cursor = null;
    let found = false;
    let nftData = null;

    // Search through paginated results
    for (let attempts = 0; attempts < 20 && !found; attempts++) {
      const fetchUrl: string = cursor ? `${url}&cursor=${cursor}` : url;

      const response: Response = await fetch(fetchUrl, {
        headers: {
          "User-Agent": "NFT-App/1.0",
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Phosphor API error: ${response.status}`);
      }

      const data: any = await response.json();

      if (!data.results || !Array.isArray(data.results)) {
        break;
      }

      // Look for our token in this batch
      const foundNFT = data.results.find(
        (item: any) =>
          item.token_id === tokenId ||
          item.token_id === numericTokenId ||
          (item.name && item.name.includes(`#${numericTokenId}`)),
      );

      if (foundNFT) {
        nftData = convertToMetadataFormat(foundNFT);
        found = true;
        break;
      }

      if (!data.has_more || !data.cursor) {
        break;
      }

      cursor = data.cursor;
    }

    if (!found || !nftData) {
      return res.status(404).json({ error: "NFT not found" });
    }

    // Cache the result
    cache.set(cacheKey, { data: nftData, timestamp: now });

    return res.status(200).json(nftData);
  } catch (error) {
    console.error("Error fetching NFT:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
}
