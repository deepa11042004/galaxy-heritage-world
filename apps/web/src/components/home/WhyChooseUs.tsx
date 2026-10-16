'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Palmtree,
  Headphones,
  Ticket,
  ArrowRight,
  Eye,
  Target,
  Sparkles,
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
      "We are India's most accountable holiday provider with an official 3-tier grievance mechanism, documented TAT, and direct executive contact.",
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

const stats = [
  {
    value: '43+',
    title: 'Associated Resorts',
    description: 'Handpicked partner retreats across India & abroad',
  },
  {
    value: '100%',
    title: 'Escalation Transparency',
    description: 'Dedicated customer care & direct resolution',
  },
  {
    value: '24/7',
    title: 'Travel Concierge',
    description: 'Round-the-clock bespoke holiday planning',
  },
  {
    value: '1800-843',
    title: 'Toll-Free Assistance',
    description: 'Toll-Free 1800-843-6114 direct reservation desk',
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-20 bg-[#0B1320] text-white relative overflow-hidden border-b border-white/10">
      {/* Subtle gold glows in background */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#D4AF37] mb-2 px-3.5 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Galaxy Heritage World Difference</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mt-2">
            Why Choose Galaxy Heritage World?
          </h2>
          <p className="text-sm sm:text-base text-gray-400 mt-3.5 leading-relaxed">
            Delivering authentic family vacation joy with strict corporate accountability, audited hospitality properties, and dedicated care.
          </p>
        </div>

        {/* Vision & Mission Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-16">
          {/* Vision Card */}
          <div className="relative p-7 sm:p-8 rounded-3xl bg-gradient-to-br from-[#141E33] via-[#0E1726] to-[#0A101D] border border-[#D4AF37]/35 shadow-2xl hover:border-[#D4AF37] transition-all duration-300 group overflow-hidden">
            <div className="absolute -top-10 -right-10 w-44 h-44 bg-[#D4AF37]/10 rounded-full blur-2xl pointer-events-none group-hover:bg-[#D4AF37]/20 transition-all duration-500" />
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/15 text-[#D4AF37] flex items-center justify-center border border-[#D4AF37]/30 shadow-inner group-hover:scale-110 transition-transform duration-300">
                <Eye className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#D4AF37]">
                  OUR CORE PURPOSE
                </span>
                <h3 className="font-serif text-2xl font-bold text-white tracking-wide">Vision</h3>
              </div>
            </div>
            <p className="text-gray-200 text-sm sm:text-base leading-relaxed pl-1">
              To make every journey comfortable, seamless and memorable through quality travel experiences and personalized service.
            </p>
          </div>

          {/* Mission Card */}
          <div className="relative p-7 sm:p-8 rounded-3xl bg-gradient-to-br from-[#141E33] via-[#0E1726] to-[#0A101D] border border-[#D4AF37]/35 shadow-2xl hover:border-[#D4AF37] transition-all duration-300 group overflow-hidden">
            <div className="absolute -top-10 -right-10 w-44 h-44 bg-[#D4AF37]/10 rounded-full blur-2xl pointer-events-none group-hover:bg-[#D4AF37]/20 transition-all duration-500" />
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/15 text-[#D4AF37] flex items-center justify-center border border-[#D4AF37]/30 shadow-inner group-hover:scale-110 transition-transform duration-300">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#D4AF37]">
                  OUR GUIDING PRINCIPLE
                </span>
                <h3 className="font-serif text-2xl font-bold text-white tracking-wide">Mission</h3>
              </div>
            </div>
            <p className="text-gray-200 text-sm sm:text-base leading-relaxed pl-1">
              We believe in trust, quality, customer care and genuine hospitality, creating lasting relationships through every journey.
            </p>
          </div>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className={`p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                  pillar.highlight
                    ? 'bg-gradient-to-b from-[#141E33] to-[#0E1726] border-[#D4AF37]/50 shadow-xl'
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

        {/* Trust Stats Counters */}
        <div className="mt-16 pt-12 border-t border-white/10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
            {stats.map((stat, idx) => (
              <div
                key={stat.title}
                className={`flex flex-col items-center text-center group ${
                  idx > 0 ? 'pt-6 sm:pt-0 sm:pl-6' : ''
                }`}
              >
                <div className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#D4AF37] tracking-tight leading-none mb-2.5 transition-transform duration-300 group-hover:scale-105">
                  {stat.value}
                </div>
                <h4 className="text-base sm:text-lg font-bold text-white tracking-wide">
                  {stat.title}
                </h4>
                <p className="text-xs text-gray-400 mt-1.5 leading-relaxed max-w-xs">
                  {stat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
