import React, { useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, {
  Circle,
  Defs,
  Line,
  LinearGradient,
  Path,
  Stop,
} from 'react-native-svg';
import * as Haptics from '@/utils/haptics';

export interface LiftProgressData {
  id: 'squat' | 'bench' | 'deadlift';
  name: string;
  currentPr: number;
  currentPrDate: string;
  bestReps: number;
  sessions: {
    date: string;
    displayDate: string;
    weight: number;
    reps: number;
  }[];
}

export const LIFT_PROGRESS_MOCK: Record<string, LiftProgressData> = {
  bench: {
    id: 'bench',
    name: 'Barbell Bench Press',
    currentPr: 80,
    currentPrDate: 'Yesterday',
    bestReps: 3,
    sessions: [
      { date: '2026-09-04', displayDate: 'Sep 04', weight: 67.5, reps: 5 },
      { date: '2026-09-18', displayDate: 'Sep 18', weight: 70.0, reps: 4 },
      { date: '2026-10-02', displayDate: 'Oct 02', weight: 72.5, reps: 5 },
      { date: '2026-10-16', displayDate: 'Oct 16', weight: 75.0, reps: 4 },
      { date: '2026-10-23', displayDate: 'Oct 23', weight: 77.5, reps: 3 },
      { date: '2026-10-28', displayDate: 'Oct 28', weight: 80.0, reps: 3 },
    ],
  },
  squat: {
    id: 'squat',
    name: 'Barbell Back Squat',
    currentPr: 120,
    currentPrDate: 'Oct 12',
    bestReps: 5,
    sessions: [
      { date: '2026-08-15', displayDate: 'Aug 15', weight: 100.0, reps: 5 },
      { date: '2026-08-29', displayDate: 'Aug 29', weight: 105.0, reps: 5 },
      { date: '2026-09-12', displayDate: 'Sep 12', weight: 110.0, reps: 4 },
      { date: '2026-09-26', displayDate: 'Sep 26', weight: 112.5, reps: 5 },
      { date: '2026-10-05', displayDate: 'Oct 05', weight: 117.5, reps: 3 },
      { date: '2026-10-12', displayDate: 'Oct 12', weight: 120.0, reps: 5 },
    ],
  },
  deadlift: {
    id: 'deadlift',
    name: 'Conventional Deadlift',
    currentPr: 150,
    currentPrDate: 'Sep 28',
    bestReps: 4,
    sessions: [
      { date: '2026-07-20', displayDate: 'Jul 20', weight: 125.0, reps: 5 },
      { date: '2026-08-10', displayDate: 'Aug 10', weight: 130.0, reps: 5 },
      { date: '2026-08-25', displayDate: 'Aug 25', weight: 135.0, reps: 4 },
      { date: '2026-09-08', displayDate: 'Sep 08', weight: 140.0, reps: 5 },
      { date: '2026-09-20', displayDate: 'Sep 20', weight: 145.0, reps: 3 },
      { date: '2026-09-28', displayDate: 'Sep 28', weight: 150.0, reps: 4 },
    ],
  },
};

interface ExerciseProgressModalProps {
  visible: boolean;
  liftKey: 'squat' | 'bench' | 'deadlift' | null;
  onClose: () => void;
}

export function ExerciseProgressModal({
  visible,
  liftKey,
  onClose,
}: ExerciseProgressModalProps) {
  const liftData = liftKey ? LIFT_PROGRESS_MOCK[liftKey] : null;
  const sessions = liftData?.sessions ?? [];
  const [selectedIdx, setSelectedIdx] = useState<number>(sessions.length - 1);

  if (!visible || !liftData) return null;

  const currentSelection = sessions[selectedIdx] ?? sessions[sessions.length - 1];
  const startWeight = sessions[0]?.weight ?? liftData.currentPr;
  const totalGain = (liftData.currentPr - startWeight).toFixed(1);
  const percentageGain = (((liftData.currentPr - startWeight) / startWeight) * 100).toFixed(1);

  // Epley Estimated 1RM Formula: Weight * (1 + Reps / 30)
  const est1RM = Math.round(currentSelection.weight * (1 + currentSelection.reps / 30) * 10) / 10;

  // Chart Geometry
  const chartWidth = 310;
  const chartHeight = 150;
  const padLeft = 16;
  const padRight = 16;
  const padTop = 20;
  const padBottom = 26;

  const weights = sessions.map((s) => s.weight);
  const minW = Math.min(...weights) - 2.5;
  const maxW = Math.max(...weights) + 2.5;
  const range = maxW - minW || 1;

  const points = sessions.map((s, idx) => {
    const x = padLeft + (idx / (sessions.length - 1)) * (chartWidth - padLeft - padRight);
    const y = padTop + (1 - (s.weight - minW) / range) * (chartHeight - padTop - padBottom);
    return { x, y, ...s, idx };
  });

  const linePath = points.reduce((acc, pt, idx) => {
    return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, '');

  const firstPt = points[0];
  const lastPt = points[points.length - 1];
  const baselineY = chartHeight - padBottom;
  const areaPath = `${linePath} L ${lastPt.x} ${baselineY} L ${firstPt.x} ${baselineY} Z`;

  const handleSelectPoint = (idx: number) => {
    Haptics.selectionAsync();
    setSelectedIdx(idx);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>{liftData.name}</Text>
              <Text style={styles.subtitle}>Progression & Estimated 1RM</Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              activeOpacity={0.7}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              style={styles.closeBtn}>
              <Ionicons name="close" size={20} color="#A1A1AA" />
            </TouchableOpacity>
          </View>

          {/* Quick Metrics Bar */}
          <View style={styles.metricStatsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>ALL-TIME PR</Text>
              <View style={styles.statValRow}>
                <Text style={styles.statValWhite}>{liftData.currentPr}</Text>
                <Text style={styles.statValUnit}>kg</Text>
              </View>
              <Text style={styles.statSub}>{liftData.currentPrDate}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.statBox}>
              <Text style={styles.statLabel}>EST. 1RM (EPLEY)</Text>
              <View style={styles.statValRow}>
                <Text style={styles.statValRed}>{est1RM}</Text>
                <Text style={styles.statValUnit}>kg</Text>
              </View>
              <Text style={styles.statSub}>
                {currentSelection.weight}kg × {currentSelection.reps} reps
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.statBox}>
              <Text style={styles.statLabel}>NET GAIN</Text>
              <View style={styles.statValRow}>
                <Text style={styles.statValGreen}>+{totalGain}</Text>
                <Text style={styles.statValUnit}>kg</Text>
              </View>
              <Text style={styles.statSub}>+{percentageGain}%</Text>
            </View>
          </View>

          {/* SVG Progression Curve */}
          <View style={styles.chartWrapper}>
            <Svg width={chartWidth} height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
              <Defs>
                <LinearGradient id="prGrad" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0%" stopColor="#BE3144" stopOpacity="0.35" />
                  <Stop offset="100%" stopColor="#BE3144" stopOpacity="0.0" />
                </LinearGradient>
              </Defs>

              {/* Horizontal Gridlines */}
              <Line
                x1={padLeft}
                y1={padTop}
                x2={chartWidth - padRight}
                y2={padTop}
                stroke="#1F1F24"
                strokeDasharray="4 4"
              />
              <Line
                x1={padLeft}
                y1={baselineY}
                x2={chartWidth - padRight}
                y2={baselineY}
                stroke="#27272A"
              />

              {/* Gradient Area Fill */}
              <Path d={areaPath} fill="url(#prGrad)" />

              {/* Trend Curve */}
              <Path
                d={linePath}
                stroke="#BE3144"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />

              {/* Interactive Dots */}
              {points.map((pt, idx) => {
                const isSelected = selectedIdx === idx;
                return (
                  <Circle
                    key={idx}
                    cx={pt.x}
                    cy={pt.y}
                    r={isSelected ? 6 : 4}
                    fill={isSelected ? '#FFFFFF' : '#BE3144'}
                    stroke={isSelected ? '#BE3144' : '#141416'}
                    strokeWidth={isSelected ? 3 : 1.5}
                  />
                );
              })}
            </Svg>

            {/* Tap Targets over points */}
            <View style={[StyleSheet.absoluteFill, styles.tapOverlay]}>
              {points.map((pt, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => handleSelectPoint(idx)}
                  activeOpacity={0.7}
                  style={[
                    styles.tapTarget,
                    {
                      left: pt.x - 20,
                      top: pt.y - 20,
                    },
                  ]}
                />
              ))}
            </View>
          </View>

          {/* Interactive Date Indicator Strip */}
          <View style={styles.datesRow}>
            {sessions.map((s, idx) => {
              const isSelected = selectedIdx === idx;
              return (
                <TouchableOpacity
                  key={idx}
                  onPress={() => handleSelectPoint(idx)}
                  activeOpacity={0.7}
                  style={[styles.datePill, isSelected && styles.datePillActive]}>
                  <Text style={[styles.dateText, isSelected && styles.dateTextActive]}>
                    {s.displayDate}
                  </Text>
                  <Text style={[styles.weightText, isSelected && styles.weightTextActive]}>
                    {s.weight}k
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Coach Insight Footnote */}
          <View style={styles.footnoteRow}>
            <Ionicons name="trending-up" size={14} color="#BE3144" />
            <Text style={styles.footnoteText}>
              Progressive overload confirmed: load increased across last 6 sessions.
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.78)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#0C0C0E',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#24242A',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  subtitle: {
    color: '#71717A',
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#18181C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#121216',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#1D1D22',
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: 28,
    backgroundColor: '#24242A',
  },
  statLabel: {
    color: '#71717A',
    fontSize: 8.5,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  statValRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  statValWhite: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
  },
  statValRed: {
    color: '#BE3144',
    fontSize: 16,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
  },
  statValGreen: {
    color: '#10B981',
    fontSize: 16,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
  },
  statValUnit: {
    color: '#71717A',
    fontSize: 10,
    fontWeight: '600',
  },
  statSub: {
    color: '#A1A1AA',
    fontSize: 9.5,
    fontWeight: '500',
    marginTop: 1,
  },
  chartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  tapOverlay: {
    position: 'absolute',
  },
  tapTarget: {
    position: 'absolute',
    width: 40,
    height: 40,
  },
  datesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 4,
    marginBottom: 16,
  },
  datePill: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#141418',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  datePillActive: {
    backgroundColor: '#261418',
    borderColor: '#BE3144',
  },
  dateText: {
    color: '#71717A',
    fontSize: 9,
    fontWeight: '600',
  },
  dateTextActive: {
    color: '#FFFFFF',
  },
  weightText: {
    color: '#A1A1AA',
    fontSize: 10,
    fontWeight: '800',
    marginTop: 2,
  },
  weightTextActive: {
    color: '#BE3144',
  },
  footnoteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#161418',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#261820',
  },
  footnoteText: {
    flex: 1,
    color: '#A1A1AA',
    fontSize: 10.5,
    fontWeight: '500',
    lineHeight: 14,
  },
});
