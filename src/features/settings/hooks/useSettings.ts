import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from '@/utils/haptics';
import { DistanceUnit, HeightUnit, WeightUnit } from '../types/settings.types';
import { settingsService } from '../services/settingsService';
import { profileService } from '@/features/profile/services/profileService';

export function useSettings() {
  const router = useRouter();

  // Profile Snapshot
  const [profileName, setProfileName] = useState('User');
  const [profileInitials, setProfileInitials] = useState('U');
  const [homeGymName, setHomeGymName] = useState('');

  // Workout Experience States
  const [autoStartTimer, setAutoStartTimerState] = useState(true);
  const [hapticCues, setHapticCuesState] = useState(true);
  const [shareToFeed, setShareToFeedState] = useState(true);

  // Units & Measurements States
  const [weightUnit, setWeightUnitState] = useState<WeightUnit>('KG');
  const [heightUnit, setHeightUnitState] = useState<HeightUnit>('CM');
  const [distanceUnit, setDistanceUnitState] = useState<DistanceUnit>('KM');

  // Load from Supabase on mount
  useEffect(() => {
    let isMounted = true;
    settingsService.getSettings().then((s) => {
      if (isMounted) {
        setAutoStartTimerState(s.autoStartTimer);
        setHapticCuesState(s.hapticCues);
        setShareToFeedState(s.shareToFeed);
        setWeightUnitState(s.weightUnit);
        setHeightUnitState(s.heightUnit);
        setDistanceUnitState(s.distanceUnit);
      }
    });

    profileService.getProfile().then((p) => {
      if (isMounted) {
        setProfileName(p.fullName);
        setProfileInitials(p.initials);
        setHomeGymName(p.homeGym.name);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const setAutoStartTimer = (val: boolean) => {
    setAutoStartTimerState(val);
    settingsService.updateSettings({ autoStartTimer: val });
  };

  const setHapticCues = (val: boolean) => {
    setHapticCuesState(val);
    settingsService.updateSettings({ hapticCues: val });
  };

  const setShareToFeed = (val: boolean) => {
    setShareToFeedState(val);
    settingsService.updateSettings({ shareToFeed: val });
  };

  const setWeightUnit = (val: WeightUnit) => {
    setWeightUnitState(val);
    settingsService.updateSettings({ weightUnit: val });
  };

  const setHeightUnit = (val: HeightUnit) => {
    setHeightUnitState(val);
    settingsService.updateSettings({ heightUnit: val });
  };

  const setDistanceUnit = (val: DistanceUnit) => {
    setDistanceUnitState(val);
    settingsService.updateSettings({ distanceUnit: val });
  };

  const handleSignOut = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out of your Gymnix athlete profile?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            router.replace('/(auth)/sign-in');
          },
        },
      ]
    );
  };

  const goBack = () => {
    Haptics.selectionAsync();
    router.back();
  };

  return {
    profileName,
    profileInitials,
    homeGymName,
    autoStartTimer,
    setAutoStartTimer,
    hapticCues,
    setHapticCues,
    shareToFeed,
    setShareToFeed,
    weightUnit,
    setWeightUnit,
    heightUnit,
    setHeightUnit,
    distanceUnit,
    setDistanceUnit,
    handleSignOut,
    goBack,
  };
}
