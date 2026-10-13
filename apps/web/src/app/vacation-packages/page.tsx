import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, MapPin, Check, ArrowRight, Sparkles } from 'lucide-react';
import { getPackages } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

export const metadata = {
  title: 'Vacation Packages | Galaxy Heritage World',
  description:
    'Browse luxury holiday packages across Goa, Rajasthan, Himachal Pradesh, Uttarakhand, and South India with verified resort stays.',
};

export const revalidate = 60;

export default async function VacationPackagesPage() {
  const res = await getPackages().catch(() => ({ data: [] }));
  const packages = res.data || [];

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#D4AF37] mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tailored Itineraries</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-gray-900 leading-tight">
            Vacation Packages & Tours
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-3 leading-relaxed">
            All-inclusive holiday experiences featuring luxury associated resort stays, delicious breakfasts, curated sightseeing, and on-ground assistance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg: any) => (
            <div
              key={pkg.id}
              className="luxury-card rounded-2xl overflow-hidden flex flex-col justify-between group shadow-sm hover:shadow-xl transition-all duration-300 bg-white"
            >
              <div className="relative h-60 w-full overflow-hidden">
                <Image
                  src={pkg.heroImageUrl || '/media/galaxy-heritage-world/homepage/images/2-1.png'}
                  alt={pkg.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />

                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#0B1320]/80 backdrop-blur-md text-[#D4AF37]">
                    {pkg.durationDays} Days / {pkg.durationNights} Nights
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="flex items-center gap-1.5 text-xs text-gray-200">
                    <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{pkg.locationLabel}</span>
                  </div>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="font-serif text-xl font-bold text-gray-900 group-hover:text-[#2563EB] transition-colors leading-snug mb-2">
                    {pkg.title}
                  </h2>
                  <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed mb-4">
                    {pkg.overview}
                  </p>

                  {Array.isArray(pkg.inclusions) && pkg.inclusions.length > 0 && (
                    <div className="space-y-1.5 mb-6">
                      {pkg.inclusions.slice(0, 3).map((inc: string, i: number) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-gray-600">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate">{inc}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-gray-400">
                      Starting From
                    </div>
                    <div className="text-base font-bold text-[#0B1320]">
                      {pkg.priceStarting
                        ? formatCurrency(Number(pkg.priceStarting))
                        : pkg.priceLabel || 'Price on Request'}
                    </div>
                  </div>

                  <Link
                    href={`/vacation-packages/${pkg.slug}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold rounded-full shadow transition-colors"
                  >
                    <span>View Tour</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
