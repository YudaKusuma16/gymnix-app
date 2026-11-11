import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AthleteProfile } from '../types/profile.types';

interface TrainingProfileCardProps {
  program: AthleteProfile['trainingProgram'];
  homeGym: AthleteProfile['homeGym'];
  onGymPress: () => void;
}

export const TrainingProfileCard = React.memo(function TrainingProfileCard({
  program,
  homeGym,
  onGymPress,
}: TrainingProfileCardProps) {
  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.headerRow}>
        <Text style={styles.cardTitle}>Training Program</Text>
        <Text style={styles.cardSubtitle}>Active split & parameters</Text>
      </View>

      {/* List items directly on background (No wrapper box) */}
      <View style={styles.listContainer}>
        {/* Item 1: Primary Objective */}
        <View style={styles.itemRow}>
          <Text style={styles.itemLabel}>Primary Objective</Text>
          <Text style={styles.itemValue}>{program.primaryObjective}</Text>
        </View>

        {/* Item 2: Split Type */}
        <View style={styles.itemRow}>
          <Text style={styles.itemLabel}>Program Split</Text>
          <Text style={styles.itemValue}>{program.splitType}</Text>
        </View>

        {/* Item 3: Frequency Protocol */}
        <View style={styles.itemRow}>
          <Text style={styles.itemLabel}>Frequency</Text>
          <Text style={styles.itemValue}>{program.frequency}</Text>
        </View>

        {/* Item 4: Experience Level */}
        <View style={styles.itemRow}>
          <Text style={styles.itemLabel}>Experience</Text>
          <Text style={styles.itemValue}>{program.experienceLevel}</Text>
        </View>

        {/* Item 5: Home Facility (Clickable) */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onGymPress}
          style={[styles.itemRow, styles.lastItemRow]}>
          <Text style={styles.itemLabel}>Home Facility</Text>
          <View style={styles.gymLink}>
            <Text style={styles.gymLinkText} numberOfLines={1}>
              {homeGym.name}
            </Text>
            <Ionicons name="chevron-forward" size={14} color="#71717A" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  headerRow: {
    marginBottom: 10,
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
  listContainer: {
    // Unboxed: no background, no border
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 13,
    paddingHorizontal: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#18181A',
  },
  lastItemRow: {
    borderBottomWidth: 0,
  },
  itemLabel: {
    color: '#71717A',
    fontSize: 12.5,
    fontWeight: '500',
  },
  itemValue: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '700',
    textAlign: 'right',
  },
  gymLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    maxWidth: '55%',
  },
  gymLinkText: {
    color: '#D4D4D8',
    fontSize: 12.5,
    fontWeight: '700',
  },
});
