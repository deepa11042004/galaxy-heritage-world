import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, MapPin, ArrowRight, Sun } from 'lucide-react';
import { getActivities } from '@/lib/api';
import { PageHero } from '@/components/ui/PageHero';

export const metadata = {
  title: 'Day Activities & Family Picnics | Galaxy Heritage World',
  description:
    'Experience traditional rural village farms, heritage picnics, adventure activities, and exciting water parks across Delhi NCR, Haryana, and MP.',
};

export const revalidate = 60;

export default async function DayActivitiesPage() {
  const res = await getActivities().catch(() => ({ data: [] }));
  const activities = res.data || [];

  return (
    <div>
      <PageHero
        icon={Sun}
        eyebrow="Weekend Escapes"
        title={
          <>
            Day Outings, <span className="text-ink-muted">Picnics & Water Parks</span>
          </>
        }
        subtitle="Recharge with a full day of rural fun, cultural performances, pottery, tractor rides, adventure rope courses, and unlimited authentic food."
      />

      <div className="container-page section">
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {activities.map((act: any) => (
            <Link key={act.id} href={`/day-activities/${act.slug}`} className="group flex flex-col">
              <div className="media-frame aspect-[4/3]">
                <Image
                  src={act.imageUrl || '/media/galaxy-heritage-world/day-activities/images/madhavgarh.webp'}
                  alt={act.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
                  <h2 className="text-xl font-semibold leading-snug tracking-tight text-ink">{act.title}</h2>
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
      </div>
    </div>
  );
}
