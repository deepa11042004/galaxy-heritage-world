'use client';

import React from 'react';
import { Star, Quote, CheckCircle2 } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';

interface TestimonialItem {
  id: string;
  customerName: string;
  customerLocation?: string | null;
  rating: number;
  comment: string;
  tripTitle?: string | null;
}

export function TestimonialsSection({ testimonials }: { testimonials: TestimonialItem[] }) {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="section bg-white">
      <div className="container-page">
        <SectionHeader
          icon={CheckCircle2}
          eyebrow="Verified Customer Feedback"
          title={
            <>
              Memories Made With <span className="text-ink-muted">Galaxy Heritage</span>
            </>
          }
          description="Authentic experiences shared by our holiday members across India."
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:gap-5">
          {testimonials.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-between rounded-card bg-divider p-7 transition-transform duration-300 hover:-translate-y-1 sm:p-8"
            >
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <Quote className="h-8 w-8 fill-white text-white" />
                  <div className="flex items-center gap-0.5 text-ink">
                    {Array.from({ length: item.rating || 5 }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-ink" />
                    ))}
                  </div>
                </div>

                <p className="text-[15px] leading-relaxed text-ink sm:text-base">
                  &ldquo;{item.comment}&rdquo;
                </p>
              </div>

              <div className="mt-8 flex flex-wrap items-end justify-between gap-3 border-t border-ink/15 pt-5">
                <div>
                  <h4 className="text-sm font-semibold text-ink">{item.customerName}</h4>
                  <div className="text-xs text-ink/70">{item.customerLocation || 'Member, India'}</div>
                </div>

                {item.tripTitle && (
                  <span className="pill whitespace-nowrap border border-line text-[10px]">{item.tripTitle}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
