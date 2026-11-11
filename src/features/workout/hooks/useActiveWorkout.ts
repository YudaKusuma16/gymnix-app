import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from '@/utils/haptics';
import { NextExerciseItem, SetRecord } from '../types/workout.types';
import { workoutService } from '../services/workoutService';

export function useActiveWorkout() {
  const router = useRouter();

  // Elapsed workout timer (seconds) - started around 42m 15s to match design
  const [elapsedSeconds, setElapsedSeconds] = useState(42 * 60 + 15);
  const [isSessionPaused, setIsSessionPaused] = useState(false);

  // Rest interval countdown timer (starts at 90s = 01:30)
  const [restSeconds, setRestSeconds] = useState(90);
  const [isRestActive, setIsRestActive] = useState(true);

  // Sets state
  const [sets, setSets] = useState<SetRecord[]>([
    { setNumber: 1, prev: '80 kg × 8', weight: '82.5', reps: '8', completed: true },
    { setNumber: 2, prev: '80 kg × 7', weight: '82.5', reps: '7', completed: true },
    { setNumber: 3, prev: '80 kg × 6', weight: '82.5', reps: '6', completed: false },
  ]);

  // Next exercises preview list
  const nextExercises: NextExerciseItem[] = [
    {
      id: 2,
      name: 'Incline Dumbbell Press',
      target: 'Upper Chest',
      setsCount: '3 Sets • 8-10 Reps',
      note: '30° incline bench, keep elbows tucked at 45° angle.',
    },
    {
      id: 3,
      name: 'Cable Flyes (High to Low)',
      target: 'Lower Chest',
      setsCount: '3 Sets • 12-15 Reps',
      note: 'Squeeze pecs at bottom contraction, slow eccentric return.',
    },
    {
      id: 4,
      name: 'Dips (Chest Focus)',
      target: 'Chest & Triceps',
      setsCount: '3 Sets • Bodyweight',
      note: 'Lean torso forward 30° to emphasize lower pectoral activation.',
    },
  ];

  // Accordion state for next exercises
  const [expandedNext, setExpandedNext] = useState<number | null>(null);

  // Elapsed timer ticker
  useEffect(() => {
    if (isSessionPaused) return;
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isSessionPaused]);

  // Rest countdown ticker
  useEffect(() => {
    if (!isRestActive || restSeconds <= 0) return;
    const interval = setInterval(() => {
      setRestSeconds((prev) => {
        if (prev <= 1) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRestActive, restSeconds]);

  const toggleSetComplete = (index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSets((prev) => {
      const next = [...prev];
      const targetState = !next[index].completed;
      next[index] = { ...next[index], completed: targetState };

      // If completing set, reset rest timer to default 90s and activate
      if (targetState) {
        setRestSeconds(90);
        setIsRestActive(true);
      }
      return next;
    });
  };

  const updateSetWeight = (index: number, weight: string) => {
    setSets((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], weight };
      return next;
    });
  };

  const updateSetReps = (index: number, reps: string) => {
    setSets((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], reps };
      return next;
    });
  };

  const addNewSet = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSets((prev) => {
      const lastSet = prev[prev.length - 1];
      const newNum = prev.length + 1;
      return [
        ...prev,
        {
          setNumber: newNum,
          prev: lastSet ? `${lastSet.weight || '80'} kg × ${lastSet.reps || '8'}` : '80 kg × 8',
          weight: lastSet ? lastSet.weight : '82.5',
          reps: lastSet ? lastSet.reps : '8',
          completed: false,
        },
      ];
    });
  };

  const removeSet = (index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSets((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((_, i) => i !== index).map((s, idx) => ({ ...s, setNumber: idx + 1 }));
    });
  };

  const toggleRestTimer = () => {
    Haptics.selectionAsync();
    setIsRestActive((prev) => !prev);
  };

  const adjustRest = (amount: number) => {
    Haptics.selectionAsync();
    setRestSeconds((prev) => Math.max(0, prev + amount));
  };

  const resetRestTimer = (seconds: number = 90) => {
    Haptics.selectionAsync();
    setRestSeconds(seconds);
    setIsRestActive(true);
  };

  const toggleSessionPause = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsSessionPaused((prev) => !prev);
  };

  const handleFinishWorkout = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert(
      'Workout Complete! 💪',
      `Great job! You finished your workout in ${Math.floor(elapsedSeconds / 60)} minutes with ${
        sets.filter((s) => s.completed).length
      } sets recorded.`,
      [
        {
          text: 'Save & Exit',
          onPress: async () => {
            await workoutService.logSession({
              durationSeconds: elapsedSeconds,
              completedSetsCount: sets.filter((s) => s.completed).length,
              finishedAt: new Date().toISOString(),
            });
            router.replace('/(tabs)/workout');
          },
        },
      ]
    );
  };

  const handleCancelWorkout = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert(
      'Discard Workout?',
      'Are you sure you want to stop? Current session progress will be lost.',
      [
        { text: 'Keep Going', style: 'cancel' },
        {
          text: 'Discard Workout',
          style: 'destructive',
          onPress: () => router.back(),
        },
      ]
    );
  };

  return {
    elapsedSeconds,
    isSessionPaused,
    restSeconds,
    isRestActive,
    sets,
    nextExercises,
    expandedNext,
    setExpandedNext,
    toggleSetComplete,
    updateSetWeight,
    updateSetReps,
    addNewSet,
    removeSet,
    toggleRestTimer,
    adjustRest,
    resetRestTimer,
    toggleSessionPause,
    handleFinishWorkout,
    handleCancelWorkout,
  };
}
