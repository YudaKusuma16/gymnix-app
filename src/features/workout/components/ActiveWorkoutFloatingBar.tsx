import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from '@/utils/haptics';
import {
  LocalWorkoutSessionRow,
  workoutService,
} from '../services/workoutService';

interface ActiveWorkoutFloatingBarProps {
  bottomOffset: number;
}

function formatElapsed(startedAt: string): string {
  const startMs = new Date(startedAt).getTime();
  const totalSeconds = Number.isNaN(startMs)
    ? 0
    : Math.max(0, Math.floor((Date.now() - startMs) / 1000));

  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, '0');

  if (hrs > 0) {
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
  }
  return `${pad(mins)}:${pad(secs)}`;
}

/**
 * Persistent floating capsule bar shown above the bottom tab bar
 * whenever a workout session is in progress.
 */
export function ActiveWorkoutFloatingBar({
  bottomOffset,
}: ActiveWorkoutFloatingBarProps) {
  const router = useRouter();
  const [activeSession, setActiveSession] =
    useState<LocalWorkoutSessionRow | null>(() =>
      workoutService.getActiveSession()
    );
  const [elapsedText, setElapsedText] = useState<string>(() =>
    activeSession ? formatElapsed(activeSession.started_at) : '00:00'
  );

  useEffect(() => {
    const unsubscribe = workoutService.subscribeActiveSession((session) => {
      setActiveSession(session);
      if (session) {
        setElapsedText(formatElapsed(session.started_at));
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!activeSession) return;
    const interval = setInterval(() => {
      setElapsedText(formatElapsed(activeSession.started_at));
    }, 1000);
    return () => clearInterval(interval);
  }, [activeSession]);

  if (!activeSession) return null;

  const handleResume = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push({
      pathname: '/workout-active',
      params: {
        resume: 'true',
        sessionId: activeSession.id,
        title: activeSession.title || 'Workout Session',
      },
    });
  };

  const handleDeletePress = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert(
      'Delete Active Workout?',
      'Are you sure you want to discard this workout session? Unsaved progress will be removed.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await workoutService.cancelSession(activeSession.id);
          },
        },
      ]
    );
  };

  return (
    <View
      pointerEvents="box-none"
      style={[styles.wrapper, { bottom: bottomOffset }]}>
      <View style={styles.pillContainer}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleResume}
          style={styles.leftContent}
          accessibilityRole="button"
          accessibilityLabel="Resume active workout">
          <View style={styles.liveDotOuter}>
            <View style={styles.liveDotInner} />
          </View>

          <View style={styles.textCol}>
            <Text style={styles.timerText}>{elapsedText}</Text>
            <Text style={styles.workoutNameText} numberOfLines={1}>
              {activeSession.title || 'Active Workout'}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.75}
          onPress={handleDeletePress}
          style={styles.trashButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityRole="button"
          accessibilityLabel="Delete active workout">
          <Ionicons name="trash-outline" size={18} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 50,
  },
  pillContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(18, 18, 22, 0.96)',
    borderWidth: 1,
    borderColor: 'rgba(190, 49, 68, 0.45)',
    borderRadius: 9999,
    paddingVertical: 10,
    paddingLeft: 16,
    paddingRight: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 12,
  },
  leftContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingRight: 10,
  },
  liveDotOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(190, 49, 68, 0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  liveDotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#BE3144',
  },
  textCol: {
    flex: 1,
  },
  timerText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
    letterSpacing: 0.3,
  },
  workoutNameText: {
    color: '#A1A1AA',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 1,
  },
  trashButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(239, 68, 68, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.28)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
