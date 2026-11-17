import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { Button } from '@/components/ui/button';
import { OnboardingHeader } from '@/components/ui/onboarding-header';
import { profileService } from '@/features/profile/services/profileService';

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
    icon: 'pulse-outline',
    description: 'Build longevity, mobility, and consistent habits',
  },
];

export default function FitnessGoalScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    gender?: string;
    height?: string;
    weight?: string;
  }>();
  const [selectedGoal, setSelectedGoal] = useState('hypertrophy');

  const handleNext = () => {
    const goalObj = GOALS.find((g) => g.id === selectedGoal) || GOALS[0];
    profileService
      .updateProfile({
        goal: goalObj.title,
      })
      .catch(() => {});

    router.push({
      pathname: '/(onboarding)/experience',
      params: {
        gender: params.gender || '',
        height: params.height || '',
        weight: params.weight || '',
        goal: goalObj.title,
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.body}>
        <OnboardingHeader currentStep={3} totalSteps={4} />

        <ScrollView showsVerticalScrollIndicator={false} style={styles.flexOne}>
          <View style={styles.headerBlock}>
            <Text style={styles.kicker}>TRAINING OBJECTIVE</Text>
            <Text style={styles.title}>Primary Fitness Goal</Text>
            <Text style={styles.subtitle}>
              Determines your target rep ranges, weekly volume targets, and nutritional split.
            </Text>
          </View>

          <View style={styles.optionsList}>
            {GOALS.map((goal) => {
              const isSelected = selectedGoal === goal.id;
              return (
                <TouchableOpacity
                  key={goal.id}
                  activeOpacity={0.85}
                  onPress={() => setSelectedGoal(goal.id)}
                  style={[
                    styles.optionCard,
                    isSelected ? styles.optionCardSelected : null,
                  ]}>
                  {isSelected && (
                    <LinearGradient
                      colors={[
                        'rgba(190, 49, 68, 0.18)',
                        'rgba(190, 49, 68, 0.03)',
                        'transparent',
                      ]}
                      locations={[0, 0.5, 1]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={StyleSheet.absoluteFill}
                      pointerEvents="none"
                    />
                  )}

                  <View
                    style={[
                      styles.iconBox,
                      isSelected ? styles.iconBoxSelected : null,
                    ]}>
                    <Ionicons
                      name={goal.icon}
                      size={21}
                      color={isSelected ? '#FFFFFF' : '#A1A1AA'}
                    />
                  </View>

                  <View style={styles.optionTextCol}>
                    <Text style={styles.optionTitle}>{goal.title}</Text>
                    <Text style={styles.optionSubtitle}>{goal.description}</Text>
                  </View>

                  <View
                    style={[
                      styles.radioOuter,
                      isSelected ? styles.radioOuterSelected : null,
                    ]}>
                    {isSelected && <View style={styles.radioInner} />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </View>

      <View style={styles.footer}>
        <Button
          title="Continue"
          size="lg"
          onPress={handleNext}
          rightIcon={<Ionicons name="arrow-forward" size={17} color="#FFFFFF" />}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'space-between',
  },
  flexOne: {
    flex: 1,
  },
  body: {
    flex: 1,
    paddingHorizontal: 24,
  },
  headerBlock: {
    paddingTop: 12,
    marginBottom: 24,
  },
  kicker: {
    color: '#BE3144',
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 1.1,
    marginBottom: 6,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.6,
  },
  subtitle: {
    color: '#71717A',
    fontSize: 13.5,
    lineHeight: 20,
    fontWeight: '500',
    marginTop: 8,
  },
  optionsList: {
    gap: 12,
    paddingBottom: 24,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0A0A0D',
    borderWidth: 1,
    borderColor: '#1C1C22',
    borderRadius: 20,
    borderCurve: 'continuous',
    padding: 16,
    gap: 14,
    overflow: 'hidden',
  },
  optionCardSelected: {
    borderColor: '#BE3144',
    backgroundColor: '#0F0A0C',
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 13,
    borderCurve: 'continuous',
    backgroundColor: '#141418',
    borderWidth: 1,
    borderColor: '#25252C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBoxSelected: {
    backgroundColor: '#BE3144',
    borderColor: '#E63950',
  },
  optionTextCol: {
    flex: 1,
  },
  optionTitle: {
    color: '#FFFFFF',
    fontSize: 15.5,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  optionSubtitle: {
    color: '#71717A',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 3,
    lineHeight: 17,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#3F3F46',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: '#BE3144',
    backgroundColor: '#BE3144',
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 12,
    backgroundColor: '#000000',
  },
});
