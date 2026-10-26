import React from 'react';
import Link from 'next/link';
import { IndianRupee } from 'lucide-react';
import { PageHero } from '@/components/ui/PageHero';

export const metadata = {
  title: 'Pricing Policy | Galaxy Heritage World',
  description:
    'Transparent pricing policy, tariff schedules, seasonal classifications, and utility fee details for Galaxy Heritage World.',
};

export default function PricingPolicyPage() {
  return (
    <div>
      <PageHero
        icon={IndianRupee}
        eyebrow="Billing & Tariffs"
        title={
          <>
            Pricing & <span className="text-ink-muted">Tariff Policy</span>
          </>
        }
        subtitle="Galaxy Heritage World operates with 100% price transparency across all holiday packages and voucher redemptions."
      />

      <div className="container-narrow section">
        <div className="card prose-legal p-6 sm:p-12">
          <section>
            <h2>1. Currency & Taxes</h2>
            <p>
              All package tariffs and administrative charges quoted on this website and in official communication are in <strong>Indian Rupees (INR)</strong>. Applicable Government Goods and Services Tax (GST) is levied in accordance with current statutory rates and explicitly itemized on official invoices.
            </p>
          </section>

          <section>
            <h2>2. Holiday Package Pricing</h2>
            <p>
              Package prices shown as &ldquo;Starting From&rdquo; are based on per-person twin-sharing occupancy in base category rooms at our associated 4-star partner resorts during regular seasons. Tariffs are subject to adjustment during designated peak periods (e.g., Diwali, Christmas/New Year, regional festival weeks) or based on room upgrades.
            </p>
          </section>

          <section>
            <h2>3. Promotional Voucher Redemptions</h2>
            <p>
              For complimentary or promotional holiday gift vouchers:
            </p>
            <ul>
              <li>The base room accommodation entitlement is complimentary for eligible adult travelers as specified on the voucher.</li>
              <li>Statutory government taxes, resort utility maintenance charges (where applicable), and personal consumables (food, beverages, laundry, excursions) remain payable by the beneficiary.</li>
              <li>A booking lead time of 15 to 21 business days is mandatory for voucher validation.</li>
            </ul>
          </section>

          <section>
            <h2>4. Payment Methods & Verification</h2>
            <p>
              Authorized payments to Galaxy Heritage World are accepted exclusively through registered corporate banking channels: NEFT/RTGS/IMPS, UPI, and official payment links to GALAXY HERITAGE WORLD RESORTS PRIVATE LIMITED accounts. Cash payments without an official receipt are strictly prohibited.
            </p>
          </section>

          <section>
            <h2>5. Refund & Cancellation Terms</h2>
            <p>
              Refunds and cancellations are governed by the specific terms signed in your vacation agreement. In all eligible cases, approved refunds are processed via direct bank transfer within 14 to 21 business days following receipt of complete verification documentation.
            </p>
          </section>
        </div>

        <div className="mt-8 text-center">
          <Link href="/contact" className="link-arrow text-sm">
            <span>Have a billing or pricing query? Contact our finance desk &rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
