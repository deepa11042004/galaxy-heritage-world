import React from 'react';
import { MessageSquareWarning } from 'lucide-react';
import { PageHero } from '@/components/ui/PageHero';

export const metadata = {
  title: 'GHW Reviews & Complaints | Galaxy Heritage World',
  description: 'How Galaxy Heritage World handles customer reviews and complaints: we listen, we improve.',
};

const POINTS: { title: string; text: string }[] = [
  {
    title: '1 – How Fake Complaints Can Adversely Affect the Reputation of Galaxy Heritage World',
    text: 'Such complaints are a waste of time for the company and the customer. False complaints can mislead customers and make them question whether their decision to purchase a holiday package was the right one. False complaints can impose undue stress and strain on company personnel. Whenever a complaint is lodged, it becomes incumbent upon the staff to conduct a thorough investigation and promptly resolve the issue to maintain guest satisfaction. However, in cases where the complaint is baseless or fabricated, this burdens the staff with unnecessary tasks, diverting their time and energy away from genuinely assisting other guests who are in legitimate need of their support. Still, these distractions fade away before the Galaxy Heritage World Commitment to excel at customer service.',
  },
  {
    title:
      '2 – To ensure that customers have a pleasant experience with their holiday packages, it is essential for them to be informed about potential fraudulent complaints.',
    text: 'The company is committed to taking all necessary steps to protect customers from rumors. We kindly ask all our valued Galaxy Heritage World Hospitality customers to refrain from giving credence to any negative rumors, including unfavorable Galaxy Heritage World reviews and complaints, that may be circulating among some individuals with the intent of misleading our cherished customers. We ensure the delivery of top-notch services and are always delighted to assist you in experiencing a stress-free vacation. Galaxy Heritage World Awareness Program keeps on educating the public in general on possible holiday fraud and scam.',
  },
  {
    title: '3 – Customers need to understand rumors terms Galaxy Heritage World Hospitality fraudulent or scam, spread by unknown.',
    text: 'Unknown sources have been circulating a spate of baseless rumors to tarnish Galaxy Heritage World’s reputation. Despite these unfounded attacks and diversions, the company is always focused on its unwavering customer-centric approach and has become a symbol of excellence in the hospitality sector, consistently outperforming its rivals. This has caused a noticeable disruption among the business competitors, who are concerned about Galaxy Heritage World’s resilience and continued success. Galaxy Heritage World keeps on auditing reviews and complaints and found that 93% of Galaxy Heritage World Complaints are fake or untraceable.',
  },
  {
    title: '4 – Is Galaxy Heritage World Fake or Real? Is Galaxy Heritage World Safe?',
    text: 'Headquartered in Ghaziabad, with units in Bengaluru, Hyderabad, Chennai, Kochi, Mumbai, Pune, Ahmedabad, Indore, Lucknow, Chandigarh, and Kolkata, Galaxy Heritage World has been serving its thousands of patrons with flawless vacations and memorable experiences since 2011. Galaxy Heritage World is your passport to happiness.',
  },
];

export default function ReviewsComplaintsPage() {
  return (
    <div>
      <PageHero
        tone="orange"
        icon={MessageSquareWarning}
        eyebrow="Reviews & Complaints"
        title={
          <>
            We Listen, <span className="text-ink/70">We Improve</span>
          </>
        }
      />

      <div className="container-narrow section">
        <div className="card prose-legal p-6 sm:p-12">
          <section>
            <h2>Are the negative reviews and complaints about Galaxy Heritage World possibly fabricated or inaccurate?</h2>
            <p>
              Galaxy Heritage World has consistently strived to deliver exceptional service to all our valued customers who choose to be a part of our hospitality experience.
            </p>
            <p>
              The company consistently exerts significant efforts to enhance its standing within the hospitality industry and is working on its Vision 2035 – Galaxy Heritage World as an Indian Unicorn in the next seven years. Nevertheless, some of our business rivals attempt to diminish our company’s reputation by posting fake reviews and submitting spurious consumer complaints on our company profile.
            </p>
            <p>
              Galaxy Heritage World diligently monitors every complaint and review submitted by our valued consumers through our dedicated social media and customer feedback team. If a complaint is confirmed to be genuine, our company is committed to quickly delivering a satisfactory resolution to our customer.
            </p>
          </section>

          {POINTS.map((p) => (
            <section key={p.title}>
              <h2>{p.title}</h2>
              <p>{p.text}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
