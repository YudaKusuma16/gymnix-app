import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { Button } from '@/components/ui/button';
import { OnboardingHeader } from '@/components/ui/onboarding-header';
import { profileService } from '@/features/profile/services/profileService';

type Gender = 'male' | 'female';

const GENDER_OPTIONS: {
  id: Gender;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  {
    id: 'male',
    title: 'Male',
    subtitle: 'Calibrated for male BMR & strength ratios',
    icon: 'male',
  },
  {
    id: 'female',
    title: 'Female',
    subtitle: 'Calibrated for female BMR & volume recovery',
    icon: 'female',
  },
];

export default function GenderSelectionScreen() {
  const router = useRouter();
  const [selectedGender, setSelectedGender] = useState<Gender>('male');

  const handleNext = () => {
    const genderLabel = selectedGender === 'male' ? 'Male' : 'Female';
    profileService.updateProfile({ gender: genderLabel }).catch(() => {});
    router.push({
      pathname: '/(onboarding)/measurements',
      params: { gender: genderLabel },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.body}>
        <OnboardingHeader currentStep={1} totalSteps={4} />

        <View style={styles.headerBlock}>
          <Text style={styles.kicker}>BIOMETRIC CALIBRATION</Text>
          <Text style={styles.title}>Select Your Gender</Text>
          <Text style={styles.subtitle}>
            Used to calculate accurate metabolic expenditure and relative strength benchmarks.
          </Text>
        </View>

        <View style={styles.optionsList}>
          {GENDER_OPTIONS.map((opt) => {
            const isSelected = selectedGender === opt.id;
            return (
              <TouchableOpacity
                key={opt.id}
                activeOpacity={0.85}
                onPress={() => setSelectedGender(opt.id)}
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
                    name={opt.icon}
                    size={22}
                    color={isSelected ? '#FFFFFF' : '#A1A1AA'}
                  />
                </View>

                <View style={styles.optionTextCol}>
                  <Text style={styles.optionTitle}>{opt.title}</Text>
                  <Text style={styles.optionSubtitle}>{opt.subtitle}</Text>
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
  body: {
    flex: 1,
    paddingHorizontal: 24,
  },
  headerBlock: {
    paddingTop: 12,
    marginBottom: 28,
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
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0A0A0D',
    borderWidth: 1,
    borderColor: '#1C1C22',
    borderRadius: 20,
    borderCurve: 'continuous',
    padding: 18,
    gap: 15,
    overflow: 'hidden',
  },
  optionCardSelected: {
    borderColor: '#BE3144',
    backgroundColor: '#0F0A0C',
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
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
    fontSize: 17,
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
