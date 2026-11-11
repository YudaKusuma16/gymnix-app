import { useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from '@/utils/haptics';
import { DistanceUnit, HeightUnit, WeightUnit } from '../types/settings.types';

export function useSettings() {
  const router = useRouter();

  // Workout Experience States
  const [autoStartTimer, setAutoStartTimer] = useState(true);
  const [hapticCues, setHapticCues] = useState(true);
  const [shareToFeed, setShareToFeed] = useState(true);

  // Units & Measurements States
  const [weightUnit, setWeightUnit] = useState<WeightUnit>('KG');
  const [heightUnit, setHeightUnit] = useState<HeightUnit>('CM');
  const [distanceUnit, setDistanceUnit] = useState<DistanceUnit>('KM');

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
