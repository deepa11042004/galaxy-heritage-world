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
          className="relative group flex items-center gap-3 bg-[#0B1320] text-white pl-4 pr-5 py-3.5 rounded-full shadow-2xl border border-[#D4AF37]/50 hover:bg-[#141E33] transition-all duration-300 hover:scale-105"
          aria-label="Open Travel Desk Concierge"
        >
          {/* Subtle pulse ring */}
          <span className="absolute -inset-1 rounded-full bg-[#D4AF37] opacity-25 group-hover:opacity-40 animate-ping pointer-events-none" />

          <div className="w-8 h-8 rounded-full bg-[#D4AF37] text-[#0B1320] flex items-center justify-center font-bold shadow">
            <PhoneCall className="w-4 h-4 animate-bounce" />
          </div>

          <div className="text-left hidden sm:block">
            <div className="text-[10px] uppercase tracking-wider text-[#D4AF37] font-semibold">
              Travel Desk 24/7
            </div>
            <div className="text-xs font-bold text-white">1800-843-6114</div>
          </div>
        </button>
      </div>

      {/* Modal / Slide-over Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-end sm:justify-end p-4 sm:p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full sm:w-[420px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in slide-in-from-bottom-5 sm:slide-in-from-right-5 duration-300">
            {/* Header */}
            <div className="bg-[#0B1320] text-white p-5 flex items-center justify-between border-b border-[#D4AF37]/30">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-[#D4AF37]/20 text-[#D4AF37] rounded-lg">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-white">
                    Travel Desk & Concierge
                  </h3>
                  <p className="text-xs text-gray-400">
                    Connect directly with a holiday specialist
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Contact Buttons */}
            <div className="p-4 bg-[#FAF7F2] border-b border-gray-200 flex flex-wrap gap-2 text-xs">
              <a
                href="tel:18008436114"
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 bg-[#0B1320] hover:bg-[#1a2538] text-white font-semibold rounded-xl transition-colors shadow-sm"
              >
                <PhoneCall className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Call Toll-Free</span>
              </a>
              <a
                href="https://wa.me/919999001122?text=Hello%20Galaxy%20Heritage%20World%2C%20I%20would%20like%20to%20enquire%20about%20a%20holiday%20package."
                target="_blank"
                rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors shadow-sm"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp Desk</span>
              </a>
            </div>

            {/* Content Body */}
            <div className="p-5 max-h-[70vh] overflow-y-auto">
              {successRef ? (
                <div className="text-center py-6 space-y-3">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif text-lg font-bold text-gray-900">
                    Enquiry Logged!
                  </h4>
                  <p className="text-xs text-gray-600">
                    Your reference number is:{' '}
                    <strong className="text-[#0B1320] block font-mono text-sm mt-1">
                      {successRef}
                    </strong>
                  </p>
                  <p className="text-xs text-gray-500">
                    Our vacation specialist will reach out within 15 minutes.
                  </p>
                  <button
                    onClick={() => setSuccessRef(null)}
                    className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-xs font-semibold rounded-lg text-gray-700 transition-colors"
                  >
                    Submit Another Request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3.5">
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                    <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Average callback response: 15 minutes</span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Your City *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Delhi / Noida"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Destination
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Goa, Manali"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-center gap-1.5 p-2 bg-rose-50 text-rose-700 rounded-lg text-xs">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl font-semibold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
                  >
                    <span>{submitting ? 'Submitting...' : 'Request Instant Callback'}</span>
                    <Send className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <p className="text-[10px] text-gray-500 text-center leading-tight">
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
