import React from "react";

interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
  rounded?: "sm" | "md" | "lg" | "xl" | "full";
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = "",
  width = "w-full",
  height = "h-4",
  rounded = "md",
}) => {
  const roundedClasses = {
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    full: "rounded-full",
  };

  return (
    <div
      className={`animate-pulse bg-gradient-to-r from-white/10 to-white/20 ${width} ${height} ${roundedClasses[rounded]} ${className}`}
    />
  );
};

export const NFTCardSkeleton: React.FC = () => {
  return (
    <div className="glassmorphism-card rounded-3xl p-6 w-full max-w-[320px] sm:max-w-[280px] h-[700px] flex flex-col">
      {/* ID Badge */}
      <div className="absolute top-2 left-2">
        <Skeleton width="w-12" height="h-6" rounded="lg" />
      </div>

      {/* Image */}
      <Skeleton width="w-full" height="h-60" rounded="lg" className="mb-6" />

      {/* Content */}
      <div className="flex-1 flex flex-col space-y-4">
        {/* Title */}
        <Skeleton width="w-3/4" height="h-6" rounded="md" className="mx-auto" />

        {/* Rarity Badge */}
        <div className="flex justify-center">
          <Skeleton width="w-20" height="h-8" rounded="full" />
        </div>

        {/* Secret Code */}
        <div className="flex justify-center">
          <Skeleton width="w-32" height="h-6" rounded="full" />
        </div>

        {/* RF Badge */}
        <div className="flex justify-center">
          <Skeleton width="w-16" height="h-6" rounded="full" />
        </div>

        {/* Description */}
        <div className="space-y-2 py-4">
          <Skeleton width="w-full" height="h-3" />
          <Skeleton width="w-4/5" height="h-3" />
          <Skeleton width="w-3/5" height="h-3" />
        </div>

        {/* Owner */}
        <div className="space-y-2">
          <Skeleton width="w-12" height="h-4" />
          <div className="flex items-center gap-2">
            <Skeleton width="w-6" height="h-6" rounded="full" />
            <Skeleton width="w-24" height="h-4" />
          </div>
        </div>

        {/* Transfer */}
        <div className="space-y-2">
          <Skeleton width="w-16" height="h-4" />
          <Skeleton width="w-full" height="h-10" rounded="full" />
        </div>

        {/* Button */}
        <div className="flex justify-center mt-auto">
          <Skeleton width="w-24" height="h-10" rounded="full" />
        </div>
      </div>
    </div>
  );
};

export default Skeleton;
