'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ArrowDown, ArrowUp, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Tenet {
  title: string;
  items: string[];
  image: string;
  alt: string;
}

/** Offset of slide `i` from the active slide, wrapped so the slider loops: -floor(n/2) .. ceil(n/2)-1. */
function offsetOf(i: number, active: number, n: number): number {
  const half = Math.floor(n / 2);
  return ((i - active + n + half) % n) - half;
}

/**
 * Vertical, looping card slider. The active card is large and centred; the previous and next cards peek out above and
 * below it, smaller and dimmed. Each card is split 50 / 50 between a photo and its text.
 */
export function TenetSlider({ tenets }: { tenets: Tenet[] }) {
  const [active, setActive] = useState(0);
  const n = tenets.length;
  const move = (d: number) => setActive((a) => (a + d + n) % n);

  return (
    <div className="rounded-hero bg-surface px-3 py-6 sm:px-8 sm:py-10">
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label="Key tenets"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            move(1);
          }
          if (e.key === 'ArrowUp') {
            e.preventDefault();
            move(-1);
          }
        }}
        // card height; the neighbouring cards are 86% scale and sit one "step" away so ~18% of each shows
        className="relative mx-auto h-[calc(var(--card-h)*1.4)] max-w-5xl overflow-hidden [--card-h:40rem] [--step:calc(var(--card-h)*0.95)] focus-visible:outline-none sm:[--card-h:30rem] lg:[--card-h:25rem]"
      >
        {tenets.map((t, i) => {
          const o = offsetOf(i, active, n);
          const isActive = o === 0;
          const isNear = Math.abs(o) === 1;
          return (
            <article
              key={t.title}
              aria-hidden={!isActive}
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${n}`}
              onClick={isNear ? () => setActive(i) : undefined}
              className={cn(
                'absolute inset-x-0 top-1/2 -mt-[calc(var(--card-h)/2)] h-[var(--card-h)] overflow-hidden rounded-[1.5rem] bg-white shadow-[0_24px_50px_-26px_rgba(14,14,14,0.45)]',
                'transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.22,0.8,0.2,1)] motion-reduce:transition-none',
                isNear && 'cursor-pointer',
                !isActive && !isNear && 'pointer-events-none'
              )}
              style={{
                transform: `translateY(calc(${o} * var(--step))) scale(${isActive ? 1 : isNear ? 0.86 : 0.78})`,
                opacity: isActive || isNear ? 1 : 0,
                zIndex: isActive ? 20 : isNear ? 10 : 0,
              }}
            >
              <div className="grid h-full grid-rows-2 md:grid-cols-2 md:grid-rows-1">
                <div className="relative">
                  <Image
                    src={t.image}
                    alt={isActive ? t.alt : ''}
                    fill
                    quality={85}
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 512px"
                  />
                </div>
                <div className="flex flex-col justify-center overflow-y-auto bg-white p-5 sm:p-7 lg:p-9">
                  <h3 className="text-xl font-semibold tracking-tight text-ink sm:text-2xl">{t.title}</h3>
                  <ul className="mt-4 space-y-2.5 text-[13px] leading-snug text-ink-muted sm:text-sm sm:leading-relaxed">
                    {t.items.map((item) => (
                      <li key={item} className="flex items-start gap-2.5">
                        <Check className="mt-0.5 size-4 shrink-0 text-accent-strong" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              {/* dims the cards that are not in focus */}
              <div className={cn('pointer-events-none absolute inset-0 bg-ink/50 transition-opacity duration-700', isActive ? 'opacity-0' : 'opacity-100')} />
            </article>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-center gap-4 text-ink">
        <button
          type="button"
          onClick={() => move(-1)}
          aria-label="Previous tenet"
          className="flex size-11 items-center justify-center rounded-full border border-ink/25 bg-white transition-colors hover:bg-ink hover:text-white"
        >
          <ArrowUp className="size-5" />
        </button>
        <span className="min-w-14 text-center text-sm tabular-nums tracking-widest text-ink-muted" aria-live="polite">
          {String(active + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}
        </span>
        <button
          type="button"
          onClick={() => move(1)}
          aria-label="Next tenet"
          className="flex size-11 items-center justify-center rounded-full border border-ink/25 bg-white transition-colors hover:bg-ink hover:text-white"
        >
          <ArrowDown className="size-5" />
        </button>
      </div>
    </div>
  );
}
