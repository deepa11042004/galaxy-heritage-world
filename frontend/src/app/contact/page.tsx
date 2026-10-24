'use client';

import React, { useState } from 'react';
import { PhoneCall, Mail, MapPin, Send, CheckCircle2, AlertCircle, Building2, Clock } from 'lucide-react';
import { submitEnquiry } from '@/lib/api';
import { cn } from '@/lib/utils';
import { PageHero } from '@/components/ui/PageHero';
import { buttonVariants } from '@/components/ui/button';

const BRANCHES = [
  { city: 'Mumbai', address: '309 New Link Road Andheri West mumbai 400053' },
  { city: 'Chennai', address: '1,766 Shakti Tower Anna Salai Thousand Light, Chennai 600002' },
  { city: 'Ghaziabad', address: 'C-33, Kaushambi, Ghaziabad, U.P. 201012' },
  { city: 'Lucknow', address: 'Upcoming Office', upcoming: true },
  { city: 'Pune', address: 'Upcoming Office', upcoming: true },
];

const EMPTY_FORM = { firstName: '', lastName: '', email: '', phone: '', message: '' };

export default function ContactPage() {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [successRef, setSuccessRef] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError(null);
      const res = await submitEnquiry({
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        phone: formData.phone,
        // The live contact form has no city field; the enquiry API requires one.
        city: 'Not specified',
        destinationInterest: 'General Query',
        message: formData.message,
        consent: true,
        sourcePage: '/contact',
      });
      setSuccessRef(res.referenceNumber || 'GHW-ENQ-SUCCESS');
      setFormData(EMPTY_FORM);
    } catch (err: any) {
      setError(err.message || 'Unable to submit your enquiry. Please call our toll-free desk.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHero
        image={{
          src: '/media/hero/contact-header.jpg',
          alt: 'A smiling woman with an earbud video-calling on her laptop at an outdoor cafe',
          position: 'center 30%',
        }}
        icon={MapPin}
        eyebrow="Contact Us"
        title={
          <>
            Get in Touch <span className="text-white/70">with Us</span>
          </>
        }
        subtitle="Have questions, need assistance, or want to explore our services? We're here to help! Contact us today"
      />

      <div className="container-page section section-plain">
        {/* Quick contact cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="card flex items-start gap-4 p-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ink text-accent">
              <Mail className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-medium text-ink-muted">E-Mail</div>
              <a
                href="mailto:info@galaxyheritageworld.com"
                className="break-all text-sm font-semibold text-ink hover:text-accent-strong"
              >
                Info@galaxyheritageworld.com
              </a>
            </div>
          </div>
          <div className="card flex items-start gap-4 p-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent text-ink">
              <PhoneCall className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-medium text-ink-muted">Phone Number</div>
              <a href="tel:18008436114" className="text-sm font-semibold text-ink hover:text-accent-strong">
                1800-843-6114
              </a>
            </div>
          </div>
          <div className="card flex items-start gap-4 p-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent text-ink">
              <PhoneCall className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-medium text-ink-muted">Phone Number</div>
              <a href="tel:9355440328" className="text-sm font-semibold text-ink hover:text-accent-strong">
                9355440328
              </a>
            </div>
          </div>
        </div>

        {/* Form + map */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
          <div className="card p-6 sm:p-10">
            {successRef ? (
              <div className="space-y-4 py-12 text-center">
                <div className="success-badge">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-semibold text-ink">Message Sent Successfully!</h3>
                <p className="text-sm text-ink-muted">Your reference enquiry number is:</p>
                <div className="ref-box">{successRef}</div>
                <p className="mx-auto max-w-sm text-xs text-ink-subtle">
                  Our team has recorded your message and will respond within business hours.
                </p>
                <button
                  onClick={() => setSuccessRef(null)}
                  className={cn(buttonVariants({ variant: 'dark', size: 'sm' }), 'mt-4')}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="eyebrow">
                  <span>GET IN TOUCH</span>
                </div>
                <h2 className="text-2xl font-medium tracking-tight text-ink sm:text-3xl">CONTACT US!</h2>
                <p className="mb-4 text-sm text-ink-muted">Fill the form for any query</p>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label">First Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="label">Last Name</label>
                    <input
                      type="text"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="input"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label">Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="label">Contact Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="Contact Number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="input"
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Your Message *</label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Your Message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="input"
                  />
                </div>

                {error && (
                  <div className="alert-error">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <button type="submit" disabled={submitting} className={buttonVariants({ size: 'lg', block: true })}>
                  <span>{submitting ? 'Sending...' : 'Send Enquiry'}</span>
                  <Send />
                </button>
              </form>
            )}
          </div>

          <div className="media-frame min-h-[22rem] lg:min-h-full">
            <iframe
              title="Galaxy Heritage World location map"
              src="https://maps.google.com/maps?q=galaxy%20holiday%20world&t=m&z=9&output=embed&iwloc=near"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full border-0"
            />
          </div>
        </div>
      </div>

      {/* Our Address */}
      <section className="container-page section">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <div className="eyebrow mx-auto">
            <Building2 />
            <span>Our Address</span>
          </div>
          <h2 className="heading-section mt-4 text-ink">
            Welcome to <span className="text-ink-muted">GHW</span>
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-ink-muted sm:text-base">
            We are delighted to serve you from our conveniently located branches. Here&apos;s where you can find us:
          </p>
          <p className="mt-2 text-sm text-ink-muted sm:text-base">
            We are excited to expand our presence with new offices in Lucknow and Pune.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {BRANCHES.map((b) => (
            <div
              key={b.city}
              className={cn('card p-6', b.upcoming && 'border-dashed bg-surface')}
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-ink text-accent">
                {b.upcoming ? <Clock className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
              </div>
              <h3 className="text-lg font-semibold text-ink">{b.city}</h3>
              <p className="mt-1 text-sm leading-relaxed text-ink-muted">{b.address}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
