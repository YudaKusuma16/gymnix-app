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

interface ExperienceOption {
  id: string;
  title: string;
  frequency: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const EXPERIENCES: ExperienceOption[] = [
  {
    id: 'beginner',
    title: 'Beginner',
    frequency: '2 - 3 Days / Week',
    description: 'Full body compound foundation & technique mastery',
    icon: 'leaf-outline',
  },
  {
    id: 'intermediate',
    title: 'Intermediate',
    frequency: '3 - 4 Days / Week',
    description: 'Upper / Lower or Push-Pull-Legs structured progression',
    icon: 'trending-up-outline',
  },
  {
    id: 'advanced',
    title: 'Advanced / Athlete',
    frequency: '5 - 6 Days / Week',
    description: 'High-volume hypertrophy & specialized periodization',
    icon: 'trophy-outline',
  },
];

export default function TrainingExperienceScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    gender?: string;
    height?: string;
    weight?: string;
    goal?: string;
  }>();
  const [selectedExp, setSelectedExp] = useState('intermediate');
  const [loading, setLoading] = useState(false);

  const handleCompleteSetup = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const expObj =
        EXPERIENCES.find((e) => e.id === selectedExp) || EXPERIENCES[1];
      const heightNum = params.height ? parseFloat(params.height) : undefined;
      const weightNum = params.weight ? parseFloat(params.weight) : undefined;

      await profileService.updateProfile({
        gender: params.gender || undefined,
        height: !isNaN(heightNum as number) ? heightNum : undefined,
        weight: !isNaN(weightNum as number) ? weightNum : undefined,
        goal: params.goal || undefined,
        experience: expObj.title,
        frequency: expObj.frequency,
      });
    } catch {
      // proceed even if offline
    } finally {
      setLoading(false);
      router.replace('/(tabs)/home');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.body}>
        <OnboardingHeader currentStep={4} totalSteps={4} />

        <ScrollView showsVerticalScrollIndicator={false} style={styles.flexOne}>
          <View style={styles.headerBlock}>
            <Text style={styles.kicker}>TRAINING CADENCE</Text>
            <Text style={styles.title}>Experience & Frequency</Text>
            <Text style={styles.subtitle}>
              Tailors your weekly set volume, recovery windows, and recommended split.
            </Text>
          </View>

          <View style={styles.optionsList}>
            {EXPERIENCES.map((item) => {
              const isSelected = selectedExp === item.id;
              return (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.85}
                  onPress={() => setSelectedExp(item.id)}
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
                      name={item.icon}
                      size={21}
                      color={isSelected ? '#FFFFFF' : '#A1A1AA'}
                    />
                  </View>

                  <View style={styles.optionTextCol}>
                    <View style={styles.titleBadgeRow}>
                      <Text style={styles.optionTitle}>{item.title}</Text>
                      <View
                        style={[
                          styles.freqPill,
                          isSelected ? styles.freqPillSelected : null,
                        ]}>
                        <Text
                          style={[
                            styles.freqPillText,
                            isSelected ? styles.freqPillTextSelected : null,
                          ]}>
                          {item.frequency}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.optionSubtitle}>{item.description}</Text>
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
          title="Complete Setup"
          size="lg"
          loading={loading}
          onPress={handleCompleteSetup}
          rightIcon={<Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />}
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
    gap: 14,
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
  titleBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  freqPill: {
    backgroundColor: '#141418',
    borderWidth: 1,
    borderColor: '#24242C',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  freqPillSelected: {
    backgroundColor: 'rgba(190, 49, 68, 0.16)',
    borderColor: 'rgba(190, 49, 68, 0.38)',
  },
  freqPillText: {
    color: '#A1A1AA',
    fontSize: 10,
    fontWeight: '700',
  },
  freqPillTextSelected: {
    color: '#F4F4F5',
  },
  optionSubtitle: {
    color: '#71717A',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
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
