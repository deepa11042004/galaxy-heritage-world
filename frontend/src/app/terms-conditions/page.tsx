import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { PageHero } from '@/components/ui/PageHero';

export const metadata = {
  title: 'Terms & Conditions | Galaxy Heritage World',
  description:
    'Terms of service, package rules, booking conditions, and legal terms of Galaxy Heritage World.',
};

/** Terms & conditions, in the order published on galaxyheritageworld.com. */
const TERMS: string[] = [
  '“GHWHPL” means GHW Private Limited, incorporated under the provisions of the Companies Act, 2013, This term shall, where applicable, include its successors-in-interest and assigns.',
  '“GHW” means Galaxy Heritage World A unit of GHW Hospitality Private Limited.',
  '“Day” refers to the time interval between the check in time of a specified calendar date and the check-out time of the subsequent calendar date, as defined by the specific Resort.',
  '“Week” means any Six “Nights” & Seven “Days”.',
  '“Room” means 2 Adults + 2 Kids allowed in 1 room (Below the age of 6 year).',
  '“WVC” means Week Variable Charge.',
  '“Applicant & Co-applicant” means to the owner of the Package Holder.',
  'THE COMPANY: The Company is GHW Hospitality Private Limited, The Developers of the Galaxy Heritage World situated at Block G-20 S/F, Preet Vihar, Near Main Raod, NA, Delhi, East Delhi- 110092, Delhi, India.',
  'Having dedicated email id. Info@galaxyheritageworld.com, Toll free -1800-843-6114.',
  'PACKAGE CARD: Upon the Package Holder (Applicant(s)) completing all payments due under this package declaration, the GHWHPL shall cause within 30 days, issue a Package Card to the Applicant(s). The Package card shall specify the Applicant(s) occupancy rights and upon issuance of such card the applicant(s) shall be admitted to the Resort package relating to the Apartment or type.',
  'The Package Holder (Applicant & Co-applicant) may avail themselves of a holiday by submitting a reservation request in the form(s) or format(s) prescribed by GHWHPL.',
  'All holiday reservations shall be made on a first-come, first-served basis and are subject to eligibility and availability. Reservations requests may be submitted from 90 days up to 20 working days prior to the desired check-in date, in accordance with the package eligibility. The holiday package includes eligibility for one room per holiday destination, as specified in the package. A second room may be considered, subject to availability, but is not guaranteed as part of the standard package entitlement.',
  'Bookings are subject to eligibility and availability for the requested dates. The entitlement includes 6 nights & 7 days per year for 2 adults and 2 children age below 6 years, as per hotel/resort policy. Children above 6 years of age will be considered adults. For a third person, an extra bed is mandatory and charges will apply, ranging from Rs.700 to Rs.3000 depending on the Hotel/Resort. A third person is allowed with applicable extra bed charge as per the Hotel/Resorts Policy. Food discount may vary based on the specific Hotel/Resort and are subject to their individual policies. No other entitlements will be granted based on verbal commitments. For booking during long weekends and peak dates, reservation must be made at least 30 to 45 working days in advance, depending on the package and booking criteria. The company enforces booking pauses during religious congregations to manage logistical, safety, or staffing constraints.',
  'International Booking- The second party acknowledges that a minimum of one-month prior notice is required for international holiday booking. Only one unit will be provided for international vacation, with eligibility extending to children. The annual entitlement includes 6 nights and 7 days per year, valid for maximum of 2 adults and 2 children aged 5 years, as per the policies of the respective hotel/resort. Children above the age of 5 years will be considered adults. A maximum of third person are permitted per unit, with extra bed charges applicable as per the hotel/resort’s policy, ranging from Rs. 700 to Rs. 3,000, depending on the specific property. Food discount may vary based on the specific Hotel/Resort and are subject to their individual policies. No other entitlements will be granted based on verbal commitments. For booking during long weekends and peak dates, reservation must be made at least 45 to 60 working days in advance, depending on the package and booking criteria. The company enforces booking pauses during religious congregations to manage logistical, safety, or staffing constraints.',
  'The Package Holder (Applicant & Co-applicant) may gift/ or rent their weeks or days, subject to the payment of guest fees and any terms and conditions specified by GHWHPL from time to time. Immediate family members of the Applicant and Co-Applicant - such as spouse, parents, children (up to 18 years of age) are exempt from paying guest fees. However, it is expressly understood that GHWHPL does not undertake the rental of the week or any portion thereof.',
  'The Package Holder (Applicant & Co-applicant) shall not be entitled to avail holidays or any benefits if there are any dues or outstanding payment payable to GHWHPL as on the date the holiday request.',
  'The request for cancellation of confirmed holidays shall be made by the Package Holder (Applicant & Co-Applicant) in writing and shall be subject to such terms and conditions as specified by GHWHPL from time to time. The following norms shall apply in the event of cancellation of confirmed holidays.',
  'For the Package Holder (Applicant and Co-applicant), only one booking will be permitted at a time until the booked holiday is utilize.',
];

export default function TermsConditionsPage() {
  return (
    <div>
      <PageHero
        tone="orange"
        icon={ShieldCheck}
        eyebrow="Legal Agreement"
        title={
          <>
            Terms & <span className="text-ink/70">Conditions</span>
          </>
        }
        subtitle="Please read these terms carefully before accessing or using the services provided by Galaxy Heritage World."
      />

      <div className="container-narrow section">
        <div className="card p-6 sm:p-12">
          <ol className="space-y-4 text-sm leading-relaxed text-ink-muted sm:text-base">
            {TERMS.map((term, i) => (
              <li key={i} className="flex gap-3">
                <span className="shrink-0 font-semibold text-ink">{i + 1}.</span>
                <span>{term}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
