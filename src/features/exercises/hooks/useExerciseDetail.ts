import { useState } from 'react';
import { useRouter } from 'expo-router';
import * as Haptics from '@/utils/haptics';
import { ExerciseDetailParams } from '../types/exercise.types';

export function useExerciseDetail(params: ExerciseDetailParams) {
  const router = useRouter();
  const [isBookmarked, setIsBookmarked] = useState(false);

  const title = params.name || 'Exercise Detail';
  const muscle = params.muscle || 'General';
  const equipment = params.equipment || 'Body Only';
  const description = params.description || '';
  const difficulty = params.difficulty || params.level || 'Beginner';
  const level = params.level || params.difficulty || 'Beginner';
  const category = params.category || 'Strength';
  const force = params.force || '';
  const mechanic = params.mechanic || '';
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

  let primaryList: string[] = [];
  try {
    if (params.primaryMuscles) {
      primaryList = JSON.parse(params.primaryMuscles);
    }
  } catch {
    primaryList = [];
  }
  if (primaryList.length === 0 && params.muscle) {
    primaryList = [params.muscle.toLowerCase()];
  }

  let secondaryList: string[] = [];
  try {
    if (params.secondaryMuscles) {
      secondaryList = JSON.parse(params.secondaryMuscles);
    }
  } catch {
    secondaryList = [];
  }

  let imagesList: string[] = [];
  try {
    if (params.images) {
      imagesList = JSON.parse(params.images);
    }
  } catch {
    imagesList = [];
  }

  const toggleBookmark = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsBookmarked((prev) => !prev);
  };

  const handleLogExercise = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.push({
      pathname: '/workout-active',
      params: {
        title: `${title} Session`,
        exerciseName: title,
        muscle,
        equipment,
        exercises: JSON.stringify([title]),
      },
    });
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
    level,
    category,
    force,
    mechanic,
    bodyPart,
    gifUrl,
    instructionsList,
    primaryList,
    secondaryList,
    imagesList,
    isBookmarked,
    toggleBookmark,
    handleLogExercise,
    goBack,
  };
}
