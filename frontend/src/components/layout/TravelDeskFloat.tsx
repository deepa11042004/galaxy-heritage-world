'use client';

import React, { useState } from 'react';
import {
  PhoneCall,
  X,
  Send,
  MessageCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { submitEnquiry } from '@/lib/api';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

export function TravelDeskFloat() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [destination, setDestination] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successRef, setSuccessRef] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !city) return;

    try {
      setSubmitting(true);
      setError(null);
      const res = await submitEnquiry({
        name,
        email: `${phone.replace(/\D/g, '')}@lead.galaxyheritageworld.com`,
        phone,
        city,
        destinationInterest: destination || 'General Holiday Enquiry',
        consent: true,
        sourcePage: window.location.pathname,
      });

      setSuccessRef(res.referenceNumber || 'GHW-ENQ-SUCCESS');
      setName('');
      setPhone('');
      setCity('');
      setDestination('');
    } catch (err: any) {
      setError(err.message || 'Could not submit enquiry. Please call us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group relative flex items-center gap-3 rounded-full bg-ink p-1.5 text-white shadow-[0_18px_40px_-12px_rgba(14,14,14,0.5)] transition-all duration-300 hover:-translate-y-0.5 sm:pr-5"
          aria-label="Open Travel Desk Concierge"
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-accent text-ink">
            {/* Subtle pulse ring */}
            <span className="pointer-events-none absolute inset-0 animate-ping rounded-full bg-accent opacity-40" />
            <PhoneCall className="relative h-4 w-4" />
          </div>

          <div className="hidden text-left sm:block">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-accent">
              Travel Desk 24/7
            </div>
            <div className="text-sm font-semibold text-white">1800-843-6114</div>
          </div>
        </button>
      </div>

      {/* Modal / Slide-over Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-end bg-ink/40 p-4 backdrop-blur-sm animate-fade-in sm:items-center sm:p-6">
          <div className="relative w-full overflow-hidden rounded-3xl border border-line bg-white shadow-2xl animate-slide-up sm:w-[420px]">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-line p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-ink">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-ink">Travel Desk & Concierge</h3>
                  <p className="text-xs text-ink-muted">Connect directly with a holiday specialist</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="icon-btn h-9 w-9" aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Quick Contact Buttons */}
            <div className="flex flex-wrap gap-2 border-b border-line bg-surface p-4">
              <a href="tel:18008436114" className={cn(buttonVariants({ variant: 'dark', size: 'sm' }), 'flex-1')}>
                <PhoneCall className="text-accent" />
                <span>Call Toll-Free</span>
              </a>
              <a
                href="https://wa.me/919999001122?text=Hello%20Galaxy%20Heritage%20World%2C%20I%20would%20like%20to%20enquire%20about%20a%20holiday%20package."
                target="_blank"
                rel="noreferrer"
                className={cn(buttonVariants({ size: 'sm' }), 'flex-1 bg-emerald-600 text-white hover:bg-emerald-700')}
              >
                <MessageCircle />
                <span>WhatsApp Desk</span>
              </a>
            </div>

            {/* Content Body */}
            <div className="max-h-[70vh] overflow-y-auto p-5">
              {successRef ? (
                <div className="space-y-3 py-6 text-center">
                  <div className="success-badge h-12 w-12">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <h4 className="text-lg font-semibold text-ink">Enquiry Logged!</h4>
                  <p className="text-xs text-ink-muted">
                    Your reference number is:{' '}
                    <strong className="mt-1 block font-mono text-sm text-ink">{successRef}</strong>
                  </p>
                  <p className="text-xs text-ink-subtle">
                    Our vacation specialist will reach out within 15 minutes.
                  </p>
                  <button
                    onClick={() => setSuccessRef(null)}
                    className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'mt-4')}
                  >
                    Submit Another Request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3.5">
                  <div className="mb-1 flex items-center gap-2 text-xs text-ink-muted">
                    <Clock className="h-3.5 w-3.5 text-accent-strong" />
                    <span>Average callback response: 15 minutes</span>
                  </div>

                  <div>
                    <label className="label">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="input py-2.5"
                    />
                  </div>

                  <div>
                    <label className="label">Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="input py-2.5"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="label">Your City *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Delhi / Noida"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="input py-2.5"
                      />
                    </div>
                    <div>
                      <label className="label">Destination</label>
                      <input
                        type="text"
                        placeholder="e.g. Goa, Manali"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className="input py-2.5"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="alert-error">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <button type="submit" disabled={submitting} className={buttonVariants({ block: true })}>
                    <span>{submitting ? 'Submitting...' : 'Request Instant Callback'}</span>
                    <Send />
                  </button>

                  <p className="text-center text-[10px] leading-tight text-ink-subtle">
                    By submitting, you agree to receive holiday consultation calls/WhatsApp from Galaxy Heritage World.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
