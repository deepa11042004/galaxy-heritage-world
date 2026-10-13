'use client';

import React, { useState } from 'react';
import {
  Ticket,
  CheckCircle2,
  AlertCircle,
  PhoneCall,
  ShieldCheck,
  Send,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { submitVoucherRedemption } from '@/lib/api';

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
    <div className="bg-[#FAF7F2] min-h-screen py-12 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#D4AF37] mb-2">
            <Ticket className="w-3.5 h-3.5" />
            <span>Holiday Voucher Portal</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-gray-900 leading-tight">
            Redeem Your Holiday Voucher
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-3 leading-relaxed">
            Register your authorized Galaxy Heritage World vacation voucher code to initiate your resort reservation and travel verification.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-md border border-gray-200">
          {successRef ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-gray-900">
                Voucher Verification Request Registered!
              </h2>
              <p className="text-sm text-gray-600">
                Your redemption tracking reference is:
              </p>
              <div className="inline-block px-5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-mono font-bold text-base text-[#0B1320]">
                {successRef}
              </div>
              <p className="text-xs text-gray-500 max-w-md mx-auto">
                Our voucher verification desk is reviewing your details against our issuing records. You will receive an SMS and email confirmation within 24 to 48 hours.
              </p>
              <button
                onClick={() => setSuccessRef(null)}
                className="mt-4 px-6 py-2.5 bg-[#0B1320] text-white rounded-full text-xs font-semibold"
              >
                Redeem Another Voucher
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Voucher Code Special Field */}
              <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#D4AF37]/40 mb-6">
                <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-1">
                  Voucher / Coupon Code *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. GHW-PROMO-2026 or GHW-VIP-789"
                  value={formData.voucherCode}
                  onChange={(e) => setFormData({ ...formData, voucherCode: e.target.value.toUpperCase() })}
                  className="w-full px-4 py-3 text-sm font-mono font-bold uppercase tracking-wider border border-gray-300 rounded-xl bg-white focus:outline-none focus:border-[#D4AF37]"
                />
                <span className="text-[11px] text-gray-500 mt-1 block">
                  Found on your holiday certificate or welcome voucher letter.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Beneficiary Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Amit Verma"
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
                    placeholder="e.g. amit@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Mobile Number *
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
                    placeholder="e.g. Delhi, Jaipur, Chandigarh"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Preferred Destination *
                  </label>
                  <select
                    value={formData.preferredDestination}
                    onChange={(e) => setFormData({ ...formData, preferredDestination: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#D4AF37] bg-white"
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
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Tentative Travel Dates
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 15th to 18th December"
                    value={formData.preferredDates}
                    onChange={(e) => setFormData({ ...formData, preferredDates: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Additional Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Number of adults/children, special accommodation requests..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              {/* Guidelines / Terms */}
              <div className="p-4 bg-gray-50 rounded-2xl text-[11px] text-gray-600 space-y-1">
                <div className="font-semibold text-gray-800">Important Voucher Conditions:</div>
                <div>1. Voucher bookings must be registered at least 15 to 21 days prior to check-in.</div>
                <div>2. Stays are subject to room allotment at associated partner properties.</div>
                <div>3. Utility fees, applicable government taxes, or peak-season supplements apply as per policy.</div>
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
                <span>{submitting ? 'Registering Voucher...' : 'Submit Voucher for Verification'}</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
