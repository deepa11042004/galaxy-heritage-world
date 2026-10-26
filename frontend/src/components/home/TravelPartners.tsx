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

const ROW_ONE = PARTNERS.slice(0, 6);
const ROW_TWO = PARTNERS.slice(6);

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

        <div className="space-y-4 [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]">
          {[ROW_ONE, ROW_TWO].map((row, r) => (
            <div key={r} className="overflow-hidden">
              <div className={r === 0 ? 'animate-marquee' : 'animate-marquee-reverse'}>
                {/* The strip is rendered four times (two per half) so the -50% loop is seamless on wide screens; copies are hidden from screen readers */}
                {[0, 1, 2, 3].map((copy) => (
                  <ul key={copy} className="flex shrink-0 gap-4 pr-4" aria-hidden={copy > 0 || undefined}>
                    {row.map((p) => (
                      <li key={p.name} className="card flex h-24 w-44 shrink-0 items-center justify-center p-3 sm:h-28 sm:w-52">
                        <div className="relative h-full w-full">
                          <Image
                            src={`/media/partners/${p.logo}.png`}
                            alt={copy === 0 ? p.name : ''}
                            fill
                            className="object-contain"
                            sizes="208px"
                            quality={90}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
