import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, Award, Sparkles, Phone, Building } from 'lucide-react';
import { PageHero } from '@/components/ui/PageHero';
import { buttonVariants } from '@/components/ui/button';

export const metadata = {
  title: 'About Us | Galaxy Heritage World',
  description:
    'Learn about Galaxy Heritage World, our corporate background, mission, 43+ associated resort network, and commitment to transparent hospitality.',
};

export default function AboutPage() {
  return (
    <div>
      {/* Hero Section */}
      <PageHero
        icon={Sparkles}
        eyebrow="Our Heritage & Vision"
        title={
          <>
            Redefining Luxury & Family <span className="text-ink-muted">Holidays Across India</span>
          </>
        }
        subtitle="Galaxy Heritage World was founded on a simple principle: every Indian family deserves world-class hospitality, audited accommodations, and complete booking transparency."
      />

      <div className="container-page section space-y-16 md:space-y-20">
        {/* Corporate Profile Card */}
        <div className="card p-3 sm:p-4">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="space-y-6 p-4 sm:p-8 lg:pr-0">
              <div className="eyebrow">
                <Building />
                <span>Corporate Registration</span>
              </div>
              <h2 className="text-2xl font-medium leading-snug tracking-tight text-ink sm:text-3xl">
                GALAXY HERITAGE WORLD RESORTS PRIVATE LIMITED
              </h2>
              <p className="text-sm leading-relaxed text-ink-muted sm:text-base">
                We are a legally registered Indian private limited entity incorporated under the Companies Act. With our corporate identification number <strong className="font-semibold text-ink">U74999DL2022PTC407515</strong>, we operate with full regulatory compliance, registered taxation, and corporate governance.
              </p>
              <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-2">
                <div className="rounded-xl bg-surface p-4">
                  <div className="text-xs font-medium text-ink-muted">Corporate CIN</div>
                  <div className="mt-1 font-mono text-xs font-bold text-ink">U74999DL2022PTC407515</div>
                </div>
                <div className="rounded-xl bg-surface p-4">
                  <div className="text-xs font-medium text-ink-muted">Head Office</div>
                  <div className="mt-1 text-xs font-bold text-ink">Kaushambi, Ghaziabad, UP</div>
                </div>
              </div>
            </div>

            <div className="media-frame h-80 w-full sm:h-[28rem]">
              <Image
                src="/media/galaxy-heritage-world/homepage/images/gettyimages-149353949_wide-5bf3b36fc9e77c005175cfc2.jpg"
                alt="Galaxy Heritage World Luxury Hospitality"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>

        {/* Pillars / Values */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:gap-5">
          <div className="card card-hover p-7 sm:p-8">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-ink text-accent">
              <Award className="h-5 w-5" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-ink">43+ Associated Resorts</h3>
            <p className="text-sm leading-relaxed text-ink-muted">
              We partner with recognized 4-star and 5-star properties across Goa, Rajasthan, Uttarakhand, Himachal Pradesh, and international tourist hubs, ensuring certified hygiene and comfort.
            </p>
          </div>

          <div className="card p-7 sm:p-8 border-accent bg-accent-soft">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-ink">
              <Phone className="h-5 w-5" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-ink">Dedicated Travel Desk</h3>
            <p className="text-sm leading-relaxed text-ink-muted">
              Our toll-free 1800-843-6114 desk provides end-to-end trip planning, vouchers redemption assistance, and real-time coordinator check-in support for every registered traveler.
            </p>
          </div>

          <div className="card card-hover p-7 sm:p-8">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-surface text-ink">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-ink">3-Tier Grievance Matrix</h3>
            <p className="text-sm leading-relaxed text-ink-muted">
              We pride ourselves on transparent customer resolution. Every customer issue has a defined turnaround time and direct access to senior grievance redressal officers.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="flex flex-col items-center rounded-hero bg-ink px-6 py-12 text-center text-white sm:px-12 sm:py-16">
          <h2 className="heading-section mb-4 text-white">Ready to Plan Your Next Family Holiday?</h2>
          <p className="mb-8 max-w-lg text-sm text-white/70 sm:text-base">
            Speak to our travel desk specialists or explore our handpicked holiday packages today.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/vacation-packages" className={buttonVariants({ size: 'lg' })}>
              Explore Packages
            </Link>
            <Link href="/contact" className={buttonVariants({ variant: 'ghostLight', size: 'lg' })}>
              Contact Travel Desk
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
