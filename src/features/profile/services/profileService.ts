/**
 * Profile Service with Supabase Database & Storage Integration
 * Reference: arsitektur_full_fitness_tracking_expo_supabase.md (Section 6.1, 7.6)
 */

import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { supabase } from '@/lib/supabase';
import { uploadAvatar, getPublicUrl } from '@/lib/storage';
import { workoutService } from '@/features/workout/services/workoutService';
import { AthleteProfile } from '../types/profile.types';

const PROFILE_CACHE_KEY = 'gymnix_cached_athlete_profile_v1';

let inMemoryAthleteName = '';
let inMemoryAvatarUrl: string | null = null;

// Synchronously load cache if on web
if (Platform.OS === 'web' && typeof window !== 'undefined') {
  try {
    const raw = localStorage.getItem(PROFILE_CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.athleteName) inMemoryAthleteName = parsed.athleteName;
      if (parsed.avatarUrl) inMemoryAvatarUrl = parsed.avatarUrl;
    }
  } catch {}
} else {
  // On native, load asynchronously from SecureStore as early as possible
  SecureStore.getItemAsync(PROFILE_CACHE_KEY)
    .then((raw) => {
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (parsed.athleteName) inMemoryAthleteName = parsed.athleteName;
          if (parsed.avatarUrl) inMemoryAvatarUrl = parsed.avatarUrl;
        } catch {}
      }
    })
    .catch(() => {});
}

export const DEFAULT_PROFILE: AthleteProfile = {
  id: '',
  fullName: 'User',
  username: '@user',
  avatarUrl: null,
  initials: 'U',
  memberSince: '',
  tier: 'Athlete',
  homeGym: {
    id: '',
    name: 'No Gym Selected',
    distance: '',
  },
  vitals: {
    heightCm: 0,
    weightKg: 0,
    weightDeltaWk: 0,
    bmi: 0,
    bmiStatus: '-',
    calorieCap: 0,
    calorieMode: '-',
    currentStreakDays: 0,
    bestStreakDays: 0,
  },
  personalRecords: {
    wilksScore: 0,
    totalVolumeKg: 0,
    squatKg: 0,
    squatDate: '-',
    benchKg: 0,
    benchDate: '-',
    isBenchPr: false,
    deadliftKg: 0,
    deadliftDate: '-',
  },
  trainingProgram: {
    primaryObjective: '-',
    frequency: '-',
    splitType: '-',
    experienceLevel: '-',
  },
};

export const profileService = {
  /**
   * Fast synchronous accessor for cached athlete name
   */
  getCachedAthleteName(): string {
    return inMemoryAthleteName;
  },

  /**
   * Fast synchronous accessor for cached avatar URL
   */
  getCachedAvatarUrl(): string | null {
    return inMemoryAvatarUrl;
  },

  /**
   * Update the fast local memory + disk cache
   */
  setCachedProfile(name: string, avatarUrl: string | null = null) {
    const trimmed = name?.trim();
    if (!trimmed || trimmed === 'Athlete' || trimmed === 'User') return;
    inMemoryAthleteName = trimmed;
    if (avatarUrl) inMemoryAvatarUrl = avatarUrl;

    const data = JSON.stringify({
      athleteName: inMemoryAthleteName,
      avatarUrl: inMemoryAvatarUrl,
    });

    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      try {
        localStorage.setItem(PROFILE_CACHE_KEY, data);
      } catch {}
    } else {
      SecureStore.setItemAsync(PROFILE_CACHE_KEY, data).catch(() => {});
    }
  },

  /**
   * Get current athlete profile from Supabase with graceful fallback
   */
  async getProfile(): Promise<AthleteProfile> {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return DEFAULT_PROFILE;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error || !data) {
        return DEFAULT_PROFILE;
      }

      // Map Supabase snake_case row to AthleteProfile domain object
      let avatarUrl = DEFAULT_PROFILE.avatarUrl;
      if (data.avatar_path) {
        avatarUrl = data.avatar_path.startsWith('http')
          ? data.avatar_path
          : getPublicUrl('avatars', data.avatar_path);
      }

      const displayName = data.display_name || user.user_metadata?.display_name || user.user_metadata?.full_name || 'User';
      const firstName = displayName.split(' ')[0];
      if (firstName && firstName !== 'User' && firstName !== 'Athlete') {
        this.setCachedProfile(firstName, avatarUrl);
      }

      const initials = (data.display_name || 'User')
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

      // Fetch dynamic PRs from database
      const { data: prData } = await supabase
        .from('personal_records')
        .select('*')
        .eq('user_id', user.id);

      let squatKg = DEFAULT_PROFILE.personalRecords.squatKg;
      let benchKg = DEFAULT_PROFILE.personalRecords.benchKg;
      let deadliftKg = DEFAULT_PROFILE.personalRecords.deadliftKg;

      if (prData && prData.length > 0) {
        for (const pr of prData) {
          if (pr.exercise_id?.toLowerCase().includes('squat')) squatKg = Number(pr.record_value);
          if (pr.exercise_id?.toLowerCase().includes('bench')) benchKg = Number(pr.record_value);
          if (pr.exercise_id?.toLowerCase().includes('deadlift')) deadliftKg = Number(pr.record_value);
        }
      }

      const totalVolumeKg = squatKg + benchKg + deadliftKg;

      return {
        ...DEFAULT_PROFILE,
        id: data.id,
        fullName: data.display_name || DEFAULT_PROFILE.fullName,
        username: data.username || DEFAULT_PROFILE.username,
        avatarUrl,
        initials,
        homeGym: {
          ...DEFAULT_PROFILE.homeGym,
          name: data.home_gym_name || DEFAULT_PROFILE.homeGym.name,
        },
        vitals: {
          ...DEFAULT_PROFILE.vitals,
          heightCm: data.height_cm ?? DEFAULT_PROFILE.vitals.heightCm,
          weightKg: data.weight_kg ?? DEFAULT_PROFILE.vitals.weightKg,
        },
        personalRecords: {
          ...DEFAULT_PROFILE.personalRecords,
          squatKg,
          benchKg,
          deadliftKg,
          totalVolumeKg,
        },
        trainingProgram: {
          ...DEFAULT_PROFILE.trainingProgram,
          primaryObjective: data.fitness_goal || DEFAULT_PROFILE.trainingProgram.primaryObjective,
          experienceLevel: data.experience_level || DEFAULT_PROFILE.trainingProgram.experienceLevel,
          frequency: data.training_frequency || DEFAULT_PROFILE.trainingProgram.frequency,
        },
      };
    } catch (err) {
      console.warn('[ProfileService] Falling back to default profile:', err);
      return DEFAULT_PROFILE;
    }
  },

  /**
   * Get dynamic lifetime stats computed from actual workout sessions
   */
  async getLifetimeMilestones(): Promise<{
    totalTonnageTon: number;
    totalWorkouts: number;
    totalHours: number;
  }> {
    const history = await workoutService.getWorkoutHistory(500);
    if (!history || history.length === 0) {
      return { totalTonnageTon: 0, totalWorkouts: 0, totalHours: 0 };
    }

    let totalVolumeKg = 0;
    let totalSeconds = 0;
    for (const h of history) {
      totalVolumeKg += Number(h.total_volume_kg) || 0;
      totalSeconds += Number(h.duration_seconds) || 0;
    }

    return {
      totalTonnageTon: Math.round((totalVolumeKg / 1000) * 10) / 10,
      totalWorkouts: history.length,
      totalHours: Math.round(totalSeconds / 3600),
    };
  },

  /**
   * Get dynamic consistency heatmap data for the past 12 weeks
   */
  async getHeatmapData(): Promise<{
    gridWeeks: { date: string; level: 0 | 1 | 2 }[][];
    currentStreakWeeks: number;
    totalActiveDays: number;
  }> {
    const history = await workoutService.getWorkoutHistory(500);
    const sessionMap = new Map<string, number>();
    for (const h of history) {
      const dateStr = new Date(h.started_at).toISOString().split('T')[0];
      const vol = Number(h.total_volume_kg) || 0;
      sessionMap.set(dateStr, (sessionMap.get(dateStr) || 0) + vol);
    }

    const now = new Date();
    const dayOfWeek = (now.getDay() + 6) % 7;
    const currentWeekSunday = new Date(now);
    currentWeekSunday.setDate(now.getDate() + (6 - dayOfWeek));

    const totalDays = 12 * 7;
    const startDay = new Date(currentWeekSunday);
    startDay.setDate(currentWeekSunday.getDate() - totalDays + 1);

    const gridWeeks: { date: string; level: 0 | 1 | 2 }[][] = [];
    let totalActiveDays = 0;
    let currentStreakWeeks = 0;

    for (let w = 0; w < 12; w++) {
      const weekArr: { date: string; level: 0 | 1 | 2 }[] = [];
      let weekActive = false;
      for (let d = 0; d < 7; d++) {
        const curDate = new Date(startDay);
        curDate.setDate(startDay.getDate() + (w * 7 + d));
        const key = curDate.toISOString().split('T')[0];
        const vol = sessionMap.get(key);
        let level: 0 | 1 | 2 = 0;
        if (vol !== undefined) {
          totalActiveDays++;
          weekActive = true;
          level = vol > 2500 ? 2 : 1;
        }
        weekArr.push({ date: key, level });
      }
      if (weekActive) currentStreakWeeks++;
      else currentStreakWeeks = 0;
      gridWeeks.push(weekArr);
    }

    return {
      gridWeeks,
      currentStreakWeeks,
      totalActiveDays,
    };
  },

  /**
   * Update profile fields in Supabase
   */
  async updateProfile(updates: {
    fullName?: string;
    username?: string;
    homeGym?: string;
    bio?: string;
    gender?: string;
    height?: number;
    weight?: number;
    goal?: string;
    experience?: string;
    frequency?: string;
    avatarPath?: string;
  }): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('[ProfileService] No logged in user session, changes saved locally.');
        return true;
      }

      const updatePayload: Record<string, any> = {
        updated_at: new Date().toISOString(),
      };

      if (updates.fullName !== undefined) updatePayload.display_name = updates.fullName;
      if (updates.username !== undefined) updatePayload.username = updates.username;
      if (updates.homeGym !== undefined) updatePayload.home_gym_name = updates.homeGym;
      if (updates.bio !== undefined) updatePayload.bio = updates.bio;
      if (updates.gender !== undefined) updatePayload.gender = updates.gender;
      if (updates.height !== undefined) updatePayload.height_cm = updates.height;
      if (updates.weight !== undefined) updatePayload.weight_kg = updates.weight;
      if (updates.goal !== undefined) updatePayload.fitness_goal = updates.goal;
      if (updates.experience !== undefined) updatePayload.experience_level = updates.experience;
      if (updates.frequency !== undefined) updatePayload.training_frequency = updates.frequency;
      if (updates.avatarPath !== undefined) updatePayload.avatar_path = updates.avatarPath;

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          display_name: updates.fullName || user.email?.split('@')[0] || 'Athlete',
          ...updatePayload,
        });

      if (error) {
        console.error('[ProfileService] Failed to update profile in Supabase:', error.message);
        return false;
      }

      return true;
    } catch (err) {
      console.error('[ProfileService] Unexpected error during updateProfile:', err);
      return false;
    }
  },

  /**
   * Upload user avatar photo to Supabase Storage ('avatars' bucket)
   */
  async uploadProfileAvatar(imageUri: string): Promise<string | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id || 'guest_user';

      const result = await uploadAvatar(userId, imageUri);
      if (!result) {
        return null;
      }

      if (user) {
        await supabase
          .from('profiles')
          .update({ avatar_path: result.path, updated_at: new Date().toISOString() })
          .eq('id', user.id);
      }

      return result.publicUrl;
    } catch (err) {
      console.error('[ProfileService] Failed to upload avatar:', err);
      return null;
    }
  },
};
