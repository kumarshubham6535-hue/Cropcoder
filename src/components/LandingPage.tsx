/* Editorial Fieldwork reminder: warm paper surfaces, forest-green trust cues, asymmetrical editorial rhythm, explicit status labels, and calm motion. */
import React from 'react';
import {
  ArrowUpRight,
  BarChart3,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  MapPin,
  PackageCheck,
  Route,
  ShieldCheck,
  ShoppingCart,
  Sprout,
  Truck,
  Wheat,
} from 'lucide-react';
import { ActiveTab } from './Header';
import { ProduceListing } from '../types';
import { AuthUser } from '../services/authService';

const HERO_IMAGE = 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1200&q=80';
const LOTS_IMAGE = 'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?auto=format&fit=crop&w=1000&q=80';

interface LandingPageProps {
  onSelectTab: (tab: ActiveTab) => void;
  onAuth: (mode?: 'login' | 'signup' | 'forgot_password') => void;
  listings?: ProduceListing[];
  currentUser?: AuthUser | null;
}

const formatCurrency = (value: number) => `₹${Math.round(value).toLocaleString('en-IN')}`;

export const LandingPage: React.FC<LandingPageProps> = ({
  onSelectTab,
  onAuth,
  listings = [],
  currentUser,
}) => {
  const activeListings = listings.filter(
    (listing) => listing.status === 'active' && listing.quantityAvailableQuintals > 0,
  );
  const distinctStates = new Set(activeListings.map((listing) => listing.location?.state).filter(Boolean));
  const featuredLots = activeListings.slice(0, 3);
  const totalAvailable = activeListings.reduce(
    (sum, listing) => sum + listing.quantityAvailableQuintals,
    0,
  );
  const goTo = (tab: ActiveTab) => onSelectTab(tab);
  const openWorkspace = () => {
    if (currentUser) goTo('farmer');
    else onAuth('login');
  };

  return (
    <div id="landing-page" className="overflow-hidden">
      <section className="relative border-b border-[var(--line)] bg-[var(--paper)]">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-5 pb-16 pt-8 sm:px-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(420px,1.08fr)] lg:gap-14 lg:px-12 lg:pb-24 lg:pt-14">
          <div className="relative z-10 flex flex-col justify-center lg:pb-4">
            <div className="section-kicker mb-5"><span className="section-kicker__rule" /><span>FIELD NOTE 01 / DIRECT EXCHANGE</span></div>
            <p className="mb-4 max-w-xl text-sm font-semibold uppercase tracking-[0.12em] text-[var(--forest)] sm:text-base">The fair route from harvest to home.</p>
            <h1 className="max-w-3xl font-display text-5xl leading-[0.98] tracking-[-0.045em] text-[var(--ink)] sm:text-6xl lg:text-[5.8rem]">Move produce with <em className="text-[var(--brass)]">proof</em>, not guesswork.</h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-[var(--muted-ink)] sm:text-lg">CropCoder brings growers, FPOs, and buyers onto one clear exchange: live farmgate lots, useful price guidance, and a route you can actually follow.</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button type="button" onClick={() => goTo('buyer')} className="button-primary group" id="hero-browse-marketplace-btn"><ShoppingCart className="h-4 w-4" />See today’s harvest<ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></button>
              <button type="button" onClick={() => goTo('farmer')} className="button-secondary group" id="hero-list-harvest-btn"><Sprout className="h-4 w-4 text-[var(--brass)]" />List your harvest<ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></button>
            </div>
            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-semibold text-[var(--muted-ink)]">
              <span className="inline-flex items-center gap-2"><span className="status-dot" aria-hidden="true" />{activeListings.length || listings.length} live farmgate lots</span>
              <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[var(--forest)]" />OTP-verified accounts</span>
            </div>
          </div>

          <div className="relative min-h-[430px] overflow-hidden border border-[var(--forest)]/20 bg-[var(--forest)] shadow-[var(--shadow-deep)] sm:min-h-[520px] lg:min-h-[620px]">
            <img src={HERO_IMAGE} alt="Harvested produce ready for direct collection" className="absolute inset-0 h-full w-full object-cover" loading="eager" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b241a]/90 via-[#0b241a]/10 to-transparent" />
            <div className="absolute left-5 top-5 border border-white/35 bg-[#f7f3ea]/90 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--forest)] backdrop-blur-sm sm:left-7 sm:top-7">Verified network / {new Date().getFullYear()}</div>
            <div className="absolute bottom-5 left-5 right-5 sm:bottom-7 sm:left-7 sm:right-7">
              <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[var(--brass-light)]"><span className="h-px w-8 bg-[var(--brass)]" />Live exchange snapshot</div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                <div className="metric-tile"><span className="metric-tile__value">{activeListings.length || listings.length}</span><span className="metric-tile__label">active lots</span></div>
                <div className="metric-tile"><span className="metric-tile__value">{distinctStates.size || 1}</span><span className="metric-tile__label">states covered</span></div>
                <div className="metric-tile col-span-2 sm:col-span-1"><span className="metric-tile__value">{Math.round(totalAvailable || 0)}</span><span className="metric-tile__label">quintals available</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[var(--line)] bg-[var(--paper-deep)]">
        <div className="mx-auto grid max-w-[1440px] gap-0 px-5 sm:px-8 lg:grid-cols-3 lg:px-12">
          <div className="ledger-stat border-b border-[var(--line)] lg:border-b-0 lg:border-r"><span className="ledger-stat__label">The old route</span><strong className="ledger-stat__value text-[var(--clay)]">4–5 layers</strong><p>between the harvest point and the shelf, with little visibility for either side.</p></div>
          <div className="ledger-stat border-b border-[var(--line)] lg:border-b-0 lg:border-r"><span className="ledger-stat__label">The CropCoder shift</span><strong className="ledger-stat__value text-[var(--forest)]">One clear ledger</strong><p>for source, price, quality, pickup, and delivery milestones in the same workflow.</p></div>
          <div className="ledger-stat"><span className="ledger-stat__label">The working promise</span><strong className="ledger-stat__value text-[var(--brass-deep)]">See. Decide. Move.</strong><p>Useful guidance without pretending a forecast can replace good judgment.</p></div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28" id="market-note">
        <div className="mb-12 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div><div className="section-kicker mb-4"><span className="section-kicker__rule" /><span>FIELD NOTE 02 / HOW IT WORKS</span></div><h2 className="max-w-2xl font-display text-4xl leading-[1.05] tracking-[-0.035em] text-[var(--ink)] sm:text-5xl">A better exchange is a sequence of small certainties.</h2></div>
          <p className="max-w-sm text-sm leading-6 text-[var(--muted-ink)]">The interface keeps the handoffs visible so people can make the next decision without decoding a platform.</p>
        </div>
        <div className="grid gap-px border border-[var(--line)] bg-[var(--line)] md:grid-cols-3">
          {[
            { number: '01', icon: Sprout, title: 'Growers publish the lot', body: 'Share crop, grade, quantity, and pickup point. Your farmgate price stays visible from the first click.' },
            { number: '02', icon: CircleDollarSign, title: 'Buyers see the context', body: 'Compare available lots with practical price guidance, harvest timing, and source details before you commit.' },
            { number: '03', icon: Route, title: 'The route gets consolidated', body: 'Collection, dispatch, and delivery milestones stay together so the order is easy to follow end to end.' },
          ].map(({ number, icon: Icon, title, body }) => (
            <article key={number} className="group bg-[var(--paper)] p-7 transition-colors hover:bg-white sm:p-9"><div className="mb-12 flex items-start justify-between"><span className="font-mono text-xs font-bold tracking-[0.14em] text-[var(--brass-deep)]">{number}</span><Icon className="h-6 w-6 text-[var(--forest)] transition-transform duration-200 group-hover:-translate-y-1" strokeWidth={1.6} /></div><h3 className="font-display text-2xl tracking-[-0.02em] text-[var(--ink)]">{title}</h3><p className="mt-3 text-sm leading-6 text-[var(--muted-ink)]">{body}</p></article>
          ))}
        </div>
      </section>

      <section className="border-y border-[var(--line)] bg-[var(--forest)] text-[var(--paper)]">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:px-12 lg:py-24">
          <div className="relative min-h-[320px] overflow-hidden border border-white/15"><img src={LOTS_IMAGE} alt="A grower sorting fresh produce into collection lots" className="absolute inset-0 h-full w-full object-cover" loading="lazy" /><div className="absolute inset-0 bg-gradient-to-t from-[#0b241a]/75 to-transparent" /><div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4"><p className="max-w-[220px] text-xs font-semibold leading-5 text-[var(--paper)]">Every lot begins with a real source, a real quantity, and a real next step.</p><span className="border border-[var(--brass)]/70 bg-[var(--forest)]/70 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--brass-light)]">Traceable / 01</span></div></div>
          <div className="flex flex-col justify-center"><div className="section-kicker section-kicker--dark mb-5"><span className="section-kicker__rule" /><span>THE MARKET BOARD</span></div><h2 className="max-w-xl font-display text-4xl leading-[1.02] tracking-[-0.035em] sm:text-5xl">Today’s lots, without the middle-layer fog.</h2><p className="mt-5 max-w-xl text-sm leading-6 text-white/70 sm:text-base">Browse what is available now, then move into the buyer workflow only when the source and the numbers make sense.</p>
            <div className="mt-8 divide-y divide-white/15 border-y border-white/15">
              {featuredLots.length > 0 ? featuredLots.map((listing) => (
                <button key={listing.id} type="button" onClick={() => goTo('buyer')} className="group flex w-full items-center justify-between gap-4 py-4 text-left transition-colors hover:bg-white/5"><span className="min-w-0"><span className="block truncate text-sm font-bold text-white">{listing.cropName}</span><span className="mt-1 flex items-center gap-2 text-xs text-white/60"><MapPin className="h-3.5 w-3.5 text-[var(--brass)]" />{listing.location?.district}, {listing.location?.state} · {listing.quantityAvailableQuintals} qtl</span></span><span className="flex shrink-0 items-center gap-2 text-sm font-bold text-[var(--brass-light)]"><span>{formatCurrency(listing.askingPricePerQuintal)}</span><ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></span></button>
              )) : <div className="py-5 text-sm text-white/70">The live board is preparing its next lots. Browse the marketplace to explore the full catalog.</div>}
            </div>
            <button type="button" onClick={() => goTo('buyer')} className="mt-7 inline-flex w-fit items-center gap-2 border-b border-[var(--brass)] pb-1 text-sm font-bold text-[var(--brass-light)] transition-colors hover:text-white">Open the marketplace <ArrowUpRight className="h-4 w-4" /></button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:gap-20"><div><div className="section-kicker mb-4"><span className="section-kicker__rule" /><span>FIELD NOTE 03 / THE TOOLKIT</span></div><h2 className="font-display text-4xl leading-[1.03] tracking-[-0.035em] text-[var(--ink)] sm:text-5xl">Tools for the work after “hello.”</h2><p className="mt-5 max-w-md text-sm leading-6 text-[var(--muted-ink)]">Once inside, the product stays focused on the decisions that keep produce moving.</p><button type="button" onClick={openWorkspace} className="button-primary mt-8">{currentUser ? 'Review your workspace' : 'Sign in to your workspace'}<ArrowUpRight className="h-4 w-4" /></button></div>
          <div className="grid gap-4 sm:grid-cols-2">{[
            { icon: BarChart3, title: 'Demand & price guidance', body: 'Regional trends translated into a usable benchmark, not a black box.', tab: 'forecast' as ActiveTab, accent: 'brass' },
            { icon: Truck, title: 'Route consolidation', body: 'Plan the practical pickup path across farms, hubs, and buyer destinations.', tab: 'logistics' as ActiveTab, accent: 'forest' },
            { icon: PackageCheck, title: 'Order milestones', body: 'Keep dispatch, delivery, and cancellation states visible in one place.', tab: 'orders' as ActiveTab, accent: 'clay' },
            { icon: Wheat, title: 'Farmer & FPO portal', body: 'Publish a lot, update your profile, and keep the source of supply current.', tab: 'farmer' as ActiveTab, accent: 'forest' },
          ].map(({ icon: Icon, title, body, tab, accent }) => <button type="button" key={title} onClick={() => goTo(tab)} className={`tool-card tool-card--${accent}`}><span className="tool-card__icon"><Icon className="h-5 w-5" /></span><span className="mt-8 block font-display text-2xl leading-tight tracking-[-0.02em] text-[var(--ink)]">{title}</span><span className="mt-3 block text-sm leading-6 text-[var(--muted-ink)]">{body}</span><span className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-[var(--forest)]">Explore <ChevronRight className="h-4 w-4" /></span></button>)}</div>
        </div>
      </section>

      <section className="mx-5 mb-16 overflow-hidden border border-[var(--forest)] bg-[var(--brass)] sm:mx-8 lg:mx-12 lg:mb-24"><div className="flex flex-col gap-8 px-6 py-10 sm:px-10 lg:flex-row lg:items-center lg:justify-between lg:px-14 lg:py-12"><div><div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--forest)]"><Clock3 className="h-4 w-4" />Ready when the harvest is.</div><h2 className="max-w-2xl font-display text-4xl leading-[1.02] tracking-[-0.035em] text-[var(--forest)] sm:text-5xl">See today’s lots, then move with confidence.</h2></div><button type="button" onClick={() => goTo('buyer')} className="button-dark group shrink-0">Browse live lots <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></button></div></section>
    </div>
  );
};
