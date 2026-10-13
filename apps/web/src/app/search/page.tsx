'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import {
  Search as SearchIcon,
  MapPin,
  Clock,
  Star,
  ArrowRight,
  Compass,
  Palmtree,
  Sun,
} from 'lucide-react';
import { searchContent } from '@/lib/api';

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{
    destinations: any[];
    packages: any[];
    hotels: any[];
    itineraries: any[];
    activities: any[];
  }>({
    destinations: [],
    packages: [],
    hotels: [],
    itineraries: [],
    activities: [],
  });

  const performSearch = (q: string) => {
    if (!q || q.length < 2) return;
    setLoading(true);
    searchContent(q)
      .then((res) => {
        if (res.data) setResults(res.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
  };

  const totalCount =
    results.destinations.length +
    results.packages.length +
    results.hotels.length +
    results.itineraries.length +
    results.activities.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Search Bar Header */}
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          Search Vacation Experiences
        </h1>

        <form onSubmit={handleSearchSubmit} className="relative mt-6">
          <SearchIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by destination, resort, package name, or state (e.g., Goa, Manali)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-28 py-3.5 bg-white text-sm rounded-full border border-gray-300 shadow-md focus:outline-none focus:border-[#D4AF37]"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-full text-xs font-semibold uppercase tracking-wider transition-colors"
          >
            Search
          </button>
        </form>

        {query && (
          <p className="text-xs text-gray-500 mt-3">
            {loading ? 'Searching...' : `Found ${totalCount} results for "${query}"`}
          </p>
        )}
      </div>

      {/* Results Sections */}
      <div className="space-y-12">
        {/* Destinations */}
        {results.destinations.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Compass className="w-5 h-5 text-[#D4AF37]" />
              <h2 className="font-serif text-2xl font-bold text-gray-900">
                Destinations ({results.destinations.length})
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {results.destinations.map((d) => (
                <Link
                  key={d.id}
                  href={`/destinations/${d.slug}`}
                  className="luxury-card rounded-2xl overflow-hidden block bg-white shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="relative h-44 w-full">
                    <Image
                      src={d.heroImageUrl || '/media/galaxy-heritage-world/destinations/images/1-1.png'}
                      alt={d.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                      sizes="(max-width: 768px) 100vw, 384px"
                    />
                  </div>
                  <div className="p-4">
                    <div className="text-[11px] text-[#D4AF37] font-semibold">{d.region}</div>
                    <h3 className="font-serif text-lg font-bold text-gray-900 group-hover:text-[#2563EB] transition-colors">
                      {d.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Packages */}
        {results.packages.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Clock className="w-5 h-5 text-[#D4AF37]" />
              <h2 className="font-serif text-2xl font-bold text-gray-900">
                Vacation Packages ({results.packages.length})
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {results.packages.map((pkg) => (
                <Link
                  key={pkg.id}
                  href={`/vacation-packages/${pkg.slug}`}
                  className="luxury-card rounded-2xl overflow-hidden block bg-white shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="relative h-44 w-full">
                    <Image
                      src={pkg.heroImageUrl || '/media/galaxy-heritage-world/homepage/images/2-1.png'}
                      alt={pkg.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                      sizes="(max-width: 768px) 100vw, 384px"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#0B1320]/80 text-[#D4AF37]">
                      {pkg.durationDays}D / {pkg.durationNights}N
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="text-[11px] text-gray-500">{pkg.locationLabel}</div>
                    <h3 className="font-serif text-base font-bold text-gray-900 group-hover:text-[#2563EB] transition-colors">
                      {pkg.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Hotels */}
        {results.hotels.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Palmtree className="w-5 h-5 text-[#D4AF37]" />
              <h2 className="font-serif text-2xl font-bold text-gray-900">
                Associated Resorts & Hotels ({results.hotels.length})
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {results.hotels.map((h) => (
                <Link
                  key={h.id}
                  href={`/hotels-resorts/${h.slug}`}
                  className="luxury-card rounded-2xl overflow-hidden block bg-white shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="relative h-44 w-full">
                    <Image
                      src={h.imageUrl || '/media/galaxy-heritage-world/homepage/images/3-2.png'}
                      alt={h.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                      sizes="(max-width: 768px) 100vw, 384px"
                    />
                    <div className="absolute top-2 right-2 flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/60 text-amber-400">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>{h.ratingStars}.0</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="text-[11px] text-gray-500">{h.locationName}</div>
                    <h3 className="font-serif text-base font-bold text-gray-900 group-hover:text-[#2563EB] transition-colors">
                      {h.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Activities */}
        {results.activities.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Sun className="w-5 h-5 text-[#D4AF37]" />
              <h2 className="font-serif text-2xl font-bold text-gray-900">
                Day Picnics & Outings ({results.activities.length})
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {results.activities.map((a) => (
                <Link
                  key={a.id}
                  href={`/day-activities/${a.slug}`}
                  className="luxury-card rounded-2xl overflow-hidden block bg-white shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="relative h-44 w-full">
                    <Image
                      src={a.imageUrl || '/media/galaxy-heritage-world/day-activities/images/madhavgarh.webp'}
                      alt={a.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                      sizes="(max-width: 768px) 100vw, 384px"
                    />
                  </div>
                  <div className="p-4">
                    <div className="text-[11px] text-[#D4AF37] font-semibold">{a.category}</div>
                    <h3 className="font-serif text-base font-bold text-gray-900 group-hover:text-[#2563EB] transition-colors">
                      {a.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && query && totalCount === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 max-w-xl mx-auto space-y-3">
            <SearchIcon className="w-8 h-8 text-gray-400 mx-auto" />
            <h3 className="font-serif text-xl font-bold text-gray-900">
              No Results Found for &ldquo;{query}&rdquo;
            </h3>
            <p className="text-xs text-gray-500">
              Try searching with popular keywords like &ldquo;Goa&rdquo;, &ldquo;Rajasthan&rdquo;, &ldquo;Manali&rdquo;, or &ldquo;Resort&rdquo;.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="bg-[#FAF7F2] min-h-screen py-12 sm:py-20">
      <Suspense
        fallback={
          <div className="max-w-7xl mx-auto px-4 text-center py-20 text-xs text-gray-500">
            Loading search...
          </div>
        }
      >
        <SearchContent />
      </Suspense>
    </div>
  );
}
