/**
 * Type definitions for AI Diagram Creator
 * Centralized type system for the entire application
 */

/**
 * Supported Mermaid diagram types
 * @see https://mermaid.js.org/intro/
 */
export type DiagramType = 
  | 'flowchart' 
  | 'sequence' 
  | 'class' 
  | 'er' 
  | 'gantt'
  | 'pie'
  | 'state'
  | 'journey'
  | 'git';

/**
 * Template categories for organization
 */
export type Category = 
  | 'business' 
  | 'technical' 
  | 'education'
  | 'workflow'
  | 'database';

/**
 * Theme modes supported by the application
 */
export type ThemeMode = 'light' | 'dark';

/**
 * Represents a user-created diagram with metadata
 * This will be used for diagram history, saved diagrams, etc.
 */
export interface Diagram {
  /** Unique identifier (UUID v4) */
  id: string;
  
  /** User-defined title for the diagram */
  title: string;
  
  /** Mermaid syntax code */
  code: string;
  
  /** Type of diagram (flowchart, sequence, etc.) */
  type: DiagramType;
  
  /** ISO 8601 timestamp of creation */
  createdAt: string;
  
  /** ISO 8601 timestamp of last update */
  updatedAt: string;
  
  /** Searchable tags for categorization */
  tags: string[];
  
  /** Optional user-provided description */
  description?: string;
  
  /** Whether the diagram is favorited */
  isFavorite?: boolean;
}

/**
 * Pre-built diagram template for quick start
 */
export interface Template {
  /** Unique template identifier */
  id: string;
  
  /** Template display name */
  name: string;
  
  /** Description of what this template is for */
  description: string;
  
  /** Pre-written Mermaid code */
  code: string;
  
  /** Type of diagram */
  type: DiagramType;
  
  /** Category for filtering */
  category: Category;
  
  /** Difficulty level */
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  
  /** Preview SVG or image URL */
  preview?: string;
  
  /** Number of times this template has been used */
  usageCount?: number;
}

/**
 * Example AI prompts with expected output
 * Used for user guidance and testing
 */
export interface AIPromptExample {
  /** Example prompt text */
  prompt: string;
  
  /** Expected Mermaid code output */
  generatedCode: string;
  
  /** Type of diagram this generates */
  type: DiagramType;
  
  /** Optional title for the example */
  title?: string;
  
  /** Complexity indicator */
  complexity?: 'simple' | 'moderate' | 'complex';
}

/**
 * OpenAI API request payload
 */
export interface AIGenerateRequest {
  /** User's natural language prompt */
  prompt: string;
  
  /** Optional context or constraints */
  context?: string;
  
  /** Preferred diagram type (if specified) */
  preferredType?: DiagramType;
}

/**
 * OpenAI API response structure
 */
export interface AIGenerateResponse {
  /** Generated Mermaid code */
  code: string;
  
  /** Detected diagram type */
  type: DiagramType;
  
  /** Success/error status */
  success: boolean;
  
  /** Error message if failed */
  error?: string;
  
  /** Token usage info */
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

/**
 * User preferences stored in localStorage
 */
export interface UserPreferences {
  /** Preferred theme */
  theme: ThemeMode;
  
  /** Default diagram type for new diagrams */
  defaultDiagramType?: DiagramType;
  
  /** Editor font size */
  editorFontSize?: number;
  
  /** Auto-save enabled */
  autoSave?: boolean;
  
  /** Show line numbers in editor */
  showLineNumbers?: boolean;
}

/**
 * Export format options
 */
export type ExportFormat = 'svg' | 'png' | 'pdf' | 'markdown';

/**
 * Export options configuration
 */
export interface ExportOptions {
  /** Format to export as */
  format: ExportFormat;
  
  /** Custom filename (without extension) */
  filename?: string;
  
  /** Image quality (for PNG/PDF) 0-1 */
  quality?: number;
  
  /** Background color (hex) */
  backgroundColor?: string;
  
  /** Include title in export */
  includeTitle?: boolean;
  
  /** Scale factor */
  scale?: number;
}

/**
 * Header component props
 */
export interface HeaderProps {
  /** Callback for export action */
  onExport: () => void;
  
  /** Callback for theme toggle */
  toggleTheme: () => void;
  
  /** Current theme state */
  isDarkMode: boolean;
}

/**
 * Editor component props
 */
export interface EditorProps {
  /** Current Mermaid code */
  value: string;
  
  /** Code change handler */
  onChange: (value: string) => void;
  
  /** Current AI prompt */
  promptValue: string;
  
  /** Prompt change handler */
  onPromptChange: (value: string) => void;
  
  /** Optional className */
  className?: string;
}

/**
 * Preview component props
 */
export interface PreviewProps {
  /** Mermaid code to render */
  code: string;
  
  /** Optional className */
  className?: string;
  
  /** Loading state */
  isLoading?: boolean;
}

/**
 * AI Prompt component props
 */
export interface AIPromptProps {
  /** Current prompt value */
  prompt: string;
  
  /** Callback when diagram is generated */
  onDiagramGenerated: (diagram: string) => void;
  
  /** Optional className */
  className?: string;
  
  /** Loading state override */
  isGenerating?: boolean;
}

/**
 * API Key Input component props
 */
export interface ApiKeyInputProps {
  /** Optional className */
  className?: string;
  
  /** Callback when API key is saved */
  onKeySaved?: () => void;
}

/**
 * Generic API error structure
 */
export interface ApiError {
  /** Error message */
  message: string;
  
  /** HTTP status code */
  statusCode?: number;
  
  /** Additional error details */
  details?: Record<string, unknown>;
}

/**
 * Generic async state wrapper
 */
export interface AsyncState<T> {
  /** Data payload */
  data: T | null;
  
  /** Loading flag */
  loading: boolean;
  
  /** Error if any */
  error: ApiError | null;
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  /** Current page (1-indexed) */
  page: number;
  
  /** Items per page */
  pageSize: number;
  
  /** Total number of items */
  totalItems: number;
  
  /** Total number of pages */
  totalPages: number;
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  /** Array of items */
  items: T[];
  
  /** Pagination metadata */
  meta: PaginationMeta;
}

/**
 * Type guard to check if a string is a valid DiagramType
 */
export function isDiagramType(value: string): value is DiagramType {
  const validTypes: DiagramType[] = [
    'flowchart', 'sequence', 'class', 'er', 'gantt',
    'pie', 'state', 'journey', 'git'
  ];
  return validTypes.includes(value as DiagramType);
}

/**
 * Type guard to check if a string is a valid Category
 */
export function isCategory(value: string): value is Category {
  const validCategories: Category[] = [
    'business', 'technical', 'education', 'workflow', 'database'
  ];
  return validCategories.includes(value as Category);
}
