import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface MuscleGroupVolume {
  name: string;
  completedSets: number;
  targetSets: number;
}

const DEFAULT_MUSCLE_DATA: MuscleGroupVolume[] = [
  { name: 'Chest', completedSets: 14, targetSets: 16 },
  { name: 'Back', completedSets: 16, targetSets: 16 },
  { name: 'Legs', completedSets: 12, targetSets: 16 },
  { name: 'Shoulders', completedSets: 10, targetSets: 14 },
  { name: 'Arms', completedSets: 8, targetSets: 12 },
];

export const MuscleVolumeCard = React.memo(function MuscleVolumeCard() {
  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Muscle Group Volume</Text>
          <Text style={styles.subtitle}>Target: 10–20 hard sets / muscle / wk</Text>
        </View>
        <View style={styles.statusBadge}>
          <Text style={styles.statusBadgeText}>WEEK 4</Text>
        </View>
      </View>

      {/* Muscle List */}
      <View style={styles.listContainer}>
        {DEFAULT_MUSCLE_DATA.map((item, idx) => {
          const ratio = Math.min(1, item.completedSets / item.targetSets);
          const isComplete = item.completedSets >= item.targetSets;

          return (
            <View key={idx} style={styles.itemRow}>
              {/* Muscle Name & Set Count */}
              <View style={styles.itemMetaRow}>
                <Text style={styles.muscleName}>{item.name}</Text>
                <View style={styles.setCountGroup}>
                  <Text style={[styles.setsDone, isComplete && styles.setsDoneComplete]}>
                    {item.completedSets}
                  </Text>
                  <Text style={styles.setsTarget}> / {item.targetSets} sets</Text>
                </View>
              </View>

              {/* Progress Bar Track */}
              <View style={styles.track}>
                <View
                  style={[
                    styles.fill,
                    {
                      width: `${ratio * 100}%`,
                      backgroundColor: isComplete ? '#BE3144' : '#8F1D2C',
                    },
                    isComplete && styles.completeGlow,
                  ]}
                />
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#0C0C0E',
    borderRadius: 16,
    borderCurve: 'continuous',
    padding: 16,
    borderWidth: 1,
    borderColor: '#1D1D22',
    marginBottom: 14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  subtitle: {
    color: '#71717A',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  statusBadge: {
    backgroundColor: '#18181C',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#26262E',
  },
  statusBadgeText: {
    color: '#A1A1AA',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  listContainer: {
    gap: 12,
  },
  itemRow: {
    gap: 6,
  },
  itemMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  muscleName: {
    color: '#E4E4E7',
    fontSize: 13,
    fontWeight: '700',
  },
  setCountGroup: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  setsDone: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  setsDoneComplete: {
    color: '#BE3144',
  },
  setsTarget: {
    color: '#71717A',
    fontSize: 12,
    fontWeight: '500',
  },
  track: {
    height: 7,
    backgroundColor: '#17181C',
    borderRadius: 999,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
  },
  completeGlow: {
    shadowColor: '#BE3144',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
  },
});
