'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { StayType } from '@/lib/stays';

/** Filter chips: a chip shows only the stay type with the same slug. */
const FILTERS = [
  { label: 'All Stays', slug: '' },
  { label: 'Villas', slug: 'villas' },
  { label: 'Treehouse', slug: 'treehouses' },
  { label: 'Domes', slug: 'domes' },
  { label: 'Igloos', slug: 'igloos' },
  { label: 'Cabin', slug: 'cabins' },
  { label: 'Tenthouse', slug: 'tenthouses' },
];

export function StaysExplorer({ stays, counts }: { stays: StayType[]; counts: Record<string, number> }) {
  const [active, setActive] = useState('');
  const shown = active ? stays.filter((s) => s.slug === active) : stays;

  return (
    <div>
      <div className="mb-10 flex flex-wrap items-center justify-center gap-2" role="group" aria-label="Filter stays">
        {FILTERS.map((f) => (
          <button
            key={f.label}
            type="button"
            data-active={active === f.slug}
            aria-pressed={active === f.slug}
            onClick={() => setActive(f.slug)}
            className="chip"
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((s) => (
          <Link key={s.slug} href={`/stays/${s.slug}`} className="group flex flex-col">
            <div className="media-frame aspect-[4/3]">
              <Image
                src={s.image}
                alt={`${s.name}: ${s.tagline}`}
                fill
                className={cn('object-cover transition-transform duration-700 ease-out group-hover:scale-105')}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                quality={90}
              />
              <div className="absolute top-4 left-4">
                <span className="pill">{s.tag}</span>
              </div>
            </div>
            <div className="flex items-end justify-between gap-4 pt-4">
              <div>
                <h3 className="text-xl font-semibold tracking-tight text-ink">{s.name}</h3>
                <p className="mt-1 text-sm text-ink-muted">{s.tagline}</p>
              </div>
              <span className="link-arrow shrink-0">
                <span>{counts[s.slug] ? `${counts[s.slug]} ${counts[s.slug] === 1 ? 'property' : 'properties'}` : 'Explore'}</span>
                <ArrowRight />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
