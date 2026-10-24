import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CalendarDays, Clock, Map as MapIcon, MapPin } from 'lucide-react';
import { getItineraries } from '@/lib/api';
import { PageHero } from '@/components/ui/PageHero';

export const metadata = {
  title: 'Holiday Itineraries | Galaxy Heritage World',
  description:
    'Day-by-day holiday itineraries across India and the world: Goa, Kashmir, Kerala, Rajasthan, Bali, Dubai, the Maldives, Singapore and more.',
};

export const revalidate = 60;

export default async function ItinerariesPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const { type } = await searchParams;
  const res = await getItineraries().catch(() => ({ data: [] as any[] }));
  const all: any[] = res.data || [];
  const items = all.filter((i) => !type || i.locationType === type);

  return (
    <div>
      <PageHero
        image={{
          src: '/media/hero/itineraries-header.jpg',
          alt: 'A traveller in a pink dress and sun hat on a longtail boat between green limestone cliffs',
          position: 'center 55%',
        }}
        icon={MapIcon}
        eyebrow="Curated Journeys"
        title={
          <>
            Holiday <span className="text-white/70">Itineraries</span>
          </>
        }
        subtitle="Plan with confidence. Every itinerary comes with a clear day-by-day schedule, handpicked highlights and everything that is included."
      >
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          <Link href="/itineraries" data-active={!type} className="chip">
            All Itineraries
          </Link>
          <Link href="/itineraries?type=DOMESTIC" data-active={type === 'DOMESTIC'} className="chip">
            Domestic
          </Link>
          <Link href="/itineraries?type=INTERNATIONAL" data-active={type === 'INTERNATIONAL'} className="chip">
            International
          </Link>
        </div>
      </PageHero>

      <div className="container-page section">
        {items.length === 0 ? (
          <p className="py-10 text-center text-sm text-ink-muted">No itineraries found. Please check back shortly.</p>
        ) : (
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((it) => (
              <Link key={it.id} href={`/itineraries/${it.slug}`} className="group flex flex-col">
                <div className="media-frame aspect-[4/3]">
                  <Image
                    src={it.heroImageUrl}
                    alt={it.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    quality={90}
                  />
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    {it.badgeText && <span className="pill">{it.badgeText}</span>}
                  </div>
                  <div className="absolute right-4 bottom-4">
                    <span className="pill-dark">
                      {it.durationDays}D / {it.durationNights}N
                    </span>
                  </div>
                </div>

                <div className="flex flex-1 flex-col pt-4">
                  <div className="flex-1">
                    <div className="meta mb-1.5">
                      <MapPin />
                      <span>{it.locationLabel}</span>
                    </div>
                    <h2 className="text-xl leading-snug font-semibold tracking-tight text-ink">{it.title}</h2>
                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-muted">{it.summary}</p>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-line pt-4 text-xs">
                    <div className="meta min-w-0">
                      {it.bestTime ? <CalendarDays /> : <Clock />}
                      <span className="truncate" title={it.bestTime ?? undefined}>
                        {it.bestTime ? `Best time: ${it.bestTime}` : `${it.durationDays} days`}
                      </span>
                    </div>
                    <span className="link-arrow ml-3 shrink-0 whitespace-nowrap">
                      <span>View Itinerary</span>
                      <ArrowRight />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
