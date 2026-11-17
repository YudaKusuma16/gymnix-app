import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Body from 'react-native-body-highlighter';
import { mapMusclesToBodyData } from '../utils/muscleMapping';
import { capitalizeWords } from '@/utils/formatters';

interface MuscleHighlighterProps {
  primaryMuscles?: string[];
  secondaryMuscles?: string[];
  gender?: 'male' | 'female';
}

export function MuscleHighlighter({
  primaryMuscles = [],
  secondaryMuscles = [],
  gender = 'male',
}: MuscleHighlighterProps) {
  const { highlightData } = mapMusclesToBodyData(
    primaryMuscles,
    secondaryMuscles
  );

  const primaryText =
    primaryMuscles.length > 0
      ? capitalizeWords(primaryMuscles.join(', '))
      : 'General';

  const secondaryText =
    secondaryMuscles.length > 0
      ? capitalizeWords(secondaryMuscles.join(', '))
      : null;

  return (
    <View
      className="bg-black border border-[#222226] rounded-2xl p-3.5 mb-3.5 flex-row items-center"
      style={styles.cardBorder}>
      {/* 1. Left Side: Wider Anatomical Visualizer Column (~45% width) */}
      <View className="w-[45%] flex-row items-center justify-center gap-3 pr-4 border-r border-[#1E1E24]">
        {/* Front Model */}
        <View className="h-26 justify-center items-center">
          <Body
            data={highlightData}
            gender={gender}
            side="front"
            scale={0.38}
            colors={['#E28E98', '#BE3144']}
            defaultFill="#1C1C22"
            defaultStroke="#2E2E36"
            defaultStrokeWidth={1}
          />
        </View>

        {/* Back Model */}
        <View className="h-26 justify-center items-center">
          <Body
            data={highlightData}
            gender={gender}
            side="back"
            scale={0.38}
            colors={['#E28E98', '#BE3144']}
            defaultFill="#1C1C22"
            defaultStroke="#2E2E36"
            defaultStrokeWidth={1}
          />
        </View>
      </View>

      {/* 2. Right Side: Muscle Details */}
      <View className="flex-1 pl-4 justify-center">
        {/* Primary Muscle */}
        <View className="flex-row items-start mb-2">
          <View className="w-2 h-2 rounded-full bg-[#BE3144] mt-1 mr-1.5" />
          <View className="flex-1">
            <Text className="text-[#8E95A5] text-[11px] font-semibold leading-snug">
              Primary : <Text className="text-white font-bold text-[11px]">{primaryText}</Text>
            </Text>
          </View>
        </View>

        {/* Secondary Muscles */}
        {secondaryText && (
          <View className="flex-row items-start">
            <View className="w-2 h-2 rounded-full bg-[#E28E98] mt-1 mr-1.5" />
            <View className="flex-1">
              <Text className="text-[#8E95A5] text-[11px] font-semibold leading-snug">
                Secondary : <Text className="text-white font-bold text-[11px]">{secondaryText}</Text>
              </Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardBorder: {
    borderCurve: 'continuous',
  },
});
