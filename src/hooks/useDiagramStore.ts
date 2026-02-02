import { useState, useEffect, useCallback } from 'react';
import { logger } from '@/lib/logger';
import { Diagram } from '@/types';
import {
  getDiagrams,
  saveDiagram,
  updateDiagram as updateDiagramStorage,
  deleteDiagram as deleteDiagramStorage,
  StorageQuotaExceededError,
  DiagramNotFoundError
} from '@/lib/storage';
import { toast } from '@/hooks/use-toast';

/**
 * Return type for the useDiagramStore hook
 */
interface UseDiagramStoreReturn {
  /** All diagrams sorted by most recent */
  diagrams: Diagram[];
  
  /** Add a new diagram and return its ID */
  addDiagram: (diagram: Omit<Diagram, 'id' | 'createdAt' | 'updatedAt'>) => string;
  
  /** Update an existing diagram */
  updateDiagram: (id: string, updates: Partial<Omit<Diagram, 'id' | 'createdAt'>>) => void;
  
  /** Delete a diagram by ID */
  deleteDiagram: (id: string) => void;
  
  /** Retrieve a single diagram by ID */
  getDiagramById: (id: string) => Diagram | undefined;
  
  /** Loading state (true during initial load) */
  isLoading: boolean;
  
  /** Error message if any operation fails */
  error: string | null;
  
  /** Clear the error state */
  clearError: () => void;
}

/**
 * Custom hook for managing diagram state with localStorage persistence
 * 
 * Features:
 * - Auto-loads diagrams on mount
 * - Auto-saves changes to localStorage
 * - Optimistic UI updates
 * - Error handling with user-friendly messages
 * - Type-safe operations
 * 
 * @example
 * ```typescript
 * const { diagrams, addDiagram, updateDiagram } = useDiagramStore();
 * 
 * const newId = addDiagram({
 *   title: 'My Diagram',
 *   code: 'graph TD\n  A-->B',
 *   type: 'flowchart',
 *   tags: []
 * });
 * ```
 */
export function useDiagramStore(): UseDiagramStoreReturn {
  // State
  const [diagrams, setDiagrams] = useState<Diagram[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Auto-load on mount
  useEffect(() => {
    try {
      setIsLoading(true);
      const loadedDiagrams = getDiagrams();
      setDiagrams(loadedDiagrams);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Failed to load diagrams';
      setError(errorMessage);
      setDiagrams([]);
      logger.error('❌ DiagramStore: Load failed', { error: err });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Add diagram
  const addDiagram = useCallback((
    diagram: Omit<Diagram, 'id' | 'createdAt' | 'updatedAt'>
  ): string => {
    try {
      const id = crypto.randomUUID();
      const now = new Date().toISOString();
      
      const newDiagram: Diagram = {
        ...diagram,
        id,
        createdAt: now,
        updatedAt: now
      };

      saveDiagram(newDiagram);
      
      setDiagrams(prev => [newDiagram, ...prev]);
      setError(null);
      
      toast({
        title: 'Diagram saved',
        description: `"${diagram.title}" saved. View it in My Diagrams.`
      });
      
      return id;
    } catch (err) {
      let errorMessage = 'Failed to save diagram';
      
      if (err instanceof StorageQuotaExceededError) {
        errorMessage = 'Storage limit reached. Please delete some diagrams.';
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      toast({
        title: 'Save failed',
        description: errorMessage,
        variant: 'destructive'
      });
      
      throw err;
    }
  }, []);

  // Update diagram
  const updateDiagram = useCallback((
    id: string,
    updates: Partial<Omit<Diagram, 'id' | 'createdAt'>>
  ): void => {
    try {
      updateDiagramStorage(id, updates);
      
      setDiagrams(prev =>
        prev
          .map(d =>
            d.id === id
              ? { ...d, ...updates, updatedAt: new Date().toISOString() }
              : d
          )
          .sort((a, b) => 
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          )
      );
      
      setError(null);
      
      toast({
        title: 'Diagram updated',
        description: 'Changes saved successfully.'
      });
    } catch (err) {
      let errorMessage = 'Failed to update diagram';
      
      if (err instanceof DiagramNotFoundError) {
        errorMessage = 'Diagram not found';
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      toast({
        title: 'Update failed',
        description: errorMessage,
        variant: 'destructive'
      });
    }
  }, []);

  // Delete diagram
  const deleteDiagram = useCallback((id: string): void => {
    const previousDiagrams = diagrams;
    const diagramToDelete = diagrams.find(d => d.id === id);
    
    // Optimistic update
    setDiagrams(prev => prev.filter(d => d.id !== id));
    
    try {
      deleteDiagramStorage(id);
      setError(null);
      
      toast({
        title: 'Diagram deleted',
        description: diagramToDelete 
          ? `"${diagramToDelete.title}" has been deleted.`
          : 'Diagram deleted successfully.'
      });
    } catch (err) {
      // Revert on error
      setDiagrams(previousDiagrams);
      
      let errorMessage = 'Failed to delete diagram';
      if (err instanceof DiagramNotFoundError) {
        errorMessage = 'Diagram not found';
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      toast({
        title: 'Delete failed',
        description: errorMessage,
        variant: 'destructive'
      });
    }
  }, [diagrams]);

  // Get diagram by ID
  const getDiagramById = useCallback((id: string): Diagram | undefined => {
    return diagrams.find(d => d.id === id);
  }, [diagrams]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    diagrams,
    addDiagram,
    updateDiagram,
    deleteDiagram,
    getDiagramById,
    isLoading,
    error,
    clearError
  };
}
