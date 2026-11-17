import { supabase } from '@/lib/supabase';
import { getDatabase } from '@/lib/sqlite';
import { ExerciseItem } from '../types/exercise.types';

export const exerciseService = {
  /**
   * Synchronously read exercises from local SQLite cache for instant frame 0 rendering
   */
  getCachedSync(): ExerciseItem[] {
    const db = getDatabase();
    if (db) {
      try {
        const rows = db.getAllSync<any>(`SELECT * FROM cached_exercises ORDER BY name ASC`);
        if (rows.length > 0) {
          return rows.map((r) => ({
            id: r.id,
            name: r.name,
            category: r.category,
            equipment: r.equipment,
            primary_muscles: JSON.parse(r.primary_muscles || '[]'),
            instructions: JSON.parse(r.instructions || '[]'),
            images: JSON.parse(r.images || '[]'),
          })) as ExerciseItem[];
        }
      } catch (localErr) {
        console.warn('[ExerciseService] Error reading sync local cache:', localErr);
      }
    }
    return [];
  },

  /**
   * Fetch all exercises from Supabase with SQLite offline cache (Hybrid Architecture)
   */
  async getAll(): Promise<ExerciseItem[]> {
    try {
      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (error) throw error;

      const exercises = (data as unknown as ExerciseItem[]) || [];

      // Cache into local SQLite for offline access
      const db = getDatabase();
      if (db && exercises.length > 0) {
        try {
          const now = new Date().toISOString();
          db.withTransactionSync(() => {
            for (const ex of exercises) {
              db.runSync(
                `INSERT OR REPLACE INTO cached_exercises (id, name, category, equipment, primary_muscles, instructions, images, updated_at)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                  ex.id,
                  ex.name,
                  ex.category || '',
                  ex.equipment || '',
                  JSON.stringify(ex.primary_muscles || []),
                  JSON.stringify(ex.instructions || []),
                  JSON.stringify(ex.images || []),
                  now,
                ]
              );
            }
          });
        } catch (cacheErr) {
          console.warn('[ExerciseService] Failed to cache exercises locally:', cacheErr);
        }
      }

      return exercises;
    } catch (err) {
      console.warn('[ExerciseService] Network error, reading from local SQLite cache:', err);
      // Read from local SQLite
      const db = getDatabase();
      if (db) {
        try {
          const rows = db.getAllSync<any>(`SELECT * FROM cached_exercises ORDER BY name ASC`);
          if (rows.length > 0) {
            return rows.map((r) => ({
              id: r.id,
              name: r.name,
              category: r.category,
              equipment: r.equipment,
              primary_muscles: JSON.parse(r.primary_muscles || '[]'),
              instructions: JSON.parse(r.instructions || '[]'),
              images: JSON.parse(r.images || '[]'),
            })) as ExerciseItem[];
          }
        } catch (localErr) {
          console.error('[ExerciseService] Error reading local cache:', localErr);
        }
      }
      return [];
    }
  },

  /**
   * Search and filter exercises with pagination (Section 9.2)
   */
  async searchExercises(params: {
    query?: string;
    category?: string;
    equipment?: string;
    muscle?: string;
    limit?: number;
    offset?: number;
  }): Promise<ExerciseItem[]> {
    try {
      let q = supabase
        .from('exercises')
        .select('*')
        .eq('is_active', true);

      if (params.query?.trim()) {
        q = q.ilike('name', `%${params.query.trim()}%`);
      }

      if (params.category && params.category !== 'All') {
        q = q.eq('category', params.category.toLowerCase());
      }

      if (params.equipment && params.equipment !== 'All') {
        q = q.eq('equipment', params.equipment.toLowerCase());
      }

      if (params.muscle && params.muscle !== 'All') {
        q = q.contains('primary_muscles', [params.muscle.toLowerCase()]);
      }

      const limit = params.limit ?? 50;
      const offset = params.offset ?? 0;
      q = q.order('name', { ascending: true }).range(offset, offset + limit - 1);

      const { data, error } = await q;
      if (error) throw error;

      return (data as unknown as ExerciseItem[]) || [];
    } catch {
      // Local filter fallback
      const all = await this.getAll();
      return all.filter((ex) => {
        if (params.query && !ex.name.toLowerCase().includes(params.query.toLowerCase())) return false;
        if (params.equipment && params.equipment !== 'All' && ex.equipment?.toLowerCase() !== params.equipment.toLowerCase()) return false;
        return true;
      });
    }
  },

  /**
   * Fetch a single exercise by ID
   */
  async getById(id: string): Promise<ExerciseItem | null> {
    try {
      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as unknown as ExerciseItem;
    } catch {
      // Fallback from local SQLite
      const db = getDatabase();
      if (db) {
        const row = db.getFirstSync<any>(`SELECT * FROM cached_exercises WHERE id = ?`, [id]);
        if (row) {
          return {
            id: row.id,
            name: row.name,
            category: row.category,
            equipment: row.equipment,
            primary_muscles: JSON.parse(row.primary_muscles || '[]'),
            instructions: JSON.parse(row.instructions || '[]'),
            images: JSON.parse(row.images || '[]'),
          } as ExerciseItem;
        }
      }
      return null;
    }
  },

  /**
   * Toggle exercise favorite for current user (Section 6.4)
   */
  async toggleFavorite(exerciseId: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data: existing } = await supabase
        .from('exercise_favorites')
        .select('exercise_id')
        .eq('user_id', user.id)
        .eq('exercise_id', exerciseId)
        .maybeSingle();

      if (existing) {
        await supabase
          .from('exercise_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('exercise_id', exerciseId);
        return false;
      } else {
        await supabase
          .from('exercise_favorites')
          .insert({ user_id: user.id, exercise_id: exerciseId });
        return true;
      }
    } catch (e) {
      console.error('[ExerciseService] toggleFavorite error:', e);
      return false;
    }
  },

  /**
   * Get favorite exercise IDs for current user
   */
  async getFavoriteIds(): Promise<string[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('exercise_favorites')
        .select('exercise_id')
        .eq('user_id', user.id);

      if (error || !data) return [];
      return data.map((d) => d.exercise_id);
    } catch {
      return [];
    }
  },
};
