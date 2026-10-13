'use client';

import React from 'react';
import { Star, Quote, CheckCircle2 } from 'lucide-react';

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
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#D4AF37] mb-2">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Verified Customer Feedback</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
            Memories Made With Galaxy Heritage
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            Authentic experiences shared by our holiday members across India.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="luxury-card p-6 rounded-2xl bg-[#FAF7F2] border border-[#D4AF37]/20 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: item.rating || 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-[#D4AF37]/40" />
                </div>

                <p className="text-xs sm:text-sm text-gray-700 italic leading-relaxed mb-6">
                  &ldquo;{item.comment}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-gray-200/60 flex items-center justify-between">
                <div>
                  <h4 className="font-serif font-bold text-sm text-gray-900">
                    {item.customerName}
                  </h4>
                  <div className="text-[11px] text-gray-500">
                    {item.customerLocation || 'Member, India'}
                  </div>
                </div>

                {item.tripTitle && (
                  <span className="text-[10px] font-semibold px-2.5 py-1 bg-white text-[#0B1320] rounded-full border border-gray-200">
                    {item.tripTitle}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
