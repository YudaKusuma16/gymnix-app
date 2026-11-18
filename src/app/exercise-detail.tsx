import React, { useState, useEffect } from 'react';
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
import { MuscleHighlighter } from '@/features/exercises/components/MuscleHighlighter';
import { getExerciseImageUrl } from '@/features/exercises/utils/muscleMapping';
import * as Haptics from '@/utils/haptics';

type DetailTab = 'Summary' | 'History' | 'How to';

export default function ExerciseDetailScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<ExerciseDetailParams>();

  // Active Tab
  const [activeTab, setActiveTab] = useState<DetailTab>('Summary');

  // ViewModel hook
  const {
    title,
    muscle,
    equipment,
    description,
    gifUrl,
    instructionsList,
    primaryList,
    secondaryList,
    imagesList,
    isBookmarked,
    toggleBookmark,
    handleLogExercise,
    goBack,
  } = useExerciseDetail(params);

  // Active image phase index (0: Start position, 1: Contraction position)
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Auto-switch between phase 0 and phase 1 like an animation video
  useEffect(() => {
    if (imagesList.length <= 1) return;
    const timer = setInterval(() => {
      setActiveImageIndex((prev) => (prev + 1) % imagesList.length);
    }, 850);
    return () => clearInterval(timer);
  }, [imagesList.length]);

  const heroImageUrl =
    imagesList.length > 0
      ? getExerciseImageUrl(imagesList[activeImageIndex] || imagesList[0])
      : gifUrl || null;

  const handleTabPress = (tab: DetailTab) => {
    Haptics.selectionAsync();
    setActiveTab(tab);
  };

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
          paddingBottom: insets.bottom + 90,
        }}
        className="flex-1 bg-black">
        {/* Compact Contained Hero GIF / Image */}
        {heroImageUrl ? (
          <View className="px-4 pt-3 mb-4">
            <View className="w-full h-60 rounded-2xl bg-white border border-[#222226] items-center justify-center overflow-hidden">
              <Image
                source={{ uri: heroImageUrl }}
                style={{ width: '100%', height: '100%' }}
                contentFit="contain"
                transition={180}
              />
              {imagesList.length > 1 && (
                <View className="absolute top-3 right-3 bg-black/75 px-2.5 py-1 rounded-full flex-row items-center gap-1.5 border border-white/10">
                  <Ionicons name="repeat" size={12} color="#BE3144" />
                  <Text className="text-white text-[10.5px] font-semibold tracking-wide">
                    {activeImageIndex === 0 ? 'Start' : 'Peak'}
                  </Text>
                </View>
              )}
            </View>
          </View>
        ) : (
          <View className="items-center py-4 mb-3">
            <View
              className="w-16 h-16 rounded-2xl bg-black border border-[#BE3144]/35 items-center justify-center shadow-lg">
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
          </View>
        )}

        {/* Padded Content Body */}
        <View className="px-4">
          {/* Title & Metadata (All Left-Aligned) */}
          <View className="items-start mb-4">
            <Text className="text-white text-2xl font-black text-left tracking-tight">
              {title}
            </Text>

            <Text className="text-[#BE3144] text-xs font-bold mt-1 text-left">
              {muscle} • {equipment}
            </Text>
          </View>

          {/* Optional Description / Overview (Left-Aligned) */}
          {description ? (
            <View className="mb-4">
              <Text className="text-[#D4D4D8] text-[12.5px] leading-5 font-normal text-left">
                {description}
              </Text>
            </View>
          ) : null}

          {/* 3. 2x2 Quick Stats Grid (Best e1RM, Heaviest, Workouts, Last done - Unboxed) */}
          <View className="mb-7 px-1">
          {/* Row 1: Best e1RM & Heaviest */}
          <View className="flex-row justify-between mb-3">
            {/* Best e1RM */}
            <View className="flex-1 flex-row items-center gap-3">
              <View className="w-10 h-10 rounded-xl bg-[#141417] items-center justify-center border border-[#222226]">
                <Ionicons name="trophy-outline" size={19} color="#9E9EA8" />
              </View>
              <View className="flex-1">
                <Text className="text-[#8E95A5] text-[11px] font-semibold">
                  Best e1RM
                </Text>
                <Text className="text-white text-[15px] font-bold mt-0.5">
                  -
                </Text>
              </View>
            </View>

            {/* Heaviest */}
            <View className="flex-1 flex-row items-center gap-3 pl-3">
              <View className="w-10 h-10 rounded-xl bg-[#141417] items-center justify-center border border-[#222226]">
                <Ionicons name="barbell-outline" size={19} color="#9E9EA8" />
              </View>
              <View className="flex-1">
                <Text className="text-[#8E95A5] text-[11px] font-semibold">
                  Heaviest
                </Text>
                <Text className="text-white text-[15px] font-bold mt-0.5">
                  -
                </Text>
              </View>
            </View>
          </View>

          {/* Row 2: Workouts & Last done */}
          <View className="flex-row justify-between">
            {/* Workouts */}
            <View className="flex-1 flex-row items-center gap-3">
              <View className="w-10 h-10 rounded-xl bg-[#141417] items-center justify-center border border-[#222226]">
                <Ionicons name="sync-outline" size={19} color="#9E9EA8" />
              </View>
              <View className="flex-1">
                <Text className="text-[#8E95A5] text-[11px] font-semibold">
                  Workouts
                </Text>
                <Text className="text-white text-[15px] font-bold mt-0.5">
                  0
                </Text>
              </View>
            </View>

            {/* Last done */}
            <View className="flex-1 flex-row items-center gap-3 pl-3">
              <View className="w-10 h-10 rounded-xl bg-[#141417] items-center justify-center border border-[#222226]">
                <Ionicons name="calendar-outline" size={19} color="#9E9EA8" />
              </View>
              <View className="flex-1">
                <Text className="text-[#8E95A5] text-[11px] font-semibold">
                  Last done
                </Text>
                <Text className="text-white text-[15px] font-bold mt-0.5">
                  Never
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* 4. Tab Navigation: Summary | History | How to (Brought more towards center) */}
        <View className="flex-row items-center px-8 border-b border-[#1E1E22] mb-4">
          {/* Tab 1: Summary (Aligned Left) */}
          <TouchableOpacity
            onPress={() => handleTabPress('Summary')}
            activeOpacity={0.7}
            className="flex-1 items-start pb-2.5">
            <View className="items-center relative">
              <Text
                className={`text-[14px] ${
                  activeTab === 'Summary'
                    ? 'text-white font-bold'
                    : 'text-[#71717A] font-semibold'
                }`}>
                Summary
              </Text>
              {activeTab === 'Summary' && (
                <View className="absolute bottom-[-11px] left-0 right-0 h-[2.5px] bg-[#BE3144] rounded-full" />
              )}
            </View>
          </TouchableOpacity>

          {/* Tab 2: History (Centered) */}
          <TouchableOpacity
            onPress={() => handleTabPress('History')}
            activeOpacity={0.7}
            className="flex-1 items-center pb-2.5">
            <View className="items-center relative">
              <Text
                className={`text-[14px] ${
                  activeTab === 'History'
                    ? 'text-white font-bold'
                    : 'text-[#71717A] font-semibold'
                }`}>
                History
              </Text>
              {activeTab === 'History' && (
                <View className="absolute bottom-[-11px] left-0 right-0 h-[2.5px] bg-[#BE3144] rounded-full" />
              )}
            </View>
          </TouchableOpacity>

          {/* Tab 3: How to (Aligned Right) */}
          <TouchableOpacity
            onPress={() => handleTabPress('How to')}
            activeOpacity={0.7}
            className="flex-1 items-end pb-2.5">
            <View className="items-center relative">
              <Text
                className={`text-[14px] ${
                  activeTab === 'How to'
                    ? 'text-white font-bold'
                    : 'text-[#71717A] font-semibold'
                }`}>
                How to
              </Text>
              {activeTab === 'How to' && (
                <View className="absolute bottom-[-11px] left-0 right-0 h-[2.5px] bg-[#BE3144] rounded-full" />
              )}
            </View>
          </TouchableOpacity>
        </View>

        {/* 5. TAB CONTENT */}
        {activeTab === 'Summary' && (
          <View>
            {/* Card 1: Muscle worked Anatomy */}
            <MuscleHighlighter
              primaryMuscles={primaryList}
              secondaryMuscles={secondaryList}
              gender="male"
            />

            {/* Card 2: Personal records */}
            <View
              className="bg-black border border-[#222226] rounded-2xl p-4 mb-3.5"
              style={styles.cardBorder}>
              <View className="flex-row items-center gap-2">
                <Ionicons name="trophy" size={17} color="#F59E0B" />
                <Text className="text-white text-sm font-bold">
                  Personal records
                </Text>
              </View>
              <Text className="text-[#8E95A5] text-[12.5px] mt-2 leading-relaxed">
                No records yet. Log this exercise to see them.
              </Text>
            </View>

            {/* Card 3: Estimated 1RM over time */}
            <View
              className="bg-black border border-[#222226] rounded-2xl p-4 mb-4"
              style={styles.cardBorder}>
              <Text className="text-white text-sm font-bold mb-8">
                Estimated 1RM over time (kg, Epley)
              </Text>
              <View className="py-6 items-center justify-center">
                <Text className="text-[#8E95A5] text-xs text-center leading-relaxed">
                  The line starts after your first workout with this.
                </Text>
              </View>
            </View>
          </View>
        )}

        {activeTab === 'History' && (
          <View
            className="bg-black border border-[#222226] rounded-2xl p-7 items-center justify-center mb-4 min-h-[190px]"
            style={styles.cardBorder}>
            <View className="w-12 h-12 rounded-2xl bg-black items-center justify-center border border-[#282830] mb-3">
              <Ionicons name="calendar-outline" size={24} color="#BE3144" />
            </View>
            <Text className="text-white text-sm font-bold text-center">
              No Workout History Yet
            </Text>
            <Text className="text-[#8E95A5] text-xs text-center mt-1 leading-relaxed max-w-[260px]">
              Workouts you complete with this exercise will appear here with your sets, reps, and weights.
            </Text>
          </View>
        )}

        {activeTab === 'How to' && (
          <View>
            {/* Step-by-Step Execution Card */}
            <View
              className="bg-black border border-[#222226] rounded-2xl p-5 mb-4"
              style={styles.cardBorder}>
              <Text className="text-[#8E95A5] text-[11px] font-extrabold tracking-wider uppercase mb-3.5">
                STEP-BY-STEP EXECUTION
              </Text>

              {instructionsList.length > 0 ? (
                instructionsList.map((step, idx) => (
                  <View key={idx}>
                    <View className="flex-row items-start gap-3">
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
                      <View className="h-[1px] bg-[#1E1E24] my-3.5 ml-1" />
                    )}
                  </View>
                ))
              ) : (
                <Text className="text-[#8E95A5] text-xs leading-relaxed">
                  Maintain controlled eccentric tempo, brace core, and achieve full range of motion.
                </Text>
              )}
            </View>
          </View>
        )}
        </View>
      </ScrollView>

      {/* 4. Sticky Bottom CTA Bar */}
      <View
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}
        className="absolute bottom-0 left-0 right-0 p-4 bg-black/95 border-t border-[#1F1F1F]">
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
