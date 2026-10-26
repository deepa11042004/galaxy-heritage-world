import React from 'react';
import { Undo2 } from 'lucide-react';
import { PageHero } from '@/components/ui/PageHero';

export const metadata = {
  title: 'Return Policy | Galaxy Heritage World',
  description: 'Refund policy and the 7-day exit option of Galaxy Heritage World packages.',
};

export default function ReturnPolicyPage() {
  return (
    <div>
      <PageHero
        tone="orange"
        icon={Undo2}
        eyebrow="Refunds"
        title={
          <>
            Return <span className="text-ink/70">Policy</span>
          </>
        }
      />

      <div className="container-narrow section">
        <div className="card prose-legal p-6 sm:p-12">
          <section>
            <h2>Refund Policy</h2>
            <p>
              It is understood that if the agreement is cancelled by the Applicant(s), the company shall refund to the Applicant(s) the payments then held by the company, after deducting the administrative fee of 25% paid by the purchaser, plus the cost per night of any nights already used by the purchaser (Regular Nights / Complimentary Nights / Holiday Voucher Nights) as per the hotel invoice, and also applicable GST. The refund will be made without any interest within 90 working days from the days of the cancellation request.
            </p>
          </section>

          <section>
            <h2>Exit Option After 7 Days</h2>
            <p>
              It is understood that this Agreement is cancellable upon receipt of written notice (without any personal reason) at the option of either party within a period of 7 days from the date of this Agreement. In exception circumstances, after 7 days time may be granted to the applicant, during which he/she can avail the right to seek the exit option, subject to the deduction of an additional penalty charge of Rs.1000 per working day. Upon expiry of the above period, if no such notice is received within the stipulated time, the parties agree to be bound by the terms and conditions of this Agreement thereafter, and the developer shall not be entitled to refund any money held by it.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
