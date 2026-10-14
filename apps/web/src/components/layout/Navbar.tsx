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
  Search,
  Sparkles,
  ShieldCheck,
  User,
  Compass,
  MapPin,
  Palmtree,
  Ticket,
  ArrowRight,
} from 'lucide-react';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [destinationsOpen, setDestinationsOpen] = useState(false);
  const [resortsOpen, setResortsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
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
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      {/* Top Announcement Bar */}
      <div className="bg-[#0B1320] text-gray-300 text-xs py-2 px-4 border-b border-gray-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <a
              href="tel:18008436114"
              className="flex items-center gap-1.5 hover:text-[#D4AF37] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="font-semibold text-white">Toll Free: 1800-843-6114</span>
            </a>
            <a
              href="mailto:info@galaxyheritageworld.com"
              className="hidden md:flex items-center gap-1.5 hover:text-[#D4AF37] transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>info@galaxyheritageworld.com</span>
            </a>
            <div className="hidden lg:flex items-center gap-1.5 text-gray-400">
              <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Mon - Sat: 10:00 AM - 6:30 PM</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden xl:inline text-gray-400">
              CIN: <strong className="text-gray-300">U74999DL2022PTC407515</strong>
            </span>
            <Link
              href="/reviews-and-complaints"
              className="flex items-center gap-1 text-[#D4AF37] hover:underline"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Escalation Matrix</span>
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-1 text-white hover:text-[#D4AF37] transition-colors"
            >
              <User className="w-3.5 h-3.5" />
              <span>Member Login</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Floating Dark Pill Navbar Bar */}
      <div
        className={`w-full transition-all duration-300 ${
          isScrolled ? 'py-2.5 backdrop-blur-md bg-white/70 shadow-sm' : 'py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <nav className="relative flex items-center justify-between bg-[#141517] text-white rounded-full pl-2 pr-2 py-1.5 sm:pl-3 sm:pr-3 sm:py-2 shadow-[0_12px_36px_rgba(0,0,0,0.35)] border border-white/10 transition-all duration-300">
            {/* Left: Circular White Logo Badge like the reference image planet badge */}
            <Link
              href="/"
              aria-label="Galaxy Heritage World Home"
              className="group shrink-0 flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white shadow-md overflow-hidden p-1 transition-transform duration-200 hover:scale-105"
            >
              <div className="relative w-full h-full">
                <Image
                  src="/media/galaxy-heritage-world/shared/logos/ghw-logo-transparent.png"
                  alt="Galaxy Heritage World"
                  fill
                  priority
                  className="object-contain"
                  sizes="48px"
                />
              </div>
            </Link>

            {/* Middle: Desktop Navigation Links (Unchanged URLs & dropdowns) */}
            <div className="hidden lg:flex items-center gap-5 xl:gap-7 text-[13.5px] font-medium tracking-wide text-gray-200">
              <Link
                href="/"
                className={`transition-colors duration-150 hover:text-white ${
                  pathname === '/' ? 'text-[#D4AF37] font-semibold' : ''
                }`}
              >
                Home
              </Link>

              <Link
                href="/about"
                className={`transition-colors duration-150 hover:text-white ${
                  pathname === '/about' ? 'text-[#D4AF37] font-semibold' : ''
                }`}
              >
                About Us
              </Link>

              {/* Destinations Dropdown */}
              <div
                className="relative group py-1"
                onMouseEnter={() => setDestinationsOpen(true)}
                onMouseLeave={() => setDestinationsOpen(false)}
              >
                <Link
                  href="/destinations"
                  className={`flex items-center gap-1 transition-colors duration-150 hover:text-white ${
                    pathname.startsWith('/destinations') ? 'text-[#D4AF37] font-semibold' : ''
                  }`}
                >
                  <span>Destinations</span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:rotate-180 group-hover:text-white transition-all" />
                </Link>

                {destinationsOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 bg-[#1C1E22] rounded-2xl shadow-2xl border border-white/10 p-3 text-white animate-in fade-in-50 zoom-in-95 duration-200">
                    <div className="space-y-1">
                      <Link
                        href="/destinations?type=DOMESTIC"
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-200 hover:bg-white/10 hover:text-[#D4AF37] rounded-xl transition-colors"
                      >
                        <MapPin className="w-4 h-4 text-[#D4AF37]" />
                        <span>Domestic Getaways (Goa, Rajasthan, Himachal)</span>
                      </Link>
                      <Link
                        href="/destinations?type=INTERNATIONAL"
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-200 hover:bg-white/10 hover:text-[#D4AF37] rounded-xl transition-colors"
                      >
                        <Compass className="w-4 h-4 text-[#D4AF37]" />
                        <span>International Holidays & Exchange</span>
                      </Link>
                      <div className="border-t border-white/10 my-1 pt-1">
                        <Link
                          href="/destinations"
                          className="block px-3 py-1.5 text-xs text-[#D4AF37] font-semibold hover:underline"
                        >
                          Explore All Destinations &rarr;
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Link
                href="/vacation-packages"
                className={`transition-colors duration-150 hover:text-white ${
                  pathname.startsWith('/vacation-packages') ? 'text-[#D4AF37] font-semibold' : ''
                }`}
              >
                Vacation Packages
              </Link>

              {/* Hotels & Resorts Dropdown */}
              <div
                className="relative group py-1"
                onMouseEnter={() => setResortsOpen(true)}
                onMouseLeave={() => setResortsOpen(false)}
              >
                <Link
                  href="/hotels-resorts"
                  className={`flex items-center gap-1 transition-colors duration-150 hover:text-white ${
                    pathname.startsWith('/hotels-resorts') ? 'text-[#D4AF37] font-semibold' : ''
                  }`}
                >
                  <span>Hotels & Resorts</span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:rotate-180 group-hover:text-white transition-all" />
                </Link>

                {resortsOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 bg-[#1C1E22] rounded-2xl shadow-2xl border border-white/10 p-3 text-white animate-in fade-in-50 zoom-in-95 duration-200">
                    <div className="space-y-1">
                      <Link
                        href="/hotels-resorts?category=ASSOCIATED"
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-200 hover:bg-white/10 hover:text-[#D4AF37] rounded-xl transition-colors"
                      >
                        <Palmtree className="w-4 h-4 text-[#D4AF37]" />
                        <span>Associated Partner Resorts</span>
                      </Link>
                      <Link
                        href="/hotels-resorts?category=INTERNAL"
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-200 hover:bg-white/10 hover:text-[#D4AF37] rounded-xl transition-colors"
                      >
                        <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                        <span>Internal Luxury Properties</span>
                      </Link>
                      <div className="border-t border-white/10 my-1 pt-1">
                        <Link
                          href="/hotels-resorts"
                          className="block px-3 py-1.5 text-xs text-[#D4AF37] font-semibold hover:underline"
                        >
                          View All 43+ Properties &rarr;
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Link
                href="/itineraries"
                className={`transition-colors duration-150 hover:text-white ${
                  pathname.startsWith('/itineraries') ? 'text-[#D4AF37] font-semibold' : ''
                }`}
              >
                Itineraries
              </Link>

              <Link
                href="/day-activities"
                className={`transition-colors duration-150 hover:text-white ${
                  pathname.startsWith('/day-activities') ? 'text-[#D4AF37] font-semibold' : ''
                }`}
              >
                Day Outings
              </Link>

              <Link
                href="/travel-desk"
                className={`transition-colors duration-150 hover:text-white ${
                  pathname === '/travel-desk' ? 'text-[#D4AF37] font-semibold' : ''
                }`}
              >
                Travel Desk
              </Link>
            </div>

            {/* Right: Actions with Distinct Pill Badge CTA (matching right pill in reference) */}
            <div className="hidden sm:flex items-center gap-2">
              <Link
                href="/search"
                aria-label="Search site"
                className="p-2 text-gray-300 hover:text-[#D4AF37] hover:bg-white/10 rounded-full transition-colors"
              >
                <Search className="w-4 h-4" />
              </Link>

              <Link
                href="/redeem-voucher"
                className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider px-3.5 py-2 border border-[#D4AF37]/70 text-[#E5C158] hover:bg-[#D4AF37] hover:text-black rounded-full transition-all duration-200"
              >
                <Ticket className="w-3.5 h-3.5" />
                <span>Redeem Voucher</span>
              </Link>

              {/* High-contrast solid white pill CTA button matching reference button */}
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-gray-900 hover:bg-gray-100 rounded-full text-xs font-bold tracking-wide shadow-md transition-all duration-200 hover:shadow-lg active:scale-95"
              >
                <span>Enquire Now</span>
                <ArrowRight className="w-3.5 h-3.5 text-gray-900" />
              </Link>
            </div>

            {/* Mobile Actions & Menu Toggle */}
            <div className="flex lg:hidden items-center gap-1.5 pr-1">
              <Link
                href="/contact"
                className="sm:hidden px-3.5 py-1.5 bg-white text-gray-900 rounded-full text-xs font-bold shadow"
              >
                Enquire
              </Link>
              <Link
                href="/search"
                aria-label="Search"
                className="p-2 text-gray-300 hover:text-[#D4AF37]"
              >
                <Search className="w-4 h-4" />
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-gray-300 hover:text-white"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </nav>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="max-w-7xl mx-auto px-3 sm:px-6 mt-2 lg:hidden">
            <div className="bg-[#141517] rounded-3xl border border-white/10 px-5 pt-5 pb-6 space-y-4 shadow-2xl max-h-[80vh] overflow-y-auto text-white">
              <div className="flex flex-col space-y-2 text-sm font-medium text-gray-300">
                <Link
                  href="/"
                  className="px-3 py-2 rounded-xl hover:bg-white/10 hover:text-[#D4AF37] transition-colors"
                >
                  Home
                </Link>
                <Link
                  href="/about"
                  className="px-3 py-2 rounded-xl hover:bg-white/10 hover:text-[#D4AF37] transition-colors"
                >
                  About Us
                </Link>
                <Link
                  href="/destinations"
                  className="px-3 py-2 rounded-xl hover:bg-white/10 hover:text-[#D4AF37] transition-colors"
                >
                  Destinations (Domestic & International)
                </Link>
                <Link
                  href="/vacation-packages"
                  className="px-3 py-2 rounded-xl hover:bg-white/10 hover:text-[#D4AF37] transition-colors"
                >
                  Vacation Packages
                </Link>
                <Link
                  href="/hotels-resorts"
                  className="px-3 py-2 rounded-xl hover:bg-white/10 hover:text-[#D4AF37] transition-colors"
                >
                  Hotels & Resorts (43+ Properties)
                </Link>
                <Link
                  href="/itineraries"
                  className="px-3 py-2 rounded-xl hover:bg-white/10 hover:text-[#D4AF37] transition-colors"
                >
                  Holiday Itineraries
                </Link>
                <Link
                  href="/day-activities"
                  className="px-3 py-2 rounded-xl hover:bg-white/10 hover:text-[#D4AF37] transition-colors"
                >
                  Day Outings & Water Parks
                </Link>
                <Link
                  href="/travel-desk"
                  className="px-3 py-2 rounded-xl hover:bg-white/10 hover:text-[#D4AF37] transition-colors"
                >
                  Dedicated Travel Desk
                </Link>
                <Link
                  href="/reviews-and-complaints"
                  className="px-3 py-2 rounded-xl hover:bg-white/10 text-[#E5C158] font-semibold"
                >
                  Reviews & Grievance Escalation Matrix
                </Link>
                <Link
                  href="/faq"
                  className="px-3 py-2 rounded-xl hover:bg-white/10 hover:text-[#D4AF37] transition-colors"
                >
                  Customer FAQs
                </Link>
                <Link
                  href="/contact"
                  className="px-3 py-2 rounded-xl hover:bg-white/10 hover:text-[#D4AF37] transition-colors"
                >
                  Contact & Office Addresses
                </Link>
              </div>

              <div className="pt-4 border-t border-white/10 flex flex-col gap-2.5">
                <Link
                  href="/redeem-voucher"
                  className="text-center py-2.5 px-4 rounded-full border border-[#D4AF37] text-[#E5C158] font-semibold text-xs uppercase tracking-wider hover:bg-[#D4AF37] hover:text-black transition-colors"
                >
                  Redeem Holiday Voucher
                </Link>
                <Link
                  href="/contact"
                  className="text-center py-2.5 px-4 rounded-full bg-white text-gray-900 font-bold text-xs uppercase tracking-wider shadow hover:bg-gray-100 transition-colors"
                >
                  Enquire Now
                </Link>
                <a
                  href="tel:18008436114"
                  className="text-center py-2 px-4 text-xs font-semibold text-gray-300 flex items-center justify-center gap-2 hover:text-[#D4AF37]"
                >
                  <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
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
