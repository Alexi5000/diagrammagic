import { describe, it, expect, beforeEach } from 'vitest';
import {
  getDiagrams,
  saveDiagram,
  updateDiagram,
  deleteDiagram,
  clearAllDiagrams,
  searchDiagrams,
  getFavoriteDiagrams,
  getDiagramById,
  exportDiagrams,
  importDiagrams,
  getStorageStats,
  DiagramNotFoundError,
} from '../storage';
import { Diagram } from '@/types';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

const createMockDiagram = (overrides?: Partial<Diagram>): Diagram => ({
  id: crypto.randomUUID(),
  title: 'Test Diagram',
  code: 'graph TD\n  A-->B',
  type: 'flowchart',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  tags: ['test'],
  ...overrides,
});

describe('Storage Utilities', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  describe('getDiagrams', () => {
    it('returns empty array when no data', () => {
      expect(getDiagrams()).toEqual([]);
    });

    it('returns sorted diagrams (most recent first)', () => {
      const older = createMockDiagram({ 
        id: '1', 
        updatedAt: '2024-01-01T00:00:00Z' 
      });
      const newer = createMockDiagram({ 
        id: '2', 
        updatedAt: '2024-12-01T00:00:00Z' 
      });
      saveDiagram(older);
      saveDiagram(newer);
      
      const diagrams = getDiagrams();
      expect(diagrams[0].id).toBe('2');
      expect(diagrams[1].id).toBe('1');
    });
  });

  describe('saveDiagram', () => {
    it('creates new diagram with timestamps', () => {
      const diagram = createMockDiagram();
      saveDiagram(diagram);
      
      const saved = getDiagramById(diagram.id);
      expect(saved).toBeDefined();
      expect(saved?.title).toBe(diagram.title);
    });

    it('updates existing diagram, preserves createdAt', () => {
      const original = createMockDiagram({ 
        createdAt: '2024-01-01T00:00:00Z' 
      });
      saveDiagram(original);
      
      const updated = { ...original, title: 'Updated Title' };
      saveDiagram(updated);
      
      const result = getDiagramById(original.id);
      expect(result?.title).toBe('Updated Title');
      expect(result?.createdAt).toBe('2024-01-01T00:00:00Z');
    });
  });

  describe('updateDiagram', () => {
    it('updates fields correctly', () => {
      const diagram = createMockDiagram();
      saveDiagram(diagram);
      
      updateDiagram(diagram.id, { title: 'New Title' });
      
      const result = getDiagramById(diagram.id);
      expect(result?.title).toBe('New Title');
    });

    it('throws DiagramNotFoundError for missing ID', () => {
      expect(() => updateDiagram('non-existent', { title: 'Test' }))
        .toThrow(DiagramNotFoundError);
    });
  });

  describe('deleteDiagram', () => {
    it('removes diagram from storage', () => {
      const diagram = createMockDiagram();
      saveDiagram(diagram);
      
      deleteDiagram(diagram.id);
      
      expect(getDiagramById(diagram.id)).toBeNull();
    });

    it('throws DiagramNotFoundError for missing ID', () => {
      expect(() => deleteDiagram('non-existent'))
        .toThrow(DiagramNotFoundError);
    });
  });

  describe('clearAllDiagrams', () => {
    it('removes all diagrams', () => {
      saveDiagram(createMockDiagram());
      saveDiagram(createMockDiagram());
      
      clearAllDiagrams();
      
      expect(getDiagrams()).toEqual([]);
    });
  });

  describe('searchDiagrams', () => {
    it('finds by title', () => {
      saveDiagram(createMockDiagram({ title: 'Login Flow' }));
      saveDiagram(createMockDiagram({ title: 'Dashboard' }));
      
      const results = searchDiagrams('login');
      expect(results).toHaveLength(1);
      expect(results[0].title).toBe('Login Flow');
    });

    it('finds by tags', () => {
      saveDiagram(createMockDiagram({ tags: ['auth', 'security'] }));
      
      const results = searchDiagrams('auth');
      expect(results).toHaveLength(1);
    });

    it('returns all diagrams for empty query', () => {
      saveDiagram(createMockDiagram({ title: 'Diagram 1' }));
      saveDiagram(createMockDiagram({ title: 'Diagram 2' }));
      
      const results = searchDiagrams('');
      expect(results).toHaveLength(2);
    });
  });

  describe('getFavoriteDiagrams', () => {
    it('returns only favorites', () => {
      saveDiagram(createMockDiagram({ isFavorite: true }));
      saveDiagram(createMockDiagram({ isFavorite: false }));
      
      const favorites = getFavoriteDiagrams();
      expect(favorites).toHaveLength(1);
    });

    it('returns empty array when no favorites', () => {
      saveDiagram(createMockDiagram({ isFavorite: false }));
      
      const favorites = getFavoriteDiagrams();
      expect(favorites).toHaveLength(0);
    });
  });

  describe('getDiagramById', () => {
    it('returns diagram when found', () => {
      const diagram = createMockDiagram();
      saveDiagram(diagram);
      
      const result = getDiagramById(diagram.id);
      expect(result?.id).toBe(diagram.id);
    });

    it('returns null when not found', () => {
      const result = getDiagramById('non-existent');
      expect(result).toBeNull();
    });
  });

  describe('exportDiagrams / importDiagrams', () => {
    it('exports and imports correctly', () => {
      const diagram = createMockDiagram();
      saveDiagram(diagram);
      
      const exported = exportDiagrams();
      clearAllDiagrams();
      
      importDiagrams(exported);
      
      expect(getDiagrams()).toHaveLength(1);
    });

    it('exports with version and timestamp', () => {
      saveDiagram(createMockDiagram());
      
      const exported = JSON.parse(exportDiagrams());
      expect(exported.version).toBeDefined();
      expect(exported.exportedAt).toBeDefined();
      expect(exported.diagrams).toHaveLength(1);
    });
  });

  describe('getStorageStats', () => {
    it('returns correct statistics', () => {
      saveDiagram(createMockDiagram({ type: 'flowchart', isFavorite: true }));
      saveDiagram(createMockDiagram({ type: 'sequence', isFavorite: false }));
      
      const stats = getStorageStats();
      expect(stats.count).toBe(2);
      expect(stats.favorites).toBe(1);
      expect(stats.byType.flowchart).toBe(1);
      expect(stats.byType.sequence).toBe(1);
    });

    it('returns zero stats for empty storage', () => {
      const stats = getStorageStats();
      expect(stats.count).toBe(0);
      expect(stats.favorites).toBe(0);
    });
  });
});
