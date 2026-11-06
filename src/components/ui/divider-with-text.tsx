import React from 'react';
import { Text, View } from 'react-native';

interface DividerWithTextProps {
  text?: string;
}

export function DividerWithText({ text = 'OR CONTINUE WITH' }: DividerWithTextProps) {
  return (
    <View className="flex-row items-center my-6">
      <View className="flex-1 h-[1px] bg-[#1F1F1F]" />
      <Text className="mx-3 text-[#71717A] text-xs font-semibold tracking-wider">
        {text}
      </Text>
      <View className="flex-1 h-[1px] bg-[#1F1F1F]" />
    </View>
  );
}
