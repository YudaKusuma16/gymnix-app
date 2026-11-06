import React, { useState } from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Button } from '@/components/ui/button';
import { OnboardingHeader } from '@/components/ui/onboarding-header';

interface GoalOption {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  description: string;
}

const GOALS: GoalOption[] = [
  {
    id: 'hypertrophy',
    title: 'Build Muscle / Hypertrophy',
    icon: 'barbell-outline',
    description: 'Optimize hypertrophy with volume & progressive overload',
  },
  {
    id: 'strength',
    title: 'Increase Strength & Power',
    icon: 'flash-outline',
    description: 'Maximize 1RM numbers on compound movements',
  },
  {
    id: 'fat_loss',
    title: 'Fat Loss & Conditioning',
    icon: 'flame-outline',
    description: 'Burn calories while preserving lean muscle mass',
  },
  {
    id: 'general',
    title: 'Maintain & General Fitness',
    icon: 'heart-outline',
    description: 'Build longevity, mobility, and consistent habits',
  },
];

export default function FitnessGoalScreen() {
  const router = useRouter();
  const [selectedGoal, setSelectedGoal] = useState('hypertrophy');

  const handleNext = () => {
    router.push('/(onboarding)/experience');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000000', justifyContent: 'space-between' }} className="flex-1 bg-black justify-between">
      <View style={{ flex: 1, paddingHorizontal: 24 }} className="px-6 flex-1">
        {/* Top Header */}
        <OnboardingHeader currentStep={3} totalSteps={4} />

        <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
          {/* Header Texts */}
          <View className="pt-6 pb-2">
            <Text className="text-white text-2xl font-bold tracking-tight">
              What is your primary goal?
            </Text>
            <Text className="text-[#71717A] text-sm mt-2 leading-relaxed">
              Select the focus for your training program
            </Text>
          </View>

          {/* Goal Options List */}
          <View className="mt-6 gap-3.5 pb-6">
            {GOALS.map((goal) => {
              const isSelected = selectedGoal === goal.id;
              return (
                <TouchableOpacity
                  key={goal.id}
                  activeOpacity={0.85}
                  onPress={() => setSelectedGoal(goal.id)}
                  style={{ paddingVertical: 20, paddingHorizontal: 18 }}
                  className={`flex-row items-center justify-between py-5 px-4.5 rounded-2xl border ${
                    isSelected
                      ? 'border-[#BE3144] bg-[#BE3144]/10'
                      : 'border-[#1F1F1F] bg-[#0A0A0A]'
                  }`}>
                  <View className="flex-row items-center gap-4 flex-1 pr-3">
                    <View
                      className={`w-12 h-12 rounded-xl items-center justify-center ${
                        isSelected ? 'bg-[#BE3144]/20' : 'bg-[#141414]'
                      }`}>
                      <Ionicons
                        name={goal.icon}
                        size={24}
                        color={isSelected ? '#BE3144' : '#FFFFFF'}
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="text-white text-base font-bold leading-snug">
                        {goal.title}
                      </Text>
                      <Text className="text-[#71717A] text-xs mt-1 leading-normal">
                        {goal.description}
                      </Text>
                    </View>
                  </View>

                  <View
                    className={`w-5 h-5 rounded-full items-center justify-center border-2 ${
                      isSelected
                        ? 'border-[#BE3144] bg-[#BE3144]'
                        : 'border-[#3F3F46]'
                    }`}>
                    {isSelected && (
                      <View className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </View>

      {/* Sticky Bottom Action */}
      <View className="px-6 pb-6 pt-3 bg-black">
        <Button title="Next" size="lg" onPress={handleNext} />
      </View>
    </SafeAreaView>
  );
}
