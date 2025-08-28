import React from "react";
import { GlassmorphismCard } from "./GlassmorphismCard";
import { RarityTier } from "./RarityBadge";

export interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedRarity: RarityTier | "All";
  onRarityChange: (rarity: RarityTier | "All") => void;
  sortBy: "name" | "rarity" | "id";
  onSortChange: (sort: "name" | "rarity" | "id") => void;
  totalCount: number;
  filteredCount: number;
}

const rarityOptions: (RarityTier | "All")[] = ["All", "Common", "Rare", "Epic", "Legendary", "Mythic"];

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedRarity,
  onRarityChange,
  sortBy,
  onSortChange,
  totalCount,
  filteredCount,
}) => {
  return (
    <GlassmorphismCard variant="transparent" size="md" className="mb-8">
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
        {/* Search Input */}
        <div className="flex-1">
          <label className="text-sm font-semibold opacity-70 block mb-2">Search NFTs</label>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              placeholder="Search by name or ID..."
              className="input input-bordered w-full bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50">🔍</span>
          </div>
        </div>

        {/* Rarity Filter */}
        <div className="lg:w-48">
          <label className="text-sm font-semibold opacity-70 block mb-2">Filter by Rarity</label>
          <select
            value={selectedRarity}
            onChange={e => onRarityChange(e.target.value as RarityTier | "All")}
            className="select select-bordered w-full bg-white/10 border-white/20 text-white focus:border-white/40"
          >
            {rarityOptions.map(rarity => (
              <option key={rarity} value={rarity} className="bg-gray-800 text-white">
                {rarity}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Options */}
        <div className="lg:w-36">
          <label className="text-sm font-semibold opacity-70 block mb-2">Sort by</label>
          <select
            value={sortBy}
            onChange={e => onSortChange(e.target.value as "name" | "rarity" | "id")}
            className="select select-bordered w-full bg-white/10 border-white/20 text-white focus:border-white/40"
          >
            <option value="id" className="bg-gray-800 text-white">
              ID
            </option>
            <option value="name" className="bg-gray-800 text-white">
              Name
            </option>
            <option value="rarity" className="bg-gray-800 text-white">
              Rarity
            </option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/10">
        <span className="text-sm opacity-70">
          Showing {filteredCount} of {totalCount} NFTs
        </span>

        {/* Clear Filters */}
        {(searchQuery || selectedRarity !== "All" || sortBy !== "id") && (
          <button
            onClick={() => {
              onSearchChange("");
              onRarityChange("All");
              onSortChange("id");
            }}
            className="text-xs opacity-60 hover:opacity-100 transition-opacity underline"
          >
            Clear Filters
          </button>
        )}
      </div>
    </GlassmorphismCard>
  );
};

export default FilterBar;
