/**
 * Sync Queue Service for Offline-First / Outbox Synchronization
 * Reference: arsitektur_full_fitness_tracking_expo_supabase.md (Section 3.2, 10.3, 10.4)
 */

import { getDatabase } from '@/lib/sqlite';
import { supabase } from '@/lib/supabase';

export interface SyncQueueItem {
  id: string;
  entity_type: 'session' | 'log' | 'set' | 'profile' | 'settings';
  entity_id: string;
  operation: 'INSERT' | 'UPDATE' | 'DELETE';
  payload: string;
  status: 'pending' | 'syncing' | 'synced' | 'failed';
  retry_count: number;
  last_error?: string | null;
  created_at: string;
}

export const syncQueueService = {
  /**
   * Enqueue a sync task into SQLite outbox
   */
  enqueue(
    entityType: 'session' | 'log' | 'set' | 'profile' | 'settings',
    entityId: string,
    operation: 'INSERT' | 'UPDATE' | 'DELETE',
    payload: Record<string, any>
  ): boolean {
    const db = getDatabase();
    if (!db) return false;

    const id = `sync_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    try {
      db.runSync(
        `INSERT INTO sync_queue (id, entity_type, entity_id, operation, payload, status, retry_count, created_at)
         VALUES (?, ?, ?, ?, ?, 'pending', 0, ?)`,
        [id, entityType, entityId, operation, JSON.stringify(payload), now]
      );
      return true;
    } catch (err) {
      console.error('[SyncQueue] Error enqueueing operation:', err);
      return false;
    }
  },

  /**
   * Process pending items in sync_queue and send to Supabase
   */
  async processQueue(): Promise<{ synced: number; failed: number }> {
    const db = getDatabase();
    if (!db) return { synced: 0, failed: 0 };

    let synced = 0;
    let failed = 0;

    try {
      const items = db.getAllSync<SyncQueueItem>(
        `SELECT * FROM sync_queue WHERE status IN ('pending', 'failed') AND retry_count < 5 ORDER BY created_at ASC LIMIT 20`
      );

      if (items.length === 0) return { synced: 0, failed: 0 };

      for (const item of items) {
        db.runSync(`UPDATE sync_queue SET status = 'syncing' WHERE id = ?`, [item.id]);

        try {
          const parsedPayload = JSON.parse(item.payload);
          let success = false;

          switch (item.entity_type) {
            case 'session': {
              const { error } = await supabase.from('workout_sessions').upsert(parsedPayload);
              success = !error;
              if (error) throw error;
              break;
            }
            case 'log': {
              const { error } = await supabase.from('workout_logs').upsert(parsedPayload);
              success = !error;
              if (error) throw error;
              break;
            }
            case 'set': {
              const { error } = await supabase.from('workout_sets').upsert(parsedPayload);
              success = !error;
              if (error) throw error;
              break;
            }
            case 'profile': {
              const { error } = await supabase.from('profiles').upsert(parsedPayload);
              success = !error;
              if (error) throw error;
              break;
            }
            case 'settings': {
              const { error } = await supabase.from('user_settings').upsert(parsedPayload);
              success = !error;
              if (error) throw error;
              break;
            }
          }

          if (success) {
            db.runSync(
              `UPDATE sync_queue SET status = 'synced', retry_count = retry_count + 1 WHERE id = ?`,
              [item.id]
            );

            // Mark local entity as synced
            if (item.entity_type === 'session') {
              db.runSync(`UPDATE local_workout_sessions SET sync_status = 'synced' WHERE id = ?`, [item.entity_id]);
            } else if (item.entity_type === 'set') {
              db.runSync(`UPDATE local_workout_sets SET sync_status = 'synced' WHERE id = ?`, [item.entity_id]);
            }
            synced++;
          }
        } catch (itemErr: any) {
          failed++;
          db.runSync(
            `UPDATE sync_queue SET status = 'failed', retry_count = retry_count + 1, last_error = ? WHERE id = ?`,
            [itemErr?.message || String(itemErr), item.id]
          );
        }
      }
    } catch (err) {
      console.warn('[SyncQueue] Processing failed (likely offline):', err);
    }

    return { synced, failed };
  },

  /**
   * Get total pending operations count
   */
  getPendingCount(): number {
    const db = getDatabase();
    if (!db) return 0;
    try {
      const res = db.getFirstSync<{ count: number }>(
        `SELECT COUNT(*) as count FROM sync_queue WHERE status = 'pending'`
      );
      return res?.count || 0;
    } catch {
      return 0;
    }
  },
};
