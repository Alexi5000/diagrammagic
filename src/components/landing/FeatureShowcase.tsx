import { Sparkles, Eye, Download, Zap, Shield, Code } from 'lucide-react';
import { GlassPanel } from '@/components/shared/GlassPanel';

// React Bits components - install with:
// npx jsrepo add https://reactbits.dev/tailwind/Components/Stack
// npx jsrepo add https://reactbits.dev/tailwind/Animations/FadeContent

// Placeholder components
const Stack = ({ items, className }: any) => (
  <div className={className}>
    {items.map((item: any) => (
      <div key={item.id} className="mb-8">{item.content}</div>
    ))}
  </div>
);
const FadeContent = ({ children, animation, delay }: any) => <div className="animate-fade-in">{children}</div>;

const features = [
  {
    id: 1,
    icon: Sparkles,
    title: 'AI-Powered Generation',
    description: 'Describe your diagram in plain English and watch AI transform it into perfect Mermaid syntax',
    accentColor: 'blue' as const
  },
  {
    id: 2,
    icon: Eye,
    title: 'Real-Time Preview',
    description: 'See your diagrams update instantly as you type, with beautiful theme-aware rendering',
    accentColor: 'violet' as const
  },
  {
    id: 3,
    icon: Download,
    title: 'One-Click Export',
    description: 'Export diagrams as high-quality SVG files ready for documentation and presentations',
    accentColor: 'cyan' as const
  },
  {
    id: 4,
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Built on Vite and React for instant hot-reload and blazing-fast performance',
    accentColor: 'blue' as const
  },
  {
    id: 5,
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your diagrams and API keys stay local. No data sent to our servers',
    accentColor: 'violet' as const
  },
  {
    id: 6,
    icon: Code,
    title: 'Code-First or AI-First',
    description: 'Switch seamlessly between manual Mermaid editing and AI-powered generation',
    accentColor: 'cyan' as const
  }
];

const FeatureCard = ({ icon: Icon, title, description, accentColor }: typeof features[0]) => {
  const colors = {
    blue: 'text-blue-500',
    violet: 'text-violet-500',
    cyan: 'text-cyan-500'
  };

  return (
    <GlassPanel className="group hover:scale-105 transition-transform duration-300 cursor-pointer h-full">
      <div className={`text-4xl mb-4 group-hover:scale-110 transition-transform ${colors[accentColor]}`}>
        <Icon size={40} />
      </div>
      
      <h3 className="text-2xl font-bold mb-3 text-white">
        {title}
      </h3>
      
      <p className="text-slate-300 leading-relaxed text-lg">
        {description}
      </p>
    </GlassPanel>
  );
};

export default function FeatureShowcase() {
  const stackItems = features.slice(0, 3).map(feature => ({
    id: feature.id,
    content: <FeatureCard key={feature.id} {...feature} />
  }));

  return (
    <section id="features" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Everything You Need to Create{' '}
            <span className="bg-gradient-to-r from-blue-500 to-violet-600 bg-clip-text text-transparent">
              Amazing Diagrams
            </span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Professional diagram creation tools powered by AI, 
            with a beautiful interface that makes you want to create
          </p>
        </div>

        {/* Stack Component - First 3 Features */}
        <div className="mb-16">
          <Stack 
            items={stackItems}
            className="max-w-4xl mx-auto space-y-8"
          />
        </div>

        {/* Grid - Remaining Features */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.slice(3).map((feature) => (
            <FadeContent key={feature.id} animation="slide" delay={feature.id * 100}>
              <FeatureCard {...feature} />
            </FadeContent>
          ))}
        </div>
      </div>
    </section>
  );
}
