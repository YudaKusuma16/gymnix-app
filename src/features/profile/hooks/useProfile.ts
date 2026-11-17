import { useState, useCallback, useEffect } from 'react';
import { Share } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from '@/utils/haptics';
import { AthleteProfile } from '../types/profile.types';
import { profileService, DEFAULT_PROFILE } from '../services/profileService';

export function useProfile() {
  const router = useRouter();
  const [profile, setProfile] = useState<AthleteProfile>(DEFAULT_PROFILE);
  const [lifetimeMilestones, setLifetimeMilestones] = useState({
    totalTonnageTon: 0,
    totalWorkouts: 0,
    totalHours: 0,
  });
  const [heatmapData, setHeatmapData] = useState<{
    gridWeeks?: { date: string; level: 0 | 1 | 2 }[][];
    currentStreakWeeks: number;
    totalActiveDays: number;
  }>({
    currentStreakWeeks: 0,
    totalActiveDays: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);

  const reloadProfile = useCallback(async () => {
    try {
      const [fetchedProfile, milestones, heatmap] = await Promise.all([
        profileService.getProfile(),
        profileService.getLifetimeMilestones(),
        profileService.getHeatmapData(),
      ]);
      setProfile(fetchedProfile);
      setLifetimeMilestones(milestones);
      setHeatmapData(heatmap);
    } catch (e) {
      console.warn('[useProfile] Could not fetch profile data:', e);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      profileService.getProfile(),
      profileService.getLifetimeMilestones(),
      profileService.getHeatmapData(),
    ])
      .then(([fetchedProfile, milestones, heatmap]) => {
        if (isMounted) {
          setProfile(fetchedProfile);
          setLifetimeMilestones(milestones);
          setHeatmapData(heatmap);
          setLoading(false);
        }
      })
      .catch((e) => {
        if (isMounted) {
          console.warn('[useProfile] Initial load warning:', e);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const navigateToSettings = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/settings');
  }, [router]);

  const navigateToEditProfile = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/edit-profile');
  }, [router]);

  const navigateToHomeGym = useCallback(() => {
    Haptics.selectionAsync();
    router.push({
      pathname: '/gym-detail',
      params: {
        id: profile.homeGym.id,
        name: profile.homeGym.name,
        distance: profile.homeGym.distance,
      },
    });
  }, [router, profile.homeGym]);

  const navigateToSignIn = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/(auth)/sign-in');
  }, [router]);

  const shareAthletePassport = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await Share.share({
        title: `${profile.fullName} • Gymnix Athlete Passport`,
        message:
          `🏋️ ${profile.fullName} (${profile.username}) on Gymnix Athlete OS\n` +
          `• SBD Total: ${profile.personalRecords.totalVolumeKg} KG (Squat ${profile.personalRecords.squatKg}kg | Bench ${profile.personalRecords.benchKg}kg | Deadlift ${profile.personalRecords.deadliftKg}kg)\n` +
          `• Lifetime Load: ${lifetimeMilestones.totalTonnageTon} T across ${lifetimeMilestones.totalWorkouts} sessions\n` +
          `• Discipline Streak: ${profile.vitals.currentStreakDays} Days\n\n` +
          `Track your progressive overload with Gymnix!`,
      });
    } catch {
      // User dismissed share dialog
    }
  }, [profile, lifetimeMilestones]);

  return {
    profile,
    isAuthenticated: Boolean(profile.id),
    lifetimeMilestones,
    heatmapData,
    loading,
    reloadProfile,
    navigateToSettings,
    navigateToEditProfile,
    navigateToHomeGym,
    navigateToSignIn,
    shareAthletePassport,
  };
}
