import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
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
    <View style={styles.container}>
      <View style={styles.topRow}>
        {showBack ? (
          <TouchableOpacity
            onPress={handleBack}
            activeOpacity={0.75}
            style={styles.backButton}>
            <Ionicons name="chevron-back" size={19} color="#FFFFFF" />
          </TouchableOpacity>
        ) : (
          <View style={styles.backPlaceholder} />
        )}

        <View style={styles.stepPill}>
          <Text style={styles.stepLabel}>STEP</Text>
          <Text style={styles.stepValue}>
            0{currentStep} / 0{totalSteps}
          </Text>
        </View>
      </View>

      <View style={styles.progressTrackRow}>
        {Array.from({ length: totalSteps }).map((_, index) => {
          const isActive = index < currentStep;
          return (
            <View key={index} style={styles.segmentTrack}>
              {isActive ? (
                <LinearGradient
                  colors={['#E63950', '#BE3144']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={StyleSheet.absoluteFill}
                />
              ) : null}
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingTop: 8,
    paddingBottom: 16,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderCurve: 'continuous',
    backgroundColor: '#121216',
    borderWidth: 1,
    borderColor: '#24242B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backPlaceholder: {
    width: 38,
    height: 38,
  },
  stepPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#101014',
    borderWidth: 1,
    borderColor: '#222228',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderCurve: 'continuous',
  },
  stepLabel: {
    color: '#71717A',
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  stepValue: {
    color: '#E4E4E7',
    fontSize: 11,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  progressTrackRow: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
  },
  segmentTrack: {
    flex: 1,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#18181D',
    overflow: 'hidden',
  },
});
