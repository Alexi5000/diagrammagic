import { Boxes, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const footerLinks = {
  product: [
    { label: 'Templates', href: '/templates' },
    { label: 'Editor', href: '/editor' },
    { label: 'My Diagrams', href: '/my-diagrams' },
  ],
  resources: [
    { label: 'Mermaid Docs', href: 'https://mermaid.js.org', external: true },
    { label: 'GitHub', href: 'https://github.com', external: true },
  ],
  legal: [
    { label: 'Privacy', href: '#' },
    { label: 'Terms', href: '#' },
  ],
};

export default function Footer() {
  return (
    <footer className="relative py-24 px-6">
      {/* CTA Section */}
      <div className="max-w-4xl mx-auto text-center mb-20">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Ready to Create{' '}
          <span className="text-gradient-primary">Amazing Diagrams</span>?
        </h2>
        <p className="text-lg text-white/60 mb-8 max-w-2xl mx-auto">
          Join thousands of developers, designers, and teams who use DiagramMagic 
          to create stunning diagrams effortlessly.
        </p>
        <Button 
          asChild
          size="lg"
          className="bg-gradient-to-r from-fuchsia-500 to-purple-600 hover:from-fuchsia-600 hover:to-purple-700 text-white font-semibold px-8 py-6 text-lg shadow-lg shadow-fuchsia-500/30"
        >
          <Link to="/editor">
            Start Creating Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>

      {/* Links Grid */}
      <div className="max-w-6xl mx-auto border-t border-white/10 pt-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center">
                <Boxes className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">DiagramMagic</span>
            </Link>
            <p className="text-sm text-white/50">
              AI-powered diagram creation made simple.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-sm text-white/50 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-white/50 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-white/50 hover:text-white transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 pt-8 text-center">
          <p className="text-sm text-white/40">
            &copy; {new Date().getFullYear()} DiagramMagic. Built with React and Mermaid.js
          </p>
        </div>
      </div>
    </footer>
  );
}
