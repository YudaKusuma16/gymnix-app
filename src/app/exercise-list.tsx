import React, { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from '@/utils/haptics';
import { capitalizeWords } from '@/utils/formatters';
import { useExerciseList } from '@/features/exercises/hooks/useExerciseList';
import { ExerciseCard } from '@/features/exercises/components/ExerciseCard';
import { ExerciseItem } from '@/features/exercises/types/exercise.types';

export default function ExerciseListScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ mode?: string }>();
  const isWorkoutMode = params.mode === 'workout';

  const [showMoreMenu, setShowMoreMenu] = useState(false);

  // ViewModel hook
  const {
    loading,
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
    selectedCount,
  } = useExerciseList();

  const handleExercisePress = (ex: ExerciseItem) => {
    Haptics.selectionAsync();
    const primaryMuscle =
      ex.primary_muscles && ex.primary_muscles.length > 0
        ? ex.primary_muscles[0]
        : ex.target || 'General';

    router.push({
      pathname: '/exercise-detail',
      params: {
        id: ex.id,
        name: capitalizeWords(ex.name),
        muscle: capitalizeWords(primaryMuscle),
        equipment: capitalizeWords(ex.equipment || 'Body Only'),
        bodyPart: capitalizeWords(ex.body_part || ''),
        description: ex.description || '',
        instructions: JSON.stringify(ex.instructions || []),
        primaryMuscles: JSON.stringify(ex.primary_muscles || []),
        secondaryMuscles: JSON.stringify(ex.secondary_muscles || []),
        difficulty: ex.difficulty || capitalizeWords(ex.level || 'Beginner'),
        level: capitalizeWords(ex.level || 'Beginner'),
        category: capitalizeWords(ex.category || 'Strength'),
        force: capitalizeWords(ex.force || ''),
        images: JSON.stringify(ex.images || []),
        gifUrl: ex.gif_url || '',
        mode: isWorkoutMode ? 'workout' : 'browse',
      },
    });
  };

  const handleStartWorkout = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const selectedExercises = filteredExercises.filter((ex) => selectedIds.includes(ex.id));
    const title =
      selectedExercises.length === 1
        ? capitalizeWords(selectedExercises[0].name)
        : 'Custom Workout';
    router.push({
      pathname: '/workout-active',
      params: {
        title,
        exercises: JSON.stringify(selectedExercises.map((e) => capitalizeWords(e.name))),
        exerciseIds: JSON.stringify(selectedIds),
      },
    });
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-black">
      {/* 1. Top Search Header */}
      <View className="flex-row items-center gap-2.5 px-4 py-3 border-b border-[#1A1A1A] bg-black">
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          className="w-8 h-9 items-center justify-center">
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Search Field */}
        <View
          className="flex-1 flex-row items-center bg-[#121212] border border-[#27272A] rounded-full px-3.5 py-2 gap-2"
          style={styles.pillBorder}>
          <Ionicons name="search-outline" size={17} color="#71717A" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={isWorkoutMode ? "Search exercises to add..." : "Search exercises, muscles..."}
            placeholderTextColor="#52525B"
            className="flex-1 text-white text-[13.5px] p-0"
            selectionColor="#BE3144"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={16} color="#71717A" />
            </TouchableOpacity>
          )}
        </View>

        {/* More Actions (3 dots) */}
        <TouchableOpacity
          onPress={() => {
            Haptics.selectionAsync();
            setShowMoreMenu(!showMoreMenu);
          }}
          activeOpacity={0.7}
          className="w-8 h-9 items-center justify-center">
          <Ionicons name="ellipsis-vertical" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* More Options Dropdown */}
      {showMoreMenu && (
        <View className="absolute top-16 right-4 z-50 bg-[#141416] border border-[#27272A] rounded-2xl p-1.5 shadow-2xl w-44">
          <TouchableOpacity
            onPress={() => {
              setShowMoreMenu(false);
              router.push('/workout-active');
            }}
            className="flex-row items-center gap-2.5 p-2.5 rounded-xl active:bg-[#222228]">
            <Ionicons name="add-circle-outline" size={17} color="#BE3144" />
            <Text className="text-white text-xs font-semibold">Add workout</Text>
          </TouchableOpacity>
          <View className="h-[1px] bg-[#222228] my-1" />
          <TouchableOpacity
            onPress={() => {
              setShowMoreMenu(false);
              router.push('/(tabs)/workout');
            }}
            className="flex-row items-center gap-2.5 p-2.5 rounded-xl active:bg-[#222228]">
            <Ionicons name="bookmark-outline" size={17} color="#BE3144" />
            <Text className="text-white text-xs font-semibold">Saved workout</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 2. Interactive Filter Chips Bar */}
      <View className="flex-row items-center gap-2 px-4 py-2.5 z-30">
        {/* Equipment Filter Button */}
        <TouchableOpacity
          onPress={() => {
            Haptics.selectionAsync();
            setActiveFilterPicker(activeFilterPicker === 'equipment' ? null : 'equipment');
          }}
          activeOpacity={0.75}
          className={`flex-row items-center gap-1.5 px-3 py-1.5 rounded-full border ${
            equipmentFilter !== 'All'
              ? 'bg-[#BE3144]/15 border-[#BE3144]'
              : 'bg-[#121212] border-[#27272A]'
          }`}
          style={styles.pillBorder}>
          <Text
            className={`text-xs font-bold ${
              equipmentFilter !== 'All' ? 'text-[#BE3144]' : 'text-[#A1A1AA]'
            }`}>
            {equipmentFilter === 'All' ? 'Equipment' : capitalizeWords(equipmentFilter)}
          </Text>
          <Ionicons
            name={activeFilterPicker === 'equipment' ? 'chevron-up' : 'chevron-down'}
            size={12}
            color={equipmentFilter !== 'All' ? '#BE3144' : '#71717A'}
          />
        </TouchableOpacity>

        {/* Muscle Filter Button */}
        <TouchableOpacity
          onPress={() => {
            Haptics.selectionAsync();
            setActiveFilterPicker(activeFilterPicker === 'muscle' ? null : 'muscle');
          }}
          activeOpacity={0.75}
          className={`flex-row items-center gap-1.5 px-3 py-1.5 rounded-full border ${
            muscleFilter !== 'All'
              ? 'bg-[#BE3144]/15 border-[#BE3144]'
              : 'bg-[#121212] border-[#27272A]'
          }`}
          style={styles.pillBorder}>
          <Text
            className={`text-xs font-bold ${
              muscleFilter !== 'All' ? 'text-[#BE3144]' : 'text-[#A1A1AA]'
            }`}>
            {muscleFilter === 'All' ? 'Muscle' : capitalizeWords(muscleFilter)}
          </Text>
          <Ionicons
            name={activeFilterPicker === 'muscle' ? 'chevron-up' : 'chevron-down'}
            size={12}
            color={muscleFilter !== 'All' ? '#BE3144' : '#71717A'}
          />
        </TouchableOpacity>

        {/* Sort A-Z / Z-A Toggle */}
        <TouchableOpacity
          onPress={toggleSort}
          activeOpacity={0.75}
          className="flex-row items-center gap-1 px-3 py-1.5 rounded-full bg-[#121212] border border-[#27272A]"
          style={styles.pillBorder}>
          <Ionicons name="swap-vertical" size={13} color="#BE3144" />
          <Text className="text-white text-xs font-bold">
            {sortAsc ? 'A-Z' : 'Z-A'}
          </Text>
        </TouchableOpacity>

        {/* Reset Filter Button */}
        {(equipmentFilter !== 'All' || muscleFilter !== 'All' || searchQuery.length > 0) && (
          <TouchableOpacity
            onPress={resetFilters}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            className="w-7 h-7 rounded-full items-center justify-center bg-[#BE3144]/15 border border-[#BE3144]/35">
            <Ionicons name="reload" size={13} color="#BE3144" />
          </TouchableOpacity>
        )}
      </View>

      {/* Backdrop overlay to dismiss dropdown menu when tapping outside */}
      {activeFilterPicker && (
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setActiveFilterPicker(null)}
          className="absolute inset-0 z-40 bg-black/40"
        />
      )}

      {/* Floating Dropdown List Menu */}
      {activeFilterPicker && (
        <View
          className={`absolute top-[108px] z-50 bg-[#141416] border border-[#27272A] rounded-2xl shadow-2xl overflow-hidden p-1 ${
            activeFilterPicker === 'equipment' ? 'left-4 w-48' : 'left-28 w-52'
          }`}
          style={styles.cardBorder}>
          <ScrollView
            showsVerticalScrollIndicator={true}
            style={{ maxHeight: 260 }}>
            {(activeFilterPicker === 'equipment' ? equipmentOptions : muscleOptions).map(
              (option) => {
                const isSelected =
                  activeFilterPicker === 'equipment'
                    ? equipmentFilter.toLowerCase() === option.toLowerCase()
                    : muscleFilter.toLowerCase() === option.toLowerCase();
                return (
                  <TouchableOpacity
                    key={option}
                    onPress={() => {
                      Haptics.selectionAsync();
                      if (activeFilterPicker === 'equipment') {
                        setEquipmentFilter(option);
                      } else {
                        setMuscleFilter(option);
                      }
                      setActiveFilterPicker(null);
                    }}
                    activeOpacity={0.7}
                    className={`flex-row items-center justify-between px-3 py-2.5 rounded-xl mb-0.5 ${
                      isSelected ? 'bg-[#BE3144]/15' : 'active:bg-[#202026]'
                    }`}>
                    <Text
                      className={`text-xs ${
                        isSelected ? 'text-[#BE3144] font-bold' : 'text-[#E4E4E7] font-medium'
                      }`}>
                      {capitalizeWords(option)}
                    </Text>
                    {isSelected && (
                      <Ionicons name="checkmark" size={15} color="#BE3144" />
                    )}
                  </TouchableOpacity>
                );
              }
            )}
          </ScrollView>
        </View>
      )}

      {/* 3. Main Exercise List View */}
      {loading ? (
        <View className="flex-1 items-center justify-center gap-3">
          <ActivityIndicator size="large" color="#BE3144" />
          <Text className="text-[#71717A] text-xs font-medium">Loading Supabase catalog...</Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 12,
            paddingBottom: isWorkoutMode && selectedCount > 0 ? insets.bottom + 90 : insets.bottom + 40,
          }}
          className="flex-1">
          {filteredExercises.length === 0 ? (
            <View className="items-center justify-center py-20 gap-2">
              <Ionicons name="barbell-outline" size={40} color="#3F3F46" />
              <Text className="text-white font-bold text-base mt-2">No exercises found</Text>
              <Text className="text-[#71717A] text-xs text-center max-w-[240px]">
                Try adjusting your search query or reset active filters.
              </Text>
            </View>
          ) : (
            <View>
              <Text className="text-[#52525B] text-[11px] font-bold uppercase tracking-wider mb-2 pl-1">
                {filteredExercises.length} Exercises Available
              </Text>

              {filteredExercises.map((ex) => (
                <ExerciseCard
                  key={ex.id}
                  exercise={ex}
                  isWorkoutMode={isWorkoutMode}
                  isSelected={selectedIds.includes(ex.id)}
                  onPress={handleExercisePress}
                  onToggleSelect={() => toggleSelectExercise(ex.id)}
                />
              ))}
            </View>
          )}
        </ScrollView>
      )}

      {/* 4. Floating Start Workout Bar (When exercises selected in workout mode) */}
      {isWorkoutMode && selectedCount > 0 && (
        <View
          style={{ paddingBottom: Math.max(insets.bottom, 16) }}
          className="absolute bottom-0 left-0 right-0 px-4 pt-4 pb-2 bg-gradient-to-t from-black via-black/95 to-transparent">
          <TouchableOpacity
            onPress={handleStartWorkout}
            activeOpacity={0.88}
            className="w-full bg-[#BE3144] py-4 rounded-2xl flex-row items-center justify-center gap-2.5 shadow-2xl active:bg-[#A32837]"
            style={styles.floatingButtonShadow}>
            <Ionicons name="play" size={18} color="#FFFFFF" />
            <Text className="text-white text-[15px] font-extrabold tracking-wide">
              Start Workout ({selectedCount} selected)
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  cardBorder: {
    borderCurve: 'continuous',
  },
  pillBorder: {
    borderCurve: 'continuous',
  },
  floatingButtonShadow: {
    shadowColor: '#BE3144',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 8,
  },
});
