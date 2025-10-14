import { useEffect, useRef, useState } from 'react';
import { FileText, Package, Download, Users } from 'lucide-react';
import { GlassPanel } from '@/components/shared/GlassPanel';

interface StatData {
  label: string;
  value: number;
  suffix: string;
  icon: typeof FileText;
  accentColor: 'blue' | 'violet' | 'cyan';
}

const stats: StatData[] = [
  { label: 'Diagrams Created', value: 10000, suffix: '+', icon: FileText, accentColor: 'blue' },
  { label: 'Templates', value: 50, suffix: '+', icon: Package, accentColor: 'violet' },
  { label: 'Exports', value: 25000, suffix: '+', icon: Download, accentColor: 'cyan' },
  { label: 'Happy Users', value: 5000, suffix: '+', icon: Users, accentColor: 'blue' },
];

const useCountUp = (end: number, duration: number = 2000, isVisible: boolean) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!isVisible || hasAnimated) return;

    setHasAnimated(true);
    const startTime = Date.now();
    const startValue = 0;

    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(startValue + (end - startValue) * easeOutQuart);
      
      setCount(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, end, duration, hasAnimated]);

  return count;
};

const StatCard = ({ stat, index }: { stat: StatData; index: number }) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const count = useCountUp(stat.value, 2000, isVisible);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const gradients = {
    blue: 'from-electric-blue to-cyan-400',
    violet: 'from-neon-violet to-pink-400',
    cyan: 'from-cyber-cyan to-blue-400',
  };

  return (
    <div 
      ref={cardRef}
      className="animate-fade-in"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <GlassPanel variant="gradient" glowColor={stat.accentColor} className="text-center group hover:scale-105 transition-all duration-300">
        <stat.icon className="w-10 h-10 mx-auto mb-4 text-slate-400 group-hover:text-white transition-colors" />
        <div className={`text-5xl font-black mb-2 bg-gradient-to-r ${gradients[stat.accentColor]} bg-clip-text text-transparent`}>
          {count.toLocaleString()}{stat.suffix}
        </div>
        <div className="text-slate-400 text-sm md:text-base font-medium uppercase tracking-wide">
          {stat.label}
        </div>
      </GlassPanel>
    </div>
  );
};

export default function StatsSection() {
  return (
    <section id="stats" className="py-24 px-6 relative" aria-labelledby="stats-heading">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-slate-950 -z-10" />
      
      <div className="max-w-6xl mx-auto">
        <h2 id="stats-heading" className="sr-only">Statistics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <StatCard key={stat.label} stat={stat} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
