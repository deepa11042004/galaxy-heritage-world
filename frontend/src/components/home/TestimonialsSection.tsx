'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Pause, Play } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';

// The same client review videos as the Testimonials page (the first three are portrait phone recordings,
// the fourth is landscape and is letterboxed inside the same card).
const VIDEOS = [
  { name: 'Puneet Garg', src: '/media/testimonials/client-review-1.mp4' },
  { name: 'Navneet Kaur', src: '/media/testimonials/client-review-2.mp4' },
  { name: 'Dushyant Mishra', src: '/media/testimonials/client-review-3.mp4' },
  { name: 'Sumit Sharma', src: '/media/testimonials/client-review-4.mp4' },
];

/**
 * Review video with a single play / pause button instead of the browser's full control bar.
 * `#t=0.1` makes browsers (notably Safari) show a real frame instead of a black box before play.
 */
const Video = ({ src, label, className }: { src: string; label: string; className: string }) => {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) void v.play();
    else v.pause();
  };

  return (
    <div className={`group relative overflow-hidden rounded-2xl bg-ink ${className}`}>
      <video
        ref={ref}
        className="h-full w-full cursor-pointer object-contain"
        playsInline
        preload="metadata"
        aria-label={label}
        src={`${src}#t=0.1`}
        onClick={toggle}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? `Pause ${label}` : `Play ${label}`}
        className={`absolute top-1/2 left-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink shadow-lg transition-opacity hover:bg-white focus-visible:opacity-100 ${
          playing ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
        }`}
      >
        {playing ? <Pause className="size-7 fill-ink" /> : <Play className="size-7 translate-x-0.5 fill-ink" />}
      </button>
    </div>
  );
};

export function TestimonialsSection() {
  const track = useRef<HTMLDivElement>(null);
  const paused = useRef(false);

  /** Move one card; wraps around at either end. */
  const go = useCallback((dir: 1 | -1) => {
    const el = track.current;
    const cards = el?.querySelectorAll<HTMLElement>('[data-slide]');
    if (!el || !cards || cards.length < 2) return;
    const step = cards[1].offsetLeft - cards[0].offsetLeft;
    const max = el.scrollWidth - el.clientWidth;
    if (dir === 1 && el.scrollLeft >= max - 4) el.scrollTo({ left: 0, behavior: 'smooth' });
    else if (dir === -1 && el.scrollLeft <= 4) el.scrollTo({ left: max, behavior: 'smooth' });
    else el.scrollBy({ left: dir * step, behavior: 'smooth' });
  }, []);

  // Rotate on its own, but never while someone is hovering, touching or watching a video.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => {
      if (!paused.current) go(1);
    }, 5000);
    return () => clearInterval(id);
  }, [go]);

  const hold = (v: boolean) => () => {
    paused.current = v;
  };

  return (
    <section className="section section-pattern">
      <div className="container-page">
        <SectionHeader
          icon={CheckCircle2}
          eyebrow="Verified Customer Feedback"
          title={
            <>
              Before we talk about what&rsquo;s next, look at what&rsquo;s{' '}
              <span className="text-ink-muted">already delivered.</span>
            </>
          }
          description="Authentic experiences shared by our holiday guests across India."
        />

        <div
          onMouseEnter={hold(true)}
          onMouseLeave={hold(false)}
          onTouchStart={hold(true)}
          onPlayCapture={hold(true)}
          onPauseCapture={hold(false)}
          onEndedCapture={hold(false)}
        >
          <div
            ref={track}
            className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {VIDEOS.map((v) => (
              <figure
                key={v.src}
                data-slide
                className="card border-4 !border-divider shrink-0 basis-[80%] snap-start p-2.5 sm:basis-[calc((100%-1.25rem)/2)] lg:basis-[calc((100%-2.5rem)/3)]"
              >
                <Video src={v.src} label={`Review by ${v.name}`} className="aspect-[9/16]" />
              </figure>
            ))}
          </div>

          <div className="mt-6 flex justify-center gap-3">
            <button type="button" onClick={() => go(-1)} aria-label="Previous video" className="flex size-11 items-center justify-center rounded-full border border-ink/40 text-ink transition-colors hover:bg-ink hover:text-white">
              <ArrowLeft className="size-5" />
            </button>
            <button type="button" onClick={() => go(1)} aria-label="Next video" className="flex size-11 items-center justify-center rounded-full border border-ink/40 text-ink transition-colors hover:bg-ink hover:text-white">
              <ArrowRight className="size-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
