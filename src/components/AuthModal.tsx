import React, { useState, useEffect } from 'react';
import { UserProfile, findUserByPhone, saveOrUpdateUser, PRESET_SAMPLE_USERS, getRegisteredUsers } from '../services/authService';
import { saveFarmerProfileToSupabase } from '../services/supabaseService';
import { Language, CropCategory } from '../types';
import { INDIAN_STATES_AND_UT } from '../data/indianStates';
import {
  User,
  Phone,
  Lock,
  ArrowRight,
  CheckCircle2,
  X,
  ShieldCheck,
  MapPin,
  Leaf,
  Sparkles,
  Smartphone,
  LogOut,
  Edit3,
  UserPlus,
  KeyRound,
  FileCheck2,
  RefreshCw
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onLoginSuccess: (user: UserProfile) => void;
  onLogout: () => void;
  currentLang: Language;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess,
  onLogout,
  currentLang,
}) => {
  // Modal navigation modes: 'signin' | 'register' | 'otp' | 'presets' | 'edit_profile'
  const [activeTab, setActiveTab] = useState<'signin' | 'register' | 'presets'>('signin');
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Form Fields
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [state, setState] = useState('Maharashtra');
  const [district, setDistrict] = useState('Nashik');
  const [village, setVillage] = useState('');
  const [farmSize, setFarmSize] = useState<number>(4.5);
  const [primaryCrop, setPrimaryCrop] = useState<string>('potato');
  const [otpCode, setOtpCode] = useState('4882');
  const [pendingUser, setPendingUser] = useState<UserProfile | null>(null);

  // Status banners
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Sync edit form with current logged in user when editing
  useEffect(() => {
    if (currentUser) {
      setFullName(currentUser.name);
      setPhoneNumber(currentUser.phone);
      setState(currentUser.state);
      setDistrict(currentUser.district);
      setVillage(currentUser.village || '');
      setFarmSize(currentUser.farmSizeAcres);
      setPrimaryCrop(currentUser.primaryCrop);
    }
  }, [currentUser]);

  // Current State districts list
  const currentStateObj = INDIAN_STATES_AND_UT.find(
    (s) => s.nameEn.toLowerCase() === state.toLowerCase() || s.nameHi === state
  ) || INDIAN_STATES_AND_UT[13]; // Default Maharashtra

  const handleStateChange = (newState: string) => {
    setState(newState);
    const stateObj = INDIAN_STATES_AND_UT.find((s) => s.nameEn === newState);
    if (stateObj && stateObj.districts.length > 0) {
      setDistrict(stateObj.districts[0]);
    }
  };

  if (!isOpen) return null;

  // 1. Direct Instant Demo Login
  const handleQuickDemoLogin = (preset: UserProfile) => {
    saveOrUpdateUser(preset);
    saveFarmerProfileToSupabase(preset);
    onLoginSuccess(preset);
    setErrorMsg('');
    setSuccessMsg(`Welcome, ${preset.name}!`);
    setTimeout(() => {
      onClose();
    }, 400);
  };

  // 2. Sign In with Phone
  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const clean = phoneNumber.trim().replace(/\D/g, '');
    if (clean.length < 10) {
      setErrorMsg(currentLang === 'hi' ? 'कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें।' : 'Please enter a valid 10-digit mobile number.');
      return;
    }

    const existing = findUserByPhone(clean);
    if (existing) {
      setPendingUser(existing);
      setIsOtpStep(true);
      setOtpCode('4882');
      setSuccessMsg(
        currentLang === 'hi'
          ? `सत्यापन कोड भेजा गया: +91 ${clean} (डेमो कोड: 4882)`
          : `Verification code sent to +91 ${clean} (Demo code: 4882)`
      );
    } else {
      // Auto-switch to register with pre-filled phone number
      setActiveTab('register');
      setSuccessMsg(
        currentLang === 'hi'
          ? `यह मोबाइल नंबर नया है। कृपया नीचे अपना किसान विवरण भरें।`
          : `New mobile number! Please complete your farmer details below.`
      );
    }
  };

  // 3. Register New Farmer
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!fullName.trim()) {
      setErrorMsg(currentLang === 'hi' ? 'कृपया किसान का पूरा नाम दर्ज करें।' : 'Please enter your full name.');
      return;
    }

    const clean = phoneNumber.trim().replace(/\D/g, '');
    if (clean.length < 10) {
      setErrorMsg(currentLang === 'hi' ? 'कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें।' : 'Please enter a valid 10-digit mobile number.');
      return;
    }

    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      name: fullName.trim(),
      phone: clean,
      state,
      district,
      village: village.trim() || undefined,
      farmSizeAcres: Number(farmSize) || 2.5,
      primaryCrop,
      farmerIdCode: `KRISHI-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
    };

    setPendingUser(newUser);
    setIsOtpStep(true);
    setOtpCode('4882');
    setSuccessMsg(
      currentLang === 'hi'
        ? `प्रोफाइल तैयार है! पुष्टि के लिए OTP: 4882 दर्ज करें।`
        : `Profile created! Enter verification code: 4882 to finish.`
    );
  };

  // 4. Save Profile Edits
  const handleSaveProfileEdits = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const updatedUser: UserProfile = {
      ...currentUser,
      name: fullName.trim() || currentUser.name,
      state,
      district,
      village: village.trim() || undefined,
      farmSizeAcres: Number(farmSize) || currentUser.farmSizeAcres,
      primaryCrop,
    };

    saveOrUpdateUser(updatedUser);
    saveFarmerProfileToSupabase(updatedUser);
    onLoginSuccess(updatedUser);
    setIsEditingProfile(false);
    setSuccessMsg(currentLang === 'hi' ? 'किसान प्रोफाइल सफलतापूर्वक अपडेट हुई!' : 'Farmer profile updated successfully!');
  };

  // 5. Verify OTP
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.trim().length < 4) {
      setErrorMsg(currentLang === 'hi' ? 'कृपया 4 अंकों का OTP कोड दर्ज करें (4882)' : 'Please enter the 4-digit OTP (4882).');
      return;
    }

    if (pendingUser) {
      saveOrUpdateUser(pendingUser);
      saveFarmerProfileToSupabase(pendingUser);
      onLoginSuccess(pendingUser);
      setIsOtpStep(false);
      setSuccessMsg(
        currentLang === 'hi'
          ? `नमस्ते ${pendingUser.name}! सफलतापूर्वक लॉगिन हो गया।`
          : `Welcome ${pendingUser.name}! Login successful.`
      );
      setTimeout(() => {
        onClose();
      }, 500);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-lg w-full border border-[#D4A24E]/40 shadow-2xl overflow-hidden flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Strip */}
        <div className="bg-[#1B4332] text-white p-4 sm:p-5 flex items-center justify-between border-b border-[#D4A24E]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D4A24E] text-[#081C15] flex items-center justify-center font-black text-base shadow-sm font-mono">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg tracking-tight text-white flex items-center gap-2">
                <span>{currentUser ? 'Farmer Identity Card' : 'KrishiScan Farmer Portal'}</span>
                <span className="text-[10px] bg-[#D4A24E]/20 text-[#D4A24E] border border-[#D4A24E]/40 px-1.5 py-0.5 rounded font-mono font-bold">
                  ICAR-KVK
                </span>
              </h3>
              <p className="text-xs text-[#FAF7F0]/80">
                {currentUser
                  ? `Kisan ID: ${currentUser.farmerIdCode} • ${currentUser.district}, ${currentUser.state}`
                  : (currentLang === 'hi' ? 'रोग निदान, पर्ची और खेत इतिहास सुरक्षित रखें' : 'Save leaf scans, dosages & prescription history')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Tab Bar (When Not Logged In) */}
        {!currentUser && !isOtpStep && (
          <div className="grid grid-cols-3 bg-[#FAF7F0] border-b border-[#D4A24E]/25 text-xs font-bold text-neutral-600">
            <button
              type="button"
              onClick={() => {
                setActiveTab('signin');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className={`py-3 px-2 flex items-center justify-center gap-1.5 transition-all cursor-pointer border-b-2 ${
                activeTab === 'signin'
                  ? 'border-[#1B4332] text-[#1B4332] bg-white font-extrabold shadow-2xs'
                  : 'border-transparent hover:text-[#1B4332]'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>{currentLang === 'hi' ? 'लॉगिन' : 'Sign In'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('register');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className={`py-3 px-2 flex items-center justify-center gap-1.5 transition-all cursor-pointer border-b-2 ${
                activeTab === 'register'
                  ? 'border-[#1B4332] text-[#1B4332] bg-white font-extrabold shadow-2xs'
                  : 'border-transparent hover:text-[#1B4332]'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{currentLang === 'hi' ? 'नया पंजीकरण' : 'Register'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('presets');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className={`py-3 px-2 flex items-center justify-center gap-1.5 transition-all cursor-pointer border-b-2 ${
                activeTab === 'presets'
                  ? 'border-[#1B4332] text-[#1B4332] bg-white font-extrabold shadow-2xs'
                  : 'border-transparent hover:text-[#1B4332]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D4A24E]" />
              <span>{currentLang === 'hi' ? 'डेमो खाते' : '1-Click Demo'}</span>
            </button>
          </div>
        )}

        {/* Body Content */}
        <div className="p-4 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Notifications / Alerts */}
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 font-semibold flex items-center gap-2 animate-in fade-in">
              <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 font-semibold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* VIEW 1: Logged In State (Farmer ID Card) */}
          {currentUser ? (
            isEditingProfile ? (
              /* Edit Profile Sub-form */
              <form onSubmit={handleSaveProfileEdits} className="space-y-3.5">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                  <h4 className="text-sm font-bold text-[#1B4332] flex items-center gap-1.5">
                    <Edit3 className="w-4 h-4 text-[#D4A24E]" />
                    <span>Edit Farmer Details (किसान विवरण संपादन)</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className="text-xs text-neutral-500 hover:text-neutral-800 font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#1B4332] uppercase mb-1">
                    Farmer Name (किसान का नाम)
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-[#1B4332] uppercase mb-1">
                      State (राज्य)
                    </label>
                    <select
                      value={state}
                      onChange={(e) => handleStateChange(e.target.value)}
                      className="w-full px-2 py-2 border border-neutral-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#1B4332] bg-white"
                    >
                      {INDIAN_STATES_AND_UT.map((s) => (
                        <option key={s.code} value={s.nameEn}>
                          {s.nameEn} ({s.nameHi})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#1B4332] uppercase mb-1">
                      District (जिला)
                    </label>
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full px-2 py-2 border border-neutral-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#1B4332] bg-white"
                    >
                      {currentStateObj.districts.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-[#1B4332] uppercase mb-1">
                      Village / Tehsil (गाँव/तहसील)
                    </label>
                    <input
                      type="text"
                      value={village}
                      onChange={(e) => setVillage(e.target.value)}
                      placeholder="e.g. Dindori"
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#1B4332] uppercase mb-1">
                      Land Area (Acres)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="0.5"
                      value={farmSize}
                      onChange={(e) => setFarmSize(parseFloat(e.target.value) || 1)}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-xs font-semibold font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#1B4332] uppercase mb-1">
                    Primary Crop (मुख्य फसल)
                  </label>
                  <select
                    value={primaryCrop}
                    onChange={(e) => setPrimaryCrop(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-xs font-semibold bg-white"
                  >
                    <option value="potato">Potato (आलू)</option>
                    <option value="tomato">Tomato (टमाटर)</option>
                    <option value="rice">Rice / Paddy (धान)</option>
                    <option value="wheat">Wheat (गेहूं)</option>
                    <option value="cotton">Cotton (कपास)</option>
                    <option value="chilli">Chilli (मिर्च)</option>
                    <option value="mustard">Mustard (सरसों)</option>
                    <option value="sugarcane">Sugarcane (गन्ना)</option>
                    <option value="maize">Maize (मक्का)</option>
                    <option value="onion">Onion (प्याज़)</option>
                  </select>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className="w-1/3 py-2 border border-neutral-300 rounded-lg text-xs font-bold text-neutral-700 hover:bg-neutral-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-2/3 py-2 bg-[#1B4332] hover:bg-[#2D6A4F] text-white rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              /* Verified Digital Kisan ID Card */
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-[#1B4332] to-[#081C15] text-[#FAF7F0] rounded-2xl p-4 sm:p-5 border border-[#D4A24E]/50 shadow-lg relative overflow-hidden">
                  <div className="flex items-center justify-between pb-3 border-b border-[#D4A24E]/30">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[11px] font-mono uppercase tracking-wider text-[#D4A24E] font-bold">
                        KRISHI KISAN CARD
                      </span>
                    </div>
                    <span className="text-[10px] font-mono bg-[#D4A24E] text-[#081C15] font-black px-2 py-0.5 rounded">
                      {currentUser.farmerIdCode}
                    </span>
                  </div>

                  <div className="py-3">
                    <h4 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                      {currentUser.name}
                    </h4>
                    <p className="text-xs text-[#FAF7F0]/80 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-[#D4A24E]" />
                      <span>
                        {currentUser.village ? `${currentUser.village}, ` : ''}{currentUser.district}, {currentUser.state}
                      </span>
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/10 text-center">
                    <div className="bg-black/30 p-2 rounded-lg">
                      <span className="text-[10px] text-neutral-400 block font-medium">Mobile</span>
                      <span className="text-xs font-mono font-bold text-white">+91 {currentUser.phone}</span>
                    </div>
                    <div className="bg-black/30 p-2 rounded-lg">
                      <span className="text-[10px] text-neutral-400 block font-medium">Land Holding</span>
                      <span className="text-xs font-bold text-[#D4A24E]">{currentUser.farmSizeAcres} Acres</span>
                    </div>
                    <div className="bg-black/30 p-2 rounded-lg">
                      <span className="text-[10px] text-neutral-400 block font-medium">Primary Crop</span>
                      <span className="text-xs font-bold text-white capitalize">{currentUser.primaryCrop}</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-emerald-900">Synchronized Diagnostics Archive</p>
                    <p className="text-[11px] text-emerald-800 leading-relaxed mt-0.5">
                      All your leaf pathology tests, custom pesticide dosages, spray schedules, and weather alerts are linked to this profile.
                    </p>
                  </div>
                </div>

                {/* Profile Controls */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-neutral-100">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(true)}
                      className="px-3 py-1.5 rounded-lg border border-neutral-300 hover:bg-neutral-100 text-neutral-700 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Profile</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onLogout();
                        setIsOtpStep(false);
                        setActiveTab('signin');
                      }}
                      className="px-3 py-1.5 rounded-lg border border-red-200 text-red-700 hover:bg-red-50 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-1.5 rounded-lg bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            )
          ) : isOtpStep ? (
            /* VIEW 2: OTP Verification Screen */
            <form onSubmit={handleVerifyOtp} className="space-y-4 text-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-center mx-auto shadow-2xs">
                <Smartphone className="w-7 h-7" />
              </div>

              <div>
                <h4 className="text-base font-extrabold text-[#1B4332]">
                  {currentLang === 'hi' ? 'OTP सत्यापन कोड दर्ज करें' : 'Verify Mobile Number'}
                </h4>
                <p className="text-xs text-neutral-600 mt-1">
                  4-digit verification code sent to <strong>+91 {pendingUser?.phone || phoneNumber}</strong>
                </p>
              </div>

              <div className="py-2">
                <input
                  type="text"
                  maxLength={4}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="4882"
                  className="w-40 mx-auto px-4 py-2.5 border-2 border-[#1B4332] rounded-xl text-center text-2xl font-mono font-black tracking-widest focus:outline-none focus:ring-4 focus:ring-[#D4A24E]/30 bg-white"
                  required
                  autoFocus
                />
                <div className="flex items-center justify-center gap-1.5 text-xs text-neutral-500 mt-2 font-medium">
                  <span>Demo Test OTP:</span>
                  <button
                    type="button"
                    onClick={() => setOtpCode('4882')}
                    className="font-mono font-bold text-[#1B4332] bg-[#FAF7F0] border border-[#D4A24E]/40 px-2 py-0.5 rounded cursor-pointer hover:bg-[#D4A24E]/20"
                  >
                    4882 (Click to insert)
                  </button>
                </div>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOtpStep(false)}
                  className="w-1/3 py-2.5 border border-neutral-300 rounded-xl text-xs font-bold text-neutral-700 hover:bg-neutral-50 cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2.5 bg-[#D4A24E] hover:bg-[#C2903C] text-[#081C15] rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md active:scale-98 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verify & Login</span>
                </button>
              </div>
            </form>
          ) : activeTab === 'signin' ? (
            /* VIEW 3: Fast Sign In with Phone */
            <form onSubmit={handleSignInSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-[#1B4332] uppercase tracking-wider mb-1.5">
                  Mobile Number (किसान मोबाइल नंबर)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500 text-sm font-bold">
                    +91
                  </div>
                  <input
                    type="tel"
                    maxLength={10}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="98765 43210"
                    className="w-full pl-12 pr-3 py-2.5 border border-neutral-300 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#1B4332] focus:border-transparent font-mono"
                    required
                    autoFocus
                  />
                </div>
                <p className="text-[11px] text-neutral-500 mt-1.5 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Instant sign in with OTP. New numbers auto-route to registration.</span>
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#1B4332] hover:bg-[#2D6A4F] text-white rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 cursor-pointer"
              >
                <span>Proceed to Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
                <span>Don't have an account?</span>
                <button
                  type="button"
                  onClick={() => setActiveTab('register')}
                  className="font-bold text-[#1B4332] hover:underline cursor-pointer"
                >
                  Register New Farmer →
                </button>
              </div>
            </form>
          ) : activeTab === 'register' ? (
            /* VIEW 4: Detailed Farmer Registration */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-extrabold text-[#1B4332] uppercase mb-1">
                  Farmer Full Name (किसान का पूरा नाम) *
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar Patel"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-[#1B4332] uppercase mb-1">
                  Mobile Number (मोबाइल नंबर) *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500 text-xs font-bold">
                    +91
                  </div>
                  <input
                    type="tel"
                    maxLength={10}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="98765 43210"
                    className="w-full pl-11 pr-3 py-2 border border-neutral-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#1B4332] font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-extrabold text-[#1B4332] uppercase mb-1">
                    State / UT (राज्य) *
                  </label>
                  <select
                    value={state}
                    onChange={(e) => handleStateChange(e.target.value)}
                    className="w-full px-2 py-2 border border-neutral-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#1B4332] bg-white"
                  >
                    <optgroup label="States (राज्य)">
                      {INDIAN_STATES_AND_UT.filter(s => !s.code.match(/AN|CH|DN|DL|JK|LA|LD|PY/)).map((s) => (
                        <option key={s.code} value={s.nameEn}>
                          {s.nameEn} ({s.nameHi})
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Union Territories (केंद्र शासित प्रदेश)">
                      {INDIAN_STATES_AND_UT.filter(s => s.code.match(/AN|CH|DN|DL|JK|LA|LD|PY/)).map((s) => (
                        <option key={s.code} value={s.nameEn}>
                          {s.nameEn}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-[#1B4332] uppercase mb-1">
                    District (जिला) *
                  </label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-2 py-2 border border-neutral-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#1B4332] bg-white"
                  >
                    {currentStateObj.districts.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-extrabold text-[#1B4332] uppercase mb-1">
                    Village / Block (गाँव / ब्लॉक)
                  </label>
                  <input
                    type="text"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    placeholder="e.g. Rampur"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-[#1B4332] uppercase mb-1">
                    Land Area (Acres)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    value={farmSize}
                    onChange={(e) => setFarmSize(parseFloat(e.target.value) || 1)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-xl text-xs font-semibold font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-[#1B4332] uppercase mb-1">
                  Primary Crop (मुख्य फसल)
                </label>
                <select
                  value={primaryCrop}
                  onChange={(e) => setPrimaryCrop(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-xl text-xs font-semibold bg-white"
                >
                  <option value="potato">Potato (आलू)</option>
                  <option value="tomato">Tomato (टमाटर)</option>
                  <option value="rice">Rice / Paddy (धान)</option>
                  <option value="wheat">Wheat (गेहूं)</option>
                  <option value="cotton">Cotton (कपास)</option>
                  <option value="chilli">Chilli (मिर्च)</option>
                  <option value="mustard">Mustard (सरसों)</option>
                  <option value="sugarcane">Sugarcane (गन्ना)</option>
                  <option value="maize">Maize (मक्का)</option>
                  <option value="onion">Onion (प्याज़)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#1B4332] hover:bg-[#2D6A4F] text-white rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 cursor-pointer mt-2"
              >
                <span>Register & Proceed</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* VIEW 5: 1-Click Instant Demo Profiles */
            <div className="space-y-2.5">
              <div className="p-3 bg-[#FAF7F0] border border-[#D4A24E]/30 rounded-xl text-xs text-neutral-700">
                <p className="font-bold text-[#1B4332] flex items-center gap-1.5 mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4A24E]" />
                  <span>Pre-configured Farmer Profiles for Testing:</span>
                </p>
                <p className="text-[11px] text-neutral-600">
                  Select any profile below to instantly log in and test diagnosis, regional dosers, and scan history.
                </p>
              </div>

              <div className="space-y-2">
                {PRESET_SAMPLE_USERS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleQuickDemoLogin(preset)}
                    className="w-full p-3 text-left rounded-xl bg-white hover:bg-[#FAF7F0] border border-neutral-200 hover:border-[#D4A24E] text-xs transition-all flex items-center justify-between cursor-pointer group shadow-2xs"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-[#1B4332] text-sm group-hover:text-emerald-800">
                          {preset.name}
                        </span>
                        <span className="text-[10px] font-mono bg-neutral-100 text-neutral-700 px-1.5 py-0.2 rounded">
                          {preset.farmerIdCode}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-500">
                        {preset.village ? `${preset.village}, ` : ''}{preset.district}, {preset.state} • <span className="capitalize font-semibold text-emerald-800">{preset.primaryCrop}</span> ({preset.farmSizeAcres} Ac)
                      </p>
                    </div>
                    <span className="text-[11px] font-bold bg-[#1B4332] text-[#D4A24E] px-3 py-1 rounded-lg shadow-2xs group-hover:bg-[#D4A24E] group-hover:text-[#081C15] transition-colors">
                      Switch In →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
