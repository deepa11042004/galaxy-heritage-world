import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Calendar,
  MapPin,
  Clock,
  Utensils,
  Hotel,
  ArrowRight,
  PhoneCall,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { getItineraryBySlug } from '@/lib/api';

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const res = await getItineraryBySlug(slug).catch(() => null);
  if (!res || !res.data) return { title: 'Itinerary Not Found' };
  return {
    title: `${res.data.title} | Galaxy Heritage World`,
    description: res.data.summary?.slice(0, 160) || `Explore ${res.data.title} day-by-day plan with Galaxy Heritage World.`,
  };
}

export default async function ItineraryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const res = await getItineraryBySlug(slug).catch(() => null);

  if (!res || !res.data) {
    notFound();
  }

  const it = res.data;

  return (
    <div className="bg-[#FAF7F2] min-h-screen">
      {/* Hero Header */}
      <div className="relative h-[55vh] min-h-[420px] w-full bg-[#0B1320] flex items-end">
        <Image
          src={it.heroImageUrl || '/media/galaxy-heritage-world/homepage/images/4-1.png'}
          alt={it.title}
          fill
          priority
          className="object-cover opacity-50"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1320] via-black/40 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-[#D4AF37] uppercase tracking-wider mb-2">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {it.locationLabel}
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {it.durationDays} Days / {it.durationNights} Nights
            </span>
            {it.badgeText && (
              <>
                <span>&bull;</span>
                <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white font-bold">
                  {it.badgeText}
                </span>
              </>
            )}
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white mb-2">
            {it.title}
          </h1>

          <p className="text-sm sm:text-base text-gray-200 max-w-2xl font-light">
            {it.summary}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Schedule */}
          <div className="lg:col-span-8 space-y-10">
            {/* Overview */}
            <div className="bg-white p-8 rounded-3xl border border-gray-200/80 shadow-sm space-y-4">
              <h2 className="font-serif text-2xl font-bold text-gray-900">
                Itinerary Overview
              </h2>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {it.overview}
              </p>
            </div>

            {/* Day-by-Day Timeline */}
            <div className="space-y-6">
              <h3 className="font-serif text-2xl font-bold text-gray-900">
                Day-by-Day Schedule
              </h3>

              {Array.isArray(it.days) && it.days.length > 0 ? (
                <div className="space-y-6">
                  {it.days.map((day: any) => (
                    <div
                      key={day.id || day.dayNumber}
                      className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-sm relative pl-6 sm:pl-8"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#0B1320] text-[#D4AF37] uppercase tracking-wider">
                          Day {day.dayNumber}
                        </span>
                        <h4 className="font-serif text-lg sm:text-xl font-bold text-gray-900">
                          {day.title}
                        </h4>
                      </div>

                      <p className="text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-line mb-4">
                        {day.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-gray-100 text-xs text-gray-500">
                        {day.meals && (
                          <div className="flex items-center gap-1.5">
                            <Utensils className="w-3.5 h-3.5 text-[#D4AF37]" />
                            <span>Meals: {day.meals}</span>
                          </div>
                        )}
                        {day.stayLocation && (
                          <div className="flex items-center gap-1.5">
                            <Hotel className="w-3.5 h-3.5 text-[#D4AF37]" />
                            <span>Stay: {day.stayLocation}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 bg-white rounded-2xl text-center text-xs text-gray-500">
                  Custom itinerary days available on request from our travel desk.
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Concierge Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#D4AF37]/30 shadow-md sticky top-24">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Custom Itinerary Planning</span>
              </div>
              <h3 className="font-serif text-xl font-bold text-gray-900 mb-2">
                Book This Travel Plan
              </h3>
              <p className="text-xs text-gray-600 mb-6 leading-relaxed">
                Want to modify days, add extra nights, or customize your vehicle? Our travel desk will tailor this itinerary to your family&apos;s pace.
              </p>

              <div className="space-y-3 mb-6">
                <Link
                  href={`/contact?itinerary=${encodeURIComponent(it.title)}`}
                  className="w-full py-3.5 px-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow"
                >
                  <span>Request Custom Itinerary</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="tel:18008436114"
                  className="w-full py-3 px-4 bg-[#0B1320] hover:bg-[#1a2538] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow"
                >
                  <PhoneCall className="w-4 h-4 text-[#D4AF37]" />
                  <span>Call Toll-Free: 1800-843-6114</span>
                </a>
              </div>

              <div className="p-4 bg-[#FAF7F2] rounded-xl text-xs text-gray-600 space-y-1.5 border border-gray-100">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Verified 4-Star Resort Stays</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Dedicated on-tour assistance</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
