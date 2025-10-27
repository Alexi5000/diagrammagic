import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Toolbar from '@/components/editor/Toolbar';
import CodeEditor from '@/components/editor/CodeEditor';
import PreviewPanel from '@/components/editor/PreviewPanel';
import SaveDiagramDialog from '@/components/editor/SaveDiagramDialog';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { initMermaid } from '@/lib/mermaidConfig';
import { exportDiagramAsSVG } from '@/lib/exportSVG';
import { detectDiagramType, generateDefaultTitle } from '@/lib/detectDiagramType';
import { useDiagramStore } from '@/hooks/useDiagramStore';
import { sampleDiagrams } from '@/data/sampleDiagrams';
import { templates } from '@/data/templates';
import { Template, DiagramType } from '@/types';
import { toast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';
import { TOKENS } from '@/config';

const EditorPage = () => {
  const { addDiagram, updateDiagram, getDiagramById } = useDiagramStore();
  const [searchParams] = useSearchParams();
  
  const [code, setCode] = useState<string>(sampleDiagrams[0].code);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(true);
  const [lastSavedCode, setLastSavedCode] = useState<string>(sampleDiagrams[0].code);
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);
  const [showTemplateConfirm, setShowTemplateConfirm] = useState<boolean>(false);
  const [pendingTemplate, setPendingTemplate] = useState<Template | null>(null);
  const [showSaveDialog, setShowSaveDialog] = useState<boolean>(false);
  const [detectedType, setDetectedType] = useState<DiagramType>('flowchart');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [currentDiagramId, setCurrentDiagramId] = useState<string | null>(null);

  // Initialize theme on component mount
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
  }, []);

  // Load template or diagram from URL parameter on mount
  useEffect(() => {
    const diagramId = searchParams.get('diagram');
    const templateId = searchParams.get('template');
    
    logger.debug('🔍 Editor: URL params checked', { 
      diagramId, 
      templateId,
      currentRoute: window.location.pathname + window.location.search
    });
    
    if (diagramId) {
      logger.debug('📄 Editor: Loading saved diagram', { diagramId });
      const diagram = getDiagramById(diagramId);
      
      if (diagram) {
        logger.info('✅ Editor: Diagram loaded successfully', { 
          id: diagramId, 
          title: diagram.title,
          codeLength: diagram.code.length,
          type: diagram.type
        });
        
        setCode(diagram.code);
        setLastSavedCode(diagram.code);
        setIsSaved(true);
        setCurrentDiagramId(diagramId);
        
        toast({
          title: "Diagram loaded",
          description: `Loaded "${diagram.title}"`,
        });
      } else {
        logger.error('❌ Editor: Diagram not found in store', { 
          requestedId: diagramId,
          availableDiagrams: Object.keys(localStorage).filter(k => k.includes('diagram'))
        });
        
        toast({
          title: "Diagram not found",
          description: "The requested diagram could not be found.",
          variant: "destructive",
        });
      }
    } else if (templateId) {
      logger.debug('🎨 Editor: Loading template', { 
        requestedId: templateId,
        totalTemplatesAvailable: templates.length,
        availableTemplateIds: templates.map(t => t.id)
      });
      
      const template = templates.find(t => t.id === templateId);
      
      if (template) {
        // Validate template has code
        if (!template.code || template.code.trim().length === 0) {
          logger.error('❌ Editor: Template has empty code', { 
            templateId: template.id,
            templateName: template.name,
            category: template.category
          });
          
          toast({
            title: "Invalid template",
            description: "This template has no diagram code.",
            variant: "destructive",
          });
          return;
        }
        
        logger.info('✅ Editor: Template found and loaded', { 
          id: template.id,
          name: template.name,
          category: template.category,
          type: template.type,
          codeLength: template.code.length,
          difficulty: template.difficulty
        });
        
        setCode(template.code);
        setLastSavedCode(template.code);
        setIsSaved(true);
        setCurrentDiagramId(null);
        
        toast({
          title: "Template loaded",
          description: `Loaded "${template.name}" template`,
        });
      } else {
        logger.error('❌ Editor: Template not found', { 
          requestedId: templateId,
          availableIds: templates.map(t => t.id),
          totalTemplates: templates.length,
          categories: [...new Set(templates.map(t => t.category))]
        });
        
        toast({
          title: "Template not found",
          description: `Template "${templateId}" could not be found. Please select a valid template.`,
          variant: "destructive",
        });
      }
    } else {
      logger.debug('📝 Editor: No URL params, showing default diagram');
    }
  }, [searchParams, getDiagramById]);

  // Track save state when code changes
  useEffect(() => {
    setIsSaved(code === lastSavedCode);
  }, [code, lastSavedCode]);

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
      setTimeout(() => setCode(currentCode), TOKENS.TIMING.TIMEOUT_THEME_SWITCH);
      logger.debug('🎨 Editor: Theme switched, re-rendering diagram', { isDarkMode: newDarkMode });
  };

  const handleSave = () => {
    // Validate code is not empty
    if (!code.trim()) {
      toast({
        title: "Cannot save",
        description: "Please add some diagram code before saving.",
        variant: "destructive",
      });
      return;
    }

    // If editing existing diagram, update it directly
    if (currentDiagramId) {
      const type = detectDiagramType(code);
      updateDiagram(currentDiagramId, {
        code,
        type,
      });
      setLastSavedCode(code);
      setIsSaved(true);
      return;
    }

    // Otherwise, detect diagram type and open save dialog for new diagram
    const type = detectDiagramType(code);
    setDetectedType(type);
    setShowSaveDialog(true);
  };

  const handleSaveConfirm = async (data: { title: string; description?: string; tags: string[] }) => {
    try {
      setIsSaving(true);

      // Create diagram object
      const diagramData = {
        title: data.title,
        code,
        type: detectedType,
        description: data.description,
        tags: data.tags,
      };

      // Save to store
      addDiagram(diagramData);

      // Update local state
      const newId = addDiagram(diagramData);
      setCurrentDiagramId(newId);
      setLastSavedCode(code);
      setIsSaved(true);
      setShowSaveDialog(false);

      // Success toast is handled by useDiagramStore
    } catch (error) {
      logger.error('❌ Editor: Save failed', { error });
      // Error toast is handled by useDiagramStore
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = () => {
    const firstLine = code.split('\n')[0].trim();
    exportDiagramAsSVG(firstLine);
  };

  const handleClear = () => {
    if (!isSaved && code.trim() !== '') {
      setShowClearConfirm(true);
    } else {
      performClear();
    }
  };

  const performClear = () => {
    setCode('');
    setLastSavedCode('');
    setIsSaved(true);
    setShowClearConfirm(false);
    toast({
      title: "Diagram cleared",
      description: "The editor has been cleared.",
    });
  };

  const handleTemplateSelect = (template: Template) => {
    if (!isSaved && code.trim() !== '') {
      setPendingTemplate(template);
      setShowTemplateConfirm(true);
    } else {
      loadTemplate(template);
    }
  };

  const loadTemplate = (template: Template) => {
    setCode(template.code);
    setLastSavedCode(template.code);
    setIsSaved(true);
    setShowTemplateConfirm(false);
    setPendingTemplate(null);
    toast({
      title: "Template loaded",
      description: `"${template.name}" template has been loaded.`,
    });
  };

  const handleSettings = () => {
    // Placeholder for settings functionality
    toast({
      title: "Settings",
      description: "Settings panel coming soon!",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 animate-fade-in">
      <Toolbar
        onSave={handleSave}
        isSaved={isSaved}
        onExport={handleExport}
        onTemplateSelect={handleTemplateSelect}
        onClear={handleClear}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        onSettings={handleSettings}
      />
      
      <main className="flex-1 container py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
          <div className="glass-panel p-6 animate-slide-in">
            <CodeEditor 
              value={code} 
              onChange={setCode} 
              className="h-full"
              showLineNumbers={false}
            />
          </div>
          
          <div className="glass-panel p-6 animate-slide-in" style={{ animationDelay: `${TOKENS.TIMING.ANIMATION_DELAY_PANEL}ms` }}>
            <PreviewPanel code={code} className="h-full" isDarkMode={isDarkMode} />
          </div>
        </div>
      </main>

      {/* Save Dialog */}
      <SaveDiagramDialog
        open={showSaveDialog}
        onOpenChange={setShowSaveDialog}
        onSave={handleSaveConfirm}
        defaultTitle={generateDefaultTitle(detectedType)}
        diagramType={detectedType}
        isSaving={isSaving}
      />

      {/* Confirm Dialogs */}
      <ConfirmDialog
        open={showClearConfirm}
        onOpenChange={setShowClearConfirm}
        title="Clear diagram?"
        description="You have unsaved changes. Are you sure you want to clear the diagram?"
        onConfirm={performClear}
      />

      <ConfirmDialog
        open={showTemplateConfirm}
        onOpenChange={setShowTemplateConfirm}
        title="Load template?"
        description="You have unsaved changes. Loading a template will replace your current diagram."
        onConfirm={() => pendingTemplate && loadTemplate(pendingTemplate)}
      />
    </div>
  );
};

export default EditorPage;

