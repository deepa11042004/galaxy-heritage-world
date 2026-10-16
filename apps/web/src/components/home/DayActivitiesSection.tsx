'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, MapPin, ArrowRight, Sun } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { buttonVariants } from '@/components/ui/button';

interface ActivityItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  locationLabel: string;
  durationLabel: string;
  imageUrl: string;
  description: string;
}

export function DayActivitiesSection({ activities }: { activities: ActivityItem[] }) {
  if (!activities || activities.length === 0) return null;

  return (
    <section className="section bg-white">
      <div className="container-page">
        <SectionHeader
          icon={Sun}
          eyebrow="Weekend & Family Escapes"
          title={
            <>
              Day Picnics & <span className="text-ink-muted">Adventure Outings</span>
            </>
          }
          description="Experience traditional rural village heritage, delicious ethnic cuisine, adventure rope courses, and thrilling water parks."
          actions={
            <Link href="/day-activities" className={buttonVariants({ size: 'sm' })}>
              <span>View All Day Outings</span>
              <ArrowRight />
            </Link>
          }
        />

        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {activities.slice(0, 4).map((act) => (
            <Link key={act.id} href={`/day-activities/${act.slug}`} className="group flex flex-col">
              <div className="media-frame aspect-[4/3]">
                <Image
                  src={act.imageUrl || '/media/galaxy-heritage-world/day-activities/images/madhavgarh.webp'}
                  alt={act.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute top-3 left-3">
                  <span className="pill">{act.category}</span>
                </div>
              </div>

              <div className="flex flex-1 flex-col pt-4">
                <div className="flex-1">
                  <div className="meta mb-1.5">
                    <MapPin />
                    <span>{act.locationLabel}</span>
                  </div>
                  <h3 className="heading-card">{act.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-muted">{act.description}</p>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-line pt-4 text-xs">
                  <div className="meta">
                    <Clock />
                    <span>{act.durationLabel}</span>
                  </div>
                  <span className="font-semibold text-ink transition-colors group-hover:text-accent-strong">
                    Book &rarr;
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
