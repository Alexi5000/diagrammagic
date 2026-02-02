import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Menu, X, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      scrolled 
        ? "glass-nav" 
        : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img 
              src="/favicon.png" 
              alt="DiagramMagic Logo" 
              className="w-10 h-10 rounded-xl shadow-lg shadow-fuchsia-500/30 group-hover:shadow-fuchsia-500/50 transition-shadow"
            />
            <span className="text-xl font-bold text-white">DiagramMagic</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/templates" className="text-white/70 hover:text-white transition-colors">
              Templates
            </Link>
            <Link to="/my-diagrams" className="text-white/70 hover:text-white transition-colors">
              My Diagrams
            </Link>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/5">
                    <User className="h-4 w-4 mr-2" />
                    Account
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-[#0a0a0a] border-white/10">
                  <DropdownMenuItem className="text-white/70">
                    {user.email}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-400 cursor-pointer">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth" className="text-white/70 hover:text-white transition-colors">
                Sign In
              </Link>
            )}
            
            <Button 
              asChild
              className="bg-gradient-to-r from-fuchsia-500 to-purple-600 hover:from-fuchsia-600 hover:to-purple-700 text-white font-medium shadow-lg shadow-fuchsia-500/30"
            >
              <Link to="/editor">Start Creating</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4 animate-fade-in">
            <Link to="/templates" className="block text-white/70 hover:text-white transition-colors" onClick={() => setMobileOpen(false)}>
              Templates
            </Link>
            <Link to="/my-diagrams" className="block text-white/70 hover:text-white transition-colors" onClick={() => setMobileOpen(false)}>
              My Diagrams
            </Link>
            {user ? (
              <>
                <p className="text-sm text-white/50">{user.email}</p>
                <button onClick={handleSignOut} className="block text-red-400 hover:text-red-300 transition-colors">
                  Sign out
                </button>
              </>
            ) : (
              <Link to="/auth" className="block text-white/70 hover:text-white transition-colors" onClick={() => setMobileOpen(false)}>
                Sign In
              </Link>
            )}
            <Button 
              asChild
              className="w-full bg-gradient-to-r from-fuchsia-500 to-purple-600 hover:from-fuchsia-600 hover:to-purple-700 text-white font-medium"
              onClick={() => setMobileOpen(false)}
            >
              <Link to="/editor">Start Creating</Link>
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}
