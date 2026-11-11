import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface LifetimeStatsCardProps {
  totalTonnageTon?: number; // e.g. 248.5
  totalWorkouts?: number; // e.g. 118
  totalHours?: number; // e.g. 142
}

export const LifetimeStatsCard = React.memo(function LifetimeStatsCard({
  totalTonnageTon = 248.5,
  totalWorkouts = 118,
  totalHours = 142,
}: LifetimeStatsCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Lifetime Milestones</Text>
          <Text style={styles.subtitle}>Accumulated athlete work capacity</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>SINCE 2024</Text>
        </View>
      </View>

      <View style={styles.statsCard}>
        {/* Col 1: Lifetime Tonnage */}
        <View style={styles.statCol}>
          <View style={styles.iconSlot}>
            <Ionicons name="barbell-outline" size={14} color="#BE3144" />
          </View>
          <Text style={styles.statLabel}>LIFETIME LOAD</Text>
          <View style={styles.valRow}>
            <Text style={styles.primaryVal}>{totalTonnageTon}</Text>
            <Text style={styles.unitVal}>T</Text>
          </View>
          <Text style={styles.footText}>Total Volume</Text>
        </View>

        <View style={styles.divider} />

        {/* Col 2: Sessions */}
        <View style={styles.statCol}>
          <View style={styles.iconSlot}>
            <Ionicons name="fitness-outline" size={14} color="#BE3144" />
          </View>
          <Text style={styles.statLabel}>SESSIONS</Text>
          <View style={styles.valRow}>
            <Text style={styles.primaryVal}>{totalWorkouts}</Text>
            <Text style={styles.unitVal}>logs</Text>
          </View>
          <Text style={styles.footText}>Completed</Text>
        </View>

        <View style={styles.divider} />

        {/* Col 3: Hours Under Iron */}
        <View style={styles.statCol}>
          <View style={styles.iconSlot}>
            <Ionicons name="time-outline" size={14} color="#BE3144" />
          </View>
          <Text style={styles.statLabel}>TIME IN GYM</Text>
          <View style={styles.valRow}>
            <Text style={styles.primaryVal}>{totalHours}</Text>
            <Text style={styles.unitVal}>hrs</Text>
          </View>
          <Text style={styles.footText}>Under Iron</Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 2,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  subtitle: {
    color: '#71717A',
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  badge: {
    backgroundColor: '#161418',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#261820',
  },
  badgeText: {
    color: '#A1A1AA',
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#0C0C0E',
    borderRadius: 16,
    borderCurve: 'continuous',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#1D1D22',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: 48,
    backgroundColor: '#1F1F24',
  },
  iconSlot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#181416',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#2A181C',
  },
  statLabel: {
    color: '#71717A',
    fontSize: 8.5,
    fontWeight: '800',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  valRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  primaryVal: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: -0.3,
    fontVariant: ['tabular-nums'],
  },
  unitVal: {
    color: '#BE3144',
    fontSize: 11,
    fontWeight: '700',
  },
  footText: {
    color: '#52525B',
    fontSize: 9.5,
    fontWeight: '500',
    marginTop: 2,
  },
});
