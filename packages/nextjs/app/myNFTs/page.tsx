"use client";

import { MyHoldings } from "./_components";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { useNFTRange } from "~~/hooks/useNFTRange";
import { notification } from "~~/utils/scaffold-eth";
import { addToIPFS } from "~~/utils/simpleNFT/ipfs-fetch";
import nftsMetadata from "~~/utils/simpleNFT/nftsMetadata";

const MyNFTs: NextPage = () => {
  const { address: connectedAddress, isConnected, isConnecting } = useAccount();

  const { writeContractAsync } = useScaffoldWriteContract({ contractName: "YourCollectible" });

  const { data: tokenIdCounter } = useScaffoldReadContract({
    contractName: "YourCollectible",
    functionName: "tokenIdCounter",
    watch: true,
  });

  // Fetch available NFTs from our API
  const {
    nfts: availableNFTs,
    isLoading: nftsLoading,
    isError: nftsError,
  } = useNFTRange({
    limit: 100, // Get a good selection for randomization
  });

  const handleMintItem = async () => {
    if (tokenIdCounter === undefined) return;

    // Select NFT metadata - prefer dynamic API data, fallback to static if needed
    let currentTokenMetaData;

    if (availableNFTs && availableNFTs.length > 0 && !nftsError) {
      // Select random NFT from API collection
      const randomIndex = Math.floor(Math.random() * availableNFTs.length);
      currentTokenMetaData = availableNFTs[randomIndex];
    } else {
      // Fallback to static metadata if API unavailable
      const tokenIdCounterNumber = Number(tokenIdCounter);
      currentTokenMetaData = nftsMetadata[tokenIdCounterNumber % nftsMetadata.length];

      if (nftsError) {
        console.warn("Using static fallback due to API error:", nftsError);
      }
    }

    const notificationId = notification.loading("Uploading to IPFS");
    try {
      const uploadedItem = await addToIPFS(currentTokenMetaData);

      // First remove previous loading notification and then show success notification
      notification.remove(notificationId);
      notification.success("Metadata uploaded to IPFS");

      await writeContractAsync({
        functionName: "mintItem",
        args: [connectedAddress, uploadedItem.path],
      });
    } catch (error) {
      notification.remove(notificationId);
      console.error(error);
    }
  };

  return (
    <>
      <div className="flex items-center flex-col pt-10">
        <div className="px-5">
          <h1 className="text-center mb-8">
            <span className="block text-4xl font-bold">My NFTs</span>
          </h1>
        </div>
      </div>
      <div className="flex justify-center">
        {!isConnected || isConnecting ? (
          <RainbowKitCustomConnectButton />
        ) : (
          <button className="btn btn-secondary" onClick={handleMintItem} disabled={nftsLoading}>
            {nftsLoading ? "Loading NFTs..." : "Mint NFT"}
          </button>
        )}
      </div>
      <MyHoldings />
    </>
  );
};

export default MyNFTs;
