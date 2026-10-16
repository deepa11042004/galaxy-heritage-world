import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, MapPin, Palmtree, ArrowRight } from 'lucide-react';
import { getHotels } from '@/lib/api';
import { PageHero } from '@/components/ui/PageHero';

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
    <div>
      <PageHero
        icon={Palmtree}
        eyebrow="Hospitality Network"
        title={
          <>
            43+ Associated <span className="text-ink-muted">Resorts & Hotels</span>
          </>
        }
        subtitle="Every property in our network is audited for star-quality comfort, family-friendly amenities, scenic locations, and authentic hospitality."
      >
        {/* Category Switcher Pills */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          <Link href="/hotels-resorts" data-active={!category} className="chip">
            All 43+ Resorts
          </Link>
          <Link
            href="/hotels-resorts?category=ASSOCIATED"
            data-active={category === 'ASSOCIATED'}
            className="chip"
          >
            Associated Partners
          </Link>
          <Link
            href="/hotels-resorts?category=INTERNAL"
            data-active={category === 'INTERNAL'}
            className="chip"
          >
            Internal Properties
          </Link>
        </div>
      </PageHero>

      {/* Resorts Grid */}
      <div className="container-page section">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {hotels.map((hotel: any) => (
            <div key={hotel.id} className="card card-hover group flex flex-col p-2.5">
              <div className="media-frame aspect-[4/3] rounded-[0.9rem]">
                <Image
                  src={hotel.imageUrl || '/media/galaxy-heritage-world/homepage/images/3-2.png'}
                  alt={hotel.name}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />

                <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                  <span className="pill">
                    {hotel.category === 'ASSOCIATED' ? 'Associated Partner' : 'Luxury Internal'}
                  </span>

                  <span className="pill">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    <span>{hotel.ratingStars}.0</span>
                  </span>
                </div>
              </div>

              <div className="flex flex-1 flex-col justify-between px-2.5 pt-4 pb-2">
                <div>
                  <div className="meta mb-1.5">
                    <MapPin />
                    <span>{hotel.locationName}{hotel.state ? `, ${hotel.state}` : ''}</span>
                  </div>
                  <h2 className="text-xl font-semibold leading-snug tracking-tight text-ink">{hotel.name}</h2>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-muted">{hotel.description}</p>

                  {Array.isArray(hotel.amenities) && hotel.amenities.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {hotel.amenities.slice(0, 3).map((amenity: string, idx: number) => (
                        <span key={idx} className="pill-muted">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
                  <span className="text-xs font-medium text-ink-muted">Verified Quality Audited</span>
                  <Link href={`/hotels-resorts/${hotel.slug}`} className="link-arrow">
                    <span>View Property</span>
                    <ArrowRight />
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
