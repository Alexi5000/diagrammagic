import React, { useState, useEffect, useRef } from 'react';
import { logger } from '@/lib/logger';
import mermaid from 'mermaid';
import { Loader2, AlertCircle, FileText } from 'lucide-react';
import { initMermaid } from '@/lib/mermaidConfig';
import { cn } from '@/lib/utils';

interface PreviewPanelProps {
  code: string;
  isDarkMode?: boolean;
  className?: string;
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({ code, isDarkMode = false, className }) => {
  const [svg, setSvg] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const renderCountRef = useRef<number>(0);

  // Initialize Mermaid with theme
  useEffect(() => {
    initMermaid(isDarkMode);
  }, [isDarkMode]);

  // Debounced diagram rendering
  useEffect(() => {
    // Clear previous debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // If no code, clear everything
    if (!code.trim()) {
      setSvg('');
      setError('');
      setLoading(false);
      return;
    }

    // Set loading state
    setLoading(true);
    setError('');

    // Debounce: wait 300ms after last code change
    debounceTimerRef.current = setTimeout(async () => {
      try {
        // Generate unique ID for this render
        renderCountRef.current += 1;
        const uniqueId = `mermaid-diagram-${renderCountRef.current}`;

        // Render the diagram
        const { svg: renderedSvg } = await mermaid.render(uniqueId, code);
        setSvg(renderedSvg);
        setError('');
      } catch (err) {
        logger.error('❌ PreviewPanel: Render failed', { error: err });
        const errorMessage = err instanceof Error ? err.message : 'Failed to render diagram';
        setError(errorMessage);
        setSvg('');
      } finally {
        setLoading(false);
      }
    }, 300);

    // Cleanup on unmount
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [code]);

  return (
    <div className={cn('relative h-full w-full', className)}>
      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground font-medium">Rendering diagram...</p>
          </div>
        </div>
      )}

      {/* Error State - Glass Panel with Red Border */}
      {error && !loading && (
        <div className="h-full w-full flex items-center justify-center p-6">
          <div className="max-w-2xl w-full bg-destructive/5 dark:bg-destructive/10 backdrop-blur-md border-2 border-destructive/50 rounded-lg shadow-lg p-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="h-6 w-6 text-destructive flex-shrink-0 mt-1" />
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-destructive mb-2">Syntax Error</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  There's an error in your Mermaid syntax. Please check and try again.
                </p>
                <div className="bg-background/50 rounded-md p-3 overflow-x-auto">
                  <code className="text-xs font-mono text-foreground whitespace-pre-wrap break-words">
                    {error}
                  </code>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!code.trim() && !loading && !error && (
        <div className="h-full w-full flex items-center justify-center p-6">
          <div className="text-center max-w-md">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-primary/10 p-4">
                <FileText className="h-12 w-12 text-primary" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Your diagram will appear here
            </h3>
            <p className="text-sm text-muted-foreground">
              Start typing Mermaid code or use AI to generate a diagram
            </p>
          </div>
        </div>
      )}

      {/* Rendered Diagram */}
      {svg && !loading && !error && (
        <div className="mermaid-container h-full w-full overflow-auto">
          <div dangerouslySetInnerHTML={{ __html: svg }} />
        </div>
      )}
    </div>
  );
};

export default PreviewPanel;
