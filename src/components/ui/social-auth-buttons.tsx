import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SocialAuthButtonsProps {
  onApplePress?: () => void;
  onGooglePress?: () => void;
}

export function SocialAuthButtons({
  onApplePress,
  onGooglePress,
}: SocialAuthButtonsProps) {
  return (
    <View className="flex-row gap-3">
      <TouchableOpacity
        onPress={onApplePress}
        activeOpacity={0.8}
        className="flex-1 flex-row items-center justify-center py-3.5 px-4 bg-[#121212] rounded-xl border border-[#27272A] gap-2">
        <Ionicons name="logo-apple" size={20} color="#FFFFFF" />
        <Text className="text-white font-medium text-base">Apple</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onGooglePress}
        activeOpacity={0.8}
        className="flex-1 flex-row items-center justify-center py-3.5 px-4 bg-[#121212] rounded-xl border border-[#27272A] gap-2">
        <Ionicons name="logo-google" size={19} color="#EA4335" />
        <Text className="text-white font-medium text-base">Google</Text>
      </TouchableOpacity>
    </View>
  );
}
