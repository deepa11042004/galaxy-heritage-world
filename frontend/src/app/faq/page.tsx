import React from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { PageHero } from '@/components/ui/PageHero';

export const metadata = {
  title: 'FAQs | Galaxy Heritage World',
  description:
    'Answers to common questions about Galaxy Heritage World resort stay packages: benefits, booking, cancellation, blackout dates and support.',
};

type Faq = { q: string; a?: string; list?: string[] };

/** FAQs, in the order published on galaxyheritageworld.com/faq. */
const FAQS: Faq[] = [
  {
    q: 'What are the benefits of a resort stay package?',
    list: [
      'Access to a wide network of resorts',
      'Cost savings on accommodation',
      'Priority booking',
      'Exclusive customer events and activities',
      'Special discounts on other services and amenities',
    ],
  },
  {
    q: 'What happens if a resort is fully booked?',
    a: 'We recommend booking as early as possible to secure your preferred dates. If a resort is fully booked, our team can assist you in finding alternative accommodations within our network.',
  },
  {
    q: 'How do I book my stay?',
    a: 'You can book your stay through the customer portal on our website, by contacting our customer service team, or through our mobile app. Reservations are subject to availability and should be made in advance.',
  },
  {
    q: 'How do I cancel my package?',
    a: 'Cancellation policies vary. Please refer to your package agreement or contact our customer service team for information on the cancellation process and any associated fees.',
  },
  {
    q: 'Can I transfer my package to someone else?',
    a: 'Packages are generally non-transferable. However, you can often book stays for family and friends using your package.',
  },
  {
    q: 'What is a resort stay package?',
    a: 'A resort stay package allows you to enjoy vacations at a network of resorts by paying a package fee. Guests can book stays at these resorts for a predetermined number of days each year.',
  },
  {
    q: 'How does the package work?',
    a: 'Upon purchasing a package, you gain access to a variety of resorts for a specified number of days each year. Packages typically have different tiers, offering varying levels of accommodation and duration of stay.',
  },
  {
    q: 'Are there any blackout dates or restrictions?',
    a: 'Some resorts may have blackout dates during peak seasons or special events. It’s advisable to check the availability and any restrictions when planning your stay.',
  },
  {
    q: 'Do GHW only receive an allocation of a percentage of rooms from hotels/resorts, and not the full inventory of rooms?',
    a: 'It depends; whereas, it is standard industry practice for resorts & hotels to allocate a percentage of their rooms for The Grand Vacation tie-up properties. Allocation of their inventory is their own guests who book them directly, travel agents, corporate bookings or any other methods. Usually they have more spare inventory except from few peak season dates and long weekends vacations such as new year, christmas etc. We do not offer/guarantee booking from 20th December to 10th January every year. We always strive to give you accommodation on priority basis.',
  },
  {
    q: 'How much does a package cost?',
    a: 'Package costs vary based on the tier and duration of the package. Please contact our sales team or visit our website for detailed pricing information.',
  },
  {
    q: 'Who do I contact for support?',
    a: 'For any queries or support, you can reach out to our customer service team via phone, email, or through the contact form on our website.',
  },
];

export default function FaqPage() {
  return (
    <div>
      <PageHero
        tone="orange"
        icon={HelpCircle}
        eyebrow="Got Questions?"
        title={
          <>
            Frequently Asked <span className="text-ink/70">Questions</span>
          </>
        }
      />

      <section className="container-page section">
        <div className="mx-auto max-w-4xl space-y-3">
          {FAQS.map((f, i) => (
            <details key={f.q} className="group card open:border-accent open:bg-accent-soft" open={i === 0}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-base font-semibold text-ink sm:p-6 [&::-webkit-details-marker]:hidden">
                <span>{f.q}</span>
                <ChevronDown className="size-5 shrink-0 text-ink-muted transition-transform group-open:rotate-180" />
              </summary>
              <div className="px-5 pb-5 text-sm leading-relaxed text-ink-muted sm:px-6 sm:pb-6 sm:text-base">
                {f.list ? (
                  <ul className="list-disc space-y-1.5 pl-5">
                    {f.list.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                ) : (
                  <p>{f.a}</p>
                )}
              </div>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
