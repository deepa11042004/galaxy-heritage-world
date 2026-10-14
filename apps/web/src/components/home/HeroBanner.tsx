import React from 'react';
import Image from 'next/image';
import { Sparkles } from 'lucide-react';

export function HeroBanner() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-[#0B1320] text-white overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-24">
      {/* Background Image with Dark & Luxury Gold Gradient Overlays */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/media/galaxy-heritage-world/homepage/images/gettyimages-149353949_high-scaled.jpg"
          alt="Luxury Resort Experience - Galaxy Heritage World"
          fill
          priority
          className="object-cover object-center opacity-45 scale-105 transition-transform duration-10000"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1320] via-[#0B1320]/50 to-[#0B1320]/30" />
        <div className="absolute inset-0 bg-radial-at-c from-transparent via-[#0B1320]/30 to-[#0B1320]/80" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Top Luxury Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-[#D4AF37]/50 text-[#D4AF37] text-xs font-semibold uppercase tracking-wider mb-6 animate-in fade-in slide-in-from-top-4 duration-700">
          <Sparkles className="w-3.5 h-3.5" />
          <span>India&apos;s Premium Holiday & Hospitality Network</span>
        </div>

        {/* Main Headline */}
        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white max-w-4xl leading-tight sm:leading-tight mb-6">
          Crafting Unforgettable Journeys Across <span className="text-[#D4AF37] italic">India</span> & The World
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-lg text-gray-300 max-w-2xl leading-relaxed mb-6">
          Discover handpicked luxury resorts, bespoke family holiday packages, and seamless travel desk privileges with authentic hospitality and guaranteed transparency.
        </p>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 mt-6 text-center max-w-4xl w-full border-t border-white/10 pt-8">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5 text-[#D4AF37] font-serif text-2xl font-bold">
              43+
            </div>
            <span className="text-xs text-gray-400 mt-0.5">Associated Resorts</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5 text-[#D4AF37] font-serif text-2xl font-bold">
              100%
            </div>
            <span className="text-xs text-gray-400 mt-0.5">Escalation Transparency</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5 text-[#D4AF37] font-serif text-2xl font-bold">
              24/7
            </div>
            <span className="text-xs text-gray-400 mt-0.5">Travel Concierge</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5 text-[#D4AF37] font-serif text-2xl font-bold">
              1800-843
            </div>
            <span className="text-xs text-gray-400 mt-0.5">Toll-Free Assistance</span>
          </div>
        </div>
      </div>
    </section>
  );
}
