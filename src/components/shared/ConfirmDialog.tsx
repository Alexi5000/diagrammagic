import * as React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogOverlay,
  AlertDialogPortal,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

/**
 * Props for the ConfirmDialog component
 */
interface ConfirmDialogProps {
  /** Controls dialog visibility */
  open: boolean;
  
  /** Callback when dialog open state changes */
  onOpenChange: (open: boolean) => void;
  
  /** Dialog title */
  title: string;
  
  /** Dialog description/message */
  description: string;
  
  /** Label for confirm button (default: "Confirm") */
  confirmLabel?: string;
  
  /** Label for cancel button (default: "Cancel") */
  cancelLabel?: string;
  
  /** Callback when user confirms */
  onConfirm: () => void;
  
  /** Visual variant of the dialog */
  variant?: 'danger' | 'default';
  
  /** Whether to show loading state on confirm button */
  loading?: boolean;
  
  /** Additional CSS classes for content container */
  className?: string;
}

/**
 * ConfirmDialog - A reusable confirmation dialog with glass-morphism styling
 * 
 * Wraps shadcn's AlertDialog with premium glass-morphism design and support
 * for danger/default variants. Provides a consistent confirmation experience.
 * 
 * @example
 * ```tsx
 * // Default confirmation
 * <ConfirmDialog
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 *   title="Save Changes?"
 *   description="Do you want to save your changes before leaving?"
 *   onConfirm={handleSave}
 * />
 * 
 * // Danger confirmation
 * <ConfirmDialog
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 *   title="Delete Diagram?"
 *   description="This action cannot be undone. This will permanently delete your diagram."
 *   confirmLabel="Delete"
 *   variant="danger"
 *   onConfirm={handleDelete}
 * />
 * ```
 */
export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  variant = 'default',
  loading = false,
  className,
}) => {
  const handleConfirm = () => {
    if (!loading) {
      onConfirm();
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogPortal>
        {/* Custom glass-morphism overlay */}
        <AlertDialogOverlay 
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out"
        />
        
        {/* Glass-morphism content */}
        <AlertDialogContent
          className={cn(
            // Remove default shadcn background
            "bg-transparent border-0 shadow-none",
            
            // Glass-morphism base
            "bg-gradient-to-br from-glass-white-hover to-glass-white",
            "backdrop-blur-lg",
            "border border-glass-border-strong",
            "rounded-2xl",
            "shadow-glass-lg",
            
            // Gradient overlay pseudo-element
            "relative",
            "before:absolute before:inset-0 before:rounded-2xl",
            "before:bg-gradient-to-br before:from-white/5 before:to-transparent",
            "before:pointer-events-none before:-z-10",
            
            // Animation
            "data-[state=open]:animate-scale-in",
            
            // Responsive
            "max-w-md",
            
            className
          )}
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-bold text-white">
              {title}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base text-slate-300 leading-relaxed">
              {description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <AlertDialogFooter className="mt-6">
            <AlertDialogCancel
              className={cn(
                "border-2 border-glass-border",
                "bg-transparent hover:bg-glass-white",
                "text-slate-300 hover:text-white",
                "rounded-xl px-6 py-2.5",
                "transition-all duration-300",
                "hover:border-glass-border-strong",
                "mt-0", // Override shadcn's mt-2
              )}
              disabled={loading}
            >
              {cancelLabel}
            </AlertDialogCancel>
            
            <AlertDialogAction
              onClick={handleConfirm}
              disabled={loading}
              className={cn(
                "rounded-xl px-6 py-2.5 font-semibold",
                "transition-all duration-300",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "disabled:hover:scale-100",
                
                // Variant-specific styling
                variant === 'danger' 
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : cn(
                      "bg-electric-blue hover:bg-electric-blue-dark text-white",
                      "hover:shadow-glow-blue hover:scale-[1.02]"
                    )
              )}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Processing...</span>
                </span>
              ) : (
                confirmLabel
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogPortal>
    </AlertDialog>
  );
};

export type { ConfirmDialogProps };
