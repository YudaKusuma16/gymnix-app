import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { capitalizeWords } from '@/utils/formatters';
import { ExerciseItem } from '../types/exercise.types';
import { getExerciseImageUrl } from '../utils/muscleMapping';

interface ExerciseCardProps {
  exercise: ExerciseItem;
  isWorkoutMode: boolean;
  isSelected?: boolean;
  onPress: (exercise: ExerciseItem) => void;
  onToggleSelect?: (exercise: ExerciseItem) => void;
}

export const ExerciseCard = React.memo(function ExerciseCard({
  exercise,
  isWorkoutMode,
  isSelected = false,
  onPress,
  onToggleSelect,
}: ExerciseCardProps) {
  const getEquipmentIcon = (equipment?: string | null) => {
    const eq = equipment?.toLowerCase() || '';
    if (eq.includes('barbell')) return 'barbell-outline';
    if (eq.includes('dumbbell')) return 'fitness-outline';
    if (eq.includes('cable')) return 'git-pull-request-outline';
    return 'fitness-outline';
  };

  const primaryMuscle =
    exercise.primary_muscles && exercise.primary_muscles.length > 0
      ? exercise.primary_muscles[0]
      : exercise.target || exercise.body_part || 'General';

  const imageUrl =
    exercise.images && exercise.images.length > 0
      ? getExerciseImageUrl(exercise.images[0])
      : exercise.gif_url || null;

  return (
    <View
      className={`py-2.5 px-1 flex-row items-center justify-between ${
        isSelected ? 'bg-[#1A1416]/70 rounded-2xl px-2' : ''
      }`}>
      {/* Clickable Content (Opens Exercise Detail) */}
      <TouchableOpacity
        onPress={() => onPress(exercise)}
        activeOpacity={0.7}
        className="flex-row items-center gap-3.5 flex-1 pr-3">
        {/* Thumbnail Image / Icon */}
        <View className="w-13 h-13 rounded-2xl bg-[#141416] border border-[#222226] items-center justify-center overflow-hidden">
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              style={{ width: 52, height: 52 }}
              contentFit="cover"
              transition={200}
            />
          ) : (
            <Ionicons
              name={getEquipmentIcon(exercise.equipment)}
              size={24}
              color="#BE3144"
            />
          )}
        </View>

        <View className="flex-1">
          <Text className="text-white text-[15px] font-bold leading-snug">
            {capitalizeWords(exercise.name)}
          </Text>
          <View className="flex-row items-center gap-1.5 mt-1">
            <Text className="text-[#BE3144] text-xs font-semibold">
              {capitalizeWords(primaryMuscle)}
            </Text>
            <Text className="text-[#3F3F46]">•</Text>
            <Text className="text-[#71717A] text-xs">
              {capitalizeWords(exercise.equipment || 'Body Only')}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Action Accessory Button */}
      {isWorkoutMode ? (
        <TouchableOpacity
          onPress={() => onToggleSelect?.(exercise)}
          activeOpacity={0.7}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          className={`w-8 h-8 rounded-full items-center justify-center border ${
            isSelected
              ? 'bg-[#BE3144] border-[#BE3144]'
              : 'bg-[#BE3144]/15 border-[#BE3144]/35 active:bg-[#BE3144]/30'
          }`}>
          <Ionicons
            name={isSelected ? 'checkmark' : 'add'}
            size={16}
            color={isSelected ? '#FFFFFF' : '#BE3144'}
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => onPress(exercise)}
          activeOpacity={0.7}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Ionicons name="chevron-forward" size={17} color="#52525B" />
        </TouchableOpacity>
      )}
    </View>
  );
});
