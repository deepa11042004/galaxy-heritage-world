import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Star, MapPin, Check, ArrowRight, PhoneCall, ShieldCheck, Sparkles } from 'lucide-react';
import { getHotelBySlug } from '@/lib/api';
import { getPublicImageSize } from '@/lib/image-size';
import { PhotoGrid } from '@/components/ui/PhotoGrid';
import { PageHero } from '@/components/ui/PageHero';
import { buttonVariants } from '@/components/ui/button';

export const revalidate = 60;

/** Photos narrower than this are shown in a normal-sized card instead of a full-width banner. */
const BANNER_MIN_WIDTH = 1400;

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

  const heroSrc: string = hotel.imageUrl || '/media/galaxy-heritage-world/homepage/images/3-2.png';
  const size = await getPublicImageSize(heroSrc);
  // Photos not in /public (admin uploads, remote URLs) are treated as big: uploads are resized to at most 2000px.
  const bigPhoto = !size || size.width >= BANNER_MIN_WIDTH;

  // All photos of the property (the cover is the first one)
  const photos: string[] = Array.isArray(hotel.gallery) && hotel.gallery.length > 0 ? hotel.gallery : [heroSrc];
  // A hotel with no photos at all gets a text-only header (the generic placeholder would only look stretched)
  const hasPhotos = Boolean(hotel.imageUrl) || (Array.isArray(hotel.gallery) && hotel.gallery.length > 0);
  const mosaicShowsAll = !bigPhoto && photos.length <= 4;

  const metaPills = (tone: 'glass' | 'light') => {
    const pill = tone === 'glass' ? 'pill-glass' : 'pill-muted !px-3 !py-1 !text-xs';
    return (
      <>
        <span className={pill}>
          <MapPin className="h-3.5 w-3.5" />
          {hotel.locationName}
          {hotel.state ? `, ${hotel.state}` : ''}
        </span>
        <span className={pill}>{hotel.category === 'ASSOCIATED' ? 'Associated Partner Resort' : 'Luxury Internal'}</span>
        <span className={pill}>
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          {hotel.ratingStars}.0 Star Rated
        </span>
      </>
    );
  };

  return (
    <div>
      {/* Hero Header: a full-width banner only when the photo is big enough to stay sharp */}
      {bigPhoto ? (
        <PageHero image={{ src: heroSrc, alt: hotel.name }} meta={metaPills('glass')} title={hotel.name} />
      ) : (
        <section className="hero-frame-wrap">
          <div className="rounded-hero bg-surface">
            <div className="container-page pt-[calc(var(--nav-h)+2rem)] pb-8 sm:pb-10 lg:pt-[calc(var(--nav-h)+3rem)]">
              <div className="mb-5 flex flex-wrap items-center gap-2">{metaPills('light')}</div>
              <h1 className={`heading-page max-w-4xl ${hasPhotos ? 'mb-8' : ''}`}>{hotel.name}</h1>

              {/* Photo mosaic: each photo is shown at about its real size, so small photos stay sharp */}
              {hasPhotos && <PhotoGrid photos={photos} name={hotel.name} variant="mosaic" />}
            </div>
          </div>
        </section>
      )}

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
            {Array.isArray(hotel.gallery) && hotel.gallery.length > 1 && !mosaicShowsAll && (
              <div className="card p-6 sm:p-8">
                <h3 className="mb-5 text-xl font-semibold text-ink">Photo Gallery</h3>
                <PhotoGrid photos={hotel.gallery} name={hotel.name} />
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
