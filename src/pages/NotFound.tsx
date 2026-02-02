import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { logger } from '@/lib/logger';
import { GlassPanel } from "@/components/shared/GlassPanel";
import { MagneticButton } from "@/components/shared/MagneticButton";
import { FileQuestion, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    logger.error('❌ 404: Route not found', { path: location.pathname });
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-6">
      {/* Background Grid Pattern */}
      <div 
        className="fixed inset-0 -z-10 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}
      />
      
      <GlassPanel glowColor="blue" className="text-center max-w-2xl animate-scale-in">
        <FileQuestion size={80} className="mx-auto mb-6 text-blue-400" />
        <h1 className="text-6xl font-black text-white mb-4">404</h1>
        <p className="text-2xl text-slate-300 mb-8">
          Oops! This page doesn't exist
        </p>
        <p className="text-slate-400 mb-8">
          The page you're looking for might have been moved or deleted.
        </p>
        <MagneticButton variant="primary" size="lg" asChild>
          <Link to="/">
            <Home size={20} className="mr-2" />
            Return to Home
          </Link>
        </MagneticButton>
      </GlassPanel>
    </div>
  );
};

export default NotFound;
