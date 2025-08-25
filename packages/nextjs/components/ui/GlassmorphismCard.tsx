import React from "react";

interface GlassmorphismCardProps {
  children: React.ReactNode;
  variant?: "default" | "transparent" | "card";
  size?: "sm" | "md" | "lg" | "auto";
  className?: string;
  hover?: boolean;
  minHeight?: string | number;
  onClick?: () => void;
}

export const GlassmorphismCard: React.FC<GlassmorphismCardProps> = ({
  children,
  variant = "default",
  size = "auto",
  className,
  hover = true,
  minHeight,
  onClick,
}) => {
  const baseClasses = "rounded-3xl overflow-hidden transition-all duration-300";

  const variantClasses = {
    default: "glassmorphism shadow-lg",
    transparent: "glassmorphism-card shadow-lg",
    card: "glassmorphism-card shadow-lg",
  };

  const sizeClasses = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
    auto: "",
  };

  const hoverClasses = hover ? "hover:shadow-xl hover:scale-[1.02]" : "";

  const minHeightStyle = minHeight ? { minHeight: typeof minHeight === "number" ? `${minHeight}px` : minHeight } : {};

  return (
    <div
      className={[baseClasses, variantClasses[variant], sizeClasses[size], hoverClasses, className]
        .filter(Boolean)
        .join(" ")}
      style={minHeightStyle}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
