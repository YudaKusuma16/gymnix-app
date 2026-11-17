import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import * as Haptics from '@/utils/haptics';
import { workoutService } from '../services/workoutService';

export interface CalendarDayItem {
  day: string;
  date: string;
  hasWorkout: boolean;
}

export function useWorkoutHub() {
  const router = useRouter();
  const [calendarDays, setCalendarDays] = useState<CalendarDayItem[]>([]);
  const [selectedCalendarDay, setSelectedCalendarDay] = useState(0);

  useEffect(() => {
    (async () => {
      // Calculate dynamic days of current week (Mon -> Sun)
      const now = new Date();
      const currentDayOfWeek = (now.getDay() + 6) % 7; // 0 = Mon, 6 = Sun
      const monday = new Date(now);
      monday.setDate(now.getDate() - currentDayOfWeek);

      const daysOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
      const history = await workoutService.getWorkoutHistory(50);
      const workoutDates = new Set(
        history.map((h: any) => new Date(h.started_at).toISOString().split('T')[0])
      );

      const days: CalendarDayItem[] = [];
      for (let i = 0; i < 7; i++) {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        const dateStr = d.toISOString().split('T')[0];
        days.push({
          day: daysOfWeek[i],
          date: String(d.getDate()).padStart(2, '0'),
          hasWorkout: workoutDates.has(dateStr),
        });
      }

      setCalendarDays(days);
      setSelectedCalendarDay(currentDayOfWeek);
    })();
  }, []);

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
    calendarDays,
    selectedCalendarDay,
    selectDay,
    startNewWorkout,
    browseExerciseList,
  };
}
