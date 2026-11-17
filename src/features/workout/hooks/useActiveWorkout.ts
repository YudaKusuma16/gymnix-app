import { useEffect, useState, useMemo, useRef } from 'react';
import { Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from '@/utils/haptics';
import { NextExerciseItem, SetRecord } from '../types/workout.types';
import { workoutService } from '../services/workoutService';
import { exerciseService } from '@/features/exercises/services/exerciseService';

export function useActiveWorkout() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    resume?: string;
    sessionId?: string;
    title?: string;
    exercises?: string;
    exerciseName?: string;
    exerciseIds?: string;
    muscle?: string;
    equipment?: string;
  }>();

  // Guard to prevent spawning a new session after discard/finish
  const isTerminatedRef = useRef(false);

  // Check if there is an existing session to resume (explicit resume flag or no new params)
  const isResume = params.resume === 'true';
  const isNewSession = !isResume && Boolean(params.exercises || params.title || params.exerciseName);

  // Active workout session ID & elapsed timer
  const [sessionId, setSessionId] = useState<string>(() => {
    if (params.sessionId) return params.sessionId;
    if (isNewSession) return '';
    return workoutService.getActiveSession()?.id || '';
  });

  // Timer states
  // Timer should ONLY start when user inputs weight/reps, checks a set, or taps timer
  const [isTimerStarted, setIsTimerStarted] = useState<boolean>(() => {
    if (isNewSession) return false;
    const existing = workoutService.getActiveSession();
    return Boolean(existing && existing.duration_seconds > 0);
  });
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(() => {
    if (isNewSession) return 0;
    const existing = workoutService.getActiveSession();
    if (existing && existing.duration_seconds > 0) {
      return existing.duration_seconds;
    }
    return 0;
  });
  const [isSessionPaused, setIsSessionPaused] = useState(false);

  // Rest interval countdown timer (starts at 90s, inactive initially)
  const [restSeconds, setRestSeconds] = useState(90);
  const [isRestActive, setIsRestActive] = useState(false);

  // Default initial sets generator
  const createDefaultSets = (): SetRecord[] => [
    { setNumber: 1, prev: '-', weight: '', reps: '', completed: false },
    { setNumber: 2, prev: '-', weight: '', reps: '', completed: false },
    { setNumber: 3, prev: '-', weight: '', reps: '', completed: false },
  ];

  // Per-exercise sets state - keyed by exercise name or 'primary' (restores saved sets synchronously)
  const [exerciseSets, setExerciseSets] = useState<Record<string, SetRecord[]>>(() => {
    const active = workoutService.getActiveSession();
    if (active?.id) {
      const saved = workoutService.getSessionSets(active.id);
      if (saved.length > 0) {
        const map: Record<string, SetRecord[]> = {};
        for (const s of saved) {
          const parts = s.logId.split('_log_');
          const exKey = parts[1] || 'primary';
          if (!map[exKey]) map[exKey] = [];
          map[exKey].push({
            setNumber: s.setNumber,
            prev: '-',
            weight: s.weightKg > 0 ? String(s.weightKg) : '',
            reps: s.reps > 0 ? String(s.reps) : '',
            completed: s.completed,
          });
        }
        if (!map.primary) map.primary = createDefaultSets();
        return map;
      }
    }
    return {
      primary: createDefaultSets(),
    };
  });

  // Getter for an exercise's set list
  const getExerciseSets = (key: string = 'primary'): SetRecord[] => {
    return exerciseSets[key] || [
      { setNumber: 1, prev: '-', weight: '', reps: '', completed: false },
      { setNumber: 2, prev: '-', weight: '', reps: '', completed: false },
      { setNumber: 3, prev: '-', weight: '', reps: '', completed: false },
    ];
  };

  const sets = getExerciseSets('primary');

  // Database-driven exercises fallback (read synchronously from SQLite so frame 0 has data)
  const [dbExercises, setDbExercises] = useState<any[]>(() => {
    return exerciseService.getCachedSync();
  });

  // Accordion state for next exercises
  const [expandedNext, setExpandedNext] = useState<number | null>(null);

  // Resolve list of exercise names
  const parsedExercises: string[] = useMemo(() => {
    if (params.exercises) {
      try {
        const arr = JSON.parse(params.exercises);
        if (Array.isArray(arr) && arr.length > 0) return arr;
      } catch {
        // fallback
      }
    }
    if (params.exerciseName) {
      return [params.exerciseName];
    }
    return [];
  }, [params.exercises, params.exerciseName]);

  // Workout title
  const workoutTitle = useMemo(() => {
    if (params.title) return params.title;
    if (parsedExercises.length > 0) {
      return parsedExercises.length === 1 ? parsedExercises[0] : 'Custom Workout';
    }
    const existing = workoutService.getActiveSession();
    if (existing?.title) return existing.title;
    return 'Workout Session';
  }, [params.title, parsedExercises]);

  // Current primary exercise name
  const currentExerciseName = useMemo(() => {
    if (parsedExercises.length > 0) return parsedExercises[0];
    if (dbExercises.length > 0) return dbExercises[0].name;
    return 'Full Body Movement';
  }, [parsedExercises, dbExercises]);

  // Target description for current exercise
  const exerciseTarget = useMemo(() => {
    if (params.muscle) {
      return `Target: ${params.muscle} • ${params.equipment || 'Equipment'}`;
    }
    return 'Target: 3 Sets • Log Weight & Reps';
  }, [params.muscle, params.equipment]);

  // Initialize or resume session once on mount
  useEffect(() => {
    let isMounted = true;

    if (!sessionId && !isTerminatedRef.current) {
      workoutService.startSession(workoutTitle).then((id) => {
        if (isMounted && !isTerminatedRef.current) {
          setSessionId(id);
        }
      });
    }

    if (parsedExercises.length === 0 && dbExercises.length === 0) {
      exerciseService.getAll().then((list) => {
        if (isMounted && list.length > 0) {
          setDbExercises(list);
        }
      });
    }

    return () => {
      isMounted = false;
    };
  }, []);

  // Compute next exercises dynamically
  const nextExercises: NextExerciseItem[] = useMemo(() => {
    if (parsedExercises.length > 1) {
      return parsedExercises.slice(1).map((name, idx) => ({
        id: idx + 2,
        name,
        target: 'Secondary Exercise',
        setsCount: '3 Sets • 8-12 Reps',
        note: 'Maintain solid form with controlled eccentric movement.',
      }));
    }
    if (parsedExercises.length === 0 && dbExercises.length > 1) {
      return dbExercises.slice(1, 4).map((ex, idx) => ({
        id: idx + 2,
        name: ex.name,
        target: Array.isArray(ex.primary_muscles) ? ex.primary_muscles.join(', ') : ex.target || 'Full Body',
        setsCount: '3 Sets • 8-12 Reps',
        note: Array.isArray(ex.instructions) && ex.instructions.length > 0
          ? ex.instructions[0]
          : 'Maintain solid form with controlled eccentric movement.',
      }));
    }
    return [];
  }, [parsedExercises, dbExercises]);

  // Elapsed timer ticker - only ticks if timer is started and not paused
  useEffect(() => {
    if (!isTimerStarted || isSessionPaused) return;
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerStarted, isSessionPaused]);

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

  const toggleSetComplete = (keyOrIndex: string | number, setIndex?: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const exerciseKey = typeof keyOrIndex === 'string' ? keyOrIndex : 'primary';
    const idx = typeof keyOrIndex === 'number' ? keyOrIndex : (setIndex ?? 0);

    setExerciseSets((prevMap) => {
      const currentList = prevMap[exerciseKey] || createDefaultSets();
      const nextList = [...currentList];
      const targetState = !nextList[idx].completed;
      nextList[idx] = { ...nextList[idx], completed: targetState };

      // Persist to local SQLite + sync queue immediately (hybrid architecture)
      workoutService.saveSet({
        setId: `${sessionId}_${exerciseKey}_set_${nextList[idx].setNumber}`,
        logId: `${sessionId}_log_${exerciseKey}`,
        setNumber: nextList[idx].setNumber,
        weightKg: parseFloat(nextList[idx].weight) || 0,
        reps: parseInt(nextList[idx].reps, 10) || 0,
        completed: targetState,
      });

      // If completing set, activate rest timer
      if (targetState) {
        setRestSeconds(90);
        setIsRestActive(true);
      }
      return { ...prevMap, [exerciseKey]: nextList };
    });
  };

  const updateSetWeight = (
    keyOrIndex: string | number,
    weightOrIndex: string | number,
    maybeWeight?: string
  ) => {
    const exerciseKey = typeof keyOrIndex === 'string' ? keyOrIndex : 'primary';
    const idx = typeof keyOrIndex === 'number' ? keyOrIndex : (weightOrIndex as number);
    const weight = typeof weightOrIndex === 'string' ? weightOrIndex : (maybeWeight ?? '');

    setExerciseSets((prevMap) => {
      const currentList = prevMap[exerciseKey] || createDefaultSets();
      const nextList = [...currentList];
      nextList[idx] = { ...nextList[idx], weight };
      return { ...prevMap, [exerciseKey]: nextList };
    });
  };

  const updateSetReps = (
    keyOrIndex: string | number,
    repsOrIndex: string | number,
    maybeReps?: string
  ) => {
    const exerciseKey = typeof keyOrIndex === 'string' ? keyOrIndex : 'primary';
    const idx = typeof keyOrIndex === 'number' ? keyOrIndex : (repsOrIndex as number);
    const reps = typeof repsOrIndex === 'string' ? repsOrIndex : (maybeReps ?? '');

    setExerciseSets((prevMap) => {
      const currentList = prevMap[exerciseKey] || createDefaultSets();
      const nextList = [...currentList];
      nextList[idx] = { ...nextList[idx], reps };
      return { ...prevMap, [exerciseKey]: nextList };
    });
  };

  const addNewSet = (exerciseKey: string = 'primary') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setExerciseSets((prevMap) => {
      const currentList = prevMap[exerciseKey] || createDefaultSets();
      const lastSet = currentList[currentList.length - 1];
      const newNum = currentList.length + 1;
      const nextList = [
        ...currentList,
        {
          setNumber: newNum,
          prev: lastSet?.weight ? `${lastSet.weight} kg × ${lastSet.reps || '10'}` : '-',
          weight: lastSet ? lastSet.weight : '',
          reps: lastSet ? lastSet.reps : '',
          completed: false,
        },
      ];
      return { ...prevMap, [exerciseKey]: nextList };
    });
  };

  const removeSet = (keyOrIndex: string | number, setIndex?: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const exerciseKey = typeof keyOrIndex === 'string' ? keyOrIndex : 'primary';
    const idx = typeof keyOrIndex === 'number' ? keyOrIndex : (setIndex ?? 0);

    setExerciseSets((prevMap) => {
      const currentList = prevMap[exerciseKey] || createDefaultSets();
      if (currentList.length <= 1) return prevMap;
      const nextList = currentList
        .filter((_, i) => i !== idx)
        .map((s, i) => ({ ...s, setNumber: i + 1 }));
      return { ...prevMap, [exerciseKey]: nextList };
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
    if (!isTimerStarted) {
      setIsTimerStarted(true);
      setIsSessionPaused(false);
    } else {
      setIsSessionPaused((prev) => !prev);
    }
  };

  // Dynamic Plate Breakdown text based on active/entered weight
  const plateText = useMemo(() => {
    const allSets = Object.values(exerciseSets).flat();
    const activeSet =
      allSets.find((s) => s.weight && !s.completed) ||
      allSets.find((s) => s.weight) ||
      exerciseSets.primary?.[0];
    const weightNum = parseFloat(activeSet?.weight || '');
    if (!weightNum || isNaN(weightNum)) {
      return '20 kg Olympic Bar • Enter weight to calculate plates';
    }
    if (weightNum <= 20) {
      return `${weightNum} kg • Olympic Bar or Dumbbells`;
    }
    const perSide = (weightNum - 20) / 2;
    return `20 kg Bar + ${perSide.toFixed(1).replace(/\.0$/, '')} kg each side`;
  }, [exerciseSets]);

  const handleFinishWorkout = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const allSets = Object.values(exerciseSets).flat();
    const completedSets = allSets.filter((s) => s.completed);
    const totalVolumeKg = completedSets.reduce(
      (sum, s) => sum + (parseFloat(s.weight) || 0) * (parseInt(s.reps, 10) || 0),
      0
    );

    Alert.alert(
      'Workout Complete! 💪',
      `Great job! You finished your workout in ${Math.floor(elapsedSeconds / 60)} minutes with ${
        completedSets.length
      } sets (${totalVolumeKg.toLocaleString()} kg total volume).`,
      [
        {
          text: 'Save & Exit',
          onPress: async () => {
            isTerminatedRef.current = true;
            await workoutService.logSession({
              id: sessionId,
              title: workoutTitle,
              durationSeconds: elapsedSeconds,
              totalVolumeKg,
              completedSetsCount: completedSets.length,
              finishedAt: new Date().toISOString(),
            });
            setIsTimerStarted(false);
            setIsSessionPaused(false);
            setIsRestActive(false);
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
      'Are you sure you want to stop? Current session progress and timer will be reset.',
      [
        { text: 'Keep Going', style: 'cancel' },
        {
          text: 'Discard Workout',
          style: 'destructive',
          onPress: async () => {
            isTerminatedRef.current = true;
            await workoutService.cancelSession(sessionId);
            setIsTimerStarted(false);
            setIsSessionPaused(false);
            setIsRestActive(false);
            router.back();
          },
        },
      ]
    );
  };

  return {
    sessionId,
    workoutTitle,
    currentExerciseName,
    exerciseTarget,
    elapsedSeconds,
    isSessionPaused,
    isTimerStarted,
    restSeconds,
    isRestActive,
    sets,
    exerciseSets,
    getExerciseSets,
    nextExercises,
    expandedNext,
    plateText,
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
