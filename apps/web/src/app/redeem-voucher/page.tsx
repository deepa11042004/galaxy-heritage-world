'use client';

import React, { useState } from 'react';
import { Ticket, CheckCircle2, AlertCircle, Send } from 'lucide-react';
import { submitVoucherRedemption } from '@/lib/api';
import { cn } from '@/lib/utils';
import { PageHero } from '@/components/ui/PageHero';
import { buttonVariants } from '@/components/ui/button';

export default function RedeemVoucherPage() {
  const [formData, setFormData] = useState({
    voucherCode: '',
    name: '',
    email: '',
    phone: '',
    city: '',
    preferredDestination: 'Goa',
    preferredDates: '',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [successRef, setSuccessRef] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError(null);
      const res = await submitVoucherRedemption(formData);
      setSuccessRef(res.referenceNumber || 'GHW-VOUCH-SUCCESS');
      setFormData({
        voucherCode: '',
        name: '',
        email: '',
        phone: '',
        city: '',
        preferredDestination: 'Goa',
        preferredDates: '',
        message: '',
      });
    } catch (err: any) {
      setError(err.message || 'Unable to register voucher. Please contact our support desk.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <PageHero
        icon={Ticket}
        eyebrow="Holiday Voucher Portal"
        title={
          <>
            Redeem Your <span className="text-ink-muted">Holiday Voucher</span>
          </>
        }
        subtitle="Register your authorized Galaxy Heritage World vacation voucher code to initiate your resort reservation and travel verification."
      />

      <div className="container-narrow section">
        {/* Form Card */}
        <div className="card p-6 shadow-[0_30px_60px_-40px_rgba(14,14,14,0.3)] sm:p-12">
          {successRef ? (
            <div className="space-y-4 py-12 text-center">
              <div className="success-badge">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-semibold text-ink">Voucher Verification Request Registered!</h2>
              <p className="text-sm text-ink-muted">Your redemption tracking reference is:</p>
              <div className="ref-box">{successRef}</div>
              <p className="mx-auto max-w-md text-xs text-ink-subtle">
                Our voucher verification desk is reviewing your details against our issuing records. You will receive an SMS and email confirmation within 24 to 48 hours.
              </p>
              <button
                onClick={() => setSuccessRef(null)}
                className={cn(buttonVariants({ variant: 'dark', size: 'sm' }), 'mt-4')}
              >
                Redeem Another Voucher
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Voucher Code Special Field */}
              <div className="mb-6 rounded-2xl border border-accent bg-accent-soft p-4 sm:p-5">
                <label className="label uppercase tracking-wider">Voucher / Coupon Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. GHW-PROMO-2026 or GHW-VIP-789"
                  value={formData.voucherCode}
                  onChange={(e) => setFormData({ ...formData, voucherCode: e.target.value.toUpperCase() })}
                  className="input bg-white font-mono font-bold uppercase tracking-wider"
                />
                <span className="mt-2 block text-xs text-ink-muted">
                  Found on your holiday certificate or welcome voucher letter.
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="label">Beneficiary Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Amit Verma"
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
                    placeholder="e.g. amit@example.com"
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
                    placeholder="e.g. Delhi, Jaipur, Chandigarh"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="label">Preferred Destination *</label>
                  <select
                    value={formData.preferredDestination}
                    onChange={(e) => setFormData({ ...formData, preferredDestination: e.target.value })}
                    className="input"
                  >
                    <option value="Goa">Goa</option>
                    <option value="Jaipur">Jaipur (Rajasthan)</option>
                    <option value="Udaipur">Udaipur (Rajasthan)</option>
                    <option value="Manali">Manali (Himachal)</option>
                    <option value="Shimla">Shimla (Himachal)</option>
                    <option value="Mussoorie">Mussoorie (Uttarakhand)</option>
                    <option value="Jim Corbett">Jim Corbett National Park</option>
                    <option value="Ooty">Ooty (Tamil Nadu)</option>
                    <option value="Munnar">Munnar (Kerala)</option>
                  </select>
                </div>
                <div>
                  <label className="label">Tentative Travel Dates</label>
                  <input
                    type="text"
                    placeholder="e.g. 15th to 18th December"
                    value={formData.preferredDates}
                    onChange={(e) => setFormData({ ...formData, preferredDates: e.target.value })}
                    className="input"
                  />
                </div>
              </div>

              <div>
                <label className="label">Additional Notes</label>
                <textarea
                  rows={2}
                  placeholder="Number of adults/children, special accommodation requests..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="input"
                />
              </div>

              {/* Guidelines / Terms */}
              <div className="inset-box space-y-1">
                <div className="font-semibold text-ink">Important Voucher Conditions:</div>
                <div>1. Voucher bookings must be registered at least 15 to 21 days prior to check-in.</div>
                <div>2. Stays are subject to room allotment at associated partner properties.</div>
                <div>3. Utility fees, applicable government taxes, or peak-season supplements apply as per policy.</div>
              </div>

              {error && (
                <div className="alert-error">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button type="submit" disabled={submitting} className={buttonVariants({ size: 'lg', block: true })}>
                <span>{submitting ? 'Registering Voucher...' : 'Submit Voucher for Verification'}</span>
                <Send />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
