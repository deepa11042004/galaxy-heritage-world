'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, ArrowRight, Sparkles } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { buttonVariants } from '@/components/ui/button';

interface DestinationItem {
  id: string;
  slug: string;
  name: string;
  region: string;
  country: string;
  type: string;
  tagline?: string | null;
  description: string;
  heroImageUrl: string;
  _count?: { hotels: number; packages: number; itineraries: number };
}

export function DestinationShowcase({ destinations }: { destinations: DestinationItem[] }) {
  const [filter, setFilter] = useState<'ALL' | 'DOMESTIC' | 'INTERNATIONAL'>('ALL');

  const filtered = destinations.filter((d) => {
    if (filter === 'ALL') return true;
    return d.type === filter;
  });

  return (
    <section className="section bg-white">
      <div className="container-page">
        <SectionHeader
          icon={Sparkles}
          eyebrow="Curated Holiday Escapes"
          title={
            <>
              Featured Travel <span className="text-ink-muted">Destinations</span>
            </>
          }
          description="From sun-kissed beaches in Goa to the royal palaces of Rajasthan and snow-capped peaks of Himachal Pradesh."
          actions={
            <div className="segmented">
              <button
                type="button"
                onClick={() => setFilter('ALL')}
                data-active={filter === 'ALL'}
                className="segmented-item"
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setFilter('DOMESTIC')}
                data-active={filter === 'DOMESTIC'}
                className="segmented-item"
              >
                Domestic
              </button>
              <button
                type="button"
                onClick={() => setFilter('INTERNATIONAL')}
                data-active={filter === 'INTERNATIONAL'}
                className="segmented-item"
              >
                International
              </button>
            </div>
          }
        />

        {/* Destination Grid */}
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.slice(0, 6).map((dest) => (
            <Link key={dest.id} href={`/destinations/${dest.slug}`} className="group flex flex-col">
              {/* Card Image */}
              <div className="media-frame aspect-[4/5]">
                <Image
                  src={dest.heroImageUrl || '/media/galaxy-heritage-world/homepage/images/1-2.png'}
                  alt={dest.name}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />

                {/* Badge */}
                <div className="absolute top-4 left-4">
                  <span className="pill">
                    {dest.type === 'DOMESTIC' ? 'Domestic Escape' : 'International Exchange'}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="flex flex-1 flex-col pt-4">
                <div className="flex-1">
                  <div className="meta mb-1.5">
                    <MapPin />
                    <span>{dest.region}, {dest.country}</span>
                  </div>
                  <h3 className="text-xl font-semibold tracking-tight text-ink">{dest.name}</h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-muted">
                    {dest.tagline || dest.description}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-line pt-4 text-xs">
                  <span className="font-medium text-ink-muted">
                    {dest._count?.hotels ? `${dest._count.hotels} Associated Resorts` : 'Resorts Available'}
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
