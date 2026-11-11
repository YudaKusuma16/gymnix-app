import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { capitalizeWords } from '@/utils/formatters';
import { ExerciseItem } from '../types/exercise.types';

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
  const getEquipmentIcon = (equipment?: string) => {
    const eq = equipment?.toLowerCase() || '';
    if (eq.includes('barbell')) return 'barbell-outline';
    if (eq.includes('cable')) return 'git-pull-request-outline';
    return 'fitness-outline';
  };

  return (
    <View
      className={`border rounded-2xl p-4 flex-row items-center justify-between ${
        isSelected
          ? 'bg-[#1A1416] border-[#BE3144]/55'
          : 'bg-[#0A0A0A] border-[#1E1E22]'
      }`}
      style={styles.cardBorder}>
      {/* Clickable Card Content (Opens Exercise Detail) */}
      <TouchableOpacity
        onPress={() => onPress(exercise)}
        activeOpacity={0.7}
        className="flex-row items-center gap-3.5 flex-1 pr-3">
        {/* Badge Icon or GIF Thumbnail */}
        <View className="w-14 h-14 rounded-xl bg-[#141416] border border-[#27272A] items-center justify-center overflow-hidden">
          {exercise.gif_url ? (
            <Image
              source={{ uri: exercise.gif_url }}
              style={{ width: '100%', height: '100%' }}
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
          <Text className="text-white text-[15.5px] font-bold leading-snug">
            {capitalizeWords(exercise.name)}
          </Text>
          <View className="flex-row items-center gap-2 mt-1">
            <Text className="text-[#BE3144] text-xs font-semibold">
              {capitalizeWords(exercise.target || exercise.body_part || 'General')}
            </Text>
            <Text className="text-[#3F3F46]">•</Text>
            <Text className="text-[#71717A] text-xs">
              {capitalizeWords(exercise.equipment || 'Standard')}
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
          className={`w-9 h-9 rounded-full items-center justify-center border ${
            isSelected
              ? 'bg-[#BE3144] border-[#BE3144]'
              : 'bg-[#BE3144]/15 border-[#BE3144]/35 active:bg-[#BE3144]/30'
          }`}>
          <Ionicons
            name={isSelected ? 'checkmark' : 'add'}
            size={isSelected ? 18 : 20}
            color={isSelected ? '#FFFFFF' : '#BE3144'}
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => onPress(exercise)}
          activeOpacity={0.7}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Ionicons name="chevron-forward" size={18} color="#71717A" />
        </TouchableOpacity>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  cardBorder: {
    borderCurve: 'continuous',
  },
});
