import { DiagramType } from '@/types';

/**
 * Detects the Mermaid diagram type from code
 * Analyzes the first non-empty line to determine diagram type
 * 
 * @param code - Mermaid diagram code
 * @returns DiagramType - Detected diagram type, defaults to 'flowchart'
 */
export function detectDiagramType(code: string): DiagramType {
  if (!code || !code.trim()) {
    return 'flowchart';
  }

  // Get first non-empty line
  const firstLine = code
    .split('\n')
    .map(line => line.trim())
    .find(line => line.length > 0);

  if (!firstLine) {
    return 'flowchart';
  }

  const lowerLine = firstLine.toLowerCase();

  // Match diagram type keywords
  if (lowerLine.startsWith('graph') || lowerLine.startsWith('flowchart')) {
    return 'flowchart';
  }
  
  if (lowerLine.startsWith('sequencediagram')) {
    return 'sequence';
  }
  
  if (lowerLine.startsWith('classdiagram')) {
    return 'class';
  }
  
  if (lowerLine.startsWith('erdiagram')) {
    return 'er';
  }
  
  if (lowerLine.startsWith('gantt')) {
    return 'gantt';
  }
  
  if (lowerLine.startsWith('pie')) {
    return 'pie';
  }
  
  if (lowerLine.startsWith('statediagram')) {
    return 'state';
  }
  
  if (lowerLine.startsWith('journey')) {
    return 'journey';
  }
  
  if (lowerLine.startsWith('gitgraph')) {
    return 'git';
  }

  // Default to flowchart if no match
  return 'flowchart';
}

/**
 * Generates a default title based on diagram type
 * 
 * @param type - Diagram type
 * @returns string - Default title
 */
export function generateDefaultTitle(type: DiagramType): string {
  const typeNames: Record<DiagramType, string> = {
    flowchart: 'Flowchart',
    sequence: 'Sequence Diagram',
    class: 'Class Diagram',
    er: 'Entity Relationship Diagram',
    gantt: 'Gantt Chart',
    pie: 'Pie Chart',
    state: 'State Diagram',
    journey: 'User Journey',
    git: 'Git Graph'
  };

  const date = new Date().toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });

  return `${typeNames[type]} - ${date}`;
}
