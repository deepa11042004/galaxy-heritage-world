import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Crown } from 'lucide-react';
import { PageHero } from '@/components/ui/PageHero';
import { PlansBrowser } from '@/components/membership/PlansBrowser';
import { buttonVariants } from '@/components/ui/button';

export const metadata = {
  title: 'Membership Plans | Galaxy Heritage World',
  description:
    'Compare every Galaxy Heritage Club plan: Ebony, Ivory and Jade Keys across 5, 10, 15 and 20 year tenures, with total cost and EMI.',
};

export default function MembershipPlansPage() {
  return (
    <div>
      <PageHero
        image={{
          src: '/media/hero/membership-plans-header.jpg',
          alt: 'Two hands exchanging a membership card with a city skyline behind',
          position: 'center 45%',
        }}
        meta={
          <span className="pill-glass">
            <Crown className="h-3.5 w-3.5" />
            Galaxy Heritage Club
          </span>
        }
        title={
          <>
            Choose Your <span className="text-white/70">Plan</span>
          </>
        }
        subtitle="Pick a Key and a tenure. Compare the total cost and EMI of every tenure, then tap Buy Now on the one you like."
      />

      <section className="container-page section pb-28">
        <Link href="/membership" className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold text-ink-muted hover:text-ink">
          <ArrowLeft className="size-3.5" /> Back to membership
        </Link>

        <div className="mx-auto max-w-5xl rounded-hero bg-white p-4 sm:p-8 lg:p-10">
          <PlansBrowser />
        </div>

        <p className="mx-auto mt-6 max-w-5xl text-center text-xs text-ink-subtle">
          Indicative prices for the Studio room. Please contact our team to confirm current pricing before you enrol.
        </p>

        <div className="mx-auto mt-14 max-w-2xl text-center">
          <h2 className="text-2xl font-medium tracking-tight text-ink sm:text-3xl">
            Not sure which Key <span className="text-ink-muted">suits you?</span>
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-muted sm:text-base">
            Talk to our team and we will recommend the right plan for your family.
          </p>
          <Link href="/contact?membership=enquiry" className={`${buttonVariants({ size: 'lg' })} mt-6`}>
            <span>Talk to Us</span>
            <ArrowRight />
          </Link>
        </div>
      </section>
    </div>
  );
}
