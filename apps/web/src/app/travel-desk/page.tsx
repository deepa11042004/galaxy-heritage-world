'use client';

import React, { useState } from 'react';
import {
  PhoneCall,
  MessageCircle,
  Clock,
  Compass,
  Palmtree,
  Calendar,
  Send,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Headphones,
} from 'lucide-react';
import { submitEnquiry } from '@/lib/api';

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
    <div className="bg-[#FAF7F2] min-h-screen py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#D4AF37] mb-2">
            <Headphones className="w-3.5 h-3.5" />
            <span>Personal Vacation Concierge</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-gray-900 leading-tight">
            Galaxy Heritage World Travel Desk
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-3 leading-relaxed">
            Your single point of contact for customized itinerary design, associated resort bookings, voucher claims, and 24/7 on-trip support.
          </p>
        </div>

        {/* Quick Contact Banners */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="p-8 bg-white rounded-3xl border border-[#D4AF37]/30 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#0B1320] text-[#D4AF37] flex items-center justify-center mb-4">
                <PhoneCall className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-gray-900 mb-1">
                Toll-Free Helpline
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                Instant priority phone consultation with a travel desk officer.
              </p>
            </div>
            <a
              href="tel:18008436114"
              className="inline-flex items-center justify-center py-3 px-4 bg-[#0B1320] hover:bg-[#1a2538] text-white rounded-xl text-xs font-bold transition-colors"
            >
              Call 1800-843-6114
            </a>
          </div>

          <div className="p-8 bg-white rounded-3xl border border-emerald-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mb-4">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-gray-900 mb-1">
                WhatsApp Concierge
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                Chat with our desk for quick voucher queries and photos.
              </p>
            </div>
            <a
              href="https://wa.me/919999001122?text=Hello%20Galaxy%20Heritage%20World%20Travel%20Desk"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors"
            >
              Start WhatsApp Chat
            </a>
          </div>

          <div className="p-8 bg-white rounded-3xl border border-blue-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-gray-900 mb-1">
                Desk Working Hours
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                Monday to Saturday: 10:00 AM - 6:30 PM IST (Emergency helpline 24/7 on-trip).
              </p>
            </div>
            <div className="text-xs font-semibold text-gray-700 p-2.5 bg-[#FAF7F2] rounded-xl text-center">
              Active & Receiving Calls
            </div>
          </div>
        </div>

        {/* Travel Desk Form */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-200 shadow-md">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-2">
              Submit a Travel Desk Request
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 text-center mb-8">
              Let us know your destination, travel window, and member details. An expert consultant will call back with customized options.
            </p>

            {successRef ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-gray-900">
                  Request Received by Travel Desk!
                </h3>
                <p className="text-sm text-gray-600">
                  Reference Code: <strong className="font-mono text-[#0B1320]">{successRef}</strong>
                </p>
                <p className="text-xs text-gray-500">
                  Our coordinator will call back shortly on your contact number.
                </p>
                <button
                  onClick={() => setSuccessRef(null)}
                  className="mt-4 px-6 py-2.5 bg-[#0B1320] text-white rounded-full text-xs font-semibold"
                >
                  Submit Another Query
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vikram Malhotra"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. vikram@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      City of Residence *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Delhi, Gurgaon, Lucknow"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Destination of Interest
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Goa, Manali, Kerala, Dubai"
                      value={formData.destinationInterest}
                      onChange={(e) => setFormData({ ...formData, destinationInterest: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Preferred Dates / Month
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Next month weekend, Mid-November"
                      value={formData.travelDates}
                      onChange={(e) => setFormData({ ...formData, travelDates: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Specific Requests / Voucher Number
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Provide any voucher details or travel preferences..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-3 bg-rose-50 text-rose-700 rounded-xl text-xs">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl text-xs sm:text-sm font-semibold uppercase tracking-wider shadow transition-all flex items-center justify-center gap-2"
                >
                  <span>{submitting ? 'Submitting to Desk...' : 'Submit Travel Desk Request'}</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
