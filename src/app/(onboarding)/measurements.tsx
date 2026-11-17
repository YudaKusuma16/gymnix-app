import React, { useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { Button } from '@/components/ui/button';
import { OnboardingHeader } from '@/components/ui/onboarding-header';
import { profileService } from '@/features/profile/services/profileService';

export default function MeasurementsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ gender?: string }>();

  const [heightUnit, setHeightUnit] = useState<'CM' | 'FT'>('CM');
  const [heightValue, setHeightValue] = useState('175');
  const [isHeightFocused, setIsHeightFocused] = useState(false);

  const [weightUnit, setWeightUnit] = useState<'KG' | 'LBS'>('KG');
  const [weightValue, setWeightValue] = useState('70');
  const [isWeightFocused, setIsWeightFocused] = useState(false);

  const handleToggleHeightUnit = (newUnit: 'CM' | 'FT') => {
    if (newUnit === heightUnit) return;
    const num = parseFloat(heightValue);
    if (!isNaN(num)) {
      if (newUnit === 'FT') {
        setHeightValue((num / 30.48).toFixed(1));
      } else {
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
        setWeightValue((num * 2.20462).toFixed(1));
      } else {
        setWeightValue((num / 2.20462).toFixed(1));
      }
    }
    setWeightUnit(newUnit);
  };

  const handleNext = () => {
    const rawH = parseFloat(heightValue.replace(',', '.'));
    const rawW = parseFloat(weightValue.replace(',', '.'));

    const heightCm = !isNaN(rawH)
      ? heightUnit === 'FT'
        ? Math.round(rawH * 30.48)
        : Math.round(rawH)
      : undefined;

    const weightKg = !isNaN(rawW)
      ? weightUnit === 'LBS'
        ? Math.round((rawW / 2.20462) * 10) / 10
        : Math.round(rawW * 10) / 10
      : undefined;

    profileService
      .updateProfile({
        gender: params.gender,
        height: heightCm,
        weight: weightKg,
      })
      .catch(() => {});

    router.push({
      pathname: '/(onboarding)/goal',
      params: {
        gender: params.gender || '',
        height: heightCm ? String(heightCm) : '',
        weight: weightKg ? String(weightKg) : '',
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flexOne}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.body}>
            <OnboardingHeader currentStep={2} totalSteps={4} />

            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              style={styles.flexOne}>
              <View style={styles.headerBlock}>
                <Text style={styles.kicker}>BODY METRICS</Text>
                <Text style={styles.title}>Body Measurements</Text>
                <Text style={styles.subtitle}>
                  Enter your height and current weight to compute baseline BMI and daily energy targets.
                </Text>
              </View>

              <View style={styles.cardsCol}>
                {/* 1. Height Card */}
                <View
                  style={[
                    styles.metricCard,
                    isHeightFocused ? styles.metricCardFocused : null,
                  ]}>
                  {isHeightFocused && (
                    <LinearGradient
                      colors={[
                        'rgba(190, 49, 68, 0.14)',
                        'rgba(190, 49, 68, 0.02)',
                        'transparent',
                      ]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={StyleSheet.absoluteFill}
                      pointerEvents="none"
                    />
                  )}

                  <View style={styles.cardTopRow}>
                    <View style={styles.cardLabelRow}>
                      <View style={styles.smallIconBadge}>
                        <Ionicons name="resize-outline" size={14} color="#BE3144" />
                      </View>
                      <Text style={styles.cardLabel}>HEIGHT</Text>
                    </View>

                    <View style={styles.unitSwitch}>
                      {(['CM', 'FT'] as const).map((u) => {
                        const active = heightUnit === u;
                        return (
                          <TouchableOpacity
                            key={u}
                            activeOpacity={0.75}
                            onPress={() => handleToggleHeightUnit(u)}
                            style={[
                              styles.unitBtn,
                              active ? styles.unitBtnActive : null,
                            ]}>
                            <Text
                              style={[
                                styles.unitBtnText,
                                active ? styles.unitBtnTextActive : null,
                              ]}>
                              {u}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>

                  <View style={styles.inputRow}>
                    <TextInput
                      value={heightValue}
                      onChangeText={setHeightValue}
                      placeholder={heightUnit === 'CM' ? '175' : '5.8'}
                      placeholderTextColor="#3F3F46"
                      keyboardType="decimal-pad"
                      onFocus={() => setIsHeightFocused(true)}
                      onBlur={() => setIsHeightFocused(false)}
                      selectionColor="#BE3144"
                      style={styles.numericInput}
                    />
                    <Text style={styles.unitSuffix}>
                      {heightUnit.toLowerCase()}
                    </Text>
                  </View>
                </View>

                {/* 2. Weight Card */}
                <View
                  style={[
                    styles.metricCard,
                    isWeightFocused ? styles.metricCardFocused : null,
                  ]}>
                  {isWeightFocused && (
                    <LinearGradient
                      colors={[
                        'rgba(190, 49, 68, 0.14)',
                        'rgba(190, 49, 68, 0.02)',
                        'transparent',
                      ]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={StyleSheet.absoluteFill}
                      pointerEvents="none"
                    />
                  )}

                  <View style={styles.cardTopRow}>
                    <View style={styles.cardLabelRow}>
                      <View style={styles.smallIconBadge}>
                        <Ionicons name="scale-outline" size={14} color="#BE3144" />
                      </View>
                      <Text style={styles.cardLabel}>CURRENT WEIGHT</Text>
                    </View>

                    <View style={styles.unitSwitch}>
                      {(['KG', 'LBS'] as const).map((u) => {
                        const active = weightUnit === u;
                        return (
                          <TouchableOpacity
                            key={u}
                            activeOpacity={0.75}
                            onPress={() => handleToggleWeightUnit(u)}
                            style={[
                              styles.unitBtn,
                              active ? styles.unitBtnActive : null,
                            ]}>
                            <Text
                              style={[
                                styles.unitBtnText,
                                active ? styles.unitBtnTextActive : null,
                              ]}>
                              {u}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>

                  <View style={styles.inputRow}>
                    <TextInput
                      value={weightValue}
                      onChangeText={setWeightValue}
                      placeholder={weightUnit === 'KG' ? '70' : '154'}
                      placeholderTextColor="#3F3F46"
                      keyboardType="decimal-pad"
                      onFocus={() => setIsWeightFocused(true)}
                      onBlur={() => setIsWeightFocused(false)}
                      selectionColor="#BE3144"
                      style={styles.numericInput}
                    />
                    <Text style={styles.unitSuffix}>
                      {weightUnit.toLowerCase()}
                    </Text>
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      <View style={styles.footer}>
        <Button
          title="Continue"
          size="lg"
          disabled={!heightValue || !weightValue}
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
  cardsCol: {
    gap: 16,
    paddingBottom: 24,
  },
  metricCard: {
    backgroundColor: '#0A0A0D',
    borderWidth: 1,
    borderColor: '#1C1C22',
    borderRadius: 22,
    borderCurve: 'continuous',
    padding: 20,
    overflow: 'hidden',
  },
  metricCardFocused: {
    borderColor: '#BE3144',
    backgroundColor: '#0E0A0C',
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  cardLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  smallIconBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderCurve: 'continuous',
    backgroundColor: 'rgba(190, 49, 68, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(190, 49, 68, 0.28)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardLabel: {
    color: '#A1A1AA',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.9,
  },
  unitSwitch: {
    flexDirection: 'row',
    backgroundColor: '#141418',
    borderRadius: 9,
    padding: 2,
    borderWidth: 1,
    borderColor: '#24242B',
  },
  unitBtn: {
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 7,
  },
  unitBtnActive: {
    backgroundColor: '#BE3144',
  },
  unitBtnText: {
    color: '#71717A',
    fontSize: 11,
    fontWeight: '800',
  },
  unitBtnTextActive: {
    color: '#FFFFFF',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  numericInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 38,
    fontWeight: '900',
    letterSpacing: -1,
    padding: 0,
    margin: 0,
    fontVariant: ['tabular-nums'],
  },
  unitSuffix: {
    color: '#BE3144',
    fontSize: 16,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 12,
    backgroundColor: '#000000',
  },
});
