import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, CalendarDays, Check, Clock, MapPin, PhoneCall, Sparkles, Tag } from 'lucide-react';
import { getItineraries, getItineraryBySlug } from '@/lib/api';
import { PageHero } from '@/components/ui/PageHero';
import { buttonVariants } from '@/components/ui/button';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const res = await getItineraryBySlug(slug).catch(() => null);
  if (!res || !res.data) return { title: 'Itinerary Not Found' };
  return {
    title: `${res.data.title} | Galaxy Heritage World`,
    description: res.data.summary?.slice(0, 160),
    openGraph: { images: res.data.heroImageUrl ? [res.data.heroImageUrl] : undefined },
  };
}

export default async function ItineraryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const res = await getItineraryBySlug(slug).catch(() => null);
  if (!res || !res.data) notFound();

  const it = res.data;
  const days: any[] = it.days ?? [];
  const highlights: string[] = Array.isArray(it.highlights) ? it.highlights : [];
  const inclusions: string[] = Array.isArray(it.inclusions) ? it.inclusions : [];
  const gallery: string[] = Array.isArray(it.gallery) ? it.gallery : [];

  // Suggestions: same kind of trip (domestic / international) first, then the rest.
  const allRes = await getItineraries().catch(() => ({ data: [] as any[] }));
  const others: any[] = (allRes.data ?? []).filter((o: any) => o.slug !== it.slug);
  const related = [
    ...others.filter((o) => o.locationType === it.locationType),
    ...others.filter((o) => o.locationType !== it.locationType),
  ].slice(0, 3);

  const facts = [
    { icon: Clock, label: 'Duration', value: `${it.durationDays} Days / ${it.durationNights} Nights` },
    { icon: MapPin, label: 'Destination', value: it.locationLabel },
    it.bestTime && { icon: CalendarDays, label: 'Best time to visit', value: it.bestTime },
    it.category && { icon: Tag, label: 'Style', value: it.category },
  ].filter(Boolean) as { icon: React.ElementType; label: string; value: string }[];

  return (
    <div>
      <PageHero
        image={{ src: it.heroImageUrl, alt: it.title }}
        meta={
          <>
            {it.badgeText && <span className="pill-glass">{it.badgeText}</span>}
            <span className="pill-glass">
              <Clock className="h-3.5 w-3.5" />
              {it.durationDays}D / {it.durationNights}N
            </span>
            <span className="pill-glass">
              <MapPin className="h-3.5 w-3.5" />
              {it.locationLabel}
            </span>
          </>
        }
        title={it.title}
      />

      <div className="container-page section">
        <Link href="/itineraries" className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold text-ink-muted hover:text-ink">
          <ArrowLeft className="size-3.5" /> All itineraries
        </Link>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Left column */}
          <div className="space-y-6 lg:col-span-8">
            <div className="card space-y-4 p-6 sm:p-8">
              <h2 className="text-2xl font-medium text-ink sm:text-3xl">Overview</h2>
              <p className="text-sm leading-relaxed whitespace-pre-line text-ink-muted sm:text-base">{it.overview || it.summary}</p>
            </div>

            {highlights.length > 0 && (
              <div className="card p-6 sm:p-8">
                <h3 className="mb-5 text-xl font-semibold text-ink">Trip Highlights</h3>
                <div className="grid grid-cols-1 gap-3 text-sm text-ink-muted sm:grid-cols-2">
                  {highlights.map((h) => (
                    <div key={h} className="flex items-start gap-2.5">
                      <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-accent-strong" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {days.length > 0 && (
              <div className="card p-6 sm:p-8">
                <h3 className="mb-6 text-xl font-semibold text-ink">Day-by-Day Itinerary</h3>
                <ol className="space-y-6">
                  {days.map((d) => (
                    <li key={d.id ?? d.dayNumber} className="relative flex gap-4 sm:gap-5">
                      <div className="flex flex-col items-center">
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-bold text-ink">
                          {d.dayNumber}
                        </span>
                        <span className="mt-2 w-px flex-1 bg-line" aria-hidden />
                      </div>
                      <div className="pb-2">
                        <p className="text-[11px] font-semibold tracking-wide text-ink-subtle uppercase">Day {d.dayNumber}</p>
                        <h4 className="mt-0.5 text-lg font-semibold text-ink">{d.title}</h4>
                        <p className="mt-2 text-sm leading-relaxed whitespace-pre-line text-ink-muted">{d.description}</p>
                        {(d.meals || d.stayLocation) && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {d.meals && <span className="pill-muted">Meals: {d.meals}</span>}
                            {d.stayLocation && <span className="pill-muted">Stay: {d.stayLocation}</span>}
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {inclusions.length > 0 && (
              <div className="card p-6 sm:p-8">
                <h3 className="mb-5 text-xl font-semibold text-ink">What&rsquo;s Included</h3>
                <div className="grid grid-cols-1 gap-3 text-sm text-ink-muted sm:grid-cols-2">
                  {inclusions.map((inc) => (
                    <div key={inc} className="flex items-start gap-2.5">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-strong" />
                      <span>{inc}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {gallery.length > 0 && (
              <div>
                <h3 className="mb-5 text-xl font-semibold text-ink">Photo Gallery</h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {gallery.map((src, i) => (
                    <div key={src} className="media-frame relative aspect-[4/3] rounded-xl">
                      <Image
                        src={src}
                        alt={`${it.title} photo ${i + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, 33vw"
                        quality={90}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right column */}
          <div className="space-y-6 lg:col-span-4">
            <div className="card sticky top-[calc(var(--header-h)+1rem)] p-6 shadow-[0_24px_60px_-36px_rgba(14,14,14,0.3)] sm:p-7">
              <h3 className="mb-4 text-xl font-semibold text-ink">Trip at a Glance</h3>
              <dl className="mb-6 space-y-4">
                {facts.map((f) => (
                  <div key={f.label} className="flex items-start gap-3">
                    <f.icon className="mt-0.5 size-4 shrink-0 text-accent-strong" />
                    <div>
                      <dt className="text-[11px] font-semibold tracking-wide text-ink-subtle uppercase">{f.label}</dt>
                      <dd className="text-sm font-medium text-ink">{f.value}</dd>
                    </div>
                  </div>
                ))}
              </dl>

              <div className="space-y-3">
                <Link
                  href={`/contact?package=${encodeURIComponent(it.title)}`}
                  className={buttonVariants({ block: true, size: 'lg' })}
                >
                  <span>Enquire About This Trip</span>
                  <ArrowRight />
                </Link>
                <a href="tel:18008436114" className={buttonVariants({ variant: 'dark', block: true })}>
                  <PhoneCall className="text-accent" />
                  <span>Call Toll-Free: 1800-843-6114</span>
                </a>
              </div>
              <p className="inset-box mt-5">Our travel desk will tailor dates, stays and activities to your group.</p>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-16 border-t border-line pt-12">
            <div className="mx-auto mb-10 max-w-3xl text-center">
              <h2 className="heading-section text-ink">
                You May Also <span className="text-ink-muted">Like</span>
              </h2>
              <p className="mt-3 text-sm text-ink-muted sm:text-base">More handpicked journeys from our travel desk.</p>
            </div>
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((o) => (
                <Link key={o.id} href={`/itineraries/${o.slug}`} className="group flex flex-col">
                  <div className="media-frame aspect-[4/3]">
                    <Image
                      src={o.heroImageUrl}
                      alt={o.title}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      quality={90}
                    />
                    {o.badgeText && (
                      <div className="absolute top-4 left-4">
                        <span className="pill">{o.badgeText}</span>
                      </div>
                    )}
                    <div className="absolute right-4 bottom-4">
                      <span className="pill-dark">
                        {o.durationDays}D / {o.durationNights}N
                      </span>
                    </div>
                  </div>
                  <div className="pt-4">
                    <div className="meta mb-1.5">
                      <MapPin />
                      <span>{o.locationLabel}</span>
                    </div>
                    <h3 className="text-xl leading-snug font-semibold tracking-tight text-ink">{o.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-muted">{o.summary}</p>
                    <span className="link-arrow mt-4">
                      <span>View Itinerary</span>
                      <ArrowRight />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
