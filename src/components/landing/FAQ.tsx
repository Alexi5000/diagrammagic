import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'What diagram types does DiagramMagic support?',
    answer: 'DiagramMagic supports all Mermaid.js diagram types including flowcharts, sequence diagrams, class diagrams, state diagrams, entity-relationship diagrams, Gantt charts, pie charts, and more.',
  },
  {
    question: 'How does the AI generation work?',
    answer: 'Guest sessions use a simulated generator for demonstration. Signed-in generation uses a backend service when configured. Review and edit the Mermaid source before relying on the result.',
  },
  {
    question: 'Do I need an API key to try the editor?',
    answer: 'No key is needed for the guest demonstration or editing Mermaid source. Signed-in generation depends on the configured backend service.',
  },
  {
    question: 'Are my diagrams stored securely?',
    answer: 'Review the storage options in the editor before saving sensitive information. This site does not claim a security certification.',
  },
  {
    question: 'What export formats are available?',
    answer: 'The editor exports SVG files. You can also copy the Mermaid source for use in your own documents.',
  },
  {
    question: 'Is there a free tier?',
    answer: 'You can open the editor and templates without purchasing a plan. Guest generation is a simulation, not a live AI service.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 px-6 relative" id="faq">
      {/* Section header */}
      <div className="text-center mb-16 max-w-3xl mx-auto">
        <span className="inline-block px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium mb-4">
          FAQ
        </span>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Frequently Asked{' '}
          <span className="text-gradient-primary">Questions</span>
        </h2>
        <p className="text-lg text-white/60">
          Everything you need to know about DiagramMagic.
        </p>
      </div>

      {/* FAQ list */}
      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="glass-card rounded-xl overflow-hidden"
          >
            <button
              onClick={() => toggleFaq(index)}
              className="w-full flex items-center justify-between p-6 text-left"
            >
              <span className="text-lg font-medium text-white pr-8">{faq.question}</span>
              <ChevronDown 
                className={`h-5 w-5 text-fuchsia-400 flex-shrink-0 transition-transform duration-300 ${
                  openIndex === index ? 'rotate-180' : ''
                }`} 
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                openIndex === index ? 'max-h-96' : 'max-h-0'
              }`}
            >
              <p className="px-6 pb-6 text-white/60 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
