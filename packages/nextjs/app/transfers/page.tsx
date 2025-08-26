"use client";

import type { NextPage } from "next";
import { Address } from "~~/components/scaffold-eth";
import AnimatedBackground from "~~/components/ui/AnimatedBackground";
import { useScaffoldEventHistory } from "~~/hooks/scaffold-eth";

const Transfers: NextPage = () => {
  const { data: transferEvents, isLoading } = useScaffoldEventHistory({
    contractName: "YourCollectible",
    eventName: "Transfer",
  });

  if (isLoading)
    return (
      <>
        <AnimatedBackground />
        <div className="flex justify-center items-center mt-8 sm:mt-10 lg:mt-12 relative z-10">
          <span className="loading loading-spinner loading-lg sm:loading-xl"></span>
        </div>
      </>
    );

  return (
    <>
      <AnimatedBackground />
      <div className="flex items-center flex-col flex-grow pt-6 sm:pt-8 lg:pt-10 relative z-10">
        <div className="px-4 sm:px-6 lg:px-8 w-full max-w-7xl mx-auto">
          <h1 className="text-center mb-6 sm:mb-8">
            <span className="block text-2xl sm:text-3xl lg:text-4xl font-bold">All Transfers Events</span>
          </h1>
        </div>
        <div className="overflow-x-auto glassmorphism-card relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 rounded-2xl">
          <table className="table table-zebra w-full min-w-[600px]">
            <thead>
              <tr className="text-base-content">
                <th className="glassmorphism text-white text-sm sm:text-base px-2 sm:px-4">Token Id</th>
                <th className="glassmorphism text-white text-sm sm:text-base px-2 sm:px-4">From</th>
                <th className="glassmorphism text-white text-sm sm:text-base px-2 sm:px-4">To</th>
              </tr>
            </thead>
            <tbody>
              {!transferEvents || transferEvents.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center text-sm sm:text-base py-6">
                    No events found
                  </td>
                </tr>
              ) : (
                transferEvents?.map((event, index) => {
                  return (
                    <tr key={index}>
                      <th className="text-center text-sm sm:text-base px-2 sm:px-4">
                        {event.args.tokenId?.toString()}
                      </th>
                      <td className="px-2 sm:px-4">
                        <Address address={event.args.from} />
                      </td>
                      <td className="px-2 sm:px-4">
                        <Address address={event.args.to} />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Transfers;
