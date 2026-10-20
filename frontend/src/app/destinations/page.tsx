import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Compass, ArrowRight } from 'lucide-react';
import { getHotelFilters } from '@/lib/api';
import { PageHero } from '@/components/ui/PageHero';
import { normalizeImageUrl } from '@/lib/utils';

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
  const res = await getHotelFilters().catch(() => ({ data: [] as any[] }));
  const cities = (res.data || []).filter((c) => !type || c.locationType === type);

  return (
    <div>
      <PageHero
        icon={Compass}
        eyebrow="Discover The World"
        title={
          <>
            Handpicked Holiday <span className="text-ink-muted">Destinations</span>
          </>
        }
        subtitle="From tropical beaches and serene mountain retreats to royal heritage palaces and vibrant international destinations."
      >
        {/* Type Switcher Pills */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          <Link href="/destinations" data-active={!type} className="chip">
            All Destinations
          </Link>
          <Link href="/destinations?type=DOMESTIC" data-active={type === 'DOMESTIC'} className="chip">
            Domestic Escapes
          </Link>
          <Link
            href="/destinations?type=INTERNATIONAL"
            data-active={type === 'INTERNATIONAL'}
            className="chip"
          >
            International Holidays
          </Link>
        </div>
      </PageHero>

      {/* Destinations Grid */}
      <div className="container-page section">
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {cities.map((city) => (
            <Link
              key={`${city.locationType}-${city.location}`}
              href={`/hotels-resorts?type=${city.locationType ?? ''}&location=${encodeURIComponent(city.location)}`}
              className="group flex flex-col"
            >
              <div className="media-frame aspect-[4/3]">
                <Image
                  src={normalizeImageUrl(city.imageUrl, '/media/galaxy-heritage-world/destinations/images/1-1.png')}
                  alt={city.location}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  quality={90}
                />

                <div className="absolute top-4 left-4">
                  <span className="pill">
                    {city.locationType === 'DOMESTIC' ? 'Domestic Escape' : 'International Exchange'}
                  </span>
                </div>
              </div>

              <div className="flex flex-1 flex-col pt-4">
                <div className="flex-1">
                  <div className="meta mb-1.5">
                    <MapPin />
                    <span>{city.country}</span>
                  </div>
                  <h2 className="text-xl font-semibold tracking-tight text-ink">{city.location}</h2>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-line pt-4 text-xs">
                  <span className="font-medium text-ink-muted">
                    {city.count} {city.count === 1 ? 'Property' : 'Properties'}
                  </span>
                  <span className="link-arrow">
                    <span>View Hotels</span>
                    <ArrowRight />
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
