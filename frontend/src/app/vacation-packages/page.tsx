import React from 'react';
import Link from 'next/link';
import { Check, Sparkles, Tags } from 'lucide-react';
import { getPackages } from '@/lib/api';
import { PageHero } from '@/components/ui/PageHero';

export const metadata = {
  title: 'Vacation Packages | Galaxy Heritage World',
  description:
    'Browse luxury holiday packages across Goa, Rajasthan, Himachal Pradesh, Uttarakhand, and South India with verified resort stays.',
};

// Pill / button colours follow the tier name (BLUE, WHITE, RED); anything else gets a neutral style.
const TIER_STYLES: { match: RegExp; pill: string; button: string }[] = [
  { match: /blue/i, pill: 'bg-blue-600 text-white', button: 'bg-blue-600 hover:bg-blue-700' },
  { match: /white/i, pill: 'bg-slate-500 text-white', button: 'bg-slate-500 hover:bg-slate-600' },
  { match: /red/i, pill: 'bg-red-600 text-white', button: 'bg-red-600 hover:bg-red-700' },
];
const DEFAULT_STYLE = { pill: 'bg-ink text-white', button: 'bg-ink hover:bg-ink/85' };

const formatPrice = (v: unknown) => Number(v).toLocaleString('en-IN');

export const revalidate = 60;
export default async function VacationPackagesPage() {
  const res = await getPackages().catch(() => ({ data: [] as any[] }));
  // Packages are managed in the admin panel. Featured = "Popular"; cheapest first.
  const tiers = [...(res.data || [])].sort((a: any, b: any) => Number(a.priceStarting ?? 0) - Number(b.priceStarting ?? 0));

  return (
    <div>
      <PageHero
        icon={Sparkles}
        eyebrow="Tailored Itineraries"
        title={
          <>
            Vacation Packages <span className="text-ink-muted">& Tours</span>
          </>
        }
        subtitle="All-inclusive holiday experiences featuring luxury associated resort stays, delicious breakfasts, curated sightseeing, and on-ground assistance."
      />

      {/* Packages & Benefits */}
      <section className="container-page section">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <div className="eyebrow mx-auto">
            <Tags />
            <span>Packages &amp; Benefits</span>
          </div>
          <h2 className="mt-4 text-3xl font-medium tracking-tight text-ink sm:text-4xl">
            Choose Your <span className="text-ink-muted">Package</span>
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-ink-muted sm:text-base">
            There are three levels of World of Galaxy Heritage Suites and Retreat packages. Enjoy great rewards with
            amazing experiences with your family throughout your package period.
          </p>
        </div>

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
    </div>
  );
}
