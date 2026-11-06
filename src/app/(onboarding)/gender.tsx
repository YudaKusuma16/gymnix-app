import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Button } from '@/components/ui/button';
import { OnboardingHeader } from '@/components/ui/onboarding-header';

type Gender = 'male' | 'female';

export default function GenderSelectionScreen() {
  const router = useRouter();
  const [selectedGender, setSelectedGender] = useState<Gender>('male');

  const handleNext = () => {
    router.push('/(onboarding)/measurements');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000000', justifyContent: 'space-between' }} className="flex-1 bg-black justify-between">
      <View style={{ flex: 1, paddingHorizontal: 24 }} className="px-6 flex-1">
        {/* Top Header */}
        <OnboardingHeader currentStep={1} totalSteps={4} />

        {/* Wizard Content */}
        <View className="pt-6">
          <Text className="text-white text-2xl font-bold tracking-tight">
            {"What's your gender?"}
          </Text>
          <Text className="text-[#71717A] text-sm mt-2">
            This helps us tailor calorie targets and strength standards.
          </Text>

          {/* Gender Options */}
          <View className="mt-8 gap-4">
            {/* Male Card */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setSelectedGender('male')}
              className={`flex-row items-center justify-between p-5 rounded-2xl border ${
                selectedGender === 'male'
                  ? 'border-[#BE3144] bg-[#BE3144]/10'
                  : 'border-[#1F1F1F] bg-[#0A0A0A]'
              }`}>
              <View className="flex-row items-center gap-4">
                <View
                  className={`w-12 h-12 rounded-xl items-center justify-center ${
                    selectedGender === 'male' ? 'bg-[#BE3144]/20' : 'bg-[#141414]'
                  }`}>
                  <Ionicons
                    name="male"
                    size={24}
                    color={selectedGender === 'male' ? '#BE3144' : '#FFFFFF'}
                  />
                </View>
                <Text className="text-white text-lg font-bold">Male</Text>
              </View>

              <View
                className={`w-6 h-6 rounded-full items-center justify-center border-2 ${
                  selectedGender === 'male'
                    ? 'border-[#BE3144] bg-[#BE3144]'
                    : 'border-[#3F3F46]'
                }`}>
                {selectedGender === 'male' && (
                  <View className="w-2.5 h-2.5 rounded-full bg-white" />
                )}
              </View>
            </TouchableOpacity>

            {/* Female Card */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setSelectedGender('female')}
              className={`flex-row items-center justify-between p-5 rounded-2xl border ${
                selectedGender === 'female'
                  ? 'border-[#BE3144] bg-[#BE3144]/10'
                  : 'border-[#1F1F1F] bg-[#0A0A0A]'
              }`}>
              <View className="flex-row items-center gap-4">
                <View
                  className={`w-12 h-12 rounded-xl items-center justify-center ${
                    selectedGender === 'female' ? 'bg-[#BE3144]/20' : 'bg-[#141414]'
                  }`}>
                  <Ionicons
                    name="female"
                    size={24}
                    color={selectedGender === 'female' ? '#BE3144' : '#FFFFFF'}
                  />
                </View>
                <Text className="text-white text-lg font-bold">Female</Text>
              </View>

              <View
                className={`w-6 h-6 rounded-full items-center justify-center border-2 ${
                  selectedGender === 'female'
                    ? 'border-[#BE3144] bg-[#BE3144]'
                    : 'border-[#3F3F46]'
                }`}>
                {selectedGender === 'female' && (
                  <View className="w-2.5 h-2.5 rounded-full bg-white" />
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Sticky Bottom Action */}
      <View className="px-6 pb-6 pt-3 bg-black">
        <Button title="Next" size="lg" onPress={handleNext} />
      </View>
    </SafeAreaView>
  );
}
