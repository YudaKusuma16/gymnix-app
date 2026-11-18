import * as Haptics from '@/utils/haptics';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { exerciseService } from '../services/exerciseService';
import { ExerciseItem } from '../types/exercise.types';

export function useExerciseList() {
  const [initialCached] = useState<ExerciseItem[]>(() => exerciseService.getCachedSync());
  const [exercises, setExercises] = useState<ExerciseItem[]>(initialCached);
  const [loading, setLoading] = useState(initialCached.length === 0);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [equipmentFilter, setEquipmentFilter] = useState('All');
  const [muscleFilter, setMuscleFilter] = useState('All');
  const [sortAsc, setSortAsc] = useState(true);
  const [activeFilterPicker, setActiveFilterPicker] = useState<'equipment' | 'muscle' | null>(null);

  // Workout mode selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelectExercise = useCallback((id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }, []);

  const clearSelected = useCallback(() => {
    setSelectedIds([]);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 180);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    let isMounted = true;

    exerciseService
      .getAll()
      .then((data) => {
        if (isMounted) {
          setExercises(data);
          setLoading(false);
        }
      })
      .catch((err: any) => {
        if (isMounted) {
          if (initialCached.length === 0) {
            setError(err?.message || 'Failed to load exercises');
          }
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [initialCached.length]);

  const refresh = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await exerciseService.getAll();
      setExercises(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load exercises');
    } finally {
      setLoading(false);
    }
  };

  // Compute unique equipment options
  const equipmentOptions = useMemo(() => {
    const set = new Set<string>();
    exercises.forEach((ex) => {
      if (ex.equipment) set.add(ex.equipment.toLowerCase());
    });
    return ['All', ...Array.from(set).sort()];
  }, [exercises]);

  // Compute unique muscle target options from primary & secondary muscles
  const muscleOptions = useMemo(() => {
    const set = new Set<string>();
    exercises.forEach((ex) => {
      if (Array.isArray(ex.primary_muscles)) {
        ex.primary_muscles.forEach((m) => set.add(m.toLowerCase()));
      }
      if (Array.isArray(ex.secondary_muscles)) {
        ex.secondary_muscles.forEach((m) => set.add(m.toLowerCase()));
      }
      if (ex.target) set.add(ex.target.toLowerCase());
      if (ex.body_part) set.add(ex.body_part.toLowerCase());
    });
    return ['All', ...Array.from(set).sort()];
  }, [exercises]);

  // Filter and sort exercises
  const filteredExercises = useMemo(() => {
    let list = exercises;

    if (debouncedSearchQuery.trim().length > 0) {
      const q = debouncedSearchQuery.toLowerCase().trim();
      list = list.filter((ex) => {
        const matchesName = ex.name.toLowerCase().includes(q);
        const matchesPrimary = ex.primary_muscles?.some((m) =>
          m.toLowerCase().includes(q)
        );
        const matchesSecondary = ex.secondary_muscles?.some((m) =>
          m.toLowerCase().includes(q)
        );
        const matchesEquipment = ex.equipment?.toLowerCase().includes(q);
        const matchesCategory = ex.category?.toLowerCase().includes(q);
        const matchesTarget = ex.target?.toLowerCase().includes(q);

        return (
          matchesName ||
          matchesPrimary ||
          matchesSecondary ||
          matchesEquipment ||
          matchesCategory ||
          matchesTarget
        );
      });
    }

    if (equipmentFilter !== 'All') {
      const filterEq = equipmentFilter.toLowerCase();
      list = list.filter(
        (ex) => ex.equipment?.toLowerCase() === filterEq
      );
    }

    if (muscleFilter !== 'All') {
      const filterM = muscleFilter.toLowerCase();
      list = list.filter((ex) => {
        const inPrimary = ex.primary_muscles?.some(
          (m) => m.toLowerCase() === filterM
        );
        const inSecondary = ex.secondary_muscles?.some(
          (m) => m.toLowerCase() === filterM
        );
        const inTarget = ex.target?.toLowerCase() === filterM;
        const inBodyPart = ex.body_part?.toLowerCase() === filterM;
        return inPrimary || inSecondary || inTarget || inBodyPart;
      });
    }

    const sorted = [...list].sort((a, b) => {
      const cmp = a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
      return sortAsc ? cmp : -cmp;
    });

    return sorted;
  }, [exercises, debouncedSearchQuery, equipmentFilter, muscleFilter, sortAsc]);

  const toggleSort = () => {
    Haptics.selectionAsync();
    setSortAsc((prev) => !prev);
  };

  const resetFilters = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSearchQuery('');
    setEquipmentFilter('All');
  };

}
