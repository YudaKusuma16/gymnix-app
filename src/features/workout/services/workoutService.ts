/**
 * Workout Service with Hybrid Architecture (Local SQLite + Supabase Sync)
 * Reference: arsitektur_full_fitness_tracking_expo_supabase.md (Section 3.2, 6.7, 6.8, 6.9, 10.2)
 */

import { getDatabase } from '@/lib/sqlite';
import { supabase } from '@/lib/supabase';
import { syncQueueService } from './syncQueueService';
import { WorkoutSessionSummary } from '../types/workout.types';

export interface LocalWorkoutSessionRow {
  id: string;
  user_id: string;
  title: string | null;
  started_at: string;
  completed_at: string | null;
  duration_seconds: number;
  total_volume_kg: number;
  status: 'in_progress' | 'completed' | 'cancelled';
  sync_status: 'pending' | 'synced' | 'failed';
  updated_at: string;
}

let activeSessionInMemory: LocalWorkoutSessionRow | null = null;

type ActiveSessionListener = (session: LocalWorkoutSessionRow | null) => void;
const activeSessionListeners = new Set<ActiveSessionListener>();

function notifyActiveSessionChanged(session: LocalWorkoutSessionRow | null) {
  activeSessionListeners.forEach((listener) => listener(session));
}

export const workoutService = {
  subscribeActiveSession(listener: ActiveSessionListener): () => void {
    activeSessionListeners.add(listener);
    return () => {
      activeSessionListeners.delete(listener);
    };
  },
  /**
   * Start a new active workout session (persisted locally in SQLite immediately)
   */
  async startSession(title: string = 'Full Body Workout'): Promise<string> {
    const sessionId = `ws_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();
    let userId = 'local_athlete';

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) userId = user.id;
    } catch {
      // offline fallback
    }

    const newSessionRow: LocalWorkoutSessionRow = {
      id: sessionId,
      user_id: userId,
      title,
      started_at: now,
      completed_at: null,
      duration_seconds: 0,
      total_volume_kg: 0,
      status: 'in_progress',
      sync_status: 'pending',
      updated_at: now,
    };
    activeSessionInMemory = newSessionRow;

    const db = getDatabase();
    if (db) {
      try {
        // Cancel any previous stale in_progress session
        db.runSync(`UPDATE local_workout_sessions SET status = 'cancelled' WHERE status = 'in_progress'`);

        db.runSync(
          `INSERT INTO local_workout_sessions (id, user_id, title, started_at, status, sync_status, updated_at)
           VALUES (?, ?, ?, ?, 'in_progress', 'pending', ?)`,
          [sessionId, userId, title, now, now]
        );

        // Enqueue to outbox
        syncQueueService.enqueue('session', sessionId, 'INSERT', {
          id: sessionId,
          user_id: userId,
          title,
          started_at: now,
          status: 'in_progress',
        });
      } catch (err) {
        console.error('[WorkoutService] Error starting local session:', err);
      }
    }

    notifyActiveSessionChanged(newSessionRow);
    return sessionId;
  },

  /**
   * Cancel and discard an active workout session
   */
  async cancelSession(sessionId?: string): Promise<boolean> {
    activeSessionInMemory = null;
    notifyActiveSessionChanged(null);
    const db = getDatabase();
    if (db) {
      try {
        db.runSync(
          `UPDATE local_workout_sessions SET status = 'cancelled' WHERE status = 'in_progress' OR id = ?`,
          [sessionId || '']
        );
        if (sessionId) {
          db.runSync(
            `DELETE FROM local_workout_sets WHERE workout_log_id LIKE ?`,
            [`${sessionId}%`]
          );
        }
      } catch (err) {
        console.error('[WorkoutService] Error cancelling session:', err);
      }
    }
    notifyActiveSessionChanged(null);
    return true;
  },

  /**
   * Save or update an active set (SQLite first, then outbox)
   */
  async saveSet(params: {
    setId: string;
    logId: string;
    setNumber: number;
    weightKg: number;
    reps: number;
    completed: boolean;
  }): Promise<boolean> {
    const db = getDatabase();
    const now = new Date().toISOString();

    if (db) {
      try {
        db.runSync(
          `INSERT OR REPLACE INTO local_workout_sets (id, workout_log_id, set_number, weight_kg, reps, completed, updated_at, sync_status)
           VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`,
          [
            params.setId,
            params.logId,
            params.setNumber,
            params.weightKg,
            params.reps,
            params.completed ? 1 : 0,
            now,
          ]
        );

        // Enqueue to outbox for Supabase synchronization
        syncQueueService.enqueue('set', params.setId, 'INSERT', {
          id: params.setId,
          workout_log_id: params.logId,
          set_number: params.setNumber,
          weight_kg: params.weightKg,
          reps: params.reps,
          completed: params.completed,
          updated_at: now,
        });

        return true;
      } catch (err) {
        console.error('[WorkoutService] Error saving local set:', err);
      }
    }
    return false;
  },

  /**
   * Synchronously fetch saved sets for an active or past session
   */
  getSessionSets(sessionId: string): {
    setId: string;
    logId: string;
    setNumber: number;
    weightKg: number;
    reps: number;
    completed: boolean;
  }[] {
    const db = getDatabase();
    if (db && sessionId) {
      try {
        const rows = db.getAllSync<any>(
          `SELECT * FROM local_workout_sets WHERE id LIKE ? OR workout_log_id LIKE ? ORDER BY set_number ASC`,
          [`${sessionId}%`, `${sessionId}%`]
        );
        return rows.map((r) => ({
          setId: r.id,
          logId: r.workout_log_id,
          setNumber: r.set_number,
          weightKg: r.weight_kg,
          reps: r.reps,
          completed: Boolean(r.completed),
        }));
      } catch (err) {
        console.warn('[WorkoutService] Error reading local sets:', err);
      }
    }
    return [];
  },

  /**
   * Log completed workout session (Local SQLite -> Sync Queue -> Supabase)
   */
  async logSession(summary: WorkoutSessionSummary): Promise<boolean> {
    const sessionId = summary.id || `ws_${Date.now()}`;
    const now = summary.finishedAt || new Date().toISOString();
    let userId = 'local_athlete';

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) userId = user.id;
    } catch {
      // offline fallback
    }

    const payload = {
      id: sessionId,
      user_id: userId,
      title: summary.title || 'Full Body Workout',
      duration_seconds: summary.durationSeconds,
      status: 'completed',
      completed_at: now,
      notes: `Completed ${summary.completedSetsCount} sets with volume ${summary.totalVolumeKg ?? 0} kg`,
    };

    activeSessionInMemory = null;
    notifyActiveSessionChanged(null);

    // 1. Write to local SQLite
    const db = getDatabase();
    if (db) {
      try {
        db.runSync(
          `INSERT OR REPLACE INTO local_workout_sessions (id, user_id, title, started_at, completed_at, duration_seconds, total_volume_kg, status, sync_status, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, 'completed', 'pending', ?)`,
          [
            sessionId,
            userId,
            payload.title,
            new Date(Date.now() - summary.durationSeconds * 1000).toISOString(),
            now,
            summary.durationSeconds,
            summary.totalVolumeKg || 0,
            now,
          ]
        );
      } catch (err) {
        console.error('[WorkoutService] Error updating local session:', err);
      }
    }

    // 2. Enqueue to Outbox
    syncQueueService.enqueue('session', sessionId, 'INSERT', payload);

    // 3. Trigger immediate sync (opportunistic)
    syncQueueService.processQueue().catch((e) => {
      console.log('[WorkoutService] Queued for later sync:', e);
    });

    return true;
  },

  /**
   * Fetch recent workout history for user (Merged from SQLite & Supabase)
   */
  async getWorkoutHistory(limit: number = 20) {
    let localRows: any[] = [];
    const db = getDatabase();
    if (db) {
      try {
        localRows = db.getAllSync(
          `SELECT * FROM local_workout_sessions WHERE status = 'completed' ORDER BY started_at DESC LIMIT ?`,
          [limit]
        );
      } catch (err) {
        console.warn('[WorkoutService] Could not read local sessions:', err);
      }
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return localRows;

      const { data, error } = await supabase
        .from('workout_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('started_at', { ascending: false })
        .limit(limit);

      if (error || !data) return localRows;

      // Merge and deduplicate by ID
      const map = new Map<string, any>();
      localRows.forEach((r) => map.set(r.id, r));
      data.forEach((r) => map.set(r.id, r));

      return Array.from(map.values()).sort(
        (a, b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime()
      );
    } catch {
      return localRows;
    }
  },

  /**
   * Check for currently in-progress active workout
   */
  getActiveSession(): LocalWorkoutSessionRow | null {
    const db = getDatabase();
    if (db) {
      try {
        const row = db.getFirstSync<LocalWorkoutSessionRow>(
          `SELECT * FROM local_workout_sessions WHERE status = 'in_progress' ORDER BY started_at DESC LIMIT 1`
        );
        if (row) return row;
      } catch {
        // fallback to in-memory
      }
    }
    return activeSessionInMemory?.status === 'in_progress' ? activeSessionInMemory : null;
  },

  /**
   * Fetch active workout plans from Supabase or local templates
   */
  async getWorkoutPlans() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('workout_plans')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_archived', false)
          .order('created_at', { ascending: false });

        if (data && data.length > 0) return data;
      }
    } catch {
      // offline fallback
    }

    return [];
  },
};
