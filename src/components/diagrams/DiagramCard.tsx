import React, { useState, useEffect, useRef } from 'react';
import { formatDistanceToNow } from 'date-fns';
import mermaid from 'mermaid';
import { GlassPanel } from '@/components/shared/GlassPanel';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Diagram, DiagramType } from '@/types';
import { initMermaid } from '@/lib/mermaidConfig';
import { exportDiagramAsSVG } from '@/lib/exportSVG';
import { 
  Loader2, 
  FileQuestion, 
  Trash2, 
  Edit3,
  Clock,
  Download
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DiagramCardProps {
  diagram: Diagram;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onTitleUpdate?: (id: string, newTitle: string) => void;
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
  onTitleUpdate,
  className
}) => {
  const [svg, setSvg] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);
  const [editedTitle, setEditedTitle] = useState<string>(diagram.title);
  const renderCountRef = useRef<number>(0);
  const titleInputRef = useRef<HTMLInputElement>(null);

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

  // Auto-focus and select text when entering edit mode
  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.select();
    }
  }, [isEditingTitle]);

  const handleTitleSave = () => {
    const trimmedTitle = editedTitle.trim();
    
    if (!trimmedTitle) {
      // Revert if empty
      setEditedTitle(diagram.title);
      setIsEditingTitle(false);
      return;
    }
    
    if (trimmedTitle !== diagram.title && onTitleUpdate) {
      onTitleUpdate(diagram.id, trimmedTitle);
    }
    
    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleTitleSave();
    } else if (e.key === 'Escape') {
      setEditedTitle(diagram.title);
      setIsEditingTitle(false);
    }
  };

  const handleExport = () => {
    exportDiagramAsSVG(diagram.title, {
      containerSelector: `#preview-container-${diagram.id} svg`,
      showToast: true
    });
  };

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
      {/* Mini Preview Section - 120px */}
      <div className="relative h-[120px] w-full bg-slate-900/50 border-b border-white/10 rounded-t-xl overflow-hidden">
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
            id={`preview-container-${diagram.id}`}
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
        {/* Title - Editable */}
        {isEditingTitle ? (
          <Input
            ref={titleInputRef}
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onBlur={handleTitleSave}
            onKeyDown={handleTitleKeyDown}
            className="h-8 text-lg font-bold bg-slate-800/50 border-electric-blue/50"
            maxLength={100}
          />
        ) : (
          <h3 
            className="text-lg font-bold text-white truncate group-hover:text-electric-blue transition-colors cursor-pointer"
            onDoubleClick={() => setIsEditingTitle(true)}
            title="Double-click to edit"
          >
            {diagram.title}
          </h3>
        )}

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
            title="Open in editor"
          >
            <Edit3 size={16} className="mr-2" />
            Open
          </Button>
          <Button 
            onClick={handleExport}
            variant="outline"
            className="border-cyber-cyan/50 text-cyber-cyan hover:bg-cyber-cyan/10 hover:border-cyber-cyan"
            title="Export as SVG"
          >
            <Download size={16} />
          </Button>
          <Button 
            onClick={() => onDelete(diagram.id)}
            variant="outline"
            className="border-destructive/50 text-destructive hover:bg-destructive hover:text-white"
            title="Delete diagram"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>
    </GlassPanel>
  );
};
