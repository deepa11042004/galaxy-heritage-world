import React from 'react';
import Image from 'next/image';
import { ArrowUpRight, BriefcaseBusiness, CreditCard, Lock, PhoneCall, ScanLine, ShieldCheck, UserRound } from 'lucide-react';
import { PageHero } from '@/components/ui/PageHero';
import { buttonVariants } from '@/components/ui/button';
import { PAYMENT_OPTIONS } from '@/lib/payments';

export const metadata = {
  title: 'Pay Now | Galaxy Heritage World',
  description: 'Pay Galaxy Heritage World online, securely, with Razorpay or Cashfree.',
};

const UPI_ID = 'ghwaccount@kotak';

const UPI_POINTS = [
  { icon: ShieldCheck, text: 'Reliable, and available whenever you need it.' },
  { icon: ScanLine, text: 'Scan to pay with UPI' },
  { icon: UserRound, text: `UPI ID: ${UPI_ID}` },
  { icon: BriefcaseBusiness, text: 'Your journey starts here.' },
];

export default function PayNowPage() {
  return (
    <div>
      <PageHero
        tone="orange"
        icon={CreditCard}
        eyebrow="Online Payment"
        title={
          <>
            Pay <span className="text-ink/70">Now</span>
          </>
        }
        subtitle="Choose a payment option below. You will be taken to the payment provider's secure page to complete your payment."
      />

      <section className="container-page section">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h2 className="text-3xl font-medium tracking-tight text-ink sm:text-4xl lg:text-5xl">
            Book Your Dream Holiday <span className="text-ink-muted">with Confidence</span>
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-ink-muted sm:text-base">
            Welcome to the official payment page of <strong className="font-semibold text-ink">Galaxy Heritage World</strong>.
          </p>
        </div>
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
          {PAYMENT_OPTIONS.map((o) => (
            <div key={o.id} className="card flex flex-col p-7 sm:p-8">
              <div className="flex h-24 items-center justify-center rounded-2xl bg-surface px-6">
                <Image
                  src={o.logo}
                  alt={`${o.name} logo`}
                  width={o.logoSize.width}
                  height={o.logoSize.height}
                  className="h-10 w-auto max-w-full object-contain"
                  unoptimized
                />
              </div>
              <h2 className="mt-6 text-2xl font-semibold tracking-tight text-ink">Pay with {o.name}</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">{o.text}</p>
              <a
                href={o.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`${buttonVariants({ size: 'lg', block: true })} mt-6`}
              >
                <span>Pay with {o.name}</span>
                <ArrowUpRight />
              </a>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-8 flex max-w-4xl flex-col items-center justify-between gap-3 rounded-2xl bg-surface px-6 py-5 text-sm text-ink-muted sm:flex-row">
          <span className="flex items-center gap-2">
            <Lock className="size-4 text-accent-strong" />
            Payments are processed on the provider&apos;s own secure page. We never see your card details.
          </span>
          <a href="tel:18008436114" className="flex shrink-0 items-center gap-2 font-semibold whitespace-nowrap text-ink hover:text-accent-strong">
            <PhoneCall className="size-4 text-accent-strong" />
            Need help? 1800-843-6114
          </a>
        </div>
      </section>

      {/* Pay with UPI QR */}
      <section className="container-page section">
        <div className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-10 rounded-hero border border-line bg-gradient-to-br from-[#fffaf0] to-white p-7 sm:p-10 lg:grid-cols-2 lg:gap-14 lg:p-14">
          <div>
            <h2 className="text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
              Secure Your <span className="block text-accent">Holiday Payment</span>
            </h2>
            <div className="mt-6 h-px w-full max-w-md bg-gradient-to-r from-accent to-transparent" aria-hidden />
            <ul className="mt-8 space-y-4">
              {UPI_POINTS.map((p) => (
                <li key={p.text} className="flex items-center gap-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-ink text-accent">
                    <p.icon className="size-5" />
                  </span>
                  <span className="text-base font-medium text-ink sm:text-lg">{p.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mx-auto w-full max-w-sm">
            <div className="rounded-[2rem] bg-ink p-4 shadow-[0_30px_60px_-30px_rgba(14,14,14,0.6)] sm:p-5">
              <div className="rounded-2xl border-4 border-accent bg-white p-4">
                <Image
                  src="/media/payments/upi-qr.png"
                  alt={`UPI QR code. UPI ID ${UPI_ID}`}
                  width={297}
                  height={312}
                  className="mx-auto h-auto w-full max-w-[17rem]"
                  unoptimized
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
