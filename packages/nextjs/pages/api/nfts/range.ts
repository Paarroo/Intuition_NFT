import type { NextApiRequest, NextApiResponse } from "next";

// Simple in-memory cache
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

// Rate limiting store for range requests (more restrictive)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX = 20; // 20 range requests per window (more restrictive)

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
  token_id?: string | number;
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
  res.setHeader("Cache-Control", "public, max-age=600, s-maxage=600"); // 10 minute cache for ranges
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
    token_id: phosphorItem.token_id,
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
      error: "Rate limit exceeded for range requests. Try again later.",
    });
  }

  const { start, limit, cursor } = req.query;

  // Validate parameters
  let numericStart = 0;
  let numericLimit = 50; // Default limit

  if (start) {
    numericStart = parseInt(start as string, 10);
    if (isNaN(numericStart) || numericStart < 0) {
      return res.status(400).json({ error: "Start must be a non-negative number" });
    }
  }

  if (limit) {
    numericLimit = parseInt(limit as string, 10);
    if (isNaN(numericLimit) || numericLimit < 1 || numericLimit > 100) {
      return res.status(400).json({ error: "Limit must be between 1 and 100" });
    }
  }

  // Check cache first
  const cacheKey = `range-${numericStart}-${numericLimit}-${cursor || "initial"}`;
  const cached = cache.get(cacheKey);
  const now = Date.now();

  if (cached && now - cached.timestamp < CACHE_TTL) {
    return res.status(200).json(cached.data);
  }

  try {
    // Call Phosphor API
    let url = `${PHOSPHOR_API_BASE}?collection_ids=${COLLECTION_ID}&limit=${numericLimit}`;

    if (cursor) {
      url += `&cursor=${encodeURIComponent(cursor as string)}`;
    }

    const response = await fetch(url, {
      headers: {
        "User-Agent": "NFT-App/1.0",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Phosphor API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.results || !Array.isArray(data.results)) {
      return res.status(200).json({
        nfts: [],
        hasMore: false,
        nextCursor: null,
        total: 0,
      });
    }

    // Convert all NFTs to our format
    const nfts = data.results.map(convertToMetadataFormat);

    // Sort by token ID for consistent ordering
    nfts.sort((a: any, b: any) => {
      const aId = parseInt(a.token_id as string, 10) || 0;
      const bId = parseInt(b.token_id as string, 10) || 0;
      return aId - bId;
    });

    const result = {
      nfts,
      hasMore: data.has_more || false,
      nextCursor: data.cursor || null,
      total: data.total_results || nfts.length,
      count: nfts.length,
    };

    // Cache the result
    cache.set(cacheKey, { data: result, timestamp: now });

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching NFT range:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
}
