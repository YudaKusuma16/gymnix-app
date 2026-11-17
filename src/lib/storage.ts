/**
 * Supabase Storage Integration for Gymnix
 * Reference: arsitektur_full_fitness_tracking_expo_supabase.md (Section 7.6)
 */

import { supabase } from '@/lib/supabase';

export type StorageBucket = 'avatars' | 'progress-photos' | 'user-attachments';

export interface UploadResult {
  path: string;
  url: string | null;
  error: Error | null;
}

/**
 * Upload a local file (e.g. from expo-image-picker file:// uri) to a Supabase Storage bucket.
 */
export async function uploadFile(
  bucket: StorageBucket,
  path: string,
  localUri: string,
  options?: {
    contentType?: string;
    upsert?: boolean;
  }
): Promise<UploadResult> {
  try {
    // 1. Fetch local file URI into ArrayBuffer/Blob
    const response = await fetch(localUri);
    const arrayBuffer = await response.arrayBuffer();

    // Deduce content type from uri or fallback
    const contentType =
      options?.contentType ||
      (localUri.endsWith('.png') ? 'image/png' : 'image/jpeg');

    // 2. Upload to Supabase Storage
    const { data, error } = await supabase.storage.from(bucket).upload(path, arrayBuffer, {
      contentType,
      upsert: options?.upsert ?? true,
    });

    if (error) {
      console.error(`[Storage] Upload error to bucket "${bucket}":`, error.message);
      return { path: '', url: null, error };
    }

    // 3. Resolve URL
    let publicUrl: string | null = null;
    if (bucket === 'avatars') {
      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
      publicUrl = urlData.publicUrl;
    }

    return {
      path: data.path,
      url: publicUrl,
      error: null,
    };
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error(`[Storage] Unexpected error during upload to "${bucket}":`, error.message);
    return { path: '', url: null, error };
  }
}

/**
 * Get Public URL for public bucket files (e.g. avatars)
 */
export function getPublicUrl(bucket: StorageBucket, path: string): string {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Get Signed URL for private bucket files (e.g. progress-photos)
 */
export async function getSignedUrl(
  bucket: StorageBucket,
  path: string,
  expiresInSeconds: number = 3600
): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, expiresInSeconds);

  if (error) {
    console.error(`[Storage] Error generating signed URL for "${path}":`, error.message);
    return null;
  }

  return data.signedUrl;
}

/**
 * Delete a file from a Supabase Storage bucket
 */
export async function deleteFile(bucket: StorageBucket, path: string): Promise<boolean> {
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) {
    console.error(`[Storage] Error deleting file "${path}":`, error.message);
    return false;
  }
  return true;
}

/**
 * High-level helper: Upload user avatar to avatars bucket
 * Uses standard path: <userId>/avatar_<timestamp>.jpg
 */
export async function uploadAvatar(
  userId: string,
  localUri: string
): Promise<{ path: string; publicUrl: string } | null> {
  const ext = localUri.split('.').pop()?.toLowerCase() || 'jpg';
  const cleanExt = ['jpg', 'jpeg', 'png', 'webp'].includes(ext) ? ext : 'jpg';
  const path = `${userId}/avatar_${Date.now()}.${cleanExt}`;

  const result = await uploadFile('avatars', path, localUri, {
    contentType: `image/${cleanExt === 'jpg' ? 'jpeg' : cleanExt}`,
    upsert: true,
  });

  if (result.error || !result.url) {
    return null;
  }

  return {
    path: result.path,
    publicUrl: result.url,
  };
}

/**
 * High-level helper: Upload progress photo to private progress-photos bucket
 * Uses standard path: <userId>/progress/<photoType>_<timestamp>.jpg
 */
export async function uploadProgressPhoto(
  userId: string,
  localUri: string,
  photoType: 'front' | 'side' | 'back' = 'front'
): Promise<{ path: string; signedUrl: string } | null> {
  const ext = localUri.split('.').pop()?.toLowerCase() || 'jpg';
  const cleanExt = ['jpg', 'jpeg', 'png', 'webp'].includes(ext) ? ext : 'jpg';
  const path = `${userId}/progress/${photoType}_${Date.now()}.${cleanExt}`;

  const result = await uploadFile('progress-photos', path, localUri, {
    contentType: `image/${cleanExt === 'jpg' ? 'jpeg' : cleanExt}`,
    upsert: true,
  });

  if (result.error) {
    return null;
  }

  const signedUrl = await getSignedUrl('progress-photos', result.path, 3600);
  if (!signedUrl) return null;

  return {
    path: result.path,
    signedUrl,
  };
}
