import { describe, it, expect } from 'vitest';
import {
  DiagramTitleSchema,
  DiagramDescriptionSchema,
  TagSchema,
  AIPromptSchema,
  DiagramCodeSchema
} from '../validation';

describe('Validation Schemas', () => {
  describe('DiagramTitleSchema', () => {
    it('accepts valid titles', () => {
      expect(() => DiagramTitleSchema.parse('My Flowchart')).not.toThrow();
      expect(() => DiagramTitleSchema.parse('Login Flow (v2)')).not.toThrow();
      expect(() => DiagramTitleSchema.parse('User-Auth_Flow')).not.toThrow();
    });

    it('accepts titles with allowed special characters', () => {
      expect(() => DiagramTitleSchema.parse('Test [1]')).not.toThrow();
      expect(() => DiagramTitleSchema.parse('Flow/Process')).not.toThrow();
      expect(() => DiagramTitleSchema.parse('A & B')).not.toThrow();
    });

    it('rejects empty strings', () => {
      expect(() => DiagramTitleSchema.parse('')).toThrow();
    });

    it('rejects whitespace-only strings', () => {
      expect(() => DiagramTitleSchema.parse('   ')).toThrow();
    });

    it('rejects titles over 100 characters', () => {
      const longTitle = 'a'.repeat(101);
      expect(() => DiagramTitleSchema.parse(longTitle)).toThrow();
    });

    it('accepts exactly 100 characters', () => {
      const maxTitle = 'a'.repeat(100);
      expect(() => DiagramTitleSchema.parse(maxTitle)).not.toThrow();
    });

    it('rejects invalid characters', () => {
      expect(() => DiagramTitleSchema.parse('Test<script>')).toThrow();
      expect(() => DiagramTitleSchema.parse('Test{injection}')).toThrow();
      expect(() => DiagramTitleSchema.parse('Test`code`')).toThrow();
    });
  });

  describe('DiagramDescriptionSchema', () => {
    it('accepts valid descriptions', () => {
      expect(() => DiagramDescriptionSchema.parse('A simple flowchart')).not.toThrow();
    });

    it('accepts empty strings', () => {
      expect(() => DiagramDescriptionSchema.parse('')).not.toThrow();
    });

    it('accepts undefined', () => {
      expect(() => DiagramDescriptionSchema.parse(undefined)).not.toThrow();
    });

    it('rejects descriptions over 500 characters', () => {
      const longDesc = 'a'.repeat(501);
      expect(() => DiagramDescriptionSchema.parse(longDesc)).toThrow();
    });

    it('accepts exactly 500 characters', () => {
      const maxDesc = 'a'.repeat(500);
      expect(() => DiagramDescriptionSchema.parse(maxDesc)).not.toThrow();
    });
  });

  describe('TagSchema', () => {
    it('accepts valid lowercase tags', () => {
      expect(() => TagSchema.parse('flowchart')).not.toThrow();
      expect(() => TagSchema.parse('my-tag')).not.toThrow();
      expect(() => TagSchema.parse('tag123')).not.toThrow();
    });

    it('converts uppercase to lowercase', () => {
      const result = TagSchema.parse('FlowChart');
      expect(result).toBe('flowchart');
    });

    it('trims whitespace', () => {
      const result = TagSchema.parse('  mytag  ');
      expect(result).toBe('mytag');
    });

    it('rejects tags with spaces', () => {
      expect(() => TagSchema.parse('my tag')).toThrow();
    });

    it('rejects tags over 30 characters', () => {
      const longTag = 'a'.repeat(31);
      expect(() => TagSchema.parse(longTag)).toThrow();
    });

    it('accepts exactly 30 characters', () => {
      const maxTag = 'a'.repeat(30);
      expect(() => TagSchema.parse(maxTag)).not.toThrow();
    });

    it('rejects empty tags', () => {
      expect(() => TagSchema.parse('')).toThrow();
    });
  });

  describe('AIPromptSchema', () => {
    it('accepts valid prompts', () => {
      expect(() => AIPromptSchema.parse('Create a flowchart')).not.toThrow();
      expect(() => AIPromptSchema.parse('abc')).not.toThrow();
    });

    it('rejects prompts under 3 characters', () => {
      expect(() => AIPromptSchema.parse('ab')).toThrow();
      expect(() => AIPromptSchema.parse('a')).toThrow();
    });

    it('rejects prompts over 1000 characters', () => {
      const longPrompt = 'a'.repeat(1001);
      expect(() => AIPromptSchema.parse(longPrompt)).toThrow();
    });

    it('accepts exactly 1000 characters', () => {
      const maxPrompt = 'a'.repeat(1000);
      expect(() => AIPromptSchema.parse(maxPrompt)).not.toThrow();
    });

    it('trims whitespace before validation', () => {
      expect(() => AIPromptSchema.parse('  abc  ')).not.toThrow();
    });
  });

  describe('DiagramCodeSchema', () => {
    it('accepts valid Mermaid code', () => {
      expect(() => DiagramCodeSchema.parse('graph TD\n  A-->B')).not.toThrow();
      expect(() => DiagramCodeSchema.parse('sequenceDiagram\n  A->>B: Hello')).not.toThrow();
    });

    it('rejects empty code', () => {
      expect(() => DiagramCodeSchema.parse('')).toThrow();
    });

    it('rejects whitespace-only code', () => {
      expect(() => DiagramCodeSchema.parse('   ')).toThrow();
      expect(() => DiagramCodeSchema.parse('\n\n')).toThrow();
    });

    it('rejects code over 50000 characters', () => {
      const longCode = 'a'.repeat(50001);
      expect(() => DiagramCodeSchema.parse(longCode)).toThrow();
    });

    it('accepts exactly 50000 characters', () => {
      const maxCode = 'a'.repeat(50000);
      expect(() => DiagramCodeSchema.parse(maxCode)).not.toThrow();
    });
  });
});
