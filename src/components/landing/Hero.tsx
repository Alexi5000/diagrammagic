import { useIsMobile } from '@/hooks/use-mobile';
import { MagneticButton } from '@/components/shared/MagneticButton';
import { Link } from 'react-router-dom';

// React Bits components - install with:
// npx jsrepo add https://reactbits.dev/tailwind/Backgrounds/Hyperspeed
// npx jsrepo add https://reactbits.dev/tailwind/TextAnimations/SplitText
// npx jsrepo add https://reactbits.dev/tailwind/TextAnimations/ShinyText

// Placeholder components until installed
const Hyperspeed = ({ className, particleCount, speed, color, particleSize }: any) => null;
const SplitText = ({ text, className }: any) => <h1 className={className}>{text}</h1>;
const ShinyText = ({ text, className }: any) => <h2 className={className}>{text}</h2>;

export default function Hero() {
  const isMobile = useIsMobile();
  
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Hyperspeed Background */}
      <Hyperspeed 
        className="absolute inset-0 -z-10"
        particleCount={isMobile ? 50 : 100}
        speed={2}
        color="#3B82F6"
        particleSize={2}
      />
      
      {/* Gradient Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(59, 130, 246, 0.15), transparent)'
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
        {/* Main Headline with SplitText animation */}
        <SplitText 
          text="Transform Ideas Into"
          className="text-5xl md:text-7xl font-black bg-gradient-to-r from-white via-blue-100 to-blue-400 bg-clip-text text-transparent mb-4"
        />
        
        {/* Accent Text with ShinyText */}
        <ShinyText 
          text="Beautiful Diagrams"
          className="text-5xl md:text-7xl font-black text-blue-500 mb-8"
        />
        
        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
          AI-powered Mermaid diagram creator with real-time preview, 
          stunning animations, and export capabilities
        </p>
        
        {/* CTA Buttons */}
        <div className="flex gap-6 justify-center flex-wrap">
          <MagneticButton variant="primary" asChild>
            <Link to="/editor">Start Creating Free</Link>
          </MagneticButton>
          
          <MagneticButton variant="outline" asChild>
            <a href="#features">Explore Features</a>
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
