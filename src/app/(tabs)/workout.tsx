import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useWorkoutHub } from '@/features/workout/hooks/useWorkoutHub';

export default function WorkoutScreen() {
  const {
    calendarDays,
    selectedCalendarDay,
    selectDay,
    startNewWorkout,
    browseExerciseList,
  } = useWorkoutHub();

  return (
    <SafeAreaView style={styles.safeArea} className="flex-1 bg-black">
      {/* 1. Modern Header */}
      <View className="flex-row items-center justify-between px-6 py-3.5 border-b border-[#1A1A1A]">
        <View>
          <Text className="text-white text-2xl font-black tracking-tight">
            Workout
          </Text>
          <Text className="text-[#71717A] text-[11px] font-semibold tracking-wide uppercase mt-0.5">
            Progressive Overload
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          className="flex-row items-center bg-[#121212] px-3.5 py-2 rounded-full border border-[#262626] gap-1.5"
          style={styles.pillBorder}>
          <Ionicons name="calendar-outline" size={14} color="#BE3144" />
          <Text className="text-white text-xs font-bold">Log History</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        className="flex-1">

        {/* 2. Weekly Calendar Section (matches z-Html) */}
        <View className="flex-row items-center justify-between gap-1 mb-5">
          {calendarDays.map((cal, idx) => {
            const isActive = selectedCalendarDay === idx;
            return (
              <TouchableOpacity
                key={idx}
                activeOpacity={0.7}
                onPress={() => selectDay(idx)}
                className={`flex-1 items-center justify-center py-2 px-1 rounded-xl border ${
                  isActive
                    ? 'bg-[#121212] border-[#27272A]'
                    : 'bg-transparent border-transparent'
                }`}
                style={styles.pillBorder}>
                <Text
                  className={`text-[10px] font-bold tracking-wider mb-1 ${
                    isActive ? 'text-white' : 'text-[#71717A]'
                  }`}>
                  {cal.day}
                </Text>
                <Text
                  className={`text-base font-extrabold ${
                    isActive ? 'text-white' : 'text-[#A1A1AA]'
                  }`}
                  style={styles.tabularNums}>
                  {cal.date}
                </Text>
                {cal.hasWorkout && (
                  <View className="w-1 h-1 rounded-full bg-[#BE3144] mt-1" />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 3. Workout Setup Section (matches z-Html) */}
        <View className="mb-5">
          <Text className="text-[#71717A] text-[11px] font-extrabold tracking-wider uppercase mb-2 pl-0.5">
            Workout Setup
          </Text>
          <View
            className="bg-[#0A0A0A] border border-[#27272A] rounded-2xl overflow-hidden"
            style={styles.cardBorder}>
            <TouchableOpacity
              onPress={startNewWorkout}
              activeOpacity={0.75}
              className="p-4 flex-row items-center justify-between active:bg-[#1A1A1A]">
              <View>
                <Text className="text-white text-[15px] font-bold">
                  Start new workout
                </Text>
                <Text className="text-[#71717A] text-xs mt-0.5">
                  make a custom workout
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#71717A" />
            </TouchableOpacity>

            <View className="h-[1px] bg-[#222226] mx-4" />

            <TouchableOpacity
              onPress={browseExerciseList}
              activeOpacity={0.75}
              className="p-4 flex-row items-center justify-between active:bg-[#1A1A1A]">
              <View>
                <Text className="text-white text-[15px] font-bold">
                  Exercise list
                </Text>
                <Text className="text-[#71717A] text-xs mt-0.5">
                  Browse exercise movements
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#71717A" />
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
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
