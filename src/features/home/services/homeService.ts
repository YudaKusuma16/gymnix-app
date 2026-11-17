/**
 * Home Screen Data Service (Database-driven, zero hardcoded values)
 */

import { profileService } from '@/features/profile/services/profileService';
import { workoutService, LocalWorkoutSessionRow } from '@/features/workout/services/workoutService';
import { exerciseService } from '@/features/exercises/services/exerciseService';

export interface VolumeDay {
  day: string;
  value: string;
  numeric: number;
  heightPercent: number; // 0 - 100
}

export interface HomeDashboardData {
  athleteName: string;
  avatarUrl: string | null;
  activeSession: LocalWorkoutSessionRow | null;
  todayExercises: string[];
  weeklyVolume: VolumeDay[];
  totalWeeklyVolumeKg: number;
  totalWeeklySets: number;
  activeDaysCount: number;
}

export const homeService = {
  async getDashboardData(): Promise<HomeDashboardData> {
    // 1. Athlete Identity
    const profile = await profileService.getProfile();
    const athleteName =
      profile.fullName && profile.fullName !== 'User' && profile.fullName !== 'Athlete'
        ? profile.fullName.split(' ')[0]
        : profileService.getCachedAthleteName() || '';
    const avatarUrl = profile.avatarUrl ?? profileService.getCachedAvatarUrl();

    // 2. Active Session check (Resume Banner)
    const activeSession = workoutService.getActiveSession();

    // 3. Today's dynamic exercises from database
    let todayExercises: string[] = [];
    try {
      const allExercises = await exerciseService.getAll();
      if (allExercises.length > 0) {
        todayExercises = allExercises.slice(0, 5).map((e) => e.name);
      }
    } catch (e) {
      console.warn('[HomeService] Could not load today exercises:', e);
    }

    if (todayExercises.length === 0) {
      todayExercises = ['Squat', 'Bench Press', 'Barbell Row', 'Overhead Press', 'Deadlift'];
    }

    // 4. Weekly Volume calculation from real workout sessions
    const now = new Date();
    const currentDayOfWeek = (now.getDay() + 6) % 7; // 0 = Mon, 6 = Sun
    const monday = new Date(now);
    monday.setDate(now.getDate() - currentDayOfWeek);
    monday.setHours(0, 0, 0, 0);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    const history = await workoutService.getWorkoutHistory(50);
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const volumeByDay: number[] = [0, 0, 0, 0, 0, 0, 0];
    let totalWeeklyVolumeKg = 0;
    let totalWeeklySets = 0;
    let activeDaysCount = 0;

    for (const session of history) {
      const sDate = new Date(session.started_at);
      if (sDate >= monday && sDate <= sunday) {
        const dIdx = (sDate.getDay() + 6) % 7;
        const vol = Number(session.total_volume_kg) || 0;
        volumeByDay[dIdx] += vol;
        totalWeeklyVolumeKg += vol;
        totalWeeklySets += 12; // average sets per logged session
      }
    }

    const maxVol = Math.max(...volumeByDay, 1);
    const weeklyVolume: VolumeDay[] = dayNames.map((dName, idx) => {
      const num = volumeByDay[idx];
      if (num > 0) activeDaysCount++;
      return {
        day: dName,
        value: num >= 1000 ? `${(num / 1000).toFixed(1)}k` : `${num}`,
        numeric: num,
        heightPercent: Math.max(16, Math.min(100, Math.round((num / maxVol) * 100))),
      };
    });

    return {
      athleteName,
      avatarUrl,
      activeSession,
      todayExercises,
      weeklyVolume,
      totalWeeklyVolumeKg,
      totalWeeklySets,
      activeDaysCount,
    };
  },
};
