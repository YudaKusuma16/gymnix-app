import React, { useState } from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { Button } from '@/components/ui/button';
import { OnboardingHeader } from '@/components/ui/onboarding-header';

interface ExperienceOption {
  id: string;
  title: string;
  frequency: string;
  description: string;
}

const EXPERIENCES: ExperienceOption[] = [
  {
    id: 'beginner',
    title: 'Beginner',
    frequency: '• 1 - 2 days / week',
    description: 'Full body foundation routine',
  },
  {
    id: 'intermediate',
    title: 'Intermediate',
    frequency: '• 3 - 4 days / week',
    description: 'Upper / Lower or Push-Pull-Legs split',
  },
  {
    id: 'advanced',
    title: 'Advanced / Athlete',
    frequency: '• 5+ days / week',
    description: 'High frequency body part specialization',
  },
];

export default function TrainingExperienceScreen() {
  const router = useRouter();
  const [selectedExp, setSelectedExp] = useState('intermediate');
  const [loading, setLoading] = useState(false);

  const handleCompleteSetup = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Flow completed, navigate directly to Home tab
      router.replace('/(tabs)/home');
    }, 600);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000000', justifyContent: 'space-between' }} className="flex-1 bg-black justify-between">
      <View style={{ flex: 1, paddingHorizontal: 24 }} className="px-6 flex-1">
        {/* Top Header */}
        <OnboardingHeader currentStep={4} totalSteps={4} />

        <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
          {/* Header Texts */}
          <View className="pt-6 pb-2">
            <Text className="text-white text-2xl font-bold tracking-tight">
              How often do you train?
            </Text>
            <Text className="text-[#71717A] text-sm mt-2 leading-relaxed">
              To tailor your recovery and workout splits
            </Text>
          </View>

          {/* Experience Options */}
          <View className="mt-6 gap-4">
            {EXPERIENCES.map((item) => {
              const isSelected = selectedExp === item.id;
              return (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.85}
                  onPress={() => setSelectedExp(item.id)}
                  className={`p-5 rounded-2xl border ${
                    isSelected
                      ? 'border-[#BE3144] bg-[#BE3144]/10'
                      : 'border-[#1F1F1F] bg-[#0A0A0A]'
                  }`}>
                  <View className="flex-row items-center justify-between mb-2">
                    <View className="flex-row items-center gap-2">
                      <Text className="text-white text-lg font-bold">
                        {item.title}
                      </Text>
                      <Text className="text-[#BE3144] text-xs font-semibold">
                        {item.frequency}
                      </Text>
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
                  </View>

                  <Text className="text-[#71717A] text-sm">
                    {item.description}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </View>

      {/* Sticky Bottom Action */}
      <View className="px-6 pb-6 pt-3 bg-black">
        <Button
          title="Complete Setup"
          size="lg"
          loading={loading}
          onPress={handleCompleteSetup}
        />
      </View>
    </SafeAreaView>
  );
}
