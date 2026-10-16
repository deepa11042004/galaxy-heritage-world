import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Compass, ArrowRight } from 'lucide-react';
import { getDestinations } from '@/lib/api';
import { PageHero } from '@/components/ui/PageHero';

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
          {destinations.map((dest: any) => (
            <Link key={dest.id} href={`/destinations/${dest.slug}`} className="group flex flex-col">
              <div className="media-frame aspect-[4/5]">
                <Image
                  src={dest.heroImageUrl || '/media/galaxy-heritage-world/destinations/images/1-1.png'}
                  alt={dest.name}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />

                <div className="absolute top-4 left-4">
                  <span className="pill">
                    {dest.type === 'DOMESTIC' ? 'Domestic Escape' : 'International Exchange'}
                  </span>
                </div>
              </div>

              <div className="flex flex-1 flex-col pt-4">
                <div className="flex-1">
                  <div className="meta mb-1.5">
                    <MapPin />
                    <span>{dest.region}, {dest.country}</span>
                  </div>
                  <h2 className="text-xl font-semibold tracking-tight text-ink">{dest.name}</h2>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-muted">
                    {dest.tagline || dest.description}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-line pt-4 text-xs">
                  <span className="font-medium text-ink-muted">
                    {dest._count?.hotels ? `${dest._count.hotels} Associated Resorts` : 'Resorts Available'}
                  </span>
                  <span className="link-arrow">
                    <span>View Destination</span>
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
