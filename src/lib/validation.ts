import { z } from 'zod';

/**
 * Validation schemas for user inputs
 * Prevents data corruption and potential injection attacks
 */

export const DiagramTitleSchema = z.string()
  .trim()
  .min(1, "Title cannot be empty")
  .max(100, "Title must be less than 100 characters")
  .regex(/^[a-zA-Z0-9\s\-_.,!?()\[\]\/&]+$/, "Title contains invalid characters");

export const DiagramDescriptionSchema = z.string()
  .trim()
  .max(500, "Description must be less than 500 characters")
  .optional()
  .or(z.literal(''));

export const TagSchema = z.string()
  .trim()
  .toLowerCase()
  .min(1, "Tag cannot be empty")
  .max(30, "Tag must be less than 30 characters")
  .regex(/^[a-z0-9-]+$/, "Tags must contain only lowercase letters, numbers, and hyphens");

export const AIPromptSchema = z.string()
  .trim()
  .min(3, "Prompt must be at least 3 characters")
  .max(1000, "Prompt must be less than 1000 characters");

export const DiagramCodeSchema = z.string()
  .trim()
  .min(1, "Diagram code cannot be empty")
  .max(50000, "Diagram code is too large");
