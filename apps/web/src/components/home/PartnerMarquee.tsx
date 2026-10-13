'use client';

import React from 'react';
import { ShieldCheck, Award } from 'lucide-react';

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
    <section className="bg-white py-10 border-b border-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 text-center">
        <div className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest font-bold text-[#D4AF37] mb-1">
          <Award className="w-3.5 h-3.5" />
          <span>Associated Hospitality Network</span>
        </div>
        <p className="text-xs text-gray-500">
          Partnered with India&apos;s leading holiday chains, heritage retreats & recreation properties
        </p>
      </div>

      <div className="relative w-full overflow-hidden">
        {/* Gradients to fade edges */}
        <div className="absolute left-0 inset-y-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 inset-y-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee flex items-center gap-6">
          {[...partners, ...partners].map((p, idx) => (
            <div
              key={`${p.name}-${idx}`}
              className="flex items-center gap-3 px-6 py-3 bg-[#FAF7F2] rounded-xl border border-[#D4AF37]/20 whitespace-nowrap hover:border-[#D4AF37] transition-colors"
            >
              <div className="w-2 h-2 rounded-full bg-[#D4AF37]" />
              <div className="text-left">
                <div className="text-xs sm:text-sm font-serif font-bold text-gray-900">
                  {p.name}
                </div>
                <div className="text-[10px] text-gray-500 font-medium">
                  {p.type}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
