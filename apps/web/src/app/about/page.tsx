import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShieldCheck,
  Award,
  Sparkles,
  MapPin,
  Phone,
  CheckCircle,
  Building,
  ArrowRight,
} from 'lucide-react';

export const metadata = {
  title: 'About Us | Galaxy Heritage World',
  description:
    'Learn about Galaxy Heritage World, our corporate background, mission, 43+ associated resort network, and commitment to transparent hospitality.',
};

export default function AboutPage() {
  return (
    <div className="bg-[#FAF7F2] min-h-screen py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#D4AF37] mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Our Heritage & Vision</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
            Redefining Luxury & Family Holidays Across India
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-4 leading-relaxed">
            Galaxy Heritage World was founded on a simple principle: every Indian family deserves world-class hospitality, audited accommodations, and complete booking transparency.
          </p>
        </div>

        {/* Corporate Profile Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-md border border-[#D4AF37]/20 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0B1320] text-[#D4AF37] rounded-full text-xs font-semibold uppercase tracking-wider">
                <Building className="w-3.5 h-3.5" />
                <span>Corporate Registration</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 leading-snug">
                GALAXY HERITAGE WORLD RESORTS PRIVATE LIMITED
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                We are a legally registered Indian private limited entity incorporated under the Companies Act. With our corporate identification number <strong className="text-gray-900">U74999DL2022PTC407515</strong>, we operate with full regulatory compliance, registered taxation, and corporate governance.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-[#FAF7F2] rounded-xl border border-gray-200">
                  <div className="text-xs text-gray-500 font-medium">Corporate CIN</div>
                  <div className="text-xs font-bold text-gray-900 font-mono mt-0.5">
                    U74999DL2022PTC407515
                  </div>
                </div>
                <div className="p-4 bg-[#FAF7F2] rounded-xl border border-gray-200">
                  <div className="text-xs text-gray-500 font-medium">Head Office</div>
                  <div className="text-xs font-bold text-gray-900 mt-0.5">
                    Kaushambi, Ghaziabad, UP
                  </div>
                </div>
              </div>
            </div>

            <div className="relative h-80 sm:h-96 w-full rounded-2xl overflow-hidden shadow-lg border border-gray-200">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="p-8 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center mb-5">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-gray-900 mb-2">
              43+ Associated Resorts
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              We partner with recognized 4-star and 5-star properties across Goa, Rajasthan, Uttarakhand, Himachal Pradesh, and international tourist hubs, ensuring certified hygiene and comfort.
            </p>
          </div>

          <div className="p-8 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-[#2563EB]/10 text-[#2563EB] flex items-center justify-center mb-5">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-gray-900 mb-2">
              Dedicated Travel Desk
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Our toll-free 1800-843-6114 desk provides end-to-end trip planning, vouchers redemption assistance, and real-time coordinator check-in support for every registered traveler.
            </p>
          </div>

          <div className="p-8 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-gray-900 mb-2">
              3-Tier Grievance Matrix
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              We pride ourselves on transparent customer resolution. Every customer issue has a defined turnaround time and direct access to senior grievance redressal officers.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-[#0B1320] text-white rounded-3xl p-8 sm:p-12 text-center flex flex-col items-center">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-3">
            Ready to Plan Your Next Family Holiday?
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 max-w-lg mb-6">
            Speak to our travel desk specialists or explore our handpicked holiday packages today.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/vacation-packages"
              className="px-6 py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-full text-xs font-semibold uppercase tracking-wider transition-colors shadow"
            >
              Explore Packages
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full text-xs font-semibold uppercase tracking-wider transition-colors border border-white/20"
            >
              Contact Travel Desk
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
