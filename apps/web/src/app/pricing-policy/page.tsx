import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowRight, IndianRupee } from 'lucide-react';

export const metadata = {
  title: 'Pricing Policy | Galaxy Heritage World',
  description:
    'Transparent pricing policy, tariff schedules, seasonal classifications, and utility fee details for Galaxy Heritage World.',
};

export default function PricingPolicyPage() {
  return (
    <div className="bg-[#FAF7F2] min-h-screen py-12 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#D4AF37] mb-2">
            <IndianRupee className="w-3.5 h-3.5" />
            <span>Billing & Tariffs</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-gray-900 leading-tight">
            Pricing & Tariff Policy
          </h1>
          <p className="text-sm text-gray-600 mt-3 leading-relaxed">
            Galaxy Heritage World operates with 100% price transparency across all holiday packages, memberships, and voucher redemptions.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-gray-200 prose prose-sm max-w-none text-gray-700 space-y-6">
          <section>
            <h2 className="font-serif text-xl font-bold text-gray-900 mb-2">
              1. Currency & Taxes
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed">
              All package tariffs, membership fees, and administrative charges quoted on this website and in official communication are in <strong>Indian Rupees (INR)</strong>. Applicable Government Goods and Services Tax (GST) is levied in accordance with current statutory rates and explicitly itemized on official invoices.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-gray-900 mb-2">
              2. Holiday Package Pricing
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed">
              Package prices shown as &ldquo;Starting From&rdquo; are based on per-person twin-sharing occupancy in base category rooms at our associated 4-star partner resorts during regular seasons. Tariffs are subject to adjustment during designated peak periods (e.g., Diwali, Christmas/New Year, regional festival weeks) or based on room upgrades.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-gray-900 mb-2">
              3. Promotional Voucher Redemptions
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed">
              For complimentary or promotional holiday gift vouchers:
            </p>
            <ul className="list-disc pl-5 text-xs sm:text-sm space-y-1">
              <li>The base room accommodation entitlement is complimentary for eligible adult travelers as specified on the voucher.</li>
              <li>Statutory government taxes, resort utility maintenance charges (where applicable), and personal consumables (food, beverages, laundry, excursions) remain payable by the beneficiary.</li>
              <li>A booking lead time of 15 to 21 business days is mandatory for voucher validation.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-gray-900 mb-2">
              4. Payment Methods & Verification
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed">
              Authorized payments to Galaxy Heritage World are accepted exclusively through registered corporate banking channels: NEFT/RTGS/IMPS, UPI, and official payment links to GALAXY HERITAGE WORLD RESORTS PRIVATE LIMITED accounts. Cash payments without an official receipt are strictly prohibited.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-gray-900 mb-2">
              5. Refund & Cancellation Terms
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed">
              Refunds and cancellations are governed by the specific terms signed in your vacation agreement. In all eligible cases, approved refunds are processed via direct bank transfer within 14 to 21 business days following receipt of complete verification documentation.
            </p>
          </section>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2563EB] hover:underline"
          >
            <span>Have a billing or pricing query? Contact our finance desk &rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
