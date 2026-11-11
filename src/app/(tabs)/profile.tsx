import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { ProfileHeroCard } from '@/features/profile/components/ProfileHeroCard';
import { VitalsGrid } from '@/features/profile/components/VitalsGrid';
import { PersonalRecordsCard } from '@/features/profile/components/PersonalRecordsCard';
import { LifetimeStatsCard } from '@/features/profile/components/LifetimeStatsCard';
import { TrainingProfileCard } from '@/features/profile/components/TrainingProfileCard';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const {
    profile,
    navigateToSettings,
    navigateToEditProfile,
    navigateToHomeGym,
  } = useProfile();

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      {/* 1. Cohesive Header (Matches Home & Workout Design System) */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Profile</Text>
          <Text style={styles.headerSubtitle}>ATHLETE OS</Text>
        </View>

        <TouchableOpacity
          onPress={navigateToSettings}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={styles.settingsButton}
          accessibilityRole="button"
          accessibilityLabel="Open Settings">
          <Ionicons name="settings-outline" size={19} color="#FFFFFF" />
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
          onEditPress={navigateToEditProfile}
          onGymPress={navigateToHomeGym}
        />

        {/* Lifetime Athletic Career (Tonnage, Sessions, Time Under Iron) */}
        <LifetimeStatsCard />

        {/* Minimalist Vitals 4-Quadrant Card */}
        <VitalsGrid vitals={profile.vitals} />

        {/* Personal Records: SBD Trio (Interactive Progression Curve) */}
        <PersonalRecordsCard records={profile.personalRecords} />

        {/* Training Program Specifications */}
        <TrainingProfileCard
          program={profile.trainingProgram}
          homeGym={profile.homeGym}
          onGymPress={navigateToHomeGym}
        />

        {/* Quick Shortcut: App & Preferences Settings */}
        <TouchableOpacity
          onPress={navigateToSettings}
          activeOpacity={0.75}
          style={styles.settingsShortcutCard}>
          <View style={styles.settingsShortcutLeft}>
            <View style={styles.settingsIconBox}>
              <Ionicons name="options-outline" size={18} color="#BE3144" />
            </View>
            <View>
              <Text style={styles.settingsShortcutTitle}>
                Workout & App Preferences
              </Text>
              <Text style={styles.settingsShortcutDesc}>
                Units, rest timers, haptics, security
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#71717A" />
        </TouchableOpacity>

        {/* Minimalist Version Footnote */}
        <Text style={styles.versionFootnote}>
          Gymnix Athlete OS • v2.8.4
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
  headerSubtitle: {
    color: '#71717A',
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginTop: 1,
  },
  settingsButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderCurve: 'continuous',
    backgroundColor: '#121214',
    borderWidth: 1,
    borderColor: '#24242A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  settingsShortcutCard: {
    backgroundColor: '#0A0A0A',
    borderWidth: 1,
    borderColor: '#1E1E22',
    borderRadius: 16,
    borderCurve: 'continuous',
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  settingsShortcutLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingsIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderCurve: 'continuous',
    backgroundColor: '#141416',
    borderWidth: 1,
    borderColor: '#27272A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsShortcutTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  settingsShortcutDesc: {
    color: '#71717A',
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  versionFootnote: {
    color: '#3F3F46',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
});
