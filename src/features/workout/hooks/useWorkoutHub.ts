import { useState } from 'react';
import { useRouter } from 'expo-router';
import * as Haptics from '@/utils/haptics';

export interface CalendarDayItem {
  day: string;
  date: string;
  hasWorkout: boolean;
}

export const DEFAULT_CALENDAR_DAYS: CalendarDayItem[] = [
  { day: 'MON', date: '09', hasWorkout: true },
  { day: 'TUE', date: '10', hasWorkout: true },
  { day: 'WED', date: '11', hasWorkout: false },
  { day: 'THU', date: '12', hasWorkout: true },
  { day: 'FRI', date: '13', hasWorkout: true },
  { day: 'SAT', date: '14', hasWorkout: false },
  { day: 'SUN', date: '15', hasWorkout: false },
];

export function useWorkoutHub() {
  const router = useRouter();
  const [selectedCalendarDay, setSelectedCalendarDay] = useState(3); // Thursday active by default

  const selectDay = (index: number) => {
    Haptics.selectionAsync();
    setSelectedCalendarDay(index);
  };

  const startNewWorkout = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/exercise-list?mode=workout');
  };

  const browseExerciseList = () => {
    Haptics.selectionAsync();
    router.push('/exercise-list');
  };

  return {
    calendarDays: DEFAULT_CALENDAR_DAYS,
    selectedCalendarDay,
    selectDay,
    startNewWorkout,
    browseExerciseList,
  };
}
