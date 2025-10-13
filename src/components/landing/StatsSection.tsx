import { FileText, Users, TrendingUp, Zap } from 'lucide-react';

// React Bits component - install with:
// npx jsrepo add https://reactbits.dev/tailwind/Animations/FadeContent

// Placeholder component
const FadeContent = ({ children, animation, delay }: any) => <div className="animate-fade-in">{children}</div>;

const stats = [
  { label: 'Diagrams Created', value: '10,000+', icon: FileText },
  { label: 'Active Users', value: '2,500+', icon: Users },
  { label: 'Export Success', value: '99.9%', icon: TrendingUp },
  { label: 'Avg. Generation Time', value: '<2s', icon: Zap },
];

export default function StatsSection() {
  return (
    <section id="stats" className="py-24 px-6 relative">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-slate-950 -z-10" />
      
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <FadeContent key={stat.label} animation="slide" delay={index * 100}>
              <div className="text-center group">
                <stat.icon className="w-8 h-8 mx-auto mb-4 text-blue-500 group-hover:text-violet-500 transition-colors" />
                <div className="text-4xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-slate-400 text-sm md:text-base">{stat.label}</div>
              </div>
            </FadeContent>
          ))}
        </div>
      </div>
    </section>
  );
}
