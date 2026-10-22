'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';
import { cn } from '@/lib/utils';

/** Grid placement for photo `i` of `count` (1-4) in the 4-column mosaic: a big main photo plus smaller ones. */
function mosaicCell(i: number, count: number): string {
  if (count === 1) return 'col-span-2 lg:col-span-4 lg:row-span-2';
  if (count === 2) return 'lg:col-span-2 lg:row-span-2';
  if (i === 0) return 'col-span-2 lg:col-span-2 lg:row-span-2';
  if (count === 3) return 'lg:col-span-2';
  return i === 3 ? 'col-span-2 lg:col-span-2' : 'lg:col-span-1';
}

/**
 * A grid of photos that open in a full-screen viewer when clicked.
 * - "mosaic": one big photo plus up to three smaller ones (the viewer still has every photo)
 * - "gallery": a plain two-column grid of every photo
 */
export function PhotoGrid({
  photos,
  name,
  variant = 'gallery',
}: {
  photos: string[];
  name: string;
  variant?: 'mosaic' | 'gallery';
}) {
  const [open, setOpen] = useState<number | null>(null);
  const opener = useRef<HTMLElement | null>(null);
  const shown = variant === 'mosaic' ? photos.slice(0, 4) : photos;
  const hidden = photos.length - shown.length;

  const close = useCallback(() => {
    setOpen(null);
    opener.current?.focus();
  }, []);
  const step = useCallback(
    (d: number) => setOpen((i) => (i === null ? i : (i + d + photos.length) % photos.length)),
    [photos.length]
  );

  // keyboard + scroll lock while the viewer is open
  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') step(1);
      else if (e.key === 'ArrowLeft') step(-1);
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close, step]);

  // swipe on touch screens
  const touchX = useRef<number | null>(null);

  return (
    <>
      <div
        className={cn(
          'grid gap-2 sm:gap-3',
          variant === 'mosaic' ? 'grid-cols-2 lg:h-[30rem] lg:grid-cols-4 lg:grid-rows-2' : 'grid-cols-2'
        )}
      >
        {shown.map((src, i) => (
          <button
            key={src}
            type="button"
            aria-label={`View photo ${i + 1} of ${photos.length} of ${name}`}
            onClick={(e) => {
              opener.current = e.currentTarget;
              setOpen(i);
            }}
            className={cn(
              'media-frame group relative aspect-[4/3] cursor-zoom-in rounded-xl',
              variant === 'mosaic' && `lg:aspect-auto ${mosaicCell(i, Math.min(photos.length, 4))}`
            )}
          >
            <Image
              src={src}
              alt={`${name} photo ${i + 1}`}
              fill
              priority={variant === 'mosaic' && i === 0}
              quality={90}
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              sizes={
                variant === 'mosaic'
                  ? i === 0
                    ? '(max-width: 1024px) 100vw, 50vw'
                    : '(max-width: 1024px) 50vw, 25vw'
                  : '(max-width: 640px) 50vw, 33vw'
              }
            />
            <span className="pointer-events-none absolute inset-0 bg-ink/0 transition-colors group-hover:bg-ink/10" />
            {variant === 'mosaic' && i === shown.length - 1 && photos.length > 1 && (
              <span className="pill absolute right-3 bottom-3 shadow">
                <Expand className="size-3.5" />
                {hidden > 0 ? `View all ${photos.length} photos` : `${photos.length} photos`}
              </span>
            )}
          </button>
        ))}
      </div>

      {open !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${name} photos`}
          className="fixed inset-0 z-[120] flex flex-col bg-neutral-950"
          onMouseDown={close}
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            touchX.current = null;
            if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
          }}
        >
          <div className="flex items-center justify-between px-4 py-3 text-white" onMouseDown={(e) => e.stopPropagation()}>
            <p className="truncate text-sm font-medium">
              {name} <span className="text-white/60">· {open + 1} / {photos.length}</span>
            </p>
            <button type="button" onClick={close} aria-label="Close photo viewer" className="rounded-full p-2 hover:bg-white/10">
              <X className="size-6" />
            </button>
          </div>

          <div className="relative min-h-0 flex-1">
            <Image
              key={photos[open]}
              src={photos[open]}
              alt={`${name} photo ${open + 1}`}
              fill
              quality={90}
              priority
              className="object-contain"
              sizes="100vw"
              onMouseDown={(e) => e.stopPropagation()}
            />
            {photos.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Previous photo"
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={() => step(-1)}
                  className="absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-white/15 p-3 text-white backdrop-blur hover:bg-white/30 sm:left-5"
                >
                  <ChevronLeft className="size-6" />
                </button>
                <button
                  type="button"
                  aria-label="Next photo"
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={() => step(1)}
                  className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-white/15 p-3 text-white backdrop-blur hover:bg-white/30 sm:right-5"
                >
                  <ChevronRight className="size-6" />
                </button>
              </>
            )}
          </div>

          {photos.length > 1 && (
            <div className="flex justify-center gap-2 overflow-x-auto px-4 py-3" onMouseDown={(e) => e.stopPropagation()}>
              {photos.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  aria-label={`Show photo ${i + 1}`}
                  aria-current={i === open}
                  onClick={() => setOpen(i)}
                  className={cn(
                    'relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-opacity',
                    i === open ? 'border-accent opacity-100' : 'border-transparent opacity-55 hover:opacity-90'
                  )}
                >
                  <Image src={src} alt="" fill className="object-cover" sizes="80px" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
