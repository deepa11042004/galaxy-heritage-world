
import React from 'react';
import Link from 'next/link';
import {
  PhoneCall,
  MessageCircle,
  Clock,
  CheckCircle2,
  Headphones,
  ArrowRight,
  Layers,
  BarChart3,
  UserCog,
  LifeBuoy,
  SlidersHorizontal,
  MousePointerClick,
  RefreshCw,
  ShieldCheck,
  BellRing,
  Globe2,
  Briefcase,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PageHero } from '@/components/ui/PageHero';
import { buttonVariants } from '@/components/ui/button';
import { TravelDeskSearch } from '@/components/travel-desk/TravelDeskSearch';

const WHY_BOOK = [
  {
    icon: Layers,
    title: 'All-in-One Efficiency',
    text: 'Saves massive chunks of your day by unifying every flight, stay, car rental, and document checklist inside one hub.',
  },
  {
    icon: BarChart3,
    title: 'Smart Rate Compares',
    text: 'Instantly pulls real-time inventories across multiple leading providers to ensure you leverage competitive rates.',
  },
  {
    icon: UserCog,
    title: 'Personalized Framework',
    text: 'Offers tailored travel configurations built around your previous routes, corporate policies, and car preferences.',
  },
  {
    icon: LifeBuoy,
    title: 'Proactive Human Assist',
    text: 'Provides priority troubleshooting support before, during, and well after your target itinerary dates wrap up.',
  },
  {
    icon: SlidersHorizontal,
    title: 'Simplified Management',
    text: 'View details, file rapid modifications, or execute immediate cancellations with effortless self-serve utilities.',
  },
];

const CAPABILITIES = [
  { icon: MousePointerClick, title: 'Fluid Search UX', text: 'Intuitively engineered panels mapped out for frictionless booking interactions.' },
  { icon: RefreshCw, title: 'Real-Time Catalogs', text: 'Instantaneous sync for live pricing engines and vehicle availability windows.' },
  { icon: ShieldCheck, title: 'Secure Transactions', text: 'End-to-end tokenized payment routing structures shielding high-volume accounts.' },
  { icon: CheckCircle2, title: 'Instant Confirmations', text: 'Automated notifications dispatched to SMS and corporate emails within seconds.' },
  { icon: SlidersHorizontal, title: 'Full Lifecycle Control', text: 'Robust native tools designed to monitor, track, modify car rentals, or process cancellations.' },
  { icon: Globe2, title: '24/7 Global Helpline', text: 'Always available routing lines maintaining around-the-clock emergency support.' },
  { icon: BellRing, title: 'Proactive Travel Alerts', text: 'Live flight delays, weather tracking, and ground transportation updates.' },
  { icon: Briefcase, title: 'Strategic Corporate Deals', text: 'Unlocks special pre-negotiated volume benefits and custom car rental enterprise discounts.' },
];

export default function TravelDeskPage() {
  return (
    <div>
      {/* Header */}
      <PageHero
        icon={Headphones}
        eyebrow="Corporate & Leisure Travel Desk"
        title={
          <>
            Your Complete Journey, <span className="text-ink-muted">Simplified</span>
          </>
        }
        subtitle="Book flights, reserve stays, manage car rentals, arrange transfers, and get visa support, all in one premium ecosystem."
      />

      {/* Booking widget */}
      <section className="container-page section">
        <div className="mx-auto max-w-6xl">
          <TravelDeskSearch />
        </div>
      </section>

      {/* Why book through the desk */}
      <section className="container-page section">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h2 className="text-3xl font-medium tracking-tight text-ink sm:text-4xl">
            Why Book Through <span className="text-ink-muted">Our Travel Desk?</span>
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-ink-muted sm:text-base">
            Engineered to bring seamless efficiency to all your journeys
          </p>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {WHY_BOOK.map((w) => (
            <div key={w.title} className="card card-hover p-6">
              <div className="flex size-12 items-center justify-center rounded-xl bg-ink text-accent">
                <w.icon className="size-6" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-ink">{w.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{w.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Capabilities */}
      <section className="container-page section">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h2 className="text-3xl font-medium tracking-tight text-ink sm:text-4xl">
            Enterprise-Grade <span className="text-ink-muted">Desk Capabilities</span>
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-ink-muted sm:text-base">
            Everything required for modernized global logistical infrastructure
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CAPABILITIES.map((c) => (
            <div key={c.title} className="card p-6">
              <c.icon className="size-6 text-accent-strong" />
              <h3 className="mt-4 text-base font-semibold text-ink">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{c.text}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="container-page section">
        {/* Quick Contact Banners */}
        <div className="mb-12 grid grid-cols-1 gap-4 md:grid-cols-3 lg:mb-16 lg:gap-5">
          <div className="flex flex-col justify-between rounded-card bg-accent p-7 sm:p-8">
            <div>
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-ink text-accent">
                <PhoneCall className="h-5 w-5" />
              </div>
              <h3 className="mb-1.5 text-xl font-semibold text-ink">Toll-Free Helpline</h3>
              <p className="mb-6 text-sm text-ink/70">
                Instant priority phone consultation with a travel desk officer.
              </p>
            </div>
            <a href="tel:18008436114" className={buttonVariants({ variant: 'dark', block: true })}>
              Call 1800-843-6114
            </a>
          </div>

          <div className="card flex flex-col justify-between p-7 sm:p-8">
            <div>
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white">
                <MessageCircle className="h-5 w-5" />
              </div>
              <h3 className="mb-1.5 text-xl font-semibold text-ink">WhatsApp Concierge</h3>
              <p className="mb-6 text-sm text-ink-muted">
                Chat with our desk for quick voucher queries and photos.
              </p>
            </div>
            <a
              href="https://wa.me/919999001122?text=Hello%20Galaxy%20Heritage%20World%20Travel%20Desk"
              target="_blank"
              rel="noreferrer"
              className={cn(buttonVariants({ block: true }), 'bg-emerald-600 text-white hover:bg-emerald-700')}
            >
              Start WhatsApp Chat
            </a>
          </div>

          <div className="card flex flex-col justify-between p-7 sm:p-8">
            <div>
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-surface text-ink">
                <Clock className="h-5 w-5" />
              </div>
              <h3 className="mb-1.5 text-xl font-semibold text-ink">Desk Working Hours</h3>
              <p className="mb-6 text-sm text-ink-muted">
                Monday to Saturday: 10:00 AM - 6:30 PM IST (Emergency helpline 24/7 on-trip).
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 rounded-full bg-surface px-4 py-2.5 text-center text-sm font-semibold text-ink">
              <span className="h-2 w-2 rounded-full bg-accent-strong" aria-hidden="true" />
              Active & Receiving Calls
            </div>
          </div>
        </div>
      </div>

      {/* Closing call to action */}
      <section className="container-page section section-plain">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-medium tracking-tight text-ink sm:text-4xl">
            Expeditions Expertise <span className="text-ink-muted">at Your Service</span>
          </h2>
          <Link href="/contact" className={cn(buttonVariants({ size: 'lg' }), 'mt-7')}>
            <span>Contact Us</span>
            <ArrowRight />
          </Link>
        </div>
      </section>
    </div>
  );
}
