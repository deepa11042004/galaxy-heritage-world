'use client';

import React, { useState } from 'react';
import { ShieldCheck, Clock, CheckCircle2, AlertCircle, Send } from 'lucide-react';
import { submitEnquiry } from '@/lib/api';
import { cn } from '@/lib/utils';
import { PageHero } from '@/components/ui/PageHero';
import { buttonVariants } from '@/components/ui/button';

const escalationLevels = [
  {
    level: 'Level 1',
    title: 'Customer Care & Frontline Support',
    description:
      'For general booking queries, itinerary changes, voucher redemption status, and initial concerns.',
    contacts: [
      { label: 'Toll-Free Helpline', value: '1800-843-6114' },
      { label: 'Support Email', value: 'info@galaxyheritageworld.com' },
      { label: 'Working Hours', value: 'Mon - Sat: 10:00 AM - 6:30 PM' },
    ],
    tat: '24 to 48 Hours',
    badgeColor: 'border border-line bg-surface text-ink',
  },
  {
    level: 'Level 2',
    title: 'Operations Manager & Escalation Desk',
    description:
      'If your concern is not addressed within 48 hours or you are not satisfied with the resolution from Level 1.',
    contacts: [
      { label: 'Direct Escalation Line', value: '+91 99990 01122' },
      { label: 'Operations Email', value: 'support@galaxyheritageworld.com' },
      { label: 'Escalation Mode', value: 'Written Ticket Reference' },
    ],
    tat: '3 to 5 Business Days',
    badgeColor: 'bg-accent text-ink',
  },
  {
    level: 'Level 3',
    title: 'Grievance Redressal Officer & Corporate Management',
    description:
      'Highest authority for escalated disputes, formal policy reviews, and final management decisions.',
    contacts: [
      { label: 'Grievance Desk Email', value: 'grievance@galaxyheritageworld.com' },
      {
        label: 'Postal Address',
        value: 'GALAXY HERITAGE WORLD RESORTS PVT LTD, Lower Ground, C-33, Ram Nagar, Kaushambi, Ghaziabad, UP 201012',
      },
      { label: 'Corporate CIN', value: 'U74999DL2022PTC407515' },
    ],
    tat: '7 Business Days (Final Resolution)',
    badgeColor: 'bg-ink text-white',
  },
];

const grievanceFaqs = [
  {
    q: 'How do I lodge a formal complaint regarding my holiday booking?',
    a: 'You can submit the online complaint form below or email us directly at info@galaxyheritageworld.com with your member ID, booking voucher code, and description. A unique reference code will be generated immediately.',
  },
  {
    q: 'What is the required advance notice for voucher holiday reservations?',
    a: 'As stipulated in our vacation agreement, voucher redemptions require an advance booking request of 15 to 21 business days to ensure confirmed reservations at associated star properties.',
  },
  {
    q: 'Can I transfer or reschedule my booked vacation dates?',
    a: 'Yes, date rescheduling is permitted subject to hotel availability and advance notification (minimum 7 days before check-in). Certain peak season policies may apply.',
  },
  {
    q: 'What happens if my preferred associated resort is fully booked?',
    a: 'In cases of peak dates or sold-out partner properties, our travel desk will offer 2 to 3 equivalent 4-star alternative accommodations in the same destination or alternative dates.',
  },
];

export default function ReviewsAndComplaintsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    message: '',
    bookingRef: '',
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
        destinationInterest: 'Grievance Ticket',
        packageInterest: formData.bookingRef ? `Ref: ${formData.bookingRef}` : 'Grievance Board',
        message: formData.message,
        consent: true,
        sourcePage: '/reviews-and-complaints',
      });
      setSuccessRef(res.referenceNumber || 'GHW-TICKET-SUCCESS');
      setFormData({
        name: '',
        email: '',
        phone: '',
        city: '',
        message: '',
        bookingRef: '',
      });
    } catch (err: any) {
      setError(err.message || 'Unable to register ticket. Please call our toll-free desk directly.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <PageHero
        icon={ShieldCheck}
        eyebrow="Transparency & Accountability"
        title={
          <>
            Customer Grievance & <span className="text-ink-muted">Escalation Matrix</span>
          </>
        }
        subtitle="At Galaxy Heritage World, we believe in 100% transparency. Our structured 3-tier grievance redressal system ensures your feedback and service concerns are resolved with documented turnaround times."
      />

      <div className="container-page section">
        {/* 3-Tier Escalation Matrix */}
        <div id="escalation" className="mb-12 grid grid-cols-1 gap-4 md:grid-cols-3 lg:mb-16 lg:gap-5">
          {escalationLevels.map((lvl, idx) => (
            <div key={idx} className="card card-hover flex flex-col justify-between p-7 sm:p-8">
              <div>
                <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
                  <span className={cn('rounded-full px-3 py-1 text-xs font-semibold', lvl.badgeColor)}>
                    {lvl.level}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-ink-muted">
                    <Clock className="h-3.5 w-3.5 text-accent-strong" />
                    <span>TAT: {lvl.tat}</span>
                  </div>
                </div>

                <h2 className="mb-2 text-xl font-semibold leading-snug text-ink">{lvl.title}</h2>
                <p className="mb-6 text-sm leading-relaxed text-ink-muted">{lvl.description}</p>

                <div className="space-y-3 rounded-2xl bg-surface p-4 text-xs">
                  {lvl.contacts.map((c, i) => (
                    <div key={i}>
                      <span className="block text-[10px] font-semibold uppercase tracking-wider text-ink-subtle">
                        {c.label}
                      </span>
                      <strong className="break-words font-semibold text-ink">{c.value}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Grievance Submission Form */}
        <div className="mb-12 rounded-hero bg-surface p-3 sm:p-4 lg:mb-16">
          <div className="card p-6 sm:p-12">
            <div className="mx-auto max-w-2xl">
              <div className="mb-10 text-center">
                <h2 className="heading-section mb-3">Register a Grievance or Support Ticket</h2>
                <p className="text-sm text-ink-muted">
                  Submit your query directly to our central compliance desk. Every submission receives an official reference code.
                </p>
              </div>

              {successRef ? (
                <div className="space-y-4 py-12 text-center">
                  <div className="success-badge">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-semibold text-ink">Grievance Ticket Registered</h3>
                  <p className="text-sm text-ink-muted">Your official grievance ticket code is:</p>
                  <div className="ref-box">{successRef}</div>
                  <p className="mx-auto max-w-sm text-xs text-ink-subtle">
                    Our Level 1 Support Desk will review and initiate resolution within 24 to 48 hours.
                  </p>
                  <button
                    onClick={() => setSuccessRef(null)}
                    className={cn(buttonVariants({ variant: 'dark', size: 'sm' }), 'mt-4')}
                  >
                    Submit Another Note
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
                        placeholder="e.g. Suresh Kumar"
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
                        placeholder="e.g. suresh@example.com"
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
                        placeholder="e.g. Delhi, Noida"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="input"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="label">Booking ID / Voucher Code (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. GHW-ENQ-12345 or Voucher Code"
                      value={formData.bookingRef}
                      onChange={(e) => setFormData({ ...formData, bookingRef: e.target.value })}
                      className="input"
                    />
                  </div>

                  <div>
                    <label className="label">Nature of Concern / Detailed Message *</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Describe your issue or feedback in detail..."
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

                  <button
                    type="submit"
                    disabled={submitting}
                    className={buttonVariants({ variant: 'dark', size: 'lg', block: true })}
                  >
                    <span>{submitting ? 'Registering Ticket...' : 'Register Formal Grievance'}</span>
                    <Send className="text-accent" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Complaints Board FAQs */}
        <div id="faqs" className="mx-auto max-w-3xl">
          <div className="mb-10 text-center">
            <h2 className="heading-section">Customer Complaint Resolution FAQs</h2>
            <p className="mt-3 text-sm text-ink-muted">Common questions addressed by our Grievance Redressal Board.</p>
          </div>

          <div className="space-y-3">
            {grievanceFaqs.map((faq, i) => (
              <div key={i} className="rounded-2xl border border-line bg-white p-6">
                <h3 className="mb-2 text-base font-semibold text-ink">{faq.q}</h3>
                <p className="text-sm leading-relaxed text-ink-muted">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
