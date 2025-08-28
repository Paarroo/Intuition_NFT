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
        {/* Mobile-first: Cards on small screens, Table on larger screens */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile Layout: Cards */}
          <div className="block lg:hidden space-y-4">
            {!transferEvents || transferEvents.length === 0 ? (
              <div className="glassmorphism-card rounded-2xl p-6 text-center">
                <p className="text-sm sm:text-base">No events found</p>
              </div>
            ) : (
              transferEvents?.map((event, index) => (
                <div key={index} className="glassmorphism-card rounded-2xl p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium opacity-70">Token ID</span>
                    <span className="font-semibold">#{event.args.tokenId?.toString()}</span>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="text-xs font-medium opacity-70 block mb-1">From</span>
                      <Address address={event.args.from} />
                    </div>
                    <div>
                      <span className="text-xs font-medium opacity-70 block mb-1">To</span>
                      <Address address={event.args.to} />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Desktop Layout: Table */}
          <div className="hidden lg:block overflow-x-auto glassmorphism-card relative z-10 rounded-2xl">
            <table className="table table-zebra w-full">
              <thead>
                <tr className="text-base-content">
                  <th className="glassmorphism text-white text-base px-4">Token Id</th>
                  <th className="glassmorphism text-white text-base px-4">From</th>
                  <th className="glassmorphism text-white text-base px-4">To</th>
                </tr>
              </thead>
              <tbody>
                {!transferEvents || transferEvents.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center text-base py-6">
                      No events found
                    </td>
                  </tr>
                ) : (
                  transferEvents?.map((event, index) => {
                    return (
                      <tr key={index}>
                        <th className="text-center text-base px-4">{event.args.tokenId?.toString()}</th>
                        <td className="px-4">
                          <Address address={event.args.from} />
                        </td>
                        <td className="px-4">
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
      </div>
    </>
  );
};

export default Transfers;
