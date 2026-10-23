import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Clock, MapPin, Check, PhoneCall, Sparkles, ArrowRight, Sun } from 'lucide-react';
import { getActivityBySlug } from '@/lib/api';
import { PageHero } from '@/components/ui/PageHero';
import { buttonVariants } from '@/components/ui/button';
import { PhotoGrid } from '@/components/ui/PhotoGrid';

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const res = await getActivityBySlug(slug).catch(() => null);
  if (!res || !res.data) return { title: 'Activity Not Found' };
  return {
    title: `${res.data.title} | Galaxy Heritage World`,
    description: res.data.description?.slice(0, 160) || `Experience ${res.data.title} with Galaxy Heritage World.`,
  };
}

export default async function ActivityDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const res = await getActivityBySlug(slug).catch(() => null);

  if (!res || !res.data) {
    notFound();
  }

  const act = res.data;

  return (
    <div>
      {/* Hero Header */}
      <PageHero
        image={{
          src: act.imageUrl || '/media/galaxy-heritage-world/day-activities/images/madhavgarh.webp',
          alt: act.title,
        }}
        meta={
          <>
            <span className="pill-glass">
              <MapPin className="h-3.5 w-3.5" />
              {act.locationLabel}
            </span>
            <span className="text-white/60">&bull;</span>
            <span className="pill-glass">
              <Clock className="h-3.5 w-3.5" />
              {act.durationLabel}
            </span>
            <span className="text-white/60">&bull;</span>
            <span className="pill-glass">{act.category}</span>
          </>
        }
        title={act.title}
      />

      {/* Main Content */}
      <div className="container-page section">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Left Column */}
          <div className="space-y-6 lg:col-span-8">
            <div className="card space-y-4 p-6 sm:p-8">
              <h2 className="text-2xl font-medium text-ink sm:text-3xl">About The Experience</h2>
              <p className="whitespace-pre-line text-sm leading-relaxed text-ink-muted sm:text-base">
                {act.description}
              </p>
            </div>

            {/* Photo gallery (click a photo to view it full screen) */}
            {Array.isArray(act.gallery) && act.gallery.length > 0 && (
              <div className="card p-6 sm:p-8">
                <h3 className="mb-5 text-xl font-semibold text-ink">Photo Gallery</h3>
                <PhotoGrid photos={act.gallery} name={act.title} />
              </div>
            )}

            {/* Highlights */}
            {Array.isArray(act.highlights) && act.highlights.length > 0 && (
              <div className="card p-6 sm:p-8">
                <h3 className="mb-5 text-xl font-semibold text-ink">Activities & Attractions Included</h3>
                <div className="grid grid-cols-1 gap-3 text-sm text-ink-muted sm:grid-cols-2">
                  {act.highlights.map((hl: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-accent-strong" />
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Inclusions */}
            {Array.isArray(act.inclusions) && act.inclusions.length > 0 && (
              <div className="card p-6 sm:p-8">
                <h3 className="mb-5 text-xl font-semibold text-ink">Meal & Entry Inclusions</h3>
                <div className="grid grid-cols-1 gap-3 text-sm text-ink-muted sm:grid-cols-2">
                  {act.inclusions.map((inc: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-strong" />
                      <span>{inc}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Pass Booking */}
          <div className="space-y-6 lg:col-span-4">
            <div className="card sticky top-[calc(var(--header-h)+1rem)] p-6 shadow-[0_24px_60px_-36px_rgba(14,14,14,0.3)] sm:p-7">
              <div className="eyebrow mb-4">
                <Sun />
                <span>Day Pass & Outing</span>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-ink">Book Entry Pass for {act.title}</h3>
              <p className="mb-6 text-sm leading-relaxed text-ink-muted">
                Enjoy special member privileges, family package discounts, and guaranteed pass confirmation.
              </p>

              <div className="mb-6 space-y-3">
                <Link
                  href={`/contact?activity=${encodeURIComponent(act.title)}`}
                  className={buttonVariants({ block: true, size: 'lg' })}
                >
                  <span>Book Outing Passes</span>
                  <ArrowRight />
                </Link>
                <a href="tel:18008436114" className={buttonVariants({ variant: 'dark', block: true })}>
                  <PhoneCall className="text-accent" />
                  <span>Call Toll-Free: 1800-843-6114</span>
                </a>
              </div>

              <div className="inset-box space-y-1.5">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0 text-accent-strong" />
                  <span>Breakfast, Lunch & High Tea included</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0 text-accent-strong" />
                  <span>Full access to adventure zones</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
