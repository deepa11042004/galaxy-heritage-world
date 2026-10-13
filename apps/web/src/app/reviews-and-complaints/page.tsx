'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  PhoneCall,
  Mail,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Send,
  Building,
  HelpCircle,
  ChevronDown,
} from 'lucide-react';
import { submitEnquiry } from '@/lib/api';

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
    badgeColor: 'bg-blue-100 text-blue-800',
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
    badgeColor: 'bg-amber-100 text-amber-800',
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
    badgeColor: 'bg-purple-100 text-purple-800',
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
    <div className="bg-[#FAF7F2] min-h-screen py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#D4AF37] mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Transparency & Accountability</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-gray-900 leading-tight">
            Customer Grievance & Escalation Matrix
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-3 leading-relaxed">
            At Galaxy Heritage World, we believe in 100% transparency. Our structured 3-tier grievance redressal system ensures your feedback and service concerns are resolved with documented turnaround times.
          </p>
        </div>

        {/* 3-Tier Escalation Matrix */}
        <div id="escalation" className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {escalationLevels.map((lvl, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${lvl.badgeColor}`}>
                    {lvl.level}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-gray-500">
                    <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>TAT: {lvl.tat}</span>
                  </div>
                </div>

                <h2 className="font-serif text-xl font-bold text-gray-900 mb-2 leading-snug">
                  {lvl.title}
                </h2>
                <p className="text-xs text-gray-600 leading-relaxed mb-6">
                  {lvl.description}
                </p>

                <div className="space-y-3 pt-4 border-t border-gray-100 text-xs">
                  {lvl.contacts.map((c, i) => (
                    <div key={i}>
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">
                        {c.label}
                      </span>
                      <strong className="text-gray-900 break-words">{c.value}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Grievance Submission Form */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-200 shadow-md mb-16">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Register a Grievance or Support Ticket
              </h2>
              <p className="text-xs sm:text-sm text-gray-600">
                Submit your query directly to our central compliance desk. Every submission receives an official reference code.
              </p>
            </div>

            {successRef ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-gray-900">
                  Grievance Ticket Registered
                </h3>
                <p className="text-sm text-gray-600">
                  Your official grievance ticket code is:
                </p>
                <div className="inline-block px-5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-mono font-bold text-base text-[#0B1320]">
                  {successRef}
                </div>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Our Level 1 Support Desk will review and initiate resolution within 24 to 48 hours.
                </p>
                <button
                  onClick={() => setSuccessRef(null)}
                  className="mt-4 px-6 py-2.5 bg-[#0B1320] text-white rounded-full text-xs font-semibold"
                >
                  Submit Another Note
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
                      placeholder="e.g. Suresh Kumar"
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
                      placeholder="e.g. suresh@example.com"
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
                      placeholder="e.g. Delhi, Noida"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Booking ID / Voucher Code (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. GHW-ENQ-12345 or Voucher Code"
                    value={formData.bookingRef}
                    onChange={(e) => setFormData({ ...formData, bookingRef: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Nature of Concern / Detailed Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe your issue or feedback in detail..."
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
                  className="w-full py-3.5 bg-[#0B1320] hover:bg-gray-800 text-white rounded-xl text-xs sm:text-sm font-semibold uppercase tracking-wider shadow transition-all flex items-center justify-center gap-2"
                >
                  <span>{submitting ? 'Registering Ticket...' : 'Register Formal Grievance'}</span>
                  <Send className="w-4 h-4 text-[#D4AF37]" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Complaints Board FAQs */}
        <div id="faqs" className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="font-serif text-2xl font-bold text-gray-900">
              Customer Complaint Resolution FAQs
            </h2>
            <p className="text-xs text-gray-600 mt-1">
              Common questions addressed by our Grievance Redressal Board.
            </p>
          </div>

          <div className="space-y-3">
            {grievanceFaqs.map((faq, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <h3 className="font-serif text-base font-bold text-gray-900 mb-2">
                  {faq.q}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
