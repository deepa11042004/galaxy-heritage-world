import React from 'react';
import { Gift } from 'lucide-react';
import { PageHero } from '@/components/ui/PageHero';
import { ReferralForm } from '@/components/referral/ReferralForm';

export const metadata = {
  title: 'Referral Program | Galaxy Heritage World',
  description:
    'Refer a friend or family member to Galaxy Heritage World and earn rewards: waived charges, gift stay vouchers and holiday points.',
};

const TERMS = [
  'On one successful references one WVC is waived off / 8000 Point.',
  'Two successful references one WVC is waived off & 3N/4D gift voucher for stay / 15000 Point',
  'On three successful references you will get 5 Nights / 6 Days stay in Kerala & one WVC waived off.',
  'Five successful references same will get 50000 point',
  'Both the existing purchaser (referrer) and the new purchaser (referred) need to satisfy the following payment terms, in order to be eligible for the package referral program.',
  'Galaxy Heritage World reserves the right to change/modify/withdraw the referral benefits in specific cases if necessary. The decision of Galaxy Heritage World is final.',
  'Offer valid till 31-Dec-2026.',
];

export default function ReferralProgramPage() {
  return (
    <div>
      <PageHero
        icon={Gift}
        eyebrow="Rewards"
        title={
          <>
            Referral <span className="text-ink-muted">Program</span>
          </>
        }
      />

      <section className="container-page section">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="card p-7 sm:p-10">
            <h2 className="text-2xl font-medium tracking-tight text-ink sm:text-3xl">Terms &amp; Conditions:</h2>
            <ol className="mt-6 space-y-3 text-sm leading-relaxed text-ink-muted sm:text-base">
              {TERMS.map((t, i) => (
                <li key={i} className="flex gap-3">
                  <span className="shrink-0 font-semibold text-ink">{i + 1}.</span>
                  <span>{t}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="card p-7 sm:p-10">
            <div className="eyebrow mb-3">
              <span>CONTACT FORM</span>
            </div>
            <h2 className="mb-6 text-2xl font-medium tracking-tight text-ink sm:text-3xl">Refer &amp; earn</h2>
            <ReferralForm />
          </div>
        </div>
      </section>
    </div>
  );
}
