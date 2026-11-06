import React from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: '#000000' }}
      className="flex-1 bg-black">
      {/* Top Header */}
      <View className="flex-row items-center justify-between px-6 py-4 border-b border-[#1F1F1F]">
        <Text className="text-white text-2xl font-bold tracking-tight">Profile</Text>
        <TouchableOpacity
          activeOpacity={0.7}
          className="w-9 h-9 rounded-full bg-[#141414] border border-[#27272A] items-center justify-center">
          <Ionicons name="settings-outline" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 20, paddingBottom: 40 }}
        className="flex-1">
        
        {/* 1. Athlete Profile Header Card */}
        <View className="bg-[#0A0A0A] rounded-2xl p-5 border border-[#1F1F1F] mb-6">
          <View className="flex-row items-center gap-4 mb-4">
            {/* Avatar Initials */}
            <View className="w-16 h-16 rounded-full bg-[#BE3144] items-center justify-center border-2 border-white/20">
              <Text className="text-white text-xl font-black">AP</Text>
            </View>

            <View className="flex-1">
              <View className="flex-row items-center justify-between">
                <Text className="text-white text-xl font-bold">Alex Pratama</Text>
                <View className="flex-row items-center bg-[#141414] px-2 py-0.5 rounded-full border border-[#27272A] gap-1">
                  <Text className="text-xs">🔥</Text>
                  <Text className="text-white text-[10px] font-bold">4-Day Fire</Text>
                </View>
              </View>
              <Text className="text-[#71717A] text-xs mt-0.5">
                @alexpratama • Since Jan 2024
              </Text>
              <Text className="text-[#BE3144] text-xs font-semibold mt-1">
                Iron District Metro Gym
              </Text>
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            className="flex-row items-center justify-center bg-[#141414] py-2.5 rounded-xl border border-[#27272A]">
            <Text className="text-white text-xs font-semibold">
              Edit Bio & Vitals
            </Text>
          </TouchableOpacity>
        </View>

        {/* 2. Key Body Metrics Grid (2x2) */}
        <View className="mb-6">
          <Text className="text-white text-base font-bold mb-3">Body Vitals</Text>

          <View className="flex-row gap-3 mb-3">
            {/* Height */}
            <View className="flex-1 bg-[#0A0A0A] rounded-2xl p-4 border border-[#1F1F1F]">
              <Text className="text-[#71717A] text-[10px] font-bold uppercase tracking-wider mb-1">
                HEIGHT
              </Text>
              <View className="flex-row items-baseline gap-1">
                <Text className="text-white text-2xl font-black">178</Text>
                <Text className="text-[#BE3144] text-xs font-bold uppercase">cm</Text>
              </View>
              <Text className="text-[#71717A] text-[10px] mt-1">
                BMI: 23.5 (Optimal)
              </Text>
            </View>

            {/* Weight */}
            <View className="flex-1 bg-[#0A0A0A] rounded-2xl p-4 border border-[#1F1F1F]">
              <Text className="text-[#71717A] text-[10px] font-bold uppercase tracking-wider mb-1">
                WEIGHT
              </Text>
              <View className="flex-row items-baseline gap-1">
                <Text className="text-white text-2xl font-black">74.5</Text>
                <Text className="text-[#BE3144] text-xs font-bold uppercase">kg</Text>
              </View>
              <Text className="text-emerald-400 text-[10px] mt-1">
                -0.3 kg this wk
              </Text>
            </View>
          </View>

          <View className="flex-row gap-3">
            {/* Calorie Cap */}
            <View className="flex-1 bg-[#0A0A0A] rounded-2xl p-4 border border-[#1F1F1F]">
              <Text className="text-[#71717A] text-[10px] font-bold uppercase tracking-wider mb-1">
                CALORIE CAP
              </Text>
              <View className="flex-row items-baseline gap-1">
                <Text className="text-white text-2xl font-black">2,450</Text>
                <Text className="text-[#BE3144] text-xs font-bold uppercase">kcal</Text>
              </View>
              <Text className="text-[#71717A] text-[10px] mt-1">
                BMR/TDEE Active
              </Text>
            </View>

            {/* Discipline */}
            <View className="flex-1 bg-[#0A0A0A] rounded-2xl p-4 border border-[#1F1F1F]">
              <Text className="text-[#71717A] text-[10px] font-bold uppercase tracking-wider mb-1">
                DISCIPLINE
              </Text>
              <View className="flex-row items-baseline gap-1">
                <Text className="text-white text-2xl font-black">4</Text>
                <Text className="text-[#BE3144] text-xs font-bold uppercase">Days</Text>
              </View>
              <Text className="text-[#71717A] text-[10px] mt-1">
                Personal Best: 18 Days
              </Text>
            </View>
          </View>
        </View>

        {/* 3. Personal Records: Standard Barbell Lifts (SBD) */}
        <View className="bg-[#0A0A0A] rounded-2xl p-5 border border-[#1F1F1F] mb-6">
          <View className="flex-row items-center justify-between mb-1">
            <Text className="text-white text-base font-bold">Personal Records</Text>
            <View className="bg-[#141414] px-2.5 py-0.5 rounded border border-[#27272A]">
              <Text className="text-[#BE3144] text-[10px] font-bold">Wilks: 382.4</Text>
            </View>
          </View>
          <Text className="text-[#71717A] text-xs mb-4">
            Standard Barbell Lifts (SBD)
          </Text>

          {/* Combined Total */}
          <View className="bg-[#141414] p-3 rounded-xl border border-[#27272A] flex-row items-center justify-between mb-4">
            <Text className="text-[#71717A] text-xs font-bold uppercase">
              COMBINED TOTAL VOLUME
            </Text>
            <View className="flex-row items-baseline gap-1">
              <Text className="text-white text-xl font-black">430</Text>
              <Text className="text-[#BE3144] text-xs font-bold">KG</Text>
            </View>
          </View>

          {/* 3 Columns: Squat / Bench / Deadlift */}
          <View className="flex-row gap-3">
            {/* Squat */}
            <View className="flex-1 bg-[#121212] p-3 rounded-xl border border-[#1F1F1F] items-center">
              <Text className="text-[#71717A] text-xs font-medium">Squat</Text>
              <Text className="text-white text-xl font-black my-1">140</Text>
              <Text className="text-[#71717A] text-[10px]">2w ago</Text>
            </View>

            {/* Bench */}
            <View className="flex-1 bg-[#121212] p-3 rounded-xl border border-[#BE3144] items-center">
              <Text className="text-[#BE3144] text-xs font-bold">Bench</Text>
              <Text className="text-white text-xl font-black my-1">105</Text>
              <Text className="text-emerald-400 text-[10px] font-bold">🔥 Yesterday</Text>
            </View>

            {/* Deadlift */}
            <View className="flex-1 bg-[#121212] p-3 rounded-xl border border-[#1F1F1F] items-center">
              <Text className="text-[#71717A] text-xs font-medium">Deadlift</Text>
              <Text className="text-white text-xl font-black my-1">185</Text>
              <Text className="text-[#71717A] text-[10px]">1mo ago</Text>
            </View>
          </View>
        </View>

        {/* 4. Training Program & Assessment Snapshot */}
        <View className="bg-[#0A0A0A] rounded-2xl p-5 border border-[#1F1F1F] mb-6">
          <Text className="text-white text-base font-bold mb-4">Training Profile</Text>

          <View className="gap-3">
            <View className="flex-row items-center justify-between py-2 border-b border-[#141414]">
              <Text className="text-[#71717A] text-xs">Primary Objective</Text>
              <Text className="text-white text-xs font-bold">
                Hypertrophy (Muscle Mass)
              </Text>
            </View>

            <View className="flex-row items-center justify-between py-2 border-b border-[#141414]">
              <Text className="text-[#71717A] text-xs">Frequency Protocol</Text>
              <Text className="text-white text-xs font-bold">
                4 - 5 Days / Week (Advanced)
              </Text>
            </View>

            <View className="flex-row items-center justify-between py-2">
              <Text className="text-[#71717A] text-xs">Home Facility</Text>
              <Text className="text-white text-xs font-bold">
                Iron District Metro Gym (0.8 km)
              </Text>
            </View>
          </View>
        </View>

        {/* 5. Account & Preferences Settings Menu Item */}
        <TouchableOpacity
          activeOpacity={0.8}
          className="bg-[#0A0A0A] rounded-2xl p-4 border border-[#1F1F1F] flex-row items-center justify-between mb-6">
          <View className="flex-row items-center gap-3.5 flex-1 pr-2">
            <View className="w-10 h-10 rounded-xl bg-[#141414] border border-[#27272A] items-center justify-center">
              <Ionicons name="settings" size={20} color="#BE3144" />
            </View>
            <View className="flex-1">
              <Text className="text-white text-sm font-bold">
                More Account & Workout Settings
              </Text>
              <Text className="text-[#71717A] text-xs mt-0.5" numberOfLines={1}>
                Timer defaults, unit preferences, privacy & app
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#71717A" />
        </TouchableOpacity>

        {/* Footer Build Version */}
        <Text className="text-[#52525B] text-xs text-center">
          Gymnix Build v2.8.4 • Athlete OS 2025
        </Text>

      </ScrollView>
    </SafeAreaView>
  );
}
