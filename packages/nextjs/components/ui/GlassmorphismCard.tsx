import React from "react";
import { useReducedMotion } from "~~/hooks/useA11y";

interface GlassmorphismCardProps {
  children: React.ReactNode;
  variant?: "default" | "transparent" | "card" | "primary" | "secondary" | "success" | "warning" | "danger";
  size?: "sm" | "md" | "lg" | "auto";
  className?: string;
  hover?: boolean;
  minHeight?: string | number;
  onClick?: () => void;
  role?: string;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  tabIndex?: number;
  onKeyDown?: (event: React.KeyboardEvent) => void;
}

export const GlassmorphismCard: React.FC<GlassmorphismCardProps> = ({
  children,
  variant = "default",
  size = "auto",
  className,
  hover = true,
  minHeight,
  onClick,
  role,
  ariaLabel,
  ariaDescribedBy,
  tabIndex,
  onKeyDown,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const baseClasses = `rounded-3xl overflow-hidden ${prefersReducedMotion ? "" : "transition-all duration-300"}`;

  const variantClasses = {
    default: "glassmorphism shadow-lg",
    transparent: "glassmorphism-card shadow-lg",
    card: "glassmorphism-card shadow-lg",
    primary: "glassmorphism-card shadow-lg border-primary/30",
    secondary: "glassmorphism-card shadow-lg border-secondary/30",
    success: "glassmorphism-card shadow-lg border-success/30",
    warning: "glassmorphism-card shadow-lg border-warning/30",
    danger: "glassmorphism-card shadow-lg border-error/30",
  };

  const sizeClasses = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
    auto: "",
  };

  const hoverClasses =
    hover && !prefersReducedMotion ? "hover:shadow-xl hover:scale-[1.02]" : hover ? "hover:shadow-xl" : "";

  const minHeightStyle = minHeight ? { minHeight: typeof minHeight === "number" ? `${minHeight}px` : minHeight } : {};

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (onClick && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      onClick();
    }
    onKeyDown?.(event);
  };

  const isInteractive = onClick || tabIndex !== undefined;

  return (
    <div
      className={[
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        hoverClasses,
        isInteractive
          ? "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-transparent"
          : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={minHeightStyle}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={role || (isInteractive ? "button" : undefined)}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      tabIndex={tabIndex || (onClick ? 0 : undefined)}
    >
      {children}
    </div>
  );
};
