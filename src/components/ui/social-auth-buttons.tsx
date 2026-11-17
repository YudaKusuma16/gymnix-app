import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SocialAuthButtonsProps {
  onGooglePress?: () => void;
  loading?: boolean;
}

export function SocialAuthButtons({
  onGooglePress,
  loading = false,
}: SocialAuthButtonsProps) {
  return (
    <View className="w-full">
      <TouchableOpacity
        onPress={onGooglePress}
        disabled={loading}
        activeOpacity={0.8}
        className="w-full flex-row items-center justify-center py-3.5 px-4 bg-[#18181B] rounded-xl border border-[#27272A] gap-2.5">
        {loading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Ionicons name="logo-google" size={19} color="#EA4335" />
        )}
        <Text className="text-white font-semibold text-sm">
          {loading ? 'Connecting with Google...' : 'Continue with Google'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
