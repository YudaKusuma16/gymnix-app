import { useState, useCallback, useMemo, useEffect } from 'react';
import { useRouter } from 'expo-router';
import * as Haptics from '@/utils/haptics';
import { authService, formatAuthError } from '../services/authService';
import { supabase } from '@/lib/supabase';

export function useSignUp() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Auto-navigate when authenticated via Google redirect
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

  const strength = useMemo(() => {
    if (!password) return { text: '', color: '#71717A', level: 0 };
    if (password.length < 6) return { text: 'Weak', color: '#EF4444', level: 1 };
    if (password.length < 10) return { text: 'Medium', color: '#F59E0B', level: 2 };
    return { text: 'Strong', color: '#10B981', level: 4 };
  }, [password]);

  const handleSignUp = useCallback(async () => {
    if (loading || googleLoading) return;
    setErrorMessage(null);

    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || trimmedName.length < 2) {
      setErrorMessage('Harap masukkan nama lengkap Anda.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }

    if (!trimmedEmail || !trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
      setErrorMessage('Harap masukkan format email yang valid.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password minimal 6 karakter.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setLoading(true);

      const data = await authService.signUpWithEmail({
        fullName: trimmedName,
        email: trimmedEmail,
        password,
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // If user session is created immediately (auto-confirm enabled), proceed to onboarding
      if (data.session) {
        router.replace('/(onboarding)/gender');
      } else {
        // If Supabase requires email verification
        router.replace('/(onboarding)/gender');
      }
    } catch (err: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setErrorMessage(formatAuthError(err));
    } finally {
      setLoading(false);
    }
  }, [fullName, email, password, loading, googleLoading, router]);

  const handleGoogleSignUp = useCallback(async () => {
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

  return {
    fullName,
    setFullName,
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
    strength,
    handleSignUp,
    handleGoogleSignUp,
  };
}
