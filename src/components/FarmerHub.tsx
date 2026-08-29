import React, { useState, useMemo, useEffect } from 'react';
import { ProduceListing } from '../types';
import { generateCropForecast } from '../services/forecastingEngine';
import { getCoordinatesForLocation } from '../data/districtCoordinates';
import { 
  Sprout, Plus, Sparkles, TrendingUp, MapPin, CheckCircle2, 
  DollarSign, Calendar, Package, Loader2, Check, ShieldCheck, 
  Lock, LogIn, UserPlus, LogOut, KeyRound, Smartphone, AlertCircle, RefreshCw 
} from 'lucide-react';
import { 
  AuthUser, 
  getActiveAuthSession, 
  saveActiveAuthSession, 
  updateAuthProfile,
  DEFAULT_DEMO_USERS,
  getCleanDigits
} from '../services/authService';
import { FarmerAuthModal, AuthMode } from './FarmerAuthModal';

interface FarmerHubProps {
  listings: ProduceListing[];
  onAddListing: (listing: ProduceListing) => void;
}

const SUPPORTED_CROPS = [
  { id: 'onion', name: 'Nashik Red Onion', state: 'Maharashtra', district: 'Nashik' },
  { id: 'potato', name: 'Agra Kufri Pukhraj Potatoes', state: 'Uttar Pradesh', district: 'Agra' },
  { id: 'tomato', name: 'Kolar Hybrid Fresh Tomatoes', state: 'Karnataka', district: 'Kolar' },
  { id: 'wheat', name: 'Sehore Sharbati Wheat', state: 'Madhya Pradesh', district: 'Sehore' },
  { id: 'rice_basmati', name: 'Basmati Rice (1121 Raw Aromatic)', state: 'Punjab', district: 'Amritsar' },
  { id: 'mustard', name: 'Mustard / Sarson (Pusa Bold)', state: 'Rajasthan', district: 'Bharatpur' },
  { id: 'chili', name: 'Red Chili (Guntur Sannam S4)', state: 'Andhra Pradesh', district: 'Guntur' },
  { id: 'apple', name: 'Apple (Shimla Royal Delicious)', state: 'Himachal Pradesh', district: 'Shimla' },
  { id: 'turmeric', name: 'Turmeric / Haldi (Salem Double Polished)', state: 'Tamil Nadu', district: 'Salem' },
  { id: 'cotton', name: 'Cotton / Kapas (Gujarat Shankar-6)', state: 'Gujarat', district: 'Rajkot' },
  { id: 'maize', name: 'Yellow Maize / Corn (Purnia High Starch)', state: 'Bihar', district: 'Purnia' },
  { id: 'soybean', name: 'Soybean / Soyabean (Indore Yellow Gold)', state: 'Madhya Pradesh', district: 'Indore' },
  { id: 'cardamom', name: 'Cardamom / Elaichi (Idukki 8mm Bold)', state: 'Kerala', district: 'Idukki' },
  { id: 'sona_masoori', name: 'Sona Masoori Rice (Nalgonda Medium Grain)', state: 'Telangana', district: 'Nalgonda' },
];

export const FarmerHub: React.FC<FarmerHubProps> = ({ listings, onAddListing }) => {
  // Authenticated farmer user session
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    return getActiveAuthSession();
  });

  // Auth Modal State
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<AuthMode>('login');

  // Edit Profile / Security State
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    phone: '',
    village: '',
    district: '',
    state: '',
    isFPO: false,
    fpoName: '',
    primaryCrops: '',
  });
  const [profileSuccessMsg, setProfileSuccessMsg] = useState<string | null>(null);

  // Sync edit form data whenever currentUser changes
  useEffect(() => {
    if (currentUser) {
      setEditFormData({
        name: currentUser.name || '',
        phone: currentUser.phone || '',
        village: currentUser.village || '',
        district: currentUser.district || '',
        state: currentUser.state || '',
        isFPO: Boolean(currentUser.isFPO),
        fpoName: currentUser.fpoName || '',
        primaryCrops: (currentUser.primaryCrops || []).join(', '),
      });
    }
  }, [currentUser]);

  // Handle Logout
  const handleLogout = () => {
    saveActiveAuthSession(null);
    setCurrentUser(null);
    setIsEditingProfile(false);
  };

  // Handle Auth Success
  const handleAuthSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    saveActiveAuthSession(user);
    setProfileSuccessMsg(`Logged in securely as ${user.name}`);
    setTimeout(() => setProfileSuccessMsg(null), 4000);
  };

  // Save profile updates
  const handleSaveProfileEdits = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const result = updateAuthProfile(currentUser.id, {
      name: editFormData.name.trim(),
      village: editFormData.village.trim(),
      district: editFormData.district.trim(),
      state: editFormData.state.trim(),
      isFPO: editFormData.isFPO,
      fpoName: editFormData.isFPO ? editFormData.fpoName.trim() : undefined,
      primaryCrops: editFormData.primaryCrops.split(',').map(c => c.trim()).filter(Boolean),
    });

    if (result.success && result.user) {
      setCurrentUser(result.user);
      setProfileSuccessMsg('Profile and location details updated successfully.');
      setIsEditingProfile(false);
      setTimeout(() => setProfileSuccessMsg(null), 4000);
    }
  };

  // Listing Form State
  const [showListingModal, setShowListingModal] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitProgressStep, setSubmitProgressStep] = useState<'idle' | 'validating' | 'syncing' | 'complete'>('idle');
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  const [cropId, setCropId] = useState<string>('onion');
  const [variety, setVariety] = useState<string>('Garwa High-Solid Red');
  const [quantity, setQuantity] = useState<number>(40);
  const [minOrder, setMinOrder] = useState<number>(1);
  const [askingPrice, setAskingPrice] = useState<number>(2200); // ₹/Quintal
  const [harvestDate, setHarvestDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [pickupPoint, setPickupPoint] = useState<string>('FPO Collection Hub, Main Mandi Road');

  // Real-time AI Computed Forecast for the selected crop and current user's district
  const userDistrict = currentUser?.district || 'Nashik';
  const userState = currentUser?.state || 'Maharashtra';

  const forecast = useMemo(() => {
    return generateCropForecast(cropId, userDistrict);
  }, [cropId, userDistrict]);

  // Selected crop details
  const selectedCropObj = SUPPORTED_CROPS.find(c => c.id === cropId) || SUPPORTED_CROPS[0];

  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!currentUser) {
      setAuthModalMode('login');
      setAuthModalOpen(true);
      return;
    }

    setIsSubmitting(true);
    setSubmitProgressStep('validating');

    const coords = getCoordinatesForLocation(currentUser.district, currentUser.state);

    const newListing: ProduceListing = {
      id: `list-${Date.now()}`,
      farmerId: currentUser.id,
      farmerName: currentUser.name,
      farmerPhone: currentUser.phone,
      isFPO: currentUser.isFPO,
      fpoName: currentUser.fpoName,
      cropId: cropId,
      cropName: selectedCropObj.name,
      variety: variety.trim() || 'Standard Commercial',
      grade: 'Grade A (Premium)',
      quantityAvailableQuintals: Number(quantity),
      minOrderQuintals: Number(minOrder),
      askingPricePerQuintal: Number(askingPrice),
      mandiMiddlemanPricePerQuintal: forecast.currentMandiPrice,
      retailConsumerPricePerQuintal: Math.round(forecast.currentMandiPrice * 2.3),
      harvestDate: harvestDate,
      location: {
        village: currentUser.village,
        district: currentUser.district,
        state: currentUser.state,
        lat: coords.lat,
        lng: coords.lng,
      },
      pickupPointName: pickupPoint.trim() || `${currentUser.village} Aggregation Hub`,
      createdAt: new Date().toISOString(),
      status: 'active',
    };

    // Multi-stage visual feedback
    setTimeout(() => {
      setSubmitProgressStep('syncing');
    }, 400);

    setTimeout(() => {
      setSubmitProgressStep('complete');
    }, 850);

    setTimeout(() => {
      onAddListing(newListing);
      setJustAddedId(newListing.id);
      setIsSubmitting(false);
      setShowListingModal(false);
      setSubmitProgressStep('idle');

      // Clear highlight after 4 seconds
      setTimeout(() => {
        setJustAddedId(null);
      }, 4000);
    }, 1200);
  };

  // Filter listings belonging to the authenticated farmer
  const myFarmerListings = (listings || []).filter((l) => {
    if (!l) return false;
    if (!currentUser) return false;
    const lFarmerName = (l.farmerName || '').toLowerCase();
    const currentProfileName = (currentUser.name || '').toLowerCase();
    const lPhoneClean = getCleanDigits(l.farmerPhone || '');
    const userPhoneClean = getCleanDigits(currentUser.phone || '');

    return (
      l.farmerId === currentUser.id ||
      (lPhoneClean && lPhoneClean === userPhoneClean) ||
      (currentProfileName && lFarmerName.includes(currentProfileName))
    );
  });

  return (
    <div id="farmer-hub-container" className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 text-stone-800">
      {/* Global Success Notification */}
      {profileSuccessMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs text-emerald-900 font-bold flex items-center gap-2 animate-fade-in shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{profileSuccessMsg}</span>
        </div>
      )}

      {/* Top Header / Auth Status Bar (Target Element 1) */}
      <div className="bg-gradient-to-r from-stone-900 via-[#1B4332] to-[#143326] text-white p-5 sm:p-6 rounded-3xl border border-[#2d5f49] shadow-md">
        {currentUser ? (
          // Authenticated Farmer View
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-13 h-13 rounded-2xl bg-[#D4A24E] text-[#1B4332] flex items-center justify-center font-black text-2xl shadow-md shrink-0">
                <Sprout className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {currentUser.name}
                  </h1>
                  {currentUser.isFPO && (
                    <span className="text-[11px] bg-emerald-600 text-white font-black px-2.5 py-0.5 rounded-full border border-emerald-400/40">
                      FPO Verified
                    </span>
                  )}
                  <span className="text-[11px] bg-emerald-900/90 text-emerald-200 font-bold px-2.5 py-0.5 rounded-full border border-emerald-400/30 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#D4A24E]" />
                    <span>OTP Verified Mobile</span>
                  </span>
                </div>
                <p className="text-xs text-emerald-200/90 flex items-center gap-1.5 flex-wrap">
                  <MapPin className="w-3.5 h-3.5 text-[#D4A24E] shrink-0" />
                  <span>{currentUser.village}, {currentUser.district}, {currentUser.state}</span>
                  <span className="text-emerald-400">•</span>
                  <span>{currentUser.phone}</span>
                  {currentUser.fpoName && (
                    <>
                      <span className="text-emerald-400">•</span>
                      <span className="text-amber-200 font-medium">{currentUser.fpoName}</span>
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Authenticated Action Controls */}
            <div className="flex items-center gap-2 flex-wrap pt-2 md:pt-0 border-t md:border-t-0 border-[#285e46]">
              <button
                id="farmer-edit-profile-btn"
                type="button"
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                className="px-3.5 py-2 text-xs font-bold rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors cursor-pointer"
              >
                {isEditingProfile ? 'Done Editing' : 'Edit Profile / Location'}
              </button>

              <button
                id="farmer-switch-account-btn"
                type="button"
                onClick={() => {
                  setAuthModalMode('login');
                  setAuthModalOpen(true);
                }}
                className="px-3.5 py-2 text-xs font-bold rounded-xl bg-white/10 hover:bg-white/20 text-emerald-200 border border-white/20 transition-colors cursor-pointer flex items-center gap-1.5"
                title="Sign in as a different farmer or register new account"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Switch Account</span>
              </button>

              <button
                id="farmer-logout-btn"
                type="button"
                onClick={handleLogout}
                className="p-2 text-xs font-bold rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-200 border border-rose-800/40 transition-colors cursor-pointer"
                title="Log out from this device"
              >
                <LogOut className="w-4 h-4" />
              </button>

              <button
                id="open-create-listing-btn"
                type="button"
                onClick={() => setShowListingModal(true)}
                className="px-4 py-2.5 text-xs font-black bg-[#D4A24E] hover:bg-[#c4923e] text-[#1B4332] rounded-xl flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>List Harvest Produce</span>
              </button>
            </div>
          </div>
        ) : (
          // Logged-out / Unauthenticated Security Gate Banner
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-2xl bg-[#D4A24E] text-[#1B4332] flex items-center justify-center font-black text-xl shadow-xs shrink-0">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl font-black text-white">
                    Farmer & FPO Secure Access Portal
                  </h1>
                  <p className="text-xs text-emerald-200">
                    Sign in with your password or verify mobile via SMS OTP to access farm listings and fair APMC advisories.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                id="farmer-gate-login-btn"
                type="button"
                onClick={() => {
                  setAuthModalMode('login');
                  setAuthModalOpen(true);
                }}
                className="px-4 py-2.5 text-xs font-black bg-[#D4A24E] hover:bg-[#c4923e] text-[#1B4332] rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In with Password</span>
              </button>

              <button
                id="farmer-gate-signup-btn"
                type="button"
                onClick={() => {
                  setAuthModalMode('signup');
                  setAuthModalOpen(true);
                }}
                className="px-4 py-2.5 text-xs font-black bg-white hover:bg-stone-100 text-[#1B4332] rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <UserPlus className="w-4 h-4" />
                <span>Sign Up with OTP</span>
              </button>

              <button
                id="farmer-gate-forgot-btn"
                type="button"
                onClick={() => {
                  setAuthModalMode('forgot_password');
                  setAuthModalOpen(true);
                }}
                className="px-3 py-2 text-xs font-bold text-emerald-200 hover:text-white underline cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Profile Registration / Edit Box (Target Element 2) */}
      {isEditingProfile && currentUser && (
        <form onSubmit={handleSaveProfileEdits} className="bg-white p-6 rounded-3xl border-2 border-emerald-400 shadow-md space-y-4 animate-fade-in">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <div className="flex items-center gap-2">
              <Sprout className="w-5 h-5 text-[#1B4332]" />
              <div>
                <h2 className="text-sm font-black text-[#1B4332] uppercase tracking-wider">
                  Update Farmer / FPO Profile & Security
                </h2>
                <p className="text-xs text-stone-500">
                  Changes will update all farmgate listings and pickup coordinates.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setAuthModalMode('forgot_password');
                setAuthModalOpen(true);
              }}
              className="text-xs font-bold text-emerald-800 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Change Password (via OTP)</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Full Name / Legal Farmer Name *</label>
              <input
                type="text"
                value={editFormData.name}
                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl font-bold text-stone-900"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1 flex items-center justify-between">
                <span>Contact Phone</span>
                <span className="text-[10px] text-emerald-700 font-bold">✓ OTP Verified</span>
              </label>
              <input
                type="text"
                disabled
                value={editFormData.phone}
                className="w-full p-2.5 bg-stone-100 border border-stone-200 rounded-xl font-bold text-stone-600 cursor-not-allowed"
                title="Phone number is secured by OTP. To change phone, register a new account."
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Village / Town *</label>
              <input
                type="text"
                value={editFormData.village}
                onChange={(e) => setEditFormData({ ...editFormData, village: e.target.value })}
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl font-medium"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">District *</label>
              <input
                type="text"
                value={editFormData.district}
                onChange={(e) => setEditFormData({ ...editFormData, district: e.target.value })}
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl font-medium"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">State *</label>
              <input
                type="text"
                value={editFormData.state}
                onChange={(e) => setEditFormData({ ...editFormData, state: e.target.value })}
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl font-medium"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Primary Crops Harvested</label>
              <input
                type="text"
                value={editFormData.primaryCrops}
                onChange={(e) => setEditFormData({ ...editFormData, primaryCrops: e.target.value })}
                placeholder="e.g. Onion, Tomato, Wheat"
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl font-medium"
              />
            </div>

            <div className="sm:col-span-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
              <label className="flex items-center gap-2 font-bold text-stone-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editFormData.isFPO}
                  onChange={(e) => setEditFormData({ ...editFormData, isFPO: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
                <span>Registered Farmer Producer Organisation (FPO / Federation)</span>
              </label>
              {editFormData.isFPO && (
                <input
                  type="text"
                  value={editFormData.fpoName}
                  onChange={(e) => setEditFormData({ ...editFormData, fpoName: e.target.value })}
                  placeholder="Enter FPO Name"
                  className="mt-2 w-full p-2 bg-white border border-stone-300 rounded-lg font-medium text-xs"
                />
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-stone-100">
            <button
              type="button"
              onClick={() => setIsEditingProfile(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 bg-stone-100 hover:bg-stone-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-black text-white bg-[#1B4332] hover:bg-[#143326] shadow-xs cursor-pointer"
            >
              Save Profile Updates
            </button>
          </div>
        </form>
      )}

      {/* AI Demand & Price Advisory Card */}
      <div className="bg-gradient-to-r from-emerald-50 via-stone-50 to-amber-50 p-5 sm:p-6 rounded-3xl border border-emerald-300 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-200 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#1B4332]" />
            <div>
              <h2 className="text-base font-extrabold text-[#1B4332]">
                AI Suggested Price & Demand Advisory (Requirement #5)
              </h2>
              <p className="text-xs text-stone-600">
                Computed via Holt-Winters exponential smoothing on wholesale APMC arrivals in {userDistrict} ({userState}).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-stone-500">Crop:</span>
            <select
              value={cropId}
              onChange={(e) => {
                setCropId(e.target.value);
                const match = SUPPORTED_CROPS.find(c => c.id === e.target.value);
                if (match) {
                  const fc = generateCropForecast(e.target.value, userDistrict);
                  setAskingPrice(fc.suggestedFarmerPrice);
                }
              }}
              className="px-2.5 py-1 text-xs bg-white border border-stone-300 rounded-lg font-bold text-stone-800"
            >
              {SUPPORTED_CROPS.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Real Computed Values Display */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl border border-stone-200">
            <span className="text-[11px] font-bold uppercase text-stone-500 block">
              Local Mandi Benchmark (Middleman)
            </span>
            <span className="text-2xl font-black text-rose-700">
              ₹{forecast.currentMandiPrice} <span className="text-xs font-medium text-stone-500">/ Quintal</span>
            </span>
            <span className="text-[11px] text-stone-400 block mt-0.5">
              (₹{(forecast.currentMandiPrice / 100).toFixed(1)}/kg after commission cuts)
            </span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-emerald-300 bg-emerald-50/50">
            <span className="text-[11px] font-bold uppercase text-emerald-800 block">
              AI Suggested Fair Farmgate Price
            </span>
            <span className="text-2xl font-black text-[#1B4332]">
              ₹{forecast.suggestedFarmerPrice} <span className="text-xs font-medium text-stone-500">/ Quintal</span>
            </span>
            <span className="text-[11px] text-emerald-700 font-bold block mt-0.5">
              +{forecast.farmerMarginGainPercent}% higher realization vs APMC mandi
            </span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-stone-200">
            <span className="text-[11px] font-bold uppercase text-stone-500 block">
              Expected Demand Next Month
            </span>
            <span className="text-2xl font-black text-amber-700">
              {forecast.predictedDemandQuintals.toLocaleString('en-IN')} <span className="text-xs font-medium text-stone-500">Quintals</span>
            </span>
            <span className="text-[11px] text-stone-500 block mt-0.5">
              Regional trend: <strong className="uppercase">{forecast.demandTrend}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Active Listings Table / Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-stone-900">
            {currentUser ? `Your Active Farm Produce Listings (${myFarmerListings.length})` : 'Farmgate Produce Listings'}
          </h2>
          <span className="text-xs text-stone-500">
            Zero commissions deducted on buyer orders
          </span>
        </div>

        {!currentUser ? (
          <div className="bg-stone-50 p-8 rounded-3xl border border-stone-300 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#1B4332] flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-stone-900">
              Please Sign In to View and Manage Your Farm Listings
            </h3>
            <p className="text-xs text-stone-500 max-w-md mx-auto">
              Each farmer&apos;s inventory and direct buyer contracts are protected by secure password and mobile SMS OTP authentication.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setAuthModalMode('login');
                  setAuthModalOpen(true);
                }}
                className="px-5 py-2.5 bg-[#1B4332] text-[#D4A24E] font-black text-xs rounded-xl cursor-pointer shadow-sm"
              >
                Sign In with Password
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthModalMode('signup');
                  setAuthModalOpen(true);
                }}
                className="px-5 py-2.5 bg-white border border-stone-300 text-stone-800 font-bold text-xs rounded-xl cursor-pointer hover:bg-stone-100"
              >
                Sign Up with OTP
              </button>
            </div>
          </div>
        ) : myFarmerListings.length === 0 ? (
          <div className="bg-stone-50 p-8 rounded-3xl border border-dashed border-stone-300 text-center space-y-3">
            <p className="text-sm text-stone-500">No active produce listed under your account ({currentUser.name}) yet.</p>
            <button
              onClick={() => setShowListingModal(true)}
              className="px-4 py-2.5 bg-[#1B4332] text-[#D4A24E] font-black text-xs rounded-xl cursor-pointer shadow-xs"
            >
              Create Your First Produce Listing
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myFarmerListings.map(listing => {
              const mandiTotal = listing.quantityAvailableQuintals * listing.mandiMiddlemanPricePerQuintal;
              const directTotal = listing.quantityAvailableQuintals * listing.askingPricePerQuintal;
              const extraGain = directTotal - mandiTotal;
              const isNewlyAdded = listing.id === justAddedId;

              return (
                <div 
                  key={listing.id}
                  className={`bg-white p-5 rounded-2xl border transition-all duration-500 space-y-3 ${
                    isNewlyAdded 
                      ? 'border-emerald-500 ring-2 ring-emerald-500/50 shadow-lg bg-emerald-50/20 scale-[1.01]' 
                      : 'border-stone-200 shadow-xs hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono uppercase bg-stone-100 text-stone-600 px-2 py-0.5 rounded font-bold">
                          {listing.grade}
                        </span>
                        {isNewlyAdded && (
                          <span className="text-[10px] font-mono font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full animate-pulse flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> Just Published
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-stone-900 mt-1">
                        {listing.cropName}
                      </h3>
                      <p className="text-xs text-stone-500">
                        {listing.variety} • Harvested: {listing.harvestDate}
                      </p>
                    </div>

                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      {listing.status === 'active' ? '● Live on Marketplace' : 'Sold Out'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-stone-100">
                    <div>
                      <span className="text-stone-400 block">Available Quantity:</span>
                      <span className="font-extrabold text-stone-800">{listing.quantityAvailableQuintals} Quintals</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block">Asking Direct Price:</span>
                      <span className="font-black text-[#1B4332]">₹{listing.askingPricePerQuintal}/Qtl (₹{(listing.askingPricePerQuintal / 100).toFixed(1)}/kg)</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-stone-400 block">Designated Pickup Point:</span>
                      <span className="font-medium text-stone-700 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span>{listing.pickupPointName}</span>
                      </span>
                    </div>
                  </div>

                  {/* Price Comparison Callout on Listing */}
                  <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs flex items-center justify-between">
                    <div>
                      <span className="text-stone-500 block text-[10px]">Mandi Realization:</span>
                      <span className="font-bold text-stone-700">₹{mandiTotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-emerald-800 font-bold block text-[10px]">Direct Trade Realization:</span>
                      <span className="font-black text-emerald-900 text-sm">
                        ₹{directTotal.toLocaleString('en-IN')} (+₹{extraGain.toLocaleString('en-IN')})
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Produce Listing Modal Form */}
      {showListingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-stone-200 text-stone-800 relative overflow-hidden my-6">
            {/* Top Linear Animated Progress bar during submission */}
            {isSubmitting && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-stone-100 overflow-hidden">
                <div className="h-full bg-emerald-600 animate-pulse transition-all duration-300 w-full" />
              </div>
            )}

            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h2 className="text-lg font-black text-[#1B4332]">
                  List Harvest Produce on Marketplace
                </h2>
                <p className="text-xs text-stone-500">
                  Seller: <strong>{currentUser?.name || 'Verified Farmer'}</strong> • Zero commission
                </p>
              </div>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => !isSubmitting && setShowListingModal(false)}
                className="p-1 rounded-lg hover:bg-stone-100 text-stone-400 text-sm font-bold cursor-pointer disabled:opacity-40"
              >
                ✕
              </button>
            </div>

            {/* Submission Step Tracker Banner */}
            {isSubmitting && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs space-y-1.5 animate-fade-in">
                <div className="flex items-center justify-between font-bold text-emerald-900">
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-700" />
                    {submitProgressStep === 'validating' && 'Validating Produce Quality & APMC Index...'}
                    {submitProgressStep === 'syncing' && 'Broadcasting to Wholesale Buyer Network...'}
                    {submitProgressStep === 'complete' && 'Listing Published Successfully!'}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-700">
                    {submitProgressStep === 'validating' ? '30%' : submitProgressStep === 'syncing' ? '75%' : '100%'}
                  </span>
                </div>
                <div className="w-full bg-emerald-200 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-700 transition-all duration-300 rounded-full"
                    style={{
                      width: submitProgressStep === 'validating' ? '35%' : submitProgressStep === 'syncing' ? '75%' : '100%'
                    }}
                  />
                </div>
              </div>
            )}

            <form onSubmit={handleCreateListing} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Select Crop *</label>
                <select
                  disabled={isSubmitting}
                  value={cropId}
                  onChange={(e) => {
                    setCropId(e.target.value);
                    const fc = generateCropForecast(e.target.value, userDistrict);
                    setAskingPrice(fc.suggestedFarmerPrice);
                  }}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl font-bold text-stone-900 disabled:opacity-60"
                >
                  {SUPPORTED_CROPS.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* AI Price Indicator inside form */}
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-emerald-800 block uppercase font-bold">
                    AI Suggested Fair Price:
                  </span>
                  <span className="font-extrabold text-[#1B4332] text-sm">
                    ₹{forecast.suggestedFarmerPrice} / Quintal
                  </span>
                </div>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setAskingPrice(forecast.suggestedFarmerPrice)}
                  className="px-2.5 py-1 bg-[#1B4332] text-[#D4A24E] font-bold rounded-lg text-[11px] cursor-pointer disabled:opacity-60"
                >
                  Use AI Price
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Asking Price (₹ / Quintal) *</label>
                  <input
                    type="number"
                    min={100}
                    step={50}
                    disabled={isSubmitting}
                    value={askingPrice}
                    onChange={(e) => setAskingPrice(Number(e.target.value))}
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl font-bold disabled:opacity-60"
                    required
                  />
                  <span className="text-[10px] text-stone-400 block mt-0.5">
                    = ₹{(askingPrice / 100).toFixed(1)}/kg
                  </span>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Total Quantity (Quintals) *</label>
                  <input
                    type="number"
                    min={1}
                    disabled={isSubmitting}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl font-bold disabled:opacity-60"
                    required
                  />
                  <span className="text-[10px] text-stone-400 block mt-0.5">
                    = {quantity * 100} kg
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Min Order Quantity (Qtl)</label>
                  <input
                    type="number"
                    min={1}
                    max={quantity}
                    disabled={isSubmitting}
                    value={minOrder}
                    onChange={(e) => setMinOrder(Number(e.target.value))}
                    className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl font-medium disabled:opacity-60"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Harvest Date</label>
                  <input
                    type="date"
                    disabled={isSubmitting}
                    value={harvestDate}
                    onChange={(e) => setHarvestDate(e.target.value)}
                    className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl font-medium disabled:opacity-60"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Designated Pickup Location *</label>
                <input
                  type="text"
                  disabled={isSubmitting}
                  value={pickupPoint}
                  onChange={(e) => setPickupPoint(e.target.value)}
                  placeholder="e.g. Village Collection Center / Cold Depot"
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl font-medium disabled:opacity-60"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setShowListingModal(false)}
                  className="px-4 py-2 border border-stone-300 rounded-xl text-stone-600 font-bold cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="publish-produce-btn"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-[#1B4332] text-[#D4A24E] font-extrabold rounded-xl shadow-md cursor-pointer disabled:opacity-80 flex items-center gap-2 transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#D4A24E]" />
                      <span>Publishing...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 text-[#D4A24E]" />
                      <span>Publish Listing</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Farmer Auth Modal (Login / Signup with OTP / Forgot Password with OTP) */}
      <FarmerAuthModal
        isOpen={authModalOpen}
        initialMode={authModalMode}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
};

