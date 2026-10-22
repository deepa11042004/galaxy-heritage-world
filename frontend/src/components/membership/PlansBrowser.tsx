'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { PLANS, TIERS, rupees, type Plan, type TierStyle } from '@/lib/membership-plans';
import { cn } from '@/lib/utils';

/** Flowing wave / contour lines used as the card texture. Purely decorative. */
function Waves({ stroke }: { stroke: string }) {
  // Two families of long sweeping curves crossing the card, like contour lines: one fans from the top-left corner,
  // one rises from the bottom-right.
  const fanA = Array.from({ length: 26 }, (_, i) => {
    const t = i / 25;
    return `M -5 ${-10 + t * 34} C ${30 + t * 20} ${5 + t * 40}, ${60 + t * 25} ${55 - t * 30}, 125 ${20 + t * 70}`;
  });
  const fanB = Array.from({ length: 20 }, (_, i) => {
    const t = i / 19;
    return `M 40 110 C ${55 + t * 15} ${75 - t * 25}, ${85 + t * 10} ${70 - t * 30}, 125 ${40 + t * 20}`;
  });
  return (
    <svg viewBox="0 0 120 100" preserveAspectRatio="none" aria-hidden className="pointer-events-none absolute inset-0 h-full w-full">
      <defs>
        <linearGradient id="wave-fade" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="white" stopOpacity="1" />
          <stop offset="0.6" stopColor="white" stopOpacity="0.7" />
          <stop offset="1" stopColor="white" stopOpacity="0.25" />
        </linearGradient>
        <mask id="wave-mask">
          <rect width="120" height="100" fill="url(#wave-fade)" />
        </mask>
      </defs>
      <g mask="url(#wave-mask)">
        {[...fanA, ...fanB].map((d, i) => (
          <path key={i} d={d} fill="none" stroke={stroke} strokeWidth={0.7} vectorEffect="non-scaling-stroke" />
        ))}
      </g>
    </svg>
  );
}

const WAVE: Record<string, string> = {
  EBONY: 'rgba(255,255,255,0.34)',
  IVORY: 'rgba(110,98,70,0.42)',
  JADE: 'rgba(255,255,255,0.34)',
};

function PlanCard({ plan, style }: { plan: Plan; style: TierStyle }) {
  return (
    <div
      data-plan
      className={cn(
        'relative shrink-0 basis-[88%] snap-start overflow-hidden rounded-2xl p-5 sm:basis-[calc((100%-1rem)/2)] sm:p-6 lg:basis-[calc((100%-2rem)/3)]',
        style.card
      )}
    >
      <Waves stroke={WAVE[plan.tier]} />
      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <p className="text-base font-bold tracking-[0.18em]">{plan.tier}</p>
          <p className="text-sm font-medium">{plan.years} Years</p>
        </div>
        <p className={cn('mt-1 text-xs', style.muted)}>{plan.room}</p>

        <div className="mt-7 flex items-stretch gap-4">
          <div className="min-w-0 flex-1">
            <p className={cn('text-[11px]', style.muted)}>EMI Starts at</p>
            <p className="mt-0.5 text-base font-semibold">₹{plan.emi.toLocaleString('en-IN')}/-</p>
          </div>
          <span className={cn('w-px', style.divider)} aria-hidden />
          <div className="flex-1 text-right">
            <p className="text-lg font-bold">{rupees(plan.total)}</p>
            <p className={cn('mt-0.5 text-[11px]', style.muted)}>Total Cost</p>
          </div>
        </div>

        <Link
          href={`/contact?membership=${plan.id}`}
          className={cn('mt-6 flex w-full items-center justify-center rounded-full border px-4 py-2.5 text-xs font-semibold transition-colors', style.button)}
        >
          Buy Now
        </Link>
      </div>
    </div>
  );
}

/** One Key's row: a heading, its cards and (only when the cards do not all fit) previous / next arrows. */
function PlanRow({ style }: { style: TierStyle }) {
  const track = useRef<HTMLDivElement>(null);
  const [overflow, setOverflow] = useState(false);
  const plans = PLANS.filter((p) => p.tier === style.key);

  const measure = useCallback(() => {
    const el = track.current;
    if (el) setOverflow(el.scrollWidth > el.clientWidth + 2);
  }, []);
  useEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure]);

  const go = (dir: 1 | -1) => {
    const el = track.current;
    const cards = el?.querySelectorAll<HTMLElement>('[data-plan]');
    if (!el || !cards) return;
    const step = cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : el.clientWidth;
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  return (
    <section id={style.key.toLowerCase()} className="scroll-mt-28">
      <div className="mb-4 flex items-center gap-4">
        <h2 className="text-lg font-semibold tracking-[0.12em] text-ink">{style.key}</h2>
        <span className="h-px flex-1 bg-line" />
      </div>
      <div ref={track} className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {plans.map((p) => (
          <PlanCard key={p.id} plan={p} style={style} />
        ))}
      </div>
      {overflow && (
        <div className="mt-4 flex justify-center gap-3">
          <button type="button" onClick={() => go(-1)} aria-label={`Previous ${style.key} plans`} className="flex size-10 items-center justify-center rounded-full border border-ink/40 text-ink hover:bg-ink hover:text-white">
            <ArrowLeft className="size-4" />
          </button>
          <button type="button" onClick={() => go(1)} aria-label={`Next ${style.key} plans`} className="flex size-10 items-center justify-center rounded-full border border-ink/40 text-ink hover:bg-ink hover:text-white">
            <ArrowRight className="size-4" />
          </button>
        </div>
      )}
    </section>
  );
}

/** All plan rows. */
export function PlansBrowser() {
  return (
    <div className="space-y-10">
      {TIERS.map((t) => (
        <PlanRow key={t.key} style={t} />
      ))}
    </div>
  );
}
