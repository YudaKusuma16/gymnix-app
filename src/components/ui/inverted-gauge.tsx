import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

const AnimatedPath = Animated.createAnimatedComponent(Path);

export interface SemiGaugeProps {
  /** The value to display inside the gauge (e.g. "2,450" or "74.5") */
  value: string | number;
  /** Unit to display beside the value (e.g. "kcal" or "kg") */
  unit?: string;
  /** Progress percentage between 0 and 1 (e.g. 0.74 for 74%) */
  progress: number;
  /** Width of the gauge canvas in dp (default: 128) */
  size?: number;
  /** Thickness of the gauge stroke (default: 12) */
  strokeWidth?: number;
  /** Active stroke color (default: "#BE3144") */
  color?: string;
  /** Inactive track background color (default: "#1F2228") */
  trackColor?: string;
  /** Sub-label or percentage shown inside under the value (optional) */
  subtitle?: string;
}

export function SemiGauge({
  value,
  unit,
  progress,
  size = 128,
  strokeWidth = 12,
  color = '#BE3144',
  trackColor = '#1F2228',
  subtitle,
}: SemiGaugeProps) {
  // Clamped progress between 0 and 1
  const clampedProgress = Math.max(0, Math.min(1, progress));

  // Geometry calculations for a normal semi-circle arch (speedometer dome):
  // Starts at bottom-left (x1, y1), curves UP through top apex, ends at bottom-right (x2, y2).
  const padding = strokeWidth / 2 + 4;
  const x1 = padding;
  const x2 = size - padding;
  const radius = (x2 - x1) / 2;
  const yTop = strokeWidth / 2 + 3;
  const y1 = yTop + radius;
  const y2 = y1;
  const height = y1 + strokeWidth / 2 + 4;
  const arcLength = Math.PI * radius;

  // Arc path: clockwise sweep (sweep-flag = 1 in SVG) curves UPWARDS (normal dome)
  const arcPath = `M ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2}`;

  // Smooth animation for progress sweep
  const animatedProgress = useSharedValue(0);

  useEffect(() => {
    animatedProgress.value = withTiming(clampedProgress, {
      duration: 900,
      easing: Easing.out(Easing.cubic),
    });
  }, [clampedProgress, animatedProgress]);

  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset = arcLength * (1 - animatedProgress.value);
    return {
      strokeDashoffset,
    };
  });

  return (
    <View style={[styles.wrapper, { width: size, height }]}>
      <Svg width={size} height={height} style={StyleSheet.absoluteFill}>
        {/* Background Inactive Track */}
        <Path
          d={arcPath}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
        />

        {/* Active Foreground Progress Arc */}
        <AnimatedPath
          d={arcPath}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={arcLength}
          animatedProps={animatedProps}
        />
      </Svg>

      {/* Value & Unit positioned with comfortable clearance under the arch */}
      <View style={styles.contentContainer}>
        <Text style={styles.valueText} numberOfLines={1}>
          {value}
        </Text>
        {unit ? <Text style={styles.unitText}>{unit}</Text> : null}
        {subtitle ? <Text style={styles.subtitleText}>{subtitle}</Text> : null}
      </View>
    </View>
  );
}

// Backward-compatible alias
export const InvertedGauge = SemiGauge;
export type InvertedGaugeProps = SemiGaugeProps;

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    position: 'relative',
    alignSelf: 'center',
  },
  contentContainer: {
    position: 'absolute',
    bottom: 2,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueText: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: '800',
    letterSpacing: -0.5,
    fontVariant: ['tabular-nums'],
    textAlign: 'center',
  },
  unitText: {
    color: '#BE3144',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginTop: 1,
    textAlign: 'center',
  },
  subtitleText: {
    color: '#71717A',
    fontSize: 9,
    fontWeight: '600',
    marginTop: 1,
    textAlign: 'center',
  },
});
