import { useState } from "react";
import { Collectible } from "./MyHoldings";
import { Address, AddressInput } from "~~/components/scaffold-eth";
import { GlassmorphismCard } from "~~/components/ui/GlassmorphismCard";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export const NFTCard = ({ nft }: { nft: Collectible }) => {
  const [transferToAddress, setTransferToAddress] = useState("");

  const { writeContractAsync } = useScaffoldWriteContract({ contractName: "YourCollectible" });

  return (
    <GlassmorphismCard
      variant="default"
      className="w-full max-w-[320px] sm:max-w-[280px] flex flex-col relative"
      minHeight="600px"
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
        {/* eslint-disable-next-line  */}
        <img src={nft.image} alt="NFT Image" className="h-60 w-full object-cover" />
      </div>

      {/* Content section */}
      <div className="flex-1 flex flex-col justify-between space-y-4 p-6">
        <div className="flex flex-col items-center justify-center space-y-3">
          <p className="text-xl p-0 m-0 font-semibold text-center">{nft.name}</p>
          <div className="flex flex-wrap gap-2 justify-center max-w-full">
            {nft.attributes?.slice(0, 3).map((attr, index) => (
              <span
                key={index}
                className="badge badge-secondary px-2 py-1 text-xs rounded-full max-w-[120px] truncate"
                title={String(attr.value)}
              >
                {String(attr.value)}
              </span>
            ))}
            {nft.attributes && nft.attributes.length > 3 && (
              <span className="badge badge-outline px-2 py-1 text-xs rounded-full">+{nft.attributes.length - 3}</span>
            )}
          </div>
        </div>
        <div className="flex flex-col justify-center flex-1">
          <p className="my-0 text-sm leading-relaxed line-clamp-3">{nft.description}</p>
        </div>
        <div className="flex flex-col space-y-2">
          <span className="text-sm font-semibold opacity-70">Owner</span>
          <Address address={nft.owner} />
        </div>
        <div className="flex flex-col space-y-2 pt-2">
          <span className="text-sm font-semibold opacity-70">Transfer To</span>
          <AddressInput
            value={transferToAddress}
            placeholder="receiver address"
            onChange={newValue => setTransferToAddress(newValue)}
          />
        </div>
        <div className="card-actions justify-center pt-4">
          <button
            className="btn btn-secondary btn-md px-8 tracking-wide rounded-full hover:scale-105 transition-transform duration-200"
            onClick={() => {
              try {
                writeContractAsync({
                  functionName: "transferFrom",
                  args: [nft.owner, transferToAddress, BigInt(nft.id.toString())],
                });
              } catch (err) {
                console.error("Error calling transferFrom function", err);
              }
            }}
          >
            Send
          </button>
        </div>
      </div>
    </GlassmorphismCard>
  );
};
