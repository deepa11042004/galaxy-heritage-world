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
  Compass,
  MapPin,
  Palmtree,
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
    <header className="fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300">
      {/* Top Announcement Bar with smooth dark transparency */}
      <div
        className={`w-full text-xs py-2 px-4 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#0B1320]/95 backdrop-blur-md border-b border-white/10 text-gray-300'
            : 'bg-black/35 backdrop-blur-sm border-b border-white/10 text-gray-200'
        }`}
      >
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
              href="/login"
              className="flex items-center gap-1 text-white hover:text-[#D4AF37] transition-colors"
            >
              <User className="w-3.5 h-3.5" />
              <span>Member Login</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Floating Pill Navbar Bar without background wrapper */}
      <div className="w-full transition-all duration-300 py-3 pointer-events-none">
        <div className="max-w-[92rem] mx-auto px-4 sm:px-6 lg:px-8">
          <nav
            style={{ backgroundColor: '#f5f7f8' }}
            className="pointer-events-auto relative flex items-center justify-between bg-[#f5f7f8] text-gray-800 rounded-full pl-5 pr-3 py-2 shadow-[0_20px_50px_rgba(0,0,0,0.35)] border border-gray-200/80 transition-all duration-300"
          >
            {/* Left Group: Logo + Desktop Links right next to it */}
            <div className="flex items-center gap-3 xl:gap-5">
              {/* Brand Logo with transparent background */}
              <Link
                href="/"
                aria-label="Galaxy Heritage World Home"
                className="group shrink-0 flex items-center h-11 sm:h-12 transition-transform duration-200 hover:scale-105"
              >
                <div className="relative w-36 sm:w-40 h-10 sm:h-11">
                  <Image
                    src="/media/galaxy-heritage-world/shared/logos/ghw-logo-transparent.png"
                    alt="Galaxy Heritage World"
                    fill
                    priority
                    className="object-contain object-left scale-110 drop-shadow-[0_2px_6px_rgba(0,0,0,0.12)]"
                    sizes="(max-width: 640px) 150px, 170px"
                  />
                </div>
              </Link>

              {/* Desktop Navigation Links directly following the logo */}
              <div className="hidden lg:flex items-center gap-3 xl:gap-5 text-[13px] xl:text-[13.5px] font-semibold tracking-wide text-gray-700 whitespace-nowrap">
              <Link
                href="/"
                className={`transition-colors duration-150 hover:text-[#D4AF37] px-1 py-1 ${
                  pathname === '/' ? 'text-[#D4AF37]' : ''
                }`}
              >
                Home
              </Link>

              <Link
                href="/about"
                className={`transition-colors duration-150 hover:text-[#D4AF37] px-1 py-1 ${
                  pathname === '/about' ? 'text-[#D4AF37]' : ''
                }`}
              >
                About Us
              </Link>

              {/* Destinations Dropdown */}
              <div
                className="relative py-2"
                onMouseEnter={() => setDestinationsOpen(true)}
                onMouseLeave={() => setDestinationsOpen(false)}
              >
                <Link
                  href="/destinations"
                  className={`flex items-center gap-1 transition-colors duration-150 hover:text-[#D4AF37] px-1 py-1 ${
                    pathname.startsWith('/destinations') ? 'text-[#D4AF37]' : ''
                  }`}
                >
                  <span>Destinations</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-all duration-200 ${destinationsOpen ? 'rotate-180 text-[#D4AF37]' : ''}`} />
                </Link>

                {destinationsOpen && (
                  <div className="absolute top-full left-0 pt-2 w-64 z-50">
                    <div className="bg-white rounded-2xl shadow-[0_20px_45px_rgba(0,0,0,0.25)] border border-gray-100 py-2.5 px-2 animate-in fade-in-50 zoom-in-95 duration-200">
                      <div className="flex flex-col space-y-0.5 text-left">
                        <Link
                          href="/destinations?type=DOMESTIC"
                          className="block px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50 hover:text-[#D4AF37] rounded-xl transition-all"
                        >
                          Domestic Destinations
                        </Link>
                        <Link
                          href="/destinations?type=INTERNATIONAL"
                          className="block px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50 hover:text-[#D4AF37] rounded-xl transition-all"
                        >
                          International Destinations
                        </Link>
                        <Link
                          href="/destinations?type=INTERNATIONAL#exchange"
                          className="block px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50 hover:text-[#D4AF37] rounded-xl transition-all"
                        >
                          Exchange
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Link
                href="/vacation-packages"
                className={`transition-colors duration-150 hover:text-[#D4AF37] px-1 py-1 ${
                  pathname.startsWith('/vacation-packages') ? 'text-[#D4AF37]' : ''
                }`}
              >
                Vacation Packages
              </Link>

              {/* Hotels & Resorts Dropdown */}
              <div
                className="relative py-2"
                onMouseEnter={() => setResortsOpen(true)}
                onMouseLeave={() => setResortsOpen(false)}
              >
                <Link
                  href="/hotels-resorts"
                  className={`flex items-center gap-1 transition-colors duration-150 hover:text-[#D4AF37] px-1 py-1 ${
                    pathname.startsWith('/hotels-resorts') ? 'text-[#D4AF37]' : ''
                  }`}
                >
                  <span>Hotels & Resorts</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-all duration-200 ${resortsOpen ? 'rotate-180 text-[#D4AF37]' : ''}`} />
                </Link>

                {resortsOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-72 z-50">
                    <div className="bg-white rounded-2xl shadow-[0_20px_45px_rgba(0,0,0,0.25)] border border-gray-100 p-3 text-gray-800 animate-in fade-in-50 zoom-in-95 duration-200">
                      <div className="space-y-1">
                        <Link
                          href="/hotels-resorts?category=ASSOCIATED"
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-[#FAF7F2] hover:text-[#D4AF37] rounded-xl transition-colors"
                        >
                          <Palmtree className="w-4 h-4 text-[#D4AF37]" />
                          <span>Associated Partner Resorts</span>
                        </Link>
                        <Link
                          href="/hotels-resorts?category=INTERNAL"
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-[#FAF7F2] hover:text-[#D4AF37] rounded-xl transition-colors"
                        >
                          <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                          <span>Internal Luxury Properties</span>
                        </Link>
                        <div className="border-t border-gray-100 my-1 pt-1">
                          <Link
                            href="/hotels-resorts"
                            className="block px-3 py-1.5 text-xs text-blue-600 font-semibold hover:underline"
                          >
                            View All 43+ Properties &rarr;
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Link
                href="/day-activities"
                className={`transition-colors duration-150 hover:text-[#D4AF37] px-1 py-1 ${
                  pathname.startsWith('/day-activities') ? 'text-[#D4AF37]' : ''
                }`}
              >
                Day Outings
              </Link>

              <Link
                href="/travel-desk"
                className={`transition-colors duration-150 hover:text-[#D4AF37] px-1 py-1 ${
                  pathname === '/travel-desk' ? 'text-[#D4AF37]' : ''
                }`}
              >
                Travel Desk
              </Link>
            </div>
          </div>

          {/* Right: Pill CTA Button */}
          <div className="hidden sm:flex items-center shrink-0 ml-4">
            {/* Contrast dark pill CTA button */}
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#141517] text-white hover:bg-black rounded-full text-xs font-bold tracking-wide shadow-md transition-all duration-200 hover:shadow-lg active:scale-95 whitespace-nowrap"
            >
              <span>Enquire Now</span>
              <ArrowRight className="w-3.5 h-3.5 text-white" />
            </Link>
          </div>

            {/* Mobile Actions & Menu Toggle */}
            <div className="flex lg:hidden items-center gap-1.5 pr-1">
              <Link
                href="/contact"
                className="sm:hidden px-3.5 py-1.5 bg-[#141517] text-white rounded-full text-xs font-bold shadow"
              >
                Enquire
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-gray-700 hover:text-black"
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
            <div className="bg-[#141517]/95 backdrop-blur-2xl rounded-3xl border border-white/10 px-5 pt-5 pb-6 space-y-4 shadow-2xl max-h-[80vh] overflow-y-auto text-white">
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
                <div className="pl-2 border-l-2 border-white/10 space-y-1">
                  <Link
                    href="/destinations?type=DOMESTIC"
                    className="block px-3 py-1.5 text-xs text-gray-300 hover:text-[#D4AF37] transition-colors"
                  >
                    Domestic Destinations
                  </Link>
                  <Link
                    href="/destinations?type=INTERNATIONAL"
                    className="block px-3 py-1.5 text-xs text-gray-300 hover:text-[#D4AF37] transition-colors"
                  >
                    International Destinations
                  </Link>
                  <Link
                    href="/destinations?type=INTERNATIONAL#exchange"
                    className="block px-3 py-1.5 text-xs text-gray-300 hover:text-[#D4AF37] transition-colors"
                  >
                    Exchange
                  </Link>
                </div>
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
