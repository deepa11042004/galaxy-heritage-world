'use client';

import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, Send } from 'lucide-react';
import { submitEnquiry } from '@/lib/api';
import { buttonVariants } from '@/components/ui/button';

const EMPTY_FORM = { firstName: '', lastName: '', email: '', phone: '', message: '' };

/** Referral enquiry form. Submissions land in the admin panel under Enquiries (form: "Referral program"). */
export function ReferralForm() {
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
        // The referral form has no city field; the enquiry API requires one.
        city: 'Not specified',
        destinationInterest: 'Referral Program',
        message: formData.message,
        consent: true,
        sourcePage: '/referral-program',
      });
      setSuccessRef(res.referenceNumber || 'GHW-ENQ-SUCCESS');
      setFormData(EMPTY_FORM);
    } catch (err: any) {
      setError(err.message || 'Unable to submit your enquiry. Please call our toll-free desk.');
    } finally {
      setSubmitting(false);
    }
  };

  if (successRef) {
    return (
      <div className="py-8 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" />
        <h3 className="mt-4 text-xl font-semibold text-ink">Thank you!</h3>
        <p className="mt-2 text-sm text-ink-muted">
          Your referral enquiry has been received. Reference: <strong className="text-ink">{successRef}</strong>
        </p>
        <button onClick={() => setSuccessRef(null)} className={`${buttonVariants({ variant: 'dark', size: 'sm' })} mt-4`}>
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="label">First Name *</label>
          <input type="text" required placeholder="First Name" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} className="input" />
        </div>
        <div>
          <label className="label">Last Name</label>
          <input type="text" placeholder="Last Name" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} className="input" />
        </div>
      </div>

      <div>
        <label className="label">Email *</label>
        <input type="email" required placeholder="Email Address" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="input" />
      </div>

      <div>
        <label className="label">Contact Number *</label>
        <input type="tel" required placeholder="Contact Number" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="input" />
      </div>

      <div>
        <label className="label">Your Message *</label>
        <textarea rows={5} required placeholder="Your Message" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="input" />
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
  );
}
