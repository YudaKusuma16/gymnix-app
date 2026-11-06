import React, { useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { Button } from '@/components/ui/button';
import { OnboardingHeader } from '@/components/ui/onboarding-header';

export default function MeasurementsScreen() {
  const router = useRouter();

  // Height state
  const [heightUnit, setHeightUnit] = useState<'CM' | 'FT'>('CM');
  const [heightValue, setHeightValue] = useState('178');
  const [isHeightFocused, setIsHeightFocused] = useState(false);

  // Weight state
  const [weightUnit, setWeightUnit] = useState<'KG' | 'LBS'>('KG');
  const [weightValue, setWeightValue] = useState('74.5');
  const [isWeightFocused, setIsWeightFocused] = useState(false);

  const handleToggleHeightUnit = (newUnit: 'CM' | 'FT') => {
    if (newUnit === heightUnit) return;
    const num = parseFloat(heightValue);
    if (!isNaN(num)) {
      if (newUnit === 'FT') {
        // cm to ft
        setHeightValue((num / 30.48).toFixed(1));
      } else {
        // ft to cm
        setHeightValue(Math.round(num * 30.48).toString());
      }
    }
    setHeightUnit(newUnit);
  };

  const handleToggleWeightUnit = (newUnit: 'KG' | 'LBS') => {
    if (newUnit === weightUnit) return;
    const num = parseFloat(weightValue);
    if (!isNaN(num)) {
      if (newUnit === 'LBS') {
        // kg to lbs
        setWeightValue((num * 2.20462).toFixed(1));
      } else {
        // lbs to kg
        setWeightValue((num / 2.20462).toFixed(1));
      }
    }
    setWeightUnit(newUnit);
  };

  const handleNext = () => {
    router.push('/(onboarding)/goal');
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: '#000000', justifyContent: 'space-between' }}
      className="flex-1 bg-black justify-between">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1, paddingHorizontal: 24 }} className="px-6 flex-1">
            {/* Top Header */}
            <OnboardingHeader currentStep={2} totalSteps={4} />

            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              className="flex-1">
              {/* Screen Title & Context */}
              <View className="pt-6 pb-2">
                <Text className="text-white text-2xl font-bold tracking-tight">
                  Your Body Measurements
                </Text>
                <Text className="text-[#71717A] text-sm mt-2 leading-relaxed">
                  Enter your height and weight to calculate your baseline calories and progression targets.
                </Text>
              </View>

              {/* Input Cards Container */}
              <View className="mt-8 gap-5">
                {/* 1. Height Card */}
                <View
                  className={`bg-[#0A0A0A] rounded-2xl p-5 border transition-all ${
                    isHeightFocused
                      ? 'border-[#BE3144] bg-[#BE3144]/5'
                      : 'border-[#1F1F1F]'
                  }`}>
                  {/* Card Header: Label & Unit Switcher */}
                  <View className="flex-row items-center justify-between mb-3">
                    <Text className="text-[#71717A] text-xs font-bold uppercase tracking-wider">
                      HEIGHT
                    </Text>

                    {/* Unit Pill */}
                    <View className="flex-row bg-[#141414] rounded-lg p-0.5 border border-[#27272A]">
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => handleToggleHeightUnit('CM')}
                        className={`px-3 py-1 rounded-md ${
                          heightUnit === 'CM' ? 'bg-[#BE3144]' : 'bg-transparent'
                        }`}>
                        <Text
                          className={`text-xs font-bold ${
                            heightUnit === 'CM' ? 'text-white' : 'text-[#71717A]'
                          }`}>
                          CM
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => handleToggleHeightUnit('FT')}
                        className={`px-3 py-1 rounded-md ${
                          heightUnit === 'FT' ? 'bg-[#BE3144]' : 'bg-transparent'
                        }`}>
                        <Text
                          className={`text-xs font-bold ${
                            heightUnit === 'FT' ? 'text-white' : 'text-[#71717A]'
                          }`}>
                          FT
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Clean Numeric Input Field */}
                  <View className="flex-row items-baseline gap-2 pt-2 pb-1">
                    <TextInput
                      value={heightValue}
                      onChangeText={setHeightValue}
                      placeholder={heightUnit === 'CM' ? '178' : '5.8'}
                      placeholderTextColor="#3F3F46"
                      keyboardType="decimal-pad"
                      onFocus={() => setIsHeightFocused(true)}
                      onBlur={() => setIsHeightFocused(false)}
                      selectionColor="#BE3144"
                      className="text-white text-4xl font-extrabold flex-1 p-0 m-0"
                    />
                    <Text className="text-[#BE3144] text-lg font-bold uppercase">
                      {heightUnit.toLowerCase()}
                    </Text>
                  </View>
                </View>

                {/* 2. Weight Card */}
                <View
                  className={`bg-[#0A0A0A] rounded-2xl p-5 border transition-all ${
                    isWeightFocused
                      ? 'border-[#BE3144] bg-[#BE3144]/5'
                      : 'border-[#1F1F1F]'
                  }`}>
                  {/* Card Header: Label & Unit Switcher */}
                  <View className="flex-row items-center justify-between mb-3">
                    <Text className="text-[#71717A] text-xs font-bold uppercase tracking-wider">
                      CURRENT WEIGHT
                    </Text>

                    {/* Unit Pill */}
                    <View className="flex-row bg-[#141414] rounded-lg p-0.5 border border-[#27272A]">
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => handleToggleWeightUnit('KG')}
                        className={`px-3 py-1 rounded-md ${
                          weightUnit === 'KG' ? 'bg-[#BE3144]' : 'bg-transparent'
                        }`}>
                        <Text
                          className={`text-xs font-bold ${
                            weightUnit === 'KG' ? 'text-white' : 'text-[#71717A]'
                          }`}>
                          KG
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => handleToggleWeightUnit('LBS')}
                        className={`px-3 py-1 rounded-md ${
                          weightUnit === 'LBS' ? 'bg-[#BE3144]' : 'bg-transparent'
                        }`}>
                        <Text
                          className={`text-xs font-bold ${
                            weightUnit === 'LBS' ? 'text-white' : 'text-[#71717A]'
                          }`}>
                          LBS
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Clean Numeric Input Field */}
                  <View className="flex-row items-baseline gap-2 pt-2 pb-1">
                    <TextInput
                      value={weightValue}
                      onChangeText={setWeightValue}
                      placeholder={weightUnit === 'KG' ? '74.5' : '164.2'}
                      placeholderTextColor="#3F3F46"
                      keyboardType="decimal-pad"
                      onFocus={() => setIsWeightFocused(true)}
                      onBlur={() => setIsWeightFocused(false)}
                      selectionColor="#BE3144"
                      className="text-white text-4xl font-extrabold flex-1 p-0 m-0"
                    />
                    <Text className="text-[#BE3144] text-lg font-bold uppercase">
                      {weightUnit.toLowerCase()}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Minimal tip */}
              <Text className="text-[#52525B] text-xs text-center mt-6">
                Tap on any number to edit with keyboard
              </Text>
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      {/* Sticky Bottom Action */}
      <View className="px-6 pb-6 pt-3 bg-black">
        <Button
          title="Next"
          size="lg"
          disabled={!heightValue || !weightValue}
          onPress={handleNext}
        />
      </View>
    </SafeAreaView>
  );
}
