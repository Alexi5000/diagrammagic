import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, ReactNode } from 'react';

// React Bits component - install with:
// npx jsrepo add https://reactbits.dev/tailwind/Animations/Magnet

// Placeholder component until Magnet is installed
const Magnet = ({ children, strength, radius }: any) => <>{children}</>;

interface MagneticButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  magnetStrength?: number;
  asChild?: boolean;
}

export const MagneticButton = ({
  children,
  variant = 'primary',
  magnetStrength = 20,
  className,
  asChild,
  ...props
}: MagneticButtonProps) => {
  const variants = {
    primary: 'bg-gradient-to-r from-blue-500 to-violet-600 hover:from-blue-600 hover:to-violet-700 shadow-lg shadow-blue-500/50 hover:shadow-blue-500/80',
    secondary: 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/80',
    outline: 'border-2 border-blue-500 hover:bg-blue-500/10 text-white'
  };

  const buttonClasses = cn(
    "px-8 py-4 rounded-xl font-semibold transition-all duration-300 text-white inline-block",
    variants[variant],
    className
  );

  if (asChild) {
    return (
      <Magnet strength={magnetStrength} radius={100}>
        <div className={buttonClasses}>
          {children}
        </div>
      </Magnet>
    );
  }

  return (
    <Magnet strength={magnetStrength} radius={100}>
      <button
        className={buttonClasses}
        {...props}
      >
        {children}
      </button>
    </Magnet>
  );
};
