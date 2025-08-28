import React from "react";
import { GlassmorphismCard } from "./GlassmorphismCard";
import { RarityTier, getRarityConfig } from "./RarityBadge";

const rarityTiers: RarityTier[] = ["Common", "Rare", "Epic", "Legendary", "Mythic"];

export const RarityInfo: React.FC = () => {
  return (
    <GlassmorphismCard variant="transparent" size="md" className="mb-12">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg font-semibold">Drop Rates ✨</span>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {rarityTiers.map(tier => {
            const config = getRarityConfig(tier);
            return (
              <div
                key={tier}
                className={`
                  ${config.classes}
                  rounded-lg p-3 text-center border border-opacity-30
                  backdrop-filter backdrop-blur-md
                `}
              >
                <div className="text-lg mb-1">{config.icon}</div>
                <div className="font-semibold text-sm">{tier}</div>
                <div className="text-xs opacity-80">{config.dropRate}% chance</div>
              </div>
            );
          })}
        </div>
      </div>
    </GlassmorphismCard>
  );
};

export default RarityInfo;
