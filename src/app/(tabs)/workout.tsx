import { exerciseService } from '@/features/exercises/services/exerciseService';
import { useWorkoutHub } from '@/features/workout/hooks/useWorkoutHub';
import {
  LocalWorkoutSessionRow,
  workoutService,
} from '@/features/workout/services/workoutService';
import * as Haptics from '@/utils/haptics';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

interface SplitPreset {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  estMinutes: string;
  defaultExercises: string[];
}

const SPLIT_PRESETS: SplitPreset[] = [
  {
    id: 'push',
    title: 'Push Hypertrophy',
    subtitle: 'Chest, Anterior Delts & Triceps',
    tag: 'UPPER PUSH',
    estMinutes: '50 min',
    defaultExercises: [
      'Barbell Bench Press',
      'Incline Dumbbell Press',
      'Overhead Press',
      'Triceps Pushdown',
    ],
  },
  {
    id: 'pull',
    title: 'Pull Width & Thickness',
    subtitle: 'Lats, Mid-Back & Biceps',
    tag: 'UPPER PULL',
    estMinutes: '50 min',
    defaultExercises: [
      'Pullups',
      'Bent Over Barbell Row',
      'Seated Cable Rows',
      'Barbell Curl',
    ],
  },
  {
    id: 'legs',
    title: 'Lower Body Foundation',
    subtitle: 'Quads, Hamstrings, Glutes & Calves',
    tag: 'LOWER',
    estMinutes: '55 min',
    defaultExercises: [
      'Barbell Squat',
      'Romanian Deadlift',
      'Leg Press',
      'Standing Calf Raises',
    ],
  },
  {
    id: 'core',
    title: 'Core & Abdominal Conditioning',
    subtitle: 'Rectus Abdominis, Obliques & Stability',
    tag: 'CORE',
    estMinutes: '30 min',
    defaultExercises: [
      'Hanging Leg Raise',
      'Cable Crunch',
      'Plank',
      'Russian Twist',
    ],
  },
];

export default function WorkoutScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    calendarDays,
    selectedCalendarDay,
    selectDay,
    startNewWorkout,
    browseExerciseList,
  } = useWorkoutHub();

  const [activeSession, setActiveSession] =
    useState<LocalWorkoutSessionRow | null>(null);
  const [recentSessions, setRecentSessions] = useState<any[]>([]);
  const [exerciseCount, setExerciseCount] = useState<number>(0);

  const loadWorkoutData = useCallback(async () => {
    try {
      const currentActive = workoutService.getActiveSession();
      setActiveSession(currentActive);

      const [history, exercises] = await Promise.all([
        workoutService.getWorkoutHistory(15),
        exerciseService.getAll(),
      ]);

      setRecentSessions(history || []);
      if (exercises && exercises.length > 0) {
        setExerciseCount(exercises.length);
      }
    } catch {
      // ignore offline error
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadWorkoutData();
    }, [loadWorkoutData])
  );

  const handleStartPreset = (preset: SplitPreset) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push({
      pathname: '/workout-active',
      params: {
        title: preset.title,
        exercises: JSON.stringify(preset.defaultExercises),
      },
    });
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      {/* 1. Cohesive Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Workout</Text>
          <Text style={styles.headerSubtitle}>TRAINING LOG & ROUTINES</Text>
        </View>

        <View style={styles.headerPill}>
          <Ionicons name="checkmark-done" size={13} color="#BE3144" />
          <Text style={styles.headerPillText}>
            {recentSessions.length} Logged
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 88 },
        ]}>
        {/* 2. Weekly Calendar Strip */}
        <View style={styles.calendarStrip}>
          {calendarDays.map((cal, idx) => {
            const isActive = selectedCalendarDay === idx;
            return (
              <TouchableOpacity
                key={idx}
                activeOpacity={0.75}
                onPress={() => selectDay(idx)}
                style={[
                  styles.calendarCell,
                  isActive ? styles.calendarCellActive : null,
                ]}>
                <Text
                  style={[
                    styles.calendarDayText,
                    isActive ? styles.calendarDayTextActive : null,
                  ]}>
                  {cal.day}
                </Text>
                <Text
                  style={[
                    styles.calendarDateText,
                    isActive ? styles.calendarDateTextActive : null,
                  ]}>
                  {cal.date}
                </Text>
                <View
                  style={[
                    styles.calendarDot,
                    cal.hasWorkout ? styles.calendarDotActive : null,
                  ]}
                />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 3. Primary Actions Grid */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionLabel}>SESSION ACTIONS</Text>

          <View style={styles.actionGrid}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={startNewWorkout}
              style={[styles.actionCard, styles.actionCardPrimary]}>
              <LinearGradient
                colors={[
                  'rgba(190, 49, 68, 0.2)',
                  'rgba(190, 49, 68, 0.03)',
                  'transparent',
                ]}
                locations={[0, 0.5, 1]}
                start={{ x: 1, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={StyleSheet.absoluteFill}
                pointerEvents="none"
              />
              <LinearGradient
                colors={['#E63950', '#BE3144']}
                style={styles.actionIconBoxPrimary}>
                <Ionicons name="add" size={20} color="#FFFFFF" />
              </LinearGradient>
              <Text style={styles.actionCardTitle}>New Session</Text>
              <Text style={styles.actionCardSub}>
                Select movements & log sets
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={browseExerciseList}
              style={styles.actionCard}>
              <View style={styles.actionIconBoxSecondary}>
                <Ionicons name="barbell-outline" size={18} color="#E4E4E7" />
              </View>
              <Text style={styles.actionCardTitle}>Exercise Library</Text>
              <Text style={styles.actionCardSub}>
                {exerciseCount > 0
                  ? `${exerciseCount} movements indexed`
                  : 'Browse by muscle & gear'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 4. Structured Split Templates */}
        <View style={styles.sectionBlock}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionLabel}>TRAINING SPLITS</Text>
            <Text style={styles.sectionMeta}>Tap to launch</Text>
          </View>

          <View style={styles.splitList}>
            {SPLIT_PRESETS.map((split) => (
              <TouchableOpacity
                key={split.id}
                activeOpacity={0.85}
                onPress={() => handleStartPreset(split)}
                style={styles.splitCard}>
                <LinearGradient
                  colors={[
                    'rgba(190, 49, 68, 0.1)',
                    'rgba(190, 49, 68, 0.01)',
                    'transparent',
                  ]}
                  locations={[0, 0.45, 1]}
                  start={{ x: 1, y: 0 }}
                  end={{ x: 0.1, y: 0.9 }}
                  style={StyleSheet.absoluteFill}
                  pointerEvents="none"
                />
                <View style={styles.splitTopRow}>
                  <View style={styles.splitTagBadge}>
                    <Text style={styles.splitTagText}>{split.tag}</Text>
                  </View>
                  <View style={styles.splitDurationRow}>
                    <Ionicons name="time-outline" size={12} color="#71717A" />
                    <Text style={styles.splitDurationText}>
                      {split.estMinutes}
                    </Text>
                  </View>
                </View>

                <View style={styles.splitMainRow}>
                  <View style={styles.flexOne}>
                    <Text style={styles.splitTitle}>{split.title}</Text>
                    <Text style={styles.splitSubtitle}>{split.subtitle}</Text>
                  </View>
                  <LinearGradient
                    colors={['#E63950', '#BE3144']}
                    style={styles.splitPlayButton}>
                    <Ionicons name="play" size={13} color="#FFFFFF" />
                  </LinearGradient>
                </View>

                <View style={styles.splitChipsRow}>
                  {split.defaultExercises.map((ex, i) => (
                    <View key={i} style={styles.splitExercisePill}>
                      <Text style={styles.splitExercisePillText}>{ex}</Text>
                    </View>
                  ))}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 5. Recent Logged Sessions from Database */}
        <View style={styles.sectionBlock}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionLabel}>RECENT LOGS</Text>
            <Text style={styles.sectionMeta}>
              {recentSessions.length > 0
                ? `Last ${Math.min(recentSessions.length, 5)} sessions`
                : 'No logs yet'}
            </Text>
          </View>

          {recentSessions.length === 0 ? (
            <View style={styles.emptyLogCard}>
              <Text style={styles.emptyLogTitle}>No completed sessions yet</Text>
              <Text style={styles.emptyLogSub}>
                Completed workouts will appear here with total volume and duration.
              </Text>
            </View>
          ) : (
            <View style={styles.logList}>
              {recentSessions.slice(0, 5).map((sess, idx) => {
                const dateObj = sess.started_at
                  ? new Date(sess.started_at)
                  : new Date();
                const dateFormatted = dateObj.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                });
                const durationMin = Math.max(
                  1,
                  Math.round((Number(sess.duration_seconds) || 0) / 60)
                );
                const volumeKg = Number(sess.total_volume_kg) || 0;

                return (
                  <View key={sess.id || idx} style={styles.logRowCard}>
                    <View style={styles.logDateBadge}>
                      <Text style={styles.logDateText}>{dateFormatted}</Text>
                    </View>

                    <View style={styles.flexOne}>
                      <Text style={styles.logTitle} numberOfLines={1}>
                        {sess.title || 'Workout Session'}
                      </Text>
                      <Text style={styles.logMeta}>
                        {durationMin} min • Completed
                      </Text>
                    </View>

                    <View style={styles.logVolumeCol}>
                      <Text style={styles.logVolumeValue}>
                        {volumeKg.toLocaleString()}
                      </Text>
                      <Text style={styles.logVolumeUnit}>KG VOL</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000000',
  },
  flexOne: {
    flex: 1,
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
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    color: '#71717A',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    marginTop: 2,
  },
  headerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#121214',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: '#222226',
  },
  headerPillText: {
    color: '#D4D4D8',
    fontSize: 11.5,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  calendarStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
    marginBottom: 20,
  },
  calendarCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    borderCurve: 'continuous',
    backgroundColor: '#0A0A0C',
    borderWidth: 1,
    borderColor: '#16161A',
  },
  calendarCellActive: {
    backgroundColor: '#141418',
    borderColor: '#2E2E36',
  },
  calendarDayText: {
    color: '#71717A',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  calendarDayTextActive: {
    color: '#E4E4E7',
  },
  calendarDateText: {
    color: '#A1A1AA',
    fontSize: 15,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  calendarDateTextActive: {
    color: '#FFFFFF',
  },
  calendarDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'transparent',
    marginTop: 5,
  },
  calendarDotActive: {
    backgroundColor: '#BE3144',
  },
  activeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(190, 49, 68, 0.09)',
    borderWidth: 1,
    borderColor: 'rgba(190, 49, 68, 0.32)',
    borderRadius: 14,
    borderCurve: 'continuous',
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 22,
  },
  activeBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    flex: 1,
  },
  liveDotOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(190, 49, 68, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  liveDotInner: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#BE3144',
  },
  activeBannerLabel: {
    color: '#E63950',
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  activeBannerTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    marginTop: 1,
  },
  resumeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#BE3144',
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 8,
    borderCurve: 'continuous',
  },
  resumeBadgeText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '800',
  },
  sectionBlock: {
    marginBottom: 24,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionLabel: {
    color: '#71717A',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.9,
    marginBottom: 10,
  },
  sectionMeta: {
    color: '#52525B',
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 10,
  },
  actionGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#0A0A0C',
    borderWidth: 1,
    borderColor: '#1C1C20',
    borderRadius: 16,
    borderCurve: 'continuous',
    padding: 15,
  },
  actionCardPrimary: {
    borderColor: 'rgba(190, 49, 68, 0.35)',
    backgroundColor: '#0D0A0B',
  },
  actionIconBoxPrimary: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderCurve: 'continuous',
    backgroundColor: '#BE3144',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionIconBoxSecondary: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderCurve: 'continuous',
    backgroundColor: '#141418',
    borderWidth: 1,
    borderColor: '#25252B',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionCardTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  actionCardSub: {
    color: '#71717A',
    fontSize: 11.5,
    fontWeight: '500',
    marginTop: 3,
    lineHeight: 16,
  },
  splitList: {
    gap: 12,
  },
  splitCard: {
    backgroundColor: '#0A0A0C',
    borderWidth: 1,
    borderColor: '#1C1C20',
    borderRadius: 16,
    borderCurve: 'continuous',
    padding: 15,
  },
  splitTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  splitTagBadge: {
    backgroundColor: '#141418',
    borderWidth: 1,
    borderColor: '#242429',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderCurve: 'continuous',
  },
  splitTagText: {
    color: '#A1A1AA',
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  splitDurationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  splitDurationText: {
    color: '#71717A',
    fontSize: 11,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  splitMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 12,
  },
  splitTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  splitSubtitle: {
    color: '#71717A',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  splitPlayButton: {
    width: 34,
    height: 34,
    borderRadius: 10,
    borderCurve: 'continuous',
    backgroundColor: '#BE3144',
    alignItems: 'center',
    justifyContent: 'center',
  },
  splitChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  splitExercisePill: {
    backgroundColor: '#111114',
    borderWidth: 1,
    borderColor: '#1E1E24',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 7,
    borderCurve: 'continuous',
  },
  splitExercisePillText: {
    color: '#A1A1AA',
    fontSize: 11,
    fontWeight: '600',
  },
  emptyLogCard: {
    backgroundColor: '#0A0A0C',
    borderWidth: 1,
    borderColor: '#18181C',
    borderRadius: 14,
    borderCurve: 'continuous',
    padding: 18,
    alignItems: 'center',
  },
  emptyLogTitle: {
    color: '#A1A1AA',
    fontSize: 13,
    fontWeight: '700',
  },
  emptyLogSub: {
    color: '#52525B',
    fontSize: 11.5,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 17,
  },
  logList: {
    gap: 8,
  },
  logRowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#0A0A0C',
    borderWidth: 1,
    borderColor: '#18181C',
    borderRadius: 14,
    borderCurve: 'continuous',
    paddingHorizontal: 13,
    paddingVertical: 11,
  },
  logDateBadge: {
    backgroundColor: '#121216',
    borderWidth: 1,
    borderColor: '#222228',
    borderRadius: 9,
    borderCurve: 'continuous',
    paddingHorizontal: 9,
    paddingVertical: 6,
    minWidth: 50,
    alignItems: 'center',
  },
  logDateText: {
    color: '#D4D4D8',
    fontSize: 11,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  logTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  logMeta: {
    color: '#71717A',
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  logVolumeCol: {
    alignItems: 'flex-end',
  },
  logVolumeValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  logVolumeUnit: {
    color: '#BE3144',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginTop: 1,
  },
});
