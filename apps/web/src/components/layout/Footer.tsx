'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { submitNewsletter } from '@/lib/api';

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
    <footer className="bg-[#0B1320] text-gray-300 pt-16 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-gray-800/80">
          {/* Column 1: Brand & Registration */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block relative w-56 h-18">
              <Image
                src="/media/galaxy-heritage-world/shared/logos/ghw-logo-transparent.png"
                alt="Galaxy Heritage World"
                fill
                className="object-contain object-left scale-105"
                sizes="224px"
              />
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
              Galaxy Heritage World is India&apos;s premier luxury holiday and hospitality membership provider, delivering bespoke vacations, verified 4-star and 5-star associated resorts, and memorable family getaways across India and international destinations.
            </p>
            <div className="p-3 bg-white/5 rounded-xl border border-gray-800 text-xs text-gray-300 space-y-1 max-w-sm">
              <div>
                <strong className="text-white">Corporate Entity:</strong> GALAXY HERITAGE WORLD RESORTS PRIVATE LIMITED
              </div>
              <div>
                <strong className="text-white">Corporate CIN:</strong> U74999DL2022PTC407515
              </div>
              <div className="text-[#D4AF37]">
                Ministry of Corporate Affairs Registered
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
              Explore
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Galaxy Heritage
                </Link>
              </li>
              <li>
                <Link href="/destinations" className="hover:text-white transition-colors">
                  Destinations
                </Link>
              </li>
              <li>
                <Link href="/vacation-packages" className="hover:text-white transition-colors">
                  Vacation Packages
                </Link>
              </li>
              <li>
                <Link href="/hotels-resorts" className="hover:text-white transition-colors">
                  Hotels & 43+ Resorts
                </Link>
              </li>
              <li>
                <Link href="/itineraries" className="hover:text-white transition-colors">
                  Curated Itineraries
                </Link>
              </li>
              <li>
                <Link href="/day-activities" className="hover:text-white transition-colors">
                  Day Picnics & Farms
                </Link>
              </li>
              <li>
                <Link href="/travel-desk" className="hover:text-white transition-colors">
                  Travel Desk
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Trust & Grievance */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
              Trust & Governance
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/reviews-and-complaints"
                  className="flex items-center gap-1.5 text-amber-300 hover:text-white transition-colors font-medium"
                >
                  <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                  <span>Escalation Matrix</span>
                </Link>
              </li>
              <li>
                <Link href="/reviews-and-complaints#faqs" className="hover:text-white transition-colors">
                  Complaint Resolution Board
                </Link>
              </li>
              <li>
                <Link href="/redeem-voucher" className="hover:text-white transition-colors">
                  Redeem Voucher Portal
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/pricing-policy" className="hover:text-white transition-colors">
                  Pricing Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-conditions" className="hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Newsletter */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
              Contact Coordinates
            </h4>
            <div className="space-y-2.5 text-xs text-gray-300">
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <a href="tel:18008436114" className="block font-bold text-white hover:text-[#D4AF37]">
                    1800-843-6114 (Toll-Free)
                  </a>
                  <a href="tel:+919999001122" className="block text-gray-400 hover:text-white">
                    +91 99990 01122
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <a href="mailto:info@galaxyheritageworld.com" className="hover:text-white">
                  info@galaxyheritageworld.com
                </a>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span className="text-gray-400">
                  Lower Ground, C-33, Ram Nagar, Kaushambi, Ghaziabad, UP 201012
                </span>
              </div>
            </div>

            {/* Newsletter */}
            <div className="pt-2">
              <h5 className="text-xs font-semibold text-white mb-2">
                Subscribe for Holiday Privileges
              </h5>
              {success ? (
                <div className="flex items-center gap-2 p-2 bg-emerald-950/60 border border-emerald-700/50 rounded-lg text-emerald-300 text-xs">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>Subscribed successfully! Thank you.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="email"
                      required
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white/10 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
                    />
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-3 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg text-xs font-semibold shrink-0 transition-colors"
                      aria-label="Subscribe"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {error && (
                    <div className="flex items-center gap-1 text-rose-400 text-xs">
                      <AlertCircle className="w-3 h-3" />
                      <span>{error}</span>
                    </div>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Bottom copyright & disclaimer */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div>
            &copy; {new Date().getFullYear()} Galaxy Heritage World. All rights reserved. Registered under Indian Companies Act.
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/privacy-policy" className="hover:text-gray-300">
              Privacy Policy
            </Link>
            <span>&bull;</span>
            <Link href="/terms-conditions" className="hover:text-gray-300">
              Terms of Service
            </Link>
            <span>&bull;</span>
            <Link href="/pricing-policy" className="hover:text-gray-300">
              Pricing Policy
            </Link>
            <span>&bull;</span>
            <Link href="/reviews-and-complaints" className="hover:text-gray-300">
              Grievance Matrix
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
