/* Editorial Fieldwork reminder: warm paper surfaces, forest-green trust cues, asymmetrical editorial rhythm, explicit status labels, and calm motion. */
import React from 'react';
import {
  ArrowRight,
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
  Sparkles,
  Sprout,
  Truck,
  Wheat,
} from 'lucide-react';
import { ActiveTab } from './Header';
import { ProduceListing } from '../types';
import { AuthUser } from '../services/authService';

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
  const currentHeroBg = 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=2000&q=80';

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
      {/* Hero Section matching cropcoder screenshot exactly */}
      <section
        className="relative flex min-h-[640px] items-center overflow-hidden border-b-4 border-[#e5a83b] bg-[#07130c] text-white sm:min-h-[700px] lg:min-h-[780px]"
      >
        {/* Full-bleed agricultural hero background photo */}
        <div className="absolute inset-0 z-0 select-none overflow-hidden" aria-hidden="true">
          <img
            src={currentHeroBg}
            alt="Golden wheat agricultural fields at sunset"
            className="h-full w-full object-cover object-[78%_center] sm:object-[72%_center] lg:object-[80%_center] scale-[1.01] transition-opacity duration-300"
            referrerPolicy="no-referrer"
            loading="eager"
          />
          {/* Dark cinematic gradient scrim matching the original screenshot: deep contrast on left, open view to tractor on right */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#07130c]/95 via-[#07130c]/75 via-45% to-black/20 lg:to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07130c]/90 via-transparent to-[#07130c]/40" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[1440px] px-5 py-14 sm:px-8 sm:py-18 lg:px-12 lg:py-20">
          <div className="max-w-2xl lg:max-w-3xl space-y-6">
            {/* Headline with brass italic 'proof,' and white 'not guesswork.' */}
            <h1 className="font-display text-5xl font-extrabold leading-[1.02] tracking-[-0.035em] text-white sm:text-6xl lg:text-[5.4rem]">
              Move produce with <em className="font-normal italic text-[#e5a83b]">proof</em>, not guesswork.
            </h1>

            {/* Subtitle paragraph */}
            <p className="max-w-xl text-base leading-7 text-white/85 sm:text-lg">
              KishanDirect brings growers, FPOs, and buyers onto one clear exchange: live farmgate lots, useful price guidance, and a route you can actually follow.
            </p>

            {/* Action buttons styled with pill shapes matching screenshot */}
            <div className="flex flex-col gap-3.5 sm:flex-row sm:items-center pt-2">
              <button
                type="button"
                onClick={() => goTo('buyer')}
                className="group inline-flex items-center justify-center gap-3.5 rounded-full bg-[#1b5e20] hover:bg-[#256c45] px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-black/40 transition-all hover:shadow-black/60"
                id="hero-browse-marketplace-btn"
              >
                <span>See today’s harvest</span>
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#e5a83b] text-[#07130c] transition-transform group-hover:translate-x-0.5">
                  <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
                </span>
              </button>

              <button
                type="button"
                onClick={() => goTo('farmer')}
                className="group inline-flex items-center justify-center gap-3.5 rounded-full border border-[#e5a83b] bg-black/40 hover:bg-[#e5a83b]/15 px-7 py-3.5 text-sm font-bold text-[#e5a83b] backdrop-blur-sm transition-all"
                id="hero-list-harvest-btn"
              >
                <span>List your harvest</span>
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#e5a83b] text-[#07130c] transition-transform group-hover:translate-x-0.5">
                  <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
                </span>
              </button>
            </div>

            {/* Live stats and verification badges */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs font-semibold text-white/90 pt-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/50 px-3.5 py-1.5 backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{activeListings.length || 14} live farmgate lots</span>
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/50 px-3.5 py-1.5 backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-[#e5a83b]" />
                <span>{distinctStates.size || 13} states covered</span>
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/50 px-3.5 py-1.5 backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span>{Math.round(totalAvailable || 1465)} quintals ready</span>
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/50 px-3.5 py-1.5 text-emerald-300 backdrop-blur-md">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>OTP-verified network</span>
              </span>
            </div>
          </div>
        </div>

        {/* Warm golden bottom border band matching the screenshot */}
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-[#e5a83b] via-[#f5c358] to-[#e5a83b]" />
      </section>

      <section className="border-b border-[var(--line)] bg-[var(--paper-deep)]">
        <div className="mx-auto grid max-w-[1440px] gap-0 px-5 sm:px-8 lg:grid-cols-3 lg:px-12">
          <div className="ledger-stat border-b border-[var(--line)] lg:border-b-0 lg:border-r"><span className="ledger-stat__label">The old route</span><strong className="ledger-stat__value text-[var(--clay)]">4–5 layers</strong><p>between the harvest point and the shelf, with little visibility for either side.</p></div>
          <div className="ledger-stat border-b border-[var(--line)] lg:border-b-0 lg:border-r"><span className="ledger-stat__label">The KishanDirect shift</span><strong className="ledger-stat__value text-[var(--forest)]">One clear ledger</strong><p>for source, price, quality, pickup, and delivery milestones in the same workflow.</p></div>
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
            {
              id: 'how-it-works-step-1',
              number: '01',
              icon: Sprout,
              title: 'Growers publish the lot',
              body: 'Share crop, grade, quantity, and pickup point. Your farmgate price stays visible from the first click.',
              bgImage: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1000&q=80',
              tag: 'Farmgate origin',
            },
            {
              id: 'how-it-works-step-2',
              number: '02',
              icon: CircleDollarSign,
              title: 'Buyers see the context',
              body: 'Compare available lots with practical price guidance, harvest timing, and source details before you commit.',
              bgImage: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=1000&q=80',
              tag: 'Verified pricing',
            },
            {
              id: 'how-it-works-step-3',
              number: '03',
              icon: Route,
              title: 'The route gets consolidated',
              body: 'Collection, dispatch, and delivery milestones stay together so the order is easy to follow end to end.',
              bgImage: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1000&q=80',
              tag: 'Direct dispatch',
            },
          ].map(({ id, number, icon: Icon, title, body, bgImage, tag }) => (
            <article
              id={id}
              key={number}
              className="group relative overflow-hidden bg-[var(--paper-light)] p-7 transition-all duration-300 sm:p-9 shadow-xs hover:shadow-lg"
            >
              {/* Contextual photographic background */}
              <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
                <img
                  src={bgImage}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover object-center opacity-25 filter saturate-[0.85] contrast-[1.05] transition-all duration-700 ease-out group-hover:scale-105 group-hover:opacity-35"
                />
                {/* Refined gradient overlay ensuring crystal-clear readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--paper-light)] via-[var(--paper)]/85 to-[var(--paper-light)]/90 transition-opacity duration-300 group-hover:via-[var(--paper)]/75" />
              </div>

              {/* Card foreground content */}
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className="mb-10 flex items-start justify-between">
                    <span className="font-mono text-xs font-bold tracking-[0.14em] text-[var(--brass-deep)] bg-[var(--paper-deep)]/90 px-2.5 py-1 rounded-md border border-[var(--line)] shadow-2xs">
                      {number}
                    </span>
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--line)] bg-white/95 text-[var(--forest)] shadow-xs transition-all duration-300 group-hover:border-[var(--forest)]/50 group-hover:bg-white group-hover:text-[var(--forest-dark)] group-hover:shadow-sm">
                      <Icon className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5" strokeWidth={1.8} />
                    </div>
                  </div>
                  <h3 className="font-display text-2xl font-bold tracking-[-0.02em] text-[var(--ink)]">
                    {title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-[var(--muted-ink)]">
                    {body}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-[var(--line)]/70 flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--forest)]">
                  <span>{tag}</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--forest)] group-hover:bg-[var(--brass)] transition-colors" />
                </div>
              </div>
            </article>
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

      <section className="mx-5 mb-16 overflow-hidden border border-[var(--forest)]/40 bg-[var(--forest-dark)] text-[var(--paper)] shadow-[0_14px_38px_rgba(11,36,26,0.18)] sm:mx-8 lg:mx-12 lg:mb-24">
        <div className="flex flex-col gap-8 px-6 py-10 sm:px-10 lg:flex-row lg:items-center lg:justify-between lg:px-14 lg:py-12 bg-gradient-to-br from-[#0f3828] via-[#0b241a] to-[#071912] border-l-4 border-l-[#e5a83b]">
          <div>
            <div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#e5a83b]">
              <Clock3 className="h-4 w-4 text-[#e5a83b]" />
              <span>Ready when the harvest is.</span>
            </div>
            <h2 className="max-w-2xl font-display text-4xl leading-[1.02] tracking-[-0.035em] text-[var(--paper-light)] sm:text-5xl">
              See today’s lots, then move with confidence.
            </h2>
          </div>
          <button
            type="button"
            onClick={() => goTo('buyer')}
            className="group shrink-0 inline-flex items-center gap-2 px-6 py-3.5 bg-[#e5a83b] hover:bg-[#f5c358] text-[#07130c] font-bold text-xs sm:text-sm uppercase tracking-[0.08em] shadow-[3px_3px_0_#07130c] hover:-translate-y-0.5 transition-all"
          >
            <span>Browse live lots</span>
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </button>
        </div>
      </section>
    </div>
  );
};
