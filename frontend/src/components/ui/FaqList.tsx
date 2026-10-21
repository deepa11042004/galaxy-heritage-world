'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

/** Self-contained accordion using the site's accordion styles. */
export function FaqList({ items }: { items: { question: string; answer: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const isOpen = open === i;
        const panelId = `faq-item-${i}`;
        return (
          <div key={item.question} className="accordion-item" data-open={isOpen}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              aria-controls={panelId}
              className="accordion-trigger"
            >
              <span>{item.question}</span>
              <span className={cn('accordion-icon', isOpen && 'rotate-180')}>
                <ChevronDown />
              </span>
            </button>
            {isOpen && (
              <div id={panelId} className="accordion-panel">
                <p>{item.answer}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
