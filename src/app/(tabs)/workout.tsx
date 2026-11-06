import React, { useState } from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function WorkoutScreen() {
  const [selectedTemplateFilter, setSelectedTemplateFilter] = useState('All');

  const templateFilters = ['All', 'Hypertrophy', 'Strength', 'Fat Loss', 'Bodyweight'];

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: '#000000' }}
      className="flex-1 bg-black">
      {/* Top Header */}
      <View className="flex-row items-center justify-between px-6 py-4 border-b border-[#1F1F1F]">
        <Text className="text-white text-2xl font-bold tracking-tight">
          Workout
        </Text>
        <TouchableOpacity
          activeOpacity={0.7}
          className="flex-row items-center bg-[#141414] px-3 py-1.5 rounded-xl border border-[#27272A] gap-1.5">
          <Ionicons name="time-outline" size={16} color="#A1A1AA" />
          <Text className="text-white text-xs font-semibold">History</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 20, paddingBottom: 40 }}
        className="flex-1">
        
        {/* 1. Quick Start Banner */}
        <View className="bg-[#0A0A0A] rounded-2xl p-5 border border-[#1F1F1F] mb-6">
          <Text className="text-white text-lg font-bold">Quick Start</Text>
          <Text className="text-[#71717A] text-xs mt-1 mb-4">
            Log sets on the fly without a routine
          </Text>

          <TouchableOpacity
            activeOpacity={0.85}
            className="flex-row items-center justify-center bg-[#141414] py-3.5 rounded-xl border border-[#BE3144] gap-2 active:bg-[#BE3144]/10">
            <Ionicons name="add" size={20} color="#BE3144" />
            <Text className="text-white font-bold text-sm">
              Start Empty Workout
            </Text>
          </TouchableOpacity>
        </View>

        {/* 2. Recent Workout Snippet */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-[#71717A] text-xs font-bold uppercase tracking-wider">
              RECENT ACTIVITY
            </Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text className="text-[#BE3144] text-xs font-semibold">View Log</Text>
            </TouchableOpacity>
          </View>

          <View className="bg-[#0A0A0A] rounded-2xl p-4 border border-[#1F1F1F] flex-row items-center justify-between">
            <View className="flex-1">
              <View className="flex-row items-center gap-2">
                <Text className="text-white text-base font-bold">Push Day A</Text>
                <View className="bg-[#BE3144]/20 px-2 py-0.5 rounded-md">
                  <Text className="text-[#BE3144] text-[10px] font-bold">1 PR</Text>
                </View>
              </View>
              <Text className="text-[#71717A] text-xs mt-1">
                Yesterday • 14,820 kg vol • 48 min
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#71717A" />
          </View>
        </View>

        {/* 3. My Routines Section */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center gap-2">
              <Text className="text-white text-lg font-bold">My Routines</Text>
              <Text className="text-[#71717A] text-sm font-semibold">(3)</Text>
            </View>
            <TouchableOpacity activeOpacity={0.7}>
              <Text className="text-[#BE3144] text-xs font-semibold">Manage</Text>
            </TouchableOpacity>
          </View>

          {/* Routine 1 (Recommended Today) */}
          <View className="bg-[#0A0A0A] rounded-2xl p-5 border border-[#BE3144] relative overflow-hidden mb-4">
            <View className="flex-row items-center justify-between mb-2">
              <View className="bg-[#BE3144] px-2.5 py-0.5 rounded-md">
                <Text className="text-white text-[10px] font-extrabold uppercase tracking-wide">
                  Recommended Today
                </Text>
              </View>
              <Text className="text-[#71717A] text-xs">Last: 3d ago</Text>
            </View>

            <Text className="text-white text-xl font-bold mt-1">Push Day A</Text>
            <Text className="text-[#71717A] text-xs mb-3">
              Chest, Shoulders & Triceps • 5 Moves • ~50 min
            </Text>

            <View className="flex-row flex-wrap gap-1.5 mb-4">
              {['Bench Press', 'Incline DB Press', 'Overhead Press', 'Lateral Raises', '+1 more'].map(
                (item, i) => (
                  <View key={i} className="bg-[#141414] px-2.5 py-1 rounded-md border border-[#27272A]">
                    <Text className="text-[#A1A1AA] text-[11px] font-medium">{item}</Text>
                  </View>
                )
              )}
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              className="flex-row items-center justify-center bg-[#BE3144] py-3 rounded-xl gap-2 active:bg-[#A32837]">
              <Ionicons name="play" size={16} color="#FFFFFF" />
              <Text className="text-white font-bold text-sm">Start Routine</Text>
            </TouchableOpacity>
          </View>

          {/* Routine 2: Pull Day B */}
          <View className="bg-[#0A0A0A] rounded-2xl p-4 border border-[#1F1F1F] mb-3">
            <View className="flex-row items-center justify-between">
              <View className="flex-1 pr-3">
                <Text className="text-white text-base font-bold">Pull Day B</Text>
                <Text className="text-[#71717A] text-xs mt-0.5">
                  Back & Biceps Focus • 5 Exercises • ~55 min
                </Text>
                <Text className="text-[#52525B] text-[11px] mt-2" numberOfLines={1}>
                  Deadlift, Lat Pulldown, Cable Rows, Face Pulls, Incline Curls
                </Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.85}
                className="bg-[#141414] border border-[#27272A] px-4 py-2 rounded-xl active:bg-[#BE3144]">
                <Text className="text-white text-xs font-bold">Start</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Routine 3: Legs & Core */}
          <View className="bg-[#0A0A0A] rounded-2xl p-4 border border-[#1F1F1F]">
            <View className="flex-row items-center justify-between">
              <View className="flex-1 pr-3">
                <Text className="text-white text-base font-bold">Legs & Core</Text>
                <Text className="text-[#71717A] text-xs mt-0.5">
                  Quads, Hamstrings & Abs • 4 Exercises • ~45 min
                </Text>
                <Text className="text-[#52525B] text-[11px] mt-2" numberOfLines={1}>
                  Barbell Squats, Romanian Deadlifts, Bulgarian Split Squats, Hanging Knee Raises
                </Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.85}
                className="bg-[#141414] border border-[#27272A] px-4 py-2 rounded-xl active:bg-[#BE3144]">
                <Text className="text-white text-xs font-bold">Start</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 4. Workout Templates Section */}
        <View>
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-white text-lg font-bold">Workout Templates</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text className="text-[#BE3144] text-xs font-semibold">Browse All</Text>
            </TouchableOpacity>
          </View>

          {/* Filter Pills */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-row gap-2 mb-4">
            {templateFilters.map((filter) => (
              <TouchableOpacity
                key={filter}
                onPress={() => setSelectedTemplateFilter(filter)}
                className={`px-3.5 py-1.5 rounded-lg border mr-2 ${
                  selectedTemplateFilter === filter
                    ? 'bg-[#BE3144] border-[#BE3144]'
                    : 'bg-[#0A0A0A] border-[#1F1F1F]'
                }`}>
                <Text
                  className={`text-xs font-bold ${
                    selectedTemplateFilter === filter ? 'text-white' : 'text-[#71717A]'
                  }`}>
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Template Card 1 */}
          <View className="bg-[#0A0A0A] rounded-2xl p-4 border border-[#1F1F1F] mb-3">
            <View className="flex-row items-center justify-between mb-1.5">
              <Text className="text-white text-base font-bold">Arnold Split (Advanced)</Text>
              <View className="bg-[#141414] px-2 py-0.5 rounded border border-[#27272A]">
                <Text className="text-[#BE3144] text-[10px] font-bold">6 Days / Wk</Text>
              </View>
            </View>
            <Text className="text-[#71717A] text-xs leading-relaxed mb-3">
              Chest & Back, Shoulders & Arms, Legs rotated twice weekly for maximum volume hypertrophy.
            </Text>
            <Text className="text-[#A1A1AA] text-[11px] font-medium">
              ~65 min/session • High Intensity
            </Text>
          </View>

          {/* Template Card 2 */}
          <View className="bg-[#0A0A0A] rounded-2xl p-4 border border-[#1F1F1F]">
            <View className="flex-row items-center justify-between mb-1.5">
              <Text className="text-white text-base font-bold">Upper / Lower Strength Split</Text>
              <View className="bg-[#141414] px-2 py-0.5 rounded border border-[#27272A]">
                <Text className="text-[#BE3144] text-[10px] font-bold">4 Days / Wk</Text>
              </View>
            </View>
            <Text className="text-[#71717A] text-xs leading-relaxed mb-3">
              Optimized recovery frequency emphasizing progressive overload on compound lifts.
            </Text>
            <Text className="text-[#A1A1AA] text-[11px] font-medium">
              ~50 min/session • Intermediate
            </Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
