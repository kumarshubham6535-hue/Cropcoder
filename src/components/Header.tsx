/* Editorial Fieldwork reminder: navigation is a working rail—quiet paper contrast, forest trust, brass action, no opaque status claims. */
import React from 'react';
import {
  BarChart3,
  ChevronDown,
  Home,
  LogIn,
  LogOut,
  Menu,
  Navigation,
  PackageCheck,
  ShoppingCart,
  Sprout,
  X,
} from 'lucide-react';
import { AuthUser } from '../services/authService';

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

const navigation: Array<{ tab: ActiveTab; label: string; mobileLabel: string; icon: React.ElementType }> = [
  { tab: 'home', label: 'Overview', mobileLabel: 'Home', icon: Home },
  { tab: 'farmer', label: 'Farmer / FPO', mobileLabel: 'Farmer', icon: Sprout },
  { tab: 'buyer', label: 'Marketplace', mobileLabel: 'Buy', icon: ShoppingCart },
  { tab: 'forecast', label: 'Demand signals', mobileLabel: 'Forecast', icon: BarChart3 },
  { tab: 'logistics', label: 'Route planner', mobileLabel: 'Routes', icon: Navigation },
  { tab: 'orders', label: 'Orders', mobileLabel: 'Orders', icon: PackageCheck },
];

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  ordersCount,
  currentUser,
  onLogout,
  onAuth,
  isSyncingWithDB = false,
  isSupabaseConfigured = false,
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
            <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-[var(--forest)] bg-[var(--forest)] p-2 shadow-[3px_3px_0_var(--brass)] transition-transform duration-200 group-hover:-translate-y-0.5 text-[var(--brass-light)]">
              <Sprout className="h-6 w-6 text-[var(--brass)]" strokeWidth={2.2} />
            </span>
            <span className="min-w-0">
              <span className="flex items-center gap-2"><span className="font-display text-2xl leading-none tracking-[-0.03em] text-[var(--forest)]">CropCoder</span><span className="hidden border border-[var(--brass)]/60 px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.12em] text-[var(--brass-deep)] sm:inline">Field exchange</span></span>
              <span className="mt-1 hidden truncate text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--muted-ink)] sm:block">Direct farm-to-buyer marketplace</span>
            </span>
          </button>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
            {navigation.map(({ tab, label, icon: Icon }) => {
              const active = activeTab === tab;
              return <button key={tab} type="button" onClick={() => selectTab(tab)} className={`nav-link ${active ? 'nav-link--active' : ''}`} aria-current={active ? 'page' : undefined}><Icon className="h-3.5 w-3.5" strokeWidth={1.8} /><span>{label}</span>{tab === 'orders' && ordersCount > 0 && <span className="nav-badge">{ordersCount}</span>}</button>;
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <div className="hidden items-center gap-2 border-l border-[var(--line)] pl-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--muted-ink)] xl:flex" title={isSupabaseConfigured ? 'Live data connection configured' : 'Using local workspace data'}>
              <span className={`status-dot ${isSyncingWithDB ? 'status-dot--syncing' : ''} ${!isSupabaseConfigured ? 'status-dot--muted' : ''}`} aria-hidden="true" />
              <span>{isSyncingWithDB ? 'Syncing' : isSupabaseConfigured ? 'Live data' : 'Local mode'}</span>
            </div>
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

        {mobileOpen && <nav id="mobile-navigation" className="grid grid-cols-2 gap-2 border-t border-[var(--line)] py-3 lg:hidden" aria-label="Mobile navigation">{navigation.map(({ tab, mobileLabel, icon: Icon }) => { const active = activeTab === tab; return <button key={tab} type="button" onClick={() => selectTab(tab)} className={`mobile-nav-link ${active ? 'mobile-nav-link--active' : ''}`}><Icon className="h-4 w-4" /><span>{mobileLabel}</span>{tab === 'orders' && ordersCount > 0 && <span className="nav-badge">{ordersCount}</span>}</button>; })}{currentUser && onLogout ? <button type="button" onClick={onLogout} className="mobile-nav-link text-[var(--clay)]"><LogOut className="h-4 w-4" />Sign out</button> : onAuth ? <button type="button" onClick={() => { onAuth('login'); setMobileOpen(false); }} className="mobile-nav-link text-[var(--forest)]"><LogIn className="h-4 w-4" />Sign in</button> : null}</nav>}
      </div>
    </header>
  );
};
