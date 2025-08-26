import React from "react";
import { AddressInput } from "~~/components/scaffold-eth";

export interface NFTCardActionsProps {
  transferToAddress: string;
  onAddressChange: (address: string) => void;
  onTransfer: () => void;
  isTransferDisabled?: boolean;
}

export const NFTCardActions: React.FC<NFTCardActionsProps> = ({
  transferToAddress,
  onAddressChange,
  onTransfer,
  isTransferDisabled = false,
}) => {
  return (
    <>
      {/* Transfer section - Fixed height */}
      <div className="flex flex-col space-y-2 pt-2 min-h-[80px]">
        <span className="text-sm font-semibold opacity-70">Transfer To</span>
        <AddressInput value={transferToAddress} placeholder="receiver address" onChange={onAddressChange} />
      </div>

      {/* Button section - Fixed at bottom */}
      <div className="card-actions justify-center pt-4 mt-auto">
        <button
          className="btn btn-secondary btn-md px-8 tracking-wide rounded-full hover:scale-105 transition-transform duration-200"
          onClick={onTransfer}
          disabled={isTransferDisabled}
        >
          Send
        </button>
      </div>
    </>
  );
};

export default NFTCardActions;
