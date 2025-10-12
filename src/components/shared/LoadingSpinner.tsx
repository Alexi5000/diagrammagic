import * as React from "react";
import { Loader2 } from "lucide-react";
import { GlassPanel } from "./GlassPanel";
import { cn } from "@/lib/utils";

/**
 * Props for the LoadingSpinner component
 */
interface LoadingSpinnerProps {
  /** Display as full-screen overlay with backdrop blur */
  fullScreen?: boolean;
  
  /** Optional loading message to display below spinner */
  message?: string;
  
  /** Additional CSS classes to merge with defaults */
  className?: string;
}

/**
 * LoadingSpinner - Animated loading indicator with glass-morphism design
 * 
 * Provides a premium loading experience with an electric-blue spinning icon
 * and optional message. Supports both inline and full-screen overlay modes.
 * 
 * @example
 * ```tsx
 * // Inline mode
 * <LoadingSpinner message="Loading diagram..." />
 * 
 * // Full-screen overlay
 * <LoadingSpinner fullScreen message="Generating diagram..." />
 * 
 * // Minimal (no message)
 * <LoadingSpinner />
 * ```
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  fullScreen = false,
  message,
  className,
}) => {
  // Shared spinner content for both modes
  const spinnerContent = (
    <div 
      className="flex flex-col items-center justify-center gap-4"
      role="status" 
      aria-live="polite" 
      aria-label={message || "Loading"}
    >
      <Loader2 
        className="h-12 w-12 text-electric-blue animate-spin"
        strokeWidth={2.5}
        aria-hidden="true"
      />
      {message && (
        <p className="text-sm text-slate-300 font-medium text-center max-w-xs">
          {message}
        </p>
      )}
      {!message && <span className="sr-only">Loading, please wait</span>}
    </div>
  );

  // Full-screen overlay mode
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 animate-fade-in">
        {/* Blurred backdrop */}
        <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-md" />
        
        {/* Centered content */}
        <div className="relative h-full flex items-center justify-center p-4">
          <GlassPanel 
            variant="strong" 
            glowColor="blue"
            className={cn(
              "flex flex-col items-center justify-center",
              "min-w-[280px]",
              "animate-scale-in",
              className
            )}
          >
            {spinnerContent}
          </GlassPanel>
        </div>
      </div>
    );
  }

  // Inline mode
  return (
    <GlassPanel
      variant="default"
      className={cn(
        "flex flex-col items-center justify-center",
        "min-h-[200px]",
        "animate-fade-in",
        className
      )}
    >
      {spinnerContent}
    </GlassPanel>
  );
};

export type { LoadingSpinnerProps };
