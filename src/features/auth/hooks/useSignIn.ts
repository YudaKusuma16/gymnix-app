import { useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from '@/utils/haptics';

export function useSignIn() {
  const router = useRouter();
  const [email, setEmail] = useState('athlete@gymnix.fit');
  const [password, setPassword] = useState('IronOverload2024!');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [connectingProvider, setConnectingProvider] = useState<string | null>(null);

  const handleSignIn = () => {
    if (loading) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.replace('/(tabs)/home');
    }, 450);
  };

  const handleSocial = (provider: string) => {
    if (connectingProvider) return;
    Haptics.selectionAsync();
    setConnectingProvider(provider);
    setTimeout(() => {
      setConnectingProvider(null);
      router.replace('/(tabs)/home');
    }, 500);
  };

  const handleForgotPassword = () => {
    Haptics.selectionAsync();
    Alert.alert(
      'Reset Password',
      'Password reset link sent to registered email.',
      [{ text: 'OK' }]
    );
  };

  return {
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
  };
}
