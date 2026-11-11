import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { useExerciseDetail } from '@/features/exercises/hooks/useExerciseDetail';
import { ExerciseDetailParams } from '@/features/exercises/types/exercise.types';

export default function ExerciseDetailScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<ExerciseDetailParams>();

  // ViewModel hook
  const {
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
  } = useExerciseDetail(params);

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-black">
      {/* 1. Top Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-[#1A1A1A] bg-black">
        <View className="flex-row items-center gap-2.5">
          <TouchableOpacity
            onPress={goBack}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            className="w-8 h-9 items-center justify-center">
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text className="text-white text-lg font-bold tracking-tight">
            Exercise Detail
          </Text>
        </View>

        <TouchableOpacity
          onPress={toggleBookmark}
          activeOpacity={0.7}
          className="w-9 h-9 items-center justify-center">
          <Ionicons
            name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
            size={22}
            color={isBookmarked ? '#BE3144' : '#71717A'}
          />
        </TouchableOpacity>
      </View>

      {/* 2. Scrollable Body Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 18,
          paddingTop: 16,
          paddingBottom: insets.bottom + 90,
        }}
        className="flex-1">
        {/* Media Hero Overview */}
        <View className="items-center py-2 mb-6">
          {gifUrl ? (
            <View
              className="w-full aspect-square rounded-2xl bg-[#0D0D10] border border-[#222226] items-center justify-center mb-4 overflow-hidden shadow-lg"
              style={styles.cardBorder}>
              <Image
                source={{ uri: gifUrl }}
                style={{ width: '100%', height: '100%' }}
                contentFit="cover"
                transition={200}
              />
            </View>
          ) : (
            <View
              className="w-16 h-16 rounded-2xl bg-[#BE3144]/15 border border-[#BE3144]/35 items-center justify-center mb-3.5 shadow-lg"
              style={styles.cardBorder}>
              <Ionicons
                name={
                  equipment.toLowerCase().includes('barbell')
                    ? 'barbell-outline'
                    : 'fitness-outline'
                }
                size={32}
                color="#BE3144"
              />
            </View>
          )}
          <Text className="text-white text-2xl font-black text-center tracking-tight">
            {title}
          </Text>
          <View className="flex-row items-center gap-1.5 mt-1.5">
            <Ionicons name="locate-outline" size={14} color="#BE3144" />
            <Text className="text-[#BE3144] text-xs font-bold">
              {muscle} Focus • {equipment}
            </Text>
          </View>

          {/* Spec Chips */}
          <View className="flex-row flex-wrap justify-center gap-1.5 mt-3.5">
            {[category, difficulty, bodyPart || muscle]
              .filter(Boolean)
              .map((chip, i) => (
                <View
                  key={i}
                  className="bg-[#141416] border border-[#27272A] px-2.5 py-1 rounded-lg"
                  style={styles.pillBorder}>
                  <Text className="text-[#A1A1AA] text-[11px] font-semibold">
                    {chip}
                  </Text>
                </View>
              ))}
          </View>
        </View>

        {/* Description / Overview (No card wrapper, directly on background) */}
        {description ? (
          <View className="mb-6 px-1">
            <Text className="text-[#71717A] text-[11px] font-extrabold uppercase tracking-wider mb-2">
              OVERVIEW
            </Text>
            <Text className="text-[#D4D4D8] text-[13px] leading-6 font-normal">
              {description}
            </Text>
          </View>
        ) : null}

        {/* TARGET MUSCLES */}
        <View className="mb-6">
          <Text className="text-[#71717A] text-[11px] font-extrabold tracking-wider uppercase mb-2.5 pl-1">
            TARGET ANATOMY
          </Text>

          <View className="bg-[#0A0A0A] border border-[#27272A] rounded-2xl p-4 gap-3" style={styles.cardBorder}>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <View className="w-2.5 h-2.5 rounded-full bg-[#BE3144]" />
                <Text className="text-[#A1A1AA] text-xs font-semibold">Primary Target</Text>
              </View>
              <Text className="text-white text-xs font-bold">{muscle}</Text>
            </View>

            {secondaryList.length > 0 && (
              <>
                <View className="h-[1px] bg-[#1E1E22]" />
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-2">
                    <View className="w-2.5 h-2.5 rounded-full bg-[#52525B]" />
                    <Text className="text-[#A1A1AA] text-xs font-semibold">Secondary Target</Text>
                  </View>
                  <Text className="text-white text-xs font-bold">
                    {secondaryList.join(', ')}
                  </Text>
                </View>
              </>
            )}
          </View>
        </View>

        {/* STEP-BY-STEP INSTRUCTIONS (Single column container, clean numbers without circular badge) */}
        <View className="mb-6">
          <Text className="text-[#71717A] text-[11px] font-extrabold tracking-wider uppercase mb-2.5 pl-1">
            STEP-BY-STEP EXECUTION
          </Text>

          <View
            className="bg-[#0A0A0A] border border-[#27272A] rounded-2xl p-5"
            style={styles.cardBorder}>
            {instructionsList.length > 0 ? (
              instructionsList.map((step, idx) => (
                <View key={idx}>
                  <View className="flex-row items-start gap-3 pl-1">
                    <Text
                      className="text-[#BE3144] text-[13.5px] font-bold w-6 pt-0.5"
                      style={styles.tabularNums}>
                      {idx + 1}.
                    </Text>
                    <Text className="text-[#E4E4E7] text-[13px] leading-relaxed font-normal flex-1">
                      {step}
                    </Text>
                  </View>
                  {idx < instructionsList.length - 1 && (
                    <View className="h-[1px] bg-[#1E1E22] my-3.5 ml-1" />
                  )}
                </View>
              ))
            ) : (
              <Text className="text-[#71717A] text-xs">
                Maintain controlled eccentric tempo, brace core, and achieve full range of motion.
              </Text>
            )}
          </View>
        </View>

        {/* YOUR STATS Section */}
        <View className="mb-4">
          <Text className="text-[#71717A] text-[11px] font-extrabold tracking-wider uppercase mb-2 pl-1">
            YOUR STATS & PRs
          </Text>

          <View
            className="bg-[#0A0A0C] border border-[#1E1E22] rounded-2xl p-4 flex-row items-center justify-around"
            style={styles.cardBorder}>
            <View className="items-center">
              <Text className="text-white text-lg font-black" style={styles.tabularNums}>
                100 kg
              </Text>
              <Text className="text-[#71717A] text-[10px] font-bold uppercase mt-0.5">
                Est. 1RM
              </Text>
            </View>

            <View className="w-[1px] h-7 bg-[#24242A]" />

            <View className="items-center">
              <Text className="text-white text-lg font-black" style={styles.tabularNums}>
                8 Reps
              </Text>
              <Text className="text-[#71717A] text-[10px] font-bold uppercase mt-0.5">
                Top Set Reps
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* 3. Sticky Bottom CTA Bar */}
      <View
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}
        className="absolute bottom-0 left-0 right-0 p-4 bg-black/90 border-t border-[#1F1F1F]">
        <TouchableOpacity
          onPress={handleLogExercise}
          activeOpacity={0.88}
          className="w-full bg-[#BE3144] py-3.5 rounded-xl flex-row items-center justify-center gap-2 active:bg-[#A32837]"
          style={styles.pillBorder}>
          <Ionicons name="add-circle-outline" size={18} color="#FFFFFF" />
          <Text className="text-white text-sm font-black uppercase tracking-wider">
            Log This Exercise
          </Text>
        </TouchableOpacity>
      </View>
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
  tabularNums: {
    fontVariant: ['tabular-nums'],
  },
});
