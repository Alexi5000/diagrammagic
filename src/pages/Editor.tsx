import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Editor from '@/components/Editor';
import Preview from '@/components/Preview';
import { initMermaid } from '@/lib/mermaidConfig';
import { exportDiagramAsSVG } from '@/lib/exportSVG';
import { sampleDiagrams } from '@/data/sampleDiagrams';

const EditorPage = () => {
  const [code, setCode] = useState<string>(sampleDiagrams[0].code);
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

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 animate-fade-in">
      <Header 
        onExport={handleExport} 
        toggleTheme={toggleTheme}
        isDarkMode={isDarkMode}
      />
      
      <main className="flex-1 container py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
          <div className="glass-panel p-6 animate-slide-in">
            <Editor 
              value={code} 
              onChange={setCode} 
              className="h-full"
            />
          </div>
          
          <div className="glass-panel p-6 animate-slide-in" style={{ animationDelay: '100ms' }}>
            <Preview code={code} className="h-full" isDarkMode={isDarkMode} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditorPage;
