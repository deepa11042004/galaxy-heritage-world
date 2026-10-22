'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, HelpCircle, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { buttonVariants } from '@/components/ui/button';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export function FaqSection({ faqs }: { faqs: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section
      className="section bg-white bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/media/hero/section-pattern.jpg')" }}
    >
      <div className="container-page">
        <SectionHeader
          icon={HelpCircle}
          eyebrow="Got Questions?"
          title={
            <>
              Frequently Asked <span className="text-ink-muted">Questions</span>
            </>
          }
          description="Clear, transparent answers to questions regarding your holiday bookings, memberships, and resort stays."
        />

        <div className="space-y-3">
          {faqs.slice(0, 6).map((faq, idx) => {
            const isOpen = openIndex === idx;
            const panelId = `home-faq-${faq.id}`;
            return (
              <div key={faq.id} className="accordion-item" data-open={isOpen}>
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
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
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link href="/faq" className={cn(buttonVariants({ variant: 'dark' }), 'whitespace-normal text-center')}>
            <span>View All Customer FAQs & Redressal Procedures</span>
            <ArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
}
