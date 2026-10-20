'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { HelpCircle, ChevronDown, Search, PhoneCall, ShieldCheck } from 'lucide-react';
import { getFaqs } from '@/lib/api';
import { cn } from '@/lib/utils';
import { PageHero } from '@/components/ui/PageHero';
import { buttonVariants } from '@/components/ui/button';

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
    <div>
      {/* Header */}
      <PageHero
        icon={HelpCircle}
        eyebrow="Help Center"
        title={
          <>
            Frequently Asked <span className="text-ink-muted">Questions</span>
          </>
        }
        subtitle="Find immediate answers regarding resort check-in, voucher conditions, booking timeframes, and customer support."
      >
        <div className="mx-auto max-w-2xl">
          {/* Search bar */}
          <div className="relative mt-8">
            <Search className="absolute top-1/2 left-5 h-5 w-5 -translate-y-1/2 text-ink-subtle" />
            <input
              type="text"
              placeholder="Search by topic, e.g. vouchers, check-in, refund, Goa..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-full border border-line bg-white py-4 pr-5 pl-13 text-sm text-ink transition-shadow placeholder:text-ink-subtle focus:border-ink/30 focus:ring-4 focus:ring-accent/35 focus:outline-none"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                data-active={selectedCategory === cat}
                className="chip"
              >
                {cat === 'ALL' ? 'All Questions' : cat}
              </button>
            ))}
          </div>
        </div>
      </PageHero>

      <div className="container-narrow section">
        {/* FAQs Accordion */}
        <div className="mb-16 space-y-3">
          {loading ? (
            <div className="py-12 text-center text-sm text-ink-muted">Loading questions...</div>
          ) : filtered.length > 0 ? (
            filtered.map((faq, idx) => {
              const isOpen = openIndex === idx;
              const panelId = `faq-panel-${faq.id}`;
              return (
                <div key={faq.id} className="accordion-item" data-open={isOpen}>
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="accordion-trigger"
                  >
                    <span>{faq.question}</span>
                    <span className={cn('accordion-icon', isOpen && 'rotate-180')}>
                      <ChevronDown />
                    </span>
                  </button>

                  {isOpen && (
                    <div id={panelId} className="accordion-panel">
                      <p>{faq.answer}</p>
                      <div className="pill-muted mt-4">Category: {faq.category}</div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="rounded-card bg-surface p-8 text-center text-sm text-ink-muted">
              No questions found matching your search. Try another keyword or call our desk.
            </div>
          )}
        </div>

        {/* Still Have Questions Banner */}
        <div className="flex flex-col items-center rounded-hero bg-ink px-6 py-12 text-center text-white sm:px-12">
          <h2 className="heading-section mb-3 text-white">Still Have Questions?</h2>
          <p className="mb-8 max-w-md text-sm text-white/70">
            Our customer assistance and travel desk team is available Monday to Saturday to clarify any questions.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="tel:18008436114" className={buttonVariants()}>
              <PhoneCall />
              <span>Call Toll Free: 1800-843-6114</span>
            </a>
            <Link href="/reviews-and-complaints" className={buttonVariants({ variant: 'ghostLight' })}>
              <ShieldCheck className="text-accent" />
              <span>Escalation Matrix</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
