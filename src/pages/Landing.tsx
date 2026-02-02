import Navigation from '@/components/landing/Navigation';
import Hero from '@/components/landing/Hero';
import Workflow from '@/components/landing/Workflow';
import BentoFeatures from '@/components/landing/BentoFeatures';
import FAQ from '@/components/landing/FAQ';
import Footer from '@/components/landing/Footer';
import ThreeBackground from '@/components/landing/ThreeBackground';

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#020202] overflow-x-hidden">
      {/* Three.js 3D Background */}
      <ThreeBackground />
      
      {/* Smooth Scroll Container */}
      <div className="relative z-10">
        <Navigation />
        <Hero />
        <Workflow />
        <BentoFeatures />
        <FAQ />
        <Footer />
      </div>
    </div>
  );
}
