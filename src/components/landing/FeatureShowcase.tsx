import { Sparkles, Eye, Download, Zap, Shield, Code } from 'lucide-react';
import { FeatureCard } from '@/components/shared/FeatureCard';
import { Stack } from '@/components/react-bits/Stack';

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

export default function FeatureShowcase() {
  const stackItems = features.slice(0, 3).map((feature, index) => ({
    id: feature.id,
    content: <FeatureCard key={feature.id} {...feature} index={index} />
  }));

  return (
    <section id="features" className="py-24 px-6" aria-labelledby="features-heading">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 id="features-heading" className="text-4xl md:text-5xl font-bold text-white mb-6">
            Everything You Need to Create{' '}
            <span className="bg-gradient-to-r from-electric-blue to-neon-violet bg-clip-text text-transparent">
              Amazing Diagrams
            </span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Professional diagram creation tools powered by AI, 
            with a beautiful interface that makes you want to create
          </p>
        </div>

        {/* Stack Component - First 3 Features */}
        <div className="mb-16" aria-label="Featured capabilities">
          <Stack 
            items={stackItems}
            offset={25}
            scaleFactor={0.05}
            className="max-w-4xl mx-auto"
          />
        </div>

        {/* Grid - Remaining Features */}
        <div 
          className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          aria-label="Additional features"
        >
          {features.slice(3).map((feature, index) => (
            <FeatureCard key={feature.id} {...feature} index={index + 3} />
          ))}
        </div>
      </div>
    </section>
  );
}
