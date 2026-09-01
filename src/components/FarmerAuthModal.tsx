import React, { useState, useEffect } from 'react';
import { 
  Lock, Smartphone, User, MapPin, Eye, EyeOff, 
  ArrowRight, KeyRound, CheckCircle2, AlertCircle, RefreshCw, 
  Sprout, Building2, ShieldCheck
} from 'lucide-react';
import { 
  AuthUser, 
  loginWithPassword, 
  requestOTPChallenge, 
  verifyOTPChallenge, 
  getCleanDigits,
  getActiveOTPChallenge,
  OTPChallenge
} from '../services/authService';
import { INDIAN_STATES_AND_UT } from '../data/indianStates';

export type AuthMode = 'login' | 'signup' | 'forgot_password';

interface FarmerAuthModalProps {
  isOpen?: boolean;
  isFullScreen?: boolean;
  onClose?: () => void;
  onSuccess: (user: AuthUser) => void;
  initialMode?: AuthMode;
}

export const FarmerAuthModal: React.FC<FarmerAuthModalProps> = ({
  isOpen = true,
  isFullScreen = false,
  onClose,
  onSuccess,
  initialMode = 'login'
}) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  
  // Login Form State - Starts empty (no pre-filled demo data)
  const [loginPhone, setLoginPhone] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
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

  // Available districts for the currently selected state
  const currentAvailableDistricts = React.useMemo(() => {
    const found = INDIAN_STATES_AND_UT.find(
      (s) => s.nameEn === signupState || s.nameHi === signupState || s.code === signupState
    );
    return found ? found.districts : [];
  }, [signupState]);

  // Forgot Password State
  const [forgotStep, setForgotStep] = useState<'phone' | 'otp_reset'>('phone');
  const [forgotPhone, setForgotPhone] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);

  // OTP Input State
  const [enteredOTP, setEnteredOTP] = useState<string>('');
  const [activeChallenge, setActiveChallenge] = useState<OTPChallenge | null>(null);
  const [resendTimer, setResendTimer] = useState<number>(0);

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
        }, 500);
      } else {
        setErrorMsg(result.message);
      }
    }, 350);
  };

  // Handler: Signup Step 1 -> Request OTP
  const handleSignupRequestOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name or registered representative name.');
      return;
    }
    const cleanDigits = getCleanDigits(signupPhone);
    if (cleanDigits.length !== 10) {
      setErrorMsg('Please enter a valid 10-digit mobile phone number.');
      return;
    }
    if (!signupPassword || signupPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
    if (signupPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify.');
      return;
    }
    if (isFPO && !fpoName.trim()) {
      setErrorMsg('Please enter your Farmer Producer Organization (FPO) name.');
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
        setSuccessMsg(`Verification OTP sent to +91 ${cleanDigits}`);
      } else {
        setErrorMsg(result.message);
      }
    }, 350);
  };

  // Handler: Signup Step 2 -> Verify OTP & Finish Registration
  const handleSignupVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (enteredOTP.trim().length !== 6) {
      setErrorMsg('Please enter the 6-digit OTP code received.');
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
        }, 500);
      } else {
        setErrorMsg(result.message);
      }
    }, 400);
  };

  // Handler: Forgot Password Step 1 -> Request Reset OTP
  const handleForgotRequestOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const cleanDigits = getCleanDigits(forgotPhone);
    if (cleanDigits.length !== 10) {
      setErrorMsg('Please enter your 10-digit registered mobile number.');
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
    }, 350);
  };

  // Handler: Forgot Password Step 2 -> Verify OTP & Set New Password
  const handleForgotVerifyAndReset = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (enteredOTP.trim().length !== 6) {
      setErrorMsg('Please enter the 6-digit OTP code.');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setErrorMsg('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setErrorMsg('Passwords do not match.');
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
        }, 500);
      } else {
        setErrorMsg(result.message);
      }
    }, 400);
  };

  // Resend OTP Helper
  const handleResendOTP = (purpose: 'signup' | 'forgot_password') => {
    if (resendTimer > 0) return;
    const phoneToUse = purpose === 'signup' ? signupPhone : forgotPhone;
    const result = requestOTPChallenge(phoneToUse, purpose, activeChallenge?.payload);
    if (result.success && result.challenge) {
      setActiveChallenge(result.challenge);
      setResendTimer(45);
      setSuccessMsg('Fresh 6-digit OTP sent.');
    } else {
      setErrorMsg(result.message);
    }
  };

  const cardContent = (
    <div className={`bg-[#FDFBF7] rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-xl border border-stone-200 text-stone-800 relative ${isFullScreen ? 'my-0' : 'my-6'}`}>
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-12 h-12 rounded-xl bg-[#1B4332] text-[#D4A24E] flex items-center justify-center font-black text-xl shadow-xs mx-auto mb-3">
          <Sprout className="w-6 h-6" />
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-[#1B4332] tracking-tight">
          {mode === 'login' && 'Sign In to KisanDirect'}
          {mode === 'signup' && 'Create Farmer Profile'}
          {mode === 'forgot_password' && 'Reset Account Password'}
        </h2>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          {mode === 'login' && 'Direct farmgate exchange for farmers, FPOs & buyers'}
          {mode === 'signup' && 'Join the direct marketplace and eliminate intermediary cuts'}
          {mode === 'forgot_password' && 'Enter your registered mobile number to receive an OTP'}
        </p>

        {!isFullScreen && onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-stone-200 text-stone-400 hover:text-stone-700 transition-colors text-sm font-bold cursor-pointer"
            title="Close"
          >
            ✕
          </button>
        )}
      </div>

      {/* Alert Notifications */}
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

      {/* ------------------------------------------------------------- */}
      {/* MODE 1: LOGIN WITH PASSWORD                                    */}
      {/* ------------------------------------------------------------- */}
      {mode === 'login' && (
        <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-stone-700 mb-1">
              Mobile Phone Number
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-stone-400 font-bold text-xs">+91</span>
              <input
                id="farmer-login-phone-input"
                type="tel"
                maxLength={10}
                value={loginPhone}
                onChange={(e) => setLoginPhone(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 10-digit mobile"
                className="w-full pl-12 pr-3 py-2.5 bg-white border border-stone-300 rounded-xl font-medium text-stone-900 focus:outline-emerald-700"
                required
                autoFocus
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-stone-700">Password</label>
              <button
                type="button"
                onClick={() => {
                  setMode('forgot_password');
                  setForgotStep('phone');
                  setForgotPhone(loginPhone);
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 hover:underline cursor-pointer"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <input
                id="farmer-login-password-input"
                type={showLoginPassword ? 'text' : 'password'}
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-3.5 pr-10 py-2.5 bg-white border border-stone-300 rounded-xl font-medium text-stone-900 focus:outline-emerald-700"
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
            className="w-full py-3 bg-[#1B4332] hover:bg-[#143326] text-white font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 text-sm disabled:opacity-70 mt-2"
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin text-[#D4A24E]" />
            ) : (
              <Lock className="w-4 h-4 text-[#D4A24E]" />
            )}
            <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
          </button>

          {/* Text link to switch to Sign Up */}
          <div className="text-center pt-3 border-t border-stone-200">
            <span className="text-xs text-stone-500">Don't have an account? </span>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setSignupStep('details');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className="text-xs font-bold text-[#1B4332] hover:text-[#0d2219] hover:underline cursor-pointer"
            >
              Sign Up
            </button>
          </div>
        </form>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODE 2: SIGN UP WITH OTP                                      */}
      {/* ------------------------------------------------------------- */}
      {mode === 'signup' && (
        <div>
          {signupStep === 'details' ? (
            <form onSubmit={handleSignupRequestOTP} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Full Name *</label>
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
                <label className="block font-bold text-stone-700 mb-1">Mobile Phone Number *</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-stone-400 font-bold text-xs">+91</span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={signupPhone}
                    onChange={(e) => setSignupPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="10-digit mobile"
                    className="w-full pl-12 pr-3 py-2.5 bg-white border border-stone-300 rounded-xl font-medium"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="sm:col-span-1">
                  <label htmlFor="farmer-signup-state-select" className="block font-bold text-stone-700 mb-1">
                    State / UT *
                  </label>
                  <select
                    id="farmer-signup-state-select"
                    value={signupState}
                    onChange={(e) => {
                      const newState = e.target.value;
                      setSignupState(newState);
                      const stateObj = INDIAN_STATES_AND_UT.find(
                        (s) => s.nameEn === newState || s.nameHi === newState || s.code === newState
                      );
                      if (stateObj && stateObj.districts.length > 0) {
                        if (!stateObj.districts.includes(signupDistrict)) {
                          setSignupDistrict(stateObj.districts[0]);
                        }
                      }
                    }}
                    className="w-full p-2.5 bg-white border border-stone-300 rounded-xl font-medium text-xs text-stone-900 focus:ring-2 focus:ring-[#1B4332] focus:border-[#1B4332] focus:outline-hidden"
                    required
                  >
                    <optgroup label="States (28)">
                      {INDIAN_STATES_AND_UT.filter((s) => !s.nameEn.includes('(UT)') && !s.nameEn.includes('(NCT)')).map((st) => (
                        <option key={st.code} value={st.nameEn}>
                          {st.nameEn} ({st.nameHi})
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Union Territories (8)">
                      {INDIAN_STATES_AND_UT.filter((s) => s.nameEn.includes('(UT)') || s.nameEn.includes('(NCT)')).map((st) => (
                        <option key={st.code} value={st.nameEn}>
                          {st.nameEn} ({st.nameHi})
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                <div className="sm:col-span-1">
                  <label htmlFor="farmer-signup-district-input" className="block font-bold text-stone-700 mb-1">
                    District *
                  </label>
                  <input
                    id="farmer-signup-district-input"
                    type="text"
                    list="signup-district-options"
                    value={signupDistrict}
                    onChange={(e) => setSignupDistrict(e.target.value)}
                    placeholder="e.g. Nashik"
                    className="w-full p-2.5 bg-white border border-stone-300 rounded-xl font-medium text-xs text-stone-900 focus:ring-2 focus:ring-[#1B4332] focus:border-[#1B4332] focus:outline-hidden"
                    required
                  />
                  <datalist id="signup-district-options">
                    {currentAvailableDistricts.map((d) => (
                      <option key={d} value={d} />
                    ))}
                  </datalist>
                </div>

                <div className="sm:col-span-1">
                  <label htmlFor="farmer-signup-village-input" className="block font-bold text-stone-700 mb-1">
                    Village / Block *
                  </label>
                  <input
                    id="farmer-signup-village-input"
                    type="text"
                    value={signupVillage}
                    onChange={(e) => setSignupVillage(e.target.value)}
                    placeholder="e.g. Lasalgaon"
                    className="w-full p-2.5 bg-white border border-stone-300 rounded-xl font-medium text-xs text-stone-900 focus:ring-2 focus:ring-[#1B4332] focus:border-[#1B4332] focus:outline-hidden"
                    required
                  />
                </div>
              </div>

              {/* FPO Checkbox */}
              <div className="p-2.5 bg-stone-100 rounded-xl border border-stone-200 space-y-2">
                <label className="flex items-center gap-2 font-bold text-stone-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFPO}
                    onChange={(e) => setIsFPO(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <span>Register as a Farmer Producer Organization (FPO)</span>
                </label>
                {isFPO && (
                  <input
                    type="text"
                    value={fpoName}
                    onChange={(e) => setFpoName(e.target.value)}
                    placeholder="Enter registered FPO Name"
                    className="w-full p-2 bg-white border border-stone-300 rounded-lg font-medium text-xs"
                    required={isFPO}
                  />
                )}
              </div>

              {/* Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Create Password *</label>
                  <div className="relative">
                    <input
                      type={showSignupPassword ? 'text' : 'password'}
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder="Min 6 chars"
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
                className="w-full py-3 bg-[#1B4332] hover:bg-[#143326] text-white font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 text-sm disabled:opacity-70 mt-2"
              >
                <span>Continue & Verify Mobile</span>
                <ArrowRight className="w-4 h-4 text-[#D4A24E]" />
              </button>

              <div className="text-center pt-2">
                <span className="text-xs text-stone-500">Already registered? </span>
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMsg(null);
                    setSuccessMsg(null);
                  }}
                  className="text-xs font-bold text-[#1B4332] hover:underline cursor-pointer"
                >
                  Sign In
                </button>
              </div>
            </form>
          ) : (
            // Step 2: OTP Verification
            <form onSubmit={handleSignupVerifyOTP} className="space-y-4 text-xs">
              <div className="text-center space-y-1">
                <p className="text-stone-600 text-xs">
                  Enter the 6-digit code sent to <strong>+91 {signupPhone}</strong>
                </p>
              </div>

              <div>
                <input
                  id="signup-otp-input"
                  type="text"
                  maxLength={6}
                  value={enteredOTP}
                  onChange={(e) => setEnteredOTP(e.target.value.replace(/\D/g, ''))}
                  placeholder="------"
                  className="w-full py-3 text-center text-2xl tracking-[0.4em] font-bold bg-white border border-stone-300 focus:border-[#1B4332] rounded-xl text-[#1B4332] focus:outline-none"
                  autoFocus
                  required
                />
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={() => setSignupStep('details')}
                  className="font-semibold text-stone-500 hover:text-stone-800 cursor-pointer"
                >
                  ← Edit details
                </button>

                <button
                  type="button"
                  disabled={resendTimer > 0}
                  onClick={() => handleResendOTP('signup')}
                  className={`font-semibold cursor-pointer flex items-center gap-1 ${
                    resendTimer > 0 ? 'text-stone-400 cursor-not-allowed' : 'text-emerald-800 hover:underline'
                  }`}
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{resendTimer > 0 ? `Resend (${resendTimer}s)` : 'Resend code'}</span>
                </button>
              </div>

              <button
                id="signup-verify-otp-btn"
                type="submit"
                disabled={isLoading || enteredOTP.length !== 6}
                className="w-full py-3 bg-[#1B4332] hover:bg-[#143326] text-white font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 text-sm disabled:opacity-60"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-[#D4A24E]" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-[#D4A24E]" />
                )}
                <span>{isLoading ? 'Verifying...' : 'Complete Registration'}</span>
              </button>
            </form>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODE 3: FORGOT PASSWORD                                       */}
      {/* ------------------------------------------------------------- */}
      {mode === 'forgot_password' && (
        <div>
          {forgotStep === 'phone' ? (
            <form onSubmit={handleForgotRequestOTP} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Registered Mobile Number</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-stone-400 font-bold text-xs">+91</span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={forgotPhone}
                    onChange={(e) => setForgotPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="10-digit mobile"
                    className="w-full pl-12 pr-3 py-2.5 bg-white border border-stone-300 rounded-xl font-medium"
                    required
                    autoFocus
                  />
                </div>
              </div>

              <button
                id="forgot-send-otp-btn"
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-[#1B4332] hover:bg-[#143326] text-white font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 text-sm disabled:opacity-70"
              >
                <span>Send Reset Code</span>
                <ArrowRight className="w-4 h-4 text-[#D4A24E]" />
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-xs font-semibold text-stone-500 hover:text-stone-800 cursor-pointer"
                >
                  ← Back to Sign In
                </button>
              </div>
            </form>
          ) : (
            // Step 2: Set New Password
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
                  placeholder="------"
                  className="w-full py-2.5 text-center text-xl tracking-[0.4em] font-bold bg-white border border-stone-300 focus:border-[#1B4332] rounded-xl text-[#1B4332] focus:outline-none"
                  autoFocus
                  required
                />
              </div>

              <div className="space-y-2.5">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min 6 characters"
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
                  <label className="block font-bold text-stone-700 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full p-2 bg-white border border-stone-300 rounded-xl font-medium"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={() => setForgotStep('phone')}
                  className="font-semibold text-stone-500 hover:text-stone-800 cursor-pointer"
                >
                  ← Change number
                </button>

                <button
                  type="button"
                  disabled={resendTimer > 0}
                  onClick={() => handleResendOTP('forgot_password')}
                  className={`font-semibold cursor-pointer ${
                    resendTimer > 0 ? 'text-stone-400' : 'text-emerald-800 hover:underline'
                  }`}
                >
                  {resendTimer > 0 ? `Resend (${resendTimer}s)` : 'Resend code'}
                </button>
              </div>

              <button
                id="forgot-confirm-reset-btn"
                type="submit"
                disabled={isLoading || enteredOTP.length !== 6}
                className="w-full py-3 bg-[#1B4332] hover:bg-[#143326] text-white font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 text-sm disabled:opacity-60"
              >
                <Lock className="w-4 h-4 text-[#D4A24E]" />
                <span>Save New Password</span>
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );

  if (isFullScreen) {
    return (
      <div className="min-h-screen bg-[#FAF7F0] flex flex-col items-center justify-center p-4 sm:p-6 text-stone-800 animate-fade-in relative selection:bg-[#D4A24E] selection:text-[#1B4332]">
        {cardContent}

        {/* Small subtle trust indicator below */}
        <p className="mt-4 text-center text-xs text-stone-400">
          Direct Farmgate Exchange • Verified &amp; Encrypted
        </p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto animate-fade-in">
      {cardContent}
    </div>
  );
};

