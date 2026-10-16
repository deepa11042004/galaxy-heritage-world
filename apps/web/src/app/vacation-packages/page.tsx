import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Check, ArrowRight, Sparkles } from 'lucide-react';
import { getPackages } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { PageHero } from '@/components/ui/PageHero';
import { buttonVariants } from '@/components/ui/button';

export const metadata = {
  title: 'Vacation Packages | Galaxy Heritage World',
  description:
    'Browse luxury holiday packages across Goa, Rajasthan, Himachal Pradesh, Uttarakhand, and South India with verified resort stays.',
};

export const revalidate = 60;

export default async function VacationPackagesPage() {
  const res = await getPackages().catch(() => ({ data: [] }));
  const packages = res.data || [];

  return (
    <div>
      <PageHero
        icon={Sparkles}
        eyebrow="Tailored Itineraries"
        title={
          <>
            Vacation Packages <span className="text-ink-muted">& Tours</span>
          </>
        }
        subtitle="All-inclusive holiday experiences featuring luxury associated resort stays, delicious breakfasts, curated sightseeing, and on-ground assistance."
      />

      <div className="container-page section">
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg: any) => (
            <div key={pkg.id} className="group flex flex-col">
              <div className="media-frame aspect-[4/3]">
                <Image
                  src={pkg.heroImageUrl || '/media/galaxy-heritage-world/homepage/images/2-1.png'}
                  alt={pkg.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />

                <div className="absolute top-4 left-4">
                  <span className="pill">
                    {pkg.durationDays} Days / {pkg.durationNights} Nights
                  </span>
                </div>
              </div>

              <div className="flex flex-1 flex-col pt-4">
                <div className="flex-1">
                  <div className="meta mb-1.5">
                    <MapPin />
                    <span>{pkg.locationLabel}</span>
                  </div>
                  <h2 className="text-xl font-semibold leading-snug tracking-tight text-ink">{pkg.title}</h2>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-muted">{pkg.overview}</p>

                  {Array.isArray(pkg.inclusions) && pkg.inclusions.length > 0 && (
                    <div className="mt-4 space-y-1.5">
                      {pkg.inclusions.slice(0, 3).map((inc: string, i: number) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-ink-muted">
                          <Check className="h-3.5 w-3.5 shrink-0 text-accent-strong" />
                          <span className="truncate">{inc}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-5 flex items-end justify-between border-t border-line pt-4">
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-subtle">
                      Starting From
                    </div>
                    <div className="text-lg font-semibold text-ink">
                      {pkg.priceStarting
                        ? formatCurrency(Number(pkg.priceStarting))
                        : pkg.priceLabel || 'Price on Request'}
                    </div>
                  </div>

                  <Link href={`/vacation-packages/${pkg.slug}`} className={buttonVariants({ size: 'sm' })}>
                    <span>View Tour</span>
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
