import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { PageHero } from '@/components/ui/PageHero';

export const metadata = {
  title: 'Terms & Conditions | Galaxy Heritage World',
  description:
    'Terms of service, membership rules, booking conditions, and legal terms of Galaxy Heritage World.',
};

export default function TermsConditionsPage() {
  return (
    <div>
      <PageHero
        icon={ShieldCheck}
        eyebrow="Legal Agreement"
        title={
          <>
            Terms & <span className="text-ink-muted">Conditions</span>
          </>
        }
        subtitle="Please read these terms carefully before accessing or using the services provided by Galaxy Heritage World."
      />

      <div className="container-narrow section">
        <div className="card prose-legal p-6 sm:p-12">
          <section>
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing this website (galaxyheritageworld.com) or availing any travel booking, membership, voucher redemption, or concierge services offered by <strong>GALAXY HERITAGE WORLD RESORTS PRIVATE LIMITED</strong> (CIN: U74999DL2022PTC407515), you agree to be bound by these Terms and Conditions and our Grievance Escalation Policy.
            </p>
          </section>

          <section>
            <h2>2. Holiday Reservations & Booking Procedure</h2>
            <p>
              All reservations are subject to accommodation availability at our associated partner hotels and resorts. Advance booking notice of 15 to 21 business days is mandatory for voucher claims. Booking confirmations are valid exclusively upon receipt of an official confirmation voucher issued with an authorized GHW reference number.
            </p>
          </section>

          <section>
            <h2>3. Check-in Requirements & Identity Verification</h2>
            <p>
              In compliance with local hospitality regulations, all guests checking into partner properties must present government-issued photo identification (Aadhaar Card, Passport, Voter ID, or Driving License). PAN card is not recognized as valid identity proof for hotel check-in.
            </p>
          </section>

          <section>
            <h2>4. Associated Partner Properties</h2>
            <p>
              While Galaxy Heritage World conducts periodic hygiene and star-quality audits of our 1000+ associated partner properties, specific hotel operational policies (pet rules, check-in/out times, room service hours) remain determined by each respective resort management.
            </p>
          </section>

          <section>
            <h2>5. Force Majeure</h2>
            <p>
              Galaxy Heritage World shall not be held liable for failure or delay in fulfilling holiday services resulting from events beyond reasonable control, including natural catastrophes, severe weather, flight cancellations, government advisories, strikes, or epidemics. In such instances, rescheduled travel dates will be offered.
            </p>
          </section>

          <section>
            <h2>6. Dispute Resolution & Jurisdiction</h2>
            <p>
              Any dispute, claim, or controversy arising under or relating to these terms shall first be submitted to our Level 3 Grievance Redressal Officer. In the event of unresolved legal proceedings, exclusive jurisdiction shall reside within the competent courts of Delhi / Ghaziabad NCR, India.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
