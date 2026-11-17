import { profileService } from '@/features/profile/services/profileService';
import { supabase } from '@/lib/supabase';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { NativeModules, Platform } from 'react-native';
import { AuthCredentials, SignUpCredentials } from '../types/auth.types';

WebBrowser.maybeCompleteAuthSession();

export function formatAuthError(error: any): string {
  if (!error) return 'Terjadi kesalahan. Silakan coba lagi.';
  const msg = error.message || String(error);
  if (msg.includes('Invalid login credentials')) {
    return 'Email atau password salah. Silakan periksa kembali.';
  }
  if (msg.includes('User already registered') || msg.includes('already registered')) {
    return 'Email ini sudah terdaftar. Silakan login.';
  }
  if (msg.includes('Password should be at least 6 characters')) {
    return 'Password minimal 6 karakter.';
  }
  if (msg.includes('Email not confirmed')) {
    return 'Email belum dikonfirmasi. Periksa kotak masuk email Anda.';
  }
  if (msg.includes('Network request failed')) {
    return 'Koneksi internet bermasalah. Periksa jaringan Anda.';
  }
  return msg;
}

export const authService = {
  /**
   * Sign In with Email and Password
   */
  async signInWithEmail({ email, password }: AuthCredentials) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (error) throw error;

    if (data.user) {
      await this.ensureProfileExists(data.user);
    }
    return data;
  },

  /**
   * Sign Up with Email, Password, and Full Name
   */
  async signUpWithEmail({ email, password, fullName }: SignUpCredentials) {
    const trimmedName = fullName.trim();
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          display_name: trimmedName,
          full_name: trimmedName,
        },
      },
    });
    if (error) throw error;

    if (data.user) {
      await this.ensureProfileExists(data.user, trimmedName);
    }
    return data;
  },

  /**
   * Get environment-aware Redirect URL.
   * - In Web: uses current origin (`http://localhost:<port>/auth/callback`).
   * - In Expo Go / Dev: extracts the active Metro IP (e.g. `exp://192.168.1.x:8081/--/auth/callback`)
   *   because Android OS cannot handle custom schemes like `gymnix://` inside Expo Go.
   * - In Standalone APK / Production: uses custom scheme `gymnix://auth/callback`.
   */
  getRedirectUrl(): string {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.location?.origin) {
        return `${window.location.origin}/auth/callback`;
      }
      return 'http://localhost:8081/auth/callback';
    }

    // Try resolving Metro Bundler host from NativeModules or Constants
    let metroHost: string | null = null;
    if (Constants.expoConfig?.hostUri) {
      metroHost = Constants.expoConfig.hostUri;
    } else if (NativeModules.SourceCode?.scriptURL) {
      try {
        const match = NativeModules.SourceCode.scriptURL.match(/https?:\/\/([^/]+)/);
        if (match && match[1]) {
          metroHost = match[1];
        }
      } catch { }
    }

    // If running in Expo Go or in development mode (__DEV__)
    const isExpoGo =
      Boolean(Constants.expoGoConfig) ||
      Constants.appOwnership === 'expo' ||
      Constants.executionEnvironment === ExecutionEnvironment.StoreClient ||
      __DEV__;

    if (isExpoGo && metroHost) {
      const cleanHost = metroHost.replace(/\/.*$/, '');
      const expUrl = `exp://${cleanHost}/--/auth/callback`;
      console.log('[authService] Resolved Expo Go redirect URL:', expUrl);
      return expUrl;
    }

    // Fallback for standalone APK / production builds
    return 'gymnix://auth/callback';
  },

  /**
   * Sign In with Google OAuth via WebBrowser and Deep Linking
   */
  async signInWithGoogle() {
    const redirectUrl = this.getRedirectUrl();
    console.log('[authService] Google OAuth redirectUrl:', redirectUrl);

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        skipBrowserRedirect: true,
      },
    });

    if (error) throw error;
    if (!data?.url) throw new Error('Gagal mendapatkan URL autentikasi Google dari Supabase.');

    console.log('[authService] Opening WebBrowser with URL:', data.url);
    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl, {
      showInRecents: true,
    });
    console.log('[authService] WebBrowser result type:', result.type);

    if (result.type === 'success' && result.url) {
      console.log('[authService] WebBrowser result url:', result.url);
      const parsedUrl = Linking.parse(result.url);

      // 1. Check for PKCE Authorization Code
      const code = parsedUrl.queryParams?.code as string | undefined;
      if (code) {
        try {
          const { data: sessionData, error: sessionError } = await supabase.auth.exchangeCodeForSession(code);
          if (sessionError) throw sessionError;
          if (sessionData.user) {
            await this.ensureProfileExists(sessionData.user);
          }
          return sessionData;
        } catch (exchangeErr) {
          console.warn('[authService] exchangeCode error, checking if session was already set:', exchangeErr);
        }
      }

      // 2. Check for Implicit Grant Tokens (in hash fragment or query params)
      let accessToken = parsedUrl.queryParams?.access_token as string | undefined;
      let refreshToken = parsedUrl.queryParams?.refresh_token as string | undefined;

      if (!accessToken && result.url.includes('#')) {
        const hash = result.url.split('#')[1];
        const params = new URLSearchParams(hash);
        accessToken = params.get('access_token') || undefined;
        refreshToken = params.get('refresh_token') || undefined;
      }

      if (accessToken && refreshToken) {
        try {
          const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (sessionError) throw sessionError;
          if (sessionData.user) {
            await this.ensureProfileExists(sessionData.user);
          }
          return sessionData;
        } catch (setErr) {
          console.warn('[authService] setSession error:', setErr);
        }
      }
    }

    // Fallback: If on Android the browser was dismissed but session was already set via deep link in _layout
    const { data: currentSession } = await supabase.auth.getSession();
    if (currentSession?.session?.user) {
      await this.ensureProfileExists(currentSession.session.user);
      return currentSession.session;
    }

    return null;
  },

  /**
   * Guarantee that public.profiles has a matching record for the user
   */
  async ensureProfileExists(user: any, fallbackName?: string) {
    try {
      const { data: existing } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();

      const displayName =
        fallbackName ||
        user.user_metadata?.display_name ||
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        user.email?.split('@')[0] ||
        '';

      if (displayName && displayName !== 'Athlete' && displayName !== 'User') {
        const firstName = displayName.trim().split(' ')[0];
        profileService.setCachedProfile(
          firstName,
          user.user_metadata?.avatar_url || user.user_metadata?.picture || null
        );
      }

      if (!existing) {
        const initialName = displayName || 'Athlete';
        const rawUsername = (user.email?.split('@')[0] || 'athlete').toLowerCase().replace(/[^a-z0-9_]/g, '');
        const username = `@${rawUsername}_${user.id.slice(0, 4)}`;

        await supabase.from('profiles').insert({
          id: user.id,
          display_name: initialName,
          username: username,
          updated_at: new Date().toISOString(),
        });
      }
    } catch (e) {
      console.warn('[authService] ensureProfileExists error:', e);
    }
  },

  /**
   * Sign out current user
   */
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  /**
   * Get active session
   */
  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  /**
   * Get authenticated user
   */
  async getUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },
};
