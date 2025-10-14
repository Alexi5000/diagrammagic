import { cn } from '@/lib/utils';
import { GlassPanel } from './GlassPanel';
import { LucideIcon } from 'lucide-react';

// React Bits component - install with:
// npx jsrepo add https://reactbits.dev/tailwind/Animations/FadeContent

// Placeholder component until FadeContent is installed
const FadeContent = ({ children, animation, delay, threshold }: any) => <div>{children}</div>;

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  accentColor: 'blue' | 'violet' | 'cyan';
  index: number;
}

export const FeatureCard = ({
  icon: Icon,
  title,
  description,
  accentColor,
  index
}: FeatureCardProps) => {
  const colors = {
    blue: {
      text: 'text-electric-blue',
      glow: 'blue' as const
    },
    violet: {
      text: 'text-neon-violet',
      glow: 'violet' as const
    },
    cyan: {
      text: 'text-cyber-cyan',
      glow: 'cyan' as const
    }
  };

  return (
    <FadeContent animation="slide" delay={index * 100} threshold={0.2}>
      <GlassPanel 
        glowColor={colors[accentColor].glow}
        className="group hover:scale-105 transition-transform duration-300 cursor-pointer h-full flex flex-col"
      >
        <div className={cn(
          "text-4xl mb-4 group-hover:scale-110 transition-transform",
          colors[accentColor].text
        )}>
          <Icon size={40} />
        </div>
        
        <h3 className="text-2xl font-bold mb-3 text-white">
          {title}
        </h3>
        
        <p className="text-slate-300 leading-relaxed text-lg mb-6">
          {description}
        </p>

        <div className={cn(
          "mt-auto flex items-center font-medium transition-transform",
          "group-hover:translate-x-2",
          colors[accentColor].text
        )}>
          Learn more →
        </div>
      </GlassPanel>
    </FadeContent>
  );
};
