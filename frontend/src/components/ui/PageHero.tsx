import React from 'react';
import Image from 'next/image';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PageHeroProps {
  icon?: LucideIcon;
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  /** When set, renders the photo variant used by detail pages. */
  image?: { src: string; alt: string };
  /** Photo variant only: row of meta pills rendered above the title. */
  meta?: React.ReactNode;
  /** Extra content under the subtitle (filters, search). */
  children?: React.ReactNode;
  /** Plain variant only: allow a wider title block for long headlines. */
  wide?: boolean;
  className?: string;
}

/**
 * Inner-page header. A rounded frame inset from the viewport edges that the
 * floating navbar pill sits inside, matching the home hero.
 */
export function PageHero({
  icon: Icon,
  eyebrow,
  title,
  subtitle,
  image,
  meta,
  children,
  wide,
  className,
}: PageHeroProps) {
  if (image) {
    return (
      <section className={cn('hero-frame-wrap', className)}>
        <div className="relative flex min-h-[440px] h-[62vh] items-end overflow-hidden rounded-hero bg-ink">
          <Image src={image.src} alt={image.alt} fill priority className="object-cover" sizes="100vw" />
          {/* Bottom-only scrim so the title stays legible on any photo */}
          <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/65 via-black/25 to-transparent" />
          <div className="container-page relative z-10 pb-10 sm:pb-14">
            {meta && <div className="mb-4 flex flex-wrap items-center gap-2">{meta}</div>}
            <h1 className="heading-page max-w-4xl text-white">{title}</h1>
            {subtitle && (
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/85 sm:text-base">{subtitle}</p>
            )}
            {children}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={cn('hero-frame-wrap', className)}>
      <div className="relative overflow-hidden rounded-hero bg-surface">
        <div className="container-page pb-14 pt-[calc(var(--nav-h)+2rem)] text-center sm:pb-20 sm:pt-[calc(var(--nav-h)+3.5rem)]">
          <div className={cn('mx-auto', wide ? 'max-w-5xl' : 'max-w-3xl')}>
            {eyebrow && (
              <div className="eyebrow mb-5">
                {Icon && <Icon />}
                <span>{eyebrow}</span>
              </div>
            )}
            <h1 className="heading-page">{title}</h1>
            {subtitle && (
              <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-ink-muted sm:text-base">
                {subtitle}
              </p>
            )}
          </div>
          {children}
        </div>
      </div>
    </section>
  );
}
