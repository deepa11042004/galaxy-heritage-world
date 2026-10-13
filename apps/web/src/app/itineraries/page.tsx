import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, MapPin, ArrowRight, Sparkles, Clock } from 'lucide-react';
import { getItineraries } from '@/lib/api';

export const metadata = {
  title: 'Curated Itineraries | Galaxy Heritage World',
  description:
    'Explore comprehensive day-by-day travel itineraries crafted by vacation specialists for memorable family holidays.',
};

export const revalidate = 60;

export default async function ItinerariesPage() {
  const res = await getItineraries().catch(() => ({ data: [] }));
  const itineraries = res.data || [];

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#D4AF37] mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Holiday Schedules</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-gray-900 leading-tight">
            Curated Travel Itineraries
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-3 leading-relaxed">
            Every day of your vacation carefully sequenced: scenic drives, authentic dining, iconic sightseeing, and peaceful resort leisure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {itineraries.map((itinerary: any) => (
            <div
              key={itinerary.id}
              className="luxury-card rounded-2xl overflow-hidden flex flex-col justify-between group shadow-sm hover:shadow-xl transition-all duration-300 bg-white"
            >
              <div className="relative h-60 w-full overflow-hidden">
                <Image
                  src={itinerary.heroImageUrl || '/media/galaxy-heritage-world/homepage/images/4-1.png'}
                  alt={itinerary.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />

                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#0B1320]/80 text-[#D4AF37] backdrop-blur-md">
                    {itinerary.badgeText || `${itinerary.durationDays}D / ${itinerary.durationNights}N`}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="flex items-center gap-1.5 text-xs text-gray-200">
                    <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{itinerary.locationLabel}</span>
                  </div>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="font-serif text-xl font-bold text-gray-900 group-hover:text-[#2563EB] transition-colors leading-snug mb-2">
                    {itinerary.title}
                  </h2>
                  <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed mb-4">
                    {itinerary.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{itinerary.durationDays} Days Duration</span>
                  </div>

                  <Link
                    href={`/itineraries/${itinerary.slug}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold rounded-full shadow transition-colors"
                  >
                    <span>View Itinerary</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
