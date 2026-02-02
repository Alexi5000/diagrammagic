import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Users, Download, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

const stats = [
  { icon: Users, value: '10k+', label: 'Users' },
  { icon: Download, value: '1.2M', label: 'Exports' },
  { icon: Star, value: '4.9/5', label: 'Rating' },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-12">
      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        {/* Live Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fuchsia-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-fuchsia-500"></span>
          </span>
          <span className="text-sm text-fuchsia-400 font-medium">AI Engine V2.0 Live</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-4 leading-tight">
          Transform Ideas Into
        </h1>
        
        {/* Gradient Animated Text */}
        <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8">
          <span className="text-gradient-primary">Beautiful Diagrams</span>
        </h2>
        
        {/* Subtitle */}
        <p className="text-lg md:text-xl text-white/60 mb-12 max-w-2xl mx-auto leading-relaxed">
          AI-powered diagram creation with Mermaid.js. Describe your ideas in plain English 
          and watch them transform into professional diagrams in seconds.
        </p>
        
        {/* CTA Buttons */}
        <div className="flex gap-4 justify-center flex-wrap mb-16">
          <Button 
            asChild
            size="lg"
            className="bg-gradient-to-r from-fuchsia-500 to-purple-600 hover:from-fuchsia-600 hover:to-purple-700 text-white font-semibold px-8 py-6 text-lg shadow-lg shadow-fuchsia-500/30"
          >
            <Link to="/editor">
              <Sparkles className="mr-2 h-5 w-5" />
              Start Creating
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          
          <Button 
            asChild
            variant="outline"
            size="lg"
            className="border-white/20 text-white hover:bg-white/5 px-8 py-6 text-lg"
          >
            <Link to="/templates">View Templates</Link>
          </Button>
        </div>

        {/* Stats Mini-Bar */}
        <div className="inline-flex items-center gap-8 md:gap-12 px-8 py-4 rounded-2xl glass-card">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="flex items-center gap-3">
                <Icon className="h-5 w-5 text-fuchsia-400" />
                <div className="text-left">
                  <p className="text-xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-white/50">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
