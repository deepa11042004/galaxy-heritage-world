import React from 'react';
import Image from 'next/image';
import { Handshake } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';

const PARTNERS = [
  { name: 'Booking.com', logo: 'booking' },
  { name: 'Trivago', logo: 'trivago' },
  { name: 'EaseMyTrip', logo: 'easemytrip' },
  { name: 'Tripadvisor', logo: 'tripadvisor' },
  { name: 'MakeMyTrip', logo: 'makemytrip' },
  { name: 'Goibibo', logo: 'goibibo' },
  { name: 'Akasa Air', logo: 'akasa-air' },
  { name: 'SpiceJet', logo: 'spicejet' },
  { name: 'AirAsia', logo: 'airasia' },
  { name: 'Vistara', logo: 'vistara' },
  { name: 'Air India', logo: 'air-india' },
  { name: 'IndiGo', logo: 'indigo' },
];

export function TravelPartners() {
  return (
    <section className="section section-pattern">
      <div className="container-page">
        <SectionHeader
          align="center"
          className="mb-10"
          icon={Handshake}
          eyebrow="Trusted Partnerships"
          title={
            <>
              Our Global <span className="text-ink-muted">Travel Partners</span>
            </>
          }
          description="Our strong partnerships with leading travel, airline, and hospitality brands enable us to deliver reliable services and exceptional experiences at every step of your journey."
        />

        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 lg:gap-4">
          {PARTNERS.map((p) => (
            <li key={p.name} className="card flex items-center justify-center p-4">
              <div className="relative h-16 w-full sm:h-20">
                <Image
                  src={`/media/partners/${p.logo}.png`}
                  alt={p.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 16vw"
                  quality={90}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
