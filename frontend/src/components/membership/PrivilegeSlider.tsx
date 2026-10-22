'use client';

import React, { useCallback, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export interface PrivilegeSlide {
  text: string;
  image: string;
  alt: string;
}

const COPIES = 3; // the slides are rendered three times so the slider can loop endlessly

/**
 * Endless horizontal slider of tall photo cards with a white caption box, plus round previous / next buttons.
 * Native scroll-snapping (swipe, trackpad and keyboard work). The slides are repeated three times; whenever scrolling
 * settles outside the middle copy the position is moved by exactly one copy, which looks identical, so it never ends.
 */
export function PrivilegeSlider({ slides }: { slides: PrivilegeSlide[] }) {
  const track = useRef<HTMLDivElement>(null);
  const settle = useRef<ReturnType<typeof setTimeout> | null>(null);
  const n = slides.length;

  /** Width of one full copy of the slides (cards + gaps), or 0 before layout. */
  const copyWidth = useCallback(() => {
    const cards = track.current?.querySelectorAll<HTMLElement>('[data-slide]');
    return cards && cards.length > n ? cards[n].offsetLeft - cards[0].offsetLeft : 0;
  }, [n]);

  const jump = useCallback((left: number) => {
    const el = track.current;
    if (!el) return;
    el.style.scrollBehavior = 'auto';
    el.scrollLeft = left;
    el.style.scrollBehavior = '';
  }, []);

  // start on the middle copy
  useEffect(() => {
    const w = copyWidth();
    if (w) jump(w);
  }, [copyWidth, jump]);

  // after scrolling stops, move back into the middle copy if we drifted into the first / last one
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const recentre = () => {
      const w = copyWidth();
      if (!w) return;
      if (el.scrollLeft < w * 0.5) jump(el.scrollLeft + w);
      else if (el.scrollLeft > w * 1.5) jump(el.scrollLeft - w);
    };
    const onScroll = () => {
      if (settle.current) clearTimeout(settle.current);
      settle.current = setTimeout(recentre, 140);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', recentre);
    return () => {
      el.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', recentre);
      if (settle.current) clearTimeout(settle.current);
    };
  }, [copyWidth, jump]);

  const go = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const cards = el.querySelectorAll<HTMLElement>('[data-slide]');
    const step = cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : el.clientWidth;
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  const arrow =
    'flex size-12 items-center justify-center rounded-full border border-ink text-ink transition-colors hover:bg-ink hover:text-white';

  return (
    <div>
      <div
        ref={track}
        role="region"
        aria-roledescription="carousel"
        aria-label="Handpicked privileges"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') go(1);
          if (e.key === 'ArrowLeft') go(-1);
        }}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] focus-visible:outline-none [&::-webkit-scrollbar]:hidden"
      >
        {Array.from({ length: COPIES }, (_, copy) =>
          slides.map((s, i) => (
            <figure
              key={`${copy}-${s.text}`}
              data-slide
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${n}`}
              aria-hidden={copy === 1 ? undefined : true}
              className="media-frame relative aspect-[5/6] shrink-0 basis-[80%] snap-start rounded-[1.75rem] sm:basis-[calc((100%-1.25rem)/2)] lg:basis-[calc((100%-3.75rem)/4)]"
            >
              <Image
                src={s.image}
                alt={copy === 1 ? s.alt : ''}
                fill
                quality={85}
                className="object-cover"
                sizes="(max-width: 640px) 80vw, (max-width: 1024px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              <figcaption className="absolute inset-x-3 bottom-3 rounded-2xl bg-white px-4 py-4 text-center text-base font-medium text-ink shadow-[0_10px_30px_-12px_rgba(0,0,0,0.45)] sm:py-5">
                {s.text}
              </figcaption>
            </figure>
          ))
        )}
      </div>

      <div className="mt-8 flex items-center justify-center gap-4">
        <button type="button" className={arrow} onClick={() => go(-1)} aria-label="Previous privileges">
          <ArrowLeft className="size-5" />
        </button>
        <button type="button" className={arrow} onClick={() => go(1)} aria-label="Next privileges">
          <ArrowRight className="size-5" />
        </button>
      </div>
    </div>
  );
}
