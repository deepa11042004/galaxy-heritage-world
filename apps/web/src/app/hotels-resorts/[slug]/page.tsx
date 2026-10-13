import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Star,
  MapPin,
  Check,
  Palmtree,
  ArrowRight,
  PhoneCall,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { getHotelBySlug } from '@/lib/api';

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const res = await getHotelBySlug(slug).catch(() => null);
  if (!res || !res.data) return { title: 'Hotel Not Found' };
  return {
    title: `${res.data.name} | Galaxy Heritage World`,
    description: res.data.description?.slice(0, 160) || `Stay at ${res.data.name} with Galaxy Heritage World.`,
  };
}

export default async function HotelDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const res = await getHotelBySlug(slug).catch(() => null);

  if (!res || !res.data) {
    notFound();
  }

  const hotel = res.data;

  return (
    <div className="bg-[#FAF7F2] min-h-screen">
      {/* Hero Header */}
      <div className="relative h-[55vh] min-h-[400px] w-full bg-[#0B1320] flex items-end">
        <Image
          src={hotel.imageUrl || '/media/galaxy-heritage-world/homepage/images/3-2.png'}
          alt={hotel.name}
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
              {hotel.locationName}{hotel.state ? `, ${hotel.state}` : ''}
            </span>
            <span>&bull;</span>
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white font-bold">
              {hotel.category === 'ASSOCIATED' ? 'Associated Partner Resort' : 'Luxury Internal'}
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1 text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              {hotel.ratingStars}.0 Star Rated
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white mb-2">
            {hotel.name}
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Description & Amenities */}
          <div className="lg:col-span-8 space-y-10">
            <div className="bg-white p-8 rounded-3xl border border-gray-200/80 shadow-sm space-y-4">
              <h2 className="font-serif text-2xl font-bold text-gray-900">
                Property Overview
              </h2>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {hotel.description}
              </p>
            </div>

            {/* Amenities */}
            {Array.isArray(hotel.amenities) && hotel.amenities.length > 0 && (
              <div className="bg-white p-8 rounded-3xl border border-gray-200/80 shadow-sm">
                <h3 className="font-serif text-xl font-bold text-gray-900 mb-6">
                  Verified Resort Amenities & Facilities
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {hotel.amenities.map((amenity: string, idx: number) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-[#FAF7F2] border border-gray-100 flex items-center gap-3 text-xs sm:text-sm font-medium text-gray-800"
                    >
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Reservation & Concierge Widget */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#D4AF37]/30 shadow-md sticky top-24">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Member Privileges</span>
              </div>
              <h3 className="font-serif text-xl font-bold text-gray-900 mb-2">
                Reserve Stay at {hotel.name}
              </h3>
              <p className="text-xs text-gray-600 mb-6 leading-relaxed">
                Connect directly with our travel desk to check available check-in dates, redeem your holiday vouchers, or secure group booking rates.
              </p>

              <div className="space-y-3 mb-6">
                <Link
                  href={`/contact?hotel=${encodeURIComponent(hotel.name)}`}
                  className="w-full py-3.5 px-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow"
                >
                  <span>Book Reservation Enquiry</span>
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
                  <span>Quality-audited guest rooms</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Toll-free coordinator assistance</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
