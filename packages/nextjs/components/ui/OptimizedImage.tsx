import React, { useState } from "react";
import Image from "next/image";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width = 800,
  height = 600,
  className = "",
  priority = false,
  quality = 85,
  placeholder = "empty",
  blurDataURL,
  onLoad,
  onError,
}) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    setImageError(true);
    setIsLoading(false);
    onError?.();
  };

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  if (imageError) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-gray-600/20 to-gray-800/20 ${className}`}
      >
        <div className="text-center p-4">
          <div className="text-3xl mb-2">🖼️</div>
          <p className="text-sm opacity-60">Image failed to load</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-600/10 to-gray-800/10 rounded">
          <div className="loading loading-spinner loading-md"></div>
        </div>
      )}

      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        quality={quality}
        priority={priority}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        className={`object-cover transition-opacity duration-300 ${isLoading ? "opacity-0" : "opacity-100"}`}
        style={{
          width: "100%",
          height: "100%",
        }}
        onLoad={handleLoad}
        onError={handleError}
        unoptimized={src.startsWith("data:") || src.startsWith("blob:")}
      />
    </div>
  );
};

interface NFTImageProps {
  src: string;
  alt: string;
  tokenId?: string;
  className?: string;
  priority?: boolean;
}

export const NFTImage: React.FC<NFTImageProps> = ({
  src,
  alt,
  tokenId,
  className = "h-60 w-full",
  priority = false,
}) => {
  const [showFallback, setShowFallback] = useState(false);

  if (showFallback) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-lg ${className}`}
      >
        <div className="text-center p-6">
          <div className="text-4xl mb-3">🎨</div>
          <p className="text-lg font-semibold opacity-80">NFT #{tokenId}</p>
          <p className="text-sm opacity-60">Generated Art</p>
        </div>
      </div>
    );
  }

  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={400}
      height={400}
      className={className}
      priority={priority}
      quality={90}
      onError={() => setShowFallback(true)}
    />
  );
};

export const createImageBlurDataURL = (width = 10, height = 10) => {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) return undefined;

  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "rgba(139, 69, 19, 0.3)");
  gradient.addColorStop(1, "rgba(75, 85, 99, 0.3)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  return canvas.toDataURL();
};

export default OptimizedImage;
