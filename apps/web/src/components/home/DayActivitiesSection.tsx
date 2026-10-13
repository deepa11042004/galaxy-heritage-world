'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Palmtree, Clock, MapPin, ArrowRight, Sun } from 'lucide-react';

interface ActivityItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  locationLabel: string;
  durationLabel: string;
  imageUrl: string;
  description: string;
}

export function DayActivitiesSection({ activities }: { activities: ActivityItem[] }) {
  if (!activities || activities.length === 0) return null;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#D4AF37] mb-2">
              <Sun className="w-3.5 h-3.5" />
              <span>Weekend & Family Escapes</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
              Day Picnics & Adventure Outings
            </h2>
            <p className="text-sm text-gray-600 mt-2 max-w-xl">
              Experience traditional rural village heritage, delicious ethnic cuisine, adventure rope courses, and thrilling water parks.
            </p>
          </div>

          <Link
            href="/day-activities"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] uppercase tracking-wider group self-start md:self-end"
          >
            <span>View All Day Outings</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {activities.slice(0, 4).map((act) => (
            <Link
              key={act.id}
              href={`/day-activities/${act.slug}`}
              className="luxury-card rounded-2xl overflow-hidden group shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={act.imageUrl || '/media/galaxy-heritage-world/day-activities/images/madhavgarh.webp'}
                  alt={act.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/90 text-[#0B1320]">
                    {act.category}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <div className="flex items-center gap-1 text-[11px] text-gray-200">
                    <MapPin className="w-3 h-3 text-[#D4AF37]" />
                    <span>{act.locationLabel}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-base font-bold text-gray-900 group-hover:text-[#2563EB] transition-colors leading-snug mb-1.5">
                    {act.title}
                  </h3>
                  <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-3">
                    {act.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-gray-500 text-[11px]">
                    <Clock className="w-3 h-3 text-[#D4AF37]" />
                    <span>{act.durationLabel}</span>
                  </div>
                  <span className="font-semibold text-[#2563EB] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Book &rarr;
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
