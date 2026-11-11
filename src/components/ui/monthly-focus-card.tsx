import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface MonthlyFocusCardProps {
  goalTitle?: string;
  targetMetric?: string;
  currentMetric?: string;
  progressPercent?: number; // 0 - 100
  deltaText?: string;
  daysRemaining?: number;
}

export const MonthlyFocusCard = React.memo(function MonthlyFocusCard({
  goalTitle = 'Barbell Bench Press',
  targetMetric = '85.0 kg',
  currentMetric = '80.0 kg',
  progressPercent = 94,
  deltaText = '2.5 kg to target',
  daysRemaining = 6,
}: MonthlyFocusCardProps) {
  return (
    <View style={styles.card}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <View style={styles.titleGroup}>
          <Ionicons name="flag-outline" size={13} color="#BE3144" />
          <Text style={styles.sectionLabel}>CYCLE FOCUS</Text>
        </View>
        <Text style={styles.deadlineBadge}>{daysRemaining}d left</Text>
      </View>

      {/* Main Goal Info */}
      <View style={styles.bodyRow}>
        <View>
          <Text style={styles.goalName}>{goalTitle}</Text>
          <Text style={styles.subtext}>
            Current: <Text style={styles.subtextWhite}>{currentMetric}</Text> • Target:{' '}
            <Text style={styles.subtextRed}>{targetMetric}</Text>
          </Text>
        </View>

        <View style={styles.percentGroup}>
          <Text style={styles.percentText}>{progressPercent}%</Text>
        </View>
      </View>

      {/* Progress Track */}
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${progressPercent}%` }]} />
      </View>

      {/* Status Footer */}
      <View style={styles.footerRow}>
        <Text style={styles.footnote}>{deltaText}</Text>
        <Text style={styles.microTag}>Progressive Overload Target</Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#0C0C0E',
    borderRadius: 16,
    borderCurve: 'continuous',
    padding: 14,
    borderWidth: 1,
    borderColor: '#1D1D22',
    marginBottom: 14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionLabel: {
    color: '#71717A',
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  deadlineBadge: {
    color: '#A1A1AA',
    fontSize: 10,
    fontWeight: '700',
    backgroundColor: '#18181C',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#24242A',
  },
  bodyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  goalName: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.2,
    marginBottom: 3,
  },
  subtext: {
    color: '#71717A',
    fontSize: 11,
    fontWeight: '500',
  },
  subtextWhite: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  subtextRed: {
    color: '#BE3144',
    fontWeight: '700',
  },
  percentGroup: {
    alignItems: 'flex-end',
  },
  percentText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.4,
    fontVariant: ['tabular-nums'],
  },
  track: {
    height: 6,
    backgroundColor: '#17181C',
    borderRadius: 999,
    overflow: 'hidden',
    marginBottom: 8,
  },
  fill: {
    height: '100%',
    backgroundColor: '#BE3144',
    borderRadius: 999,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footnote: {
    color: '#A1A1AA',
    fontSize: 10,
    fontWeight: '600',
  },
  microTag: {
    color: '#52525B',
    fontSize: 9,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
});
