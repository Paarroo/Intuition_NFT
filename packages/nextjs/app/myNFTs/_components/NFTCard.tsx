import { useState } from "react";
import { Collectible } from "./MyHoldings";
import { NFTCardActions } from "./NFTCardActions";
import { NFTCardContent } from "./NFTCardContent";
import { NFTCardHeader } from "./NFTCardHeader";
import { GlassmorphismCard } from "~~/components/ui/GlassmorphismCard";
import { NFTImage } from "~~/components/ui/OptimizedImage";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export const NFTCard = ({ nft }: { nft: Collectible }) => {
  const [transferToAddress, setTransferToAddress] = useState("");

  const { writeContractAsync } = useScaffoldWriteContract({ contractName: "YourCollectible" });

  return (
    <GlassmorphismCard
      variant="default"
      className="w-full max-w-[320px] sm:max-w-[280px] flex flex-col relative min-h-[700px]"
    >
      {/* NFT ID badge positioned at card corner */}
      <GlassmorphismCard
        variant="default"
        size="sm"
        className="absolute top-2 left-2 opacity-75 scale-75 z-10"
        hover={false}
      >
        <span className="text-white text-xs font-medium"># {nft.id}</span>
      </GlassmorphismCard>

      {/* Image section */}
      <div className="relative">
        <NFTImage
          src={nft.image || "/placeholder-nft.png"}
          alt={`${nft.name || "NFT"} - NFT #${nft.id}`}
          tokenId={nft.id.toString()}
          className="h-60 w-full rounded-lg"
          priority={false}
        />
      </div>

      {/* Content section */}
      <div className="flex-1 flex flex-col p-6">
        <NFTCardHeader name={nft.name || "Unnamed NFT"} attributes={nft.attributes} />

        <NFTCardContent description={nft.description || "No description available"} owner={nft.owner} />

        <NFTCardActions
          transferToAddress={transferToAddress}
          onAddressChange={setTransferToAddress}
          onTransfer={() => {
            try {
              writeContractAsync({
                functionName: "transferFrom",
                args: [nft.owner, transferToAddress, BigInt(nft.id.toString())],
              });
            } catch (err) {
              console.error("Error calling transferFrom function", err);
            }
          }}
        />
      </div>
    </GlassmorphismCard>
  );
};
