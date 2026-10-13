'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, MapPin, Check, ArrowRight, Sparkles } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface PackageItem {
  id: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  locationLabel: string;
  durationDays: number;
  durationNights: number;
  priceStarting?: number | string | null;
  priceLabel?: string | null;
  heroImageUrl: string;
  overview: string;
  inclusions?: string[] | null;
  category: string;
}

export function PackageCards({ packages }: { packages: PackageItem[] }) {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#D4AF37] mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tailored Holiday Packages</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
              Signature Vacation Experiences
            </h2>
            <p className="text-sm text-gray-600 mt-2 max-w-xl">
              Carefully crafted packages combining 4-star resort accommodation, guided sightseeing, and exclusive holiday desk support.
            </p>
          </div>

          <Link
            href="/vacation-packages"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] uppercase tracking-wider group self-start md:self-end"
          >
            <span>Browse All Packages</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {packages.slice(0, 4).map((pkg) => (
            <div
              key={pkg.id}
              className="luxury-card rounded-2xl overflow-hidden flex flex-col justify-between group shadow-sm hover:shadow-xl transition-all duration-300"
            >
              {/* Image & Badges */}
              <div className="relative h-52 w-full overflow-hidden">
                <Image
                  src={pkg.heroImageUrl || '/media/galaxy-heritage-world/homepage/images/2-1.png'}
                  alt={pkg.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#0B1320]/80 backdrop-blur-md text-[#D4AF37]">
                    {pkg.durationDays}D / {pkg.durationNights}N
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <div className="flex items-center gap-1 text-[11px] text-gray-300">
                    <MapPin className="w-3 h-3 text-[#D4AF37]" />
                    <span>{pkg.locationLabel}</span>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-lg font-bold text-gray-900 group-hover:text-[#2563EB] transition-colors leading-snug mb-2">
                    {pkg.title}
                  </h3>
                  <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-4">
                    {pkg.overview}
                  </p>

                  {/* Highlights/Inclusions */}
                  {Array.isArray(pkg.inclusions) && pkg.inclusions.length > 0 && (
                    <div className="space-y-1 mb-4">
                      {pkg.inclusions.slice(0, 2).map((inc, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-[11px] text-gray-600">
                          <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span className="truncate">{inc}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Price and CTA */}
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-gray-400">
                      Starting From
                    </div>
                    <div className="text-sm font-bold text-[#0B1320]">
                      {pkg.priceStarting
                        ? formatCurrency(Number(pkg.priceStarting))
                        : pkg.priceLabel || 'Price on Enquiry'}
                    </div>
                  </div>

                  <Link
                    href={`/vacation-packages/${pkg.slug}`}
                    className="p-2.5 rounded-full bg-[#FAF7F2] text-[#0B1320] group-hover:bg-[#2563EB] group-hover:text-white transition-colors"
                    aria-label={`View ${pkg.title}`}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
