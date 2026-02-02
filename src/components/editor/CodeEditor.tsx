import React, { useState, useEffect, useRef } from 'react';
import { logger } from '@/lib/logger';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, LogIn } from "lucide-react";
import { generateMermaidDiagram } from '@/utils/api';
import { toast } from "@/hooks/use-toast";
import { CodeEditorProps } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  className,
  showLineNumbers = false
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'code' | 'prompt'>('code');
  const [promptValue, setPromptValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const [lineCount, setLineCount] = useState(1);
  
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const promptRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const debouncedOnChange = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Update local value when prop changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Debounced onChange - update parent after 300ms
  useEffect(() => {
    if (debouncedOnChange.current) {
      clearTimeout(debouncedOnChange.current);
    }

    debouncedOnChange.current = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue);
      }
    }, 300);

    return () => {
      if (debouncedOnChange.current) {
        clearTimeout(debouncedOnChange.current);
      }
    };
  }, [localValue, onChange, value]);

  // Auto-resize textarea
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.style.height = 'auto';
      editorRef.current.style.height = `${editorRef.current.scrollHeight}px`;
    }
  }, [localValue]);

  // Update line count
  useEffect(() => {
    setLineCount(localValue.split('\n').length);
  }, [localValue]);

  // Handle tab key for 2-space indentation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const newValue = localValue.substring(0, start) + '  ' + localValue.substring(end);
      setLocalValue(newValue);
      
      // Set cursor position after tab
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.selectionStart = editorRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
  };

  // Sync scroll between line numbers and textarea
  const handleScroll = () => {
    if (lineNumbersRef.current && editorRef.current) {
      lineNumbersRef.current.scrollTop = editorRef.current.scrollTop;
    }
  };

  // Handle AI diagram generation
  const handleGenerate = async () => {
    if (!promptValue.trim()) {
      toast({
        title: "Empty prompt",
        description: "Please enter a description of the diagram you want to create",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const diagram = await generateMermaidDiagram(promptValue);
      
      // Update both local and parent immediately for AI generation
      setLocalValue(diagram);
      onChange(diagram);
      
      // Switch to Mermaid Code tab to show result
      setActiveTab('code');
      
      toast({
        title: "Diagram generated",
        description: user ? "Your diagram has been generated using AI" : "Demo diagram generated (sign in for full AI)",
      });
      
      // Clear prompt after successful generation
      setPromptValue('');
    } catch (error) {
      logger.error('❌ CodeEditor: Generation failed', { error });
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Failed to generate diagram",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("h-full flex flex-col", className)}>
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'code' | 'prompt')} className="h-full flex flex-col">
        <TabsList className="w-full justify-start bg-transparent border-b border-slate-200/80 dark:border-slate-800/80 rounded-none px-0">
          <TabsTrigger 
            value="code" 
            className="rounded-t-lg rounded-b-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            Mermaid Code
          </TabsTrigger>
          <TabsTrigger 
            value="prompt" 
            className="rounded-t-lg rounded-b-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            AI Prompt
          </TabsTrigger>
        </TabsList>
        
        {/* Mermaid Code Tab */}
        <TabsContent value="code" className="flex-1 mt-0 h-full">
          <div className="flex h-full">
            {/* Line Numbers (optional) */}
            {showLineNumbers && (
              <div 
                ref={lineNumbersRef}
                className="flex-shrink-0 w-12 bg-slate-100/50 dark:bg-slate-800/50 py-4 pr-2 text-right text-sm text-slate-400 font-mono overflow-hidden select-none"
              >
                {Array.from({ length: lineCount }, (_, i) => (
                  <div key={i + 1} className="leading-6">
                    {i + 1}
                  </div>
                ))}
              </div>
            )}
            
            {/* Code Editor */}
            <textarea
              ref={editorRef}
              value={localValue}
              onChange={(e) => setLocalValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onScroll={handleScroll}
              placeholder="Enter your mermaid code here..."
              className="editor-container h-full resize-none font-mono animate-fade-in"
              spellCheck="false"
              aria-label="Mermaid diagram code editor"
              aria-multiline="true"
            />
          </div>
        </TabsContent>
        
        {/* AI Prompt Tab */}
        <TabsContent value="prompt" className="flex-1 mt-0 h-full">
          <div className="flex flex-col h-full gap-4">
            {/* Prompt Textarea */}
            <textarea
              ref={promptRef}
              value={promptValue}
              onChange={(e) => setPromptValue(e.target.value)}
              placeholder="Describe the diagram you want to create... (e.g., 'Create a flowchart showing the user login process')"
              className="editor-container flex-1 resize-none animate-fade-in"
              spellCheck="false"
              aria-label="AI prompt input"
              aria-multiline="true"
            />
            
            {/* Action Bar */}
            <div className="flex items-center justify-between gap-3 px-4">
              <div className="flex items-center gap-3">
                {/* Generate Button */}
                <Button 
                  onClick={handleGenerate} 
                  disabled={loading || !promptValue.trim()} 
                  className="min-w-32 bg-primary/90 hover:bg-primary transition-all duration-300"
                  aria-label="Generate diagram from prompt"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate
                    </>
                  )}
                </Button>
                
                {/* Sign in prompt for guests */}
                {!user && (
                  <Link to="/auth">
                    <Button variant="outline" size="sm" className="gap-2">
                      <LogIn className="h-4 w-4" />
                      Sign in for full AI
                    </Button>
                  </Link>
                )}
              </div>
              
              {/* Model Info */}
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {user ? 'Using GPT-4o-mini' : 'Demo mode (sign in for GPT-4o-mini)'}
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CodeEditor;
