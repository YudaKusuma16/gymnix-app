import React from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useActiveWorkout } from '@/features/workout/hooks/useActiveWorkout';
import { formatElapsedSeconds, formatRestSeconds } from '@/utils/formatters';

export default function WorkoutActiveScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // ViewModel hook
  const {
    elapsedSeconds,
    isSessionPaused,
    restSeconds,
    sets,
    expandedNext,
    setExpandedNext,
    toggleSetComplete,
    updateSetWeight,
    updateSetReps,
    adjustRest,
    toggleSessionPause,
    handleFinishWorkout,
    handleCancelWorkout,
  } = useActiveWorkout();

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-black">
      {/* 1. Header (matches z-Html) */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-[#1F1F1F] bg-black">
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          className="w-9 h-9 items-center justify-center">
          <Ionicons name="chevron-down" size={22} color="#FFFFFF" />
        </TouchableOpacity>

        <Text className="text-white text-[17px] font-extrabold tracking-tight">
          Push Day A
        </Text>

        <TouchableOpacity
          onPress={handleFinishWorkout}
          activeOpacity={0.8}
          className="bg-[#BE3144] px-3.5 py-1.5 rounded-full shadow-md">
          <Text className="text-white text-xs font-black tracking-wider">
            FINISH
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: insets.bottom + 40,
        }}
        className="flex-1">
        {/* 2. Dual Timers Strip (matches z-Html) */}
        <View className="bg-[#0A0A0C] border border-[#1F1F24] rounded-2xl p-3.5 flex-row items-center justify-between mb-4">
          {/* Total Elapsed (tap to toggle pause) */}
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={toggleSessionPause}>
            <View className="flex-row items-center gap-1.5 mb-0.5">
              <Text className="text-[#71717A] text-[10px] font-extrabold tracking-wider uppercase">
                TOTAL TIME
              </Text>
              {isSessionPaused && (
                <View className="bg-amber-500/20 px-1 rounded">
                  <Text className="text-amber-400 text-[9px] font-bold">PAUSED</Text>
                </View>
              )}
            </View>
            <Text className={`text-xl font-black font-mono ${isSessionPaused ? 'text-amber-400' : 'text-white'}`}>
              {formatElapsedSeconds(elapsedSeconds)}
            </Text>
          </TouchableOpacity>

          <View className="w-[1px] h-8 bg-[#1F1F24]" />

          {/* Rest Countdown */}
          <View>
            <Text className="text-[#71717A] text-[10px] font-extrabold tracking-wider uppercase mb-0.5">
              REST TIMER
            </Text>
            <View className="flex-row items-center gap-2">
              <Text className="text-[#BE3144] text-xl font-black font-mono">
                {formatRestSeconds(restSeconds)}
              </Text>
              <View className="flex-row items-center gap-1.5">
                <TouchableOpacity
                  onPress={() => adjustRest(30)}
                  activeOpacity={0.7}
                  className="bg-[#141418] border border-[#27272A] px-2 py-1 rounded-lg">
                  <Text className="text-white text-[11px] font-bold">+30s</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => adjustRest(-restSeconds)}
                  activeOpacity={0.7}
                  className="bg-[#141418] border border-[#27272A] px-2 py-1 rounded-lg">
                  <Text className="text-white text-[11px] font-bold">Skip</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* 3. Exercise Details Header */}
        <View className="mb-4">
          <Text className="text-[#71717A] text-xs font-semibold tracking-wider uppercase mb-1">
            PUSH DAY A • EXERCISE 1
          </Text>
          <Text className="text-white text-xl font-bold tracking-tight mb-1">
            Barbell Flat Bench Press
          </Text>
          <Text className="text-[#71717A] text-[13px]">
            Target: 3 Sets × 6–8 Reps • RPE 8.5
          </Text>
        </View>

        {/* 4. Set Logger Table */}
        <View className="bg-[#0A0A0A] border border-[#1F1F1F] rounded-xl overflow-hidden mb-4">
          {/* Table Header */}
          <View className="flex-row items-center bg-[#121212] px-3 py-2.5 border-b border-[#1F1F1F]">
            <Text className="w-10 text-center text-[#71717A] text-[10px] font-bold tracking-wider">
              SET
            </Text>
            <Text className="flex-1 text-center text-[#71717A] text-[10px] font-bold tracking-wider">
              PREV
            </Text>
            <Text className="w-20 text-center text-[#71717A] text-[10px] font-bold tracking-wider">
              KG
            </Text>
            <Text className="w-16 text-center text-[#71717A] text-[10px] font-bold tracking-wider">
              REPS
            </Text>
            <Text className="w-10 text-center text-[#71717A] text-[10px] font-bold tracking-wider">
              LOG
            </Text>
          </View>

          {/* Table Rows */}
          {sets.map((item, index) => {
            const isActiveUncompleted = !item.completed && sets.slice(0, index).every((s) => s.completed);

            return (
              <View
                key={item.setNumber}
                className={`flex-row items-center px-3 py-3 border-t border-[#1F1F1F] ${
                  isActiveUncompleted
                    ? 'bg-[#BE3144]/10'
                    : item.completed
                    ? 'bg-[#0A0A0A]'
                    : 'bg-[#0A0A0A]/60'
                }`}>
                {/* Set number */}
                <Text
                  className={`w-10 text-center text-xs font-bold ${
                    item.completed ? 'text-[#BE3144]' : 'text-[#71717A]'
                  }`}>
                  {item.setNumber}
                </Text>

                {/* Previous reference */}
                <Text className="flex-1 text-center text-xs text-[#71717A]">
                  {item.prev}
                </Text>

                {/* Weight Input */}
                <View className="w-20 items-center justify-center">
                  <TextInput
                    value={item.weight}
                    onChangeText={(val) => updateSetWeight(index, val)}
                    keyboardType="numeric"
                    className={`w-16 h-8 text-center text-xs font-bold rounded text-white bg-[#121212] border ${
                      isActiveUncompleted
                        ? 'border-[#BE3144] text-white'
                        : 'border-[#1F1F1F]'
                    }`}
                  />
                </View>

                {/* Reps Input */}
                <View className="w-16 items-center justify-center">
                  <TextInput
                    value={item.reps}
                    onChangeText={(val) => updateSetReps(index, val)}
                    keyboardType="numeric"
                    className="w-14 h-8 text-center text-xs font-bold rounded text-white bg-[#121212] border border-[#1F1F1F]"
                  />
                </View>

                {/* Log Button */}
                <View className="w-10 items-center justify-center">
                  <TouchableOpacity
                    onPress={() => toggleSetComplete(index)}
                    activeOpacity={0.7}
                    className={`w-8 h-8 rounded-lg items-center justify-center border ${
                      item.completed
                        ? 'bg-[#BE3144] border-[#BE3144]'
                        : isActiveUncompleted
                        ? 'bg-[#121212] border-[#BE3144]/60'
                        : 'bg-[#121212] border-[#27272A]'
                    }`}>
                    <Ionicons
                      name="checkmark"
                      size={16}
                      color={item.completed ? '#FFFFFF' : '#71717A'}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>

        {/* 5. Plate Calculator Card */}
        <View className="flex-row items-center bg-[#0A0A0A] border border-[#1F1F1F] rounded-xl p-3.5 gap-3 mb-6">
          <View className="w-9 h-9 rounded-lg bg-[#121212] border border-[#1F1F1F] items-center justify-center">
            <MaterialCommunityIcons name="calculator" size={20} color="#71717A" />
          </View>
          <View className="flex-1">
            <Text className="text-[#71717A] text-[11px] font-bold tracking-wider uppercase mb-0.5">
              PLATE
            </Text>
            <Text className="text-[#C8C6C5] text-xs font-medium">
              20 kg Bar + 2×20 kg + 2×10 kg
            </Text>
          </View>
        </View>

        {/* 6. Up Next In Session Accordion */}
        <View className="mb-6">
          <Text className="text-[#71717A] text-xs font-semibold tracking-wider uppercase mb-3">
            UP NEXT IN SESSION
          </Text>

          {/* Card 1 */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setExpandedNext(expandedNext === 1 ? null : 1)}
            className="flex-row items-center justify-between bg-[#0A0A0A] border border-[#1F1F1F] rounded-xl p-3.5 mb-2.5">
            <View className="flex-row items-center gap-3">
              <View className="w-9 h-9 rounded-lg bg-[#121212] border border-[#1F1F1F] items-center justify-center">
                <Text className="text-white font-bold text-sm">2</Text>
              </View>
              <View>
                <Text className="text-white font-bold text-sm">
                  Incline Dumbbell Press
                </Text>
                <Text className="text-[#71717A] text-xs mt-0.5">
                  3 sets • 28 kg targets
                </Text>
              </View>
            </View>
            <Ionicons
              name={expandedNext === 1 ? 'chevron-up' : 'chevron-down'}
              size={18}
              color="#71717A"
            />
          </TouchableOpacity>

          {/* Card 2 */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setExpandedNext(expandedNext === 2 ? null : 2)}
            className="flex-row items-center justify-between bg-[#0A0A0A]/60 border border-[#1F1F1F]/80 rounded-xl p-3.5">
            <View className="flex-row items-center gap-3">
              <View className="w-9 h-9 rounded-lg bg-[#121212] border border-[#1F1F1F] items-center justify-center">
                <Text className="text-white/80 font-bold text-sm">3</Text>
              </View>
              <View>
                <Text className="text-white/80 font-bold text-sm">
                  Cable Chest Flyes
                </Text>
                <Text className="text-[#71717A] text-xs mt-0.5">
                  3 sets • 15 kg targets
                </Text>
              </View>
            </View>
            <Ionicons
              name={expandedNext === 2 ? 'chevron-up' : 'chevron-down'}
              size={18}
              color="#71717A"
            />
          </TouchableOpacity>
        </View>

        {/* Bottom Actions (matches z-Html) */}
        <View className="flex-row items-center gap-3 mt-4 mb-6">
          <TouchableOpacity
            onPress={handleCancelWorkout}
            activeOpacity={0.75}
            className="flex-1 items-center justify-center bg-[#141416] border border-[#27272A] rounded-xl py-3.5">
            <Text className="text-white text-xs font-bold">
              Cancel
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleFinishWorkout}
            activeOpacity={0.85}
            className="flex-[2] flex-row items-center justify-center bg-[#BE3144] rounded-xl py-3.5 gap-2 shadow-lg active:bg-[#A32837]">
            <Ionicons name="checkmark-sharp" size={17} color="#FFFFFF" />
            <Text className="text-white font-bold text-xs tracking-wide uppercase">
              Save & Complete
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
