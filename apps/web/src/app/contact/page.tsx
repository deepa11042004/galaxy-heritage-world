'use client';

import React, { useState } from 'react';
import {
  PhoneCall,
  Mail,
  MapPin,
  Clock,
  Building,
  ShieldCheck,
  Send,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { submitEnquiry } from '@/lib/api';

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
    <div className="bg-[#FAF7F2] min-h-screen py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#D4AF37] mb-2">
            <MapPin className="w-3.5 h-3.5" />
            <span>Connect With Us</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-gray-900 leading-tight">
            Contact Galaxy Heritage World
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-3 leading-relaxed">
            Reach out to our customer care desk, registered corporate headquarters, or travel concierge team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Office Coordinates & Credentials */}
          <div className="lg:col-span-5 space-y-6">
            {/* Toll Free Card */}
            <div className="bg-white p-8 rounded-3xl border border-[#D4AF37]/30 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#0B1320] text-[#D4AF37] flex items-center justify-center">
                <PhoneCall className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-gray-900">
                Toll-Free Assistance
              </h3>
              <p className="text-xs text-gray-600">
                Call us toll-free from any network across India for vacation planning, voucher verification, or resort reservations.
              </p>
              <a
                href="tel:18008436114"
                className="inline-block text-xl font-bold text-[#2563EB] hover:underline font-mono"
              >
                1800-843-6114
              </a>
              <div className="text-xs text-gray-500">
                Direct Line: <strong>+91 99990 01122</strong>
              </div>
            </div>

            {/* Registered Head Office */}
            <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
                <Building className="w-4 h-4" />
                <span>Registered Corporate HQ</span>
              </div>
              <h4 className="font-serif text-lg font-bold text-gray-900">
                GALAXY HERITAGE WORLD RESORTS PVT LTD
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Lower Ground, C-33, Ram Nagar, Kaushambi, Ghaziabad, Uttar Pradesh 201012
              </p>
              <div className="p-3 bg-[#FAF7F2] rounded-xl text-xs text-gray-700">
                <strong>Corporate CIN:</strong> U74999DL2022PTC407515
              </div>
            </div>

            {/* Email & Support Hours */}
            <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <Mail className="w-4 h-4 text-[#D4AF37]" />
                <span>Support Inboxes</span>
              </div>
              <div className="text-xs space-y-1.5">
                <div>
                  <span className="text-gray-500">Customer Support:</span>{' '}
                  <a href="mailto:info@galaxyheritageworld.com" className="font-semibold text-gray-900 hover:text-[#2563EB]">
                    info@galaxyheritageworld.com
                  </a>
                </div>
                <div>
                  <span className="text-gray-500">Grievance Desk:</span>{' '}
                  <a href="mailto:grievance@galaxyheritageworld.com" className="font-semibold text-gray-900 hover:text-[#2563EB]">
                    grievance@galaxyheritageworld.com
                  </a>
                </div>
                <div className="flex items-center gap-1.5 text-gray-500 pt-2 border-t border-gray-100">
                  <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Mon - Sat: 10:00 AM - 6:30 PM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-12 rounded-3xl shadow-md border border-gray-200">
            {successRef ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-gray-900">
                  Message Sent Successfully!
                </h3>
                <p className="text-sm text-gray-600">
                  Your reference enquiry number is:
                </p>
                <div className="inline-block px-5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-mono font-bold text-base text-[#0B1320]">
                  {successRef}
                </div>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Our team has recorded your message and will respond within business hours.
                </p>
                <button
                  onClick={() => setSuccessRef(null)}
                  className="mt-4 px-6 py-2.5 bg-[#0B1320] text-white rounded-full text-xs font-semibold"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="font-serif text-2xl font-bold text-gray-900 mb-1">
                  Send Us a Direct Message
                </h2>
                <p className="text-xs text-gray-500 mb-6">
                  Fill in the form below and our travel desk will reach out immediately.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Anjali Nair"
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
                      placeholder="e.g. anjali@example.com"
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
                      placeholder="e.g. Delhi, Noida, Bengaluru"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Subject / Query Type
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#D4AF37] bg-white"
                  >
                    <option value="General Holiday Query">General Holiday Query</option>
                    <option value="Resort Reservation Assistance">Resort Reservation Assistance</option>
                    <option value="Voucher Redemption Query">Voucher Redemption Query</option>
                    <option value="Corporate / Group Outing">Corporate / Group Outing</option>
                    <option value="Grievance / Feedback">Grievance / Feedback</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Your Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="How can we assist with your vacation plans?"
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
                  <span>{submitting ? 'Sending Message...' : 'Send Message to Travel Desk'}</span>
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
