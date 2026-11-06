import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { SemiGauge } from '@/components/ui/inverted-gauge';

interface WeeklyVolumeDay {
  day: string;
  value: string;
  height: `${number}%`;
  baseColor: string;
}

const WEEKLY_DAYS: WeeklyVolumeDay[] = [
  { day: 'M', value: '1.8k', height: '46%', baseColor: '#26292E' },
  { day: 'T', value: '2.4k', height: '50%', baseColor: '#26292E' },
  { day: 'W', value: 'Rest', height: '8%', baseColor: '#17181B' },
  { day: 'T', value: '3.1k', height: '82%', baseColor: '#BE3144' }, // Active (Thursday)
  { day: 'F', value: '1.4k', height: '36%', baseColor: '#1C1E22' },
  { day: 'S', value: 'Est', height: '46%', baseColor: '#17181B' },
  { day: 'S', value: 'Rest', height: '8%', baseColor: '#17181B' },
];

const EXERCISE_CHIPS = [
  { line1: 'Incline DB', line2: 'Press' },
  { line1: 'Overhead', line2: 'Press' },
  { line1: 'Cable', line2: 'Flys' },
  { line1: '+2', line2: 'more' },
];

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeDayIdx, setActiveDayIdx] = useState<number>(3); // Default to Thursday (index 3)

  const handleStartSession = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/(tabs)/workout');
  };

  const handleSelectDay = (index: number) => {
    Haptics.selectionAsync();
    setActiveDayIdx(index);
  };

  const handleNotificationPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleStreakPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePrPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* 1. Header */}
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <Text style={styles.brandTitle}>GYMNIX</Text>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={handleStreakPress}
            style={styles.streakBadge}
            accessibilityRole="button"
            accessibilityLabel="4 day streak">
            <Ionicons name="flame" size={14} color="#BE3144" />
            <Text style={styles.streakText}>4d Streak</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.75}
            onPress={handleNotificationPress}
            style={styles.iconButton}
            accessibilityRole="button"
            accessibilityLabel="Notifications">
            <Ionicons name="notifications-outline" size={17} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* 2. Scrollable Body */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 84 },
        ]}>

        {/* TODAY'S SPLIT HERO CARD (Matches User Image) */}
        <View style={styles.heroCard}>
          {/* Smooth, Seamless Corner Gradient into Tone Color (#BE3144) - Versi Paling Awal */}
          <LinearGradient
            colors={[
              'rgba(190, 49, 68, 0.42)',
              'rgba(190, 49, 68, 0.16)',
              'rgba(12, 12, 14, 0.02)',
              'transparent',
            ]}
            locations={[0, 0.32, 0.65, 1]}
            start={{ x: 1, y: 0 }}
            end={{ x: 0.1, y: 0.75 }}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />

          {/* Card Header: Section Title & Tone-Matched READY Badge */}
          <View style={styles.heroTopRow}>
            <Text style={styles.sectionHeaderLabel}>{"TODAY'S SPLIT"}</Text>
            <View style={styles.readyBadge}>
              <Text style={styles.readyBadgeText}>READY</Text>
            </View>
          </View>

          {/* Title & Workout Subtitle */}
          <Text style={styles.heroTitle}>Push Day A</Text>
          <Text style={styles.heroSubtitle}>
            Chest, Shoulders & Triceps • 5 Exercises •{'\n'}~50m
          </Text>

          {/* Stacked 2-Line Exercise Chips */}
          <View style={styles.exerciseChipsRow}>
            {EXERCISE_CHIPS.map((chip, idx) => (
              <View key={idx} style={styles.exerciseChip}>
                <Text style={styles.chipText}>{chip.line1}</Text>
                <Text style={styles.chipText}>{chip.line2}</Text>
              </View>
            ))}
          </View>

          {/* Start Session CTA Button with Trailing Play Arrow */}
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={handleStartSession}
            style={styles.ctaButton}
            accessibilityRole="button"
            accessibilityLabel="Start Workout Session">
            <Text style={styles.ctaButtonText}>Start Session</Text>
            <Ionicons name="play" size={13} color="#FFFFFF" style={styles.ctaPlayIcon} />
          </TouchableOpacity>
        </View>

        {/* METRICS ROW (Speedometer / Semi-Circular Gauge Meters) */}
        <View style={styles.metricsRow}>
          {/* Daily Target */}
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>DAILY TARGET</Text>
            <View style={styles.metricGaugeSlot}>
              <SemiGauge
                value="2,450"
                unit="kcal"
                progress={0.74}
                size={128}
                strokeWidth={12}
                color="#BE3144"
              />
            </View>
            <Text style={styles.metricFootnote}>BMR/TDEE Calibrated</Text>
          </View>

          {/* Current Weight */}
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>CURRENT WEIGHT</Text>
            <View style={styles.metricGaugeSlot}>
              <SemiGauge
                value="74.5"
                unit="kg"
                progress={0.80}
                size={128}
                strokeWidth={12}
                color="#BE3144"
              />
            </View>
            <Text style={styles.metricFootnote}>
              On track <Text style={styles.metricFootnoteHighlight}>(-0.3kg)</Text>
            </Text>
          </View>
        </View>

        {/* WEEKLY VOLUME CARD (Matches User Image: Wide Bars, Tight Spacing, Glowing Active Day) */}
        <View style={styles.volumeCard}>
          <View style={styles.volumeHeaderRow}>
            <View>
              <Text style={styles.cardTitle}>Weekly Volume</Text>
              <Text style={styles.cardSubtitle}>Total tonnage across sets</Text>
            </View>
            <View style={styles.volumeTotalRow}>
              <Text style={styles.volumeTotalNumber}>14,820</Text>
              <Text style={styles.volumeTotalUnit}>kg</Text>
            </View>
          </View>

          {/* Bar Chart Area */}
          <View style={styles.chartArea}>
            <View style={styles.barsContainer}>
              {WEEKLY_DAYS.map((item, idx) => {
                const isActive = activeDayIdx === idx;
                return (
                  <TouchableOpacity
                    key={idx}
                    activeOpacity={0.8}
                    onPress={() => handleSelectDay(idx)}
                    style={styles.barColumn}>
                    {/* Active Value + Centered White Dot Indicator */}
                    <View style={styles.topIndicatorSlot}>
                      {isActive && (
                        <>
                          <Text style={styles.activeDayValue}>{item.value}</Text>
                          <View style={styles.activeDayDot} />
                        </>
                      )}
                    </View>

                    {/* Wide Bar with Tight Inter-Day Spacing */}
                    <View style={styles.barTrack}>
                      <View
                        style={[
                          styles.barFill,
                          {
                            height: item.height,
                            backgroundColor: isActive ? '#C92A3E' : item.baseColor,
                          },
                          isActive && styles.activeBarGlow,
                        ]}
                      />
                    </View>

                    {/* Day Letter */}
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

        {/* QUICK RECENT PR (Tone-Matched, No Green) */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handlePrPress}
          style={styles.prCard}
          accessibilityRole="button"
          accessibilityLabel="Recent PR: Barbell Bench Press 80kg">
          <View style={styles.prLeftGroup}>
            <View style={styles.trophyIconContainer}>
              <Ionicons name="trophy" size={17} color="#BE3144" />
            </View>
            <View style={styles.prTextGroup}>
              <View style={styles.prBadgeRow}>
                <Text style={styles.prBadgeText}>NEW PR</Text>
                <Text style={styles.prTimeText}>• Yesterday</Text>
              </View>
              <Text style={styles.prTitleText} numberOfLines={1}>
                Barbell Bench Press 80 kg
              </Text>
            </View>
          </View>

          {/* Tone-matched PR badge replacing green */}
          <View style={styles.prDeltaBadge}>
            <Text style={styles.prDeltaText}>+2.5 kg</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#18181C',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandTitle: {
    color: '#BE3144',
    fontSize: 22,
    fontWeight: '900',
    fontStyle: 'italic',
    letterSpacing: 1.2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#121215',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: '#24242A',
    gap: 5,
  },
  streakText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    letterSpacing: 0.2,
  },
  iconButton: {
    width: 34,
    height: 34,
    borderRadius: 999,
    borderCurve: 'continuous',
    backgroundColor: '#121215',
    borderWidth: 1,
    borderColor: '#24242A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  // --- 1. HERO CARD (Today's Split as in Image 1) ---
  heroCard: {
    backgroundColor: '#0A0A0C',
    borderRadius: 16,
    borderCurve: 'continuous',
    padding: 18,
    borderWidth: 1,
    borderColor: '#1D1D22',
    marginBottom: 14,
    position: 'relative',
    overflow: 'hidden',
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sectionHeaderLabel: {
    color: '#71717A',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  readyBadge: {
    backgroundColor: 'rgba(190, 49, 68, 0.2)',
    paddingHorizontal: 9,
    paddingVertical: 3.5,
    borderRadius: 6,
    borderCurve: 'continuous',
  },
  readyBadgeText: {
    color: '#E63950',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.4,
    marginTop: 2,
  },
  heroSubtitle: {
    color: '#71717A',
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
    marginTop: 4,
    marginBottom: 16,
  },
  exerciseChipsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 18,
  },
  exerciseChip: {
    flex: 1,
    backgroundColor: '#141416',
    borderRadius: 8,
    borderCurve: 'continuous',
    paddingVertical: 10,
    paddingHorizontal: 8,
    justifyContent: 'center',
  },
  chipText: {
    color: '#A1A1AA',
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 15,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#C92A3E',
    paddingVertical: 13,
    borderRadius: 12,
    borderCurve: 'continuous',
    gap: 7,
  },
  ctaButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  ctaPlayIcon: {
    marginLeft: 2,
  },

  // --- 2. METRICS ROW ---
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  metricCard: {
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
  metricLabel: {
    color: '#71717A',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 4,
    textAlign: 'center',
  },
  metricGaugeSlot: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  metricFootnote: {
    color: '#71717A',
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 2,
  },
  metricFootnoteHighlight: {
    color: '#BE3144',
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },

  // --- 3. WEEKLY VOLUME CARD (As in Image 2) ---
  volumeCard: {
    backgroundColor: '#0C0C0E',
    borderRadius: 16,
    borderCurve: 'continuous',
    padding: 16,
    borderWidth: 1,
    borderColor: '#1D1D22',
    marginBottom: 14,
  },
  volumeHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  cardSubtitle: {
    color: '#71717A',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  volumeTotalRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 3,
  },
  volumeTotalNumber: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.4,
    fontVariant: ['tabular-nums'],
  },
  volumeTotalUnit: {
    color: '#8A8F9D',
    fontSize: 13,
    fontWeight: '500',
  },
  chartArea: {
    height: 136,
    justifyContent: 'flex-end',
  },
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 7, // Tight inter-day spacing
    height: 130,
  },
  barColumn: {
    flex: 1, // Wide bars that span horizontally
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
  },
  topIndicatorSlot: {
    height: 22,
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '100%',
    position: 'relative',
  },
  activeDayValue: {
    color: '#E63950',
    fontSize: 10,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
    marginBottom: 2,
  },
  activeDayDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#FFFFFF',
    marginBottom: -3.5, // Sits exactly on the top edge of the active bar
    zIndex: 2,
  },
  barTrack: {
    width: '100%',
    height: 80,
    justifyContent: 'flex-end',
  },
  barFill: {
    width: '100%',
    borderRadius: 4,
  },
  activeBarGlow: {
    ...Platform.select({
      ios: {
        shadowColor: '#BE3144',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.75,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  barDayLabel: {
    color: '#60646E',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 8,
  },
  barDayLabelActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },

  // --- 4. RECENT PR CARD ---
  prCard: {
    backgroundColor: '#0C0C0E',
    borderRadius: 16,
    borderCurve: 'continuous',
    padding: 14,
    borderWidth: 1,
    borderColor: '#1D1D22',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  prLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    paddingRight: 8,
  },
  trophyIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderCurve: 'continuous',
    backgroundColor: 'rgba(190, 49, 68, 0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  prTextGroup: {
    flex: 1,
  },
  prBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  prBadgeText: {
    color: '#BE3144',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  prTimeText: {
    color: '#71717A',
    fontSize: 10,
    fontWeight: '500',
  },
  prTitleText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
  },
  prDeltaBadge: {
    backgroundColor: 'rgba(190, 49, 68, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: 'rgba(190, 49, 68, 0.28)',
  },
  prDeltaText: {
    color: '#E63950',
    fontSize: 11,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
});
