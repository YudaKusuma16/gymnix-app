import React from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import LottieView from 'lottie-react-native';

import bicepCurlAnimation from '../../../assets/animations/seated-dumbbell-bicep-curl.json';
import { useSignIn } from '@/features/auth/hooks/useSignIn';

export default function SignInScreen() {
  const router = useRouter();
  const {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    loading,
    connectingProvider,
    handleSignIn,
    handleSocial,
    handleForgotPassword,
  } = useSignIn();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000000' }} className="flex-1 bg-black">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
        className="flex-1">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingVertical: 16 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          
          {/* Header */}
          <View style={{ paddingTop: 10, paddingBottom: 8 }}>
            <Text style={{ fontSize: 26, fontWeight: '800', color: '#FFFFFF', letterSpacing: -0.5 }}>
              Welcome Back
            </Text>
            <Text style={{ color: '#71717A', fontSize: 13, lineHeight: 19, marginTop: 6 }}>
              Sign in to sync your progression, rest intervals, and lifetime PRs.
            </Text>
          </View>

          {/* Seated Dumbbell Bicep Curl Lottie Animation with Asymmetric Static SVG Blob Accent */}
          <View
            style={{
              position: 'relative',
              height: 225,
              alignItems: 'center',
              justifyContent: 'center',
              marginVertical: 4,
              overflow: 'visible',
            }}>
            {/* Asymmetric Static SVG Blob Accent */}
            <View
              style={{
                position: 'absolute',
                width: 275,
                height: 205,
                opacity: 0.6,
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: '#BE3144',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.45,
                shadowRadius: 26,
                elevation: 8,
              }}
              pointerEvents="none">
              <Svg viewBox="0 0 500 380" width="100%" height="100%">
                <Path
                  d="M 220 40 C 320 25, 410 40, 445 105 C 480 170, 465 240, 420 295 C 375 350, 310 345, 230 355 C 150 365, 60 385, 30 315 C 0 245, 25 165, 70 105 C 115 45, 150 50, 220 40 Z"
                  fill="#be3144"
                />
              </Svg>
            </View>

            {/* Lottie Player */}
            <View
              style={{
                position: 'absolute',
                width: 255,
                height: 255,
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2,
              }}
              pointerEvents="none">
              <LottieView
                source={bicepCurlAnimation}
                autoPlay
                loop
                style={{ width: 255, height: 255 }}
              />
            </View>
          </View>

          {/* Form */}
          <View style={{ marginTop: 6 }}>
            {/* Email Field */}
            <View style={{ marginBottom: 18 }}>
              <Text
                style={{
                  color: '#71717A',
                  fontSize: 11,
                  fontWeight: '700',
                  letterSpacing: 0.6,
                  textTransform: 'uppercase',
                  marginBottom: 6,
                }}>
                EMAIL ADDRESS
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: '#0A0A0A',
                  borderWidth: 1,
                  borderColor: '#27272A',
                  borderRadius: 14,
                  height: 50,
                  paddingHorizontal: 14,
                }}>
                <Ionicons name="mail-outline" size={18} color="#71717A" style={{ marginRight: 10 }} />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="athlete@gymnix.fit"
                  placeholderTextColor="#52525B"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={{
                    flex: 1,
                    color: '#FFFFFF',
                    fontSize: 14,
                    paddingVertical: 0,
                  }}
                />
              </View>
            </View>

            {/* Password Field */}
            <View style={{ marginBottom: 18 }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 6,
                }}>
                <Text
                  style={{
                    color: '#71717A',
                    fontSize: 11,
                    fontWeight: '700',
                    letterSpacing: 0.6,
                    textTransform: 'uppercase',
                  }}>
                  PASSWORD
                </Text>
                <TouchableOpacity onPress={handleForgotPassword} activeOpacity={0.7}>
                  <Text
                    style={{
                      color: '#BE3144',
                      fontSize: 11,
                      fontWeight: '600',
                    }}>
                    Forgot Password?
                  </Text>
                </TouchableOpacity>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: '#0A0A0A',
                  borderWidth: 1,
                  borderColor: '#27272A',
                  borderRadius: 14,
                  height: 50,
                  paddingHorizontal: 14,
                }}>
                <Ionicons name="lock-closed-outline" size={18} color="#71717A" style={{ marginRight: 10 }} />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••••••"
                  placeholderTextColor="#52525B"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  style={{
                    flex: 1,
                    color: '#FFFFFF',
                    fontSize: 14,
                    paddingVertical: 0,
                  }}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  activeOpacity={0.7}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={18}
                    color="#71717A"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleSignIn}
              disabled={loading || !!connectingProvider}
              activeOpacity={0.8}
              style={{
                width: '100%',
                height: 50,
                backgroundColor: '#BE3144',
                borderRadius: 14,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                gap: 8,
                marginTop: 10,
                opacity: loading || !!connectingProvider ? 0.8 : 1,
              }}>
              {loading ? (
                <>
                  <ActivityIndicator size="small" color="#FFFFFF" />
                  <Text style={{ color: '#FFFFFF', fontSize: 15, fontWeight: '700' }}>
                    Signing In...
                  </Text>
                </>
              ) : connectingProvider ? (
                <Text style={{ color: '#FFFFFF', fontSize: 15, fontWeight: '700' }}>
                  Connecting with {connectingProvider}...
                </Text>
              ) : (
                <Text style={{ color: '#FFFFFF', fontSize: 15, fontWeight: '700' }}>
                  Sign In
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: 18,
              gap: 12,
            }}>
            <View style={{ flex: 1, height: 1, backgroundColor: '#27272A' }} />
            <Text
              style={{
                color: '#52525B',
                fontSize: 11,
                fontWeight: '700',
                letterSpacing: 0.8,
              }}>
              OR CONTINUE WITH
            </Text>
            <View style={{ flex: 1, height: 1, backgroundColor: '#27272A' }} />
          </View>

          {/* Social Buttons */}
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity
              onPress={() => handleSocial('Apple')}
              activeOpacity={0.8}
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                paddingVertical: 13,
                paddingHorizontal: 16,
                backgroundColor: '#18181B',
                borderWidth: 1,
                borderColor: '#27272A',
                borderRadius: 14,
              }}>
              <Ionicons name="logo-apple" size={18} color="#FFFFFF" />
              <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '600' }}>
                Apple
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleSocial('Google')}
              activeOpacity={0.8}
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                paddingVertical: 13,
                paddingHorizontal: 16,
                backgroundColor: '#18181B',
                borderWidth: 1,
                borderColor: '#27272A',
                borderRadius: 14,
              }}>
              <Ionicons name="logo-google" size={17} color="#EA4335" />
              <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '600' }}>
                Google
              </Text>
            </TouchableOpacity>
          </View>

          {/* Spacer */}
          <View style={{ flex: 1, minHeight: 30 }} />

          {/* Footer */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              paddingTop: 18,
              paddingBottom: 8,
            }}>
            <Text style={{ color: '#71717A', fontSize: 13 }}>
              New to the platform?{' '}
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/(auth)/sign-up')}
              activeOpacity={0.7}>
              <Text style={{ color: '#BE3144', fontWeight: '700', fontSize: 13 }}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
