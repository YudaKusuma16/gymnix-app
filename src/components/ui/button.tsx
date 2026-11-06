import React from 'react';
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from 'react-native';

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
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return 'bg-[#121212] border border-[#27272A] active:bg-[#1E1E1E]';
      case 'outline':
        return 'bg-transparent border border-[#BE3144] active:bg-[#BE3144]/10';
      case 'ghost':
        return 'bg-transparent active:bg-white/5';
      case 'primary':
      default:
        return 'bg-[#BE3144] active:bg-[#A32837]';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'py-2.5 px-4 rounded-lg';
      case 'lg':
        return 'py-4 px-6 rounded-xl';
      case 'md':
      default:
        return 'py-3.5 px-5 rounded-xl';
    }
  };

  const getTextStyles = () => {
    switch (variant) {
      case 'secondary':
        return 'text-white font-medium text-base';
      case 'outline':
        return 'text-[#BE3144] font-semibold text-base';
      case 'ghost':
        return 'text-[#71717A] font-medium text-base';
      case 'primary':
      default:
        return 'text-white font-bold text-base tracking-wide';
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      disabled={disabled || loading}
      className={`flex-row items-center justify-center ${getVariantStyles()} ${getSizeStyles()} ${
        disabled ? 'opacity-50' : ''
      } ${className}`}
      {...props}>
      {loading ? (
        <ActivityIndicator color="#FFFFFF" size="small" />
      ) : (
        <View className="flex-row items-center justify-center gap-2">
          {leftIcon}
          <Text className={getTextStyles()}>{title}</Text>
          {rightIcon}
        </View>
      )}
    </TouchableOpacity>
  );
}
