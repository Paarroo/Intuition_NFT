export interface NFTAttribute {
  trait_type: string;
  value: string | number;
  display_type?: "number" | "boost_percentage" | "boost_number" | "date";
}

export interface NFTMetaData {
  animation_url?: string;
  attributes?: NFTAttribute[];
  description?: string;
  external_url?: string;
  background_color?: string;
  image?: string;
  name?: string;
}

export interface NFTMetaDataExtended extends NFTMetaData {
  token_id?: string | number;
}

export type { NFTMetaData as NFTMetaDataLegacy };

const nftsMetadata: NFTMetaData[] = [
  {
    name: "Relic #1",
    description: "Intuition Commemorative Genesis NFT. Trust your intuition.",
    image: "https://assets.phosphor.xyz/raw/fec75301-c71c-4739-9d05-d42572f45fb6.png",
    animation_url: "https://assets.phosphor.xyz/raw/0cf9dbbb-e61e-44d5-b067-89e28e3d2a96.mp4",
    attributes: [
      { trait_type: "rarity", value: "Epic" },
      { trait_type: "genesis", value: "No" },
      { trait_type: "secret_code", value: "8b68ec06-f49e-4b5b-a234-871aa74baeb1" },
      { trait_type: "resonance_frequency", value: 415 },
    ],
  },
];

export default nftsMetadata;
