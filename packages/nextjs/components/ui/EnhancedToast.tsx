import React from "react";

export type ToastType = "success" | "error" | "warning" | "info" | "loading";

export interface EnhancedToastProps {
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const toastIcons = {
  success: "✅",
  error: "❌",
  warning: "⚠️",
  info: "ℹ️",
  loading: "⏳",
};

const toastStyles = {
  success: "border-green-500/30 bg-green-500/10 text-green-100",
  error: "border-red-500/30 bg-red-500/10 text-red-100",
  warning: "border-yellow-500/30 bg-yellow-500/10 text-yellow-100",
  info: "border-blue-500/30 bg-blue-500/10 text-blue-100",
  loading: "border-gray-500/30 bg-gray-500/10 text-gray-100",
};

export const EnhancedToast: React.FC<EnhancedToastProps> = ({ type, title, message, action }) => {
  return (
    <div
      className={`
      flex items-start gap-3 p-4 rounded-lg border backdrop-blur-md
      ${toastStyles[type]}
      shadow-lg max-w-md w-full
    `}
    >
      {/* Icon */}
      <span className="text-lg flex-shrink-0 mt-0.5">
        {type === "loading" ? <span className="loading loading-spinner loading-sm"></span> : toastIcons[type]}
      </span>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-sm">{title}</h4>
        {message && <p className="text-xs opacity-90 mt-1">{message}</p>}

        {/* Action Button */}
        {action && (
          <button onClick={action.onClick} className="text-xs underline opacity-80 hover:opacity-100 mt-2">
            {action.label}
          </button>
        )}
      </div>
    </div>
  );
};

export const createEnhancedToast = {
  success: (title: string, message?: string, action?: EnhancedToastProps["action"]) => ({
    type: "success" as const,
    title,
    message,
    action,
    duration: 5000,
  }),

  error: (title: string, message?: string, action?: EnhancedToastProps["action"]) => ({
    type: "error" as const,
    title,
    message,
    action,
    duration: 8000,
  }),

  warning: (title: string, message?: string) => ({
    type: "warning" as const,
    title,
    message,
    duration: 6000,
  }),

  info: (title: string, message?: string) => ({
    type: "info" as const,
    title,
    message,
    duration: 4000,
  }),

  loading: (title: string, message?: string) => ({
    type: "loading" as const,
    title,
    message,
  }),
};

export default EnhancedToast;
