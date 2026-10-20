'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Check, ArrowRight, Sparkles } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { buttonVariants } from '@/components/ui/button';

interface PackageItem {
  id: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  locationLabel: string;
  durationDays: number;
  durationNights: number;
  priceStarting?: number | string | null;
  priceLabel?: string | null;
  heroImageUrl: string;
  overview: string;
  inclusions?: string[] | null;
  category: string;
}

export function PackageCards({ packages }: { packages: PackageItem[] }) {
  return (
    <section className="section section-plain bg-white">
      <div className="container-page">
        <SectionHeader
          icon={Sparkles}
          eyebrow="Tailored Holiday Packages"
          title={
            <>
              Signature Vacation <span className="text-ink-muted">Experiences</span>
            </>
          }
          description="Carefully crafted packages combining 4-star resort accommodation, guided sightseeing, and exclusive holiday desk support."
          actions={
            <Link href="/vacation-packages" className={buttonVariants({ size: 'sm' })}>
              <span>Browse All Packages</span>
              <ArrowRight />
            </Link>
          }
        />

        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {packages.slice(0, 4).map((pkg) => (
            <div key={pkg.id} className="card card-hover group flex flex-col p-2.5">
              {/* Image & Badge */}
              <div className="media-frame aspect-[4/3] rounded-[0.9rem]">
                <Image
                  src={pkg.heroImageUrl || '/media/galaxy-heritage-world/homepage/images/2-1.png'}
                  alt={pkg.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute top-3 left-3">
                  <span className="pill">
                    {pkg.durationDays}D / {pkg.durationNights}N
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="flex flex-1 flex-col px-2.5 pt-4 pb-2">
                <div className="flex-1">
                  <div className="meta mb-1.5">
                    <MapPin />
                    <span>{pkg.locationLabel}</span>
                  </div>
                  <h3 className="heading-card">{pkg.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-muted">{pkg.overview}</p>

                  {/* Highlights/Inclusions */}
                  {Array.isArray(pkg.inclusions) && pkg.inclusions.length > 0 && (
                    <div className="mt-3 space-y-1">
                      {pkg.inclusions.slice(0, 2).map((inc, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-xs text-ink-muted">
                          <Check className="h-3.5 w-3.5 shrink-0 text-accent-strong" />
                          <span className="truncate">{inc}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Price and CTA */}
                <div className="mt-4 flex items-end justify-between border-t border-line pt-4">
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-subtle">
                      Starting From
                    </div>
                    <div className="text-base font-semibold text-ink">
                      {pkg.priceStarting
                        ? formatCurrency(Number(pkg.priceStarting))
                        : pkg.priceLabel || 'Price on Enquiry'}
                    </div>
                  </div>

                  <Link
                    href={`/vacation-packages/${pkg.slug}`}
                    className="icon-btn group-hover:border-accent group-hover:bg-accent group-hover:text-ink"
                    aria-label={`View ${pkg.title}`}
                  >
                    <ArrowRight />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
