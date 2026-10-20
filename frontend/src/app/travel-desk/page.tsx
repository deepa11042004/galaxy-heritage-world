'use client';

import React, { useState } from 'react';
import { PhoneCall, MessageCircle, Clock, Send, CheckCircle2, AlertCircle, Headphones } from 'lucide-react';
import { submitEnquiry } from '@/lib/api';
import { cn } from '@/lib/utils';
import { PageHero } from '@/components/ui/PageHero';
import { buttonVariants } from '@/components/ui/button';

export default function TravelDeskPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    destinationInterest: '',
    travelDates: '',
    travelersCount: 2,
    message: '',
    consent: true,
  });

  const [submitting, setSubmitting] = useState(false);
  const [successRef, setSuccessRef] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError(null);
      const res = await submitEnquiry({
        ...formData,
        packageInterest: 'Travel Desk Concierge Request',
        sourcePage: '/travel-desk',
      });
      setSuccessRef(res.referenceNumber || 'GHW-ENQ-SUCCESS');
      setFormData({
        name: '',
        email: '',
        phone: '',
        city: '',
        destinationInterest: '',
        travelDates: '',
        travelersCount: 2,
        message: '',
        consent: true,
      });
    } catch (err: any) {
      setError(err.message || 'Unable to submit travel desk request. Please call directly.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <PageHero
        icon={Headphones}
        eyebrow="Personal Vacation Concierge"
        title={
          <>
            Galaxy Heritage World <span className="text-ink-muted">Travel Desk</span>
          </>
        }
        subtitle="Your single point of contact for customized itinerary design, associated resort bookings, voucher claims, and 24/7 on-trip support."
      />

      <div className="container-page section">
        {/* Quick Contact Banners */}
        <div className="mb-12 grid grid-cols-1 gap-4 md:grid-cols-3 lg:mb-16 lg:gap-5">
          <div className="flex flex-col justify-between rounded-card bg-accent p-7 sm:p-8">
            <div>
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-ink text-accent">
                <PhoneCall className="h-5 w-5" />
              </div>
              <h3 className="mb-1.5 text-xl font-semibold text-ink">Toll-Free Helpline</h3>
              <p className="mb-6 text-sm text-ink/70">
                Instant priority phone consultation with a travel desk officer.
              </p>
            </div>
            <a href="tel:18008436114" className={buttonVariants({ variant: 'dark', block: true })}>
              Call 1800-843-6114
            </a>
          </div>

          <div className="card flex flex-col justify-between p-7 sm:p-8">
            <div>
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white">
                <MessageCircle className="h-5 w-5" />
              </div>
              <h3 className="mb-1.5 text-xl font-semibold text-ink">WhatsApp Concierge</h3>
              <p className="mb-6 text-sm text-ink-muted">
                Chat with our desk for quick voucher queries and photos.
              </p>
            </div>
            <a
              href="https://wa.me/919999001122?text=Hello%20Galaxy%20Heritage%20World%20Travel%20Desk"
              target="_blank"
              rel="noreferrer"
              className={cn(buttonVariants({ block: true }), 'bg-emerald-600 text-white hover:bg-emerald-700')}
            >
              Start WhatsApp Chat
            </a>
          </div>

          <div className="card flex flex-col justify-between p-7 sm:p-8">
            <div>
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-surface text-ink">
                <Clock className="h-5 w-5" />
              </div>
              <h3 className="mb-1.5 text-xl font-semibold text-ink">Desk Working Hours</h3>
              <p className="mb-6 text-sm text-ink-muted">
                Monday to Saturday: 10:00 AM - 6:30 PM IST (Emergency helpline 24/7 on-trip).
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 rounded-full bg-surface px-4 py-2.5 text-center text-sm font-semibold text-ink">
              <span className="h-2 w-2 rounded-full bg-accent-strong" aria-hidden="true" />
              Active & Receiving Calls
            </div>
          </div>
        </div>

        {/* Travel Desk Form */}
        <div className="rounded-hero bg-surface p-3 sm:p-4">
          <div className="card p-6 sm:p-12">
            <div className="mx-auto max-w-3xl">
              <h2 className="heading-section mb-3 text-center">Submit a Travel Desk Request</h2>
              <p className="mb-10 text-center text-sm text-ink-muted">
                Let us know your destination, travel window, and member details. An expert consultant will call back with customized options.
              </p>

              {successRef ? (
                <div className="space-y-4 py-12 text-center">
                  <div className="success-badge">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-semibold text-ink">Request Received by Travel Desk!</h3>
                  <p className="text-sm text-ink-muted">
                    Reference Code: <strong className="font-mono text-ink">{successRef}</strong>
                  </p>
                  <p className="text-xs text-ink-subtle">Our coordinator will call back shortly on your contact number.</p>
                  <button
                    onClick={() => setSuccessRef(null)}
                    className={cn(buttonVariants({ variant: 'dark', size: 'sm' }), 'mt-4')}
                  >
                    Submit Another Query
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="label">Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Vikram Malhotra"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="label">Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. vikram@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="input"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="label">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. +91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="label">City of Residence *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Delhi, Gurgaon, Lucknow"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="input"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="label">Destination of Interest</label>
                      <input
                        type="text"
                        placeholder="e.g. Goa, Manali, Kerala, Dubai"
                        value={formData.destinationInterest}
                        onChange={(e) => setFormData({ ...formData, destinationInterest: e.target.value })}
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="label">Preferred Dates / Month</label>
                      <input
                        type="text"
                        placeholder="e.g. Next month weekend, Mid-November"
                        value={formData.travelDates}
                        onChange={(e) => setFormData({ ...formData, travelDates: e.target.value })}
                        className="input"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="label">Specific Requests / Voucher Number</label>
                    <textarea
                      rows={3}
                      placeholder="Provide any voucher details or travel preferences..."
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
                    <span>{submitting ? 'Submitting to Desk...' : 'Submit Travel Desk Request'}</span>
                    <Send />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
