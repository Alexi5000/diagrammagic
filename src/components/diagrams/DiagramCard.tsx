import React, { useState, useEffect, useRef } from 'react';
import { formatDistanceToNow } from 'date-fns';
import mermaid from 'mermaid';
import { GlassPanel } from '@/components/shared/GlassPanel';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Diagram, DiagramType } from '@/types';
import { initMermaid } from '@/lib/mermaidConfig';
import { 
  Loader2, 
  FileQuestion, 
  Trash2, 
  Edit3,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DiagramCardProps {
  diagram: Diagram;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  className?: string;
}

// Type badge color mapping using semantic tokens
const typeColors: Record<DiagramType, { 
  bg: string; 
  text: string; 
  border: string;
}> = {
  flowchart: { 
    bg: 'bg-electric-blue/20', 
    text: 'text-electric-blue-light', 
    border: 'border-electric-blue/30' 
  },
  sequence: { 
    bg: 'bg-neon-violet/20', 
    text: 'text-neon-violet-light', 
    border: 'border-neon-violet/30' 
  },
  class: { 
    bg: 'bg-cyber-cyan/20', 
    text: 'text-cyber-cyan-light', 
    border: 'border-cyber-cyan/30' 
  },
  er: { 
    bg: 'bg-green-500/20', 
    text: 'text-green-400', 
    border: 'border-green-500/30' 
  },
  gantt: { 
    bg: 'bg-orange-500/20', 
    text: 'text-orange-400', 
    border: 'border-orange-500/30' 
  },
  pie: { 
    bg: 'bg-pink-500/20', 
    text: 'text-pink-400', 
    border: 'border-pink-500/30' 
  },
  state: { 
    bg: 'bg-indigo-500/20', 
    text: 'text-indigo-400', 
    border: 'border-indigo-500/30' 
  },
  journey: { 
    bg: 'bg-teal-500/20', 
    text: 'text-teal-400', 
    border: 'border-teal-500/30' 
  },
  git: { 
    bg: 'bg-yellow-500/20', 
    text: 'text-yellow-400', 
    border: 'border-yellow-500/30' 
  },
};

export const DiagramCard: React.FC<DiagramCardProps> = ({
  diagram,
  onDelete,
  onEdit,
  className
}) => {
  const [svg, setSvg] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const renderCountRef = useRef<number>(0);

  // Render mini preview on mount
  useEffect(() => {
    const renderPreview = async () => {
      try {
        // Detect theme
        const isDark = document.documentElement.classList.contains('dark');
        initMermaid(isDark);

        // Generate unique ID
        renderCountRef.current += 1;
        const uniqueId = `diagram-preview-${diagram.id}-${renderCountRef.current}`;

        // Render diagram
        const { svg: renderedSvg } = await mermaid.render(uniqueId, diagram.code);
        setSvg(renderedSvg);
        setError(false);
      } catch (err) {
        console.error('Diagram preview render error:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    renderPreview();
  }, [diagram.code, diagram.id]);

  const typeColor = typeColors[diagram.type] || typeColors.flowchart;

  return (
    <GlassPanel 
      glowColor="blue"
      className={cn(
        "group hover:scale-105 transition-all duration-300",
        "flex flex-col overflow-hidden",
        className
      )}
    >
      {/* Mini Preview Section - 150px */}
      <div className="relative h-[150px] w-full bg-slate-900/50 border-b border-white/10 rounded-t-xl overflow-hidden">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-electric-blue" />
          </div>
        )}

        {error && !loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <FileQuestion className="h-12 w-12 text-slate-600" />
          </div>
        )}

        {svg && !loading && (
          <div 
            className="w-full h-full flex items-center justify-center p-2"
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        )}

        {/* Type Badge - Absolute positioned */}
        <div className="absolute top-2 right-2">
          <Badge 
            variant="outline"
            className={cn(
              "capitalize text-xs font-semibold backdrop-blur-md",
              typeColor.bg,
              typeColor.text,
              typeColor.border
            )}
          >
            {diagram.type}
          </Badge>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-1 p-4 space-y-3">
        {/* Title */}
        <h3 className="text-lg font-bold text-white truncate group-hover:text-electric-blue transition-colors">
          {diagram.title}
        </h3>

        {/* Date */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Clock size={14} />
          <span>
            Updated {formatDistanceToNow(new Date(diagram.updatedAt), { addSuffix: true })}
          </span>
        </div>

        {/* Tags */}
        {diagram.tags && diagram.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {diagram.tags.slice(0, 3).map((tag, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="text-xs bg-white/5 text-slate-400 border-white/10"
              >
                {tag}
              </Badge>
            ))}
            {diagram.tags.length > 3 && (
              <Badge 
                variant="secondary" 
                className="text-xs bg-white/5 text-slate-400 border-white/10"
              >
                +{diagram.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 mt-auto pt-2">
          <Button 
            onClick={() => onEdit(diagram.id)}
            className="flex-1 bg-gradient-to-r from-electric-blue to-neon-violet hover:from-electric-blue-dark hover:to-neon-violet-dark text-white font-semibold"
          >
            <Edit3 size={16} className="mr-2" />
            Open
          </Button>
          <Button 
            onClick={() => onDelete(diagram.id)}
            variant="outline"
            className="border-destructive/50 text-destructive hover:bg-destructive hover:text-white"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>
    </GlassPanel>
  );
};
