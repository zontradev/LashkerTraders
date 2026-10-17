import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';
import { getOrCreateCustomerProfile } from '@/lib/services/store-data';

export interface PasswordStrength {
  score: number; // 0 to 4
  label: 'Too Weak' | 'Weak' | 'Fair' | 'Good' | 'Strong';
  color: string;
  hasMinLength: boolean;
  hasLowercase: boolean;
  hasUppercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}

export function evaluatePasswordStrength(password: string): PasswordStrength {
  const hasMinLength = password.length >= 8;
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password);

  let criteriaCount = 0;
  if (hasMinLength) criteriaCount++;
  if (hasLowercase && hasUppercase) criteriaCount++;
  if (hasNumber) criteriaCount++;
  if (hasSpecialChar) criteriaCount++;

  // Enforce: If length is under 8 chars, score cannot exceed 1
  let score = 0;
  if (!hasMinLength) {
    score = password.length > 0 ? 1 : 0;
  } else {
    score = criteriaCount;
  }

  let label: PasswordStrength['label'] = 'Too Weak';
  let color = '#ef4444'; // Red

  if (score === 0) {
    label = 'Too Weak';
    color = '#94a3b8'; // Slate
  } else if (score === 1) {
    label = 'Weak';
    color = '#ef4444'; // Red
  } else if (score === 2) {
    label = 'Fair';
    color = '#f97316'; // Orange
  } else if (score === 3) {
    label = 'Good';
    color = '#eab308'; // Amber/Yellow
  } else if (score >= 4) {
    label = 'Strong';
    color = '#00b050'; // Emerald Green
  }

  return {
    score,
    label,
    color,
    hasMinLength,
    hasLowercase,
    hasUppercase,
    hasNumber,
    hasSpecialChar,
  };
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isEmailVerified: boolean;
  signInWithEmail: (email: string, password: string) => Promise<{ success: boolean; error?: string; requiresEmailVerification?: boolean }>;
  signUpWithEmail: (email: string, password: string, fullName: string, phone?: string) => Promise<{ success: boolean; error?: string; requiresEmailVerification?: boolean }>;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  resendVerificationEmail: (email: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Get initial active session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      if (initialSession?.user) {
        syncProfile(initialSession.user);
      }
      setLoading(false);
    });

    // 2. Listen to real-time auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      if (currentSession?.user) {
        syncProfile(currentSession.user);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Synchronize with local customer profile
  const syncProfile = (authUser: User) => {
    try {
      const phone = authUser.user_metadata?.phone || authUser.phone || '01711223344';
      const name = authUser.user_metadata?.full_name || authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'Customer';
      
      const profile = getOrCreateCustomerProfile(phone, name);
      if (authUser.email) {
        profile.email = authUser.email;
      }
      localStorage.setItem('lashker_user_phone', phone);
      localStorage.setItem('lashker_user_email', authUser.email || '');
    } catch {
      // ignore
    }
  };

  // Google OAuth users are automatically email-verified by Google
  const isEmailVerified = Boolean(
    user?.email_confirmed_at ||
    user?.app_metadata?.provider === 'google' ||
    user?.app_metadata?.providers?.includes('google')
  );

  // Email & Password Sign In
  const signInWithEmail = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        const isNotConfirmed =
          error.message?.toLowerCase().includes('email not confirmed') ||
          error.message?.toLowerCase().includes('not verified');

        return {
          success: false,
          error: isNotConfirmed
            ? 'Email verification required. Please check your inbox or click resend below.'
            : error.message,
          requiresEmailVerification: isNotConfirmed,
        };
      }

      if (data.user && !data.user.email_confirmed_at && data.user.app_metadata?.provider === 'email') {
        return {
          success: true,
          requiresEmailVerification: true,
        };
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to sign in.' };
    }
  };

  // Email & Password Sign Up (Requires verifying email)
  const signUpWithEmail = async (
    email: string,
    password: string,
    fullName: string,
    phone?: string
  ) => {
    try {
      const redirectUrl = typeof window !== 'undefined' ? `${window.location.origin}/account` : '';
      
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            phone: phone ? phone.trim() : '',
          },
          emailRedirectTo: redirectUrl,
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      // Check if email verification is needed
      const needsVerification: boolean = Boolean(!data.session || (data.user && !data.user.email_confirmed_at));

      return {
        success: true,
        requiresEmailVerification: needsVerification,
      };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to register account.' };
    }
  };

  // Google OAuth (Auto-Verified)
  const signInWithGoogle = async () => {
    try {
      const redirectUrl = typeof window !== 'undefined' ? `${window.location.origin}/account` : '';
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to launch Google Login.' };
    }
  };

  // Resend Email Verification
  const resendVerificationEmail = async (email: string) => {
    try {
      const redirectUrl = typeof window !== 'undefined' ? `${window.location.origin}/account` : '';
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email.trim(),
        options: {
          emailRedirectTo: redirectUrl,
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to resend verification email.' };
    }
  };

  // Reset Password
  const resetPassword = async (email: string) => {
    try {
      const redirectUrl = typeof window !== 'undefined' ? `${window.location.origin}/account` : '';
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: redirectUrl,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to send password reset.' };
    }
  };

  // Sign Out
  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    try {
      localStorage.removeItem('lashker_user_phone');
      localStorage.removeItem('lashker_user_email');
    } catch {
      // ignore
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isEmailVerified,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        signOut,
        resendVerificationEmail,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
