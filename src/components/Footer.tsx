/* Editorial Fieldwork reminder: footer closes the ledger with quiet paper contrast, explicit capability language, and the same crop-cursor mark as the header. */
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/10 bg-[var(--forest-dark)] text-white/75">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-2 px-5 py-4 font-mono text-[10px] font-bold uppercase tracking-[0.11em] text-white/35 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
        <span>© {new Date().getFullYear()} KishanDirect</span>
        <span>See the source. Know the route. Move the harvest.</span>
      </div>
    </footer>
  );
};
