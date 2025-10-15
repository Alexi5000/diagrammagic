import React, { Component, ReactNode } from 'react';
import { GlassPanel } from './GlassPanel';
import { AlertCircle, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary Component
 * 
 * Catches React errors in the component tree and displays a fallback UI.
 * Prevents the entire app from crashing due to unhandled errors.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
          {/* Background Grid Pattern */}
          <div
            className="fixed inset-0 -z-10 opacity-20 pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
              backgroundSize: '50px 50px',
            }}
          />

          <GlassPanel glowColor="blue" className="max-w-2xl text-center animate-scale-in">
            <AlertCircle size={64} className="mx-auto mb-6 text-red-400" />
            <h1 className="text-4xl font-bold text-white mb-4">Something went wrong</h1>
            <p className="text-lg text-slate-300 mb-6">
              We encountered an unexpected error. Don't worry, your data is safe.
            </p>
            
            {this.state.error && (
              <details className="mb-6 text-left">
                <summary className="text-sm text-slate-400 cursor-pointer hover:text-slate-300 mb-2">
                  Error details (for developers)
                </summary>
                <pre className="text-xs bg-slate-900/50 p-4 rounded-lg overflow-auto text-red-400 max-h-48">
                  {this.state.error.toString()}
                  {this.state.error.stack && `\n\n${this.state.error.stack}`}
                </pre>
              </details>
            )}

            <Button
              onClick={this.handleReset}
              className="bg-gradient-to-r from-blue-500 to-violet-600 hover:from-blue-600 hover:to-violet-700 text-white font-semibold"
            >
              <Home size={20} className="mr-2" />
              Return to Home
            </Button>
          </GlassPanel>
        </div>
      );
    }

    return this.props.children;
  }
}
