import { useIsMobile } from '@/hooks/use-mobile';
import { MagneticButton } from '@/components/shared/MagneticButton';
import { Link } from 'react-router-dom';

// React Bits components - install with:
// npx jsrepo add https://reactbits.dev/tailwind/Backgrounds/Hyperspeed
// npx jsrepo add https://reactbits.dev/tailwind/TextAnimations/SplitText
// npx jsrepo add https://reactbits.dev/tailwind/TextAnimations/ShinyText

// Placeholder components until installed
const Hyperspeed = ({ className, particleCount, speed, color, particleSize }: any) => null;
const SplitText = ({ text, className, delay, animationFrom, animationTo, duration }: any) => <h1 className={className}>{text}</h1>;
const ShinyText = ({ text, className, shimmerWidth, speed, shimmerColor }: any) => <h2 className={className}>{text}</h2>;

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
      <div className="absolute inset-0 bg-hero-gradient pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
        {/* Main Headline with SplitText animation */}
        <SplitText 
          text="Transform Ideas Into"
          className="text-5xl md:text-7xl font-black bg-gradient-to-r from-white via-blue-100 to-blue-400 bg-clip-text text-transparent mb-4"
          delay={50}
          animationFrom={{ 
            opacity: 0, 
            y: -20, 
            filter: 'blur(8px)' 
          }}
          animationTo={{ 
            opacity: 1, 
            y: 0, 
            filter: 'blur(0px)' 
          }}
          duration={0.5}
        />
        
        {/* Accent Text with ShinyText */}
        <ShinyText 
          text="Beautiful Diagrams"
          className="text-5xl md:text-7xl font-black text-electric-blue mb-8"
          shimmerWidth={200}
          speed={3}
          shimmerColor="rgba(255, 255, 255, 0.8)"
        />
        
        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
          AI-powered Mermaid diagram creator with real-time preview, 
          stunning animations, and export capabilities
        </p>
        
        {/* CTA Buttons */}
        <div className="flex gap-6 justify-center flex-wrap">
          <MagneticButton variant="primary" asChild>
            <Link to="/editor">Start Creating</Link>
          </MagneticButton>
          
          <MagneticButton variant="outline" asChild>
            <a href="#templates">View Templates</a>
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
