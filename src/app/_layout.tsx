import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { useEffect } from 'react';
import { LogBox, Platform } from 'react-native';
import * as Linking from 'expo-linking';
import { supabase } from '@/lib/supabase';
import { authService } from '@/features/auth/services/authService';
import '../global.css';

// Force native Android/iOS system window background to pitch black (#000000)
SystemUI.setBackgroundColorAsync('#000000').catch(() => { });

// Suppress known upstream warning triggered by NativeWind/react-native-css-interop in React Native 0.88
LogBox.ignoreLogs(['ImageBackground is deprecated and will be removed in a future release.']);

// Prevent splash screen from auto-hiding before asset loading is complete
SplashScreen.preventAutoHideAsync().catch(() => { });

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    ...Ionicons.font,
    ...MaterialCommunityIcons.font,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      // Hide native splash once fonts are ready and React tree is mounted
      SplashScreen.hideAsync().catch(() => { });
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    const handleUrl = async (url: string) => {
      if (!url) return;
      const parsed = Linking.parse(url);
      const code = parsed.queryParams?.code as string | undefined;
      if (code) {
        try {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          if (!error && data?.user) {
            await authService.ensureProfileExists(data.user);
          }
        } catch (e) {
          console.warn('[RootLayout] exchangeCode error:', e);
        }
        return;
      }

      if (url.includes('#')) {
        const hash = url.split('#')[1];
        const params = new URLSearchParams(hash);
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');
        if (accessToken && refreshToken) {
          try {
            const { data, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });
            if (!error && data?.user) {
              await authService.ensureProfileExists(data.user);
            }
          } catch (e) {
            console.warn('[RootLayout] setSession error:', e);
          }
        }
      }
    };

    Linking.getInitialURL().then((url) => {
      if (url) handleUrl(url);
    });

    const sub = Linking.addEventListener('url', ({ url }) => {
      handleUrl(url);
    });

    return () => sub.remove();
  }, []);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  const stackAnimation = Platform.OS === 'ios' ? 'slide_from_right' : 'default';

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#000000' },
          animation: stackAnimation,
        }}>
        <Stack.Screen name="index" options={{ animation: 'fade' }} />
        <Stack.Screen name="(auth)" options={{ animation: stackAnimation }} />
        <Stack.Screen name="(onboarding)" options={{ animation: stackAnimation }} />
        <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
        <Stack.Screen
          name="workout-active"
          options={{
            animation: 'none',
            presentation: 'transparentModal',
            contentStyle: { backgroundColor: 'transparent' },
          }}
        />
        <Stack.Screen name="gym-detail" options={{ animation: stackAnimation }} />
        <Stack.Screen name="settings" options={{ animation: stackAnimation }} />
        <Stack.Screen name="edit-profile" options={{ animation: stackAnimation }} />
        <Stack.Screen name="exercise-list" options={{ animation: stackAnimation }} />
        <Stack.Screen name="exercise-detail" options={{ animation: stackAnimation }} />
      </Stack>
    </>
  );
}
