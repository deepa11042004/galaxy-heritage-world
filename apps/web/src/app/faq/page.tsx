'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  HelpCircle,
  ChevronDown,
  Search,
  PhoneCall,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { getFaqs } from '@/lib/api';

export default function FaqPage() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useEffect(() => {
    getFaqs()
      .then((res) => {
        setFaqs(res.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const categories = ['ALL', ...Array.from(new Set(faqs.map((f) => f.category)))];

  const filtered = faqs.filter((f) => {
    const matchesCategory =
      selectedCategory === 'ALL' || f.category === selectedCategory;
    const matchesSearch =
      !search ||
      f.question.toLowerCase().includes(search.toLowerCase()) ||
      f.answer.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-12 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#D4AF37] mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Help Center</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-gray-900 leading-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-3 leading-relaxed">
            Find immediate answers regarding resort check-in, voucher conditions, booking timeframes, and customer support.
          </p>

          {/* Search bar */}
          <div className="relative mt-8">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by topic, e.g. vouchers, check-in, refund, Goa..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-white text-sm rounded-full border border-gray-200 shadow-sm focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#0B1320] text-white shadow'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {cat === 'ALL' ? 'All Questions' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* FAQs Accordion */}
        <div className="space-y-3 mb-16">
          {loading ? (
            <div className="text-center py-12 text-sm text-gray-500">
              Loading questions...
            </div>
          ) : filtered.length > 0 ? (
            filtered.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={faq.id}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm transition-all duration-200"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full text-left px-6 py-4.5 flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-gray-900 hover:text-[#2563EB] transition-colors"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#2563EB]' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100 animate-in fade-in duration-200">
                      <p>{faq.answer}</p>
                      <div className="mt-3 text-[10px] font-bold uppercase tracking-wider text-[#D4AF37]">
                        Category: {faq.category}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-2xl p-8 text-center text-sm text-gray-500">
              No questions found matching your search. Try another keyword or call our desk.
            </div>
          )}
        </div>

        {/* Still Have Questions Banner */}
        <div className="bg-[#0B1320] text-white rounded-3xl p-8 sm:p-12 text-center flex flex-col items-center">
          <h2 className="font-serif text-2xl font-bold text-white mb-2">
            Still Have Questions?
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 max-w-md mb-6">
            Our customer assistance and travel desk team is available Monday to Saturday to clarify any questions.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="tel:18008436114"
              className="px-6 py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-full text-xs font-semibold flex items-center gap-2 shadow"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call Toll Free: 1800-843-6114</span>
            </a>
            <Link
              href="/reviews-and-complaints"
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full text-xs font-semibold flex items-center gap-2 border border-white/20"
            >
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              <span>Escalation Matrix</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
