import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, MapPin, Palmtree, ArrowRight, Sparkles } from 'lucide-react';
import { getHotels } from '@/lib/api';

export const metadata = {
  title: 'Hotels & 43+ Associated Resorts | Galaxy Heritage World',
  description:
    'Explore 43+ associated 4-star and 5-star partner resorts and internal properties across India and abroad with Galaxy Heritage World.',
};

export const revalidate = 60;

export default async function HotelsResortsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const res = await getHotels({ category }).catch(() => ({ data: [] }));
  const hotels = res.data || [];

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#D4AF37] mb-2">
            <Palmtree className="w-3.5 h-3.5" />
            <span>Hospitality Network</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-gray-900 leading-tight">
            43+ Associated Resorts & Hotels
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-3 leading-relaxed">
            Every property in our network is audited for star-quality comfort, family-friendly amenities, scenic locations, and authentic hospitality.
          </p>

          {/* Category Switcher Pills */}
          <div className="flex items-center justify-center gap-2 mt-8">
            <Link
              href="/hotels-resorts"
              className={`px-5 py-2 rounded-full text-xs font-semibold transition-colors ${
                !category ? 'bg-[#0B1320] text-white shadow' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              All 43+ Resorts
            </Link>
            <Link
              href="/hotels-resorts?category=ASSOCIATED"
              className={`px-5 py-2 rounded-full text-xs font-semibold transition-colors ${
                category === 'ASSOCIATED' ? 'bg-[#0B1320] text-white shadow' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              Associated Partners
            </Link>
            <Link
              href="/hotels-resorts?category=INTERNAL"
              className={`px-5 py-2 rounded-full text-xs font-semibold transition-colors ${
                category === 'INTERNAL' ? 'bg-[#0B1320] text-white shadow' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              Internal Properties
            </Link>
          </div>
        </div>

        {/* Resorts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {hotels.map((hotel: any) => (
            <div
              key={hotel.id}
              className="luxury-card rounded-2xl overflow-hidden flex flex-col justify-between group shadow-sm hover:shadow-xl transition-all duration-300 bg-white"
            >
              <div className="relative h-60 w-full overflow-hidden">
                <Image
                  src={hotel.imageUrl || '/media/galaxy-heritage-world/homepage/images/3-2.png'}
                  alt={hotel.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />

                <div className="absolute top-4 left-4">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/95 text-[#0B1320]">
                    {hotel.category === 'ASSOCIATED' ? 'Associated Partner' : 'Luxury Internal'}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                  <div className="flex items-center gap-1 text-xs text-gray-200">
                    <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{hotel.locationName}{hotel.state ? `, ${hotel.state}` : ''}</span>
                  </div>

                  <div className="flex items-center gap-0.5 bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-full text-amber-400 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{hotel.ratingStars}.0</span>
                  </div>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="font-serif text-xl font-bold text-gray-900 group-hover:text-[#2563EB] transition-colors leading-snug mb-2">
                    {hotel.name}
                  </h2>
                  <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-4">
                    {hotel.description}
                  </p>

                  {Array.isArray(hotel.amenities) && hotel.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {hotel.amenities.slice(0, 3).map((amenity: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-[#FAF7F2] text-gray-600 border border-gray-100"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-gray-500 font-medium">
                    Verified Quality Audited
                  </span>
                  <Link
                    href={`/hotels-resorts/${hotel.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#2563EB] group-hover:translate-x-1 transition-transform"
                  >
                    <span>View Property</span>
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
