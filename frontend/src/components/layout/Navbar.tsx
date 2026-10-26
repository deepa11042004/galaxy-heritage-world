'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Phone,
  Mail,
  Clock,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  User,
  Palmtree,
  BedDouble,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

const navLinkClass = (active: boolean) =>
  cn(
    'flex items-center gap-1 rounded-full px-1.5 xl:px-2 min-[1500px]:px-3.5 py-2 transition-colors duration-150',
    active ? 'bg-surface text-ink' : 'text-ink-muted hover:text-ink hover:bg-surface/70'
  );

const dropdownPanel =
  'rounded-2xl border border-line bg-white p-2 shadow-[0_24px_48px_-20px_rgba(14,14,14,0.25)] animate-fade-in';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [destinationsOpen, setDestinationsOpen] = useState(false);
  const [resortsOpen, setResortsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on page change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full">
      {/* Top utility bar */}
      <div className="h-[var(--utility-h)] w-full border-b border-line bg-white text-xs text-ink-muted">
        <div className="mx-auto flex h-full max-w-[92rem] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-4 sm:gap-6">
            <a
              href="tel:18008436114"
              className="flex items-center gap-1.5 whitespace-nowrap transition-colors hover:text-ink"
            >
              <Phone className="h-3.5 w-3.5 text-accent-strong" />
              <span className="font-semibold text-ink">Toll Free: 1800-843-6114</span>
            </a>
            <a
              href="mailto:info@galaxyheritageworld.com"
              className="hidden items-center gap-1.5 transition-colors hover:text-ink md:flex"
            >
              <Mail className="h-3.5 w-3.5 text-accent-strong" />
              <span>info@galaxyheritageworld.com</span>
            </a>
            <div className="hidden items-center gap-1.5 lg:flex">
              <Clock className="h-3.5 w-3.5 text-accent-strong" />
              <span>Mon - Sat: 10:00 AM - 6:30 PM</span>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-4">
            <span className="hidden xl:inline">
              CIN: <strong className="font-semibold text-ink">U74999DL2022PTC407515</strong>
            </span>
            <Link
              href="/login"
              className="flex items-center gap-1 font-semibold text-ink transition-colors hover:text-accent-strong"
            >
              <User className="h-3.5 w-3.5" />
              <span>Customer Login</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Floating pill navbar */}
      <div className="pointer-events-none w-full pt-5 pb-3 sm:pt-6">
        <div className="mx-auto max-w-[92rem] px-4 sm:px-6 lg:px-8">
          <nav
            className={cn(
              'pointer-events-auto relative flex items-center justify-between gap-3 rounded-full border bg-white/95 py-1.5 pl-4 pr-1.5 text-ink backdrop-blur-xl transition-all duration-300',
              isScrolled
                ? 'border-line shadow-[0_16px_40px_-16px_rgba(14,14,14,0.3)]'
                : 'border-white/70 shadow-[0_10px_30px_-14px_rgba(14,14,14,0.22)]'
            )}
          >
            {/* Brand logo */}
            <Link
              href="/"
              aria-label="Galaxy Heritage World Home"
              className="group flex h-10 shrink-0 items-center transition-transform duration-200 hover:scale-[1.03]"
            >
              <div className="relative h-10 w-24 xl:w-28 min-[1500px]:w-36">
                <Image
                  src="/media/galaxy-heritage-world/shared/logos/ghw-logo-transparent.png"
                  alt="Galaxy Heritage World"
                  fill
                  priority
                  className="object-contain object-left"
                  sizes="(max-width: 1280px) 128px, 144px"
                />
              </div>
            </Link>

            {/* Desktop navigation links */}
            <div className="hidden flex-1 items-center justify-center gap-0.5 whitespace-nowrap text-[12px] font-medium lg:flex xl:text-[13px]">
              <Link href="/" className={navLinkClass(pathname === '/')}>
                Home
              </Link>

              {/* Destinations Dropdown */}
              <div
                className="relative py-1"
                onMouseEnter={() => setDestinationsOpen(true)}
                onMouseLeave={() => setDestinationsOpen(false)}
              >
                <Link href="/destinations" className={navLinkClass(pathname.startsWith('/destinations'))}>
                  <span>Destinations</span>
                  <ChevronDown
                    className={cn(
                      'h-3.5 w-3.5 text-ink-subtle transition-transform duration-200',
                      destinationsOpen && 'rotate-180 text-ink'
                    )}
                  />
                </Link>

                {destinationsOpen && (
                  <div className="absolute top-full left-0 z-50 w-64 pt-2">
                    <div className={dropdownPanel}>
                      <div className="flex flex-col space-y-0.5 text-left">
                        <Link
                          href="/destinations?type=DOMESTIC"
                          className="block rounded-xl px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-surface"
                        >
                          Domestic
                        </Link>
                        <Link
                          href="/destinations?type=INTERNATIONAL"
                          className="block rounded-xl px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-surface"
                        >
                          International
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Link href="/packages" className={navLinkClass(pathname.startsWith('/packages'))}>
                Packages
              </Link>

              {/* Hotels & Resorts Dropdown */}
              <div
                className="relative py-1"
                onMouseEnter={() => setResortsOpen(true)}
                onMouseLeave={() => setResortsOpen(false)}
              >
                <Link href="/hotels-resorts" className={navLinkClass(pathname.startsWith('/hotels-resorts') || pathname.startsWith('/stays'))}>
                  <span>Hotels & Resorts</span>
                  <ChevronDown
                    className={cn(
                      'h-3.5 w-3.5 text-ink-subtle transition-transform duration-200',
                      resortsOpen && 'rotate-180 text-ink'
                    )}
                  />
                </Link>

                {resortsOpen && (
                  <div className="absolute top-full left-1/2 z-50 w-72 -translate-x-1/2 pt-2">
                    <div className={dropdownPanel}>
                      <div className="space-y-0.5">
                        <Link
                          href="/hotels-resorts?category=ASSOCIATED"
                          className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-surface"
                        >
                          <Palmtree className="h-4 w-4 text-accent-strong" />
                          <span>Associated Partner Resorts</span>
                        </Link>
                        <Link
                          href="/hotels-resorts?category=INTERNAL"
                          className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-surface"
                        >
                          <Sparkles className="h-4 w-4 text-accent-strong" />
                          <span>Internal Luxury Properties</span>
                        </Link>
                        <Link
                          href="/stays"
                          className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-surface"
                        >
                          <BedDouble className="h-4 w-4 text-accent-strong" />
                          <span>Stays: Villas, Cabins &amp; More</span>
                        </Link>
                        <div className="mt-1 border-t border-line pt-1">
                          <Link
                            href="/hotels-resorts"
                            className="block px-3 py-2 text-xs font-semibold text-accent-strong hover:underline"
                          >
                            View All 1000+ Properties &rarr;
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Link href="/day-activities" className={navLinkClass(pathname.startsWith('/day-activities'))}>
                Day Outings
              </Link>

              <Link href="/itineraries" className={navLinkClass(pathname.startsWith('/itineraries'))}>
                Itineraries
              </Link>
              <Link href="/testimonials" className={cn(navLinkClass(pathname === '/testimonials'), 'hidden min-[1200px]:flex')}>
                Testimonials
              </Link>

              <Link href="/about" className={navLinkClass(pathname === '/about')}>
                About Us
              </Link>

              <Link href="/contact" className={navLinkClass(pathname === '/contact')}>
                Contact
              </Link>
            </div>

            {/* Right: primary CTA */}
            <div className="ml-auto hidden shrink-0 items-center sm:flex lg:ml-0">
              <Link href="/contact" className={buttonVariants({ variant: 'primary', size: 'sm' })}>
                <span>Enquire Now</span>
                <ArrowRight />
              </Link>
            </div>

            {/* Mobile actions & menu toggle */}
            <div className="flex items-center gap-1.5 lg:hidden">
              <Link href="/contact" className={cn(buttonVariants({ variant: 'primary', size: 'sm' }), 'sm:hidden')}>
                Enquire
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="icon-btn"
                aria-label="Toggle menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </nav>
        </div>

        {/* Mobile navigation drawer */}
        {mobileMenuOpen && (
          <div className="pointer-events-auto mx-auto mt-2 max-w-7xl px-4 sm:px-6 lg:hidden">
            <div className="max-h-[calc(100svh-var(--header-h)-1rem)] space-y-4 overflow-y-auto rounded-3xl border border-line bg-white px-4 pt-4 pb-5 shadow-[0_24px_60px_-24px_rgba(14,14,14,0.35)] animate-fade-in">
              <div className="flex flex-col space-y-1 text-sm font-medium text-ink">
                <Link href="/" className="rounded-xl px-3 py-2.5 transition-colors hover:bg-surface">
                  Home
                </Link>
                <div className="ml-3 space-y-0.5 border-l border-line pl-3">
                  <Link
                    href="/destinations?type=DOMESTIC"
                    className="block rounded-lg px-3 py-1.5 text-[13px] text-ink-muted transition-colors hover:text-ink"
                  >
                    Domestic
                  </Link>
                  <Link
                    href="/destinations?type=INTERNATIONAL"
                    className="block rounded-lg px-3 py-1.5 text-[13px] text-ink-muted transition-colors hover:text-ink"
                  >
                    International
                  </Link>
                </div>
                <Link href="/hotels-resorts" className="rounded-xl px-3 py-2.5 transition-colors hover:bg-surface">
                  Hotels & Resorts (1000+ Properties)
                </Link>
                <Link href="/packages" className="rounded-xl px-3 py-2.5 transition-colors hover:bg-surface">
                  Packages
                </Link>
                <Link href="/stays" className="rounded-xl px-3 py-2.5 transition-colors hover:bg-surface">
                  Stays
                </Link>
                <Link href="/day-activities" className="rounded-xl px-3 py-2.5 transition-colors hover:bg-surface">
                  Day Outings & Water Parks
                </Link>

                <Link href="/itineraries" className="rounded-xl px-3 py-2.5 transition-colors hover:bg-surface">
                  Itineraries
                </Link>
                <Link href="/testimonials" className="rounded-xl px-3 py-2.5 transition-colors hover:bg-surface">
                  Client Testimonials
                </Link>
                <Link
                  href="/reviews-and-complaints"
                  className="rounded-xl px-3 py-2.5 font-semibold text-accent-strong transition-colors hover:bg-surface"
                >
                  Reviews & Grievance Escalation Matrix
                </Link>
                <Link href="/faq" className="rounded-xl px-3 py-2.5 transition-colors hover:bg-surface">
                  Customer FAQs
                </Link>
                <Link href="/about" className="rounded-xl px-3 py-2.5 transition-colors hover:bg-surface">
                  About Us
                </Link>
                <Link href="/contact" className="rounded-xl px-3 py-2.5 transition-colors hover:bg-surface">
                  Contact & Office Addresses
                </Link>
              </div>

              <div className="flex flex-col gap-2 border-t border-line pt-4">
                <Link href="/contact" className={buttonVariants({ variant: 'primary', block: true })}>
                  Enquire Now
                </Link>
                <a
                  href="tel:18008436114"
                  className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-ink-muted hover:text-ink"
                >
                  <Phone className="h-3.5 w-3.5 text-accent-strong" />
                  <span>Call Toll Free: 1800-843-6114</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
