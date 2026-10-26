import React from 'react';
import { IndianRupee } from 'lucide-react';
import { PageHero } from '@/components/ui/PageHero';

export const metadata = {
  title: 'Pricing Policy | Galaxy Heritage World',
  description:
    'Pricing policy of Galaxy Heritage World: pricing transparency, price changes, inclusions and exclusions, payment terms, cancellations, discounts and errors.',
};

const SECTIONS: { title: string; text?: string; items?: string[] }[] = [
  {
    title: 'Pricing Transparency',
    text: 'At Galaxy Heritage World, we strive to offer competitive and transparent pricing for all our travel packages, and holiday services. Our prices are inclusive of applicable taxes, fees, and service charges unless stated otherwise.',
  },
  {
    title: 'Price Changes & Updates',
    items: [
      'Prices may vary based on seasonality, availability, and demand.',
      'Any promotional discounts or limited-time offers will be clearly mentioned.',
      'Prices are subject to change without prior notice; however, confirmed bookings will not be affected.',
    ],
  },
  {
    title: 'Inclusions & Exclusions',
    items: [
      'Package prices include only the services listed in the itinerary (e.g., accommodation, transportation, meals).',
      'Additional services such as visa fees, travel insurance, and optional tours are charged separately unless stated otherwise.',
    ],
  },
  {
    title: 'Payment Terms',
    items: [
      'A minimum deposit (as per package terms) is required to confirm bookings.',
      'Full payment must be made before departure as per our booking policy.',
      'Payments can be made via credit/debit cards, bank transfers, UPI, or online payment gateways.',
    ],
  },
  {
    title: 'Cancellation & Refunds',
    items: ['All bookings are non-refundable unless specified under a special offer or package.'],
  },
  {
    title: 'Discounts & Offers',
    items: [
      'Discounts cannot be combined unless specified.',
      'Special offers are subject to availability and valid for a limited period.',
    ],
  },
  {
    title: 'Errors & Omissions',
    text: 'Galaxy Heritage World reserves the right to correct any pricing errors or omissions, and in such cases, we will notify customers before proceeding with their booking.',
  },
];

export default function PricingPolicyPage() {
  return (
    <div>
      <PageHero
        tone="orange"
        icon={IndianRupee}
        eyebrow="Billing & Tariffs"
        title={
          <>
            Pricing <span className="text-ink/70">Policy</span>
          </>
        }
      />

      <div className="container-narrow section">
        <div className="card prose-legal p-6 sm:p-12">
          {SECTIONS.map((s) => (
            <section key={s.title}>
              <h2>{s.title}</h2>
              {s.text && <p>{s.text}</p>}
              {s.items && (
                <ul>
                  {s.items.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
          <p>For any pricing inquiries, feel free to contact our customer support team.</p>
        </div>
      </div>
    </div>
  );
}
