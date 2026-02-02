import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'What diagram types does DiagramMagic support?',
    answer: 'DiagramMagic supports all Mermaid.js diagram types including flowcharts, sequence diagrams, class diagrams, state diagrams, entity-relationship diagrams, Gantt charts, pie charts, and more.',
  },
  {
    question: 'How does the AI generation work?',
    answer: 'Simply describe your diagram in plain English, and our AI engine will parse your description using advanced NLP to generate the appropriate Mermaid syntax. You can then refine and customize the output.',
  },
  {
    question: 'Can I use my own API key?',
    answer: 'Yes! You can bring your own OpenAI API key for AI generation. Your API key is stored locally in your browser and never sent to our servers.',
  },
  {
    question: 'Are my diagrams stored securely?',
    answer: 'Diagrams are stored in your account with enterprise-grade encryption. Guest users can also save diagrams locally in their browser storage.',
  },
  {
    question: 'What export formats are available?',
    answer: 'You can export diagrams as SVG (vector), PNG (raster), or copy the Mermaid code directly. SVG exports are perfect for presentations and documentation.',
  },
  {
    question: 'Is there a free tier?',
    answer: 'Yes! DiagramMagic offers a generous free tier with access to all diagram types, local storage, and limited AI generations per month.',
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
