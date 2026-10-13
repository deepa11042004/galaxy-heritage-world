'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Compass,
  MapPin,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award,
  Users,
} from 'lucide-react';

export function HeroBanner() {
  const [destinationQuery, setDestinationQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  return (
    <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center bg-[#0B1320] text-white overflow-hidden">
      {/* Background Image with Dark & Luxury Gold Gradient Overlays */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/media/galaxy-heritage-world/homepage/images/gettyimages-149353949_wide-5bf3b36fc9e77c005175cfc2.jpg"
          alt="Luxury Resort Experience - Galaxy Heritage World"
          fill
          priority
          className="object-cover object-center opacity-40 scale-105 transition-transform duration-10000"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1320] via-[#0B1320]/60 to-transparent" />
        <div className="absolute inset-0 bg-radial-at-c from-transparent via-[#0B1320]/40 to-[#0B1320]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center flex flex-col items-center">
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
        <p className="text-sm sm:text-lg text-gray-300 max-w-2xl leading-relaxed mb-10">
          Discover handpicked luxury resorts, bespoke family holiday packages, and seamless travel desk privileges with authentic hospitality and guaranteed transparency.
        </p>

        {/* Floating Search & Discovery Bar */}
        <div className="w-full max-w-4xl bg-white rounded-2xl sm:rounded-full p-2 sm:p-2.5 shadow-2xl border border-white/20 backdrop-blur-md flex flex-col sm:flex-row items-stretch sm:items-center gap-2 text-gray-800 text-left">
          {/* Destination input */}
          <div className="flex-1 flex items-center gap-3 px-4 py-2 border-b sm:border-b-0 sm:border-r border-gray-100">
            <MapPin className="w-5 h-5 text-[#D4AF37] shrink-0" />
            <div className="w-full">
              <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-400">
                Where to?
              </label>
              <input
                type="text"
                placeholder="e.g. Goa, Manali, Jaipur..."
                value={destinationQuery}
                onChange={(e) => setDestinationQuery(e.target.value)}
                className="w-full text-xs sm:text-sm font-semibold text-gray-800 placeholder-gray-400 bg-transparent focus:outline-none"
              />
            </div>
          </div>

          {/* Holiday Type select */}
          <div className="flex-1 flex items-center gap-3 px-4 py-2 border-b sm:border-b-0 sm:border-r border-gray-100">
            <Compass className="w-5 h-5 text-[#D4AF37] shrink-0" />
            <div className="w-full">
              <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-400">
                Experience
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full text-xs sm:text-sm font-semibold text-gray-800 bg-transparent focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Travel Experiences</option>
                <option value="DOMESTIC">Domestic Holidays</option>
                <option value="INTERNATIONAL">International Exchange</option>
                <option value="ACTIVITIES">Day Outings & Picnics</option>
              </select>
            </div>
          </div>

          {/* Search Button */}
          <Link
            href={`/search?q=${encodeURIComponent(destinationQuery || 'all')}`}
            className="sm:w-auto px-7 py-3.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs sm:text-sm font-semibold uppercase tracking-wider rounded-xl sm:rounded-full flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 group shrink-0"
          >
            <span>Explore Now</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 mt-14 text-center max-w-4xl w-full border-t border-white/10 pt-8">
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
