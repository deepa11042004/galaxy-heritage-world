import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, MapPin, ArrowRight, Sun, Mountain, Waves, Sparkles } from 'lucide-react';
import { YouTubeEmbed } from '@/components/ui/YouTubeEmbed';
import { DAY_OUTINGS as D } from '@/lib/day-outings';
import { getActivities } from '@/lib/api';
import { PageHero } from '@/components/ui/PageHero';

export const metadata = {
  title: 'Day Activities & Family Picnics | Galaxy Heritage World',
  description:
    'Experience traditional rural village farms, heritage picnics, adventure activities, and exciting water parks across Delhi NCR, Haryana, and MP.',
};

// Highlight figures shown on the featured farm cards, matched by the start of the outing title.
const FARM_STATS: Record<string, [string, string][]> = {
  'Rangmanch Farms': [['70+', 'Activities'], ['40+', 'Food Options'], ['2', 'Kids Zone'], ['5,000+', 'Happy Family']],
  'Yaduvanshi Farms': [['50+', 'Activities'], ['40+', 'Food Options'], ['1', 'Fun Zone'], ['3,400+', 'Happy Family']],
  'Madhavgarh Farms': [['50+', 'Activities'], ['40+', 'Food Options'], ['1', 'Kids Zone'], ['5,000+', 'Happy Family']],
};

export const revalidate = 60;

export default async function DayActivitiesPage() {
  const res = await getActivities().catch(() => ({ data: [] }));
  const activities: any[] = res.data || [];

  // Every section is driven by the activities table (managed in the admin panel).
  const isFeatured = (a: any) => Boolean(a.videoId) && Array.isArray(a.gallery) && a.gallery.length > 0;
  const isWater = (a: any) => !isFeatured(a) && /water|amusement|theme park/i.test(a.category || '');
  const featured = activities.filter(isFeatured);
  const water = activities.filter(isWater);
  const outings = activities.filter((a) => !isFeatured(a) && !isWater(a));
  const statsFor = (title: string) => Object.entries(FARM_STATS).find(([name]) => title.startsWith(name))?.[1] ?? [];

  return (
    <div>
      <PageHero
        image={{
          src: '/media/hero/water-park-slides.jpg',
          alt: 'Colourful spiral water slides above a blue swimming pool on a sunny day',
          position: 'center 42%',
        }}
        meta={
          <span className="pill-glass">
            <Sun className="h-3.5 w-3.5" />
            Weekend Escapes
          </span>
        }
        title={
          <>
            Day Outings, <span className="text-white/70">Picnics & Water Parks</span>
          </>
        }
        subtitle="Recharge with a full day of rural fun, cultural performances, pottery, tractor rides, adventure rope courses, and unlimited authentic food."
      />

      <section className="container-page section">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <h2 className="heading-section text-ink">
            Why Choose <span className="text-ink-muted">Our Day Outings?</span>
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-ink-muted sm:text-base">{D.why}</p>
          <h3 className="mt-8 text-xl font-semibold text-ink">{D.stepsTitle}</h3>
          <p className="mt-2 text-sm text-ink-muted sm:text-base">{D.stepsText}</p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {D.ideas.map((idea, i) => {
            const Icon = [Mountain, Waves, Sparkles][i];
            const photo = [
              { src: '/media/day-outings/step-adventure.jpg', alt: 'Tent camp below snow-streaked mountains in Spiti, Himachal Pradesh' },
              { src: '/media/day-outings/step-relax.jpg', alt: 'Lounge terrace with sofas and palm trees overlooking a long beach' },
              { src: '/media/day-outings/step-offbeat.jpg', alt: 'Hot air balloons drifting over the rock formations of Cappadocia' },
            ][i];
            return (
              <div key={idea.title} className="card card-hover group overflow-hidden p-0">
                <div className="media-frame relative aspect-[4/3] rounded-none">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    quality={85}
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="relative px-7 pb-7">
                  <div className="-mt-6 mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-ink text-accent shadow-[0_10px_24px_-10px_rgba(0,0,0,0.5)] ring-4 ring-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-ink">{idea.title}</h3>
                  <p className="text-sm leading-relaxed text-ink-muted">{idea.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured outings with gallery and video */}
      {featured.length > 0 && (
        <section className="container-page section space-y-10">
          {featured.map((farm) => (
            <div key={farm.id} className="card p-3 sm:p-4">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="space-y-4 p-4 sm:p-6">
                  <h2 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                    <Link href={`/day-activities/${farm.slug}`} className="hover:text-accent-strong">{farm.title}</Link>
                  </h2>
                  <p className="text-sm leading-relaxed text-ink-muted sm:text-base">{farm.description}</p>
                  {statsFor(farm.title).length > 0 && (
                    <div className="grid grid-cols-4 gap-2 border-y border-line py-4 text-center">
                      {statsFor(farm.title).map(([value, label]) => (
                        <div key={label}>
                          <p className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{value}</p>
                          <p className="mt-1 text-xs text-ink-muted sm:text-sm">{label}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  <YouTubeEmbed videoId={farm.videoId} title={`${farm.title} video`} />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(farm.gallery as string[]).slice(0, 6).map((src, i) => (
                    <div key={src} className={`media-frame relative aspect-[4/3] rounded-xl ${i === 0 ? 'col-span-3 aspect-[16/9]' : ''}`}>
                      <Image src={src} alt={`${farm.title} ${i + 1}`} fill className="object-cover" sizes={i === 0 ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 1024px) 50vw, 25vw"} quality={92} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </section>
      )}

      {[
        { title: D.outingTitle, text: D.outingText, items: outings },
        { title: D.waterTitle, text: D.waterText, items: water },
      ]
        .filter((sec) => sec.items.length > 0)
        .map((sec) => (
          <section key={sec.title} className="container-page section">
            <div className="mx-auto mb-10 max-w-3xl text-center">
              <h2 className="heading-section text-ink">{sec.title}</h2>
              <p className="mt-3 text-sm text-ink-muted sm:text-base">{sec.text}</p>
            </div>
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {sec.items.map((act: any) => (
                <Link key={act.id} href={`/day-activities/${act.slug}`} className="group flex flex-col">
                  <div className="media-frame aspect-[4/3]">
                    <Image
                      src={act.imageUrl || '/media/galaxy-heritage-world/day-activities/images/madhavgarh.webp'}
                      alt={act.title}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      quality={90}
                    />
                    <div className="absolute top-4 left-4">
                      <span className="pill">{act.category}</span>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col pt-4">
                    <div className="flex-1">
                      <div className="meta mb-1.5">
                        <MapPin />
                        <span>{act.locationLabel}</span>
                      </div>
                      <h3 className="text-xl font-semibold leading-snug tracking-tight text-ink">{act.title}</h3>
                      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-muted">{act.description}</p>
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-line pt-4 text-xs">
                      <div className="meta">
                        <Clock />
                        <span>{act.durationLabel}</span>
                      </div>
                      <span className="link-arrow">
                        <span>Details & Pass</span>
                        <ArrowRight />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}

      {activities.length === 0 && (
        <section className="container-page section">
          <p className="text-center text-sm text-ink-muted">Day outings are being updated. Please check back shortly.</p>
        </section>
      )}
    </div>
  );
}
