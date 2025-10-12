import * as React from "react";
import { LucideIcon } from "lucide-react";
import { GlassPanel } from "./GlassPanel";
import { cn } from "@/lib/utils";

/**
 * Props for the EmptyState component
 */
interface EmptyStateProps {
  /** Lucide icon component to display */
  icon: LucideIcon;
  
  /** Title text */
  title: string;
  
  /** Description text */
  description: string;
  
  /** Optional call-to-action button */
  action?: {
    label: string;
    onClick: () => void;
  };
  
  /** Additional CSS classes to merge with defaults */
  className?: string;
}

/**
 * EmptyState - Placeholder component for empty content states
 * 
 * Provides a visually appealing empty state with an icon, title, description,
 * and optional call-to-action button. Uses glass-morphism design for consistency.
 * 
 * @example
 * ```tsx
 * // Basic empty state
 * <EmptyState
 *   icon={FileText}
 *   title="No diagrams yet"
 *   description="Create your first diagram to get started"
 * />
 * 
 * // With action button
 * <EmptyState
 *   icon={Sparkles}
 *   title="Start with AI"
 *   description="Describe your diagram and let AI generate it for you"
 *   action={{
 *     label: "Generate Diagram",
 *     onClick: () => console.log('clicked')
 *   }}
 * />
 * ```
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  action,
  className,
}) => {
  return (
    <GlassPanel
      variant="default"
      className={cn(
        "flex flex-col items-center justify-center text-center",
        "min-h-[400px] py-12 px-6",
        "animate-fade-in",
        className
      )}
      role="status"
      aria-live="polite"
      aria-label={title}
    >
      {/* Icon */}
      <Icon 
        className="h-16 w-16 text-slate-400 mb-6"
        strokeWidth={1.5}
        aria-hidden="true"
      />
      
      {/* Title */}
      <h3 className="text-2xl font-bold text-white mb-3">
        {title}
      </h3>
      
      {/* Description */}
      <p className="text-lg text-slate-300 max-w-md leading-relaxed mb-8">
        {description}
      </p>
      
      {/* Optional CTA Button */}
      {action && (
        <button
          onClick={action.onClick}
          className={cn(
            "px-8 py-3 rounded-xl",
            "bg-electric-blue text-white font-semibold",
            "transition-all duration-300",
            "hover:bg-electric-blue-dark",
            "hover:scale-105",
            "hover:shadow-glow-blue",
            "focus-visible:outline-none focus-visible:ring-2",
            "focus-visible:ring-electric-blue focus-visible:ring-offset-2",
            "focus-visible:ring-offset-slate-950"
          )}
          aria-label={action.label}
        >
          {action.label}
        </button>
      )}
    </GlassPanel>
  );
};

export type { EmptyStateProps };
