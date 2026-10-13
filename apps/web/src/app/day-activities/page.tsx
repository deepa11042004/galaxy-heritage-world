import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Palmtree, Clock, MapPin, ArrowRight, Sun, Sparkles } from 'lucide-react';
import { getActivities } from '@/lib/api';

export const metadata = {
  title: 'Day Activities & Family Picnics | Galaxy Heritage World',
  description:
    'Experience traditional rural village farms, heritage picnics, adventure activities, and exciting water parks across Delhi NCR, Haryana, and MP.',
};

export const revalidate = 60;

export default async function DayActivitiesPage() {
  const res = await getActivities().catch(() => ({ data: [] }));
  const activities = res.data || [];

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#D4AF37] mb-2">
            <Sun className="w-3.5 h-3.5" />
            <span>Weekend Escapes</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-gray-900 leading-tight">
            Day Outings, Picnics & Water Parks
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-3 leading-relaxed">
            Recharge with a full day of rural fun, cultural performances, pottery, tractor rides, adventure rope courses, and unlimited authentic food.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activities.map((act: any) => (
            <Link
              key={act.id}
              href={`/day-activities/${act.slug}`}
              className="luxury-card rounded-2xl overflow-hidden block group shadow-sm hover:shadow-xl transition-all duration-300 bg-white flex flex-col justify-between"
            >
              <div className="relative h-60 w-full overflow-hidden">
                <Image
                  src={act.imageUrl || '/media/galaxy-heritage-world/day-activities/images/madhavgarh.webp'}
                  alt={act.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />

                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/95 text-[#0B1320]">
                    {act.category}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="flex items-center gap-1.5 text-xs text-gray-200">
                    <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{act.locationLabel}</span>
                  </div>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="font-serif text-xl font-bold text-gray-900 group-hover:text-[#2563EB] transition-colors leading-snug mb-2">
                    {act.title}
                  </h2>
                  <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed mb-4">
                    {act.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{act.durationLabel}</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[#2563EB] group-hover:translate-x-1 transition-transform">
                    <span>Details & Pass</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
