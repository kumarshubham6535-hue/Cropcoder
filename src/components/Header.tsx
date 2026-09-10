/* Editorial Fieldwork reminder: navigation is a working rail—quiet paper contrast, forest trust, brass action, no opaque status claims. */
import React from 'react';
import { motion } from 'motion/react';
import {
  ChevronDown,
  LogIn,
  LogOut,
  Menu,
  X,
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
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const selectTab = (tab: ActiveTab) => {
    onSelectTab(tab);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--forest)]/20 bg-[var(--paper)]/95 text-[var(--ink)] shadow-[0_4px_18px_rgba(18,61,45,0.07)] backdrop-blur-md">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="flex min-h-[76px] items-center justify-between gap-5">
          <button type="button" onClick={() => selectTab('home')} className="group flex min-w-0 items-center gap-3 text-left" aria-label="CropCoder overview">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden border border-[#16291C] bg-[#0C120E] shadow-[3px_3px_0_var(--brass)] transition-transform duration-200 group-hover:-translate-y-0.5">
              <CropCoderLogo size={44} className="h-full w-full" />
            </span>
            <span className="min-w-0">
              <span className="font-display text-2xl leading-none tracking-[-0.03em] text-[var(--forest)]">CropCoder</span>
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
            {currentUser && onLogout ? (
              <div className="hidden items-center gap-3 border-l border-[var(--line)] pl-3 md:flex">
                <div className="max-w-[120px] text-right"><span className="block truncate text-xs font-bold text-[var(--ink)]">{currentUser.name}</span><span className="block truncate text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--brass-deep)]">{currentUser.isFPO ? 'FPO verified' : currentUser.district || 'Farmer'}</span></div>
                <button type="button" onClick={onLogout} className="icon-button" title="Sign out" aria-label="Sign out"><LogOut className="h-4 w-4" /></button>
              </div>
            ) : onAuth ? <button type="button" onClick={() => onAuth('login')} className="button-header"><LogIn className="h-3.5 w-3.5" />Sign in</button> : null}
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
            {currentUser && onLogout ? (
              <button type="button" onClick={onLogout} className="mobile-nav-link text-[var(--clay)]">
                <span>Sign out</span>
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
