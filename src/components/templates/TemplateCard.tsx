import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import mermaid from 'mermaid';
import { GlassPanel } from '@/components/shared/GlassPanel';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Template } from '@/types';
import { initMermaid } from '@/lib/mermaidConfig';
import { Loader2, FileQuestion } from 'lucide-react';
import { cn } from '@/lib/utils';
import { logger } from '@/lib/logger';

interface TemplateCardProps {
  template: Template;
  className?: string;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({ template, className }) => {
  const navigate = useNavigate();
  const [svg, setSvg] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const renderCountRef = useRef<number>(0);

  // Category color mapping using semantic tokens
  const categoryColors = {
    business: { 
      bg: 'bg-electric-blue/20', 
      text: 'text-electric-blue-light', 
      border: 'border-electric-blue/30' 
    },
    technical: { 
      bg: 'bg-neon-violet/20', 
      text: 'text-neon-violet-light', 
      border: 'border-neon-violet/30' 
    },
    education: { 
      bg: 'bg-cyber-cyan/20', 
      text: 'text-cyber-cyan-light', 
      border: 'border-cyber-cyan/30' 
    }
  };

  // Render mini preview on mount
  useEffect(() => {
    const renderPreview = async () => {
      try {
        // Detect theme from document
        const isDark = document.documentElement.classList.contains('dark');
        initMermaid(isDark);

        // Generate unique ID
        renderCountRef.current += 1;
        const uniqueId = `template-preview-${template.id}-${renderCountRef.current}`;

        // Render diagram
        const { svg: renderedSvg } = await mermaid.render(uniqueId, template.code);
        setSvg(renderedSvg);
        setError(false);
      } catch (err) {
        logger.error('❌ TemplateCard: Preview render failed', { templateId: template.id, error: err });
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    renderPreview();
  }, [template.code, template.id]);

  const handleUseTemplate = () => {
    logger.info('🎨 TemplateCard: User clicked "Use Template"', {
      templateId: template.id,
      templateName: template.name,
      category: template.category,
      targetUrl: `/editor?template=${template.id}`
    });
    
    navigate(`/editor?template=${template.id}`);
  };

  return (
    <GlassPanel 
      glowColor="blue"
      className={cn(
        "group hover:scale-105 transition-all duration-300 cursor-pointer",
        "flex flex-col overflow-hidden h-full",
        className
      )}
    >
      {/* Mini Preview Section - 150px */}
      <div className="relative h-[150px] w-full bg-muted/50 border-b border-border rounded-t-xl overflow-hidden">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}

        {error && !loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50">
            <FileQuestion className="h-12 w-12 text-muted-foreground/50" />
          </div>
        )}

        {svg && !loading && (
          <div 
            className="w-full h-full flex items-center justify-center p-2 overflow-hidden"
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        )}

        {/* Category Badge - Absolute positioned */}
        <div className="absolute top-2 right-2">
          <Badge 
            variant="outline"
            className={cn(
              "capitalize text-xs font-semibold backdrop-blur-md",
              categoryColors[template.category].bg,
              categoryColors[template.category].text,
              categoryColors[template.category].border
            )}
          >
            {template.category}
          </Badge>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-1 p-4 space-y-3">
        {/* Title */}
        <h3 className="text-lg font-bold text-foreground truncate group-hover:text-primary transition-colors">
          {template.name}
        </h3>

        {/* Description - 2 line clamp */}
        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 flex-1">
          {template.description}
        </p>

        {/* Use Template Button */}
        <Button 
          onClick={handleUseTemplate}
          className="w-full bg-btn-primary hover:shadow-glow-blue text-white font-semibold transition-all"
        >
          Use Template
        </Button>
      </div>
    </GlassPanel>
  );
};
