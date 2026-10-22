import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BedDouble,
  CalendarCheck,
  Check,
  Crown,
  Headset,
  PartyPopper,
  Percent,
  Sparkles,
  Users,
} from 'lucide-react';
import { MembershipHero } from '@/components/membership/MembershipHero';
import { PrivilegeSlider } from '@/components/membership/PrivilegeSlider';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const metadata = {
  title: 'Membership | Galaxy Heritage World',
  description:
    'Galaxy Heritage Club gives privileged access to 140+ premium resorts with 6 nights / 7 days of holidays every year. Choose the Ebony, Ivory or Jade Key.',
};

const PRIVILEGES = [
  { text: '6N/7D a year, your way', image: '/media/membership/privilege-holiday.jpg', alt: 'Infinity pool and loungers beside a turquoise lagoon' },
  { text: 'Future-proof pricing', image: '/media/membership/privilege-family.jpg', alt: 'A parent and child walking along the shoreline at sunset' },
  { text: 'Spacious suites for stays', image: '/media/membership/privilege-suite.jpg', alt: 'Spacious suite with a canopy bed' },
  { text: 'Unique family experiences', image: '/media/membership/privilege-tea-garden.jpg', alt: 'Green tea gardens below a rocky mountain in Munnar' },
  { text: '140+ resorts in India and abroad', image: '/media/membership/privilege-resorts.jpg', alt: 'Overwater villas on a turquoise lagoon' },
];

const COMMON = [
  'Complimentary breakfast for 2 per room per night',
  'Priority access to signature experiences',
  'Access to 140+ country international resorts',
];

const PLANS = [
  {
    key: 'EBONY',
    tagline: 'Your year-round access to unforgettable family gateways',
    weeks: '6N/7D holidays every year across 52 weeks',
    card: 'bg-ink text-white border-ink',
    muted: 'text-white/70',
    badge: 'bg-accent text-ink',
    check: 'text-accent',
    button: 'bg-accent text-ink hover:bg-accent-hover',
  },
  {
    key: 'IVORY',
    tagline: 'Experience destinations during the peak of their popularity',
    weeks: '6N/7D holidays every year across 46 weeks',
    card: 'bg-white text-ink border-accent',
    muted: 'text-ink-muted',
    badge: 'bg-accent-soft text-accent-strong',
    check: 'text-accent-strong',
    button: 'bg-ink text-white hover:bg-ink/85',
  },
  {
    key: 'JADE',
    tagline: 'Enjoy your favourite destinations during quieter seasons',
    weeks: '6N/7D holidays every year across 24 weeks',
    card: 'bg-emerald-50 text-ink border-emerald-200',
    muted: 'text-ink-muted',
    badge: 'bg-emerald-600 text-white',
    check: 'text-emerald-600',
    button: 'bg-emerald-600 text-white hover:bg-emerald-700',
  },
];

const ROOMS = [
  {
    guests: '2 Adults · 2 Children',
    name: 'Studio Standard Room',
    text: 'Our expansive studio suite, equivalent to two standard rooms, accommodates up to two adults and two children under six.',
  },
  {
    guests: '4 Adults · 2 Children',
    name: '1 BR Standard Room',
    text: 'A premium, spacious layout comfortably hosting up to four adults and two children under the age of six.',
  },
];

const TENETS = [
  {
    icon: Sparkles,
    title: "We've Got You Covered",
    items: [
      'Your membership gives you 6 nights/7 days of holidays every year. If you miss your vacation, you can carry forward up to 14 nights.',
      'Breakfast is on us. Other meals come with special savings.',
      'Protect your long-term holiday goals with future-proof pricing.',
      'Pick a plan based on your preferences with three unique Keys and flexible tenures.',
    ],
  },
  {
    icon: Crown,
    title: 'Special Privileges',
    items: [
      'Avail 52, 46, and 24 weeks of holiday access across applicable seasons for EBONY, IVORY, and JADE Keys respectively.',
      'Enjoy 25% discounts on eligible in-resort spends.',
      'Nominate up to 7 family members.',
    ],
  },
  {
    icon: CalendarCheck,
    title: 'Holiday Benefits',
    items: [
      'You can start booking your holidays up to 4 months in advance. All bookings are confirmed on a first-come, first-served basis.',
      'The number of rooms you can book and the seasons you travel in are based on your membership plan.',
      'Your membership unlocks thoughtfully crafted experiences for you and your loved ones.',
    ],
  },
  {
    icon: Percent,
    title: 'Seamless Booking & Flexibility',
    items: [
      'Book your stays up to 4 months in advance with guaranteed confirmation.',
      'Flexible carry-forward options for unused nights, ensuring your time is never wasted.',
      'Easy modification and cancellation policies tailored specifically for members.',
    ],
  },
  {
    icon: PartyPopper,
    title: 'Exclusive Member Events',
    items: [
      'Invitations to private, members-only events and exclusive culinary experiences.',
      'Early access to new resort openings and special seasonal holiday packages.',
      'Curated local experiences and guided tours at select premium destinations.',
    ],
  },
  {
    icon: Headset,
    title: 'Dedicated Concierge Support',
    items: [
      '24/7 dedicated member support for all your travel and booking needs.',
      'Personalized itinerary planning and special request handling before your stay.',
      'Priority assistance for flight, transfer, and premium activity bookings.',
    ],
  },
];

export default function MembershipPage() {
  return (
    <div>
      <MembershipHero />

      {/* Handpicked privileges */}
      <section className="container-page section">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <div className="eyebrow mx-auto">
            <Sparkles />
            <span>Best Experience</span>
          </div>
          <h2 className="mt-4 text-3xl font-medium tracking-tight text-ink sm:text-4xl">
            Handpicked <span className="text-ink-muted">Privileges</span>
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-ink-muted sm:text-base">
            Galaxy Heritage Club unlocks privileged access to 140+ premium resorts, offering 6 nights/7 days holidays every
            year, filled with cherished family moments and thoughtfully crafted experiences.
          </p>
        </div>
        <PrivilegeSlider slides={PRIVILEGES} />
      </section>

      {/* Plans */}
      <section id="plans" className="container-page section scroll-mt-28">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <div className="eyebrow mx-auto">
            <Crown />
            <span>Membership Plans</span>
          </div>
          <h2 className="mt-4 text-3xl font-medium tracking-tight text-ink sm:text-4xl">
            Your Key to Unlock <span className="text-ink-muted">Privileged Experiences</span>
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-ink-muted sm:text-base">
            Select from Ebony, Ivory, and Jade Keys and enter a world of seamless vacations
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {PLANS.map((p) => (
            <div key={p.key} className={cn('relative flex flex-col overflow-hidden rounded-card border p-7 sm:p-8', p.card)}>
              <span className={cn('inline-flex w-fit rounded-full px-3 py-1 text-[11px] font-bold tracking-wider uppercase', p.badge)}>
                Studio
              </span>
              <h3 className="mt-5 text-4xl font-semibold tracking-tight">{p.key}</h3>
              <p className={cn('mt-3 text-sm leading-relaxed', p.muted)}>{p.tagline}</p>

              <ul className="mt-6 flex-1 space-y-3.5 border-t border-current/15 pt-6 text-sm">
                {[p.weeks, ...COMMON].map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <Check className={cn('mt-0.5 size-4 shrink-0', p.check)} />
                    <span className={cn(f === p.weeks && 'font-semibold')}>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={`/contact?membership=${p.key}`}
                className={cn('mt-8 block rounded-xl px-4 py-3 text-center text-sm font-semibold transition-colors', p.button)}
              >
                Join Now
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Accommodation */}
      <section className="container-page section">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <div className="eyebrow mx-auto">
            <BedDouble />
            <span>Accommodation</span>
          </div>
          <h2 className="mt-4 text-3xl font-medium tracking-tight text-ink sm:text-4xl">
            Your home <span className="text-ink-muted">away from home</span>
          </h2>
        </div>
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-5 md:grid-cols-2">
          {ROOMS.map((r) => (
            <div key={r.name} className="card p-7">
              <span className="pill-accent">
                <Users className="size-3.5" />
                {r.guests}
              </span>
              <h3 className="mt-4 text-xl font-semibold text-ink">{r.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{r.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Key tenets */}
      <section className="container-page section">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <div className="eyebrow mx-auto">
            <Sparkles />
            <span>Memberships | Key Tenets</span>
          </div>
          <h2 className="mt-4 text-3xl font-medium tracking-tight text-ink sm:text-4xl">
            Key <span className="text-ink-muted">Tenets</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {TENETS.map((t) => (
            <div key={t.title} className="card p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-xl bg-ink text-accent">
                  <t.icon className="size-5" />
                </div>
                <h3 className="text-xl font-semibold text-ink">{t.title}</h3>
              </div>
              <ul className="mt-5 space-y-3 text-sm leading-relaxed text-ink-muted">
                {t.items.map((i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="mt-0.5 size-4 shrink-0 text-accent-strong" />
                    <span>{i}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page section section-plain">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-medium tracking-tight text-ink sm:text-4xl">
            Ready to <span className="text-ink-muted">join the Club?</span>
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-ink-muted sm:text-base">
            Talk to our team about the right Key for you and your family.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link href="/contact?membership=enquiry" className={buttonVariants({ size: 'lg' })}>
              <span>Join Now</span>
              <ArrowRight />
            </Link>
            <a href="tel:18008436114" className={buttonVariants({ variant: 'outline', size: 'lg' })}>
              <span>Call 1800-843-6114</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
