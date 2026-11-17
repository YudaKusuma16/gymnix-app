import { useState, useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from '@/utils/haptics';
import { authService, formatAuthError } from '../services/authService';
import { supabase } from '@/lib/supabase';

export function useSignIn() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Auto-navigate when authenticated via Google redirect or background exchange
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await authService.ensureProfileExists(session.user);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        router.replace('/(tabs)/home');
      }
    });
    return () => subscription.unsubscribe();
  }, [router]);

  const handleSignIn = useCallback(async () => {
    if (loading || googleLoading) return;
    setErrorMessage(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setErrorMessage('Harap masukkan email dan password Anda.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setLoading(true);

      await authService.signInWithEmail({
        email: trimmedEmail,
        password,
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace('/(tabs)/home');
    } catch (err: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setErrorMessage(formatAuthError(err));
    } finally {
      setLoading(false);
    }
  }, [email, password, loading, googleLoading, router]);

  const handleGoogleSignIn = useCallback(async () => {
    if (loading || googleLoading) return;
    setErrorMessage(null);

    try {
      Haptics.selectionAsync();
      setGoogleLoading(true);

      const session = await authService.signInWithGoogle();
      if (session) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        router.replace('/(tabs)/home');
      }
    } catch (err: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setErrorMessage(formatAuthError(err));
    } finally {
      setGoogleLoading(false);
    }
  }, [loading, googleLoading, router]);

  const handleForgotPassword = useCallback(async () => {
    Haptics.selectionAsync();
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      Alert.alert(
        'Reset Password',
        'Masukkan email Anda terlebih dahulu pada kolom email di atas, lalu tekan Lupa Password.',
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(trimmedEmail);
      if (error) throw error;
      Alert.alert(
        'Email Terkirim',
        `Link instruksi reset password telah dikirim ke ${trimmedEmail}.`,
        [{ text: 'OK' }]
      );
    } catch (err: any) {
      Alert.alert('Gagal Mengirim', formatAuthError(err), [{ text: 'OK' }]);
    }
  }, [email]);

  return {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    loading,
    googleLoading,
    errorMessage,
    setErrorMessage,
    handleSignIn,
    handleGoogleSignIn,
    handleForgotPassword,
  };
}
