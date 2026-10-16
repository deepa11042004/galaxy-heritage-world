'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, MapPin, Palmtree, ArrowRight } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { buttonVariants } from '@/components/ui/button';

interface HotelItem {
  id: string;
  slug: string;
  name: string;
  locationName: string;
  state?: string | null;
  category: string;
  ratingStars: number;
  imageUrl: string;
  amenities?: string[] | null;
  description: string;
}

export function ResortShowcase({ hotels }: { hotels: HotelItem[] }) {
  return (
    <section className="px-2 sm:px-3">
      <div className="section rounded-hero bg-surface">
        <div className="container-page">
          <SectionHeader
            icon={Palmtree}
            eyebrow="Hospitality Network"
            title={
              <>
                43+ Associated <span className="text-ink-muted">Resorts & Hotels</span>
              </>
            }
            description="Stay in verified, quality-audited properties providing world-class comfort, scenic views, and authentic warm Indian hospitality."
            actions={
              <Link href="/hotels-resorts" className={buttonVariants({ size: 'sm' })}>
                <span>Explore All 43+ Resorts</span>
                <ArrowRight />
              </Link>
            }
          />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {hotels.slice(0, 6).map((hotel) => (
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

                    {/* Rating Stars */}
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
                    <h3 className="heading-card">{hotel.name}</h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-muted">{hotel.description}</p>

                    {/* Amenities Pills */}
                    {Array.isArray(hotel.amenities) && hotel.amenities.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {hotel.amenities.slice(0, 3).map((amenity, idx) => (
                          <span key={idx} className="pill-muted">
                            {amenity}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
                    <span className="text-xs font-medium text-ink-muted">Verified Amenities & Audited</span>
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
    </section>
  );
}
