import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Clock, MapPin, Check, X, PhoneCall, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { getPackageBySlug } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { PageHero } from '@/components/ui/PageHero';
import { buttonVariants } from '@/components/ui/button';

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const res = await getPackageBySlug(slug).catch(() => null);
  if (!res || !res.data) return { title: 'Package Not Found' };
  return {
    title: `${res.data.title} | Galaxy Heritage World`,
    description: res.data.overview?.slice(0, 160) || `Book ${res.data.title} with Galaxy Heritage World.`,
  };
}

export default async function PackageDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const res = await getPackageBySlug(slug).catch(() => null);

  if (!res || !res.data) {
    notFound();
  }

  const pkg = res.data;

  return (
    <div>
      {/* Hero Header */}
      <PageHero
        image={{
          src: pkg.heroImageUrl || '/media/galaxy-heritage-world/homepage/images/2-1.png',
          alt: pkg.title,
        }}
        meta={
          <>
            <span className="pill-glass">
              <MapPin className="h-3.5 w-3.5" />
              {pkg.locationLabel}
            </span>
            <span className="text-white/60">&bull;</span>
            <span className="pill-glass">
              <Clock className="h-3.5 w-3.5" />
              {pkg.durationDays} Days / {pkg.durationNights} Nights
            </span>
          </>
        }
        title={pkg.title}
        subtitle={pkg.subtitle || undefined}
      />

      {/* Main Content */}
      <div className="container-page section">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Overview, Inclusions, Exclusions */}
          <div className="space-y-6 lg:col-span-8">
            {/* Overview */}
            <div className="card space-y-4 p-6 sm:p-8">
              <h2 className="text-2xl font-medium text-ink sm:text-3xl">Package Overview</h2>
              <p className="whitespace-pre-line text-sm leading-relaxed text-ink-muted sm:text-base">
                {pkg.overview}
              </p>
            </div>

            {/* Inclusions & Exclusions */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Inclusions */}
              <div className="card p-6 sm:p-8">
                <div className="mb-5 flex items-center gap-2.5 text-xl font-semibold text-ink">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent">
                    <Check className="h-4 w-4 text-ink" />
                  </span>
                  <h3>Package Inclusions</h3>
                </div>
                {Array.isArray(pkg.inclusions) && pkg.inclusions.length > 0 ? (
                  <ul className="space-y-2.5 text-sm text-ink-muted">
                    {pkg.inclusions.map((item: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-strong" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-ink-muted">Accommodation & breakfast included.</p>
                )}
              </div>

              {/* Exclusions */}
              <div className="card p-6 sm:p-8">
                <div className="mb-5 flex items-center gap-2.5 text-xl font-semibold text-ink">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-50">
                    <X className="h-4 w-4 text-rose-600" />
                  </span>
                  <h3>Package Exclusions</h3>
                </div>
                {Array.isArray(pkg.exclusions) && pkg.exclusions.length > 0 ? (
                  <ul className="space-y-2.5 text-sm text-ink-muted">
                    {pkg.exclusions.map((item: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <X className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-ink-muted">Personal expenses, airfare & monument entry unless specified.</p>
                )}
              </div>
            </div>

            {/* Highlights */}
            {Array.isArray(pkg.highlights) && pkg.highlights.length > 0 && (
              <div className="card p-6 sm:p-8">
                <h3 className="mb-5 text-xl font-semibold text-ink">Tour Highlights & Experiences</h3>
                <div className="grid grid-cols-1 gap-3 text-sm text-ink-muted sm:grid-cols-2">
                  {pkg.highlights.map((hl: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2">
                      <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-accent-strong" />
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Pricing & Booking Widget */}
          <div className="space-y-6 lg:col-span-4">
            <div className="card sticky top-[calc(var(--header-h)+1rem)] p-6 shadow-[0_24px_60px_-36px_rgba(14,14,14,0.3)] sm:p-7">
              <div className="mb-5">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-subtle">
                  Tariff Starting From
                </span>
                <div className="mt-1 text-3xl font-medium tracking-tight text-ink sm:text-4xl">
                  {pkg.priceStarting
                    ? formatCurrency(Number(pkg.priceStarting))
                    : pkg.priceLabel || 'Price on Enquiry'}
                </div>
                <div className="mt-1 text-xs text-ink-muted">Per person on twin sharing basis</div>
              </div>

              <div className="mb-6 space-y-2.5 rounded-2xl bg-surface p-4 text-xs text-ink-muted">
                <div className="flex justify-between gap-4">
                  <span>Duration:</span>
                  <strong className="text-right font-semibold text-ink">
                    {pkg.durationDays}D / {pkg.durationNights}N
                  </strong>
                </div>
                <div className="flex justify-between gap-4">
                  <span>Destination:</span>
                  <strong className="text-right font-semibold text-ink">{pkg.locationLabel}</strong>
                </div>
                <div className="flex justify-between gap-4">
                  <span>Stay Type:</span>
                  <strong className="text-right font-semibold text-ink">4-Star Associated Resort</strong>
                </div>
              </div>

              <div className="mb-6 space-y-3">
                <Link
                  href={`/contact?package=${encodeURIComponent(pkg.title)}`}
                  className={buttonVariants({ block: true, size: 'lg' })}
                >
                  <span>Book This Package</span>
                  <ArrowRight />
                </Link>
                <a href="tel:18008436114" className={buttonVariants({ variant: 'dark', block: true })}>
                  <PhoneCall className="text-accent" />
                  <span>Call Desk: 1800-843-6114</span>
                </a>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-ink-muted">
                <ShieldCheck className="h-4 w-4 text-accent-strong" />
                <span>Verified Galaxy Heritage Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
