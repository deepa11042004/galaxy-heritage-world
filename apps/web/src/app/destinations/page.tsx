import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Compass, ArrowRight, Sparkles } from 'lucide-react';
import { getDestinations } from '@/lib/api';

export const metadata = {
  title: 'Destinations | Galaxy Heritage World',
  description:
    'Explore handpicked domestic holiday destinations and international exchange getaways across India, Asia, and beyond.',
};

export const revalidate = 60;

export default async function DestinationsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const res = await getDestinations({ type }).catch(() => ({ data: [] }));
  const destinations = res.data || [];

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#D4AF37] mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>Discover The World</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-gray-900 leading-tight">
            Handpicked Holiday Destinations
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-3 leading-relaxed">
            From tropical beaches and serene mountain retreats to royal heritage palaces and vibrant international destinations.
          </p>

          {/* Type Switcher Pills */}
          <div className="flex items-center justify-center gap-2 mt-8">
            <Link
              href="/destinations"
              className={`px-5 py-2 rounded-full text-xs font-semibold transition-colors ${
                !type ? 'bg-[#0B1320] text-white shadow' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              All Destinations
            </Link>
            <Link
              href="/destinations?type=DOMESTIC"
              className={`px-5 py-2 rounded-full text-xs font-semibold transition-colors ${
                type === 'DOMESTIC' ? 'bg-[#0B1320] text-white shadow' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              Domestic Escapes
            </Link>
            <Link
              href="/destinations?type=INTERNATIONAL"
              className={`px-5 py-2 rounded-full text-xs font-semibold transition-colors ${
                type === 'INTERNATIONAL' ? 'bg-[#0B1320] text-white shadow' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              International Holidays
            </Link>
          </div>
        </div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((dest: any) => (
            <Link
              key={dest.id}
              href={`/destinations/${dest.slug}`}
              className="luxury-card rounded-2xl overflow-hidden block shadow-sm hover:shadow-xl transition-all duration-300 bg-white group"
            >
              <div className="relative h-64 w-full overflow-hidden">
                <Image
                  src={dest.heroImageUrl || '/media/galaxy-heritage-world/destinations/images/1-1.png'}
                  alt={dest.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/95 backdrop-blur-md text-[#0B1320] shadow-sm">
                    {dest.type === 'DOMESTIC' ? 'Domestic Escape' : 'International Exchange'}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-1.5 text-xs text-[#D4AF37] font-semibold mb-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{dest.region}, {dest.country}</span>
                  </div>
                  <h2 className="font-serif text-2xl font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                    {dest.name}
                  </h2>
                </div>
              </div>

              <div className="p-5 flex flex-col justify-between">
                <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-4">
                  {dest.tagline || dest.description}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs font-semibold">
                  <span className="text-gray-500">
                    {dest._count?.hotels ? `${dest._count.hotels} Associated Resorts` : 'Resorts Available'}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[#2563EB] group-hover:translate-x-1 transition-transform">
                    <span>View Destination</span>
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
