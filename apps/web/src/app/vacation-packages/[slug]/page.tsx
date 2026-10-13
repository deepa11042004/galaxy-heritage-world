import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Clock,
  MapPin,
  Check,
  X,
  PhoneCall,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { getPackageBySlug } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const res = await getPackageBySlug(slug).catch(() => null);
  if (!res || !res.data) return { title: 'Package Not Found' };
  return {
    title: `${res.data.title} | Galaxy Heritage World`,
    description: res.data.overview?.slice(0, 160) || `Book ${res.data.title} with Galaxy Heritage World.`,
  };
}

export default async function PackageDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const res = await getPackageBySlug(slug).catch(() => null);

  if (!res || !res.data) {
    notFound();
  }

  const pkg = res.data;

  return (
    <div className="bg-[#FAF7F2] min-h-screen">
      {/* Hero Header */}
      <div className="relative h-[55vh] min-h-[420px] w-full bg-[#0B1320] flex items-end">
        <Image
          src={pkg.heroImageUrl || '/media/galaxy-heritage-world/homepage/images/2-1.png'}
          alt={pkg.title}
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
              {pkg.locationLabel}
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {pkg.durationDays} Days / {pkg.durationNights} Nights
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white mb-2">
            {pkg.title}
          </h1>

          {pkg.subtitle && (
            <p className="text-sm sm:text-base text-gray-200 max-w-2xl font-light">
              {pkg.subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Overview, Inclusions, Exclusions */}
          <div className="lg:col-span-8 space-y-10">
            {/* Overview */}
            <div className="bg-white p-8 rounded-3xl border border-gray-200/80 shadow-sm space-y-4">
              <h2 className="font-serif text-2xl font-bold text-gray-900">
                Package Overview
              </h2>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {pkg.overview}
              </p>
            </div>

            {/* Inclusions & Exclusions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Inclusions */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-emerald-100 shadow-sm">
                <div className="flex items-center gap-2 text-emerald-700 font-serif text-xl font-bold mb-4">
                  <Check className="w-5 h-5 text-emerald-600" />
                  <h3>Package Inclusions</h3>
                </div>
                {Array.isArray(pkg.inclusions) && pkg.inclusions.length > 0 ? (
                  <ul className="space-y-2.5 text-xs sm:text-sm text-gray-700">
                    {pkg.inclusions.map((item: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-gray-500">Accommodation & breakfast included.</p>
                )}
              </div>

              {/* Exclusions */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-rose-100 shadow-sm">
                <div className="flex items-center gap-2 text-rose-700 font-serif text-xl font-bold mb-4">
                  <X className="w-5 h-5 text-rose-600" />
                  <h3>Package Exclusions</h3>
                </div>
                {Array.isArray(pkg.exclusions) && pkg.exclusions.length > 0 ? (
                  <ul className="space-y-2.5 text-xs sm:text-sm text-gray-700">
                    {pkg.exclusions.map((item: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-gray-500">Personal expenses, airfare & monument entry unless specified.</p>
                )}
              </div>
            </div>

            {/* Highlights */}
            {Array.isArray(pkg.highlights) && pkg.highlights.length > 0 && (
              <div className="bg-white p-8 rounded-3xl border border-gray-200/80 shadow-sm">
                <h3 className="font-serif text-xl font-bold text-gray-900 mb-4">
                  Tour Highlights & Experiences
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-gray-700">
                  {pkg.highlights.map((hl: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Pricing & Booking Widget */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#D4AF37]/30 shadow-md sticky top-24">
              <div className="mb-4">
                <span className="text-[10px] uppercase font-bold text-gray-400">
                  Tariff Starting From
                </span>
                <div className="font-serif text-3xl font-bold text-[#0B1320] mt-0.5">
                  {pkg.priceStarting
                    ? formatCurrency(Number(pkg.priceStarting))
                    : pkg.priceLabel || 'Price on Enquiry'}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Per person on twin sharing basis
                </div>
              </div>

              <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-gray-200 space-y-2 text-xs text-gray-700 mb-6">
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <strong>{pkg.durationDays}D / {pkg.durationNights}N</strong>
                </div>
                <div className="flex justify-between">
                  <span>Destination:</span>
                  <strong>{pkg.locationLabel}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Stay Type:</span>
                  <strong>4-Star Associated Resort</strong>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <Link
                  href={`/contact?package=${encodeURIComponent(pkg.title)}`}
                  className="w-full py-3.5 px-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow"
                >
                  <span>Book This Package</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="tel:18008436114"
                  className="w-full py-3 px-4 bg-[#0B1320] hover:bg-[#1a2538] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow"
                >
                  <PhoneCall className="w-4 h-4 text-[#D4AF37]" />
                  <span>Call Desk: 1800-843-6114</span>
                </a>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-500 justify-center">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Verified Galaxy Heritage Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
