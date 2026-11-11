import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AthleteProfile } from '../types/profile.types';

interface VitalsGridProps {
  vitals: AthleteProfile['vitals'];
}

export const VitalsGrid = React.memo(function VitalsGrid({ vitals }: VitalsGridProps) {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Body Vitals</Text>
      </View>

      <View style={styles.vitalsList}>
        {/* Row 1: Height & Weight */}
        <View style={styles.gridRow}>
          {/* Height */}
          <View style={styles.gridCell}>
            <Text style={styles.metricLabel}>HEIGHT</Text>
            <View style={styles.valueRow}>
              <Text style={styles.primaryValue}>{vitals.heightCm}</Text>
              <Text style={styles.unitText}>cm</Text>
            </View>
            <Text style={styles.footnoteText}>
              BMI: {vitals.bmi} ({vitals.bmiStatus})
            </Text>
          </View>

          {/* Weight */}
          <View style={styles.gridCell}>
            <Text style={styles.metricLabel}>WEIGHT</Text>
            <View style={styles.valueRow}>
              <Text style={styles.primaryValue}>{vitals.weightKg}</Text>
              <Text style={styles.unitText}>kg</Text>
            </View>
            <Text style={styles.deltaSuccessText}>
              {vitals.weightDeltaWk} kg this wk
            </Text>
          </View>
        </View>

        {/* Row 2: Calorie Cap & Discipline */}
        <View style={styles.gridRow}>
          {/* Calorie Cap */}
          <View style={styles.gridCell}>
            <Text style={styles.metricLabel}>CALORIE CAP</Text>
            <View style={styles.valueRow}>
              <Text style={styles.primaryValue}>
                {vitals.calorieCap.toLocaleString()}
              </Text>
              <Text style={styles.unitText}>kcal</Text>
            </View>
            <Text style={styles.footnoteText}>{vitals.calorieMode}</Text>
          </View>

          {/* Discipline */}
          <View style={styles.gridCell}>
            <Text style={styles.metricLabel}>DISCIPLINE</Text>
            <View style={styles.valueRow}>
              <Text style={styles.primaryValue}>{vitals.currentStreakDays}</Text>
              <Text style={styles.unitText}>Days</Text>
            </View>
            <Text style={styles.footnoteText}>
              Personal Best: {vitals.bestStreakDays} Days
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  headerRow: {
    marginBottom: 14,
    paddingHorizontal: 2,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  vitalsList: {
    gap: 16,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 16,
  },
  gridCell: {
    flex: 1,
  },
  metricLabel: {
    color: '#71717A',
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 0.7,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  primaryValue: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5,
    fontVariant: ['tabular-nums'],
  },
  unitText: {
    color: '#BE3144',
    fontSize: 11.5,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  footnoteText: {
    color: '#71717A',
    fontSize: 11,
    fontWeight: '500',
    marginTop: 4,
  },
  deltaSuccessText: {
    color: '#34D399',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
  },
});
