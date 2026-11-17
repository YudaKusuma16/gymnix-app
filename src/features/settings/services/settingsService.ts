/**
 * Settings Service for Supabase user_settings & local persistence
 * Reference: arsitektur_full_fitness_tracking_expo_supabase.md (Section 6.2)
 */

import { supabase } from '@/lib/supabase';
import { syncQueueService } from '@/features/workout/services/syncQueueService';
import { DistanceUnit, HeightUnit, WeightUnit } from '../types/settings.types';

export interface UserSettingsData {
  autoStartTimer: boolean;
  hapticCues: boolean;
  shareToFeed: boolean;
  weightUnit: WeightUnit;
  heightUnit: HeightUnit;
  distanceUnit: DistanceUnit;
}

const DEFAULT_SETTINGS: UserSettingsData = {
  autoStartTimer: true,
  hapticCues: true,
  shareToFeed: true,
  weightUnit: 'KG',
  heightUnit: 'CM',
  distanceUnit: 'KM',
};

export const settingsService = {
  async getSettings(): Promise<UserSettingsData> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return DEFAULT_SETTINGS;

      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error || !data) return DEFAULT_SETTINGS;

      return {
        autoStartTimer: data.notifications_enabled ?? true,
        hapticCues: data.haptic_feedback_enabled ?? true,
        shareToFeed: true,
        weightUnit: (data.preferred_units === 'imperial' ? 'LBS' : 'KG') as WeightUnit,
        heightUnit: (data.preferred_units === 'imperial' ? 'FT' : 'CM') as HeightUnit,
        distanceUnit: (data.preferred_units === 'imperial' ? 'MI' : 'KM') as DistanceUnit,
      };
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  async updateSettings(settings: Partial<UserSettingsData>): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id || 'local_user';

      const payload = {
        user_id: userId,
        preferred_units: (settings.weightUnit === 'LBS' ? 'imperial' : 'metric') as 'metric' | 'imperial',
        notifications_enabled: settings.autoStartTimer ?? true,
        haptic_feedback_enabled: settings.hapticCues ?? true,
        updated_at: new Date().toISOString(),
      };

      if (user) {
        await supabase.from('user_settings').upsert(payload);
      } else {
        syncQueueService.enqueue('settings', userId, 'UPDATE', payload);
      }

      return true;
    } catch (e) {
      console.warn('[SettingsService] Save warning:', e);
      return false;
    }
  },
};
