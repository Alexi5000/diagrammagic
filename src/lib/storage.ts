/**
 * localStorage Utility Functions for Diagram Management
 * 
 * Provides type-safe CRUD operations for diagrams stored in browser localStorage.
 * All functions handle JSON parsing errors gracefully and maintain data integrity.
 * 
 * @module storage
 */

import { Diagram } from '@/types';
import { logger } from '@/lib/logger';

// ==================== Constants ====================

/**
 * localStorage key for storing diagrams
 */
const STORAGE_KEY = 'ai-diagrams' as const;

/**
 * Storage version for future migration support
 */
const STORAGE_VERSION = 1;

// ==================== Custom Error Classes ====================

/**
 * Base error class for storage operations
 */
export class StorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StorageError';
  }
}

/**
 * Error thrown when a diagram is not found by ID
 */
export class DiagramNotFoundError extends StorageError {
  constructor(id: string) {
    super(`Diagram with id "${id}" not found`);
    this.name = 'DiagramNotFoundError';
  }
}

/**
 * Error thrown when localStorage quota is exceeded
 */
export class StorageQuotaExceededError extends StorageError {
  constructor() {
    super('Storage quota exceeded. Please delete some diagrams to free up space.');
    this.name = 'StorageQuotaExceededError';
  }
}

// ==================== Type Guards ====================

/**
 * Type guard to validate if an object conforms to the Diagram interface
 * 
 * @param obj - Object to validate
 * @returns True if object is a valid Diagram
 */
function isValidDiagram(obj: any): obj is Diagram {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.id === 'string' &&
    typeof obj.title === 'string' &&
    typeof obj.code === 'string' &&
    typeof obj.type === 'string' &&
    typeof obj.createdAt === 'string' &&
    typeof obj.updatedAt === 'string' &&
    Array.isArray(obj.tags)
  );
}

// ==================== Core Functions ====================

/**
 * Retrieve all diagrams from localStorage
 * 
 * Safely parses stored data and filters out any corrupted entries.
 * Returns an empty array if no data exists or if parsing fails.
 * 
 * @returns Array of valid diagrams (never null)
 * 
 * @example
 * ```typescript
 * const allDiagrams = getDiagrams();
 * console.log(`Found ${allDiagrams.length} diagrams`);
 * ```
 */
export function getDiagrams(): Diagram[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    
    if (!data) {
      return [];
    }

    const parsed = JSON.parse(data);
    
    if (!Array.isArray(parsed)) {
      logger.warn('Stored data is not an array, resetting storage');
      return [];
    }

    // Filter out any corrupted entries
    const validDiagrams = parsed.filter(isValidDiagram);
    
    if (validDiagrams.length !== parsed.length) {
      logger.warn(`Filtered out ${parsed.length - validDiagrams.length} corrupted diagram(s)`);
    }

    // Sort by most recently updated first
    return validDiagrams.sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  } catch (error) {
    logger.error('Failed to parse diagrams from localStorage:', error);
    
    // Backup corrupted data for debugging
    const corruptedData = localStorage.getItem(STORAGE_KEY);
    if (corruptedData) {
      try {
        localStorage.setItem(`${STORAGE_KEY}_corrupted_backup`, corruptedData);
        logger.info('Corrupted data backed up to localStorage');
      } catch {
        // Ignore backup errors
      }
    }
    
    return [];
  }
}

/**
 * Save a diagram to localStorage
 * 
 * If a diagram with the same ID already exists, it will be updated.
 * Otherwise, a new diagram will be created.
 * 
 * @param diagram - The diagram object to save
 * @throws {StorageQuotaExceededError} When localStorage quota is exceeded
 * @throws {StorageError} When JSON serialization fails
 * 
 * @example
 * ```typescript
 * const newDiagram: Diagram = {
 *   id: crypto.randomUUID(),
 *   title: 'My Flowchart',
 *   code: 'graph TD\n  A-->B',
 *   type: 'flowchart',
 *   createdAt: new Date().toISOString(),
 *   updatedAt: new Date().toISOString(),
 *   tags: ['example'],
 *   description: 'A simple flowchart',
 *   isFavorite: false
 * };
 * saveDiagram(newDiagram);
 * ```
 */
export function saveDiagram(diagram: Diagram): void {
  try {
    const diagrams = getDiagrams();
    const existingIndex = diagrams.findIndex(d => d.id === diagram.id);

    if (existingIndex !== -1) {
      // Update existing diagram, preserve createdAt
      diagrams[existingIndex] = {
        ...diagram,
        createdAt: diagrams[existingIndex].createdAt,
        updatedAt: new Date().toISOString()
      };
    } else {
      // Add new diagram
      diagrams.push({
        ...diagram,
        createdAt: diagram.createdAt || new Date().toISOString(),
        updatedAt: diagram.updatedAt || new Date().toISOString()
      });
    }

    const serialized = JSON.stringify(diagrams);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'QuotaExceededError') {
        throw new StorageQuotaExceededError();
      }
      throw new StorageError(`Failed to save diagram: ${error.message}`);
    }
    throw new StorageError('Failed to save diagram: Unknown error');
  }
}

/**
 * Update an existing diagram with partial updates
 * 
 * Merges the provided updates with the existing diagram data.
 * The 'id' and 'createdAt' fields cannot be modified.
 * Automatically updates the 'updatedAt' timestamp.
 * 
 * @param id - The ID of the diagram to update
 * @param updates - Partial diagram object with fields to update
 * @throws {DiagramNotFoundError} When diagram ID doesn't exist
 * @throws {StorageError} When update fails
 * 
 * @example
 * ```typescript
 * updateDiagram('diagram-123', { 
 *   title: 'Updated Title',
 *   isFavorite: true 
 * });
 * ```
 */
export function updateDiagram(id: string, updates: Partial<Diagram>): void {
  const diagrams = getDiagrams();
  const existingIndex = diagrams.findIndex(d => d.id === id);

  if (existingIndex === -1) {
    throw new DiagramNotFoundError(id);
  }

  // Prevent updating immutable fields
  const { id: _, createdAt: __, ...safeUpdates } = updates as any;

  const updatedDiagram: Diagram = {
    ...diagrams[existingIndex],
    ...safeUpdates,
    updatedAt: new Date().toISOString()
  };

  diagrams[existingIndex] = updatedDiagram;

  try {
    const serialized = JSON.stringify(diagrams);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'QuotaExceededError') {
        throw new StorageQuotaExceededError();
      }
      throw new StorageError(`Failed to update diagram: ${error.message}`);
    }
    throw new StorageError('Failed to update diagram: Unknown error');
  }
}

/**
 * Delete a diagram by ID
 * 
 * Removes the diagram from localStorage permanently.
 * 
 * @param id - The ID of the diagram to delete
 * @throws {DiagramNotFoundError} When diagram ID doesn't exist
 * 
 * @example
 * ```typescript
 * deleteDiagram('diagram-123');
 * ```
 */
export function deleteDiagram(id: string): void {
  const diagrams = getDiagrams();
  const filteredDiagrams = diagrams.filter(d => d.id !== id);

  if (filteredDiagrams.length === diagrams.length) {
    throw new DiagramNotFoundError(id);
  }

  try {
    if (filteredDiagrams.length === 0) {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      const serialized = JSON.stringify(filteredDiagrams);
      localStorage.setItem(STORAGE_KEY, serialized);
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new StorageError(`Failed to delete diagram: ${error.message}`);
    }
    throw new StorageError('Failed to delete diagram: Unknown error');
  }
}

/**
 * Clear all diagrams from localStorage
 * 
 * Removes all stored diagrams permanently. This operation cannot be undone.
 * 
 * @example
 * ```typescript
 * clearAllDiagrams();
 * console.log('All diagrams cleared');
 * ```
 */
export function clearAllDiagrams(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    logger.error('❌ Storage: Clear failed', { error });
    throw new StorageError('Failed to clear all diagrams');
  }
}

// ==================== Helper Functions ====================

/**
 * Retrieve a single diagram by ID
 * 
 * @param id - The ID of the diagram to retrieve
 * @returns The diagram object or null if not found
 * 
 * @example
 * ```typescript
 * const diagram = getDiagramById('diagram-123');
 * if (diagram) {
 *   console.log(diagram.title);
 * }
 * ```
 */
export function getDiagramById(id: string): Diagram | null {
  const diagrams = getDiagrams();
  return diagrams.find(d => d.id === id) || null;
}

/**
 * Search diagrams by query string
 * 
 * Searches in title, description, and tags (case-insensitive).
 * 
 * @param query - Search query string
 * @returns Array of matching diagrams
 * 
 * @example
 * ```typescript
 * const results = searchDiagrams('flowchart');
 * console.log(`Found ${results.length} matching diagrams`);
 * ```
 */
export function searchDiagrams(query: string): Diagram[] {
  if (!query.trim()) {
    return getDiagrams();
  }

  const diagrams = getDiagrams();
  const lowerQuery = query.toLowerCase();

  return diagrams.filter(diagram => {
    const titleMatch = diagram.title.toLowerCase().includes(lowerQuery);
    const descriptionMatch = diagram.description?.toLowerCase().includes(lowerQuery) || false;
    const tagsMatch = diagram.tags.some(tag => tag.toLowerCase().includes(lowerQuery));

    return titleMatch || descriptionMatch || tagsMatch;
  });
}

/**
 * Get all favorite diagrams
 * 
 * @returns Array of diagrams marked as favorite
 * 
 * @example
 * ```typescript
 * const favorites = getFavoriteDiagrams();
 * console.log(`You have ${favorites.length} favorite diagrams`);
 * ```
 */
export function getFavoriteDiagrams(): Diagram[] {
  const diagrams = getDiagrams();
  return diagrams.filter(d => d.isFavorite === true);
}

/**
 * Export all diagrams as JSON string
 * 
 * Creates a formatted JSON backup of all diagrams.
 * 
 * @returns JSON string containing all diagrams
 * 
 * @example
 * ```typescript
 * const backup = exportDiagrams();
 * // Save to file or clipboard
 * ```
 */
export function exportDiagrams(): string {
  const diagrams = getDiagrams();
  return JSON.stringify({
    version: STORAGE_VERSION,
    exportedAt: new Date().toISOString(),
    diagrams
  }, null, 2);
}

/**
 * Import diagrams from JSON backup
 * 
 * Merges imported diagrams with existing ones (by ID).
 * Existing diagrams with matching IDs will be overwritten.
 * 
 * @param jsonString - JSON string containing diagram data
 * @throws {StorageError} When JSON is invalid or import fails
 * 
 * @example
 * ```typescript
 * const backupJson = '{"version":1,"diagrams":[...]}';
 * importDiagrams(backupJson);
 * ```
 */
export function importDiagrams(jsonString: string): void {
  try {
    const parsed = JSON.parse(jsonString);
    
    if (!parsed.diagrams || !Array.isArray(parsed.diagrams)) {
      throw new StorageError('Invalid import format: missing diagrams array');
    }

    const validDiagrams = parsed.diagrams.filter(isValidDiagram);
    
    if (validDiagrams.length === 0) {
      throw new StorageError('No valid diagrams found in import data');
    }

    const existingDiagrams = getDiagrams();
    const existingIds = new Set(existingDiagrams.map(d => d.id));

    // Merge: update existing, add new
    validDiagrams.forEach(diagram => {
      if (existingIds.has(diagram.id)) {
        updateDiagram(diagram.id, diagram);
      } else {
        saveDiagram(diagram);
      }
    });
  } catch (error) {
    if (error instanceof StorageError) {
      throw error;
    }
    if (error instanceof Error) {
      throw new StorageError(`Failed to import diagrams: ${error.message}`);
    }
    throw new StorageError('Failed to import diagrams: Unknown error');
  }
}

/**
 * Get storage statistics
 * 
 * @returns Object with diagram count and storage usage info
 * 
 * @example
 * ```typescript
 * const stats = getStorageStats();
 * console.log(`Total diagrams: ${stats.count}`);
 * console.log(`Storage used: ${stats.sizeInKB} KB`);
 * ```
 */
export function getStorageStats() {
  const diagrams = getDiagrams();
  const data = localStorage.getItem(STORAGE_KEY) || '';
  
  return {
    count: diagrams.length,
    sizeInBytes: new Blob([data]).size,
    sizeInKB: (new Blob([data]).size / 1024).toFixed(2),
    favorites: diagrams.filter(d => d.isFavorite).length,
    byType: diagrams.reduce((acc, d) => {
      acc[d.type] = (acc[d.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  };
}
