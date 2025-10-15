import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      scrolled 
        ? "bg-white/5 backdrop-blur-xl border-b border-white/10 shadow-2xl" 
        : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/50 group-hover:shadow-blue-500/80 transition-shadow">
              <span className="text-white font-bold text-xl">AI</span>
            </div>
            <span className="text-xl font-bold text-white">Diagram Creator</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-slate-300 hover:text-white transition-colors">
              Features
            </a>
            <a href="#stats" className="text-slate-300 hover:text-white transition-colors">
              Stats
            </a>
            <Link to="/editor" className="text-slate-300 hover:text-white transition-colors">
              Editor
            </Link>
            <Link to="/my-diagrams" className="text-slate-300 hover:text-white transition-colors">
              My Diagrams
            </Link>
            <Button 
              asChild
              className="bg-gradient-to-r from-blue-500 to-violet-600 hover:from-blue-600 hover:to-violet-700 text-white font-medium shadow-lg shadow-blue-500/50"
            >
              <Link to="/editor">Get Started</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4 animate-fade-in">
            <a href="#features" className="block text-slate-300 hover:text-white transition-colors" onClick={() => setMobileOpen(false)}>
              Features
            </a>
            <a href="#stats" className="block text-slate-300 hover:text-white transition-colors" onClick={() => setMobileOpen(false)}>
              Stats
            </a>
            <Link to="/editor" className="block text-slate-300 hover:text-white transition-colors" onClick={() => setMobileOpen(false)}>
              Editor
            </Link>
            <Link to="/my-diagrams" className="block text-slate-300 hover:text-white transition-colors" onClick={() => setMobileOpen(false)}>
              My Diagrams
            </Link>
            <Button 
              asChild
              className="w-full bg-gradient-to-r from-blue-500 to-violet-600 hover:from-blue-600 hover:to-violet-700 text-white font-medium"
            >
              <Link to="/editor">Get Started</Link>
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}
