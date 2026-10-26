import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, Award, Sparkles, Phone, Building } from 'lucide-react';
import { PageHero } from '@/components/ui/PageHero';
import { buttonVariants } from '@/components/ui/button';

export const metadata = {
  title: 'About Us | Galaxy Heritage World',
  description:
    'Learn about Galaxy Heritage World, our corporate background, mission, 1000+ associated resort network, and commitment to transparent hospitality.',
};

export default function AboutPage() {
  return (
    <div>
      {/* Hero Section */}
      <PageHero
        image={{
          src: '/media/hero/about-header.jpg',
          alt: 'A travel map with a compass, passport, vintage camera and model aeroplane',
          position: 'center 45%',
        }}
        icon={Sparkles}
        eyebrow="Our Heritage & Vision"
        title={
          <>
            Redefining Luxury & Family <span className="text-white/70">Holidays Across India</span>
          </>
        }
        subtitle="Galaxy Heritage World was founded on a simple principle: every Indian family deserves world-class hospitality, audited accommodations, and complete booking transparency."
      />

      <div className="container-page section section-plain space-y-16 md:space-y-20">
        {/* About Us Story */}
        <div className="card p-7 sm:p-10 lg:p-12">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="space-y-6 text-sm leading-relaxed text-ink-muted sm:text-base lg:col-span-7">
            <div className="space-y-2">
              <h2 className="text-2xl font-medium leading-snug tracking-tight text-ink sm:text-3xl">Galaxy Heritage World</h2>
              <h3 className="text-base font-semibold text-ink sm:text-lg">A Unit of GHW Hospitality Private Limited</h3>
            </div>

            <p>
              <strong className="font-semibold text-ink">Galaxy Heritage World</strong> is a hospitality and holiday company dedicated to creating memorable travel experiences and making every journey truly special. With a passion for exploration, comfort, and exceptional hospitality, we aim to bring people closer to the destinations, cultures, and experiences that make life extraordinary.
            </p>

            <p>
              Our vision is to redefine the way people travel by offering thoughtfully designed holiday experiences across India, Asia, and destinations around the world. From serene hill stations and pristine beaches to vibrant cities, heritage destinations, and peaceful nature retreats, we open doors to a world of possibilities for every kind of traveller.
            </p>

            <p>
              At Galaxy Heritage World, we believe that a holiday is more than just a stay—it is about creating lasting memories, spending quality time with loved ones, discovering new cultures, and embracing the joy of travel. Whether it is a family vacation, a romantic getaway, a weekend escape, a group holiday, or a special celebration, we strive to make every experience comfortable, seamless, and memorable.
            </p>

            <p>Our commitment to hospitality is built on three fundamental pillars:</p>

            <ul className="space-y-4">
              <li>
                <strong className="font-semibold text-ink">People</strong> – Dedicated professionals who believe in delivering warm, personalised service and building lasting relationships with our guests.
              </li>
              <li>
                <strong className="font-semibold text-ink">Experiences</strong> – Thoughtfully curated holidays designed to inspire exploration, create meaningful connections, and turn every journey into a cherished memory.
              </li>
              <li>
                <strong className="font-semibold text-ink">Destinations</strong> – A diverse world of travel opportunities, from scenic landscapes and relaxing beach escapes to cultural landmarks and exciting international destinations.
              </li>
            </ul>

            <p>
              Together, these pillars form the foundation of our commitment to delivering exceptional hospitality and memorable holiday experiences.
            </p>

            <p>
              At Galaxy Heritage World, we continuously strive to combine the warmth of Indian hospitality with modern comfort, convenience, and service excellence. We believe every traveller deserves the opportunity to explore the world, discover something new, and create stories worth sharing.
            </p>

            <p>
              As we continue to grow, our mission remains focused on making holidays more accessible, enriching, and rewarding through quality hospitality, personalised attention, and a passion for excellence.
            </p>

            <p className="font-semibold text-ink">
              Welcome to Galaxy Heritage World – Where Every Journey Creates a Memory, Every Destination Inspires Discovery, and Every Holiday Becomes a Celebration of Life.
            </p>
          </div>

          <div className="lg:col-span-5">
            <div className="media-frame relative mx-auto aspect-[937/799] w-full max-w-xl lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]">
              <Image
                src="/media/about/travellers.jpg"
                alt="A smiling couple in yellow with a suitcase, camera and passport, ready to travel"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 90vw, 42vw"
                quality={90}
              />
            </div>
          </div>
          </div>
        </div>

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
                src="/media/about/corporate.jpg"
                alt="A couple relaxing at the edge of an infinity pool and smiling at each other"
                fill
                className="object-cover object-[50%_70%]"
                sizes="(max-width: 1024px) 100vw, 50vw"
                quality={90}
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
            <h3 className="mb-2 text-xl font-semibold text-ink">1000+ Associated Resorts</h3>
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
        <div className="flex flex-col items-center rounded-hero bg-[#575547] px-6 py-12 text-center text-white sm:px-12 sm:py-16">
          <h2 className="heading-section mb-4 text-white">Ready to Plan Your Next Family Holiday?</h2>
          <p className="mb-8 max-w-lg text-sm text-white/70 sm:text-base">
            Speak to our travel desk specialists or explore Galaxy Heritage Club packages today.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/packages" className={buttonVariants({ size: 'lg' })}>
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
