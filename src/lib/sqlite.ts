/**
 * Gymnix Local SQLite Database for Hybrid / Local-First Architecture
 * Reference: arsitektur_full_fitness_tracking_expo_supabase.md (Section 3.2, 10.2, 10.3)
 */

import type { SQLiteDatabase } from 'expo-sqlite';
import { Platform } from 'react-native';

const DB_NAME = 'gymnix.db';

let dbInstance: SQLiteDatabase | null = null;
let sqliteAvailable: boolean | null = null;

function isExpoSQLiteAvailable(): boolean {
  if (Platform.OS === 'web') return false;
  try {
    // Check if native module exists before requiring expo-sqlite to avoid uncaught native module error in standard Expo Go
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { requireOptionalNativeModule } = require('expo-modules-core');
    return Boolean(requireOptionalNativeModule('ExpoSQLite'));
  } catch {
    return false;
  }
}

function getSQLiteModule(): typeof import('expo-sqlite') | null {
  if (sqliteAvailable === false) return null;
  if (!isExpoSQLiteAvailable()) {
    sqliteAvailable = false;
    return null;
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = require('expo-sqlite');
    sqliteAvailable = true;
    return mod;
  } catch {
    sqliteAvailable = false;
    return null;
  }
}

export function getDatabase(): SQLiteDatabase | null {
  if (Platform.OS === 'web') {
    return null; // SQLite native is bypassed on web
  }
  if (!dbInstance) {
    try {
      const sqlite = getSQLiteModule();
      if (!sqlite) return null;
      dbInstance = sqlite.openDatabaseSync(DB_NAME);
      initLocalSchema(dbInstance);
    } catch (err) {
      console.warn('[SQLite] Failed to open SQLite database:', err);
      return null;
    }
  }
  return dbInstance;
}

/**
 * Initialize local SQLite schema (Section 10.2)
 */
function initLocalSchema(db: SQLiteDatabase) {
  try {
    db.execSync(`
      PRAGMA journal_mode = WAL;
      PRAGMA foreign_keys = ON;

      -- 1. Local Workout Sessions
      CREATE TABLE IF NOT EXISTS local_workout_sessions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        title TEXT,
        started_at TEXT NOT NULL,
        completed_at TEXT,
        duration_seconds INTEGER DEFAULT 0,
        total_volume_kg REAL DEFAULT 0,
        status TEXT NOT NULL, -- 'in_progress' | 'completed' | 'cancelled'
        sync_status TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'synced' | 'failed'
        updated_at TEXT NOT NULL
      );

      -- 2. Local Workout Logs (Exercises within session)
      CREATE TABLE IF NOT EXISTS local_workout_logs (
        id TEXT PRIMARY KEY,
        session_id TEXT NOT NULL,
        exercise_id TEXT NOT NULL,
        exercise_name TEXT,
        order_index INTEGER NOT NULL,
        updated_at TEXT NOT NULL,
        sync_status TEXT NOT NULL DEFAULT 'pending',
        FOREIGN KEY (session_id) REFERENCES local_workout_sessions(id) ON DELETE CASCADE
      );

      -- 3. Local Workout Sets
      CREATE TABLE IF NOT EXISTS local_workout_sets (
        id TEXT PRIMARY KEY,
        workout_log_id TEXT NOT NULL,
        set_number INTEGER NOT NULL,
        reps INTEGER,
        weight_kg REAL,
        duration_seconds INTEGER,
        distance_meters REAL,
        completed INTEGER NOT NULL DEFAULT 0,
        updated_at TEXT NOT NULL,
        sync_status TEXT NOT NULL DEFAULT 'pending',
        FOREIGN KEY (workout_log_id) REFERENCES local_workout_logs(id) ON DELETE CASCADE
      );

      -- 4. Outbox / Sync Queue (Section 10.2 & 10.3)
      CREATE TABLE IF NOT EXISTS sync_queue (
        id TEXT PRIMARY KEY,
        entity_type TEXT NOT NULL, -- 'session' | 'log' | 'set' | 'profile' | 'settings'
        entity_id TEXT NOT NULL,
        operation TEXT NOT NULL,   -- 'INSERT' | 'UPDATE' | 'DELETE'
        payload TEXT NOT NULL,     -- JSON string
        status TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'syncing' | 'synced' | 'failed'
        retry_count INTEGER NOT NULL DEFAULT 0,
        last_error TEXT,
        created_at TEXT NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_sync_queue_status ON sync_queue (status, created_at);

      -- 5. Offline Exercises Cache (Section 3.3)
      CREATE TABLE IF NOT EXISTS cached_exercises (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT,
        equipment TEXT,
        primary_muscles TEXT, -- JSON array
        secondary_muscles TEXT,
        instructions TEXT,
        images TEXT,
        updated_at TEXT NOT NULL
      );

      -- 6. Offline Profile Cache
      CREATE TABLE IF NOT EXISTS cached_profile (
        id TEXT PRIMARY KEY,
        display_name TEXT NOT NULL,
        username TEXT,
        avatar_url TEXT,
        height_cm REAL,
        weight_kg REAL,
        bio TEXT,
        home_gym_name TEXT,
        fitness_goal TEXT,
        experience_level TEXT,
        training_frequency TEXT,
        updated_at TEXT NOT NULL
      );
    `);
  } catch (err) {
    console.error('[SQLite] Failed to initialize local database schema:', err);
  }
}


