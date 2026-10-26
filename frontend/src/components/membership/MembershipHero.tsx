import React from 'react';
import { cn } from '@/lib/utils';

/** Fine curved "contour" lines used as the dark background texture. Purely decorative. */
function Contours({ className, lines = 46, opacity = 0.5, stroke = 'white', width = 0.9 }: { className?: string; lines?: number; opacity?: number; stroke?: string; width?: number }) {
  const paths = Array.from({ length: lines }, (_, i) => {
    const t = i / (lines - 1);
    const tip = 6 + t * 70; // how far each curve reaches in from the left edge
    return `M -20 -10 C ${tip * 0.35} 22, ${tip} 34, ${tip} 50 S ${tip * 0.35} 78, -20 110`;
  });
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden className={className}>
      {paths.map((d, i) => (
        <path key={i} d={d} fill="none" stroke={stroke} strokeOpacity={opacity} strokeWidth={width} vectorEffect="non-scaling-stroke" />
      ))}
    </svg>
  );
}

interface CardStyle {
  name: string;
  surface: string;
  text: string;
  tier: string;
  line: string;
  rim: string;
}

const CARDS: Record<'gold' | 'silver' | 'platinum', CardStyle> = {
  gold: {
    name: 'GOLD',
    surface: 'linear-gradient(135deg, #f6efe2 0%, #e9dcc3 55%, #f3ead9 100%)',
    text: 'linear-gradient(180deg, #c9ac74 0%, #9c7e4b 100%)',
    tier: '#9c7e4b',
    line: 'rgba(160,124,70,0.55)',
    rim: 'rgba(255,255,255,0.7)',
  },
  silver: {
    name: 'SILVER',
    surface: 'linear-gradient(135deg, #2b2b2e 0%, #0d0d0f 55%, #1d1d20 100%)',
    text: 'linear-gradient(180deg, #e8e8ea 0%, #8c8c93 100%)',
    tier: '#b9b9bf',
    line: 'rgba(255,255,255,0.28)',
    rim: 'rgba(255,255,255,0.25)',
  },
  platinum: {
    name: 'PLATINUM',
    surface: 'linear-gradient(135deg, #2fa79b 0%, #0f6f6c 55%, #1b8c86 100%)',
    text: 'linear-gradient(180deg, #d8fbf4 0%, #8fd6cb 100%)',
    tier: '#bfeee6',
    line: 'rgba(220,255,248,0.45)',
    rim: 'rgba(255,255,255,0.35)',
  },
};

function MembershipCard({ kind, className }: { kind: keyof typeof CARDS; className?: string }) {
  const c = CARDS[kind];
  return (
    <div
      className={cn('relative aspect-[1.586/1] shrink-0 overflow-hidden rounded-[5%/8%] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)]', className)}
      style={{ background: c.surface, boxShadow: `inset 0 0 0 1px ${c.rim}, 0 30px 60px -20px rgba(0,0,0,0.85)`, containerType: 'inline-size' }}
      role="img"
      aria-label={`Galaxy Heritage Club ${c.name} package card`}
    >
      <Contours className="absolute inset-0 h-full w-full" lines={26} opacity={1} stroke={c.line} width={0.6} />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(115deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0) 40%)' }} />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span
          className="font-light tracking-[0.12em]"
          style={{ fontSize: '11.5cqw', lineHeight: 1, backgroundImage: c.text, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}
        >
          GALAXY
        </span>
        <span className="mt-[1.6cqw] tracking-[0.35em]" style={{ fontSize: '3.1cqw', color: c.tier }}>
          HERITAGE CLUB
        </span>
        <span className="mt-[5cqw] tracking-[0.3em]" style={{ fontSize: '3.4cqw', color: c.tier }}>
          {c.name}
        </span>
      </div>
    </div>
  );
}

/**
 * Dark launch banner for the packages page: contour-line background, headline and the three package cards
 * (Gold, Silver, Platinum) overlapping with Silver in front.
 */
export function MembershipHero() {
  return (
    <section className="hero-frame-wrap">
      <div className="relative overflow-hidden rounded-hero bg-[#575547] text-white">
        <Contours
          className="pointer-events-none absolute inset-y-0 left-0 h-full w-[36%] [mask-image:linear-gradient(to_right,black_55%,transparent)]"
          lines={52}
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_58%,rgba(255,255,255,0.07),transparent)]" />

        <div className="container-page relative flex flex-col items-center pt-[calc(var(--nav-h)+1.25rem)] pb-7 text-center sm:pt-[calc(var(--nav-h)+1.75rem)] sm:pb-9">
          <p className="text-[11px] tracking-[0.45em] text-white/60 sm:text-sm">LAUNCHING</p>
          <h1 className="mt-2 text-[1.5rem] leading-none font-light tracking-[0.08em] sm:mt-3 sm:text-4xl lg:text-[2.6rem]">GALAXY HERITAGE CLUB</h1>
          <p className="mt-3 text-[10px] font-medium tracking-[0.28em] text-white/90 sm:mt-4 sm:text-xs">PRIVILEGED ACCESS</p>

          {/* Cards: Silver in front, Gold and Platinum tucked behind it */}
          <div className="mt-6 flex w-full items-center justify-center sm:mt-8">
            <MembershipCard kind="gold" className="relative z-0 w-[28%] max-w-[min(300px,33vh)] -mr-[3%]" />
            <MembershipCard kind="silver" className="relative z-10 w-[34%] max-w-[min(380px,42vh)] -translate-y-[6%]" />
            <MembershipCard kind="platinum" className="relative z-0 w-[28%] max-w-[min(300px,33vh)] -ml-[3%]" />
          </div>

          <p className="mt-7 text-[9px] tracking-[0.3em] text-white/70 sm:mt-9 sm:text-[11px] sm:tracking-[0.4em]">
            FIVE, TEN, FIFTEEN &amp; TWENTY YEAR PACKAGES
          </p>
          <div className="mt-4 h-px w-1/3 max-w-sm bg-gradient-to-r from-transparent via-white/70 to-transparent" />
        </div>
      </div>
    </section>
  );
}
