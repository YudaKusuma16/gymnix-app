import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface WeeklyAdherenceCardProps {
  completed: number; // e.g. 3
  target: number; // e.g. 4
  splits?: { day: string; name: string; completed: boolean }[];
}

const DEFAULT_SPLITS = [
  { day: 'M', name: 'Upper A', completed: true },
  { day: 'T', name: 'Lower A', completed: true },
  { day: 'T', name: 'Push A', completed: true },
  { day: 'S', name: 'Pull A', completed: false },
];

export const WeeklyAdherenceCard = React.memo(function WeeklyAdherenceCard({
  completed = 3,
  target = 4,
  splits = DEFAULT_SPLITS,
}: WeeklyAdherenceCardProps) {
  const percentage = Math.round((completed / target) * 100);
  const remaining = Math.max(0, target - completed);

  return (
    <View style={styles.card}>
      <Text style={styles.label}>WEEKLY SESSIONS</Text>

      {/* Main Ratio Value */}
      <View style={styles.valueRow}>
        <Text style={styles.valueNumber}>{completed}</Text>
        <Text style={styles.valueTarget}>/{target}</Text>
        <Text style={styles.valueUnit}>done</Text>
      </View>

      {/* 4 Minimalist Habit Pillars */}
      <View style={styles.pillarsContainer}>
        {splits.map((s, idx) => (
          <View
            key={idx}
            style={[
              styles.pillarBox,
              s.completed ? styles.pillarBoxDone : styles.pillarBoxPending,
            ]}>
            <Text
              style={[
                styles.pillarDayText,
                s.completed ? styles.pillarDayDone : styles.pillarDayPending,
              ]}>
              {s.day}
            </Text>
            {s.completed ? (
              <Ionicons name="checkmark" size={13} color="#FFFFFF" />
            ) : (
              <View style={styles.pillarDotPending} />
            )}
          </View>
        ))}
      </View>

      {/* Footnote status */}
      <View style={styles.footerRow}>
        <Text style={styles.footnote}>
          {percentage}% •{' '}
          <Text style={styles.footnoteHighlight}>
            {remaining === 0 ? 'Goal met!' : `${remaining} left`}
          </Text>
        </Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#0C0C0E',
    borderRadius: 16,
    borderCurve: 'continuous',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#1D1D22',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    color: '#71717A',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 2,
    textAlign: 'center',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 3,
    marginTop: 2,
    marginBottom: 4,
  },
  valueNumber: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.5,
    fontVariant: ['tabular-nums'],
  },
  valueTarget: {
    color: '#71717A',
    fontSize: 16,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  valueUnit: {
    color: '#A1A1AA',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 2,
  },
  pillarsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginVertical: 4,
    width: '100%',
    paddingHorizontal: 4,
  },
  pillarBox: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  pillarBoxDone: {
    backgroundColor: '#BE3144',
  },
  pillarBoxPending: {
    backgroundColor: '#16161A',
    borderWidth: 1,
    borderColor: '#26262E',
    borderStyle: 'dashed',
  },
  pillarDayText: {
    fontSize: 9,
    fontWeight: '800',
  },
  pillarDayDone: {
    color: 'rgba(255, 255, 255, 0.75)',
  },
  pillarDayPending: {
    color: '#71717A',
  },
  pillarDotPending: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#3F3F46',
  },
  footerRow: {
    alignItems: 'center',
  },
  footnote: {
    color: '#71717A',
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'center',
  },
  footnoteHighlight: {
    color: '#BE3144',
    fontWeight: '700',
  },
});
