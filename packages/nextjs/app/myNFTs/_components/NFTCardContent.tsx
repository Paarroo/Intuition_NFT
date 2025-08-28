import React from "react";
import { Address } from "~~/components/scaffold-eth";

export interface NFTCardContentProps {
  description: string;
  owner: string;
}

export const NFTCardContent: React.FC<NFTCardContentProps> = ({ description, owner }) => {
  return (
    <>
      {/* Description - Fixed height section */}
      <div className="flex flex-col justify-center min-h-[80px] py-4">
        <p className="my-0 text-sm leading-relaxed line-clamp-3">{description}</p>
      </div>

      {/* Owner section - Fixed height */}
      <div className="flex flex-col space-y-2 min-h-[60px] justify-center">
        <span className="text-sm font-semibold opacity-70">Owner</span>
        <Address address={owner} />
      </div>
    </>
  );
};

export default NFTCardContent;
