import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AuthForm from '@/components/auth/AuthForm';
import { Boxes, ArrowLeft } from 'lucide-react';

export default function Auth() {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  // Redirect if already logged in
  useEffect(() => {
    if (user && !isLoading) {
      navigate('/');
    }
  }, [user, isLoading, navigate]);

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
  };

  return (
    <div className="min-h-screen bg-[#020202] flex flex-col">
      {/* Background effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/5 via-transparent to-purple-500/5" />
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Header */}
      <header className="p-6">
        <Link 
          to="/"
          className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to home</span>
        </Link>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center">
                <Boxes className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">DiagramMagic</span>
            </Link>
            <h1 className="text-3xl font-bold text-white mb-2">
              {mode === 'login' ? 'Welcome back' : 'Create your account'}
            </h1>
            <p className="text-white/60">
              {mode === 'login' 
                ? 'Sign in to access your saved diagrams'
                : 'Start creating beautiful diagrams with AI'
              }
            </p>
          </div>

          {/* Auth form card */}
          <div className="glass-card rounded-2xl p-8">
            <AuthForm mode={mode} onToggleMode={toggleMode} />
          </div>

          {/* Terms */}
          <p className="text-center text-sm text-white/40 mt-6">
            By continuing, you agree to our{' '}
            <a href="#" className="text-fuchsia-400 hover:text-fuchsia-300">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-fuchsia-400 hover:text-fuchsia-300">Privacy Policy</a>
          </p>
        </div>
      </main>
    </div>
  );
}
