import { useState } from 'react';
import { useRouter } from 'expo-router';
import * as Haptics from '@/utils/haptics';
import { ExerciseDetailParams } from '../types/exercise.types';

export function useExerciseDetail(params: ExerciseDetailParams) {
  const router = useRouter();
  const [isBookmarked, setIsBookmarked] = useState(false);

  const title = params.name || 'Bench Press - Barbell';
  const muscle = params.muscle || 'Chest';
  const equipment = params.equipment || 'Barbell';
  const description = params.description || '';
  const difficulty = params.difficulty || 'Intermediate';
  const category = params.category || 'Strength';
  const bodyPart = params.bodyPart || '';
  const gifUrl = params.gifUrl || '';

  let instructionsList: string[] = [];
  try {
    if (params.instructions) {
      instructionsList = JSON.parse(params.instructions);
    }
  } catch {
    instructionsList = [];
  }

  let secondaryList: string[] = [];
  try {
    if (params.secondaryMuscles) {
      secondaryList = JSON.parse(params.secondaryMuscles);
    }
  } catch {
    secondaryList = [];
  }

  const toggleBookmark = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsBookmarked((prev) => !prev);
  };

  const handleLogExercise = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.push('/workout-active');
  };

  const goBack = () => {
    Haptics.selectionAsync();
    router.back();
  };

  return {
    title,
    muscle,
    equipment,
    description,
    difficulty,
    category,
    bodyPart,
    gifUrl,
    instructionsList,
    secondaryList,
    isBookmarked,
    toggleBookmark,
    handleLogExercise,
    goBack,
  };
}
