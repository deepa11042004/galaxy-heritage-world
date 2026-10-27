'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Palmtree,
  Headphones,
  Ticket,
  ArrowRight,
  Eye,
  Target,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { StatCard } from '@/components/ui/StatCard';

const pillars = [
  {
    icon: Palmtree,
    title: '1000+ Audited Associated Resorts',
    description:
      'Verified accommodations in prime tourist corridors across Goa, Rajasthan, Uttarakhand, Himachal, and South India with strict quality standards.',
  },
  {
    icon: ShieldCheck,
    title: '100% Transparent Escalation Matrix',
    description:
      "We are India's most accountable holiday provider with an official 3-tier grievance mechanism, documented TAT, and direct executive contact.",
    highlight: true,
  },
  {
    icon: Headphones,
    title: 'Dedicated Travel Desk Concierge',
    description:
      'Toll-free 1800-843-6114 support, customized itinerary planning, booking assistance, and on-trip coordination from dedicated travel specialists.',
  },
  {
    icon: Ticket,
    title: 'Hassle-Free Voucher Redemption',
    description:
      'Transparent rules, clear validity periods, and straightforward voucher claim workflows without hidden terms or surprise charges.',
  },
];

const stats = [
  {
    value: '1000+',
    title: 'Associated Resorts',
    description: 'Handpicked partner retreats across India & abroad',
  },
  {
    value: '100%',
    title: 'Escalation Transparency',
    description: 'Dedicated customer care & direct resolution',
  },
  {
    value: 'Mon–Sat',
    title: 'Travel Concierge',
    description: 'Bespoke holiday planning, 10:00 AM – 6:30 PM',
  },
  {
    value: '1800-843',
    title: 'Toll-Free Assistance',
    description: 'Toll-Free 1800-843-6114 direct reservation desk',
  },
];

export function WhyChooseUs() {
  return (
    <section className="section section-pattern">
      <div className="container-page">
        <SectionHeader
          icon={Sparkles}
          eyebrow="The Galaxy Heritage World Difference"
          title={
            <>
              Why Choose <span className="text-ink-muted">Galaxy Heritage World?</span>
            </>
          }
          description="Delivering authentic family vacation joy with strict corporate accountability, audited hospitality properties, and dedicated care."
        />

        {/* Trust Stats */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
          {stats.map((stat, idx) => (
            <StatCard
              key={stat.title}
              value={stat.value}
              title={stat.title}
              description={stat.description}
              highlight={idx === 1}
            />
          ))}
        </div>

        {/* Vision & Mission Cards */}
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:mt-5 lg:gap-5">
          {/* Vision Card */}
          <div className="group rounded-card bg-surface p-7 sm:p-9">
            <div className="mb-5 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ink text-accent transition-transform duration-300 group-hover:scale-105">
                <Eye className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
                  OUR CORE PURPOSE
                </span>
                <h3 className="text-2xl font-medium text-ink">Vision</h3>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-ink-muted sm:text-base">
              To make every journey comfortable, seamless and memorable through quality travel experiences and personalized service.
            </p>
          </div>

          {/* Mission Card */}
          <div className="group rounded-card bg-surface p-7 sm:p-9">
            <div className="mb-5 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ink text-accent transition-transform duration-300 group-hover:scale-105">
                <Target className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
                  OUR GUIDING PRINCIPLE
                </span>
                <h3 className="text-2xl font-medium text-ink">Mission</h3>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-ink-muted sm:text-base">
              We believe in trust, quality, customer care and genuine hospitality, creating lasting relationships through every journey.
            </p>
          </div>
        </div>

        {/* 4 Pillars Grid */}
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-5 lg:grid-cols-4 lg:gap-5">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className={cn(
                  'card card-hover flex flex-col justify-between p-6',
                  pillar.highlight && 'border-accent bg-accent-soft'
                )}
              >
                <div>
                  <div
                    className={cn(
                      'mb-6 flex h-11 w-11 items-center justify-center rounded-xl',
                      pillar.highlight ? 'bg-accent text-ink' : 'bg-surface text-ink'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="heading-card mb-2">{pillar.title}</h3>
                  <p className="text-[13px] leading-relaxed text-ink-muted">{pillar.description}</p>
                </div>

                {pillar.highlight && (
                  <div className="mt-6 border-t border-accent/50 pt-4">
                    <Link href="/reviews-and-complaints" className="link-arrow">
                      <span>Read Escalation Policy</span>
                      <ArrowRight />
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
