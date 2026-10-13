import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Clock,
  MapPin,
  Check,
  PhoneCall,
  Sparkles,
  ArrowRight,
  Sun,
  ShieldCheck,
} from 'lucide-react';
import { getActivityBySlug } from '@/lib/api';

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const res = await getActivityBySlug(slug).catch(() => null);
  if (!res || !res.data) return { title: 'Activity Not Found' };
  return {
    title: `${res.data.title} | Galaxy Heritage World`,
    description: res.data.description?.slice(0, 160) || `Experience ${res.data.title} with Galaxy Heritage World.`,
  };
}

export default async function ActivityDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const res = await getActivityBySlug(slug).catch(() => null);

  if (!res || !res.data) {
    notFound();
  }

  const act = res.data;

  return (
    <div className="bg-[#FAF7F2] min-h-screen">
      {/* Hero Header */}
      <div className="relative h-[55vh] min-h-[400px] w-full bg-[#0B1320] flex items-end">
        <Image
          src={act.imageUrl || '/media/galaxy-heritage-world/day-activities/images/madhavgarh.webp'}
          alt={act.title}
          fill
          priority
          className="object-cover opacity-50"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1320] via-black/30 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-[#D4AF37] uppercase tracking-wider mb-2">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {act.locationLabel}
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {act.durationLabel}
            </span>
            <span>&bull;</span>
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white font-bold">
              {act.category}
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white mb-2">
            {act.title}
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-10">
            <div className="bg-white p-8 rounded-3xl border border-gray-200/80 shadow-sm space-y-4">
              <h2 className="font-serif text-2xl font-bold text-gray-900">
                About The Experience
              </h2>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {act.description}
              </p>
            </div>

            {/* Highlights */}
            {Array.isArray(act.highlights) && act.highlights.length > 0 && (
              <div className="bg-white p-8 rounded-3xl border border-gray-200/80 shadow-sm">
                <h3 className="font-serif text-xl font-bold text-gray-900 mb-6">
                  Activities & Attractions Included
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-gray-700">
                  {act.highlights.map((hl: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <Sparkles className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Inclusions */}
            {Array.isArray(act.inclusions) && act.inclusions.length > 0 && (
              <div className="bg-white p-8 rounded-3xl border border-gray-200/80 shadow-sm">
                <h3 className="font-serif text-xl font-bold text-gray-900 mb-6">
                  Meal & Entry Inclusions
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-gray-700">
                  {act.inclusions.map((inc: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{inc}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Pass Booking */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#D4AF37]/30 shadow-md sticky top-24">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-2">
                <Sun className="w-3.5 h-3.5" />
                <span>Day Pass & Outing</span>
              </div>
              <h3 className="font-serif text-xl font-bold text-gray-900 mb-2">
                Book Entry Pass for {act.title}
              </h3>
              <p className="text-xs text-gray-600 mb-6 leading-relaxed">
                Enjoy special member privileges, family package discounts, and guaranteed pass confirmation.
              </p>

              <div className="space-y-3 mb-6">
                <Link
                  href={`/contact?activity=${encodeURIComponent(act.title)}`}
                  className="w-full py-3.5 px-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow"
                >
                  <span>Book Outing Passes</span>
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
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Breakfast, Lunch & High Tea included</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Full access to adventure zones</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
