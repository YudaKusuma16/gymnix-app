import type { SQLiteDatabase } from 'expo-sqlite';

/**
 * Web fallback for Gymnix SQLite database.
 * SQLite native is bypassed on web.
 */
export function getDatabase(): SQLiteDatabase | null {
  return null;
}
