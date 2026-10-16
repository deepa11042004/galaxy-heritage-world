import React from 'react';
import { Lock } from 'lucide-react';
import { PageHero } from '@/components/ui/PageHero';

export const metadata = {
  title: 'Privacy Policy | Galaxy Heritage World',
  description:
    'Our privacy and data protection policy detailing how your information is safeguarded by Galaxy Heritage World.',
};

export default function PrivacyPolicyPage() {
  return (
    <div>
      <PageHero
        icon={Lock}
        eyebrow="Data Privacy"
        title={
          <>
            Privacy <span className="text-ink-muted">Policy</span>
          </>
        }
        subtitle="How GALAXY HERITAGE WORLD RESORTS PRIVATE LIMITED collects, processes, and protects your personal travel information."
      />

      <div className="container-narrow section">
        <div className="card prose-legal p-6 sm:p-12">
          <section>
            <h2>1. Information We Collect</h2>
            <p>
              When you submit an enquiry, register a voucher, or book a holiday with Galaxy Heritage World, we collect:
            </p>
            <ul>
              <li>Contact details: Name, Email Address, Mobile/Telephone Number, City of Residence.</li>
              <li>Vacation preferences: Destination interests, travel dates, travelers count, special requests.</li>
              <li>Verification identifiers: Voucher codes, membership numbers, and reservation reference numbers.</li>
            </ul>
          </section>

          <section>
            <h2>2. Purpose of Data Processing</h2>
            <p>
              Your personal information is collected strictly for legitimate hospitality and customer service purposes:
            </p>
            <ul>
              <li>Processing holiday bookings and verifying voucher eligibility.</li>
              <li>Communicating reservation confirmations, itinerary details, and travel alerts via SMS, WhatsApp, and email.</li>
              <li>Investigating and resolving customer support or grievance inquiries.</li>
              <li>Compliance with statutory tax and regulatory reporting requirements.</li>
            </ul>
          </section>

          <section>
            <h2>3. Non-Disclosure & Data Security</h2>
            <p>
              We do not sell, rent, or trade your personal information to third-party marketing companies. Data is shared only with certified hospitality partners (e.g., our associated resort hotels and tour operators) strictly as required to fulfill your booked stay.
            </p>
          </section>

          <section>
            <h2>4. Cookies & Web Analytics</h2>
            <p>
              Our website uses essential session cookies for authentication, session management, and site performance. We do not use intrusive tracking cookies without your consent.
            </p>
          </section>

          <section>
            <h2>5. Contact Our Privacy Officer</h2>
            <p>
              For data access requests, corrections, or privacy questions, write to our compliance officer at{' '}
              <a href="mailto:info@galaxyheritageworld.com">
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
