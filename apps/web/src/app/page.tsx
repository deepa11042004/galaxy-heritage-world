import React from 'react';
import { HeroBanner } from '@/components/home/HeroBanner';
import { DestinationShowcase } from '@/components/home/DestinationShowcase';
import { PackageCards } from '@/components/home/PackageCards';
import { ResortShowcase } from '@/components/home/ResortShowcase';
import { WhyChooseUs } from '@/components/home/WhyChooseUs';
import { DayActivitiesSection } from '@/components/home/DayActivitiesSection';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { FaqSection } from '@/components/home/FaqSection';
import { EnquiryFormSection } from '@/components/home/EnquiryFormSection';
import {
  getDestinations,
  getPackages,
  getHotels,
  getActivities,
  getFaqs,
  getTestimonials,
} from '@/lib/api';

export const revalidate = 60; // ISR cache every 60 seconds

export default async function HomePage() {
  // Fetch homepage data in parallel with safe fallbacks
  const [
    destinationsRes,
    packagesRes,
    hotelsRes,
    activitiesRes,
    faqsRes,
    testimonialsRes,
  ] = await Promise.allSettled([
    getDestinations(),
    getPackages(),
    getHotels({ limit: 6 }),
    getActivities(),
    getFaqs(),
    getTestimonials(),
  ]);

  const destinations =
    destinationsRes.status === 'fulfilled' ? destinationsRes.value.data || [] : [];
  const packages =
    packagesRes.status === 'fulfilled' ? packagesRes.value.data || [] : [];
  const hotels =
    hotelsRes.status === 'fulfilled' ? hotelsRes.value.data || [] : [];
  const activities =
    activitiesRes.status === 'fulfilled' ? activitiesRes.value.data || [] : [];
  const faqs =
    faqsRes.status === 'fulfilled' ? faqsRes.value.data || [] : [];
  const testimonials =
    testimonialsRes.status === 'fulfilled' ? testimonialsRes.value.data || [] : [];

  return (
    <div className="flex flex-col">
      <HeroBanner />
      <WhyChooseUs />
      <DestinationShowcase destinations={destinations} />
      <PackageCards packages={packages} />
      <ResortShowcase hotels={hotels} />
      <DayActivitiesSection activities={activities} />
      <TestimonialsSection testimonials={testimonials} />
      <FaqSection faqs={faqs} />
      <EnquiryFormSection />
    </div>
  );
}
