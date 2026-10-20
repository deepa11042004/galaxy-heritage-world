import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Star, MapPin, Check, ArrowRight, PhoneCall, ShieldCheck, Sparkles } from 'lucide-react';
import { getHotelBySlug } from '@/lib/api';
import { PageHero } from '@/components/ui/PageHero';
import { buttonVariants } from '@/components/ui/button';

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const res = await getHotelBySlug(slug).catch(() => null);
  if (!res || !res.data) return { title: 'Hotel Not Found' };
  return {
    title: `${res.data.name} | Galaxy Heritage World`,
    description: res.data.description?.slice(0, 160) || `Stay at ${res.data.name} with Galaxy Heritage World.`,
  };
}

export default async function HotelDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const res = await getHotelBySlug(slug).catch(() => null);

  if (!res || !res.data) {
    notFound();
  }

  const hotel = res.data;

  return (
    <div>
      {/* Hero Header */}
      <PageHero
        image={{
          src: hotel.imageUrl || '/media/galaxy-heritage-world/homepage/images/3-2.png',
          alt: hotel.name,
        }}
        meta={
          <>
            <span className="pill-glass">
              <MapPin className="h-3.5 w-3.5" />
              {hotel.locationName}{hotel.state ? `, ${hotel.state}` : ''}
            </span>
            <span className="text-white/60">&bull;</span>
            <span className="pill-glass">
              {hotel.category === 'ASSOCIATED' ? 'Associated Partner Resort' : 'Luxury Internal'}
            </span>
            <span className="text-white/60">&bull;</span>
            <span className="pill-glass">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              {hotel.ratingStars}.0 Star Rated
            </span>
          </>
        }
        title={hotel.name}
      />

      {/* Main Content */}
      <div className="container-page section">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Description & Amenities */}
          <div className="space-y-6 lg:col-span-8">
            {hotel.description && (
              <div className="card space-y-4 p-6 sm:p-8">
                <h2 className="text-2xl font-medium text-ink sm:text-3xl">Property Overview</h2>
                <p className="whitespace-pre-line text-sm leading-relaxed text-ink-muted sm:text-base">
                  {hotel.description}
                </p>
              </div>
            )}

            {/* Gallery */}
            {Array.isArray(hotel.gallery) && hotel.gallery.length > 1 && (
              <div className="card p-6 sm:p-8">
                <h3 className="mb-5 text-xl font-semibold text-ink">Photo Gallery</h3>
                <div className="grid grid-cols-2 gap-3">
                  {hotel.gallery.map((src: string, idx: number) => (
                    <div key={idx} className="media-frame relative aspect-[4/3] rounded-xl">
                      <Image
                        src={src}
                        alt={`${hotel.name} photo ${idx + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 50vw, 33vw"
                        quality={90}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Location */}
            {(hotel.address || hotel.mapLink) && (
              <div className="card space-y-4 p-6 sm:p-8">
                <h3 className="text-xl font-semibold text-ink">Location</h3>
                {hotel.address && <p className="text-sm text-ink-muted">{hotel.address}</p>}
                {typeof hotel.mapLink === 'string' && hotel.mapLink.startsWith('https://www.google.com/maps/embed') && (
                  <iframe
                    src={hotel.mapLink}
                    title={`Map of ${hotel.name}`}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="h-72 w-full rounded-xl border-0"
                  />
                )}
              </div>
            )}

            {/* Amenities */}
            {Array.isArray(hotel.amenities) && hotel.amenities.length > 0 && (
              <div className="card p-6 sm:p-8">
                <h3 className="mb-5 text-xl font-semibold text-ink">Verified Resort Amenities & Facilities</h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                  {hotel.amenities.map((amenity: string, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 rounded-xl bg-surface p-3.5 text-sm font-medium text-ink"
                    >
                      <Check className="h-4 w-4 shrink-0 text-accent-strong" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Reservation & Concierge Widget */}
          <div className="space-y-6 lg:col-span-4">
            <div className="card sticky top-[calc(var(--header-h)+1rem)] p-6 shadow-[0_24px_60px_-36px_rgba(14,14,14,0.3)] sm:p-7">
              <div className="eyebrow mb-4">
                <Sparkles />
                <span>Member Privileges</span>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-ink">Reserve Stay at {hotel.name}</h3>
              <p className="mb-6 text-sm leading-relaxed text-ink-muted">
                Connect directly with our travel desk to check available check-in dates, redeem your holiday vouchers, or secure group booking rates.
              </p>

              <div className="mb-6 space-y-3">
                <Link
                  href={`/contact?hotel=${encodeURIComponent(hotel.name)}`}
                  className={buttonVariants({ block: true, size: 'lg' })}
                >
                  <span>Book Reservation Enquiry</span>
                  <ArrowRight />
                </Link>
                <a href="tel:18008436114" className={buttonVariants({ variant: 'dark', block: true })}>
                  <PhoneCall className="text-accent" />
                  <span>Call Toll-Free: 1800-843-6114</span>
                </a>
              </div>

              <div className="inset-box space-y-1.5">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-accent-strong" />
                  <span>Quality-audited guest rooms</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0 text-accent-strong" />
                  <span>Toll-free coordinator assistance</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
