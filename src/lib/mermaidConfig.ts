import mermaid from 'mermaid';

/**
 * Mermaid.js Configuration Helper
 * 
 * Provides centralized configuration and initialization for Mermaid diagrams.
 * Supports theme-aware rendering with the application design system.
 * 
 * @module mermaidConfig
 */

// ==================== Constants ====================

/**
 * Mermaid configuration constants
 * 
 * Single source of truth for all Mermaid-related configuration values.
 */
export const MERMAID_CONFIG = {
  /** Font family matching the application design system (Inter) */
  FONT_FAMILY: 'Inter, sans-serif',
  
  /** Security level - 'loose' allows HTML labels and rich formatting */
  SECURITY_LEVEL: 'loose' as const,
  
  /** Whether to start rendering on load (false = manual control) */
  START_ON_LOAD: false,
  
  /** Available theme options for Mermaid diagrams */
  THEMES: {
    LIGHT: 'default' as const,
    DARK: 'dark' as const,
  },
  
  /** Default padding around diagrams (in pixels) */
  DEFAULT_PADDING: 20,
  
  /** Log level for Mermaid (info for dev, error for production) */
  LOG_LEVEL: {
    DEV: 'info' as const,
    PROD: 'error' as const,
  },
} as const;

// ==================== Core Functions ====================

/**
 * Initialize Mermaid.js with custom configuration
 * 
 * Configures Mermaid with theme-aware settings optimized for the
 * AI Diagram Creator application. This is the primary initialization
 * function and should be called whenever the theme changes.
 * 
 * @param isDarkMode - Whether dark mode is currently enabled
 * 
 * @example
 * ```typescript
 * // Initialize with dark theme
 * initMermaid(true);
 * 
 * // Initialize with light theme
 * initMermaid(false);
 * 
 * // In React component
 * useEffect(() => {
 *   initMermaid(isDarkMode);
 * }, [isDarkMode]);
 * ```
 */
export function initMermaid(isDarkMode: boolean): void {
  mermaid.initialize({
    startOnLoad: MERMAID_CONFIG.START_ON_LOAD,
    theme: isDarkMode ? MERMAID_CONFIG.THEMES.DARK : MERMAID_CONFIG.THEMES.LIGHT,
    securityLevel: MERMAID_CONFIG.SECURITY_LEVEL,
    fontFamily: MERMAID_CONFIG.FONT_FAMILY,
    
    // Flowchart-specific configuration
    flowchart: {
      htmlLabels: true,
      useMaxWidth: true,
      padding: MERMAID_CONFIG.DEFAULT_PADDING,
    },
    
    // Sequence diagram configuration
    sequence: {
      useMaxWidth: true,
    },
    
    // Logging level (verbose in dev, quiet in production)
    logLevel: import.meta.env.DEV 
      ? MERMAID_CONFIG.LOG_LEVEL.DEV 
      : MERMAID_CONFIG.LOG_LEVEL.PROD,
  });
}

// ==================== Helper Functions ====================

/**
 * Get the appropriate Mermaid theme string based on dark mode state
 * 
 * @param isDarkMode - Whether dark mode is enabled
 * @returns Mermaid theme identifier ('dark' or 'default')
 * 
 * @example
 * ```typescript
 * const theme = getMermaidTheme(true); // 'dark'
 * const theme = getMermaidTheme(false); // 'default'
 * ```
 */
export function getMermaidTheme(isDarkMode: boolean): 'dark' | 'default' {
  return isDarkMode ? MERMAID_CONFIG.THEMES.DARK : MERMAID_CONFIG.THEMES.LIGHT;
}
