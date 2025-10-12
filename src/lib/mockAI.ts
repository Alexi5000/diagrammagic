/**
 * Mock AI diagram generation for demo purposes
 * 
 * Simulates AI diagram generation by matching user prompts to pre-built
 * examples from the aiExamples dataset. Includes realistic API delay simulation.
 * 
 * @module mockAI
 */

import { 
  searchExamples, 
  getExampleByType, 
} from '@/data/aiExamples';
import type { DiagramType } from '@/types';

/**
 * Keyword mapping for diagram type detection
 * Maps diagram types to common search terms and keywords
 */
const KEYWORDS: Record<string, string[]> = {
  flowchart: [
    'flowchart', 'flow chart', 'workflow', 'process flow', 
    'decision tree', 'flow', 'process', 'login'
  ],
  sequence: [
    'sequence', 'sequence diagram', 'interaction', 'api flow',
    'authentication flow', 'auth', 'payment', 'processing'
  ],
  er: [
    'database', 'schema', 'er diagram', 'entity relationship',
    'data model', 'tables', 'blog', 'entities'
  ],
  class: [
    'class diagram', 'uml', 'object', 'e-commerce', 
    'ecommerce', 'architecture', 'inheritance'
  ],
  gantt: [
    'gantt', 'timeline', 'project timeline', 'schedule',
    'roadmap', 'project', 'planning'
  ],
  git: [
    'git', 'branching', 'branch strategy', 'version control',
    'git flow', 'branches'
  ],
  journey: [
    'journey', 'user journey', 'onboarding', 'customer journey',
    'experience', 'customer'
  ]
};

/**
 * Generic fallback diagram when no matches are found
 */
const FALLBACK_DIAGRAM = `flowchart TD
    Start([Start]) --> Process[Process Input]
    Process --> Decision{Valid?}
    Decision -->|Yes| Success[Success]
    Decision -->|No| Error[Error]
    Error --> Process
    Success --> End([End])
    
    style Start fill:#e1f5e1
    style End fill:#e1f5e1
    style Success fill:#e1f5e1
    style Error fill:#ffe1e1`;

/**
 * Generate a Mermaid diagram based on a text prompt (mock implementation)
 * 
 * This function simulates AI diagram generation by:
 * 1. Searching for matching examples in the aiExamples dataset
 * 2. Matching keywords to determine diagram type
 * 3. Returning appropriate Mermaid code
 * 4. Simulating API delay for realistic UX
 * 
 * @param prompt - Natural language description of the desired diagram
 * @returns Promise resolving to Mermaid syntax code
 * @throws Error if prompt is empty or invalid
 * 
 * @example
 * ```typescript
 * const code = await generateDiagram('create a user login flowchart');
 * console.log(code); // Returns flowchart Mermaid code
 * ```
 */
export async function generateDiagram(prompt: string): Promise<string> {
  // Validate input
  if (!prompt || prompt.trim().length === 0) {
    throw new Error('Prompt cannot be empty');
  }

  const normalizedPrompt = prompt.toLowerCase().trim();
  
  console.log('Mock AI: Processing prompt:', prompt);

  // Simulate API delay (1.5 seconds)
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Step 1: Try direct search using searchExamples utility
  const searchResults = searchExamples(prompt);
  
  if (searchResults.length > 0) {
    console.log('Mock AI: Found exact match:', searchResults[0].title);
    return searchResults[0].generatedCode;
  }

  // Step 2: Keyword-based matching for diagram types
  for (const [type, keywords] of Object.entries(KEYWORDS)) {
    for (const keyword of keywords) {
      if (normalizedPrompt.includes(keyword)) {
        console.log(`Mock AI: Matched keyword "${keyword}" for type "${type}"`);
        
        const examples = getExampleByType(type as DiagramType);
        
        if (examples.length > 0) {
          // Prefer simple examples for fallback
          const simpleExample = examples.find(ex => ex.complexity === 'simple');
          const selectedExample = simpleExample || examples[0];
          
          console.log('Mock AI: Using example:', selectedExample.title);
          return selectedExample.generatedCode;
        }
      }
    }
  }

  // Step 3: Ultimate fallback - generic diagram
  console.log('Mock AI: No matches found, using fallback diagram');
  return FALLBACK_DIAGRAM;
}

/**
 * Check if a prompt is likely to match a specific diagram type
 * Useful for UI hints or auto-suggestions
 * 
 * @param prompt - The user's prompt
 * @returns The most likely diagram type, or null if uncertain
 * 
 * @example
 * ```typescript
 * const type = detectDiagramType('create a login flow');
 * console.log(type); // 'flowchart'
 * ```
 */
export function detectDiagramType(prompt: string): DiagramType | null {
  const normalizedPrompt = prompt.toLowerCase().trim();
  
  for (const [type, keywords] of Object.entries(KEYWORDS)) {
    for (const keyword of keywords) {
      if (normalizedPrompt.includes(keyword)) {
        return type as DiagramType;
      }
    }
  }
  
  return null;
}

/**
 * Get a suggestion for improving a prompt
 * Analyzes the prompt and suggests specific keywords if detection fails
 * 
 * @param prompt - The user's prompt
 * @returns Suggestion string or null if prompt is good
 * 
 * @example
 * ```typescript
 * const suggestion = getSuggestion('make a diagram');
 * console.log(suggestion); 
 * // "Try being more specific: mention 'flowchart', 'sequence', 'database', etc."
 * ```
 */
export function getSuggestion(prompt: string): string | null {
  if (detectDiagramType(prompt)) {
    return null; // Prompt is good
  }
  
  return "Try being more specific: mention diagram types like 'flowchart', 'sequence diagram', 'database schema', 'class diagram', etc.";
}
