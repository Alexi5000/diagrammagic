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
import {
  getCloudDiagrams,
  saveCloudDiagram,
  updateCloudDiagram,
  deleteCloudDiagram,
  syncLocalToCloud,
} from '@/lib/cloudStorage';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

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

  /** Whether using cloud storage (authenticated) */
  isCloudMode: boolean;

  /** Sync local diagrams to cloud */
  syncToCloud: () => Promise<void>;

  /** Syncing state */
  isSyncing: boolean;
}

/**
 * Custom hook for managing diagram state with localStorage or cloud persistence
 */
export function useDiagramStore(): UseDiagramStoreReturn {
  const { user } = useAuth();
  
  // State
  const [diagrams, setDiagrams] = useState<Diagram[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const isCloudMode = !!user;

  // Load diagrams based on auth state
  useEffect(() => {
    const loadDiagrams = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (user) {
          // Cloud mode - load from Supabase
          logger.info('☁️ DiagramStore: Loading from cloud', { userId: user.id });
          const cloudDiagrams = await getCloudDiagrams();
          setDiagrams(cloudDiagrams);
        } else {
          // Guest mode - load from localStorage
          logger.info('💾 DiagramStore: Loading from localStorage');
          const localDiagrams = getDiagrams();
          setDiagrams(localDiagrams);
        }
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
    };

    loadDiagrams();
  }, [user]);

  // Sync local diagrams to cloud
  const syncToCloud = useCallback(async () => {
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to sync your diagrams to the cloud.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSyncing(true);
      const count = await syncLocalToCloud(user.id);
      
      if (count > 0) {
        // Reload cloud diagrams
        const cloudDiagrams = await getCloudDiagrams();
        setDiagrams(cloudDiagrams);
        
        toast({
          title: 'Sync complete',
          description: `${count} diagram${count > 1 ? 's' : ''} synced to cloud.`,
        });
      } else {
        toast({
          title: 'Nothing to sync',
          description: 'No local diagrams to migrate.',
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sync failed';
      toast({
        title: 'Sync failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSyncing(false);
    }
  }, [user]);

  // Add diagram
  const addDiagram = useCallback((
    diagram: Omit<Diagram, 'id' | 'createdAt' | 'updatedAt'>
  ): string => {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    
    const newDiagram: Diagram = {
      ...diagram,
      id,
      createdAt: now,
      updatedAt: now
    };

    if (user) {
      // Cloud mode - save to Supabase
      saveCloudDiagram(user.id, diagram)
        .then((savedDiagram) => {
          setDiagrams(prev => [savedDiagram, ...prev]);
          toast({
            title: 'Diagram saved to cloud',
            description: `"${diagram.title}" saved. View it in My Diagrams.`
          });
        })
        .catch((err) => {
          logger.error('❌ DiagramStore: Cloud save failed', { error: err });
          toast({
            title: 'Save failed',
            description: err.message || 'Failed to save to cloud',
            variant: 'destructive',
          });
        });
    } else {
      // Guest mode - save to localStorage
      try {
        saveDiagram(newDiagram);
        setDiagrams(prev => [newDiagram, ...prev]);
        setError(null);
        
        toast({
          title: 'Diagram saved',
          description: `"${diagram.title}" saved. View it in My Diagrams.`
        });
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
    }

    return id;
  }, [user]);

  // Update diagram
  const updateDiagram = useCallback((
    id: string,
    updates: Partial<Omit<Diagram, 'id' | 'createdAt'>>
  ): void => {
    if (user) {
      // Cloud mode
      updateCloudDiagram(id, updates)
        .then((updatedDiagram) => {
          setDiagrams(prev =>
            prev
              .map(d => d.id === id ? updatedDiagram : d)
              .sort((a, b) => 
                new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
              )
          );
          toast({
            title: 'Diagram updated',
            description: 'Changes saved to cloud.'
          });
        })
        .catch((err) => {
          toast({
            title: 'Update failed',
            description: err.message || 'Failed to update',
            variant: 'destructive',
          });
        });
    } else {
      // Guest mode
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
    }
  }, [user]);

  // Delete diagram
  const deleteDiagram = useCallback((id: string): void => {
    const previousDiagrams = diagrams;
    const diagramToDelete = diagrams.find(d => d.id === id);
    
    // Optimistic update
    setDiagrams(prev => prev.filter(d => d.id !== id));
    
    if (user) {
      // Cloud mode
      deleteCloudDiagram(id)
        .then(() => {
          toast({
            title: 'Diagram deleted',
            description: diagramToDelete 
              ? `"${diagramToDelete.title}" has been deleted.`
              : 'Diagram deleted successfully.'
          });
        })
        .catch((err) => {
          // Revert on error
          setDiagrams(previousDiagrams);
          toast({
            title: 'Delete failed',
            description: err.message || 'Failed to delete',
            variant: 'destructive',
          });
        });
    } else {
      // Guest mode
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
    }
  }, [diagrams, user]);

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
    clearError,
    isCloudMode,
    syncToCloud,
    isSyncing,
  };
}
