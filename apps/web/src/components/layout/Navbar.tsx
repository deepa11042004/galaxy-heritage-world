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
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
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

      {/* Main Navbar */}
      <nav
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md py-3 border-b border-gray-100'
            : 'bg-white/90 backdrop-blur-sm py-4 border-b border-gray-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <div className="relative w-32 sm:w-40 h-12 sm:h-16">
              <Image
                src="/media/galaxy-heritage-world/shared/logos/ghw-logo-transparent.png"
                alt="Galaxy Heritage World - Luxury Travel"
                fill
                priority
                className="object-contain object-left scale-105"
                sizes="(max-width: 640px) 128px, 160px"
              />
            </div>
          </Link>

          {/* Cylindrical Pill Navigation Container */}
          <div className="hidden lg:flex items-center bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full px-2 py-1.5 shadow-lg hover:shadow-xl transition-all duration-300">
            {/* Search Button */}
            <Link
              href="/search"
              aria-label="Search site"
              className="p-2.5 text-gray-600 hover:text-[#D4AF37] transition-colors flex-shrink-0"
            >
              <Search className="w-4 h-4" />
            </Link>

            <div className="w-px h-6 bg-gray-200 mx-1 flex-shrink-0"></div>

            {/* Navigation Links */}
            <div className="flex items-center gap-0 text-sm font-medium text-gray-800 px-2">
              <Link
                href="/"
                className={`px-3 py-2 rounded-full transition-all duration-200 whitespace-nowrap ${
                  pathname === '/'
                    ? 'text-white bg-[#D4AF37] font-semibold'
                    : 'hover:text-[#D4AF37] hover:bg-gray-100'
                }`}
              >
                Home
              </Link>

              <Link
                href="/about"
                className={`px-3 py-2 rounded-full transition-all duration-200 whitespace-nowrap ${
                  pathname === '/about'
                    ? 'text-white bg-[#D4AF37] font-semibold'
                    : 'hover:text-[#D4AF37] hover:bg-gray-100'
                }`}
              >
                About Us
              </Link>

              {/* Destinations Dropdown */}
              <div
                className="relative group"
                onMouseEnter={() => setDestinationsOpen(true)}
                onMouseLeave={() => setDestinationsOpen(false)}
              >
                <Link
                  href="/destinations"
                  className={`px-3 py-2 rounded-full transition-all duration-200 whitespace-nowrap flex items-center gap-1 ${
                    pathname.startsWith('/destinations')
                      ? 'text-white bg-[#D4AF37] font-semibold'
                      : 'hover:text-[#D4AF37] hover:bg-gray-100'
                  }`}
                >
                  <span>Destinations</span>
                  <ChevronDown className="w-3 h-3 group-hover:rotate-180 transition-transform" />
                </Link>

                {destinationsOpen && (
                  <div className="absolute top-full left-0 w-64 bg-white rounded-xl shadow-xl border border-gray-100 p-3 animate-in fade-in-50 zoom-in-95 duration-200 mt-1 z-50">
                    <div className="space-y-1">
                      <Link
                        href="/destinations?type=DOMESTIC"
                        className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-[#FAF7F2] hover:text-[#D4AF37] rounded-lg transition-colors"
                      >
                        <MapPin className="w-4 h-4 text-[#D4AF37]" />
                        <span>Domestic Getaways (Goa, Rajasthan, Himachal)</span>
                      </Link>
                      <Link
                        href="/destinations?type=INTERNATIONAL"
                        className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-[#FAF7F2] hover:text-[#D4AF37] rounded-lg transition-colors"
                      >
                        <Compass className="w-4 h-4 text-[#D4AF37]" />
                        <span>International Holidays & Exchange</span>
                      </Link>
                      <div className="border-t border-gray-100 my-1 pt-1">
                        <Link
                          href="/destinations"
                          className="block px-3 py-1.5 text-xs text-blue-600 font-medium hover:underline"
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
                className={`px-3 py-2 rounded-full transition-all duration-200 whitespace-nowrap ${
                  pathname.startsWith('/vacation-packages')
                    ? 'text-white bg-[#D4AF37] font-semibold'
                    : 'hover:text-[#D4AF37] hover:bg-gray-100'
                }`}
              >
                Vacation Packages
              </Link>

              {/* Hotels & Resorts Dropdown */}
              <div
                className="relative group"
                onMouseEnter={() => setResortsOpen(true)}
                onMouseLeave={() => setResortsOpen(false)}
              >
                <Link
                  href="/hotels-resorts"
                  className={`px-3 py-2 rounded-full transition-all duration-200 whitespace-nowrap flex items-center gap-1 ${
                    pathname.startsWith('/hotels-resorts')
                      ? 'text-white bg-[#D4AF37] font-semibold'
                      : 'hover:text-[#D4AF37] hover:bg-gray-100'
                  }`}
                >
                  <span>Hotels & Resorts</span>
                  <ChevronDown className="w-3 h-3 group-hover:rotate-180 transition-transform" />
                </Link>

                {resortsOpen && (
                  <div className="absolute top-full left-0 w-64 bg-white rounded-xl shadow-xl border border-gray-100 p-3 animate-in fade-in-50 zoom-in-95 duration-200 mt-1 z-50">
                    <div className="space-y-1">
                      <Link
                        href="/hotels-resorts?category=ASSOCIATED"
                        className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-[#FAF7F2] hover:text-[#D4AF37] rounded-lg transition-colors"
                      >
                        <Palmtree className="w-4 h-4 text-[#D4AF37]" />
                        <span>Associated Partner Resorts</span>
                      </Link>
                      <Link
                        href="/hotels-resorts?category=INTERNAL"
                        className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-[#FAF7F2] hover:text-[#D4AF37] rounded-lg transition-colors"
                      >
                        <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                        <span>Internal Luxury Properties</span>
                      </Link>
                      <div className="border-t border-gray-100 my-1 pt-1">
                        <Link
                          href="/hotels-resorts"
                          className="block px-3 py-1.5 text-xs text-blue-600 font-medium hover:underline"
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
                className={`px-3 py-2 rounded-full transition-all duration-200 whitespace-nowrap ${
                  pathname.startsWith('/itineraries')
                    ? 'text-white bg-[#D4AF37] font-semibold'
                    : 'hover:text-[#D4AF37] hover:bg-gray-100'
                }`}
              >
                Itineraries
              </Link>

              <Link
                href="/day-activities"
                className={`px-3 py-2 rounded-full transition-all duration-200 whitespace-nowrap ${
                  pathname.startsWith('/day-activities')
                    ? 'text-white bg-[#D4AF37] font-semibold'
                    : 'hover:text-[#D4AF37] hover:bg-gray-100'
                }`}
              >
                Day Outings
              </Link>

              <Link
                href="/travel-desk"
                className={`px-3 py-2 rounded-full transition-all duration-200 whitespace-nowrap ${
                  pathname === '/travel-desk'
                    ? 'text-white bg-[#D4AF37] font-semibold'
                    : 'hover:text-[#D4AF37] hover:bg-gray-100'
                }`}
              >
                Travel Desk
              </Link>
            </div>

            <div className="w-px h-6 bg-gray-200 mx-1 flex-shrink-0"></div>

            {/* Action CTAs Inside Pill */}
            <Link
              href="/redeem-voucher"
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider px-3 py-2 text-[#9A7D18] hover:text-white hover:bg-[#D4AF37] rounded-full transition-all duration-200 flex-shrink-0"
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>Redeem</span>
            </Link>

            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider px-3 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-full transition-all duration-200 flex-shrink-0 group"
            >
              <span>Enquire</span>
              <span className="group-hover:translate-x-0.5 transition-transform">→</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              href="/search"
              aria-label="Search"
              className="p-2 text-gray-700 hover:text-[#D4AF37]"
            >
              <Search className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-700 hover:text-[#D4AF37]"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 px-4 pt-4 pb-6 space-y-3 shadow-xl max-h-[85vh] overflow-y-auto">
            <div className="flex flex-col space-y-2 text-sm font-medium text-gray-800">
              <Link
                href="/"
                className="px-3 py-2 rounded-lg hover:bg-[#FAF7F2] hover:text-[#D4AF37]"
              >
                Home
              </Link>
              <Link
                href="/about"
                className="px-3 py-2 rounded-lg hover:bg-[#FAF7F2] hover:text-[#D4AF37]"
              >
                About Us
              </Link>
              <Link
                href="/destinations"
                className="px-3 py-2 rounded-lg hover:bg-[#FAF7F2] hover:text-[#D4AF37]"
              >
                Destinations (Domestic & International)
              </Link>
              <Link
                href="/vacation-packages"
                className="px-3 py-2 rounded-lg hover:bg-[#FAF7F2] hover:text-[#D4AF37]"
              >
                Vacation Packages
              </Link>
              <Link
                href="/hotels-resorts"
                className="px-3 py-2 rounded-lg hover:bg-[#FAF7F2] hover:text-[#D4AF37]"
              >
                Hotels & Resorts (43+ Properties)
              </Link>
              <Link
                href="/itineraries"
                className="px-3 py-2 rounded-lg hover:bg-[#FAF7F2] hover:text-[#D4AF37]"
              >
                Holiday Itineraries
              </Link>
              <Link
                href="/day-activities"
                className="px-3 py-2 rounded-lg hover:bg-[#FAF7F2] hover:text-[#D4AF37]"
              >
                Day Outings & Water Parks
              </Link>
              <Link
                href="/travel-desk"
                className="px-3 py-2 rounded-lg hover:bg-[#FAF7F2] hover:text-[#D4AF37]"
              >
                Dedicated Travel Desk
              </Link>
              <Link
                href="/reviews-and-complaints"
                className="px-3 py-2 rounded-lg hover:bg-[#FAF7F2] text-amber-700 font-semibold"
              >
                Reviews & Grievance Escalation Matrix
              </Link>
              <Link
                href="/faq"
                className="px-3 py-2 rounded-lg hover:bg-[#FAF7F2] hover:text-[#D4AF37]"
              >
                Customer FAQs
              </Link>
              <Link
                href="/contact"
                className="px-3 py-2 rounded-lg hover:bg-[#FAF7F2] hover:text-[#D4AF37]"
              >
                Contact & Office Addresses
              </Link>
            </div>

            <div className="pt-4 border-t border-gray-100 flex flex-col gap-2">
              <Link
                href="/redeem-voucher"
                className="text-center py-2.5 px-4 rounded-xl border border-[#D4AF37] text-[#9A7D18] font-semibold text-xs uppercase tracking-wider"
              >
                Redeem Holiday Voucher
              </Link>
              <Link
                href="/contact"
                className="text-center py-2.5 px-4 rounded-xl bg-[#2563EB] text-white font-semibold text-xs uppercase tracking-wider shadow"
              >
                Book Travel Enquiry
              </Link>
              <a
                href="tel:18008436114"
                className="text-center py-2 px-4 text-xs font-semibold text-gray-700 flex items-center justify-center gap-2"
              >
                <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Call Toll Free: 1800-843-6114</span>
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
