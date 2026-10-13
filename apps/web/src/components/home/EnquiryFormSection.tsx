'use client';

import React, { useState } from 'react';
import {
  Send,
  PhoneCall,
  Mail,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  MapPin,
  Calendar,
} from 'lucide-react';
import { submitEnquiry } from '@/lib/api';

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
    <section id="enquiry" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FAF7F2] rounded-3xl border border-[#D4AF37]/20 p-8 sm:p-12 lg:p-16 shadow-lg overflow-hidden relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Visual copy & Contact Details */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B1320] text-[#D4AF37] text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Dedicated Holiday Consultant</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
                Plan Your Bespoke Vacation With Us
              </h2>

              <p className="text-sm text-gray-600 leading-relaxed">
                Whether you are planning a relaxed family beach escape in Goa, a heritage tour across Rajasthan, or redeeming an authorized holiday voucher, our travel specialists are here to customize your complete itinerary.
              </p>

              <div className="space-y-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white text-[#0B1320] flex items-center justify-center shadow-sm border border-gray-200">
                    <PhoneCall className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-medium">Toll Free Support</div>
                    <a href="tel:18008436114" className="text-sm font-bold text-gray-900 hover:text-[#2563EB]">
                      1800-843-6114
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white text-[#0B1320] flex items-center justify-center shadow-sm border border-gray-200">
                    <Mail className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-medium">Customer Helpdesk</div>
                    <a href="mailto:info@galaxyheritageworld.com" className="text-sm font-bold text-gray-900 hover:text-[#2563EB]">
                      info@galaxyheritageworld.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white text-[#0B1320] flex items-center justify-center shadow-sm border border-gray-200">
                    <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-medium">Registered Office</div>
                    <span className="text-xs text-gray-800">
                      Ram Nagar, Kaushambi, Ghaziabad, UP 201012
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Lead Form */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-100">
              {successRef ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-gray-900">
                    Enquiry Submitted Successfully!
                  </h3>
                  <p className="text-sm text-gray-600 max-w-md mx-auto">
                    Your unique enquiry reference number is:
                  </p>
                  <div className="inline-block px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl font-mono font-bold text-base text-[#0B1320]">
                    {successRef}
                  </div>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto">
                    An automated acknowledgement has been logged. Our holiday desk expert will contact you within business hours.
                  </p>
                  <button
                    onClick={() => setSuccessRef(null)}
                    className="mt-6 px-6 py-2.5 bg-[#0B1320] text-white text-xs font-semibold rounded-full hover:bg-gray-800 transition-colors"
                  >
                    Send Another Request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="font-serif text-xl font-bold text-gray-900 mb-1">
                    Request a Customized Holiday Quote
                  </h3>
                  <p className="text-xs text-gray-500 mb-4">
                    Fill in your preferences below and our destination specialist will get back with confirmed options.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rahul Sharma"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. rahul@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
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
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        City of Residence *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Delhi, Noida, Mumbai"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Preferred Destination
                      </label>
                      <select
                        value={formData.destinationInterest}
                        onChange={(e) => setFormData({ ...formData, destinationInterest: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#D4AF37] bg-white"
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
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Age Group
                      </label>
                      <select
                        value={formData.ageGroup}
                        onChange={(e) => setFormData({ ...formData, ageGroup: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#D4AF37] bg-white"
                      >
                        <option value="21-30">21 - 30 Years</option>
                        <option value="31-45">31 - 45 Years</option>
                        <option value="46-60">46 - 60 Years</option>
                        <option value="60+">60+ Years (Senior Travel)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Travel Requirements or Special Requests
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Traveling with family, 2 kids, preferred dates next month..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                    />
                  </div>

                  <div className="flex items-start gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="consent"
                      required
                      checked={formData.consent}
                      onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-[#2563EB] focus:ring-[#2563EB]"
                    />
                    <label htmlFor="consent" className="text-[11px] text-gray-600 leading-tight">
                      I authorize Galaxy Heritage World to contact me regarding my holiday enquiry via phone, WhatsApp, or email.
                    </label>
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
                    className="w-full py-3.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl text-xs sm:text-sm font-semibold uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
                  >
                    <span>{submitting ? 'Submitting Enquiry...' : 'Get Custom Quote & Call'}</span>
                    <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
