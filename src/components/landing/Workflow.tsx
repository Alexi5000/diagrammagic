import { Keyboard, Wand2, Share2 } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Describe It',
    description: 'Simply describe your diagram in plain English. Our NLP engine understands complex relationships and structures.',
    icon: Keyboard,
    features: ['Natural language input', 'Context-aware parsing', 'Multi-language support'],
  },
  {
    number: '02',
    title: 'AI Generation',
    description: 'Watch as our AI transforms your description into a beautiful, accurate diagram in seconds.',
    icon: Wand2,
    features: ['Real-time preview', 'Smart suggestions', 'Auto-optimization'],
    highlighted: true,
  },
  {
    number: '03',
    title: 'Export & Share',
    description: 'Export your diagrams in multiple formats and share them with your team instantly.',
    icon: Share2,
    features: ['SVG, PNG, PDF', 'Direct link sharing', 'Team collaboration'],
  },
];

export default function Workflow() {
  return (
    <section className="py-24 px-6 relative">
      {/* Section header */}
      <div className="text-center mb-16 max-w-3xl mx-auto">
        <span className="inline-block px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium mb-4">
          How It Works
        </span>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Workflow{' '}
          <span className="text-gradient-primary">Reimagined</span>
        </h2>
        <p className="text-lg text-white/60">
          Create professional diagrams in three simple steps. No design skills required.
        </p>
      </div>

      {/* Steps grid */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.number}
              className={`glass-card rounded-2xl p-8 relative group ${
                step.highlighted 
                  ? 'border-fuchsia-500/30 bg-fuchsia-500/5' 
                  : ''
              }`}
            >
              {/* Step number */}
              <span className="text-6xl font-bold text-white/5 absolute top-6 right-6 group-hover:text-white/10 transition-colors">
                {step.number}
              </span>

              {/* Icon */}
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${
                step.highlighted
                  ? 'bg-gradient-to-br from-fuchsia-500 to-purple-600'
                  : 'bg-white/5 border border-white/10'
              }`}>
                <Icon className={`h-7 w-7 ${step.highlighted ? 'text-white' : 'text-fuchsia-400'}`} />
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold text-white mb-3">{step.title}</h3>
              <p className="text-white/60 mb-6 leading-relaxed">{step.description}</p>

              {/* Features */}
              <ul className="space-y-2">
                {step.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-white/50">
                    <span className="w-1 h-1 rounded-full bg-fuchsia-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
