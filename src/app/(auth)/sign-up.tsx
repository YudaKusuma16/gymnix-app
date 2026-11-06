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

export default function SignUpScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('Alex Hunter');
  const [email, setEmail] = useState('alex@gymnix.fit');
  const [password, setPassword] = useState('IronOverload2024!');
  const [loading, setLoading] = useState(false);

  const handleSignUp = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Navigate to onboarding flow
      router.push('/(onboarding)/gender');
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
          <View className="pt-6 pb-6">
            <Text className="text-white text-3xl font-bold tracking-tight">
              Create Account
            </Text>
            <Text className="text-[#71717A] text-base mt-2 leading-relaxed">
              Start your progressive overload journey today.
            </Text>
          </View>

          {/* Form Section */}
          <View className="gap-4">
            <Input
              label="FULL NAME"
              value={fullName}
              onChangeText={setFullName}
              placeholder="Alex Hunter"
              leftIcon={
                <Ionicons name="person-outline" size={20} color="#71717A" />
              }
            />

            <Input
              label="EMAIL ADDRESS"
              value={email}
              onChangeText={setEmail}
              placeholder="alex@gymnix.fit"
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon={
                <Ionicons name="mail-outline" size={20} color="#71717A" />
              }
            />

            <View className="gap-1.5">
              <Input
                label="PASSWORD"
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••••••"
                isPassword
                leftIcon={
                  <Ionicons name="lock-closed-outline" size={20} color="#71717A" />
                }
              />

              {/* Password Strength Indicator */}
              <View className="mt-1">
                <View className="flex-row items-center justify-between mb-1.5">
                  <Text className="text-[#71717A] text-xs font-medium">
                    Password Security
                  </Text>
                  <Text className="text-emerald-400 text-xs font-semibold">
                    Strong
                  </Text>
                </View>
                <View className="flex-row gap-1.5">
                  <View className="flex-1 h-1 bg-emerald-500 rounded-full" />
                  <View className="flex-1 h-1 bg-emerald-500 rounded-full" />
                  <View className="flex-1 h-1 bg-emerald-500 rounded-full" />
                  <View className="flex-1 h-1 bg-emerald-500 rounded-full" />
                </View>
              </View>
            </View>

            {/* Terms and Privacy Statement */}
            <Text className="text-[#71717A] text-xs leading-relaxed mt-1">
              By signing up, you agree to Gymnix{' '}
              <Text className="text-white font-medium">Terms</Text> &{' '}
              <Text className="text-white font-medium">Privacy Policy</Text>.
            </Text>

            <Button
              title="Create Account"
              onPress={handleSignUp}
              loading={loading}
              className="mt-2"
              size="lg"
            />
          </View>

          {/* Social Auth Section */}
          <DividerWithText text="OR CONTINUE WITH" />
          <SocialAuthButtons />

          {/* Spacer */}
          <View className="flex-1 min-h-[30px]" />

          {/* Footer Section */}
          <View className="flex-row items-center justify-center py-4">
            <Text className="text-[#71717A] text-sm">
              Already have an account?{' '}
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/(auth)/sign-in')}
              activeOpacity={0.7}>
              <Text className="text-[#BE3144] font-bold text-sm">
                Sign In
              </Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
