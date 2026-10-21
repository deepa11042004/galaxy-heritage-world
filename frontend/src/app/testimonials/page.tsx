import React from 'react';
import Link from 'next/link';
import { ArrowRight, MessageSquareQuote } from 'lucide-react';
import { PageHero } from '@/components/ui/PageHero';
import { buttonVariants } from '@/components/ui/button';

export const metadata = {
  title: 'Client Testimonials | Galaxy Heritage World',
  description:
    'Watch real clients talk about their Galaxy Heritage World holidays, stays and experiences, in their own words.',
};

// Client review videos live in /public/media/testimonials (the first three are portrait phone recordings).
interface Review {
  name: string;
  video: string;
  joined: string;
  consultant: string;
  note?: string;
}

const REVIEWS: Review[] = [
  { name: 'Puneet Garg', video: '/media/testimonials/client-review-1.mp4', joined: '18 Dec 2025', consultant: 'Zunaid' },
  { name: 'Navneet Kaur', video: '/media/testimonials/client-review-2.mp4', joined: '9 Dec 2025', consultant: 'Zaib Sir' },
  { name: 'Dushyant Mishra', video: '/media/testimonials/client-review-3.mp4', joined: '24 Jan 2026', consultant: 'Zunaid' },
  { name: 'Sumit Sharma', video: '/media/testimonials/client-review-4.mp4', joined: '2 May 2025', consultant: 'Zunaid', note: '2nd booking' },
];

/** `#t=0.1` makes browsers (notably Safari) show a real frame instead of a black box before play. */
const Video = ({ src, label, className }: { src: string; label: string; className: string }) => (
  <div className={`overflow-hidden rounded-2xl bg-ink ${className}`}>
    <video
      className="h-full w-full object-contain"
      controls
      playsInline
      preload="metadata"
      aria-label={label}
      src={`${src}#t=0.1`}
    />
  </div>
);

const Caption = ({ r }: { r: Review }) => (
  <figcaption className="px-2.5 pt-4 pb-2">
    <div className="flex flex-wrap items-center gap-2">
      <h3 className="text-lg font-semibold tracking-tight text-ink">{r.name}</h3>
      {r.note && <span className="pill-accent">{r.note}</span>}
    </div>
    <dl className="mt-2 space-y-1 text-xs text-ink-muted">
      <div className="flex gap-1.5">
        <dt className="font-semibold text-ink">Joined:</dt>
        <dd>{r.joined}</dd>
      </div>
      <div className="flex gap-1.5">
        <dt className="font-semibold text-ink">Consultant:</dt>
        <dd>{r.consultant}</dd>
      </div>
    </dl>
  </figcaption>
);

export default function TestimonialsPage() {
  return (
    <div>
      <PageHero
        icon={MessageSquareQuote}
        eyebrow="Client Reviews"
        wide
        title={
          <>
            Before we talk about <br className="hidden sm:block" />
            what&rsquo;s next, look at what&rsquo;s <br className="hidden sm:block" />
            <span className="text-ink-muted">already delivered.</span>
          </>
        }
      />

      <section className="container-page section">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-5 sm:grid-cols-3">
          {REVIEWS.slice(0, 3).map((r) => (
            <figure key={r.name} className="card p-2.5">
              <Video src={r.video} label={`Review by ${r.name}`} className="aspect-[9/16]" />
              <Caption r={r} />
            </figure>
          ))}
        </div>

        {REVIEWS.slice(3).map((r) => (
          <figure key={r.name} className="card mx-auto mt-5 max-w-5xl p-2.5">
            <Video src={r.video} label={`Review by ${r.name}`} className="aspect-video" />
            <Caption r={r} />
          </figure>
        ))}

        <div className="mx-auto mt-14 max-w-2xl text-center">
          <h2 className="text-2xl font-medium tracking-tight text-ink sm:text-3xl">
            Ready for <span className="text-ink-muted">your story?</span>
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-muted sm:text-base">
            Talk to our travel desk and plan your next holiday with the same care our clients describe.
          </p>
          <Link href="/contact" className={`${buttonVariants({ variant: 'primary', size: 'lg' })} mt-6`}>
            <span>Plan My Holiday</span>
            <ArrowRight />
          </Link>
        </div>
      </section>
    </div>
  );
}
