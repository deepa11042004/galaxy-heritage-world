'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MapPin, Send, ShieldCheck, CheckCircle, AlertCircle } from 'lucide-react';
import { submitNewsletter } from '@/lib/api';

const footerLink = 'text-ink-muted transition-colors hover:text-ink';

export function Footer() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    try {
      setSubmitting(true);
      setError(null);
      await submitNewsletter({ email });
      setSuccess(true);
      setEmail('');
    } catch (err: any) {
      setError(err.message || 'Failed to subscribe. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="px-2 pb-2 sm:px-3 sm:pb-3">
      <div className="rounded-hero bg-[#DBDBDB] pt-14 pb-8 sm:pt-20">
        <div className="container-page">
          <div className="grid grid-cols-1 gap-10 border-b border-line pb-12 sm:grid-cols-2 lg:grid-cols-5 lg:gap-8">
            {/* Column 1: Brand & Registration */}
            <div className="space-y-5 sm:col-span-2">
              <Link href="/" className="inline-block rounded-2xl bg-transparent p-2"><span className="relative block h-28 w-96">
                <Image
                  src="/media/galaxy-heritage-world/shared/logos/ghw-logo-transparent.png"
                  alt="Galaxy Heritage World"
                  fill
                  className="object-contain object-left"
                  sizes="384px"
                />
              </span></Link>
              <p className="max-w-sm text-sm leading-relaxed text-ink-muted">
                Galaxy Heritage World is India&apos;s premier luxury holiday and hospitality package provider, delivering bespoke vacations, verified 4-star and 5-star associated resorts, and memorable family getaways across India and international destinations.
              </p>
              <div className="card max-w-sm space-y-1 bg-transparent p-4 text-xs text-ink-muted">
                <div>
                  <strong className="font-semibold text-ink">Corporate Entity:</strong> GALAXY HERITAGE WORLD RESORTS PRIVATE LIMITED
                </div>
                <div>
                  <strong className="font-semibold text-ink">Corporate CIN:</strong> U74999DL2022PTC407515
                </div>
                <div className="flex items-center gap-1.5 pt-1 font-semibold text-accent-strong">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent-strong" aria-hidden="true" />
                  Ministry of Corporate Affairs Registered
                </div>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h4 className="mb-4 text-sm font-semibold text-ink">Explore</h4>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link href="/about" className={footerLink}>
                    About Galaxy Heritage
                  </Link>
                </li>
                <li>
                  <Link href="/destinations" className={footerLink}>
                    Destinations
                  </Link>
                </li>
                <li>
                  <Link href="/hotels-resorts" className={footerLink}>
                    Hotels & 1000+ Resorts
                  </Link>
                </li>
                <li>
                  <Link href="/packages" className={footerLink}>
                    Packages
                  </Link>
                </li>
                <li>
                  <Link href="/stays" className={footerLink}>
                    Stays
                  </Link>
                </li>
                <li>
                  <Link href="/day-activities" className={footerLink}>
                    Day Picnics & Farms
                  </Link>
                </li>
                <li>
                  <Link href="/travel-desk" className={footerLink}>
                    Travel Desk
                  </Link>
                </li>
                <li>
                  <Link href="/itineraries" className={footerLink}>
                    Holiday Itineraries
                  </Link>
                </li>
                <li>
                  <Link href="/testimonials" className={footerLink}>
                    Client Testimonials
                  </Link>
                </li>
                <li>
                  <Link href="/referral-program" className={footerLink}>
                    Referral Program
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Trust & Grievance */}
            <div>
              <h4 className="mb-4 text-sm font-semibold text-ink">Trust & Governance</h4>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link
                    href="/reviews-and-complaints"
                    className="flex items-center gap-1.5 font-semibold text-ink transition-colors hover:text-accent-strong"
                  >
                    <ShieldCheck className="h-4 w-4 text-accent-strong" />
                    <span>Escalation Matrix</span>
                  </Link>
                </li>
                <li>
                  <Link href="/reviews-and-complaints#faqs" className={footerLink}>
                    Complaint Resolution Board
                  </Link>
                </li>
                <li>
                  <Link href="/redeem-voucher" className={footerLink}>
                    Redeem Voucher Portal
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className={footerLink}>
                    Frequently Asked Questions
                  </Link>
                </li>
                <li>
                  <Link href="/pricing-policy" className={footerLink}>
                    Pricing Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms-conditions" className={footerLink}>
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link href="/privacy-policy" className={footerLink}>
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Contact & Newsletter */}
            <div className="space-y-5 sm:col-span-2 lg:col-span-1">
              <h4 className="text-sm font-semibold text-ink">Contact Coordinates</h4>
              <div className="space-y-3 text-xs text-ink-muted">
                <div className="flex items-start gap-2.5">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-accent-strong" />
                  <div>
                    <a href="tel:18008436114" className="block text-sm font-semibold text-ink hover:text-accent-strong">
                      1800-843-6114 (Toll-Free)
                    </a>
                    <a href="tel:+919999001122" className="block hover:text-ink">
                      +91 99990 01122
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent-strong" />
                  <a href="mailto:info@galaxyheritageworld.com" className="break-all hover:text-ink">
                    info@galaxyheritageworld.com
                  </a>
                </div>

                <div className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent-strong" />
                  <span>Lower Ground, C-33, Ram Nagar, Kaushambi, Ghaziabad, UP 201012</span>
                </div>
              </div>

              {/* Newsletter */}
              <div className="pt-1">
                <h5 className="mb-2.5 text-xs font-semibold text-ink">Subscribe for Holiday Privileges</h5>
                {success ? (
                  <div className="flex items-center gap-2 rounded-xl border border-accent/60 bg-accent-soft p-3 text-xs font-medium text-accent-strong">
                    <CheckCircle className="h-4 w-4 shrink-0" />
                    <span>Subscribed successfully! Thank you.</span>
                  </div>
                ) : (
                  <form onSubmit={handleSubscribe} className="space-y-2">
                    <div className="flex items-center gap-1.5 rounded-full border border-line bg-white p-1 pl-4 transition-shadow focus-within:border-ink/30 focus-within:ring-4 focus-within:ring-accent/35">
                      <input
                        type="email"
                        required
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full min-w-0 bg-transparent text-sm text-ink placeholder:text-ink-subtle focus:outline-none"
                      />
                      <button
                        type="submit"
                        disabled={submitting}
                        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-ink transition-colors hover:bg-accent-hover disabled:opacity-60"
                        aria-label="Subscribe"
                      >
                        <Send className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    {error && (
                      <div className="flex items-center gap-1 text-xs text-rose-600">
                        <AlertCircle className="h-3 w-3" />
                        <span>{error}</span>
                      </div>
                    )}
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* Bottom copyright & disclaimer */}
          <div className="flex flex-col items-center justify-between gap-4 pt-8 text-center text-xs text-ink-subtle md:flex-row md:text-left">
            <div>
              &copy; {new Date().getFullYear()} Galaxy Heritage World. All rights reserved. Registered under Indian Companies Act.
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <Link href="/privacy-policy" className="hover:text-ink">
                Privacy Policy
              </Link>
              <span>&bull;</span>
              <Link href="/terms-conditions" className="hover:text-ink">
                Terms of Service
              </Link>
              <span>&bull;</span>
              <Link href="/pricing-policy" className="hover:text-ink">
                Pricing Policy
              </Link>
              <span>&bull;</span>
              <Link href="/reviews-and-complaints" className="hover:text-ink">
                Grievance Matrix
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
