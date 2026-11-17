import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Button({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  disabled,
  style,
  ...props
}: ButtonProps) {
  const height = size === 'sm' ? 40 : size === 'lg' ? 54 : 48;
  const borderRadius = size === 'sm' ? 10 : 14;
  const fontSize = size === 'sm' ? 13 : size === 'lg' ? 15.5 : 14.5;

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        activeOpacity={0.86}
        disabled={disabled || loading}
        style={[
          styles.baseContainer,
          { height, borderRadius },
          disabled ? styles.disabled : null,
          style,
        ]}
        {...props}>
        <LinearGradient
          colors={['#E63950', '#BE3144', '#9E2031']}
          locations={[0, 0.55, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.gradientFill, { borderRadius }]}>
          {loading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <View style={styles.contentRow}>
              {leftIcon}
              <Text style={[styles.primaryText, { fontSize }]}>{title}</Text>
              {rightIcon}
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled || loading}
      style={[
        styles.baseContainer,
        styles.nonPrimaryBase,
        { height, borderRadius },
        variant === 'secondary' ? styles.secondaryVariant : null,
        variant === 'outline' ? styles.outlineVariant : null,
        variant === 'ghost' ? styles.ghostVariant : null,
        disabled ? styles.disabled : null,
        style,
      ]}
      {...props}>
      {loading ? (
        <ActivityIndicator color="#FFFFFF" size="small" />
      ) : (
        <View style={styles.contentRow}>
          {leftIcon}
          <Text
            style={[
              styles.primaryText,
              { fontSize },
              variant === 'outline' ? styles.outlineText : null,
              variant === 'ghost' ? styles.ghostText : null,
            ]}>
            {title}
          </Text>
          {rightIcon}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  baseContainer: {
    width: '100%',
    borderCurve: 'continuous',
    overflow: 'hidden',
  },
  gradientFill: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.14)',
  },
  nonPrimaryBase: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  secondaryVariant: {
    backgroundColor: '#121216',
    borderWidth: 1,
    borderColor: '#25252C',
  },
  outlineVariant: {
    backgroundColor: 'rgba(190, 49, 68, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(190, 49, 68, 0.45)',
  },
  ghostVariant: {
    backgroundColor: 'transparent',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryText: {
    color: '#FFFFFF',
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  outlineText: {
    color: '#E63950',
  },
  ghostText: {
    color: '#8E8E93',
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.45,
  },
});
