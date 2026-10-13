import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | Galaxy Heritage World',
  description:
    'Our privacy and data protection policy detailing how your information is safeguarded by Galaxy Heritage World.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#FAF7F2] min-h-screen py-12 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#D4AF37] mb-2">
            <Lock className="w-3.5 h-3.5" />
            <span>Data Privacy</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-gray-900 leading-tight">
            Privacy Policy
          </h1>
          <p className="text-sm text-gray-600 mt-3 leading-relaxed">
            How GALAXY HERITAGE WORLD RESORTS PRIVATE LIMITED collects, processes, and protects your personal travel information.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-gray-200 text-gray-700 space-y-6 text-xs sm:text-sm leading-relaxed">
          <section>
            <h2 className="font-serif text-lg font-bold text-gray-900 mb-2">
              1. Information We Collect
            </h2>
            <p>
              When you submit an enquiry, register a voucher, or book a holiday with Galaxy Heritage World, we collect:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Contact details: Name, Email Address, Mobile/Telephone Number, City of Residence.</li>
              <li>Vacation preferences: Destination interests, travel dates, travelers count, special requests.</li>
              <li>Verification identifiers: Voucher codes, membership numbers, and reservation reference numbers.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-lg font-bold text-gray-900 mb-2">
              2. Purpose of Data Processing
            </h2>
            <p>
              Your personal information is collected strictly for legitimate hospitality and customer service purposes:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Processing holiday bookings and verifying voucher eligibility.</li>
              <li>Communicating reservation confirmations, itinerary details, and travel alerts via SMS, WhatsApp, and email.</li>
              <li>Investigating and resolving customer support or grievance inquiries.</li>
              <li>Compliance with statutory tax and regulatory reporting requirements.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-lg font-bold text-gray-900 mb-2">
              3. Non-Disclosure & Data Security
            </h2>
            <p>
              We do not sell, rent, or trade your personal information to third-party marketing companies. Data is shared only with certified hospitality partners (e.g., our associated resort hotels and tour operators) strictly as required to fulfill your booked stay.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-bold text-gray-900 mb-2">
              4. Cookies & Web Analytics
            </h2>
            <p>
              Our website uses essential session cookies for authentication, session management, and site performance. We do not use intrusive tracking cookies without your consent.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-bold text-gray-900 mb-2">
              5. Contact Our Privacy Officer
            </h2>
            <p>
              For data access requests, corrections, or privacy questions, write to our compliance officer at{' '}
              <a href="mailto:info@galaxyheritageworld.com" className="text-[#2563EB] font-semibold underline">
                info@galaxyheritageworld.com
              </a>{' '}
              or our registered office at Ram Nagar, Kaushambi, Ghaziabad, UP 201012.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
