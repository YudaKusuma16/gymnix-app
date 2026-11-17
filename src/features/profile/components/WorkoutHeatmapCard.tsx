import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface HeatmapDay {
  date: string;
  level: 0 | 1 | 2; // 0 = Rest, 1 = Normal workout, 2 = High intensity/PR
}

interface WorkoutHeatmapCardProps {
  currentStreakWeeks?: number;
  totalActiveDays?: number;
  gridWeeksProp?: { date: string; level: 0 | 1 | 2 }[][];
}

const DAYS_OF_WEEK = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export const WorkoutHeatmapCard = React.memo(function WorkoutHeatmapCard({
  currentStreakWeeks = 0,
  totalActiveDays = 0,
  gridWeeksProp,
}: WorkoutHeatmapCardProps) {
  // Generate 12 weeks (84 days) of training data
  const gridWeeks = useMemo(() => {
    if (gridWeeksProp && gridWeeksProp.length > 0) {
      return gridWeeksProp;
    }
    // Default empty 12 weeks (84 rest days)
    return Array.from({ length: 12 }, (_, wIdx) =>
      Array.from({ length: 7 }, (_, dIdx): HeatmapDay => ({
        date: `W${wIdx + 1}-D${dIdx + 1}`,
        level: 0,
      }))
    );
  }, [gridWeeksProp]);

  const getCellColor = (level: 0 | 1 | 2) => {
    switch (level) {
      case 2:
        return '#E63950'; // Bright Crimson / PR
      case 1:
        return '#BE3144'; // Brand Crimson
      case 0:
      default:
        return '#1C1C22'; // Dark Rest Slot
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.cardTitle}>Consistency Heatmap</Text>
          <Text style={styles.cardSubtitle}>Last 12 weeks training adherence</Text>
        </View>

        <View style={styles.streakPill}>
          <Ionicons name="flame" size={12} color="#BE3144" />
          <Text style={styles.streakPillText}>{currentStreakWeeks} Wk Streak</Text>
        </View>
      </View>

      {/* Main Heatmap Card */}
      <View style={styles.heatmapCard}>
        <View style={styles.gridOuterRow}>
          {/* Day of Week Labels */}
          <View style={styles.dayLabelsCol}>
            {DAYS_OF_WEEK.map((day, idx) => (
              <Text
                key={idx}
                style={[
                  styles.dayLabelText,
                  idx % 2 === 0 ? styles.dayLabelVisible : styles.dayLabelMuted,
                ]}>
                {idx % 2 === 0 ? day : ''}
              </Text>
            ))}
          </View>

          {/* 12-Week Grid Columns */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.weeksScrollContent}>
            {gridWeeks.map((week, wIdx) => (
              <View key={wIdx} style={styles.weekCol}>
                {week.map((day, dIdx) => (
                  <View
                    key={dIdx}
                    style={[
                      styles.cell,
                      { backgroundColor: getCellColor(day.level) },
                    ]}
                  />
                ))}
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Footer: Legend & Adherence Count */}
        <View style={styles.footerRow}>
          <View style={styles.legendRow}>
            <Text style={styles.legendText}>Rest</Text>
            <View style={[styles.legendCell, { backgroundColor: '#1C1C22' }]} />
            <View style={[styles.legendCell, { backgroundColor: '#BE3144' }]} />
            <View style={[styles.legendCell, { backgroundColor: '#E63950' }]} />
            <Text style={styles.legendText}>PR / Heavy</Text>
          </View>

          <Text style={styles.activeDaysCount}>
            <Text style={styles.activeDaysBold}>{totalActiveDays}</Text> Active Days
          </Text>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
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
  streakPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4.5,
    backgroundColor: 'rgba(190, 49, 68, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(190, 49, 68, 0.28)',
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  streakPillText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  heatmapCard: {
    backgroundColor: '#000000',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#222226',
    borderCurve: 'continuous',
    padding: 16,
  },
  gridOuterRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dayLabelsCol: {
    marginRight: 8,
    gap: 5,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dayLabelText: {
    fontSize: 9,
    fontWeight: '700',
    height: 15,
    lineHeight: 15,
    width: 10,
    textAlign: 'center',
  },
  dayLabelVisible: {
    color: '#71717A',
  },
  dayLabelMuted: {
    color: 'transparent',
  },
  weeksScrollContent: {
    flexDirection: 'row',
    gap: 5.5,
  },
  weekCol: {
    gap: 5,
  },
  cell: {
    width: 15,
    height: 15,
    borderRadius: 3.5,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#1E1E24',
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendCell: {
    width: 10,
    height: 10,
    borderRadius: 2.5,
  },
  legendText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#71717A',
  },
  activeDaysCount: {
    fontSize: 11,
    color: '#A1A1AA',
    fontWeight: '600',
  },
  activeDaysBold: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
});
