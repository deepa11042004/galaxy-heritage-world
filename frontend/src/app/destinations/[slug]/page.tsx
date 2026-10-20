import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MapPin, Calendar, Check, ArrowRight, Sparkles, PhoneCall } from 'lucide-react';
import { getDestinationBySlug } from '@/lib/api';
import { PageHero } from '@/components/ui/PageHero';
import { buttonVariants } from '@/components/ui/button';

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const res = await getDestinationBySlug(slug).catch(() => null);
  if (!res || !res.data) return { title: 'Destination Not Found' };
  return {
    title: `${res.data.name} Holidays | Galaxy Heritage World`,
    description: res.data.description?.slice(0, 160) || `Explore ${res.data.name} with Galaxy Heritage World.`,
  };
}

export default async function DestinationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const res = await getDestinationBySlug(slug).catch(() => null);

  if (!res || !res.data) {
    notFound();
  }

  const dest = res.data;

  return (
    <div>
      {/* Hero Banner */}
      <PageHero
        image={{
          src: dest.heroImageUrl || '/media/galaxy-heritage-world/destinations/images/1-1.png',
          alt: dest.name,
        }}
        meta={
          <>
            <span className="pill-glass">
              <MapPin className="h-3.5 w-3.5" />
              <span>{dest.region}, {dest.country}</span>
            </span>
            <span className="text-white/60">&bull;</span>
            <span className="pill-glass">
              {dest.type === 'DOMESTIC' ? 'Domestic Destination' : 'International Exchange'}
            </span>
          </>
        }
        title={dest.name}
        subtitle={dest.tagline || undefined}
      />

      {/* Main Content Area */}
      <div className="container-page section">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Details, Highlights, Properties & Packages */}
          <div className="space-y-12 lg:col-span-8">
            {/* Overview */}
            <div className="card space-y-4 p-6 sm:p-8">
              <h2 className="text-2xl font-medium text-ink sm:text-3xl">About {dest.name}</h2>
              <p className="whitespace-pre-line text-sm leading-relaxed text-ink-muted sm:text-base">
                {dest.description}
              </p>

              {dest.bestTimeToVisit && (
                <div className="flex items-center gap-2 border-t border-line pt-4 text-sm text-ink-muted">
                  <Calendar className="h-4 w-4 shrink-0 text-accent-strong" />
                  <span>
                    <strong className="font-semibold text-ink">Best Time to Visit:</strong> {dest.bestTimeToVisit}
                  </span>
                </div>
              )}
            </div>

            {/* Highlights */}
            {Array.isArray(dest.highlights) && dest.highlights.length > 0 && (
              <div className="card p-6 sm:p-8">
                <h3 className="mb-5 text-xl font-semibold text-ink">Destination Highlights</h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {dest.highlights.map((hl: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2.5 text-sm text-ink-muted">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-strong" />
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Associated Hotels & Resorts */}
            {Array.isArray(dest.hotels) && dest.hotels.length > 0 && (
              <div>
                <h3 className="mb-6 text-2xl font-medium tracking-tight text-ink sm:text-3xl">Associated Resorts in {dest.name}</h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {dest.hotels.map((hotel: any) => (
                    <Link key={hotel.id} href={`/hotels-resorts/${hotel.slug}`} className="group block">
                      <div className="media-frame aspect-[16/10]">
                        <Image
                          src={hotel.imageUrl || '/media/galaxy-heritage-world/homepage/images/3-2.png'}
                          alt={hotel.name}
                          fill
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, 384px"
                        />
                      </div>
                      <div className="pt-3">
                        <h4 className="text-lg font-semibold text-ink">{hotel.name}</h4>
                        <div className="meta mt-1">{hotel.locationName}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Holiday Packages */}
            {Array.isArray(dest.packages) && dest.packages.length > 0 && (
              <div>
                <h3 className="mb-6 text-2xl font-medium tracking-tight text-ink sm:text-3xl">Holiday Packages for {dest.name}</h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {dest.packages.map((pkg: any) => (
                    <Link key={pkg.id} href={`/vacation-packages/${pkg.slug}`} className="group block">
                      <div className="media-frame aspect-[16/10]">
                        <Image
                          src={pkg.heroImageUrl || '/media/galaxy-heritage-world/homepage/images/2-1.png'}
                          alt={pkg.title}
                          fill
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, 384px"
                        />
                        <div className="absolute top-3 left-3 pill">
                          {pkg.durationDays}D / {pkg.durationNights}N
                        </div>
                      </div>
                      <div className="pt-3">
                        <h4 className="text-base font-semibold text-ink">{pkg.title}</h4>
                        <p className="mt-1 line-clamp-2 text-sm text-ink-muted">{pkg.overview}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Enquiry Card & Concierge */}
          <div className="space-y-6 lg:col-span-4">
            <div className="card sticky top-[calc(var(--header-h)+1rem)] p-6 shadow-[0_24px_60px_-36px_rgba(14,14,14,0.3)] sm:p-7">
              <div className="eyebrow mb-4">
                <Sparkles />
                <span>Book This Destination</span>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-ink">Plan Your Trip to {dest.name}</h3>
              <p className="mb-6 text-sm leading-relaxed text-ink-muted">
                Our destination experts will curate your hotel reservations, vouchers redemption, and itinerary options.
              </p>

              <div className="mb-6 space-y-3">
                <a href="tel:18008436114" className={buttonVariants({ variant: 'dark', block: true })}>
                  <PhoneCall className="text-accent" />
                  <span>Call Toll-Free: 1800-843-6114</span>
                </a>
                <Link
                  href={`/contact?destination=${encodeURIComponent(dest.name)}`}
                  className={buttonVariants({ block: true })}
                >
                  <span>Enquire for {dest.name}</span>
                  <ArrowRight />
                </Link>
              </div>

              <div className="inset-box space-y-1">
                <div>&bull; Verified 4-star & 5-star properties</div>
                <div>&bull; No booking hidden surprises</div>
                <div>&bull; Dedicated trip coordinator</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
