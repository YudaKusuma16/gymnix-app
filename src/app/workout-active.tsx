import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  BackHandler,
  Dimensions,
  Easing,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useActiveWorkout } from '@/features/workout/hooks/useActiveWorkout';
import { formatElapsedSeconds, formatRestSeconds } from '@/utils/formatters';
import * as Haptics from '@/utils/haptics';

export default function WorkoutActiveScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // ViewModel hook
  const {
    workoutTitle,
    currentExerciseName,
    exerciseTarget,
    elapsedSeconds,
    isSessionPaused,
    isTimerStarted,
    restSeconds,
    getExerciseSets,
    nextExercises,
    expandedNext,
    setExpandedNext,
    toggleSetComplete,
    updateSetWeight,
    updateSetReps,
    addNewSet,
    adjustRest,
    toggleSessionPause,
    handleFinishWorkout,
    handleCancelWorkout,
  } = useActiveWorkout();

  const SCREEN_HEIGHT = Dimensions.get('window').height;
  const [translateY] = useState(() => new Animated.Value(SCREEN_HEIGHT));
  const isDismissing = useRef(false);

  // Smooth slide-up on enter
  useEffect(() => {
    Animated.timing(translateY, {
      toValue: 0,
      duration: 280,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [translateY]);

  // Smooth slide-down on dismiss / arrow down
  const handleDismiss = useCallback(() => {
    if (isDismissing.current) return;
    isDismissing.current = true;
    Haptics.selectionAsync();

    Animated.timing(translateY, {
      toValue: SCREEN_HEIGHT,
      duration: 250,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      router.back();
    });
  }, [SCREEN_HEIGHT, translateY, router]);

  // Hardware back button support on Android
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      handleDismiss();
      return true;
    });
    return () => sub.remove();
  }, [handleDismiss]);

  // Render a precise, un-hovered workout log table for any exercise
  const renderExerciseLogTable = (exerciseKey: string) => {
    const currentSets = getExerciseSets(exerciseKey);

    return (
      <View className="bg-[#0A0A0A] border border-[#1F1F1F] rounded-xl overflow-hidden mb-4">
        {/* Table Header */}
        <View className="flex-row items-center bg-[#121212] px-3 py-2.5 border-b border-[#1F1F1F]">
          <Text className="w-10 text-center text-[#71717A] text-[10px] font-bold tracking-wider">
            SET
          </Text>
          <Text className="flex-1 text-center text-[#71717A] text-[10px] font-bold tracking-wider">
            PREV
          </Text>
          <Text className="w-[72px] text-center text-[#71717A] text-[10px] font-bold tracking-wider">
            KG
          </Text>
          <Text className="w-[72px] text-center text-[#71717A] text-[10px] font-bold tracking-wider">
            REPS
          </Text>
          <Text className="w-12 text-center text-[#71717A] text-[10px] font-bold tracking-wider">
            LOG
          </Text>
        </View>

        {/* Table Rows */}
        {currentSets.map((item, index) => (
          <View
            key={item.setNumber}
            className="flex-row items-center px-3 py-2.5 border-t border-[#1F1F1F] bg-[#0A0A0A]">
            {/* Set number */}
            <Text className="w-10 text-center text-xs font-bold text-[#71717A]">
              {item.setNumber}
            </Text>

            {/* Previous reference */}
            <Text className="flex-1 text-center text-xs text-[#71717A]">
              {item.prev}
            </Text>

            {/* Weight Input */}
            <View className="w-[72px] items-center justify-center">
              <TextInput
                value={item.weight}
                onChangeText={(val) => updateSetWeight(exerciseKey, index, val)}
                placeholder="0"
                placeholderTextColor="#52525B"
                keyboardType="numeric"
                textAlignVertical="center"
                style={{
                  height: 38,
                  width: 64,
                  padding: 0,
                  paddingVertical: 0,
                  paddingHorizontal: 0,
                  textAlign: 'center',
                  textAlignVertical: 'center',
                  fontSize: 14,
                  fontWeight: '700',
                  color: '#FFFFFF',
                }}
                className="rounded-lg bg-[#121212] border border-[#1F1F1F]"
              />
            </View>

            {/* Reps Input */}
            <View className="w-[72px] items-center justify-center">
              <TextInput
                value={item.reps}
                onChangeText={(val) => updateSetReps(exerciseKey, index, val)}
                placeholder="0"
                placeholderTextColor="#52525B"
                keyboardType="numeric"
                textAlignVertical="center"
                style={{
                  height: 38,
                  width: 64,
                  padding: 0,
                  paddingVertical: 0,
                  paddingHorizontal: 0,
                  textAlign: 'center',
                  textAlignVertical: 'center',
                  fontSize: 14,
                  fontWeight: '700',
                  color: '#FFFFFF',
                }}
                className="rounded-lg bg-[#121212] border border-[#1F1F1F]"
              />
            </View>

            {/* Log Button */}
            <View className="w-12 items-center justify-center">
              <TouchableOpacity
                onPress={() => toggleSetComplete(exerciseKey, index)}
                activeOpacity={0.7}
                className={`w-9 h-9 rounded-lg items-center justify-center border ${
                  item.completed
                    ? 'bg-[#BE3144] border-[#BE3144]'
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
        ))}

        {/* Add Set Button */}
        <TouchableOpacity
          onPress={() => addNewSet(exerciseKey)}
          activeOpacity={0.7}
          className="flex-row items-center justify-center py-2.5 bg-[#121212] border-t border-[#1F1F1F]">
          <Ionicons name="add" size={16} color="#BE3144" />
          <Text className="text-[#BE3144] text-xs font-bold ml-1">Add Set</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'transparent' }}>
      <Animated.View
        style={{
          flex: 1,
          backgroundColor: '#000000',
          transform: [{ translateY }],
        }}>
        <SafeAreaView edges={['top']} className="flex-1 bg-black">
          {/* 1. Header */}
          <View className="flex-row items-center justify-between px-4 py-3 border-b border-[#1F1F1F] bg-black">
            <TouchableOpacity
              onPress={handleDismiss}
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              className="w-9 h-9 items-center justify-center">
              <Ionicons name="chevron-down" size={22} color="#FFFFFF" />
            </TouchableOpacity>

        <Text
          numberOfLines={1}
          className="text-white text-[17px] font-extrabold tracking-tight max-w-[200px] text-center">
          {workoutTitle}
        </Text>

        <View className="w-9" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 28,
        }}
        className="flex-1">
        {/* 2. Dual Timers Strip */}
        <View className="bg-[#0A0A0C] border border-[#1F1F24] rounded-2xl p-3.5 flex-row items-center justify-between mb-4">
          {/* Total Elapsed (tap to start or pause) */}
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={toggleSessionPause}>
            <View className="flex-row items-center gap-1.5 mb-0.5">
              <Text className="text-[#71717A] text-[10px] font-extrabold tracking-wider uppercase">
                TOTAL TIME
              </Text>
              {isSessionPaused ? (
                <View className="bg-amber-500/20 px-1 rounded">
                  <Text className="text-amber-400 text-[9px] font-bold">PAUSED</Text>
                </View>
              ) : null}
            </View>
            <Text
              className={`text-xl font-black font-mono ${
                !isTimerStarted
                  ? 'text-[#71717A]'
                  : isSessionPaused
                  ? 'text-amber-400'
                  : 'text-white'
              }`}>
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
            EXERCISE 1
          </Text>
          <Text className="text-white text-xl font-bold tracking-tight mb-1">
            {currentExerciseName}
          </Text>
          <Text className="text-[#71717A] text-[13px]">
            {exerciseTarget}
          </Text>
        </View>

        {/* 4. Set Logger Table for Primary Exercise */}
        {renderExerciseLogTable('primary')}

        {/* 5. Up Next In Session Accordion */}
        {nextExercises.length > 0 && (
          <View className="mb-6">
            <Text className="text-[#71717A] text-xs font-semibold tracking-wider uppercase mb-3">
              UP NEXT IN SESSION ({nextExercises.length})
            </Text>

            {nextExercises.map((item) => {
              const isExpanded = expandedNext === item.id;

              return (
                <View
                  key={item.id}
                  className="bg-[#0A0A0A] border border-[#1F1F1F] rounded-xl mb-2.5 overflow-hidden">
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => setExpandedNext(isExpanded ? null : item.id)}
                    className="flex-row items-center justify-between p-3.5">
                    <View className="flex-1 pr-2">
                      <Text className="text-white font-bold text-sm">
                        {item.name}
                      </Text>
                      <Text className="text-[#71717A] text-xs mt-0.5">
                        {item.setsCount || item.target}
                      </Text>
                    </View>
                    <Ionicons
                      name={isExpanded ? 'chevron-up' : 'chevron-down'}
                      size={18}
                      color="#71717A"
                    />
                  </TouchableOpacity>

                  {/* Expanded Workout Log for this exercise */}
                  {isExpanded && (
                    <View className="px-3 pb-3 pt-1 border-t border-[#1F1F1F]/60">
                      {renderExerciseLogTable(item.name)}
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Static Bottom Actions Bar */}
      <View
        style={{
          paddingBottom: Math.max(insets.bottom, 16),
        }}
        className="px-4 pt-3 bg-[#0A0A0C] border-t border-[#1F1F24] flex-row items-center gap-3">
        <TouchableOpacity
          onPress={handleCancelWorkout}
          activeOpacity={0.75}
          className="flex-1 h-12 items-center justify-center bg-[#141416] border border-[#27272A] rounded-xl">
          <Ionicons name="trash-outline" size={20} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={toggleSessionPause}
          activeOpacity={0.75}
          style={{ backgroundColor: '#10B981' }}
          className="flex-1 h-12 items-center justify-center rounded-xl shadow-lg">
          <Ionicons
            name={isTimerStarted && !isSessionPaused ? 'pause' : 'play'}
            size={20}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleFinishWorkout}
          activeOpacity={0.85}
          className="flex-1 h-12 items-center justify-center bg-[#BE3144] rounded-xl shadow-lg active:bg-[#A32837]">
          <Ionicons name="checkmark" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
        </SafeAreaView>
      </Animated.View>
    </View>
  );
}
