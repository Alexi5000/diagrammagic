import { describe, it, expect } from 'vitest';
import { templates } from '../templates';

describe('Templates Data Validation', () => {
  it('should have at least 1 template', () => {
    expect(templates.length).toBeGreaterThan(0);
  });

  it('should have unique IDs', () => {
    const ids = templates.map(t => t.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('should have template tpl-business-funnel-003', () => {
    const template = templates.find(t => t.id === 'tpl-business-funnel-003');
    expect(template).toBeDefined();
    expect(template?.name).toBe('Sales Funnel Pipeline');
    expect(template?.category).toBe('business');
  });

  it('should have non-empty code for all templates', () => {
    templates.forEach(template => {
      expect(template.code.trim().length).toBeGreaterThan(0);
    });
  });

  it('should have valid categories', () => {
    const validCategories = ['business', 'technical', 'education'];
    templates.forEach(template => {
      expect(validCategories).toContain(template.category);
    });
  });

  it('should have valid difficulty levels', () => {
    const validDifficulties = ['beginner', 'intermediate', 'advanced'];
    templates.forEach(template => {
      expect(validDifficulties).toContain(template.difficulty);
    });
  });

  it('should have all required fields', () => {
    templates.forEach(template => {
      expect(template.id).toBeTruthy();
      expect(template.name).toBeTruthy();
      expect(template.description).toBeTruthy();
      expect(template.code).toBeTruthy();
      expect(template.type).toBeTruthy();
      expect(template.category).toBeTruthy();
    });
  });
});
