import { Code2, LayoutTemplate, Users, Shield, Zap, Palette } from 'lucide-react';

const features = [
  {
    title: 'Real-time Editor',
    description: 'Write Mermaid syntax with instant preview. See your diagrams come to life as you type.',
    icon: Code2,
    size: 'large' as const,
    code: `graph TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Action]
    B -->|No| D[End]`,
  },
  {
    title: '500+ Templates',
    description: 'Start with professionally designed templates for flowcharts, sequences, ER diagrams, and more.',
    icon: LayoutTemplate,
    size: 'medium' as const,
  },
  {
    title: 'Team Sync',
    description: 'Collaborate in real-time with your team members.',
    icon: Users,
    size: 'small' as const,
    avatars: [
      'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
    ],
  },
  {
    title: 'Enterprise Ready',
    description: 'SOC 2 compliant with advanced security features.',
    icon: Shield,
    size: 'small' as const,
  },
  {
    title: 'Lightning Fast',
    description: 'AI-powered generation in under 2 seconds.',
    icon: Zap,
    size: 'small' as const,
  },
  {
    title: 'Custom Themes',
    description: 'Match your brand with customizable styles.',
    icon: Palette,
    size: 'small' as const,
  },
];

export default function BentoFeatures() {
  return (
    <section className="py-24 px-6 relative">
      {/* Section header */}
      <div className="text-center mb-16 max-w-3xl mx-auto">
        <span className="inline-block px-4 py-1.5 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400 text-sm font-medium mb-4">
          Features
        </span>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Everything You Need to{' '}
          <span className="text-gradient-primary">Create</span>
        </h2>
        <p className="text-lg text-white/60">
          Powerful tools designed to help you create stunning diagrams effortlessly.
        </p>
      </div>

      {/* Bento grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Large card - Real-time Editor */}
        <div className="col-span-2 row-span-2 glass-card rounded-2xl p-8 group">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center">
              <Code2 className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white">{features[0].title}</h3>
          </div>
          <p className="text-white/60 mb-6">{features[0].description}</p>
          
          {/* Code preview */}
          <div className="bg-black/40 rounded-xl p-4 font-mono text-sm overflow-hidden">
            <div className="flex gap-2 mb-3">
              <span className="w-3 h-3 rounded-full bg-red-500/60" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <span className="w-3 h-3 rounded-full bg-green-500/60" />
            </div>
            <pre className="text-green-400/80 whitespace-pre-wrap text-xs">
              {features[0].code}
            </pre>
          </div>
        </div>

        {/* Medium card - Templates */}
        <div className="col-span-2 glass-card rounded-2xl p-6 group">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-fuchsia-500/30 transition-colors">
              <LayoutTemplate className="h-5 w-5 text-fuchsia-400" />
            </div>
            <h3 className="text-lg font-bold text-white">{features[1].title}</h3>
          </div>
          <p className="text-white/60 text-sm">{features[1].description}</p>
        </div>

        {/* Small cards */}
        {features.slice(2).map((feature) => {
          const Icon = feature.icon;
          return (
            <div key={feature.title} className="glass-card rounded-2xl p-6 group">
              <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:border-fuchsia-500/30 transition-colors">
                <Icon className="h-5 w-5 text-fuchsia-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-white/50 text-sm">{feature.description}</p>
              
              {/* Avatar stack for Team Sync */}
              {feature.avatars && (
                <div className="flex -space-x-2 mt-4">
                  {feature.avatars.map((avatar, i) => (
                    <img
                      key={i}
                      src={avatar}
                      alt=""
                      className="w-8 h-8 rounded-full border-2 border-[#020202]"
                    />
                  ))}
                  <div className="w-8 h-8 rounded-full bg-fuchsia-500/20 border-2 border-[#020202] flex items-center justify-center text-xs text-fuchsia-400">
                    +5
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
