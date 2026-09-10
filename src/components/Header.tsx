/* Editorial Fieldwork reminder: navigation is a working rail—quiet paper contrast, forest trust, brass action, no opaque status claims. */
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronDown,
  LogIn,
  LogOut,
  Menu,
  X,
  User,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  Sprout,
  Building2,
  ExternalLink,
} from 'lucide-react';
import { AuthUser } from '../services/authService';
import { CropCoderLogo } from './CropCoderLogo';

export type ActiveTab = 'home' | 'farmer' | 'buyer' | 'forecast' | 'logistics' | 'orders';

type AuthMode = 'login' | 'signup' | 'forgot_password';

interface HeaderProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  ordersCount: number;
  currentUser?: AuthUser | null;
  onLogout?: () => void;
  onAuth?: (mode?: AuthMode) => void;
  isSyncingWithDB?: boolean;
  isSupabaseConfigured?: boolean;
}

const navigation: Array<{ tab: ActiveTab; label: string; mobileLabel: string }> = [
  { tab: 'home', label: 'Overview', mobileLabel: 'Home' },
  { tab: 'farmer', label: 'Farmer / FPO', mobileLabel: 'Farmer' },
  { tab: 'buyer', label: 'Marketplace', mobileLabel: 'Buy' },
  { tab: 'forecast', label: 'Demand signals', mobileLabel: 'Forecast' },
  { tab: 'logistics', label: 'Route planner', mobileLabel: 'Routes' },
  { tab: 'orders', label: 'Orders', mobileLabel: 'Orders' },
];

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  ordersCount,
  currentUser,
  onLogout,
  onAuth,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setProfileOpen(false);
      }
    };
    if (profileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [profileOpen]);

  const selectTab = (tab: ActiveTab) => {
    onSelectTab(tab);
    setMobileOpen(false);
    setProfileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--forest)]/20 bg-[var(--paper)]/95 text-[var(--ink)] shadow-[0_4px_18px_rgba(18,61,45,0.07)] backdrop-blur-md">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="flex min-h-[76px] items-center justify-between gap-5">
          <button type="button" onClick={() => selectTab('home')} className="group flex min-w-0 items-center gap-3 text-left" aria-label="KishanDirect overview">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-black/40 bg-[#060907] shadow-[2.5px_2.5px_0_var(--brass)] transition-transform duration-200 group-hover:-translate-y-0.5">
              <CropCoderLogo size={44} className="h-full w-full" />
            </span>
            <span className="min-w-0">
              <span className="font-display text-2xl leading-none tracking-[-0.03em] text-[var(--forest)]">KishanDirect</span>
            </span>
          </button>

          <nav className="relative hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
            {navigation.map(({ tab, label }) => {
              const active = activeTab === tab;
              return (
                <button
                  key={tab}
                  id={`nav-tab-${tab}`}
                  type="button"
                  onClick={() => selectTab(tab)}
                  className={`nav-link relative ${active ? 'nav-link--active' : ''}`}
                  aria-current={active ? 'page' : undefined}
                >
                  <span className="relative z-10">{label}</span>
                  {tab === 'orders' && ordersCount > 0 && <span className="nav-badge relative z-10">{ordersCount}</span>}
                  {active && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      id="active-nav-indicator"
                      className="absolute bottom-0 left-2 right-2 h-[3px] rounded-full bg-[var(--forest)]"
                      transition={{
                        type: 'spring',
                        stiffness: 650,
                        damping: 36,
                      }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            {currentUser ? (
              <div className="relative" ref={profileRef}>
                {/* Clickable Profile / User / Login trigger button */}
                <button
                  id="header-user-profile-button"
                  type="button"
                  onClick={() => setProfileOpen((prev) => !prev)}
                  className={`group flex items-center gap-2 rounded-xl border px-2.5 py-1.5 text-left transition-all cursor-pointer ${
                    profileOpen
                      ? 'border-[var(--forest)] bg-white shadow-xs'
                      : 'border-[var(--line)] bg-[var(--paper-light)] hover:border-[var(--forest)]/50 hover:bg-white'
                  }`}
                  aria-expanded={profileOpen}
                  aria-haspopup="true"
                  aria-label={`User profile for ${currentUser.name}`}
                  title="View your profile and account"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--forest)] text-[var(--paper-light)] shadow-xs transition-transform group-hover:scale-105">
                    <User className="h-4 w-4" />
                  </div>
                  <div className="hidden sm:block max-w-[130px] min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="block truncate text-xs font-bold text-[var(--ink)]">
                        {currentUser.name}
                      </span>
                      {currentUser.isFPO && (
                        <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                      )}
                    </div>
                    <span className="block truncate text-[10px] font-semibold uppercase tracking-[0.06em] text-[var(--brass-deep)]">
                      {currentUser.isFPO ? 'FPO Verified' : currentUser.district || 'Farmer'}
                    </span>
                  </div>
                  <ChevronDown
                    className={`h-3.5 w-3.5 text-[var(--muted-ink)] transition-transform duration-200 ${
                      profileOpen ? 'rotate-180 text-[var(--forest)]' : ''
                    }`}
                  />
                </button>

                {/* Mobile Backdrop */}
                {profileOpen && (
                  <div
                    className="fixed inset-0 z-40 bg-black/30 backdrop-blur-xs sm:hidden"
                    onClick={() => setProfileOpen(false)}
                  />
                )}

                {/* Profile Card / Popover */}
                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      id="header-user-profile-dropdown"
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.98 }}
                      transition={{ duration: 0.16, ease: 'easeOut' }}
                      className="fixed inset-x-4 top-20 z-50 sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:mt-2 w-auto sm:w-80 rounded-2xl border border-[var(--line)] bg-white p-4 shadow-xl text-[var(--ink)]"
                    >
                      {/* Top Farmer Identity Header */}
                      <div className="flex items-start gap-3 pb-3 border-b border-[var(--line)]">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--forest)] text-white font-extrabold text-sm shadow-xs">
                          {currentUser.name
                            .split(' ')
                            .filter(Boolean)
                            .map((w) => w[0])
                            .slice(0, 2)
                            .join('')
                            .toUpperCase() || 'KD'}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="truncate text-sm font-extrabold text-[var(--ink)]">
                            {currentUser.name}
                          </h4>
                          <div className="mt-0.5 inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200/80">
                            <ShieldCheck className="h-3 w-3 text-emerald-600 shrink-0" />
                            <span>{currentUser.isFPO ? 'Verified FPO Organization' : 'Verified Farmer'}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setProfileOpen(false)}
                          className="text-stone-400 hover:text-stone-700 p-1 sm:hidden cursor-pointer"
                          aria-label="Close profile"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Profile Details List */}
                      <div className="py-3 space-y-2.5 text-xs border-b border-[var(--line)]">
                        {/* Phone Number */}
                        <div className="flex items-center gap-2.5 text-stone-700">
                          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-stone-100 text-stone-500 shrink-0">
                            <Phone className="h-3.5 w-3.5" />
                          </div>
                          <span className="font-mono text-xs font-semibold text-stone-800">
                            +91 {currentUser.phone}
                          </span>
                          <span className="ml-auto text-[9px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/70 px-1.5 py-0.5 rounded">
                            Verified
                          </span>
                        </div>

                        {/* Email Address */}
                        {currentUser.email && (
                          <div className="flex items-center gap-2.5 text-stone-700">
                            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-stone-100 text-stone-500 shrink-0">
                              <Mail className="h-3.5 w-3.5" />
                            </div>
                            <span className="truncate text-xs font-medium text-stone-800">
                              {currentUser.email}
                            </span>
                          </div>
                        )}

                        {/* Location */}
                        <div className="flex items-start gap-2.5 text-stone-700">
                          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-stone-100 text-stone-500 shrink-0 mt-0.5">
                            <MapPin className="h-3.5 w-3.5" />
                          </div>
                          <div className="min-w-0 flex-1 leading-tight">
                            <span className="font-semibold text-stone-800">
                              {[currentUser.village, currentUser.district, currentUser.state]
                                .filter(Boolean)
                                .join(', ')}
                            </span>
                            <span className="block text-[10px] text-stone-400 mt-0.5">Registered Location</span>
                          </div>
                        </div>

                        {/* FPO Organization if applicable */}
                        {currentUser.isFPO && currentUser.fpoName && (
                          <div className="flex items-center gap-2.5 text-stone-700">
                            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-stone-100 text-stone-500 shrink-0">
                              <Building2 className="h-3.5 w-3.5" />
                            </div>
                            <span className="truncate text-xs font-semibold text-stone-800">
                              {currentUser.fpoName}
                            </span>
                          </div>
                        )}

                        {/* Primary Crops */}
                        {currentUser.primaryCrops && currentUser.primaryCrops.length > 0 && (
                          <div className="pt-1">
                            <div className="flex items-center gap-1 text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                              <Sprout className="h-3 w-3 text-emerald-600" />
                              <span>Crops / Produce</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {currentUser.primaryCrops.map((crop, idx) => (
                                <span
                                  key={idx}
                                  className="rounded-md bg-stone-100 px-2 py-0.5 text-[10px] font-semibold text-stone-700 border border-stone-200"
                                >
                                  {crop}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Actions & Sign Out */}
                      <div className="pt-3 space-y-2">
                        <button
                          type="button"
                          onClick={() => selectTab('farmer')}
                          className="w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold text-[var(--forest)] bg-emerald-50 hover:bg-emerald-100/80 transition-colors border border-emerald-200/80 cursor-pointer"
                        >
                          <span className="flex items-center gap-2">
                            <Sprout className="h-3.5 w-3.5" />
                            <span>Farmer Hub & Produce</span>
                          </span>
                          <ExternalLink className="h-3 w-3 opacity-60" />
                        </button>

                        {/* SIGN OUT BUTTON LOCATED INSIDE USER PROFILE */}
                        {onLogout && (
                          <button
                            id="profile-signout-btn"
                            type="button"
                            onClick={() => {
                              setProfileOpen(false);
                              onLogout();
                            }}
                            className="w-full flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 transition-colors border border-rose-200 cursor-pointer"
                            title="Sign out of your account"
                          >
                            <LogOut className="h-3.5 w-3.5" />
                            <span>Sign out</span>
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : onAuth ? (
              <button type="button" onClick={() => onAuth('login')} className="button-header">
                <LogIn className="h-3.5 w-3.5" />
                Sign in
              </button>
            ) : null}
            <button type="button" className="icon-button lg:hidden" onClick={() => setMobileOpen((open) => !open)} aria-expanded={mobileOpen} aria-controls="mobile-navigation" aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}>{mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-[var(--line)] py-2 lg:hidden">
          <button type="button" onClick={() => selectTab(activeTab)} className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--muted-ink)]"><span className="status-dot" aria-hidden="true" />{navigation.find((item) => item.tab === activeTab)?.label}</button>
          <button type="button" onClick={() => setMobileOpen((open) => !open)} className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--forest)]">Navigate <ChevronDown className={`h-3.5 w-3.5 transition-transform ${mobileOpen ? 'rotate-180' : ''}`} /></button>
        </div>

        {mobileOpen && (
          <nav id="mobile-navigation" className="grid grid-cols-2 gap-2 border-t border-[var(--line)] py-3 lg:hidden" aria-label="Mobile navigation">
            {navigation.map(({ tab, mobileLabel }) => {
              const active = activeTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => selectTab(tab)}
                  className={`mobile-nav-link justify-between ${active ? 'mobile-nav-link--active' : ''}`}
                >
                  <span>{mobileLabel}</span>
                  {tab === 'orders' && ordersCount > 0 && <span className="nav-badge">{ordersCount}</span>}
                </button>
              );
            })}
            {currentUser ? (
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  setProfileOpen(true);
                }}
                className="mobile-nav-link text-[var(--forest)] flex items-center justify-between col-span-2 sm:col-span-1"
              >
                <span className="flex items-center gap-1.5 truncate">
                  <User className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">My Profile ({currentUser.name.split(' ')[0]})</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--brass-deep)]">View</span>
              </button>
            ) : onAuth ? (
              <button
                type="button"
                onClick={() => {
                  onAuth('login');
                  setMobileOpen(false);
                }}
                className="mobile-nav-link text-[var(--forest)]"
              >
                <span>Sign in</span>
              </button>
            ) : null}
          </nav>
        )}
      </div>
    </header>
  );
};
