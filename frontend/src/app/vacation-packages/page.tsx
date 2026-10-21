import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Building2,
  Check,
  Dumbbell,
  Flower2,
  Globe2,
  Headset,
  Landmark,
  Sparkles,
  Tags,
  Wallet,
  X,
} from 'lucide-react';
import { getPackages } from '@/lib/api';
import { PageHero } from '@/components/ui/PageHero';
import { FaqList } from '@/components/ui/FaqList';
import { buttonVariants } from '@/components/ui/button';

export const metadata = {
  title: 'Vacation Packages | Galaxy Heritage World',
  description:
    'Choose from three Galaxy Heritage World packages (Blue, White and Red) with access to 4500+ resorts, clubs and fitness centers across India, Europe and the Middle East, plus easy EMI options.',
};

// Pill / button colours follow the tier name (BLUE, WHITE, RED); anything else gets a neutral style.
const TIER_STYLES: { match: RegExp; pill: string; button: string }[] = [
  { match: /blue/i, pill: 'bg-blue-600 text-white', button: 'bg-blue-600 hover:bg-blue-700' },
  { match: /white/i, pill: 'bg-slate-500 text-white', button: 'bg-slate-500 hover:bg-slate-600' },
  { match: /red/i, pill: 'bg-red-600 text-white', button: 'bg-red-600 hover:bg-red-700' },
];
const DEFAULT_STYLE = { pill: 'bg-ink text-white', button: 'bg-ink hover:bg-ink/85' };

const formatPrice = (v: unknown) => Number(v).toLocaleString('en-IN');

const STATS = [
  { value: '4500+', label: 'Properties' },
  { value: '125+', label: 'Countries' },
  { value: '3', label: 'Package Tiers' },
];

const BENEFITS = [
  { icon: Building2, title: 'Luxury Resorts & Hotels', text: '4500+ handpicked properties' },
  { icon: Dumbbell, title: 'Fitness Centers', text: 'Global gym access' },
  { icon: Landmark, title: 'Exclusive Clubs', text: 'Premium club network' },
  { icon: Flower2, title: 'Spa & Wellness', text: 'Rejuvenating treatments' },
  { icon: Headset, title: 'Dedicated Travel Desk', text: 'Round-the-clock support' },
  { icon: Wallet, title: 'Easy EMI', text: 'Flexible payment options' },
];

const STEPS = [
  { title: 'Choose Package', text: 'Select the package tier that best suits your travel needs and preferences.' },
  { title: 'Subscribe', text: 'Complete your subscription with flexible payment or EMI options.' },
  { title: 'Get Access', text: 'Receive your credentials and access to 4500+ properties worldwide.' },
  { title: 'Start Traveling', text: 'Book your stays and enjoy luxurious experiences across the globe.' },
];

type Cell = string | boolean;
const COMPARISON: { feature: string; values: [Cell, Cell, Cell] }[] = [
  { feature: 'Package Price', values: ['Rs. 6,75,000', 'Rs. 7,11,000', 'Rs. 10,02,000'] },
  { feature: 'Variable Charges', values: ['Rs. 20,000', 'Rs. 20,000', 'Rs. 20,000'] },
  { feature: 'Property Access', values: ['4500+ Properties', '4500+ Properties', '4500+ Properties'] },
  { feature: 'Season Booking', values: ['Off Season Only', 'Off + Mid Season', 'All Seasons'] },
  { feature: 'Nights Per Year', values: ['6 nights, 7 days', '6 nights, 7 days', '6 nights, 7 days'] },
  { feature: 'Club Access', values: [true, 'Premium', 'VIP'] },
  { feature: 'Fitness Center Access', values: [true, true, true] },
  { feature: 'Airport Transfers', values: [false, true, true] },
  { feature: 'Dedicated Travel Desk', values: [true, true, true] },
  { feature: 'Exclusive Experiences', values: [false, false, true] },
  { feature: 'EMI Options', values: [true, true, true] },
];

const BANKS = ['HDFC Bank', 'ICICI Bank', 'SBI', 'Axis Bank', 'Kotak', 'Many More'];

const FAQS = [
  {
    question: 'What is included in the package price?',
    answer:
      'The package price includes your subscription fee which grants you access to our network of 4500+ properties, clubs, and fitness centers worldwide. It covers your accommodation nights (varies by package), Dedicated travel desk for the duration of your package validity.',
  },
  {
    question: 'What are variable charges?',
    answer:
      'Variable charges are additional fees that cover property maintenance, housekeeping, and service costs at the time of your stay. These are charged per booking and vary based on your package tier. They ensure you receive top-quality service and well-maintained accommodations during your visits.',
  },
  {
    question: 'Can I upgrade my package later?',
    answer:
      "Yes, you can upgrade your package at any time. You'll only need to pay the difference between your current package and the new package, plus any applicable processing fees. Contact our team to discuss upgrade options and benefits.",
  },
  {
    question: 'How do EMI payments work?',
    answer:
      "We've partnered with all major banks in India to offer convenient EMI options. You can spread your package payment over 12, 18, 24, or 36 months depending on your preference and bank eligibility. Red package holders enjoy zero-interest EMI options with select banks.",
  },
  {
    question: 'What is the validity period of packages?',
    answer:
      'All Galaxy Heritage World packages come with a validity period that starts from the date of activation. The exact validity depends on the package terms at the time of subscription. Contact our team for current validity details and renewal options.',
  },
  {
    question: 'Can I transfer my package to someone else?',
    answer:
      'Package transfers are possible under certain conditions and may involve a transfer fee. Please contact our customer support team to discuss transfer policies and procedures. All transfers are subject to verification and approval.',
  },
];

function SectionHead({
  eyebrow,
  icon: Icon,
  title,
  muted,
  text,
}: {
  eyebrow: string;
  icon: React.ElementType;
  title: string;
  muted: string;
  text?: string;
}) {
  return (
    <div className="mx-auto mb-12 max-w-3xl text-center">
      <div className="eyebrow mx-auto">
        <Icon />
        <span>{eyebrow}</span>
      </div>
      <h2 className="mt-4 text-3xl font-medium tracking-tight text-ink sm:text-4xl">
        {title} <span className="text-ink-muted">{muted}</span>
      </h2>
      {text && <p className="mt-4 text-sm leading-relaxed text-ink-muted sm:text-base">{text}</p>}
    </div>
  );
}

function CellValue({ v }: { v: Cell }) {
  if (v === true) return <Check className="mx-auto h-5 w-5 text-accent-strong" aria-label="Included" />;
  if (v === false) return <X className="mx-auto h-5 w-5 text-ink-subtle" aria-label="Not included" />;
  return <span>{v}</span>;
}

export const revalidate = 60;
export default async function VacationPackagesPage() {
  const res = await getPackages().catch(() => ({ data: [] as any[] }));
  // Packages are managed in the admin panel. Featured = "Popular"; cheapest first.
  const tiers = [...(res.data || [])].sort((a: any, b: any) => Number(a.priceStarting ?? 0) - Number(b.priceStarting ?? 0));

  return (
    <div>
      <PageHero
        icon={Sparkles}
        eyebrow="Exclusive Packages"
        title={
          <>
            Galaxy Heritage World <span className="text-ink-muted">Packages</span>
          </>
        }
        subtitle="Unlock a world of luxury with our exclusive packages. Access 4500+ breathtaking Resorts, Clubs, Fitness Centers across India, Europe, and the Middle East."
      >
        <div className="mx-auto mt-10 grid max-w-xl grid-cols-3 gap-4">
          {STATS.map((st) => (
            <div key={st.label}>
              <p className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{st.value}</p>
              <p className="mt-1 text-xs text-ink-muted sm:text-sm">{st.label}</p>
            </div>
          ))}
        </div>
      </PageHero>

      {/* Introduction */}
      <section className="container-page section">
        <div className="mx-auto max-w-3xl space-y-5 text-center text-sm leading-relaxed text-ink-muted sm:text-base">
          <p>
            Galaxy Heritage World has an association with 4500+ breathtaking Resorts, Clubs, Fitness Centers in India,
            Europe and Middle East. Our properties offer the perfect setting for rare moments of romance, adventure,
            excitement and memories to last a lifetime.
          </p>
          <p>
            Our properties have stunning views to create unique privacy and a true relaxation experience. Galaxy
            Heritage World packages offer a world of benefits. Here, you can make the most of your package.
          </p>
          <p>
            Package holders get access to a rare combination of Clubs and Gymnasiums across the globe. We also
            facilitate EMI options for our packages as we have tie ups with almost all major banks.
          </p>
        </div>
      </section>

      {/* Packages & Benefits */}
      <section className="container-page section">
        <SectionHead
          eyebrow="Packages & Benefits"
          icon={Tags}
          title="Choose Your"
          muted="Package"
          text="There are three levels of World of Galaxy Heritage Suites and Retreat packages. Enjoy great rewards with amazing experiences with your family throughout your package period."
        />

        <div className="grid grid-cols-1 items-start gap-5 md:grid-cols-3">
          {tiers.map((tier: any) => {
            const style = TIER_STYLES.find((t) => t.match.test(tier.title)) ?? DEFAULT_STYLE;
            return (
              <div
                key={tier.id}
                className={`card relative overflow-hidden p-0 ${tier.featured ? 'border-accent' : ''}`}
              >
                {tier.featured && (
                  <span className="absolute top-4 -right-9 rotate-45 bg-accent px-10 py-1 text-[10px] font-bold tracking-wider text-ink">
                    POPULAR
                  </span>
                )}
                <div className="px-6 pt-8 pb-6 text-center">
                  <span className={`inline-block rounded-full px-5 py-2 text-xs font-bold tracking-wider ${style.pill}`}>
                    {tier.title}
                  </span>
                  <p className="mt-6 text-sm text-ink-muted">Package Price</p>
                  <p className="mt-1 text-4xl font-semibold tracking-tight text-ink">
                    <span className="mr-1 text-base font-medium text-accent-strong">Rs.</span>
                    {tier.priceStarting != null ? formatPrice(tier.priceStarting) : tier.priceLabel}
                  </p>
                  {tier.subtitle && (
                    <div className="mt-5 rounded-xl bg-surface p-3">
                      <p className="text-xs text-ink-muted">Variable Charges</p>
                      <p className="text-sm font-semibold text-ink">{tier.subtitle}</p>
                    </div>
                  )}
                </div>

                <ul className="space-y-3 border-t border-line px-6 py-6">
                  {(tier.inclusions ?? []).map((f: string) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-ink-muted">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-strong" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-line p-6">
                  <Link
                    href="/contact"
                    className={`block rounded-xl px-4 py-3 text-center text-sm font-semibold text-white transition-colors ${style.button}`}
                  >
                    Subscribe Now
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
        {tiers.length === 0 && (
          <p className="text-center text-sm text-ink-muted">Packages are being updated. Please check back shortly.</p>
        )}
      </section>

      {/* Benefits */}
      <section className="container-page section">
        <SectionHead
          eyebrow="Benefits"
          icon={Sparkles}
          title="Package"
          muted="Benefits"
          text="Enjoy exclusive privileges and world-class amenities with your Galaxy Heritage World package."
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((b) => (
            <div key={b.title} className="card card-hover flex items-center gap-4 p-5">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-ink text-accent">
                <b.icon className="size-6" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-ink">{b.title}</h3>
                <p className="text-sm text-ink-muted">{b.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="container-page section">
        <SectionHead
          eyebrow="Process"
          icon={Globe2}
          title="How It"
          muted="Works"
          text="Getting started with your Galaxy Heritage World package is simple."
        />
        <ol className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((st, i) => (
            <li key={st.title} className="card p-6 text-center">
              <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-accent text-lg font-bold text-ink">
                {i + 1}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-ink">{st.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{st.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Comparison */}
      <section className="container-page section">
        <SectionHead eyebrow="Compare" icon={Tags} title="Package" muted="Comparison" />
        <div className="card overflow-x-auto p-0">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="bg-surface text-xs font-semibold tracking-wide text-ink-muted uppercase">
                <th className="px-5 py-4">Features</th>
                <th className="px-5 py-4 text-center">Blue (Off Season)</th>
                <th className="px-5 py-4 text-center">White (Mid Season)</th>
                <th className="px-5 py-4 text-center">Red (Peak Season)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {COMPARISON.map((row) => (
                <tr key={row.feature}>
                  <th scope="row" className="px-5 py-3.5 font-semibold text-ink">
                    {row.feature}
                  </th>
                  {row.values.map((v, i) => (
                    <td key={i} className="px-5 py-3.5 text-center text-ink-muted">
                      <CellValue v={v} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* EMI */}
      <section className="container-page section">
        <div className="card mx-auto grid max-w-5xl grid-cols-1 items-center gap-8 p-6 sm:p-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 className="text-2xl font-medium tracking-tight text-ink sm:text-3xl">
              Flexible Payment <span className="text-ink-muted">Options</span>
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-ink-muted sm:text-base">
              We understand that investing in luxury experiences should be convenient. That&rsquo;s why we&rsquo;ve
              partnered with all major banks to offer easy EMI options for our packages. Spread your payments over time
              and start enjoying your benefits immediately.
            </p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {BANKS.map((bank) => (
                <li key={bank} className="pill-muted !px-3.5 !py-1.5 !text-xs">
                  {bank}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl bg-surface p-6 text-center">
            <p className="text-xs font-semibold tracking-wide text-ink-muted uppercase">EMI Starting</p>
            <p className="mt-2 text-4xl font-semibold tracking-tight text-ink">&#8377;18,750</p>
            <p className="mt-1 text-sm text-ink-muted">per month*</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container-page section">
        <SectionHead eyebrow="FAQ" icon={Sparkles} title="Frequently Asked" muted="Questions" />
        <div className="mx-auto max-w-3xl">
          <FaqList items={FAQS} />
        </div>
      </section>

      {/* Closing call to action */}
      <section className="container-page section section-plain">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-medium tracking-tight text-ink sm:text-4xl">
            Ready to Experience <span className="text-ink-muted">the World?</span>
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-ink-muted sm:text-base">
            Join thousands of satisfied travelers who have unlocked a world of luxury with Galaxy Heritage World
            packages. Start your journey today.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link href="/contact" className={buttonVariants({ variant: 'primary', size: 'lg' })}>
              <span>Contact Us</span>
              <ArrowRight />
            </Link>
            <Link href="/hotels-resorts" className={buttonVariants({ variant: 'outline', size: 'lg' })}>
              <span>View Properties</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
