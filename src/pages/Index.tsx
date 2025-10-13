
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Editor from '@/components/Editor';
import Preview from '@/components/Preview';
import AIPrompt from '@/components/AIPrompt';
import { Separator } from "@/components/ui/separator";
import { initMermaid } from '@/lib/mermaidConfig';
import { exportDiagramAsSVG } from '@/lib/exportSVG';

const DEFAULT_DIAGRAM = `graph TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Action]
    B -->|No| D[Alternative Action]
    C --> E[Result]
    D --> E`;

const Index = () => {
  const [code, setCode] = useState<string>(DEFAULT_DIAGRAM);
  const [prompt, setPrompt] = useState<string>("");
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Initialize theme on component mount
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
  }, []);

  const toggleTheme = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Re-initialize Mermaid with new theme
    initMermaid(newDarkMode);
    
    // Re-render the diagram with the new theme
    const currentCode = code;
    setCode('');
    setTimeout(() => setCode(currentCode), 10);
  };

  const handleExport = () => {
    const firstLine = code.split('\n')[0].trim();
    exportDiagramAsSVG(firstLine);
  };

  const handleDiagramGenerated = (generatedCode: string) => {
    setCode(generatedCode);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white to-slate-100 dark:from-slate-900 dark:to-slate-800 animate-fade-in">
      <Header 
        onExport={handleExport} 
        toggleTheme={toggleTheme}
        isDarkMode={isDarkMode}
      />
      
      <main className="flex-1 container py-6 flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
          <div className="glass-panel p-4 flex flex-col animate-slide-in">
            <Editor 
              value={code} 
              onChange={setCode} 
              className="flex-1"
              promptValue={prompt}
              onPromptChange={setPrompt}
            />
            <Separator className="my-4" />
            <AIPrompt 
              prompt={prompt} 
              onDiagramGenerated={handleDiagramGenerated} 
            />
          </div>
          
          <div className="glass-panel p-4 flex flex-col animate-slide-in" style={{ animationDelay: '100ms' }}>
            <Preview code={code} className="flex-1" isDarkMode={isDarkMode} />
          </div>
        </div>
        
        <div className="glass-panel p-4 text-center text-sm text-slate-500 dark:text-slate-400 animate-slide-in" style={{ animationDelay: '200ms' }}>
          <p>
            Create beautiful diagrams with Mermaid syntax and AI assistance. 
            Made with precision and care.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Index;
