import React, { useState, useEffect } from 'react';
import {
  User,
  Package,
  Clock,
  Phone,
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  Building2,
  Store,
  MapPin,
  ExternalLink,
  Plus,
  Heart,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  RefreshCw,
  LogOut,
  X,
  FileText,
  KeyRound,
  Ban,
  HelpCircle,
  BadgePercent,
  Check,
  Mail,
} from 'lucide-react';
import { Link, useRouter } from '@/router';
import { STORE_CONFIG, formatDhakaDate, ORDER_STATUS_LABELS } from '@/lib/constants';
import { useTranslation } from '@/i18n';
import { useAuth } from '@/lib/context/auth-context';
import { AuthCard, GoogleIcon } from '@/components/auth/AuthCard';
import {
  getOrCreateCustomerProfile,
  getOrCreateB2BProfile,
  getB2BStatusForCustomer,
  submitB2BApplication,
  cancelCustomerB2BApplication,
  verifyCustomerB2BAccessCode,
  getCustomerOrders,
  getActiveAccountMode,
  setActiveAccountMode,
  type CustomerProfile,
  type B2BClientProfile,
  type B2BApplicationRecord,
  type B2BMembershipRecord,
  type B2BApplicationStatus,
  type OrderRecord,
} from '@/lib/services/store-data';

const BD_DISTRICTS = [
  'Dhaka', 'Gazipur', 'Narayanganj', 'Chittagong', 'Sylhet', 'Rajshahi',
  'Khulna', 'Barisal', 'Rangpur', 'Mymensingh', 'Cumilla', 'Bogra',
  'Narsingdi', 'Tangail', 'Faridpur', 'Cox\'s Bazar', 'Feni', 'Noakhali',
  'Brahmanbaria', 'Jessore', 'Kushtia', 'Pabna', 'Dinajpur', 'Jamalpur'
];

export function AccountView() {
  const { t, language, formatPrice } = useTranslation();
  const router = useRouter();

  const [phoneInput, setPhoneInput] = useState('');
  const [activePhone, setActivePhone] = useState<string>('');
  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const [b2bProfile, setB2bProfile] = useState<B2BClientProfile | null>(null);
  const [accountMode, setAccountMode] = useState<'retail' | 'b2b'>('retail');
  const [orders, setOrders] = useState<OrderRecord[]>([]);

  // Real-time B2B Status
  const [b2bStatus, setB2bStatus] = useState<{
    membership: B2BMembershipRecord | null;
    application: B2BApplicationRecord | null;
    isB2BGranted: boolean;
    status: B2BApplicationStatus | 'none';
  }>({ membership: null, application: null, isB2BGranted: false, status: 'none' });

  // Address modal state
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddressText, setNewAddressText] = useState('');
  const [newAddressTitle, setNewAddressTitle] = useState('Home');

  // B2B Modal States
  const [showIntroModal, setShowIntroModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [focusAccessCode, setFocusAccessCode] = useState(false);

  // Application Form Fields
  const [appBusinessName, setAppBusinessName] = useState('');
  const [appContactName, setAppContactName] = useState('');
  const [appPhone, setAppPhone] = useState('');
  const [appDistrict, setAppDistrict] = useState('Dhaka');
  const [appTradeLicense, setAppTradeLicense] = useState('');
  const [appAccessCode, setAppAccessCode] = useState('');
  const [appCodeFeedback, setAppCodeFeedback] = useState<{ valid: boolean; policy?: string; label?: string; error?: string } | null>(null);
  const [appSubmitting, setAppSubmitting] = useState(false);
  const [appFeedbackMessage, setAppFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Supabase Auth Integration
  const { user, isEmailVerified, signOut: supabaseSignOut, resendVerificationEmail } = useAuth();
  const [resendingEmail, setResendingEmail] = useState(false);
  const [resendNotice, setResendNotice] = useState<string | null>(null);

  // Initialize from authenticated user or persisted session
  useEffect(() => {
    if (user) {
      const phone = user.user_metadata?.phone || user.phone || '01711223344';
      const storedMode = (localStorage.getItem('lashker_account_mode') as 'retail' | 'b2b') || 'retail';
      handleLoadAccount(phone, storedMode);
    } else {
      try {
        const storedPhone = localStorage.getItem('lashker_user_phone');
        if (storedPhone) {
          const storedMode = (localStorage.getItem('lashker_account_mode') as 'retail' | 'b2b') || 'retail';
          handleLoadAccount(storedPhone, storedMode);
        }
      } catch {
        // ignore
      }
    }
  }, [user]);

  const handleResendEmail = async () => {
    if (!user?.email) return;
    setResendingEmail(true);
    setResendNotice(null);
    const res = await resendVerificationEmail(user.email);
    setResendingEmail(false);
    if (res.success) {
      setResendNotice(`Verification email sent to ${user.email}! Please check your inbox.`);
      setTimeout(() => setResendNotice(null), 8000);
    } else {
      setResendNotice(res.error || 'Failed to send verification email.');
    }
  };

  const handleLoadAccount = (phone: string, mode: 'retail' | 'b2b' = 'retail') => {
    if (!phone.trim()) return;
    const clean = phone.trim();
    setActivePhone(clean);
    setPhoneInput(clean);

    const cus = getOrCreateCustomerProfile(clean);
    const status = getB2BStatusForCustomer(clean);
    const b2b = getOrCreateB2BProfile(clean);
    const orderList = getCustomerOrders(clean);

    setCustomer(cus);
    setB2bStatus(status);
    setB2bProfile(b2b);
    setOrders(orderList);

    // If customer is granted B2B, respect mode, otherwise force retail mode
    const actualMode = status.isB2BGranted ? mode : 'retail';
    setAccountMode(actualMode);
    setActiveAccountMode(actualMode);

    try {
      localStorage.setItem('lashker_user_phone', clean);
      localStorage.setItem('lashker_account_mode', actualMode);
    } catch {
      // storage unavailable
    }
  };

  const handlePhoneLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneInput.trim()) {
      handleLoadAccount(phoneInput.trim(), accountMode);
    }
  };

  const handleSwitchMode = (newMode: 'retail' | 'b2b') => {
    if (newMode === 'b2b' && !b2bStatus.isB2BGranted) {
      setShowIntroModal(true);
      return;
    }
    setAccountMode(newMode);
    setActiveAccountMode(newMode);
    try {
      localStorage.setItem('lashker_account_mode', newMode);
    } catch {
      // ignore
    }
  };

  const handleOpenIntro = (preFocusCode = false) => {
    setFocusAccessCode(preFocusCode);
    setShowIntroModal(true);
  };

  const handleOpenApplyModal = (preFocusCode = false) => {
    setShowIntroModal(false);
    setAppFeedbackMessage(null);
    setAppBusinessName('');
    setAppContactName(customer?.displayName || '');
    setAppPhone(activePhone || '');
    setAppDistrict('Dhaka');
    setAppTradeLicense('');
    setAppAccessCode('');
    setAppCodeFeedback(null);
    setFocusAccessCode(preFocusCode);
    setShowApplyModal(true);
  };

  const handleAccessCodeChange = (code: string) => {
    setAppAccessCode(code);
    if (!code.trim()) {
      setAppCodeFeedback(null);
      return;
    }
    const res = verifyCustomerB2BAccessCode(code.trim());
    if (res.valid) {
      setAppCodeFeedback({
        valid: true,
        policy: res.policy,
        label: res.label,
      });
    } else {
      setAppCodeFeedback({
        valid: false,
        error: res.error || 'Invalid or expired access code.',
      });
    }
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    setAppSubmitting(true);
    setAppFeedbackMessage(null);

    const verifiedEmail = customer?.email || `${activePhone || 'customer'}@lashkertraders.customer`;

    try {
      const res = await submitB2BApplication({
        customerId: customer?.id,
        businessName: appBusinessName,
        contactName: appContactName,
        verifiedEmail,
        phone: appPhone,
        district: appDistrict,
        tradeLicenseNo: appTradeLicense,
        accessCode: appAccessCode,
      });

      if (res.success) {
        setAppFeedbackMessage({
          type: 'success',
          text: res.message,
        });

        // Reload account to pick up granted or pending state
        handleLoadAccount(activePhone, res.status === 'granted' ? 'b2b' : 'retail');

        setTimeout(() => {
          setShowApplyModal(false);
        }, 2200);
      } else {
        setAppFeedbackMessage({
          type: 'error',
          text: res.message || res.error || 'Failed to submit B2B application.',
        });
      }
    } catch (err: any) {
      setAppFeedbackMessage({
        type: 'error',
        text: err.message || 'Network error submitting application.',
      });
    } finally {
      setAppSubmitting(false);
    }
  };

  const handleCancelApplication = async () => {
    if (!b2bStatus.application) return;
    if (!confirm('Are you sure you want to cancel your pending wholesale application?')) return;

    const res = await cancelCustomerB2BApplication(b2bStatus.application.id, activePhone);
    if (res.success) {
      handleLoadAccount(activePhone, 'retail');
    } else {
      alert(res.message);
    }
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer || !newAddressText.trim()) return;

    customer.addresses.push({
      id: `addr-${Date.now()}`,
      title: newAddressTitle,
      recipientName: customer.displayName,
      phone: customer.phone,
      address: newAddressText.trim(),
      zoneId: 'zone-dhaka-inside',
      isDefault: customer.addresses.length === 0,
    });

    setCustomer({ ...customer });
    setNewAddressText('');
    setIsAddingAddress(false);
  };

  const handleSignOut = async () => {
    await supabaseSignOut();
    try {
      localStorage.removeItem('lashker_user_phone');
      localStorage.removeItem('lashker_user_email');
    } catch {
      // ignore
    }
    setActivePhone('');
    setPhoneInput('');
    setCustomer(null);
    setB2bProfile(null);
    setB2bStatus({ membership: null, application: null, isB2BGranted: false, status: 'none' });
    setOrders([]);
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-14 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Sign In to Lashker Traders
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            Manage your orders, saved addresses, baby care wishlist, and apply for exclusive B2B wholesale pricing.
          </p>
        </div>

        <AuthCard onSuccess={() => {}} />

        <div className="text-center pt-4 border-t border-slate-100 max-w-md mx-auto">
          <p className="text-xs text-slate-500">
            Placed a guest order?{' '}
            <Link to="/track-order" className="text-[#00b050] font-bold hover:underline">
              Track your package with your order number →
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 space-y-8">
      {/* Email Verification Required Banner */}
      {!isEmailVerified && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center font-bold shrink-0">
              <Mail className="w-5 h-5 animate-pulse" />
            </div>
            <div className="space-y-0.5">
              <p className="font-extrabold text-sm text-amber-900 flex items-center gap-2">
                <span>Email Verification Required</span>
                <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
                  Action Required
                </span>
              </p>
              <p className="text-xs text-amber-800">
                We sent a confirmation link to <strong className="font-mono">{user.email}</strong>. Please check your inbox and confirm your email.
              </p>
              {resendNotice && (
                <p className="text-xs font-semibold text-emerald-700 pt-1">
                  {resendNotice}
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={handleResendEmail}
            disabled={resendingEmail}
            className="px-4 py-2.5 rounded-xl bg-[#00b050] hover:bg-[#009643] text-white font-bold text-xs shrink-0 transition-colors shadow-xs cursor-pointer disabled:opacity-60 flex items-center gap-1.5"
          >
            {resendingEmail ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Mail className="w-3.5 h-3.5" />}
            <span>Resend Verification Email</span>
          </button>
        </div>
      )}

      {/* Account Mode & Identity Header */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-2xl shadow-md shrink-0 ${
              accountMode === 'b2b'
                ? 'bg-gradient-to-tr from-amber-600 to-amber-400 text-white shadow-amber-600/20'
                : 'bg-gradient-to-tr from-[#00b050] to-emerald-400 text-white shadow-emerald-600/20'
            }`}>
              {accountMode === 'b2b' ? <Store className="w-7 h-7" /> : <User className="w-7 h-7" />}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  {user.user_metadata?.full_name || customer?.displayName || user.email?.split('@')[0]}
                </h1>
                {user.app_metadata?.provider === 'google' ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                    <GoogleIcon className="w-3 h-3" /> Google (Auto-Verified)
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
                    <Mail className="w-3 h-3 text-slate-500" /> Email Auth
                  </span>
                )}
                {isEmailVerified ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-[#00b050]" /> Verified
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 text-amber-600" /> Unverified
                  </span>
                )}
                {customer && (
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold border ${
                    accountMode === 'b2b'
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}>
                    {accountMode === 'b2b' ? (b2bStatus.membership?.id || 'B2B-PARTNER') : customer.publicId}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-2">
                <span>Email: <strong className="text-slate-800 font-mono">{user.email}</strong></span>
                <span className="text-slate-300">•</span>
                <span>Phone: <strong className="text-slate-700 font-mono">{activePhone || 'Not set'}</strong></span>
              </p>
            </div>
          </div>

          {/* Account Mode Switcher (Retail vs B2B Wholesale) */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="bg-slate-100 p-1 rounded-2xl border border-slate-200 flex items-center shadow-inner">
              <button
                type="button"
                onClick={() => handleSwitchMode('retail')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  accountMode === 'retail'
                    ? 'bg-white text-sky-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>{t.account.retailCustomer}</span>
              </button>

              <button
                type="button"
                onClick={() => handleSwitchMode('b2b')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  accountMode === 'b2b'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                <span>{t.account.b2bPartner}</span>
                {!b2bStatus.isB2BGranted && (
                  <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700">Apply</span>
                )}
              </button>
            </div>

            {activePhone && (
              <button
                type="button"
                onClick={handleSignOut}
                className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                title="Sign out / Clear profile"
                aria-label="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Dynamic B2B Lifecycle Status Cards                                */}
        {/* ------------------------------------------------------------------ */}

        {/* 1. Granted B2B Status */}
        {b2bStatus.isB2BGranted && b2bStatus.membership && (
          <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-50 to-amber-100/70 border border-amber-300 text-xs text-amber-950 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold shrink-0 shadow-sm">
                <Store className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-amber-900">
                    {b2bStatus.membership.businessName}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white">
                    Active B2B Partner
                  </span>
                </div>
                <p className="text-[11px] text-amber-800">
                  Assigned Price Group: <strong>{b2bStatus.membership.priceGroupName}</strong> • MOQ: {b2bStatus.membership.moqPacks} packs • Credit: ৳{b2bStatus.membership.creditLimit.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 self-start md:self-auto">
              <Link
                to="/b2b"
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors shadow-xs"
              >
                View Wholesale Rates
              </Link>
            </div>
          </div>
        )}

        {/* 2. Pending Application Status */}
        {b2bStatus.status === 'pending' && b2bStatus.application && (
          <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-200 text-amber-800 flex items-center justify-center font-bold shrink-0">
                <Clock className="w-5 h-5 animate-pulse" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-sm text-amber-950">Application Under Review</h3>
                  <span className="px-2 py-0.2 rounded-full text-[10px] font-mono bg-amber-100 text-amber-800 border border-amber-300">
                    {b2bStatus.application.id}
                  </span>
                </div>
                <p className="text-xs text-amber-800 leading-relaxed">
                  Submitted for <strong>{b2bStatus.application.businessName}</strong> on {formatDhakaDate(b2bStatus.application.createdAt)}. Our B2B operations team will review within 24–48 hours.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCancelApplication}
              className="px-3.5 py-1.5 rounded-xl border border-amber-300 text-amber-900 hover:bg-amber-100 text-xs font-semibold cursor-pointer shrink-0"
            >
              Cancel Application
            </button>
          </div>
        )}

        {/* 3. Rejected Application Status */}
        {b2bStatus.status === 'rejected' && (
          <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-200 text-rose-800 flex items-center justify-center font-bold shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-rose-900">Wholesale Application Not Approved</h3>
                <p className="text-xs text-rose-800 mt-0.5">
                  Reason: {b2bStatus.application?.decisionReason || 'Commercial criteria not satisfied.'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleOpenApplyModal(false)}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs cursor-pointer shrink-0 shadow-xs"
            >
              Apply Again
            </button>
          </div>
        )}

        {/* 4. Cancelled Application Status */}
        {b2bStatus.status === 'cancelled' && (
          <div className="p-5 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-200 text-slate-600 flex items-center justify-center font-bold shrink-0">
                <Ban className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">Application Cancelled</h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Your previous wholesale partnership application was withdrawn.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleOpenApplyModal(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs cursor-pointer shrink-0"
            >
              Apply Again
            </button>
          </div>
        )}

        {/* 5. Restricted B2B Status */}
        {b2bStatus.status === 'restricted' && (
          <div className="p-5 rounded-2xl bg-red-50 border border-red-300 text-xs text-red-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500 text-white flex items-center justify-center font-bold shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-red-900">Account Restricted — Contact Support</h3>
                <p className="text-xs text-red-800 mt-0.5">
                  Wholesale purchasing has been temporarily held for your account. Please reach our distributor manager.
                </p>
              </div>
            </div>

            <a
              href={`https://wa.me/${STORE_CONFIG.whatsappCleanNumber}?text=Hello%20Lashker%20Traders,%20my%20B2B%20account%20shows%20restricted.%20Please%20help.`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Contact Manager</span>
            </a>
          </div>
        )}

        {/* 6. Removed B2B Status */}
        {b2bStatus.status === 'removed' && (
          <div className="p-5 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">Wholesale Access Inactive</h3>
              <p className="text-xs text-slate-500 mt-0.5">Your wholesale membership is no longer active.</p>
            </div>
            <button
              type="button"
              onClick={() => handleOpenApplyModal(false)}
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs cursor-pointer shrink-0"
            >
              Apply Again
            </button>
          </div>
        )}

        {/* 7. Unregistered Customer: "Become Partner" Card */}
        {b2bStatus.status === 'none' && (
          <div className="p-5 rounded-2xl bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200/80 text-xs text-sky-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-sky-600 text-white flex items-center justify-center font-bold shrink-0 shadow-sm">
                <Store className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <h3 className="font-extrabold text-sm text-sky-950">
                  Are you a Pharmacy, Baby Shop, or Retailer?
                </h3>
                <p className="text-xs text-sky-800">
                  Access direct carton wholesale prices and priority distributor fulfillment.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => handleOpenIntro(false)}
                className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Store className="w-3.5 h-3.5" />
                <span>Become Partner</span>
              </button>

              <button
                type="button"
                onClick={() => handleOpenApplyModal(true)}
                className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-sky-300 text-sky-800 font-semibold text-xs transition-all cursor-pointer flex items-center gap-1"
              >
                <KeyRound className="w-3.5 h-3.5 text-sky-600" />
                <span>Access Code</span>
              </button>
            </div>
          </div>
        )}

        {/* Quick Phone Lookup Bar */}
        <form onSubmit={handlePhoneLookup} className="flex flex-col sm:flex-row gap-2 pt-1">
          <input
            type="tel"
            value={phoneInput}
            onChange={(e) => setPhoneInput(e.target.value)}
            placeholder={t.account.enterPhone}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-mono outline-hidden focus:bg-white focus:border-sky-500"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{t.account.verifyLookup}</span>
          </button>
        </form>
      </div>

      {/* Main Account Portal Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Orders & Delivery Tracking */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-sky-600" />
                <h2 className="text-base font-extrabold text-slate-900">
                  {t.account.orderHistory} ({orders.length})
                </h2>
              </div>
              <Link
                to="/track-order"
                className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1"
              >
                <span>Live Tracker</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-10 space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
                  <Package className="w-6 h-6" />
                </div>
                <p className="text-xs text-slate-500">{t.account.noOrders}</p>
                <Link to="/shop" className="btn-primary text-xs">
                  {t.cart.startShopping}
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono font-extrabold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-100">
                            {ord.orderNumber}
                          </span>
                          {ord.items.some(i => i.pricingMode === 'wholesale') && (
                            <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                              Wholesale Order
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">
                          {formatDhakaDate(ord.createdAt)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold capitalize bg-amber-50 text-amber-800 border border-amber-200">
                          {ord.orderStatus}
                        </span>
                        <span className="text-sm font-extrabold text-slate-900">
                          {formatPrice(ord.total)}
                        </span>
                      </div>
                    </div>

                    {/* Items summary */}
                    <div className="space-y-1 text-xs text-slate-700">
                      {ord.items.map((itm) => (
                        <div key={itm.id} className="flex justify-between items-center">
                          <span className="line-clamp-1">
                            {itm.productName} ({itm.size} - {itm.packCount} pcs) × {itm.quantity}
                            {itm.pricingMode === 'wholesale' && (
                              <span className="ml-1.5 text-[10px] font-semibold text-amber-700">(Wholesale)</span>
                            )}
                          </span>
                          <span className="font-semibold text-slate-800 shrink-0">{formatPrice(itm.subtotal)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200/60 text-xs">
                      <span className="text-[11px] text-slate-500 truncate max-w-xs">
                        {ord.deliveryAddress}
                      </span>
                      <Link
                        to={`/track-order?token=${ord.guestTrackingToken}`}
                        className="font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 cursor-pointer"
                      >
                        <span>Track Live Status</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Saved Addresses & Wholesale Support */}
        <div className="lg:col-span-4 space-y-6">
          {/* Saved Addresses */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-sky-600" />
                <h3 className="text-sm font-bold text-slate-900">{t.account.savedAddresses}</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddingAddress(!isAddingAddress)}
                className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-0.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isAddingAddress ? 'Cancel' : t.account.addAddress}</span>
              </button>
            </div>

            {isAddingAddress && (
              <form onSubmit={handleAddAddress} className="space-y-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs animate-fade-in">
                <select
                  value={newAddressTitle}
                  onChange={(e) => setNewAddressTitle(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-semibold"
                >
                  <option value="Home">Home (বাসা)</option>
                  <option value="Office">Office / Shop (অফিস/দোকান)</option>
                  <option value="Pharmacy">Pharmacy (ফার্মেসি)</option>
                </select>
                <textarea
                  required
                  rows={2}
                  value={newAddressText}
                  onChange={(e) => setNewAddressText(e.target.value)}
                  placeholder="House #, Road #, Area, Dhaka"
                  className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs outline-hidden focus:border-sky-500"
                />
                <button
                  type="submit"
                  className="w-full py-1.5 bg-slate-900 text-white rounded-lg font-bold text-xs transition-colors hover:bg-slate-800 cursor-pointer"
                >
                  Save Address
                </button>
              </form>
            )}

            <div className="space-y-2.5 text-xs">
              {customer?.addresses.map((addr) => (
                <div key={addr.id} className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">{addr.title}</span>
                    {addr.isDefault && (
                      <span className="text-[10px] bg-sky-100 text-sky-800 px-1.5 py-0.2 rounded font-semibold">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">{addr.address}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Wholesale Hotline / Priority Support */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 text-white space-y-4 shadow-md">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Priority Help & Orders</span>
            </div>
            <h4 className="font-extrabold text-base leading-snug">
              Need assistance or bulk carton quotes?
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Our Dhaka operations team is available Saturday through Thursday, 9:00 AM to 10:00 PM.
            </p>
            <div className="space-y-2 pt-2 text-xs">
              <a
                href={`https://wa.me/${STORE_CONFIG.whatsappCleanNumber}?text=Hello%20Lashker%20Traders,%20I%20need%20assistance%20with%20my%20account.`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp w-full text-xs justify-center"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp: {STORE_CONFIG.whatsappNumber}</span>
              </a>
              <a
                href={`tel:${STORE_CONFIG.phone}`}
                className="btn-secondary w-full text-xs justify-center bg-white/10 hover:bg-white/20 text-white border-white/20"
              >
                <Phone className="w-4 h-4 text-sky-400" />
                <span>Hotline: {STORE_CONFIG.phone}</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Step 2 — Introductory Modal                                        */}
      {/* ------------------------------------------------------------------ */}
      {showIntroModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-100 relative">
            <button
              type="button"
              onClick={() => setShowIntroModal(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-xs">
                <Store className="w-3.5 h-3.5" />
                <span>B2B Wholesale & Distribution</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                Want to access Lashker Traders B2B Wholesale & Distribution?
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Unlock official distributor terms directly from King Lashker Traders for your commercial establishment.
              </p>
            </div>

            <div className="space-y-3 py-2 text-xs text-slate-700">
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900">Direct carton-pricing:</strong> Save 10%–20% below standard retail MRP directly from the authorized importer.
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900">Priority fulfillment:</strong> Dedicated dispatch for pharmacies, superstores, & baby shops across Dhaka and all 64 districts.
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900">Minimum Order Quantity (MOQ):</strong> Wholesale orders require meeting carton MOQ per variant (standard: 20 packs).
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900">Dedicated Account Manager:</strong> Direct line to distributor leadership and revolving credit limits for verified partners.
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleOpenApplyModal(false)}
                className="w-full sm:flex-1 py-3 px-5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
              >
                <span>Apply for Wholesale Access</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => handleOpenApplyModal(true)}
                className="w-full sm:w-auto py-3 px-5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5 text-amber-700" />
                <span>I Have an Access Code</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Step 3 — Application Form Modal                                   */}
      {/* ------------------------------------------------------------------ */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-100 relative my-8">
            <button
              type="button"
              onClick={() => setShowApplyModal(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Store className="w-5 h-5 text-sky-600" />
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                  Wholesale Partnership Application
                </h2>
              </div>
              <p className="text-xs text-slate-500">
                Please provide your business credentials to request wholesale distribution access.
              </p>
            </div>

            {appFeedbackMessage && (
              <div className={`p-4 rounded-2xl text-xs flex items-start gap-2.5 ${
                appFeedbackMessage.type === 'success'
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                  : 'bg-rose-50 text-rose-900 border border-rose-200'
              }`}>
                {appFeedbackMessage.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div className="leading-relaxed">{appFeedbackMessage.text}</div>
              </div>
            )}

            <form onSubmit={handleSubmitApplication} className="space-y-4 text-xs">
              {/* Account Email (Read-only, verified from current user session) */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Account Email</span>
                  <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Verified Account
                  </span>
                </label>
                <input
                  type="email"
                  readOnly
                  disabled
                  value={customer?.email || (activePhone ? `${activePhone}@lashkertraders.customer` : 'customer@lashkertraders.com')}
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl p-3 text-slate-500 font-mono cursor-not-allowed"
                />
              </div>

              {/* Business / Store Name */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Business / Store Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={appBusinessName}
                  onChange={(e) => setAppBusinessName(e.target.value)}
                  placeholder="e.g. Al-Madina Pharmacy & Baby Care"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-hidden focus:bg-white focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Contact Person Name */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Contact Person Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={appContactName}
                    onChange={(e) => setAppContactName(e.target.value)}
                    placeholder="Full name"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-hidden focus:bg-white focus:border-sky-500"
                  />
                </div>

                {/* Contact Phone (Validated BD format) */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Contact Phone <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={appPhone}
                    onChange={(e) => setAppPhone(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-mono outline-hidden focus:bg-white focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Business District */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Business District <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={appDistrict}
                    onChange={(e) => setAppDistrict(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-hidden focus:bg-white focus:border-sky-500"
                  >
                    {BD_DISTRICTS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                {/* Trade License Number */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Trade License Number <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={appTradeLicense}
                    onChange={(e) => setAppTradeLicense(e.target.value)}
                    placeholder="TRAD/DNCC/XXXXXX"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-mono outline-hidden focus:bg-white focus:border-sky-500"
                  />
                </div>
              </div>

              {/* Access Code (Optional) */}
              <div className="pt-1">
                <label className="block font-semibold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Access Code <span className="text-slate-400 font-normal">(Optional)</span></span>
                  {appCodeFeedback && (
                    <span className={`text-[10px] font-bold ${
                      appCodeFeedback.valid ? 'text-emerald-600' : 'text-amber-600'
                    }`}>
                      {appCodeFeedback.valid ? '✓ Valid Access Code' : '⚠ Code not recognized'}
                    </span>
                  )}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    autoFocus={focusAccessCode}
                    value={appAccessCode}
                    onChange={(e) => handleAccessCodeChange(e.target.value)}
                    placeholder="e.g. Lashkerb2b001 or Lashkerlimitb2b002"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-mono uppercase outline-hidden focus:bg-white focus:border-sky-500"
                  />
                  <KeyRound className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
                </div>

                {appCodeFeedback && (
                  <p className={`text-[11px] mt-1.5 leading-relaxed ${
                    appCodeFeedback.valid ? 'text-emerald-700 font-semibold' : 'text-amber-700'
                  }`}>
                    {appCodeFeedback.valid ? (
                      appCodeFeedback.policy === 'A'
                        ? '★ Policy A: Instant Auto-Approval for Standard Wholesale tier upon submission.'
                        : appCodeFeedback.policy === 'C'
                        ? '★ Policy C: Instant activation for Limited Wholesale tier upon submission.'
                        : '★ Policy B: VIP Fast-Track application submitted for priority staff review.'
                    ) : (
                      'Invalid or expired access code. You can still apply without a code.'
                    )}
                  </p>
                )}
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={appSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs transition-all shadow-md disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                >
                  {appSubmitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <span>Submit Application</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
