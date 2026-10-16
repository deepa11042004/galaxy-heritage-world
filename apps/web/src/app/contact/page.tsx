'use client';

import React, { useState } from 'react';
import { PhoneCall, Mail, MapPin, Clock, Building, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { submitEnquiry } from '@/lib/api';
import { cn } from '@/lib/utils';
import { PageHero } from '@/components/ui/PageHero';
import { buttonVariants } from '@/components/ui/button';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    subject: 'General Holiday Query',
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
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        city: formData.city,
        destinationInterest: formData.subject,
        message: formData.message,
        consent: true,
        sourcePage: '/contact',
      });
      setSuccessRef(res.referenceNumber || 'GHW-ENQ-SUCCESS');
      setFormData({
        name: '',
        email: '',
        phone: '',
        city: '',
        subject: 'General Holiday Query',
        message: '',
        consent: true,
      });
    } catch (err: any) {
      setError(err.message || 'Unable to submit your contact message. Please call our toll-free desk.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHero
        icon={MapPin}
        eyebrow="Connect With Us"
        title={
          <>
            Contact <span className="text-ink-muted">Galaxy Heritage World</span>
          </>
        }
        subtitle="Reach out to our customer care desk, registered corporate headquarters, or travel concierge team."
      />

      <div className="container-page section">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: Office Coordinates & Credentials */}
          <div className="space-y-4 lg:col-span-5 lg:space-y-5">
            {/* Toll Free Card */}
            <div className="space-y-4 rounded-card bg-accent p-7 sm:p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ink text-accent">
                <PhoneCall className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-semibold text-ink">Toll-Free Assistance</h3>
              <p className="text-sm text-ink/70">
                Call us toll-free from any network across India for vacation planning, voucher verification, or resort reservations.
              </p>
              <a
                href="tel:18008436114"
                className="inline-block text-3xl font-medium tracking-tight text-ink hover:underline"
              >
                1800-843-6114
              </a>
              <div className="text-xs text-ink/70">
                Direct Line: <strong className="text-ink">+91 99990 01122</strong>
              </div>
            </div>

            {/* Registered Head Office */}
            <div className="card space-y-3 p-7 sm:p-8">
              <div className="eyebrow">
                <Building />
                <span>Registered Corporate HQ</span>
              </div>
              <h4 className="text-lg font-semibold text-ink">GALAXY HERITAGE WORLD RESORTS PVT LTD</h4>
              <p className="text-sm leading-relaxed text-ink-muted">
                Lower Ground, C-33, Ram Nagar, Kaushambi, Ghaziabad, Uttar Pradesh 201012
              </p>
              <div className="rounded-xl bg-surface p-3 text-xs text-ink-muted">
                <strong className="text-ink">Corporate CIN:</strong> U74999DL2022PTC407515
              </div>
            </div>

            {/* Email & Support Hours */}
            <div className="card space-y-3 p-7 sm:p-8">
              <div className="eyebrow">
                <Mail />
                <span>Support Inboxes</span>
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-ink-muted">Customer Support:</span>{' '}
                  <a
                    href="mailto:info@galaxyheritageworld.com"
                    className="break-all font-semibold text-ink hover:text-accent-strong"
                  >
                    info@galaxyheritageworld.com
                  </a>
                </div>
                <div>
                  <span className="text-ink-muted">Grievance Desk:</span>{' '}
                  <a
                    href="mailto:grievance@galaxyheritageworld.com"
                    className="break-all font-semibold text-ink hover:text-accent-strong"
                  >
                    grievance@galaxyheritageworld.com
                  </a>
                </div>
                <div className="flex items-center gap-1.5 border-t border-line pt-3 text-xs text-ink-muted">
                  <Clock className="h-3.5 w-3.5 text-accent-strong" />
                  <span>Mon - Sat: 10:00 AM - 6:30 PM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="card p-6 sm:p-10 lg:col-span-7">
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
                <h2 className="mb-1 text-2xl font-medium tracking-tight text-ink sm:text-3xl">
                  Send Us a Direct Message
                </h2>
                <p className="mb-6 text-sm text-ink-muted">
                  Fill in the form below and our travel desk will reach out immediately.
                </p>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Anjali Nair"
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
                      placeholder="e.g. anjali@example.com"
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
                      placeholder="e.g. Delhi, Noida, Bengaluru"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="input"
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Subject / Query Type</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="input"
                  >
                    <option value="General Holiday Query">General Holiday Query</option>
                    <option value="Resort Reservation Assistance">Resort Reservation Assistance</option>
                    <option value="Voucher Redemption Query">Voucher Redemption Query</option>
                    <option value="Corporate / Group Outing">Corporate / Group Outing</option>
                    <option value="Grievance / Feedback">Grievance / Feedback</option>
                  </select>
                </div>

                <div>
                  <label className="label">Your Message *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="How can we assist with your vacation plans?"
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
                  <span>{submitting ? 'Sending Message...' : 'Send Message to Travel Desk'}</span>
                  <Send />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
