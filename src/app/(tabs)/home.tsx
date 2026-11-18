import { HomeDashboardData, homeService, VolumeDay } from '@/features/home/services/homeService';
import { profileService } from '@/features/profile/services/profileService';
import { supabase } from '@/lib/supabase';
import * as Haptics from '@/utils/haptics';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeDayIdx, setActiveDayIdx] = useState<number>((new Date().getDay() + 6) % 7);
  const [dashboard, setDashboard] = useState<HomeDashboardData>(() => ({
    athleteName: profileService.getCachedAthleteName(),
    avatarUrl: profileService.getCachedAvatarUrl(),
    activeSession: null,
    todayExercises: ['Barbell Squat', 'Bench Press', 'Barbell Row', 'Overhead Press', 'Deadlift'],
    weeklyVolume: [
      { day: 'Mon', value: '0', numeric: 0, heightPercent: 16 },
      { day: 'Tue', value: '0', numeric: 0, heightPercent: 16 },
      { day: 'Wed', value: '0', numeric: 0, heightPercent: 16 },
      { day: 'Thu', value: '0', numeric: 0, heightPercent: 16 },
      { day: 'Fri', value: '0', numeric: 0, heightPercent: 16 },
      { day: 'Sat', value: '0', numeric: 0, heightPercent: 16 },
      { day: 'Sun', value: '0', numeric: 0, heightPercent: 16 },
    ],
    totalWeeklyVolumeKg: 0,
    totalWeeklySets: 0,
    activeDaysCount: 0,
  }));

  // Immediate zero-latency local session retrieval to populate connected user's name on first frame
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const meta = session.user.user_metadata;
        const rawName =
          meta?.display_name ||
          meta?.full_name ||
          meta?.name ||
          session.user.email?.split('@')[0];

        if (rawName) {
          const firstName = rawName.trim().split(' ')[0];
          const avatar = meta?.avatar_url || meta?.picture || null;
          profileService.setCachedProfile(firstName, avatar);
          setDashboard((prev) => ({
            ...prev,
            athleteName: prev.athleteName || firstName,
            avatarUrl: prev.avatarUrl || avatar,
          }));
        }
      }
    });
  }, []);

  const loadData = useCallback(async () => {
    try {
      const data = await homeService.getDashboardData();
      setDashboard(data);
    } catch (e) {
      console.warn('[HomeScreen] Could not load dashboard data:', e);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const handleStartWorkout = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push({
      pathname: '/workout-active',
      params: {
        title: 'Full Body Strength',
        exercises: JSON.stringify(dashboard.todayExercises),
      },
    });
  };

  const handleProfilePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/(tabs)/profile');
  };

  const handleSelectDay = (index: number) => {
    Haptics.selectionAsync();
    setActiveDayIdx(index);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 84 },
        ]}>
        {/* 1. Header: Greeting & Profile Avatar */}
        <View style={styles.headerRow}>
          <View style={styles.greetingCol}>
            <Text style={styles.greetingTitle}>
              {dashboard.athleteName ? `Hello, ${dashboard.athleteName}` : 'Welcome Back'}
            </Text>
            <Text style={styles.greetingSubtitle}>Ready for your workout?</Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleProfilePress}
            style={styles.avatarButton}
            accessibilityRole="button"
            accessibilityLabel="View profile">
            {dashboard.avatarUrl ? (
              <Image
                source={{ uri: dashboard.avatarUrl }}
                style={styles.avatarImage}
                contentFit="cover"
              />
            ) : (
              <View style={[styles.avatarImage, styles.avatarFallback]}>
                <Text style={styles.avatarInitials}>
                  {(dashboard.athleteName || 'GX').slice(0, 2).toUpperCase()}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* 2. Section: Today's Workout (Dynamic from Database) */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>{"Today's Workout"}</Text>
          </View>

          <View style={styles.workoutCard}>
            {/* Subtle atmospheric corner accent glow */}
            <LinearGradient
              colors={['rgba(190, 49, 68, 0.16)', 'rgba(190, 49, 68, 0.03)', 'transparent']}
              locations={[0, 0.45, 1]}
              start={{ x: 1, y: 0 }}
              end={{ x: 0.1, y: 0.85 }}
              style={StyleSheet.absoluteFill}
              pointerEvents="none"
            />

            {/* Header: Title & Duration */}
            <View style={styles.workoutHeaderRow}>
              <Text style={styles.workoutTitle}>Full Body Strength</Text>
              <View style={styles.workoutDurationInline}>
                <Ionicons name="time-outline" size={13} color="#8E8E93" />
                <Text style={styles.workoutDurationText}>45 min</Text>
              </View>
            </View>

            {/* Exercise Movements Horizontal Wrap Cards */}
            <View style={styles.exerciseCardsRowWrap}>
              {dashboard.todayExercises.map((name, idx) => (
                <View key={idx} style={styles.exerciseCard}>
                  <Text style={styles.exerciseNameText}>{name}</Text>
                </View>
              ))}
            </View>

            {/* Start Workout Button with Gradient & Play Icon */}
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={handleStartWorkout}
              style={styles.startWorkoutButton}
              accessibilityRole="button"
              accessibilityLabel="Start workout">
              <LinearGradient
                colors={['#E63950', '#BE3144']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.startWorkoutGradient}>
                <Text style={styles.startWorkoutText}>Start Workout</Text>
                <Ionicons name="play" size={12} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* 3. Section: Weekly Volume (Dynamic from Database) */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Weekly Volume</Text>

            {/* Weekly Goal Pill (Target Frekuensi) */}
            <View style={styles.goalPill}>
              <Ionicons name="flame" size={12} color="#BE3144" />
              <Text style={styles.goalPillText}>
                <Text style={styles.goalPillNumber}>{dashboard.activeDaysCount} / 4</Text> Sessions Done
              </Text>
            </View>
          </View>

          <View style={styles.chartCard}>
            {/* Stats Header */}
            <View style={styles.statsHeader}>
              <View style={styles.statLabelRow}>
                <Ionicons name="barbell-outline" size={15} color="#BE3144" />
                <Text style={styles.statLabel}>Volume</Text>
              </View>

              <View style={styles.statValuesRow}>
                <View style={styles.statCol}>
                  <Text style={styles.statNumber}>
                    {dashboard.totalWeeklyVolumeKg.toLocaleString()}
                  </Text>
                  <Text style={styles.statSubText}>Total kg</Text>
                </View>

                <View style={styles.statDivider} />

                <View style={styles.statCol}>
                  <Text style={styles.statNumber}>{dashboard.totalWeeklySets}</Text>
                  <Text style={styles.statSubText}>Sets</Text>
                </View>
              </View>
            </View>

            {/* Bar Chart Area with Proportional Capsules */}
            <View style={styles.chartArea}>
              <View style={styles.barsContainer}>
                {dashboard.weeklyVolume.map((item: VolumeDay, idx: number) => {
                  const isActive = activeDayIdx === idx;
                  return (
                    <TouchableOpacity
                      key={item.day}
                      activeOpacity={0.8}
                      onPress={() => handleSelectDay(idx)}
                      style={styles.barColumn}>
                      {/* Floating Tooltip Slot */}
                      <View style={styles.tooltipSlot}>
                        {isActive && (
                          <View style={styles.tooltipPill}>
                            <Text style={styles.tooltipText}>
                              {item.numeric.toLocaleString()}
                            </Text>
                          </View>
                        )}
                      </View>

                      {/* Bar Track & Rounded Capsule */}
                      <View style={styles.barTrack}>
                        <View
                          style={[
                            styles.barCapsule,
                            { height: `${item.heightPercent}%` },
                            isActive
                              ? styles.barCapsuleActive
                              : styles.barCapsuleInactive,
                          ]}
                        />
                      </View>

                      {/* Day Label */}
                      <Text
                        style={[
                          styles.barDayLabel,
                          isActive && styles.barDayLabelActive,
                        ]}>
                        {item.day}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  greetingCol: {
    flex: 1,
  },
  greetingTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  greetingSubtitle: {
    color: '#8E8E93',
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
  },
  avatarButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: '#262626',
    overflow: 'hidden',
    backgroundColor: '#161616',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarFallback: {
    backgroundColor: '#1E1E24',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 14,
  },
  activeWorkoutBanner: {
    backgroundColor: 'rgba(190, 49, 68, 0.08)',
    borderRadius: 18,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: 'rgba(190, 49, 68, 0.28)',
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  activeBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  pulsingDotWrapper: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(190, 49, 68, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulsingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#BE3144',
  },
  activeBannerTextCol: {
    flex: 1,
  },
  activeBannerTitle: {
    color: '#BE3144',
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  activeBannerSplit: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    marginTop: 1,
  },
  activeBannerMeta: {
    color: '#71717A',
    fontSize: 11,
    fontWeight: '500',
    marginTop: 1,
  },
  resumePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#BE3144',
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 12,
    borderCurve: 'continuous',
  },
  resumePillText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '800',
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  goalPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4.5,
    backgroundColor: 'rgba(190, 49, 68, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(190, 49, 68, 0.28)',
    borderRadius: 999,
    paddingHorizontal: 8.5,
    paddingVertical: 3.5,
  },
  goalPillText: {
    color: '#FFFFFF',
    fontSize: 10.5,
    fontWeight: '700',
  },
  goalPillNumber: {
    color: '#BE3144',
    fontWeight: '800',
  },
  workoutCard: {
    backgroundColor: '#0F0F11',
    borderRadius: 24,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: '#1E1E24',
    padding: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  workoutHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  workoutTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  workoutDurationInline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  workoutDurationText: {
    color: '#8E8E93',
    fontSize: 12,
    fontWeight: '600',
  },
  exerciseCardsRowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
    marginBottom: 16,
  },
  exerciseCard: {
    backgroundColor: '#141414',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#24242A',
  },
  exerciseNameText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '600',
  },
  startWorkoutButton: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  startWorkoutGradient: {
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  startWorkoutText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  chartCard: {
    backgroundColor: '#000000',
    borderRadius: 24,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: '#1E1E24',
    padding: 16,
  },
  statsHeader: {
    marginBottom: 12,
  },
  statLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 6,
  },
  statLabel: {
    color: '#8E8E93',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  statValuesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  statCol: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 5,
  },
  statNumber: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  statSubText: {
    color: '#8E8E93',
    fontSize: 11,
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    height: 18,
    backgroundColor: '#262626',
  },
  chartArea: {
    marginTop: 4,
  },
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 130,
    paddingTop: 24,
  },
  barColumn: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
  },
  tooltipSlot: {
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  tooltipPill: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 6,
  },
  tooltipText: {
    color: '#000000',
    fontSize: 9,
    fontWeight: '900',
  },
  barTrack: {
    width: 22,
    height: 80,
    borderRadius: 11,
    backgroundColor: '#1E1E24',
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barCapsule: {
    width: '100%',
    borderRadius: 11,
  },
  barCapsuleActive: {
    backgroundColor: '#BE3144',
  },
  barCapsuleInactive: {
    backgroundColor: '#2C2C34',
  },
  barDayLabel: {
    color: '#71717A',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 6,
  },
  barDayLabelActive: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
});
