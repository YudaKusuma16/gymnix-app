import { supabase } from '@/lib/supabase';
import { ExerciseItem } from '../types/exercise.types';

export const exerciseService = {
  /**
   * Fetch all exercises from Supabase
   */
  async getAll(): Promise<ExerciseItem[]> {
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching exercises from Supabase:', error.message);
      throw error;
    }

    return (data as ExerciseItem[]) || [];
  },

  /**
   * Fetch a single exercise by ID
   */
  async getById(id: string): Promise<ExerciseItem | null> {
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching exercise ${id}:`, error.message);
      return null;
    }

    return data as ExerciseItem;
  },
};
