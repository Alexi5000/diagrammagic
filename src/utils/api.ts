/**
 * API utility for generating Mermaid diagrams using GPT-4o-mini
 * 
 * Security: For authenticated users, API calls go through a secure backend proxy
 * (Edge Function) that uses server-side API keys. Guest users fall back to mock AI.
 */

import { generateDiagram as generateMockDiagram } from '@/lib/mockAI';
import { AIPromptSchema } from '@/lib/validation';
import { logger } from '@/lib/logger';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';

const EDGE_FUNCTION_NAME = 'generate-diagram';

/**
 * Generate a Mermaid diagram from a text prompt
 * 
 * For authenticated users: Uses secure Edge Function with server-side OpenAI API key
 * For guests: Falls back to mock AI for demo purposes
 */
export const generateMermaidDiagram = async (prompt: string): Promise<string> => {
  // Validate prompt input
  try {
    AIPromptSchema.parse(prompt);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(error.errors[0].message);
    }
    throw error;
  }

  // Check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    // Guest user - use mock AI for demo
    logger.debug('Guest user - using mock AI');
    return await generateMockDiagram(prompt);
  }

  // Authenticated user - use secure Edge Function
  try {
    logger.debug('Authenticated user - calling Edge Function');
    
    const { data, error } = await supabase.functions.invoke(EDGE_FUNCTION_NAME, {
      body: { prompt },
    });

    if (error) {
      logger.error('Edge Function error:', error);
      throw new Error(error.message || 'Failed to generate diagram');
    }

    if (!data?.diagram) {
      throw new Error('No diagram returned from AI service');
    }

    return data.diagram;
  } catch (error) {
    logger.error('Error in API call:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to generate diagram. Please try again later.');
  }
};
