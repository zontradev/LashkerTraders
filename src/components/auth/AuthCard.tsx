import React, { useState } from 'react';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Send,
  Sparkles,
} from 'lucide-react';
import { useAuth, evaluatePasswordStrength } from '@/lib/context/auth-context';
import { PasswordStrengthMeter } from './PasswordStrengthMeter';
import { BabyLogo } from '@/components/common/BabyLogo';

export function GoogleIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

interface AuthCardProps {
  onSuccess?: () => void;
  defaultTab?: 'signin' | 'signup';
}

export function AuthCard({ onSuccess, defaultTab = 'signin' }: AuthCardProps) {
  const {
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    resendVerificationEmail,
    resetPassword,
  } = useAuth();

  const [tab, setTab] = useState<'signin' | 'signup' | 'forgot' | 'verify_pending'>(defaultTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Status & Feedback
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [pendingEmail, setPendingEmail] = useState('');
  const [resendCooldown, setResendCooldown] = useState(false);

  // Evaluate password strength
  const strength = evaluatePasswordStrength(password);

  // 1. Google OAuth
  const handleGoogleLogin = async () => {
    setErrorMsg(null);
    setLoading(true);
    const res = await signInWithGoogle();
    if (!res.success) {
      setErrorMsg(res.error || 'Google login failed.');
      setLoading(false);
    }
  };

  // 2. Email Sign In
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email.trim() || !password) {
      setErrorMsg('Please enter both your email and password.');
      return;
    }

    setLoading(true);
    const res = await signInWithEmail(email, password);
    setLoading(false);

    if (!res.success) {
      if (res.requiresEmailVerification) {
        setPendingEmail(email.trim());
        setTab('verify_pending');
      } else {
        setErrorMsg(res.error || 'Sign in failed.');
      }
      return;
    }

    if (res.requiresEmailVerification) {
      setPendingEmail(email.trim());
      setTab('verify_pending');
      return;
    }

    if (onSuccess) {
      onSuccess();
    }
  };

  // 3. Email Sign Up
  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    if (!email.trim()) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    // Security requirement: 8 characters minimum
    if (!strength.hasMinLength) {
      setErrorMsg('Password must be at least 8 characters long for account security.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify your password confirmation.');
      return;
    }

    setLoading(true);
    const res = await signUpWithEmail(email, password, fullName, phone);
    setLoading(false);

    if (!res.success) {
      setErrorMsg(res.error || 'Account registration failed.');
      return;
    }

    // Registration succeeded: User requires email verification
    setPendingEmail(email.trim());
    setTab('verify_pending');
  };

  // 4. Resend Verification Link
  const handleResendVerification = async () => {
    if (!pendingEmail) return;
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const res = await resendVerificationEmail(pendingEmail);
    setLoading(false);

    if (res.success) {
      setSuccessMsg(`Verification email resent to ${pendingEmail}! Please check your inbox.`);
      setResendCooldown(true);
      setTimeout(() => setResendCooldown(false), 30000); // 30s cooldown
    } else {
      setErrorMsg(res.error || 'Failed to resend verification email.');
    }
  };

  // 5. Forgot Password
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg('Please enter your email to receive a password reset link.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const res = await resetPassword(email);
    setLoading(false);

    if (res.success) {
      setSuccessMsg(`Password reset link sent to ${email.trim()}! Please check your inbox.`);
    } else {
      setErrorMsg(res.error || 'Failed to send password reset email.');
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden max-w-md w-full mx-auto animate-in fade-in zoom-in-95 duration-200">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#eef8f2] to-[#e0f4ea] p-6 text-center border-b border-emerald-100/80">
        <div className="flex justify-center mb-2">
          <BabyLogo size="md" showTagline={false} />
        </div>
        <p className="text-xs text-slate-600 font-medium">
          Official Customer & Wholesale Account Portal
        </p>
      </div>

      <div className="p-6 sm:p-8 space-y-5">
        {/* Verification Pending Screen */}
        {tab === 'verify_pending' ? (
          <div className="text-center space-y-4 py-2">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-[#00b050] flex items-center justify-center mx-auto shadow-sm">
              <Mail className="w-8 h-8 animate-bounce" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                Verify Your Email Address
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
                We sent a secure verification link to:
              </p>
              <p className="text-sm font-bold text-slate-900 font-mono bg-slate-50 py-1 px-3 rounded-lg border border-slate-200 inline-block">
                {pendingEmail || email}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-left text-xs text-amber-900 space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                <span>Verification is required:</span>
              </p>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Click the confirmation link inside your email to activate your account and access orders, wishlist, and wholesale pricing.
              </p>
            </div>

            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center gap-2 text-left">
                <CheckCircle2 className="w-4 h-4 text-[#00b050] shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 font-semibold flex items-center gap-2 text-left">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={handleResendVerification}
                disabled={loading || resendCooldown}
                className="w-full py-2.5 px-4 rounded-xl bg-[#00b050] hover:bg-[#009643] text-white font-bold text-xs transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>{resendCooldown ? 'Resent! Check Inbox (Wait 30s)' : 'Resend Verification Email'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setTab('signin');
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className="w-full py-2 px-4 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-xs font-semibold transition-colors cursor-pointer"
              >
                Back to Sign In
              </button>
            </div>
          </div>
        ) : tab === 'forgot' ? (
          /* Forgot Password Screen */
          <div className="space-y-4">
            <div className="space-y-1 text-center">
              <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                Reset Your Password
              </h3>
              <p className="text-xs text-slate-500">
                Enter your verified email to receive a password reset link.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00b050] shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleForgotPassword} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Account Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-9 pr-3 text-xs text-slate-900 focus:bg-white focus:border-[#00b050] outline-hidden"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-[#00b050] hover:bg-[#009643] text-white font-bold text-xs transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>Send Password Reset Link</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setTab('signin');
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className="w-full py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
              >
                Back to Sign In
              </button>
            </form>
          </div>
        ) : (
          /* Sign In & Sign Up Views */
          <>
            {/* Primary Google Login Button (Auto-Verified) */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-2xl border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm flex items-center justify-center gap-3 transition-all shadow-xs cursor-pointer disabled:opacity-60 group"
              >
                <GoogleIcon className="w-4 h-4" />
                <span>Continue with Google</span>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full ml-1">
                  Auto-Verify
                </span>
              </button>
              <p className="text-[10px] text-center text-slate-400">
                ⚡ Instant access — No email verification waiting needed
              </p>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 text-xs text-slate-400 my-2">
              <div className="flex-1 h-px bg-slate-200" />
              <span>Or with email</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            {/* Tabs: Sign In vs Sign Up */}
            <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl border border-slate-200">
              <button
                type="button"
                onClick={() => {
                  setTab('signin');
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  tab === 'signin'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setTab('signup');
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  tab === 'signup'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Alerts */}
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00b050] shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Form */}
            {tab === 'signin' ? (
              <form onSubmit={handleEmailSignIn} className="space-y-3.5">
                {/* Email */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-9 pr-3 text-xs text-slate-900 focus:bg-white focus:border-[#00b050] outline-hidden"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-700">Password</label>
                    <button
                      type="button"
                      onClick={() => setTab('forgot')}
                      className="text-[11px] font-semibold text-[#00b050] hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-9 pr-10 text-xs text-slate-900 focus:bg-white focus:border-[#00b050] outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-[#00b050] hover:bg-[#009643] text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                  <span>Sign In</span>
                </button>
              </form>
            ) : (
              /* Create Account with 8-char password hardness indicator */
              <form onSubmit={handleEmailSignUp} className="space-y-3">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="ASM Anik"
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-9 pr-3 text-xs text-slate-900 focus:bg-white focus:border-[#00b050] outline-hidden"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Email Address (Requires Verification)</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-9 pr-3 text-xs text-slate-900 focus:bg-white focus:border-[#00b050] outline-hidden"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Phone Number (Optional)</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="01711223344"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-9 pr-3 text-xs text-slate-900 focus:bg-white focus:border-[#00b050] outline-hidden font-mono"
                    />
                  </div>
                </div>

                {/* Password & 8-Char Hardness Indicator */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Create Password (8+ characters)</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 8 characters..."
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-9 pr-10 text-xs text-slate-900 focus:bg-white focus:border-[#00b050] outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Password Hardness Indicator */}
                  <PasswordStrengthMeter password={password} showRules={true} />
                </div>

                {/* Confirm Password */}
                <div className="space-y-1 pt-1">
                  <label className="text-xs font-semibold text-slate-700">Confirm Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat password..."
                      required
                      className={`w-full bg-slate-50 border rounded-xl py-2.5 pl-9 pr-3 text-xs text-slate-900 focus:bg-white outline-hidden ${
                        confirmPassword && confirmPassword !== password
                          ? 'border-rose-400'
                          : 'border-slate-200 focus:border-[#00b050]'
                      }`}
                    />
                  </div>
                  {confirmPassword && confirmPassword !== password && (
                    <p className="text-[11px] text-rose-500 font-medium">Passwords do not match</p>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading || !strength.hasMinLength}
                    className="w-full py-3 rounded-xl bg-[#00b050] hover:bg-[#009643] text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    <span>Create Account & Send Verification</span>
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}
