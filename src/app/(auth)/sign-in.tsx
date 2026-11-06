import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DividerWithText } from '@/components/ui/divider-with-text';
import { SocialAuthButtons } from '@/components/ui/social-auth-buttons';

export default function SignInScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('athlete@gymnix.fit');
  const [password, setPassword] = useState('IronOverload2024!');
  const [loading, setLoading] = useState(false);

  const handleSignIn = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Navigate to Home tab
      router.replace('/(tabs)/home');
    }, 500);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000000' }} className="flex-1 bg-black">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
        className="flex-1">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingVertical: 24 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          className="px-6 py-6">
          
          {/* Header Section */}
          <View className="pt-6 pb-8">
            <Text className="text-white text-3xl font-bold tracking-tight">
              Welcome Back
            </Text>
            <Text className="text-[#71717A] text-base mt-2 leading-relaxed">
              Sign in to sync your progression, rest intervals, and lifetime PRs.
            </Text>
          </View>

          {/* Form Section */}
          <View className="gap-5">
            <Input
              label="EMAIL ADDRESS"
              value={email}
              onChangeText={setEmail}
              placeholder="athlete@gymnix.fit"
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon={
                <Ionicons name="mail-outline" size={20} color="#71717A" />
              }
            />

            <View className="gap-1.5">
              <View className="flex-row items-center justify-between">
                <Text className="text-[#71717A] text-xs font-semibold uppercase tracking-wider">
                  PASSWORD
                </Text>
                <TouchableOpacity activeOpacity={0.7}>
                  <Text className="text-[#BE3144] text-xs font-medium">
                    Forgot Password?
                  </Text>
                </TouchableOpacity>
              </View>

              <Input
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••••••"
                isPassword
                leftIcon={
                  <Ionicons name="lock-closed-outline" size={20} color="#71717A" />
                }
              />
            </View>

            <Button
              title="Sign In"
              onPress={handleSignIn}
              loading={loading}
              className="mt-2"
              size="lg"
            />
          </View>

          {/* Social Auth Section */}
          <DividerWithText text="OR CONTINUE WITH" />
          <SocialAuthButtons />

          {/* Spacer */}
          <View className="flex-1 min-h-[40px]" />

          {/* Footer Section */}
          <View className="flex-row items-center justify-center py-4">
            <Text className="text-[#71717A] text-sm">
              New to the platform?{' '}
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/(auth)/sign-up')}
              activeOpacity={0.7}>
              <Text className="text-[#BE3144] font-bold text-sm">
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
