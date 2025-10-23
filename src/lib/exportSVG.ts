import { saveAs } from 'file-saver';
import { showSuccess, showError } from '@/lib/toast';
import { logger } from '@/lib/logger';

/**
 * SVG Export Helper
 * 
 * Provides utilities for exporting Mermaid diagrams as SVG files.
 * Handles DOM querying, serialization, filename sanitization, and error handling.
 * 
 * @module exportSVG
 */

// ==================== Error Classes ====================

/**
 * Error thrown when SVG element is not found in the DOM
 */
export class SVGNotFoundError extends Error {
  constructor(selector: string) {
    super(`SVG element not found using selector: ${selector}`);
    this.name = 'SVGNotFoundError';
  }
}

/**
 * Error thrown when SVG serialization fails
 */
export class SVGSerializationError extends Error {
  constructor(originalError?: Error) {
    super(`Failed to serialize SVG: ${originalError?.message || 'Unknown error'}`);
    this.name = 'SVGSerializationError';
  }
}

// ==================== Types ====================

/**
 * Options for SVG export
 */
export interface ExportOptions {
  /** DOM selector for the SVG element (default: '.diagram-container svg') */
  containerSelector?: string;
  
  /** Fallback filename if title sanitization fails (default: 'diagram.svg') */
  fallbackFilename?: string;
  
  /** Whether to show toast notifications (default: true) */
  showToast?: boolean;
}

/**
 * Result of an export operation
 */
export interface ExportResult {
  /** Whether the export was successful */
  success: boolean;
  
  /** The filename used for export */
  filename?: string;
  
  /** Error message if export failed */
  error?: string;
}

// ==================== Constants ====================

const DEFAULT_OPTIONS: Required<ExportOptions> = {
  containerSelector: '.diagram-container svg',
  fallbackFilename: 'diagram.svg',
  showToast: true,
};

const MIME_TYPE = 'image/svg+xml;charset=utf-8';
const MAX_FILENAME_LENGTH = 100;

// ==================== Helper Functions ====================

/**
 * Sanitize a string to be used as a filename
 * 
 * Removes special characters, converts to lowercase, replaces spaces with hyphens,
 * and limits the length to prevent filesystem issues.
 * 
 * @param title - The title to sanitize
 * @returns Sanitized filename without extension, or empty string if invalid
 * 
 * @example
 * ```typescript
 * sanitizeFilename('User Flow Diagram') // 'user-flow-diagram'
 * sanitizeFilename('Process: Step 1 -> 2') // 'process-step-1-2'
 * sanitizeFilename('graph TD') // 'graph-td'
 * sanitizeFilename('!!!') // ''
 * ```
 */
export function sanitizeFilename(title: string): string {
  if (!title || typeof title !== 'string') {
    return '';
  }

  // Remove special characters (keep alphanumeric, spaces, hyphens, underscores)
  let sanitized = title
    .replace(/[^\w\s-]/gi, '')
    .trim();

  // Return empty if nothing left
  if (!sanitized) {
    return '';
  }

  // Convert to lowercase and replace spaces with hyphens
  sanitized = sanitized
    .toLowerCase()
    .replace(/\s+/g, '-');

  // Remove consecutive hyphens
  sanitized = sanitized.replace(/-+/g, '-');

  // Remove leading/trailing hyphens
  sanitized = sanitized.replace(/^-+|-+$/g, '');

  // Limit length
  if (sanitized.length > MAX_FILENAME_LENGTH) {
    sanitized = sanitized.substring(0, MAX_FILENAME_LENGTH);
    // Remove trailing hyphen if truncation created one
    sanitized = sanitized.replace(/-+$/, '');
  }

  return sanitized;
}

/**
 * Generate a filename from a diagram title
 * 
 * @param title - The diagram title
 * @param fallback - Fallback filename if sanitization fails
 * @returns Complete filename with .svg extension
 */
function generateFilename(title: string, fallback: string): string {
  const sanitized = sanitizeFilename(title);
  const baseName = sanitized || fallback.replace('.svg', '');
  return baseName.endsWith('.svg') ? baseName : `${baseName}.svg`;
}

// ==================== Core Export Functions ====================

/**
 * Export a Mermaid diagram as an SVG file
 * 
 * Queries the DOM for the SVG element, serializes it, and triggers a download
 * using the file-saver library. Shows toast notifications for success/error.
 * 
 * **Usage:**
 * ```typescript
 * // Basic usage
 * exportDiagramAsSVG('User Flow Diagram');
 * 
 * // With custom options
 * exportDiagramAsSVG('Process Flow', {
 *   containerSelector: '#my-diagram svg',
 *   fallbackFilename: 'my-diagram.svg'
 * });
 * 
 * // Without toast notifications
 * exportDiagramAsSVG('Flowchart', { showToast: false });
 * ```
 * 
 * @param diagramTitle - Title of the diagram (used for filename generation)
 * @param options - Export options
 * 
 * @throws {SVGNotFoundError} If SVG element is not found in the DOM
 * @throws {SVGSerializationError} If SVG serialization fails
 */
export function exportDiagramAsSVG(
  diagramTitle: string,
  options: ExportOptions = {}
): void {
  const config = { ...DEFAULT_OPTIONS, ...options };

  try {
    // Query DOM for SVG element
    const svgElement = document.querySelector<SVGElement>(config.containerSelector);
    
    if (!svgElement) {
      throw new SVGNotFoundError(config.containerSelector);
    }

    // Serialize SVG to string
    let svgData: string;
    try {
      svgData = new XMLSerializer().serializeToString(svgElement);
    } catch (error) {
      throw new SVGSerializationError(error instanceof Error ? error : undefined);
    }

    // Create Blob
    const svgBlob = new Blob([svgData], { type: MIME_TYPE });

    // Generate filename
    const filename = generateFilename(diagramTitle, config.fallbackFilename);

    // Trigger download
    saveAs(svgBlob, filename);

    // Show success toast
    if (config.showToast) {
      showSuccess('Export successful', `Saved as ${filename}`);
    }

    // Log in development
    logger.debug(`Successfully exported: ${filename}`);
  } catch (error) {
    // Handle known errors
    if (error instanceof SVGNotFoundError) {
      if (config.showToast) {
        showError('Export failed', 'No diagram to export');
      }
      logger.error('SVG not found:', error);
      throw error;
    }

    if (error instanceof SVGSerializationError) {
      if (config.showToast) {
        showError('Export failed', 'Failed to serialize diagram');
      }
      logger.error('Serialization error:', error);
      throw error;
    }

    // Handle unexpected errors
    if (config.showToast) {
      showError('Export failed', 'An unexpected error occurred');
    }
    logger.error('Unexpected error:', error);
    throw error;
  }
}

/**
 * Export a diagram and return the result without throwing
 * 
 * Alternative to `exportDiagramAsSVG()` that returns a result object
 * instead of throwing errors. Useful for programmatic error handling.
 * 
 * @param diagramTitle - Title of the diagram
 * @param options - Export options
 * @returns Export result with success status and optional error message
 * 
 * @example
 * ```typescript
 * const result = exportDiagramAsSVGWithResult('My Diagram');
 * if (result.success) {
 *   console.log(`Exported as: ${result.filename}`);
 * } else {
 *   console.error(`Export failed: ${result.error}`);
 * }
 * ```
 */
export function exportDiagramAsSVGWithResult(
  diagramTitle: string,
  options: ExportOptions = {}
): ExportResult {
  try {
    exportDiagramAsSVG(diagramTitle, options);
    const filename = generateFilename(
      diagramTitle,
      options.fallbackFilename || DEFAULT_OPTIONS.fallbackFilename
    );
    return { success: true, filename };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: errorMessage };
  }
}
