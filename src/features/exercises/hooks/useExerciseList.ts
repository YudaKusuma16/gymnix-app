import { useEffect, useMemo, useState } from 'react';
import * as Haptics from '@/utils/haptics';
import { exerciseService } from '../services/exerciseService';
import { ExerciseItem } from '../types/exercise.types';

export function useExerciseList() {
  const [exercises, setExercises] = useState<ExerciseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [equipmentFilter, setEquipmentFilter] = useState('All');
  const [muscleFilter, setMuscleFilter] = useState('All');
  const [sortAsc, setSortAsc] = useState(true);
  const [activeFilterPicker, setActiveFilterPicker] = useState<'equipment' | 'muscle' | null>(null);

  // Workout mode selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelectExercise = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const clearSelected = () => {
    setSelectedIds([]);
  };

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
          setError(err?.message || 'Failed to load exercises');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

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
    let list = [...exercises];

    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase().trim();
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

    list.sort((a, b) => {
      if (sortAsc) {
        return a.name.localeCompare(b.name);
      }
      return b.name.localeCompare(a.name);
    });

    return list;
  }, [exercises, searchQuery, equipmentFilter, muscleFilter, sortAsc]);

  const toggleSort = () => {
    Haptics.selectionAsync();
    setSortAsc((prev) => !prev);
  };

  const resetFilters = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSearchQuery('');
    setEquipmentFilter('All');
    setMuscleFilter('All');
    setActiveFilterPicker(null);
  };

  return {
    exercises,
    loading,
    error,
    refresh,
    searchQuery,
    setSearchQuery,
    equipmentFilter,
    setEquipmentFilter,
    muscleFilter,
    setMuscleFilter,
    sortAsc,
    toggleSort,
    activeFilterPicker,
    setActiveFilterPicker,
    equipmentOptions,
    muscleOptions,
    filteredExercises,
    resetFilters,
    selectedIds,
    toggleSelectExercise,
    clearSelected,
    selectedCount: selectedIds.length,
  };
}
