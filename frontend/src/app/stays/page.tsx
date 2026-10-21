import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BedDouble,
  BellRing,
  Car,
  Compass,
  Heart,
  Mountain,
  Sparkles,
  Sunrise,
  TreePine,
  Waves,
} from 'lucide-react';
import { PageHero } from '@/components/ui/PageHero';
import { buttonVariants } from '@/components/ui/button';
import { StaysExplorer } from '@/components/stays/StaysExplorer';
import { STAY_TYPES } from '@/lib/stays';
import { getStayTypeCounts } from '@/lib/api';

export const metadata = {
  title: 'Stays | Galaxy Heritage World',
  description:
    'Villas, treehouses, domes, igloos, cabins, houseboats, overwater bungalows, heritage homes and more. Find your perfect stay with Galaxy Heritage World.',
};

const WHY = [
  { icon: BedDouble, title: 'Spacious Rooms' },
  { icon: BellRing, title: 'Premium Service' },
  { icon: Mountain, title: 'Scenic Locations' },
  { icon: Compass, title: 'Guided Tours' },
  { icon: Car, title: 'Luxury Transport' },
];

const EXPERIENCES = [
  { icon: Sunrise, title: 'Scenic Views', text: 'Wake up to breathtaking landscapes every morning.' },
  { icon: Compass, title: 'Local Experiences', text: 'Immerse yourself in authentic culture and unforgettable adventures.' },
  { icon: Waves, title: 'Peaceful Escapes', text: 'Disconnect from the everyday and reconnect with nature.' },
  { icon: TreePine, title: 'Unique Stays', text: 'Sleep somewhere extraordinary, from treehouses to glass domes.' },
  { icon: Heart, title: 'Lasting Memories', text: 'Create unforgettable moments with family, friends, or someone special.' },
];

export const revalidate = 60;

export default async function StaysPage() {
  const counts = await getStayTypeCounts().then((r) => r.data).catch(() => ({}) as Record<string, number>);

  return (
    <div>
      <PageHero
        icon={BedDouble}
        eyebrow="Stays"
        wide
        title={
          <>
            Beyond the Map, <br className="hidden sm:block" />
            <span className="text-ink-muted">Into Your Perfect Stay</span>
          </>
        }
      >
        <a href="#explore" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-ink-muted hover:text-ink">
          Scroll to uncover <span aria-hidden>↓</span>
        </a>
      </PageHero>

      <section id="explore" className="container-page section scroll-mt-28">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <div className="eyebrow mx-auto">
            <Sparkles />
            <span>Explore Our Options</span>
          </div>
          <h2 className="mt-4 text-3xl font-medium tracking-tight text-ink sm:text-4xl">
            Find Your <span className="text-ink-muted">Perfect Stay</span>
          </h2>
        </div>
        <StaysExplorer stays={STAY_TYPES} counts={counts} />
      </section>

      <section className="container-page section">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <div className="eyebrow mx-auto">
            <Sparkles />
            <span>Why Choose Us</span>
          </div>
          <h2 className="mt-4 text-3xl font-medium tracking-tight text-ink sm:text-4xl">
            Experience Comfort, <br className="hidden sm:block" />
            <span className="text-ink-muted">Unforgettable Moments</span>
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {WHY.map((w) => (
            <div key={w.title} className="card card-hover flex flex-col items-center p-6 text-center">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-ink text-accent">
                <w.icon className="size-6" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-ink">{w.title}</h3>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page section">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <div className="eyebrow mx-auto">
            <Sparkles />
            <span>What Awaits You</span>
          </div>
          <h2 className="mt-4 text-3xl font-medium tracking-tight text-ink sm:text-4xl">
            Experiences That Make <span className="text-ink-muted">Every Stay Memorable</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {EXPERIENCES.map((e) => (
            <div key={e.title} className="card p-6">
              <e.icon className="size-6 text-accent-strong" />
              <h3 className="mt-4 text-lg font-semibold tracking-wide text-ink uppercase">{e.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{e.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page section section-plain">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-medium tracking-tight text-ink sm:text-4xl">
            Ready for Your <span className="text-ink-muted">Next Vacation?</span>
          </h2>
          <Link href="/contact" className={`${buttonVariants({ variant: 'primary', size: 'lg' })} mt-7`}>
            <span>Book Now</span>
            <ArrowRight />
          </Link>
        </div>
      </section>
    </div>
  );
}
