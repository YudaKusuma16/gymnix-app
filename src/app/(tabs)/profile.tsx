import React, { useCallback } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { ProfileHeroCard } from '@/features/profile/components/ProfileHeroCard';
import { VitalsGrid } from '@/features/profile/components/VitalsGrid';
import { PersonalRecordsCard } from '@/features/profile/components/PersonalRecordsCard';
import { LifetimeStatsCard } from '@/features/profile/components/LifetimeStatsCard';
import { WorkoutHeatmapCard } from '@/features/profile/components/WorkoutHeatmapCard';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const {
    profile,
    isAuthenticated,
    lifetimeMilestones,
    heatmapData,
    reloadProfile,
    navigateToSettings,
    navigateToEditProfile,
    navigateToHomeGym,
    navigateToSignIn,
    shareAthletePassport,
  } = useProfile();

  useFocusEffect(
    useCallback(() => {
      reloadProfile();
    }, [reloadProfile])
  );

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      {/* 1. Cohesive Header (Matches Home & Workout Design System) */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>

        <TouchableOpacity
          onPress={navigateToSettings}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={styles.actionButton}
          accessibilityRole="button"
          accessibilityLabel="Open Settings">
          <Ionicons name="settings-outline" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* 2. Scrollable Body */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 88 },
        ]}>
        {/* Athlete Identity Hero Card */}
        <ProfileHeroCard
          profile={profile}
          isAuthenticated={isAuthenticated}
          onEditPress={navigateToEditProfile}
          onGymPress={navigateToHomeGym}
          onSharePress={shareAthletePassport}
          onSignInPress={navigateToSignIn}
        />

        {/* Lifetime Athletic Career (Tonnage, Sessions, Time Under Iron) */}
        <LifetimeStatsCard
          totalTonnageTon={lifetimeMilestones.totalTonnageTon}
          totalWorkouts={lifetimeMilestones.totalWorkouts}
          totalHours={lifetimeMilestones.totalHours}
        />

        {/* Consistency Heatmap / Grid Latihan (12 Weeks Matrix) */}
        <WorkoutHeatmapCard
          gridWeeksProp={heatmapData.gridWeeks}
          currentStreakWeeks={heatmapData.currentStreakWeeks}
          totalActiveDays={heatmapData.totalActiveDays}
        />

        {/* Minimalist Vitals 4-Quadrant Card */}
        <VitalsGrid vitals={profile.vitals} />

        {/* Personal Records: SBD Trio (Interactive Progression Curve) */}
        <PersonalRecordsCard records={profile.personalRecords} />

        {/* Minimalist Version Footnote */}
        <Text style={styles.versionFootnote}>
          Gymnix v.1
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#18181A',
    backgroundColor: '#000000',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.4,
  },
  actionButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderCurve: 'continuous',
    backgroundColor: '#141414',
    borderWidth: 1,
    borderColor: '#24242A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  versionFootnote: {
    color: '#3F3F46',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.3,
    marginTop: 8,
    marginBottom: 16,
  },
});
