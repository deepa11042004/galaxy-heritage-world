import React from 'react';
import Link from 'next/link';
import { PhoneCall } from 'lucide-react';

/** Floating button (bottom right on every page) that opens the Travel Desk page. */
export function TravelDeskFloat() {
  return (
    <div className="fixed right-6 bottom-6 z-50">
      <Link
        href="/travel-desk"
        className="group relative flex items-center gap-3 rounded-full bg-ink p-1.5 text-white shadow-[0_18px_40px_-12px_rgba(14,14,14,0.5)] transition-all duration-300 hover:-translate-y-0.5 sm:pr-5"
        aria-label="Open the Travel Desk page"
      >
        <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-accent text-ink">
          {/* Subtle pulse ring */}
          <span className="pointer-events-none absolute inset-0 animate-ping rounded-full bg-accent opacity-40" />
          <PhoneCall className="relative h-4 w-4" />
        </div>

        <div className="hidden text-left sm:block">
          <div className="text-[10px] font-semibold tracking-wider text-accent uppercase">Travel Desk</div>
          <div className="text-sm font-semibold text-white">1800-843-6114</div>
        </div>
      </Link>
    </div>
  );
}
