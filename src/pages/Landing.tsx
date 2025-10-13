import { useIsMobile } from '@/hooks/use-mobile';
import Navigation from '@/components/landing/Navigation';
import Hero from '@/components/landing/Hero';
import FeatureShowcase from '@/components/landing/FeatureShowcase';
import StatsSection from '@/components/landing/StatsSection';
import Footer from '@/components/landing/Footer';

// React Bits component - install with: npx jsrepo add https://reactbits.dev/tailwind/Animations/BlobCursor
// Placeholder component until installed
const BlobCursor = ({ color, size }: { color: string; size: number }) => null;

export default function Landing() {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen bg-slate-950 overflow-x-hidden">
      {/* BlobCursor - Desktop Only */}
      {!isMobile && <BlobCursor color="rgba(59, 130, 246, 0.4)" size={60} />}
      
      {/* Background Grid Pattern */}
      <div 
        className="fixed inset-0 -z-10 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}
      />
      
      {/* Smooth Scroll Container */}
      <div className="scroll-smooth">
        <Navigation />
        <Hero />
        <FeatureShowcase />
        <StatsSection />
        <Footer />
      </div>
    </div>
  );
}
