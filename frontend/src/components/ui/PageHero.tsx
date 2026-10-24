import React from 'react';
import Image from 'next/image';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

/** Soft dark shadow so white text stays readable on any photo. */
const PHOTO_TEXT_SHADOW = '0 2px 6px rgba(0, 0, 0, 0.55), 0 8px 30px rgba(0, 0, 0, 0.5)';

interface PageHeroProps {
  icon?: LucideIcon;
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  /** When set, renders the photo variant used by detail pages. */
  image?: {
    src: string;
    alt: string;
    /** CSS object-position, e.g. 'center 55%' (default: centre) */
    position?: string;
    /** Optional muted looping background video; `src` is then used as its poster / reduced-motion fallback. */
    video?: string;
  };
  /** Plain variant only: an illustration shown beside the text (text becomes left-aligned on wide screens). */
  illustration?: { src: string; alt: string };
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
  illustration,
  meta,
  children,
  wide,
  className,
}: PageHeroProps) {
  if (image) {
    return (
      <section className={cn('hero-frame-wrap', className)}>
        <div className="relative flex min-h-[440px] h-[62vh] items-end overflow-hidden rounded-hero bg-ink">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            priority
            quality={90}
            className="object-cover"
            style={image.position ? { objectPosition: image.position } : undefined}
            sizes="100vw"
          />
          {image.video && (
            // The still image above shows while the video loads and for visitors who prefer reduced motion.
            <video
              className="absolute inset-0 h-full w-full object-cover motion-reduce:hidden"
              style={image.position ? { objectPosition: image.position } : undefined}
              src={image.video}
              poster={image.src}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden="true"
            />
          )}
          {/* Bottom-only scrim so the title stays legible on any photo */}
          <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black/75 via-black/35 to-transparent" />
          <div className="container-page relative z-10 pb-10 sm:pb-14">
            {meta && <div className="mb-4 flex flex-wrap items-center gap-2">{meta}</div>}
            <h1 className="heading-page max-w-4xl text-white" style={{ textShadow: PHOTO_TEXT_SHADOW }}>
              {title}
            </h1>
            {subtitle && (
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/90 sm:text-base" style={{ textShadow: PHOTO_TEXT_SHADOW }}>
                {subtitle}
              </p>
            )}
            {children}
          </div>
        </div>
      </section>
    );
  }

  if (illustration) {
    return (
      <section className={cn('hero-frame-wrap', className)}>
        <div className="relative overflow-hidden rounded-hero bg-surface">
          <div className="container-page grid items-center gap-8 pb-12 pt-[calc(var(--nav-h)+2rem)] sm:pb-16 sm:pt-[calc(var(--nav-h)+3rem)] lg:grid-cols-2 lg:gap-12">
            <div className="text-center lg:text-left">
              {eyebrow && (
                <div className="eyebrow mb-5">
                  {Icon && <Icon />}
                  <span>{eyebrow}</span>
                </div>
              )}
              <h1 className="heading-page">{title}</h1>
              {subtitle && <p className="mt-5 max-w-2xl text-sm leading-relaxed text-ink-muted sm:text-base">{subtitle}</p>}
              {children}
            </div>
            <div className="relative mx-auto aspect-[13/10] w-full max-w-lg">
              {/* multiply drops the picture's white backdrop so it blends into the grey header */}
              <Image
                src={illustration.src}
                alt={illustration.alt}
                fill
                priority
                quality={90}
                className="object-contain mix-blend-multiply"
                sizes="(max-width: 1024px) 90vw, 40vw"
              />
            </div>
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
