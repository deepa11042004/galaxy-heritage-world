'use client';

import React from 'react';
import { Award } from 'lucide-react';

const partners = [
  { name: 'Sterling Holidays & Resorts', type: 'Associated Luxury Chain' },
  { name: 'Clarks Inn Suites & Resorts', type: 'Associated Luxury Chain' },
  { name: 'Ramada Worldwide', type: 'Associated Partner' },
  { name: 'Wyndham Hotels & Resorts', type: 'Exchange Partner' },
  { name: 'The Fern Hotels & Resorts', type: 'Eco-Luxury Partner' },
  { name: 'Pride Hotels & Resorts', type: 'Hospitality Partner' },
  { name: 'Pratapgarh Farms & Resorts', type: 'Heritage Day Outing' },
  { name: 'Madhavgarh Farms', type: 'Adventure & Picnic' },
  { name: 'Surajgarh Cultural Farms', type: 'Heritage Village Experience' },
  { name: 'Mayank Blue Water Park', type: 'Family Leisure Partner' },
];

export function PartnerMarquee() {
  return (
    <section className="overflow-hidden border-b border-line bg-white py-10">
      <div className="container-page mb-6 text-center">
        <div className="eyebrow mb-2">
          <Award />
          <span>Associated Hospitality Network</span>
        </div>
        <p className="text-xs text-ink-muted">
          Partnered with India&apos;s leading holiday chains, heritage retreats & recreation properties
        </p>
      </div>

      <div className="relative w-full overflow-hidden">
        {/* Gradients to fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent" />

        <div className="animate-marquee flex items-center gap-4">
          {[...partners, ...partners].map((p, idx) => (
            <div
              key={`${p.name}-${idx}`}
              className="flex items-center gap-3 whitespace-nowrap rounded-xl border border-line bg-surface px-6 py-3 transition-colors hover:border-ink/20"
            >
              <div className="h-2 w-2 rounded-full bg-accent" />
              <div className="text-left">
                <div className="text-xs font-semibold text-ink sm:text-sm">{p.name}</div>
                <div className="text-[10px] font-medium text-ink-muted">{p.type}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
