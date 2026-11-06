import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface OnboardingHeaderProps {
  currentStep: number;
  totalSteps?: number;
  onBack?: () => void;
  showBack?: boolean;
}

export function OnboardingHeader({
  currentStep,
  totalSteps = 4,
  onBack,
  showBack = true,
}: OnboardingHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (router.canGoBack()) {
      router.back();
    }
  };

  return (
    <View className="w-full pt-2 pb-4">
      {/* Top Bar: Back Button & Step Counter */}
      <View className="flex-row items-center justify-between mb-4">
        {showBack ? (
          <TouchableOpacity
            onPress={handleBack}
            activeOpacity={0.7}
            className="w-10 h-10 rounded-full bg-[#121212] border border-[#27272A] items-center justify-center">
            <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        ) : (
          <View className="w-10 h-10" />
        )}

        <Text className="text-[#71717A] text-sm font-bold tracking-wide">
          {currentStep} / {totalSteps}
        </Text>
      </View>

      {/* 5-Segment Progress Bar */}
      <View className="flex-row gap-2 w-full">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const isActive = index < currentStep;
          return (
            <View
              key={index}
              className={`flex-1 h-1.5 rounded-full ${
                isActive ? 'bg-[#BE3144]' : 'bg-[#1F1F1F]'
              }`}
            />
          );
        })}
      </View>
    </View>
  );
}
