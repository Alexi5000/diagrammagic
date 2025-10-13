import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { ReactNode, forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';

// React Bits component - install with:
// npx jsrepo add https://reactbits.dev/tailwind/Animations/Magnet

// Placeholder component until Magnet is installed
const Magnet = ({ children, strength, radius }: any) => <>{children}</>;

const magneticButtonVariants = cva(
  "inline-flex items-center justify-center font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-gradient-to-r from-blue-500 to-violet-600 hover:from-blue-600 hover:to-violet-700 shadow-lg shadow-blue-500/50 hover:shadow-blue-500/80 text-white",
        secondary: "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/80 text-white",
        outline: "border-2 border-blue-500 hover:bg-blue-500/10 bg-transparent text-white"
      },
      size: {
        sm: "px-6 py-2 text-sm rounded-lg",
        md: "px-8 py-4 text-base rounded-xl",
        lg: "px-10 py-5 text-lg rounded-xl"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "md"
    }
  }
);

interface MagneticButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof magneticButtonVariants> {
  children: ReactNode;
  magnetStrength?: number;
  asChild?: boolean;
}

export const MagneticButton = forwardRef<HTMLButtonElement, MagneticButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      magnetStrength = 20,
      className,
      asChild = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Magnet strength={magnetStrength} radius={100}>
        <Comp
          ref={ref}
          className={cn(magneticButtonVariants({ variant, size }), className)}
          {...props}
        >
          {children}
        </Comp>
      </Magnet>
    );
  }
);

MagneticButton.displayName = 'MagneticButton';
