'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Compass, ArrowRight, Sparkles } from 'lucide-react';

interface DestinationItem {
  id: string;
  slug: string;
  name: string;
  region: string;
  country: string;
  type: string;
  tagline?: string | null;
  description: string;
  heroImageUrl: string;
  _count?: { hotels: number; packages: number; itineraries: number };
}

export function DestinationShowcase({ destinations }: { destinations: DestinationItem[] }) {
  const [filter, setFilter] = useState<'ALL' | 'DOMESTIC' | 'INTERNATIONAL'>('ALL');

  const filtered = destinations.filter((d) => {
    if (filter === 'ALL') return true;
    return d.type === filter;
  });

  return (
    <section className="py-20 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#D4AF37] mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Curated Holiday Escapes</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
              Featured Travel Destinations
            </h2>
            <p className="text-sm text-gray-600 mt-2 max-w-xl">
              From sun-kissed beaches in Goa to the royal palaces of Rajasthan and snow-capped peaks of Himachal Pradesh.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 bg-white p-1 rounded-full border border-gray-200 self-start md:self-end shadow-sm">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                filter === 'ALL'
                  ? 'bg-[#0B1320] text-white shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('DOMESTIC')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                filter === 'DOMESTIC'
                  ? 'bg-[#0B1320] text-white shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Domestic
            </button>
            <button
              onClick={() => setFilter('INTERNATIONAL')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                filter === 'INTERNATIONAL'
                  ? 'bg-[#0B1320] text-white shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              International
            </button>
          </div>
        </div>

        {/* Destination Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.slice(0, 6).map((dest) => (
            <Link
              key={dest.id}
              href={`/destinations/${dest.slug}`}
              className="group luxury-card rounded-2xl overflow-hidden block shadow-sm hover:shadow-xl transition-all duration-300 bg-white"
            >
              {/* Card Image */}
              <div className="relative h-64 w-full overflow-hidden">
                <Image
                  src={dest.heroImageUrl || '/media/galaxy-heritage-world/homepage/images/1-2.png'}
                  alt={dest.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/90 backdrop-blur-md text-[#0B1320] shadow-sm">
                    {dest.type === 'DOMESTIC' ? 'Domestic Escape' : 'International Exchange'}
                  </span>
                </div>

                {/* Bottom title on image */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-1.5 text-xs text-[#D4AF37] font-semibold mb-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{dest.region}, {dest.country}</span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                    {dest.name}
                  </h3>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex flex-col justify-between">
                <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-4">
                  {dest.tagline || dest.description}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs font-semibold">
                  <span className="text-gray-500">
                    {dest._count?.hotels ? `${dest._count.hotels} Associated Resorts` : 'Resorts Available'}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[#2563EB] group-hover:translate-x-1 transition-transform">
                    <span>Explore</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/destinations"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#0B1320] hover:bg-[#1a2538] text-white text-xs font-semibold uppercase tracking-wider transition-all duration-200 shadow-md group"
          >
            <span>View All Destinations</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
