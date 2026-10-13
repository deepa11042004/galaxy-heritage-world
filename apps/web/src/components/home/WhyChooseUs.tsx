'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Palmtree,
  Headphones,
  Ticket,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';

const pillars = [
  {
    icon: Palmtree,
    title: '43+ Audited Associated Resorts',
    description:
      'Verified accommodations in prime tourist corridors across Goa, Rajasthan, Uttarakhand, Himachal, and South India with strict quality standards.',
  },
  {
    icon: ShieldCheck,
    title: '100% Transparent Escalation Matrix',
    description:
      'We are India&apos;s most accountable holiday provider with an official 3-tier grievance mechanism, documented TAT, and direct executive contact.',
    highlight: true,
  },
  {
    icon: Headphones,
    title: 'Dedicated Travel Desk Concierge',
    description:
      'Toll-free 1800-843-6114 support, customized itinerary planning, booking assistance, and on-trip coordination from dedicated travel specialists.',
  },
  {
    icon: Ticket,
    title: 'Hassle-Free Voucher Redemption',
    description:
      'Transparent rules, clear validity periods, and straightforward voucher claim workflows without hidden terms or surprise charges.',
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-20 bg-[#0B1320] text-white relative overflow-hidden">
      {/* Subtle gold glow in background */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#D4AF37] mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>The Galaxy Heritage World Difference</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white leading-tight">
            Why Discerning Travelers Choose Us
          </h2>
          <p className="text-sm text-gray-400 mt-3 leading-relaxed">
            Delivering authentic family vacation joy with strict corporate accountability, audited hospitality properties, and dedicated care.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className={`p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                  pillar.highlight
                    ? 'bg-gradient-to-b from-[#141E33] to-[#0E1726] border-[#D4AF37]/40 shadow-xl'
                    : 'bg-white/5 border-gray-800 hover:border-gray-700'
                }`}
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center mb-5 border border-[#D4AF37]/20">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-white mb-2 leading-snug">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                {pillar.highlight && (
                  <div className="mt-6 pt-4 border-t border-gray-800">
                    <Link
                      href="/reviews-and-complaints"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D4AF37] hover:underline"
                    >
                      <span>Read Escalation Policy</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
