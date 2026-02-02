import { supabase } from '@/integrations/supabase/client';
import { Diagram } from '@/types';
import { getDiagrams as getLocalDiagrams, clearAllDiagrams as clearLocalDiagrams } from './storage';

export interface CloudDiagram {
  id: string;
  user_id: string;
  title: string;
  code: string;
  type: string;
  description: string | null;
  tags: string[];
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
}

// Convert cloud diagram to app diagram format
function toAppDiagram(cloud: CloudDiagram): Diagram {
  return {
    id: cloud.id,
    title: cloud.title,
    code: cloud.code,
    type: cloud.type as Diagram['type'],
    description: cloud.description || undefined,
    tags: cloud.tags || [],
    createdAt: cloud.created_at,
    updatedAt: cloud.updated_at,
  };
}

// Convert app diagram to cloud format
function toCloudFormat(diagram: Omit<Diagram, 'id' | 'createdAt' | 'updatedAt'>, userId: string) {
  return {
    user_id: userId,
    title: diagram.title,
    code: diagram.code,
    type: diagram.type,
    description: diagram.description || null,
    tags: diagram.tags || [],
    is_favorite: false,
  };
}

export async function getCloudDiagrams(): Promise<Diagram[]> {
  const { data, error } = await supabase
    .from('diagrams')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return (data as CloudDiagram[]).map(toAppDiagram);
}

export async function saveCloudDiagram(
  userId: string, 
  diagram: Omit<Diagram, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Diagram> {
  const { data, error } = await supabase
    .from('diagrams')
    .insert(toCloudFormat(diagram, userId))
    .select()
    .single();

  if (error) throw error;
  return toAppDiagram(data as CloudDiagram);
}

export async function updateCloudDiagram(
  id: string, 
  updates: Partial<Omit<Diagram, 'id' | 'createdAt'>>
): Promise<Diagram> {
  const cloudUpdates: Record<string, unknown> = {};
  
  if (updates.title !== undefined) cloudUpdates.title = updates.title;
  if (updates.code !== undefined) cloudUpdates.code = updates.code;
  if (updates.type !== undefined) cloudUpdates.type = updates.type;
  if (updates.description !== undefined) cloudUpdates.description = updates.description;
  if (updates.tags !== undefined) cloudUpdates.tags = updates.tags;

  const { data, error } = await supabase
    .from('diagrams')
    .update(cloudUpdates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return toAppDiagram(data as CloudDiagram);
}

export async function deleteCloudDiagram(id: string): Promise<void> {
  const { error } = await supabase
    .from('diagrams')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function syncLocalToCloud(userId: string): Promise<number> {
  const localDiagrams = getLocalDiagrams();
  
  if (localDiagrams.length === 0) return 0;

  const cloudDiagrams = localDiagrams.map(d => toCloudFormat({
    title: d.title,
    code: d.code,
    type: d.type,
    description: d.description,
    tags: d.tags,
  }, userId));

  const { error } = await supabase
    .from('diagrams')
    .insert(cloudDiagrams);

  if (error) throw error;

  // Clear local storage after successful sync
  clearLocalDiagrams();
  
  return localDiagrams.length;
}
