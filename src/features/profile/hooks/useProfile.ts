import { useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import * as Haptics from '@/utils/haptics';
import { AthleteProfile } from '../types/profile.types';

const INITIAL_PROFILE: AthleteProfile = {
  id: 'usr_01',
  fullName: 'Alex Pratama',
  username: '@alexpratama',
  initials: 'AP',
  memberSince: 'Jan 2024',
  tier: 'Pro Athlete',
  homeGym: {
    id: 'gym_01',
    name: 'Iron District Metro Gym',
    distance: '0.8 km',
  },
  vitals: {
    heightCm: 178,
    weightKg: 74.5,
    weightDeltaWk: -0.3,
    bmi: 23.5,
    bmiStatus: 'Optimal',
    calorieCap: 2450,
    calorieMode: 'BMR/TDEE Calibrated',
    currentStreakDays: 4,
    bestStreakDays: 18,
  },
  personalRecords: {
    wilksScore: 382.4,
    totalVolumeKg: 430,
    squatKg: 140,
    squatDate: '2w ago',
    benchKg: 105,
    benchDate: 'Yesterday',
    isBenchPr: true,
    deadliftKg: 185,
    deadliftDate: '1mo ago',
  },
  trainingProgram: {
    primaryObjective: 'Hypertrophy (Muscle Mass)',
    frequency: '4 - 5 Days / Week',
    splitType: 'Upper / Lower Progression',
    experienceLevel: 'Advanced Lifter (3+ yrs)',
  },
};

export function useProfile() {
  const router = useRouter();
  const [profile] = useState<AthleteProfile>(INITIAL_PROFILE);

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

  return {
    profile,
    navigateToSettings,
    navigateToEditProfile,
    navigateToHomeGym,
  };
}
