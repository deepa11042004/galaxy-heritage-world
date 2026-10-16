'use client';

import React, { useState } from 'react';
import { Send, PhoneCall, Mail, ShieldCheck, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { submitEnquiry } from '@/lib/api';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

export function EnquiryFormSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    ageGroup: '30-45',
    destinationInterest: 'Goa',
    packageInterest: 'Family Holiday Package',
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
    if (!formData.name || !formData.email || !formData.phone || !formData.city) {
      setError('Please fill in all mandatory fields.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      const res = await submitEnquiry({
        ...formData,
        sourcePage: typeof window !== 'undefined' ? window.location.pathname : '/',
      });
      setSuccessRef(res.referenceNumber || 'GHW-ENQ-SUCCESS');
    } catch (err: any) {
      setError(err.message || 'Unable to submit enquiry. Please call our toll-free desk.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="enquiry" className="section bg-white">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-hero bg-surface p-5 sm:p-10 lg:p-14">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
            {/* Left Column: Visual copy & Contact Details */}
            <div className="space-y-6 px-1 pt-3 sm:px-0 sm:pt-0 lg:col-span-5">
              <div className="eyebrow">
                <Sparkles />
                <span>Dedicated Holiday Consultant</span>
              </div>

              <h2 className="heading-section">
                Plan Your Bespoke <span className="text-ink-muted">Vacation With Us</span>
              </h2>

              <p className="text-sm leading-relaxed text-ink-muted sm:text-base">
                Whether you are planning a relaxed family beach escape in Goa, a heritage tour across Rajasthan, or redeeming an authorized holiday voucher, our travel specialists are here to customize your complete itinerary.
              </p>

              <div className="space-y-4 border-t border-line pt-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line bg-white">
                    <PhoneCall className="h-[18px] w-[18px] text-ink" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-ink-muted">Toll Free Support</div>
                    <a href="tel:18008436114" className="text-sm font-semibold text-ink hover:text-accent-strong">
                      1800-843-6114
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line bg-white">
                    <Mail className="h-[18px] w-[18px] text-ink" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-medium text-ink-muted">Customer Helpdesk</div>
                    <a
                      href="mailto:info@galaxyheritageworld.com"
                      className="break-all text-sm font-semibold text-ink hover:text-accent-strong"
                    >
                      info@galaxyheritageworld.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line bg-white">
                    <ShieldCheck className="h-[18px] w-[18px] text-ink" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-ink-muted">Registered Office</div>
                    <span className="text-sm text-ink">Ram Nagar, Kaushambi, Ghaziabad, UP 201012</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Lead Form */}
            <div className="card p-5 shadow-[0_30px_60px_-36px_rgba(14,14,14,0.3)] sm:p-8 lg:col-span-7 lg:p-10">
              {successRef ? (
                <div className="space-y-4 py-10 text-center">
                  <div className="success-badge">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-semibold text-ink">Enquiry Submitted Successfully!</h3>
                  <p className="mx-auto max-w-md text-sm text-ink-muted">Your unique enquiry reference number is:</p>
                  <div className="ref-box">{successRef}</div>
                  <p className="mx-auto max-w-sm text-xs text-ink-subtle">
                    An automated acknowledgement has been logged. Our holiday desk expert will contact you within business hours.
                  </p>
                  <button
                    onClick={() => setSuccessRef(null)}
                    className={cn(buttonVariants({ variant: 'dark', size: 'sm' }), 'mt-4')}
                  >
                    Send Another Request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="mb-1 text-xl font-semibold text-ink">Request a Customized Holiday Quote</h3>
                  <p className="mb-5 text-sm text-ink-muted">
                    Fill in your preferences below and our destination specialist will get back with confirmed options.
                  </p>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="label">Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rahul Sharma"
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
                        placeholder="e.g. rahul@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="input"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="label">Mobile Number *</label>
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
                        placeholder="e.g. Delhi, Noida, Mumbai"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="input"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="label">Preferred Destination</label>
                      <select
                        value={formData.destinationInterest}
                        onChange={(e) => setFormData({ ...formData, destinationInterest: e.target.value })}
                        className="input"
                      >
                        <option value="Goa">Goa (Beaches & Resorts)</option>
                        <option value="Rajasthan">Rajasthan (Jaipur, Udaipur, Jodhpur)</option>
                        <option value="Himachal Pradesh">Himachal Pradesh (Manali, Shimla)</option>
                        <option value="Uttarakhand">Uttarakhand (Mussoorie, Nainital, Corbett)</option>
                        <option value="South India">South India (Ooty, Munnar, Coorg)</option>
                        <option value="International">International Exchange (Dubai, Thailand, Bali)</option>
                        <option value="Day Picnics">Day Picnics & Farms</option>
                      </select>
                    </div>

                    <div>
                      <label className="label">Age Group</label>
                      <select
                        value={formData.ageGroup}
                        onChange={(e) => setFormData({ ...formData, ageGroup: e.target.value })}
                        className="input"
                      >
                        <option value="21-30">21 - 30 Years</option>
                        <option value="31-45">31 - 45 Years</option>
                        <option value="46-60">46 - 60 Years</option>
                        <option value="60+">60+ Years (Senior Travel)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="label">Travel Requirements or Special Requests</label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Traveling with family, 2 kids, preferred dates next month..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="input"
                    />
                  </div>

                  <div className="flex items-start gap-2.5 pt-1">
                    <input
                      type="checkbox"
                      id="consent"
                      required
                      checked={formData.consent}
                      onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                      className="mt-0.5 h-4 w-4 shrink-0 rounded border-line accent-accent-strong"
                    />
                    <label htmlFor="consent" className="text-xs leading-snug text-ink-muted">
                      I authorize Galaxy Heritage World to contact me regarding my holiday enquiry via phone, WhatsApp, or email.
                    </label>
                  </div>

                  {error && (
                    <div className="alert-error">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <button type="submit" disabled={submitting} className={buttonVariants({ size: 'lg', block: true })}>
                    <span>{submitting ? 'Submitting Enquiry...' : 'Get Custom Quote & Call'}</span>
                    <Send />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
