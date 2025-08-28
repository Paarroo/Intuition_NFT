import React from "react";
import { AttributeBadge } from "./AttributeBadge";
import { RarityBadge, extractRarity } from "~~/components/ui/RarityBadge";

export interface NFTAttribute {
  trait_type: string;
  value: string | number;
}

export interface NFTCardHeaderProps {
  name: string;
  attributes?: NFTAttribute[];
}

export const NFTCardHeader: React.FC<NFTCardHeaderProps> = ({ name, attributes }) => {
  const filteredAttributes =
    attributes?.filter(
      attr => attr.trait_type.toLowerCase() !== "rarity" && String(attr.value).toLowerCase() !== "no",
    ) || [];

  // Séparer les UUIDs longs des valeurs courtes
  const longAttributes = filteredAttributes.filter(attr => String(attr.value).length > 20);
  const shortAttributes = filteredAttributes.filter(attr => String(attr.value).length <= 20);

  return (
    <div className="flex flex-col items-center justify-center space-y-4 min-h-[180px]">
      {/* Titre */}
      <p className="text-xl p-0 m-0 font-semibold text-center mb-2">{name}</p>

      {/* Rarity Badge - en dessous du titre */}
      {attributes?.some(attr => attr.trait_type.toLowerCase() === "rarity") && (
        <div className="flex justify-center">
          <RarityBadge rarity={extractRarity(attributes)} size="md" />
        </div>
      )}

      {/* UUIDs longs - chacun sur sa propre ligne */}
      {longAttributes.slice(0, 2).map((attr, index) => (
        <div key={`long-${index}`} className="flex justify-center w-full">
          <AttributeBadge traitType={attr.trait_type} value={attr.value} />
        </div>
      ))}

      {/* Valeurs courtes - sur la même ligne */}
      {shortAttributes.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center max-w-full">
          {shortAttributes.slice(0, 3).map((attr, index) => (
            <AttributeBadge key={`short-${index}`} traitType={attr.trait_type} value={attr.value} />
          ))}

          {/* Show +N pour attributs restants */}
          {filteredAttributes.length > 5 && (
            <span className="badge badge-outline px-2 py-1 text-xs rounded-full">+{filteredAttributes.length - 5}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default NFTCardHeader;
