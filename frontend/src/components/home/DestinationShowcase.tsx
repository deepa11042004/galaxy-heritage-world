'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, ArrowRight, Sparkles } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { buttonVariants } from '@/components/ui/button';

interface CityItem {
  locationType: string | null;
  location: string;
  country: string;
  count: number;
  imageUrl: string | null;
}

/** Destinations featured on the home page, in this order (live hotel data: count, photo, link). */
const FEATURED = ['Dubai', 'Bali', 'Switzerland', 'Goa', 'Kerala', 'Manali'] as const;

export function DestinationShowcase({ destinations }: { destinations: CityItem[] }) {
  const featured = FEATURED.map((name) => destinations.find((d) => d.location === name)).filter((d): d is CityItem => Boolean(d));

  return (
    <section className="section section-pattern">
      <div className="container-page">
        <SectionHeader
          icon={Sparkles}
          eyebrow="Curated Holiday Escapes"
          title={
            <>
              Featured Travel <span className="text-ink-muted">Destinations</span>
            </>
          }
          description="From the skyline of Dubai and the Alpine peaks of Switzerland to the beaches of Goa, the backwaters of Kerala and the Himalayan valleys of Manali."
        />

        {/* Destination Grid */}
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((dest) => (
            <Link
              key={`${dest.locationType}-${dest.location}`}
              href={`/hotels-resorts?type=${dest.locationType ?? ''}&location=${encodeURIComponent(dest.location)}`}
              className="card card-hover group flex flex-col p-2.5"
            >
              <div className="media-frame aspect-[4/3] rounded-[0.9rem]">
                <Image
                  src={dest.imageUrl || '/media/galaxy-heritage-world/homepage/images/1-2.png'}
                  alt={dest.location}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  quality={90}
                />
                <div className="absolute top-4 left-4">
                  <span className="pill">
                    {dest.locationType === 'DOMESTIC' ? 'Domestic Escape' : 'International Exchange'}
                  </span>
                </div>
              </div>

              <div className="flex flex-1 flex-col px-2.5 pt-4 pb-2">
                <div className="flex-1">
                  <div className="meta mb-1.5">
                    <MapPin />
                    <span>{dest.country}</span>
                  </div>
                  <h3 className="text-xl font-semibold tracking-tight text-ink">{dest.location}</h3>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-line pt-4 text-xs">
                  <span className="font-medium text-ink-muted">
                    {dest.count} Associated {dest.count === 1 ? 'Resort' : 'Resorts'}
                  </span>
                  <span className="link-arrow">
                    <span>Explore</span>
                    <ArrowRight />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All CTA */}
        <div className="mt-14 text-center">
          <Link href="/destinations" className={buttonVariants({ variant: 'dark', size: 'lg' })}>
            <span>View All Destinations</span>
            <ArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
}
