import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Lock, Smartphone, User, MapPin, Eye, EyeOff, 
  ArrowRight, KeyRound, CheckCircle2, AlertCircle, RefreshCw, 
  Sprout, Building2, HelpCircle, PhoneCall, Copy, Check
} from 'lucide-react';
import { 
  AuthUser, 
  loginWithPassword, 
  requestOTPChallenge, 
  verifyOTPChallenge, 
  getRegisteredUsers, 
  getCleanDigits,
  DEFAULT_DEMO_USERS,
  getActiveOTPChallenge,
  OTPChallenge
} from '../services/authService';

export type AuthMode = 'login' | 'signup' | 'forgot_password';

interface FarmerAuthModalProps {
  isOpen?: boolean;
  isFullScreen?: boolean;
  onClose?: () => void;
  onSuccess: (user: AuthUser) => void;
  initialMode?: AuthMode;
}

const INDIAN_STATES = [
  'Maharashtra', 'Uttar Pradesh', 'Karnataka', 'Madhya Pradesh', 
  'Punjab', 'Rajasthan', 'Andhra Pradesh', 'Gujarat', 'Haryana', 
  'Tamil Nadu', 'Bihar', 'West Bengal', 'Telangana', 'Kerala', 'Himachal Pradesh'
];

export const FarmerAuthModal: React.FC<FarmerAuthModalProps> = ({
  isOpen = true,
  isFullScreen = false,
  onClose,
  onSuccess,
  initialMode = 'login'
}) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  
  // Login Form State
  const [loginPhone, setLoginPhone] = useState<string>('9822451203');
  const [loginPassword, setLoginPassword] = useState<string>('Kisan@123');
  const [showLoginPassword, setShowLoginPassword] = useState<boolean>(false);
  
  // Signup Form State
  const [signupStep, setSignupStep] = useState<'details' | 'otp'>('details');
  const [fullName, setFullName] = useState<string>('');
  const [signupPhone, setSignupPhone] = useState<string>('');
  const [signupState, setSignupState] = useState<string>('Maharashtra');
  const [signupDistrict, setSignupDistrict] = useState<string>('Nashik');
  const [signupVillage, setSignupVillage] = useState<string>('Lasalgaon');
  const [isFPO, setIsFPO] = useState<boolean>(false);
  const [fpoName, setFpoName] = useState<string>('');
  const [primaryCrops, setPrimaryCrops] = useState<string>('Onion, Tomato');
  const [signupPassword, setSignupPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showSignupPassword, setShowSignupPassword] = useState<boolean>(false);

  // Forgot Password State
  const [forgotStep, setForgotStep] = useState<'phone' | 'otp_reset'>('phone');
  const [forgotPhone, setForgotPhone] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);

  // OTP Input State (Shared between signup & forgot_password)
  const [enteredOTP, setEnteredOTP] = useState<string>('');
  const [activeChallenge, setActiveChallenge] = useState<OTPChallenge | null>(null);
  const [resendTimer, setResendTimer] = useState<number>(0);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Feedback Messages
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Sync mode when initialMode prop changes
  useEffect(() => {
    setMode(initialMode);
    setErrorMsg(null);
    setSuccessMsg(null);
  }, [initialMode, isOpen]);

  // Resend Timer Countdown
  useEffect(() => {
    let timer: any;
    if (resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  if (!isOpen) return null;

  // Handler: Standard Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);

    setTimeout(() => {
      const result = loginWithPassword(loginPhone, loginPassword);
      setIsLoading(false);
      if (result.success && result.user) {
        setSuccessMsg(result.message);
        setTimeout(() => {
          onSuccess(result.user!);
          onClose?.();
        }, 600);
      } else {
        setErrorMsg(result.message);
      }
    }, 400);
  };

  // Handler: Signup Step 1 -> Request OTP
  const handleSignupRequestOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    // Validation
    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name or legal FPO representative name.');
      return;
    }
    const cleanDigits = getCleanDigits(signupPhone);
    if (cleanDigits.length !== 10) {
      setErrorMsg('Please provide a valid 10-digit mobile number for SMS verification.');
      return;
    }
    if (!signupPassword || signupPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters for security.');
      return;
    }
    if (signupPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please recheck.');
      return;
    }
    if (isFPO && !fpoName.trim()) {
      setErrorMsg('Please provide your Farmer Producer Organization (FPO) name.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const payload = {
        name: fullName,
        phone: signupPhone,
        state: signupState,
        district: signupDistrict,
        village: signupVillage,
        isFPO: isFPO,
        fpoName: fpoName,
        primaryCrops: primaryCrops.split(',').map(c => c.trim()).filter(Boolean),
        password: signupPassword,
      };

      const result = requestOTPChallenge(signupPhone, 'signup', payload);
      setIsLoading(false);

      if (result.success && result.challenge) {
        setActiveChallenge(result.challenge);
        setSignupStep('otp');
        setEnteredOTP('');
        setResendTimer(45);
        setSuccessMsg(`6-Digit Verification Code sent to +91 ${cleanDigits}`);
      } else {
        setErrorMsg(result.message);
      }
    }, 400);
  };

  // Handler: Signup Step 2 -> Verify OTP & Finish Registration
  const handleSignupVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (enteredOTP.trim().length !== 6) {
      setErrorMsg('Please enter the complete 6-digit OTP code received on your phone.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const result = verifyOTPChallenge(signupPhone, enteredOTP, 'signup');
      setIsLoading(false);

      if (result.success && result.user) {
        setSuccessMsg(result.message);
        setTimeout(() => {
          onSuccess(result.user!);
          onClose?.();
        }, 800);
      } else {
        setErrorMsg(result.message);
      }
    }, 500);
  };

  // Handler: Forgot Password Step 1 -> Request Reset OTP
  const handleForgotRequestOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const cleanDigits = getCleanDigits(forgotPhone);
    if (cleanDigits.length !== 10) {
      setErrorMsg('Please enter the 10-digit registered mobile number.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const result = requestOTPChallenge(forgotPhone, 'forgot_password');
      setIsLoading(false);

      if (result.success && result.challenge) {
        setActiveChallenge(result.challenge);
        setForgotStep('otp_reset');
        setEnteredOTP('');
        setResendTimer(45);
        setSuccessMsg(`Password Reset OTP sent to ${result.challenge.phone}`);
      } else {
        setErrorMsg(result.message);
      }
    }, 400);
  };

  // Handler: Forgot Password Step 2 -> Verify OTP & Set New Password
  const handleForgotVerifyAndReset = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (enteredOTP.trim().length !== 6) {
      setErrorMsg('Please enter the 6-digit OTP code sent to your phone.');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setErrorMsg('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setErrorMsg('New passwords do not match. Please verify.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const result = verifyOTPChallenge(forgotPhone, enteredOTP, 'forgot_password', newPassword);
      setIsLoading(false);

      if (result.success && result.user) {
        setSuccessMsg(result.message);
        setTimeout(() => {
          onSuccess(result.user!);
          onClose?.();
        }, 800);
      } else {
        setErrorMsg(result.message);
      }
    }, 500);
  };

  // Resend OTP Helper
  const handleResendOTP = (purpose: 'signup' | 'forgot_password') => {
    if (resendTimer > 0) return;
    const phoneToUse = purpose === 'signup' ? signupPhone : forgotPhone;
    const result = requestOTPChallenge(phoneToUse, purpose, activeChallenge?.payload);
    if (result.success && result.challenge) {
      setActiveChallenge(result.challenge);
      setResendTimer(45);
      setSuccessMsg('Fresh 6-digit OTP sent to your phone.');
    } else {
      setErrorMsg(result.message);
    }
  };

  // Quick Demo Auto-fill Helper
  const handleSelectDemoUser = (user: typeof DEFAULT_DEMO_USERS[0]) => {
    setLoginPhone(getCleanDigits(user.phone));
    setLoginPassword(user.passwordHash);
    setErrorMsg(null);
    setSuccessMsg(`Selected demo profile: ${user.name}`);
  };

  const modalContent = (
    <div className={`bg-[#FDFBF7] rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border ${isFullScreen ? 'border-[#D4A24E]/40 my-0' : 'border-stone-300 my-6'} text-stone-800 relative overflow-hidden`}>
      {/* Header Branding */}
      <div className="flex items-start justify-between border-b border-stone-200 pb-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#1B4332] text-[#D4A24E] flex items-center justify-center font-black text-xl shadow-xs shrink-0">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-[#1B4332]">
                {mode === 'login' && 'Farmer / FPO Secure Login'}
                {mode === 'signup' && 'Register New Farmer Profile'}
                {mode === 'forgot_password' && 'Reset Account Password'}
              </h2>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> OTP Protected
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Direct Farmgate Exchange • Identity & Farm Protection
            </p>
          </div>
        </div>

        {!isFullScreen && onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-stone-200 text-stone-400 hover:text-stone-700 transition-colors text-sm font-bold cursor-pointer"
            title="Close"
          >
            ✕
          </button>
        )}
      </div>

        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-2 gap-1.5 bg-stone-200/80 p-1 rounded-2xl mb-5 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`py-2 px-3 rounded-xl transition-all cursor-pointer text-center ${
              mode === 'login'
                ? 'bg-[#1B4332] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Sign In with Password
          </button>

          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setSignupStep('details');
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`py-2 px-3 rounded-xl transition-all cursor-pointer text-center ${
              mode === 'signup'
                ? 'bg-[#1B4332] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            New Sign Up (with OTP)
          </button>
        </div>

        {/* Global Alert Banners */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1 font-medium">{errorMsg}</div>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div className="flex-1 font-medium">{successMsg}</div>
          </div>
        )}

        {/* Live Simulated SMS Notification / OTP Assistant Banner */}
        {activeChallenge && (mode === 'signup' || mode === 'forgot_password') && (
          <div className="mb-5 p-3.5 bg-amber-50/90 border border-amber-300 rounded-2xl text-xs space-y-1.5 shadow-xs animate-fade-in">
            <div className="flex items-center justify-between text-amber-900 font-bold">
              <span className="flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-amber-700" />
                <span>Simulated SMS to {activeChallenge.phone}</span>
              </span>
              <span className="bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded text-[10px] font-mono">
                5 min validity
              </span>
            </div>
            <p className="text-amber-800 text-[11px]">
              &quot;[KisanDirect Security] Your verification code is <strong className="text-sm font-black tracking-widest text-[#1B4332]">{activeChallenge.otpCode}</strong>. Do not share with anyone.&quot;
            </p>
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setEnteredOTP(activeChallenge.otpCode);
                  setCopiedCode(true);
                  setTimeout(() => setCopiedCode(false), 2000);
                }}
                className="px-2.5 py-1 bg-amber-200 hover:bg-amber-300 text-amber-900 font-bold rounded-lg text-[11px] cursor-pointer inline-flex items-center gap-1 transition-colors"
              >
                {copiedCode ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCode ? 'Auto-filled!' : `Auto-fill Code (${activeChallenge.otpCode})`}</span>
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* MODE 1: LOGIN WITH PASSWORD                                    */}
        {/* ------------------------------------------------------------- */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-stone-700 mb-1 flex items-center justify-between">
                <span>Mobile Phone Number *</span>
                <span className="text-[10px] text-stone-400 font-normal">10-digit Indian Mobile</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-stone-400 font-bold">+91</span>
                <input
                  id="farmer-login-phone-input"
                  type="tel"
                  maxLength={10}
                  value={loginPhone}
                  onChange={(e) => setLoginPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="9822451203"
                  className="w-full pl-12 pr-3 py-2.5 bg-white border border-stone-300 rounded-xl font-bold text-stone-900 focus:outline-emerald-700"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-stone-700">Account Password *</label>
                <button
                  type="button"
                  onClick={() => {
                    setMode('forgot_password');
                    setForgotStep('phone');
                    setForgotPhone(loginPhone);
                    setErrorMsg(null);
                    setSuccessMsg(null);
                  }}
                  className="text-[11px] font-bold text-emerald-800 hover:underline cursor-pointer"
                >
                  Forgot Password? (Reset via OTP)
                </button>
              </div>
              <div className="relative">
                <input
                  id="farmer-login-password-input"
                  type={showLoginPassword ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-3 pr-10 py-2.5 bg-white border border-stone-300 rounded-xl font-medium text-stone-900 focus:outline-emerald-700"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-600 cursor-pointer"
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              id="farmer-login-submit-btn"
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#1B4332] hover:bg-[#143326] text-[#D4A24E] font-black rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 text-sm disabled:opacity-70 mt-2"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin text-[#D4A24E]" />
              ) : (
                <Lock className="w-4 h-4 text-[#D4A24E]" />
              )}
              <span>{isLoading ? 'Authenticating...' : 'Sign In Securely'}</span>
            </button>

            {/* Demo Quick Accounts Pill Selector for Testing */}
            <div className="pt-3 border-t border-stone-200">
              <span className="text-[11px] font-bold text-stone-500 block mb-2">
                Quick-Select Demo Verified Farmer Accounts:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                {DEFAULT_DEMO_USERS.map((demo) => (
                  <button
                    key={demo.id}
                    type="button"
                    onClick={() => handleSelectDemoUser(demo)}
                    className="p-2 text-left bg-stone-100 hover:bg-emerald-50 hover:border-emerald-300 border border-stone-200 rounded-xl transition-all cursor-pointer"
                  >
                    <span className="font-bold text-stone-800 block truncate text-[11px]">{demo.name}</span>
                    <span className="text-[10px] text-stone-500 block">{demo.district} ({demo.phone.slice(-5)})</span>
                  </button>
                ))}
              </div>
            </div>
          </form>
        )}

        {/* ------------------------------------------------------------- */}
        {/* MODE 2: FIRST SIGN UP (WITH OTP VERIFICATION)                   */}
        {/* ------------------------------------------------------------- */}
        {mode === 'signup' && (
          <div>
            {signupStep === 'details' ? (
              <form onSubmit={handleSignupRequestOTP} className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Full Name / Farmer Name *</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Rameshwar Patil"
                      className="w-full p-2.5 bg-white border border-stone-300 rounded-xl font-medium"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Mobile Phone (for OTP) *</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-stone-400 font-bold">+91</span>
                      <input
                        type="tel"
                        maxLength={10}
                        value={signupPhone}
                        onChange={(e) => setSignupPhone(e.target.value.replace(/\D/g, ''))}
                        placeholder="9876543210"
                        className="w-full pl-12 pr-3 py-2.5 bg-white border border-stone-300 rounded-xl font-bold"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">State *</label>
                    <select
                      value={signupState}
                      onChange={(e) => setSignupState(e.target.value)}
                      className="w-full p-2 bg-white border border-stone-300 rounded-xl font-medium"
                    >
                      {INDIAN_STATES.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">District *</label>
                    <input
                      type="text"
                      value={signupDistrict}
                      onChange={(e) => setSignupDistrict(e.target.value)}
                      placeholder="e.g. Nashik"
                      className="w-full p-2 bg-white border border-stone-300 rounded-xl font-medium"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Village / Town *</label>
                    <input
                      type="text"
                      value={signupVillage}
                      onChange={(e) => setSignupVillage(e.target.value)}
                      placeholder="e.g. Lasalgaon"
                      className="w-full p-2 bg-white border border-stone-300 rounded-xl font-medium"
                      required
                    />
                  </div>
                </div>

                {/* FPO Checkbox & Field */}
                <div className="p-3 bg-stone-100 rounded-xl border border-stone-200 space-y-2">
                  <label className="flex items-center gap-2 font-bold text-stone-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFPO}
                      onChange={(e) => setIsFPO(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded"
                    />
                    <span>Are you registering as a Farmer Producer Org (FPO)?</span>
                  </label>
                  {isFPO && (
                    <input
                      type="text"
                      value={fpoName}
                      onChange={(e) => setFpoName(e.target.value)}
                      placeholder="Enter registered FPO Federation Name"
                      className="w-full p-2 bg-white border border-stone-300 rounded-lg font-medium text-xs"
                      required={isFPO}
                    />
                  )}
                </div>

                {/* Password Setting */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Create Password *</label>
                    <div className="relative">
                      <input
                        type={showSignupPassword ? 'text' : 'password'}
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        placeholder="Min 6 characters"
                        className="w-full pl-3 pr-8 py-2 bg-white border border-stone-300 rounded-xl font-medium"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignupPassword(!showSignupPassword)}
                        className="absolute right-2.5 top-2 text-stone-400"
                      >
                        {showSignupPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Confirm Password *</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className="w-full p-2 bg-white border border-stone-300 rounded-xl font-medium"
                      required
                    />
                  </div>
                </div>

                <button
                  id="farmer-signup-send-otp-btn"
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-[#1B4332] hover:bg-[#143326] text-[#D4A24E] font-black rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 text-sm disabled:opacity-70 mt-3"
                >
                  <Smartphone className="w-4 h-4 text-[#D4A24E]" />
                  <span>Send SMS OTP to Verify Mobile</span>
                </button>
              </form>
            ) : (
              // Step 2: OTP Verification for Signup
              <form onSubmit={handleSignupVerifyOTP} className="space-y-4 text-xs">
                <div className="text-center space-y-1">
                  <span className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#1B4332] flex items-center justify-center mx-auto mb-2 font-black">
                    <KeyRound className="w-6 h-6" />
                  </span>
                  <h3 className="text-base font-black text-stone-900">
                    Verify Your Mobile Phone
                  </h3>
                  <p className="text-stone-500 text-xs">
                    Enter the 6-digit verification code sent to <strong>+91 {signupPhone}</strong>
                  </p>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1 text-center">
                    Enter 6-Digit OTP Code
                  </label>
                  <input
                    id="signup-otp-input"
                    type="text"
                    maxLength={6}
                    value={enteredOTP}
                    onChange={(e) => setEnteredOTP(e.target.value.replace(/\D/g, ''))}
                    placeholder="• • • • • •"
                    className="w-full py-3 text-center text-2xl tracking-[0.5em] font-black bg-white border-2 border-emerald-600 rounded-2xl text-[#1B4332] focus:outline-none"
                    autoFocus
                    required
                  />
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <button
                    type="button"
                    onClick={() => setSignupStep('details')}
                    className="font-bold text-stone-500 hover:text-stone-800 cursor-pointer"
                  >
                    ← Edit Profile Details
                  </button>

                  <button
                    type="button"
                    disabled={resendTimer > 0}
                    onClick={() => handleResendOTP('signup')}
                    className={`font-bold cursor-pointer flex items-center gap-1 ${
                      resendTimer > 0 ? 'text-stone-400 cursor-not-allowed' : 'text-emerald-800 hover:underline'
                    }`}
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>{resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}</span>
                  </button>
                </div>

                <button
                  id="signup-verify-otp-btn"
                  type="submit"
                  disabled={isLoading || enteredOTP.length !== 6}
                  className="w-full py-3 bg-[#1B4332] hover:bg-[#143326] text-[#D4A24E] font-black rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 text-sm disabled:opacity-60"
                >
                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-[#D4A24E]" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-[#D4A24E]" />
                  )}
                  <span>{isLoading ? 'Verifying...' : 'Verify OTP & Create Verified Profile'}</span>
                </button>
              </form>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* MODE 3: FORGOT PASSWORD (WITH OTP RECOVERY)                    */}
        {/* ------------------------------------------------------------- */}
        {mode === 'forgot_password' && (
          <div>
            {forgotStep === 'phone' ? (
              <form onSubmit={handleForgotRequestOTP} className="space-y-4 text-xs">
                <div className="text-center space-y-1 mb-2">
                  <h3 className="text-base font-black text-stone-900">
                    Recover Password via SMS OTP
                  </h3>
                  <p className="text-stone-500 text-xs">
                    We will send a 6-digit security code to your registered mobile number.
                  </p>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Registered Mobile Number *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-stone-400 font-bold">+91</span>
                    <input
                      type="tel"
                      maxLength={10}
                      value={forgotPhone}
                      onChange={(e) => setForgotPhone(e.target.value.replace(/\D/g, ''))}
                      placeholder="9822451203"
                      className="w-full pl-12 pr-3 py-2.5 bg-white border border-stone-300 rounded-xl font-bold"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="font-bold text-stone-500 hover:text-stone-800 cursor-pointer"
                  >
                    ← Back to Login
                  </button>

                  <button
                    id="forgot-send-otp-btn"
                    type="submit"
                    disabled={isLoading}
                    className="px-5 py-2.5 bg-[#1B4332] hover:bg-[#143326] text-[#D4A24E] font-black rounded-xl shadow-md cursor-pointer flex items-center gap-2"
                  >
                    <span>Send Reset OTP</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            ) : (
              // Step 2: OTP Verification & Set New Password
              <form onSubmit={handleForgotVerifyAndReset} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 mb-1 text-center">
                    Enter 6-Digit Reset Code
                  </label>
                  <input
                    id="forgot-otp-input"
                    type="text"
                    maxLength={6}
                    value={enteredOTP}
                    onChange={(e) => setEnteredOTP(e.target.value.replace(/\D/g, ''))}
                    placeholder="• • • • • •"
                    className="w-full py-2.5 text-center text-xl tracking-[0.4em] font-black bg-white border-2 border-emerald-600 rounded-2xl text-[#1B4332]"
                    autoFocus
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">New Password *</label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Min 6 chars"
                        className="w-full pl-3 pr-8 py-2 bg-white border border-stone-300 rounded-xl font-medium"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-2.5 top-2 text-stone-400"
                      >
                        {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Confirm New Password *</label>
                    <input
                      type="password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="Repeat new password"
                      className="w-full p-2 bg-white border border-stone-300 rounded-xl font-medium"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <button
                    type="button"
                    onClick={() => setForgotStep('phone')}
                    className="font-bold text-stone-500 hover:text-stone-800 cursor-pointer"
                  >
                    ← Change Phone
                  </button>

                  <button
                    type="button"
                    disabled={resendTimer > 0}
                    onClick={() => handleResendOTP('forgot_password')}
                    className={`font-bold cursor-pointer ${
                      resendTimer > 0 ? 'text-stone-400' : 'text-emerald-800 hover:underline'
                    }`}
                  >
                    {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code'}
                  </button>
                </div>

                <button
                  id="forgot-confirm-reset-btn"
                  type="submit"
                  disabled={isLoading || enteredOTP.length !== 6}
                  className="w-full py-3 bg-[#1B4332] hover:bg-[#143326] text-[#D4A24E] font-black rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 text-sm disabled:opacity-60"
                >
                  <Lock className="w-4 h-4 text-[#D4A24E]" />
                  <span>Verify OTP & Save New Password</span>
                </button>
              </form>
            )}
          </div>
        )}
      </div>
  );

  if (isFullScreen) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#143326] via-[#1B4332] to-[#0d2219] flex flex-col items-center justify-center p-4 sm:p-6 text-stone-800 animate-fade-in relative selection:bg-[#D4A24E] selection:text-[#1B4332]">
        {/* Fullscreen Platform Banner */}
        <div className="text-center mb-6 max-w-lg">
          <div className="inline-flex items-center justify-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-[#D4A24E] text-[#1B4332] flex items-center justify-center font-black text-2xl shadow-md">
              🌾
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <h1 className="font-black text-2xl tracking-tight text-white">KisanDirect</h1>
                <span className="text-[10px] font-mono font-bold bg-[#24543f] text-[#D4A24E] px-2 py-0.5 rounded border border-[#D4A24E]/40">
                  Direct Exchange
                </span>
              </div>
              <p className="text-xs text-emerald-200 font-medium">
                Direct Farm-to-Buyer Marketplace &amp; Smart Logistics
              </p>
            </div>
          </div>
          <p className="text-xs text-emerald-100/70">
            Secure login gateway for verified farmers, FPO cooperatives, and agricultural buyers
          </p>
        </div>

        {modalContent}

        {/* Security / trust reassurance badges under login card */}
        <div className="mt-6 text-center text-xs text-emerald-200/70 flex flex-wrap items-center justify-center gap-3 sm:gap-4 font-medium">
          <span className="flex items-center gap-1">✓ Real-time APMC Mandi Rates</span>
          <span>•</span>
          <span className="flex items-center gap-1">✓ Direct UPI &amp; Bank Settlement</span>
          <span>•</span>
          <span className="flex items-center gap-1">✓ Zero Intermediary Cut</span>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-xs overflow-y-auto animate-fade-in">
      {modalContent}
    </div>
  );
};
