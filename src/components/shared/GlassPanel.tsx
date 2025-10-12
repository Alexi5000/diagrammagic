import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Props for the GlassPanel component
 */
interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Content to be rendered inside the panel */
  children: React.ReactNode;
  
  /** Additional CSS classes to merge with defaults */
  className?: string;
  
  /** Visual variant of the glass panel
   * - default: Standard glass with moderate blur
   * - strong: More opaque glass with stronger blur
   * - gradient: Glass with gradient overlay
   */
  variant?: 'default' | 'strong' | 'gradient';
  
  /** Glow color effect for the panel
   * - blue: Electric blue glow
   * - violet: Neon violet glow  
   * - cyan: Cyber cyan glow
   * - none: No glow effect
   */
  glowColor?: 'blue' | 'violet' | 'cyan' | 'none';
}

/**
 * GlassPanel - A reusable glass-morphism container component
 * 
 * Provides a premium frosted-glass visual effect with customizable
 * variants and optional glow effects. Perfect for cards, panels, modals,
 * and other elevated UI elements.
 * 
 * @example
 * ```tsx
 * // Basic usage
 * <GlassPanel>
 *   <h2>Content</h2>
 * </GlassPanel>
 * 
 * // With strong variant and blue glow
 * <GlassPanel variant="strong" glowColor="blue">
 *   <h2>Important Feature</h2>
 * </GlassPanel>
 * 
 * // With gradient and custom classes
 * <GlassPanel variant="gradient" className="max-w-4xl mx-auto">
 *   <h2>Hero Section</h2>
 * </GlassPanel>
 * ```
 */
const GlassPanel = React.forwardRef<HTMLDivElement, GlassPanelProps>(
  ({ 
    children, 
    className = '', 
    variant = 'default',
    glowColor = 'none',
    ...props 
  }, ref) => {
    // Variant styles mapping
    const variants = {
      default: 'bg-glass-white backdrop-blur-md',
      strong: 'bg-glass-white-hover backdrop-blur-lg',
      gradient: 'bg-gradient-to-br from-glass-white-hover to-glass-white backdrop-blur-md'
    };

    // Glow effect mapping
    const glows = {
      blue: 'shadow-glow-blue',
      violet: 'shadow-glow-violet',
      cyan: 'shadow-glow-cyan',
      none: ''
    };

    return (
      <div
        ref={ref}
        className={cn(
          // Base styles
          "relative rounded-2xl p-8",
          "border border-glass-border",
          "shadow-2xl",
          
          // Variant-specific background and blur
          variants[variant],
          
          // Glow effect
          glows[glowColor],
          
          // Gradient overlay pseudo-element
          "before:absolute before:inset-0 before:rounded-2xl",
          "before:bg-gradient-to-br before:from-white/5 before:to-transparent",
          "before:pointer-events-none",
          
          // User custom classes (highest priority)
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassPanel.displayName = "GlassPanel";

export { GlassPanel };
export type { GlassPanelProps };
