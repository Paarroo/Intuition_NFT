"use client";

import Image from "next/image";
import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";
import AnimatedBackground from "~~/components/ui/AnimatedBackground";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  return (
    <>
      <AnimatedBackground />
      <div className="flex items-center flex-col grow pt-6 sm:pt-8 lg:pt-10 relative z-10">
        <div className="px-4 sm:px-6 lg:px-8 w-full max-w-7xl mx-auto">
          <h1 className="text-center">
            <span className="block text-xl sm:text-2xl mb-2">Welcome to</span>
            <span className="block text-3xl sm:text-4xl lg:text-5xl font-bold">Scaffold-ETH 2</span>
            <span className="block text-sm sm:text-base lg:text-xl font-bold">
              (SpeedRunEthereum Challenge: Simple NFT Example extension)
            </span>
          </h1>
          <div className="flex justify-center items-center space-x-2 flex-col">
            <div className="glassmorphism rounded-xl px-6 py-4 mt-4">
              <p className="my-2 font-medium text-center">Connected Address:</p>
              <Address address={connectedAddress} />
            </div>
          </div>

          <div className="flex items-center flex-col flex-grow mt-6 sm:mt-8">
            <div className="px-4 sm:px-6 w-full max-w-6xl">
              <h1 className="text-center mb-6 sm:mb-8">
                <span className="block text-2xl sm:text-3xl lg:text-4xl font-bold">Challenge: Simple NFT Example</span>
              </h1>
              <div className="flex flex-col items-center justify-center">
                <div className="w-full max-w-2xl">
                  <div className="glassmorphism rounded-xl p-4">
                    <Image
                      src="/hero.png"
                      width="727"
                      height="231"
                      alt="challenge banner"
                      className="w-full h-auto rounded-xl border-4 border-primary"
                    />
                  </div>
                </div>
                <div className="max-w-3xl px-4 sm:px-6">
                  <p className="text-center text-sm sm:text-base lg:text-lg mt-6 sm:mt-8 leading-relaxed">
                    🎫 Create a simple NFT to learn basics of 🏗️ Scaffold-ETH 2. You&#39;ll use 👷‍♀️
                    <a
                      href="https://hardhat.org/getting-started/"
                      target="_blank"
                      rel="noreferrer"
                      className="underline hover:text-primary transition-colors"
                    >
                      HardHat
                    </a>{" "}
                    to compile and deploy smart contracts. Then, you&#39;ll use a template React app full of important
                    Ethereum components and hooks. Finally, you&#39;ll deploy an NFT to a public network to share with
                    friends! 🚀
                  </p>
                  <p className="text-center text-sm sm:text-base lg:text-lg mt-4 sm:mt-6 leading-relaxed">
                    🌟 The final deliverable is an app that lets users purchase and transfer NFTs. Deploy your contracts
                    to a testnet then build and upload your app to a public web server. Submit the url on{" "}
                    <a
                      href="https://speedrunethereum.com/"
                      target="_blank"
                      rel="noreferrer"
                      className="underline hover:text-primary transition-colors"
                    >
                      SpeedRunEthereum.com
                    </a>{" "}
                    !
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grow glassmorphism w-full mt-8 sm:mt-12 lg:mt-16 px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12 relative z-10">
          <div className="flex justify-center items-center gap-6 sm:gap-8 lg:gap-12 flex-col md:flex-row max-w-4xl mx-auto">
            <div className="flex flex-col glassmorphism px-6 sm:px-8 lg:px-10 py-6 sm:py-8 lg:py-10 text-center items-center w-full max-w-sm rounded-3xl hover:bg-white/10 transition-all duration-300">
              <BugAntIcon className="h-8 w-8 fill-secondary mb-4" />
              <p className="text-sm sm:text-base leading-relaxed">
                Tinker with your smart contract using the{" "}
                <Link href="/debug" passHref className="link hover:text-primary transition-colors">
                  Debug Contracts
                </Link>{" "}
                tab.
              </p>
            </div>
            <div className="flex flex-col glassmorphism px-6 sm:px-8 lg:px-10 py-6 sm:py-8 lg:py-10 text-center items-center w-full max-w-sm rounded-3xl hover:bg-white/10 transition-all duration-300">
              <MagnifyingGlassIcon className="h-8 w-8 fill-secondary mb-4" />
              <p className="text-sm sm:text-base leading-relaxed">
                Explore your local transactions with the{" "}
                <Link href="/blockexplorer" passHref className="link hover:text-primary transition-colors">
                  Block Explorer
                </Link>{" "}
                tab.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
