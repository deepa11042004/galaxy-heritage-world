import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  MapPin,
  Calendar,
  Check,
  Palmtree,
  ArrowRight,
  Clock,
  Sparkles,
  PhoneCall,
} from 'lucide-react';
import { getDestinationBySlug } from '@/lib/api';

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const res = await getDestinationBySlug(slug).catch(() => null);
  if (!res || !res.data) return { title: 'Destination Not Found' };
  return {
    title: `${res.data.name} Holidays | Galaxy Heritage World`,
    description: res.data.description?.slice(0, 160) || `Explore ${res.data.name} with Galaxy Heritage World.`,
  };
}

export default async function DestinationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const res = await getDestinationBySlug(slug).catch(() => null);

  if (!res || !res.data) {
    notFound();
  }

  const dest = res.data;

  return (
    <div className="bg-[#FAF7F2] min-h-screen">
      {/* Hero Banner */}
      <div className="relative h-[55vh] min-h-[400px] w-full bg-[#0B1320] flex items-end">
        <Image
          src={dest.heroImageUrl || '/media/galaxy-heritage-world/destinations/images/1-1.png'}
          alt={dest.name}
          fill
          priority
          className="object-cover opacity-50"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1320] via-black/30 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#D4AF37] uppercase tracking-wider mb-2">
            <MapPin className="w-4 h-4" />
            <span>{dest.region}, {dest.country}</span>
            <span>&bull;</span>
            <span>{dest.type === 'DOMESTIC' ? 'Domestic Destination' : 'International Exchange'}</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white mb-3">
            {dest.name}
          </h1>

          {dest.tagline && (
            <p className="text-sm sm:text-lg text-gray-200 max-w-2xl font-light">
              {dest.tagline}
            </p>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Details, Highlights, Properties & Packages */}
          <div className="lg:col-span-8 space-y-12">
            {/* Overview */}
            <div className="bg-white p-8 rounded-3xl border border-gray-200/80 shadow-sm space-y-4">
              <h2 className="font-serif text-2xl font-bold text-gray-900">
                About {dest.name}
              </h2>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {dest.description}
              </p>

              {dest.bestTimeToVisit && (
                <div className="flex items-center gap-2 pt-4 border-t border-gray-100 text-xs text-gray-700">
                  <Calendar className="w-4 h-4 text-[#D4AF37]" />
                  <span><strong>Best Time to Visit:</strong> {dest.bestTimeToVisit}</span>
                </div>
              )}
            </div>

            {/* Highlights */}
            {Array.isArray(dest.highlights) && dest.highlights.length > 0 && (
              <div className="bg-white p-8 rounded-3xl border border-gray-200/80 shadow-sm">
                <h3 className="font-serif text-xl font-bold text-gray-900 mb-4">
                  Destination Highlights
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {dest.highlights.map((hl: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Associated Hotels & Resorts */}
            {Array.isArray(dest.hotels) && dest.hotels.length > 0 && (
              <div>
                <h3 className="font-serif text-2xl font-bold text-gray-900 mb-6">
                  Associated Resorts in {dest.name}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {dest.hotels.map((hotel: any) => (
                    <Link
                      key={hotel.id}
                      href={`/hotels-resorts/${hotel.slug}`}
                      className="luxury-card rounded-2xl overflow-hidden block bg-white shadow-sm hover:shadow-md transition-all group"
                    >
                      <div className="relative h-44 w-full">
                        <Image
                          src={hotel.imageUrl || '/media/galaxy-heritage-world/homepage/images/3-2.png'}
                          alt={hotel.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, 384px"
                        />
                      </div>
                      <div className="p-4">
                        <h4 className="font-serif text-lg font-bold text-gray-900 group-hover:text-[#2563EB] transition-colors">
                          {hotel.name}
                        </h4>
                        <div className="text-xs text-gray-500 mt-1">
                          {hotel.locationName}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Holiday Packages */}
            {Array.isArray(dest.packages) && dest.packages.length > 0 && (
              <div>
                <h3 className="font-serif text-2xl font-bold text-gray-900 mb-6">
                  Holiday Packages for {dest.name}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {dest.packages.map((pkg: any) => (
                    <Link
                      key={pkg.id}
                      href={`/vacation-packages/${pkg.slug}`}
                      className="luxury-card rounded-2xl overflow-hidden block bg-white shadow-sm hover:shadow-md transition-all group"
                    >
                      <div className="relative h-44 w-full">
                        <Image
                          src={pkg.heroImageUrl || '/media/galaxy-heritage-world/homepage/images/2-1.png'}
                          alt={pkg.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, 384px"
                        />
                        <div className="absolute top-3 left-3 bg-[#0B1320]/80 text-[#D4AF37] px-2.5 py-1 rounded-full text-[10px] font-bold uppercase">
                          {pkg.durationDays}D / {pkg.durationNights}N
                        </div>
                      </div>
                      <div className="p-4">
                        <h4 className="font-serif text-base font-bold text-gray-900 group-hover:text-[#2563EB] transition-colors">
                          {pkg.title}
                        </h4>
                        <p className="text-xs text-gray-600 line-clamp-2 mt-1">
                          {pkg.overview}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Enquiry Card & Concierge */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-[#D4AF37]/30 shadow-md sticky top-24">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Book This Destination</span>
              </div>
              <h3 className="font-serif text-xl font-bold text-gray-900 mb-2">
                Plan Your Trip to {dest.name}
              </h3>
              <p className="text-xs text-gray-600 mb-6 leading-relaxed">
                Our destination experts will curate your hotel reservations, vouchers redemption, and itinerary options.
              </p>

              <div className="space-y-3 mb-6">
                <a
                  href="tel:18008436114"
                  className="w-full py-3 px-4 bg-[#0B1320] hover:bg-[#1a2538] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow"
                >
                  <PhoneCall className="w-4 h-4 text-[#D4AF37]" />
                  <span>Call Toll-Free: 1800-843-6114</span>
                </a>
                <Link
                  href={`/contact?destination=${encodeURIComponent(dest.name)}`}
                  className="w-full py-3 px-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow"
                >
                  <span>Enquire for {dest.name}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="p-4 bg-[#FAF7F2] rounded-xl text-xs text-gray-600 space-y-1">
                <div>&bull; Verified 4-star & 5-star properties</div>
                <div>&bull; No booking hidden surprises</div>
                <div>&bull; Dedicated trip coordinator</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
