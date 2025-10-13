import { Home, FileText, BookOpen, Github } from 'lucide-react';
import { Link } from 'react-router-dom';

// React Bits component - install with:
// npx jsrepo add https://reactbits.dev/tailwind/Components/Dock

// Placeholder component
const Dock = ({ items, className }: any) => (
  <div className={`${className} flex gap-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-3 shadow-2xl`}>
    {items.map((item: any, index: number) => (
      <a
        key={index}
        href={item.href}
        title={item.label}
        className="text-white hover:text-blue-400 transition-colors p-2 hover:scale-110 transform transition-transform"
      >
        {item.icon}
      </a>
    ))}
  </div>
);

const dockItems = [
  { icon: <Home size={24} />, label: 'Home', href: '/' },
  { icon: <FileText size={24} />, label: 'Editor', href: '/editor' },
  { icon: <BookOpen size={24} />, label: 'Docs', href: '#features' },
  { icon: <Github size={24} />, label: 'GitHub', href: 'https://github.com' },
];

export default function Footer() {
  return (
    <footer className="relative py-16 px-6 border-t border-slate-800">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
                <span className="text-white font-bold text-xl">AI</span>
              </div>
              <span className="text-xl font-bold text-white">Diagram Creator</span>
            </div>
            <p className="text-slate-400 max-w-md">
              Transform your ideas into beautiful diagrams with AI-powered Mermaid syntax generation.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li><a href="#features" className="text-slate-400 hover:text-white transition-colors">Features</a></li>
              <li><Link to="/editor" className="text-slate-400 hover:text-white transition-colors">Editor</Link></li>
              <li><a href="#stats" className="text-slate-400 hover:text-white transition-colors">Stats</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><a href="https://mermaid.js.org" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">Mermaid Docs</a></li>
              <li><a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">GitHub</a></li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-slate-800 pt-8 text-center text-slate-400">
          <p>&copy; {new Date().getFullYear()} AI Diagram Creator. Built with React and Mermaid.js</p>
        </div>
      </div>
      
      {/* Dock Navigation - Fixed Bottom */}
      <Dock 
        items={dockItems}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 hidden md:flex"
      />
    </footer>
  );
}
