import React, { useState } from 'react';
import {
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightAction?: React.ReactNode;
  isPassword?: boolean;
}

export function Input({
  label,
  error,
  leftIcon,
  rightAction,
  isPassword = false,
  className = '',
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className="w-full gap-1.5">
      {label && (
        <Text className="text-[#71717A] text-xs font-semibold uppercase tracking-wider">
          {label}
        </Text>
      )}

      <View
        className={`flex-row items-center w-full bg-[#0A0A0A] rounded-xl px-4 py-3 border ${
          error
            ? 'border-red-500'
            : isFocused
            ? 'border-[#BE3144]'
            : 'border-[#27272A]'
        }`}>
        {leftIcon && <View className="mr-3">{leftIcon}</View>}

        <TextInput
          className={`flex-1 text-white text-base py-0.5 ${className}`}
          placeholderTextColor="#52525B"
          secureTextEntry={isPassword && !showPassword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          selectionColor="#BE3144"
          {...props}
        />

        {isPassword ? (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            className="p-1"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons
              name={showPassword ? 'eye-outline' : 'eye-off-outline'}
              size={20}
              color="#71717A"
            />
          </TouchableOpacity>
        ) : (
          rightAction
        )}
      </View>

      {error && <Text className="text-red-400 text-xs mt-0.5">{error}</Text>}
    </View>
  );
}
