import { toast as sonnerToast } from "sonner";
import { CheckCircle2, XCircle, Info, Loader2 } from "lucide-react";
import { cn } from "./utils";

// Base configuration for all toasts
const baseToastConfig = {
  duration: 3000,
  className: cn(
    // Glass-morphism base
    "bg-gradient-to-br from-glass-white-hover to-glass-white",
    "backdrop-blur-lg",
    "border border-glass-border-strong",
    "shadow-glass-lg",
    "rounded-xl",
    
    // Text styling
    "text-white",
    
    // Animation
    "animate-fade-in",
  ),
  descriptionClassName: "text-slate-300 text-sm",
  
  // Close button styling
  cancelButtonStyle: {
    background: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
  },
};

/**
 * Show success toast notification
 * @param message - Main message (title)
 * @param description - Optional supporting text
 * @returns Toast ID
 */
export const showSuccess = (message: string, description?: string) => {
  return sonnerToast.success(message, {
    ...baseToastConfig,
    description,
    icon: <CheckCircle2 className="h-5 w-5 text-electric-blue" />,
    className: cn(
      baseToastConfig.className,
      "border-l-4 border-l-electric-blue",
    ),
  });
};

/**
 * Show error toast notification
 * @param message - Main message (title)
 * @param description - Optional supporting text
 * @returns Toast ID
 */
export const showError = (message: string, description?: string) => {
  return sonnerToast.error(message, {
    ...baseToastConfig,
    description,
    icon: <XCircle className="h-5 w-5 text-destructive" />,
    className: cn(
      baseToastConfig.className,
      "border-l-4 border-l-destructive",
    ),
  });
};

/**
 * Show info toast notification
 * @param message - Main message (title)
 * @param description - Optional supporting text
 * @returns Toast ID
 */
export const showInfo = (message: string, description?: string) => {
  return sonnerToast.info(message, {
    ...baseToastConfig,
    description,
    icon: <Info className="h-5 w-5 text-cyber-cyan" />,
    className: cn(
      baseToastConfig.className,
      "border-l-4 border-l-cyber-cyan",
    ),
  });
};

/**
 * Show loading toast notification
 * @param message - Main message (title)
 * @param description - Optional supporting text
 * @returns Toast ID (use to dismiss later)
 */
export const showLoading = (message: string, description?: string) => {
  return sonnerToast.loading(message, {
    ...baseToastConfig,
    description,
    duration: Infinity, // Stay until dismissed
    icon: <Loader2 className="h-5 w-5 text-neon-violet animate-spin" />,
    className: cn(
      baseToastConfig.className,
      "border-l-4 border-l-neon-violet",
    ),
  });
};

/**
 * Dismiss a specific toast by ID
 * @param toastId - The ID returned from show* functions
 */
export const dismissToast = (toastId: string | number) => {
  sonnerToast.dismiss(toastId);
};

/**
 * Dismiss all active toasts
 */
export const dismissAllToasts = () => {
  sonnerToast.dismiss();
};

// Re-export the raw sonner toast for advanced use cases
export { sonnerToast as toast };
