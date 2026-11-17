import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from '@/utils/haptics';
import { AthleteProfile } from '../types/profile.types';
import { ExerciseProgressModal } from './ExerciseProgressModal';

interface PersonalRecordsCardProps {
  records: AthleteProfile['personalRecords'];
}

export const PersonalRecordsCard = React.memo(function PersonalRecordsCard({
  records,
}: PersonalRecordsCardProps) {
  const [selectedLift, setSelectedLift] = useState<'squat' | 'bench' | 'deadlift' | null>(null);

  const handleOpenLift = (lift: 'squat' | 'bench' | 'deadlift') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedLift(lift);
  };

  const handleCloseModal = () => {
    setSelectedLift(null);
  };

  return (
    <View style={styles.container}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.cardTitle}>Personal Records</Text>
          <Text style={styles.cardSubtitle}>Standard Barbell Lifts (SBD)</Text>
        </View>
      </View>

      {/* Card Wrapper for PRs */}
      <View style={styles.prCard}>
        {/* 3 Columns: Squat (Left) / Bench (Center) / Deadlift (Right) */}
        <View style={styles.columnsRow}>
          {/* Squat - Left Aligned */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => handleOpenLift('squat')}
            style={styles.liftColLeft}>
            <Text style={styles.liftName}>SQUAT</Text>
            <View style={styles.liftValueRow}>
              <Text style={styles.liftNumber}>
                {records.squatKg > 0 ? records.squatKg : '-'}
              </Text>
              {records.squatKg > 0 && <Text style={styles.liftUnit}>kg</Text>}
            </View>
            <Text style={styles.liftTime}>
              {records.squatDate && records.squatDate !== '-' ? records.squatDate : '-'}
            </Text>
          </TouchableOpacity>

          {/* Bench - Exactly in the center */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => handleOpenLift('bench')}
            style={styles.liftColCenter}>
            <Text style={styles.liftNameActive}>BENCH</Text>
            <View style={styles.liftValueRow}>
              <Text style={styles.liftNumber}>
                {records.benchKg > 0 ? records.benchKg : '-'}
              </Text>
              {records.benchKg > 0 && <Text style={styles.liftUnitActive}>kg</Text>}
            </View>
            <Text style={styles.liftStatusActive}>
              {records.benchDate && records.benchDate !== '-' ? records.benchDate : '-'}
            </Text>
          </TouchableOpacity>

          {/* Deadlift - Right Aligned */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => handleOpenLift('deadlift')}
            style={styles.liftColRight}>
            <Text style={styles.liftName}>DEADLIFT</Text>
            <View style={styles.liftValueRow}>
              <Text style={styles.liftNumber}>
                {records.deadliftKg > 0 ? records.deadliftKg : '-'}
              </Text>
              {records.deadliftKg > 0 && <Text style={styles.liftUnit}>kg</Text>}
            </View>
            <Text style={styles.liftTime}>
              {records.deadliftDate && records.deadliftDate !== '-' ? records.deadliftDate : '-'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Combined SBD Total */}
        <View style={styles.totalVolumeRow}>
          <View style={styles.totalVolumeLeft}>
            <Ionicons name="barbell-outline" size={16} color="#71717A" />
            <Text style={styles.totalVolumeLabel}>COMBINED TOTAL</Text>
          </View>
          <View style={styles.totalVolumeRight}>
            <Text style={styles.totalVolumeNumber}>
              {records.totalVolumeKg > 0 ? records.totalVolumeKg : '-'}
            </Text>
            {records.totalVolumeKg > 0 && <Text style={styles.totalVolumeUnit}>KG</Text>}
          </View>
        </View>
      </View>

      {/* Progression Curve Modal */}
      <ExerciseProgressModal
        visible={selectedLift !== null}
        liftKey={selectedLift}
        onClose={handleCloseModal}
      />
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
    marginBottom: 14,
    paddingHorizontal: 2,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  cardSubtitle: {
    color: '#71717A',
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  prCard: {
    backgroundColor: '#000000',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#222226',
    borderCurve: 'continuous',
    padding: 16,
  },
  columnsRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  liftColLeft: {
    flex: 1,
    alignItems: 'flex-start',
  },
  liftColCenter: {
    flex: 1,
    alignItems: 'center',
  },
  liftColRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  liftName: {
    color: '#71717A',
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 0.7,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  liftNameActive: {
    color: '#BE3144',
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.7,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  liftValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 3,
  },
  liftNumber: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5,
    fontVariant: ['tabular-nums'],
  },
  liftUnit: {
    color: '#71717A',
    fontSize: 11.5,
    fontWeight: '700',
  },
  liftUnitActive: {
    color: '#BE3144',
    fontSize: 11.5,
    fontWeight: '800',
  },
  liftTime: {
    color: '#71717A',
    fontSize: 11,
    fontWeight: '500',
    marginTop: 4,
  },
  liftStatusActive: {
    color: '#34D399',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center',
  },
  totalVolumeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#202026',
  },
  totalVolumeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  totalVolumeLabel: {
    color: '#71717A',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  totalVolumeRight: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 3,
  },
  totalVolumeNumber: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
  },
  totalVolumeUnit: {
    color: '#BE3144',
    fontSize: 11,
    fontWeight: '800',
  },
});
