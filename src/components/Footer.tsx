/* Editorial Fieldwork reminder: footer closes the ledger with quiet paper contrast, explicit capability language, and the same crop-cursor mark as the header. */
import React from 'react';
import { ShieldCheck, Sprout } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/10 bg-[var(--forest-dark)] text-white/75">
      <div className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center border border-[var(--brass)] bg-[var(--brass)] p-1.5 text-[var(--forest-dark)]">
                <Sprout className="h-5 w-5" strokeWidth={2.4} />
              </span>
              <div>
                <span className="font-display text-2xl text-white">CropCoder</span>
                <span className="ml-2 font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-[var(--brass-light)]">Field exchange</span>
              </div>
            </div>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/60">
              A direct farm-to-buyer workspace for growers, FPOs, households, and bulk buyers who need clearer movement from source to destination.
            </p>
          </div>
          <div className="inline-flex shrink-0 items-center gap-2 border border-white/15 px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--brass-light)]">
            <ShieldCheck className="h-3.5 w-3.5" />
            Verified account workflows
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-2 px-5 py-4 font-mono text-[10px] font-bold uppercase tracking-[0.11em] text-white/35 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
          <span>© {new Date().getFullYear()} CropCoder</span>
          <span>See the source. Know the route. Move the harvest.</span>
        </div>
      </div>
    </footer>
  );
};
