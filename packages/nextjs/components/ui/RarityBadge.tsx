import React from "react";

// Types for rarity system
export type RarityTier = "Common" | "Rare" | "Epic" | "Legendary" | "Mythic";

export interface RarityBadgeProps {
  rarity: RarityTier;
  size?: "sm" | "md" | "lg";
  showPercentage?: boolean;
  className?: string;
}

export interface RarityConfig {
  tier: RarityTier;
  dropRate: number;
  icon: string;
  classes: string;
  animationClass?: string;
}

// Rarity configuration with drop rates and styling
const rarityConfigs: Record<RarityTier, RarityConfig> = {
  Common: {
    tier: "Common",
    dropRate: 60,
    icon: "○",
    classes: "glassmorphism-rarity-common",
  },
  Rare: {
    tier: "Rare",
    dropRate: 25,
    icon: "◆",
    classes: "glassmorphism-rarity-rare",
  },
  Epic: {
    tier: "Epic",
    dropRate: 12,
    icon: "♦",
    classes: "glassmorphism-rarity-epic",
  },
  Legendary: {
    tier: "Legendary",
    dropRate: 2.5,
    icon: "★",
    classes: "glassmorphism-rarity-legendary",
    animationClass: "animate-golden-pulse",
  },
  Mythic: {
    tier: "Mythic",
    dropRate: 0.5,
    icon: "✦",
    classes: "glassmorphism-rarity-mythic",
    animationClass: "animate-mythic-sparkle",
  },
};

// Helper function to get rarity configuration
export const getRarityConfig = (rarity: string): RarityConfig => {
  const normalizedRarity = rarity.charAt(0).toUpperCase() + rarity.slice(1).toLowerCase();
  return rarityConfigs[normalizedRarity as RarityTier] || rarityConfigs.Common;
};

// Helper function to extract rarity from NFT attributes
export const extractRarity = (attributes?: Array<{ trait_type: string; value: string | number }>): RarityTier => {
  const rarityAttr = attributes?.find(attr => attr.trait_type.toLowerCase() === "rarity");

  if (rarityAttr) {
    const normalizedRarity =
      String(rarityAttr.value).charAt(0).toUpperCase() + String(rarityAttr.value).slice(1).toLowerCase();
    return normalizedRarity as RarityTier;
  }

  return "Common";
};

export const RarityBadge: React.FC<RarityBadgeProps> = ({
  rarity,
  size = "sm",
  showPercentage = false,
  className = "",
}) => {
  const config = getRarityConfig(rarity);

  // Size classes
  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base",
  };

  return (
    <div
      className={`
        inline-flex items-center gap-1 rounded-full
        backdrop-filter backdrop-blur-md
        border border-opacity-30 
        font-semibold
        ${config.classes}
        ${config.animationClass || ""}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {/* Rarity Icon */}
      <span className="opacity-90 font-bold" aria-label={`${rarity} rarity`}>
        {config.icon}
      </span>

      {/* Rarity Name */}
      <span className="font-bold tracking-wide">{rarity}</span>

      {/* Drop Percentage */}
      {showPercentage && <span className="opacity-80 font-medium">{config.dropRate}%</span>}
    </div>
  );
};

export default RarityBadge;
