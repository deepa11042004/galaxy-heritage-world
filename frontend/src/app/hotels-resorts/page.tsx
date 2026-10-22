import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, MapPin, Palmtree, ArrowRight, Search } from 'lucide-react';
import { getHotels, getHotelFilters } from '@/lib/api';
import { PageHero } from '@/components/ui/PageHero';

export const metadata = {
  title: 'Hotels & 43+ Associated Resorts | Galaxy Heritage World',
  description:
    'Explore 43+ associated 4-star and 5-star partner resorts and internal properties across India and abroad with Galaxy Heritage World.',
};

export const revalidate = 60;

const PAGE_SIZE = 24;

type Search = { category?: string; type?: string; location?: string; q?: string; page?: string };

function buildHref(current: Search, patch: Search) {
  const merged: Search = { ...current, ...patch };
  const qs = new URLSearchParams();
  (Object.keys(merged) as (keyof Search)[]).forEach((k) => {
    if (merged[k]) qs.set(k, merged[k]!);
  });
  const str = qs.toString();
  return str ? `/hotels-resorts?${str}` : '/hotels-resorts';
}

export default async function HotelsResortsPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const sp = await searchParams;
  const { category, type, location, q } = sp;
  const page = Math.max(parseInt(sp.page || '1', 10) || 1, 1);

  const [res, filtersRes] = await Promise.all([
    getHotels({
      category,
      locationType: type,
      location,
      search: q,
      page,
      limit: PAGE_SIZE,
    }).catch(() => ({ data: [] as any[], total: 0, pages: 1 })),
    getHotelFilters().catch(() => ({ data: [] as any[] })),
  ]);
  const hotels = res.data || [];
  const total = (res as any).total ?? hotels.length;
  const pages = (res as any).pages ?? 1;
  const locations = (filtersRes.data || []).filter((l: any) => !type || l.locationType === type);

  return (
    <div>
      <PageHero
        image={{
          src: '/media/hero/hotels-header-poster.jpg',
          video: '/media/hero/hotels-header.mp4',
          alt: 'Beachfront hotels, palm trees and turquoise water',
          position: 'center 60%',
        }}
        meta={
          <span className="pill-glass">
            <Palmtree className="h-3.5 w-3.5" />
            Hospitality Network
          </span>
        }
        title={
          <>
            43+ Associated <span className="text-white/70">Resorts & Hotels</span>
          </>
        }
        subtitle="Every property in our network is audited for star-quality comfort, family-friendly amenities, scenic locations, and authentic hospitality."
      />

      {/* Resorts Grid */}
      <div className="container-page section">
        <div className="mb-10 space-y-3">
          {/* Category Switcher Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Link href={buildHref(sp, { category: '', page: '' })} data-active={!category} className="chip">
              All 43+ Resorts
            </Link>
            <Link
              href={buildHref(sp, { category: 'ASSOCIATED', page: '' })}
              data-active={category === 'ASSOCIATED'}
              className="chip"
            >
              Associated Partners
            </Link>
            <Link
              href={buildHref(sp, { category: 'INTERNAL', page: '' })}
              data-active={category === 'INTERNAL'}
              className="chip"
            >
              Internal Properties
            </Link>
          </div>

          {/* Domestic / International */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Link href={buildHref(sp, { type: '', location: '', page: '' })} data-active={!type} className="chip">
              All Locations
            </Link>
            <Link
              href={buildHref(sp, { type: 'DOMESTIC', location: '', page: '' })}
              data-active={type === 'DOMESTIC'}
              className="chip"
            >
              Domestic
            </Link>
            <Link
              href={buildHref(sp, { type: 'INTERNATIONAL', location: '', page: '' })}
              data-active={type === 'INTERNATIONAL'}
              className="chip"
            >
              International
            </Link>
          </div>

          {/* Location select + search (plain GET form) */}
          <form method="get" action="/hotels-resorts" className="mx-auto flex max-w-2xl flex-col gap-2 sm:flex-row">
            {category && <input type="hidden" name="category" value={category} />}
            {type && <input type="hidden" name="type" value={type} />}
            <select name="location" defaultValue={location || ''} aria-label="Filter by location" className="input sm:w-56">
              <option value="">All destinations</option>
              {locations.map((l: any) => (
                <option key={`${l.locationType}-${l.location}`} value={l.location}>
                  {l.location} ({l.count})
                </option>
              ))}
            </select>
            <div className="relative flex-1">
              <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-ink-subtle" />
              <input
                type="search"
                name="q"
                defaultValue={q || ''}
                placeholder="Search hotels..."
                aria-label="Search hotels"
                className="input w-full pl-10"
              />
            </div>
            <button type="submit" className="btn btn-dark">Search</button>
          </form>
        </div>

        <p className="mb-6 text-sm text-ink-muted">
          {total} {total === 1 ? 'property' : 'properties'} found
        </p>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {hotels.map((hotel: any, i: number) => (
            <React.Fragment key={hotel.id}>
              {(i === 0 || hotels[i - 1].locationName !== hotel.locationName) && (
                <h2 className="col-span-full mt-4 border-b border-line pb-2 text-lg font-semibold text-ink first:mt-0">
                  {hotel.locationName}
                  <span className="ml-2 text-xs font-medium text-ink-muted">{hotel.country}</span>
                </h2>
              )}
            <div className="card card-hover group flex flex-col p-2.5">
              <div className="media-frame aspect-[4/3] rounded-[0.9rem]">
                <Image
                  src={hotel.imageUrl || '/media/galaxy-heritage-world/homepage/images/3-2.png'}
                  alt={hotel.name}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  quality={90}
                />

                <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                  <span className="pill">
                    {hotel.category === 'ASSOCIATED' ? 'Associated Partner' : 'Luxury Internal'}
                  </span>

                  <span className="pill">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    <span>{hotel.ratingStars}.0</span>
                  </span>
                </div>
              </div>

              <div className="flex flex-1 flex-col justify-between px-2.5 pt-4 pb-2">
                <div>
                  <div className="meta mb-1.5">
                    <MapPin />
                    <span>{hotel.locationName}{hotel.state ? `, ${hotel.state}` : ''}</span>
                  </div>
                  <h3 className="text-xl font-semibold leading-snug tracking-tight text-ink">{hotel.name}</h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-muted">{hotel.description}</p>

                  {Array.isArray(hotel.amenities) && hotel.amenities.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {hotel.amenities.slice(0, 3).map((amenity: string, idx: number) => (
                        <span key={idx} className="pill-muted">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
                  <span className="text-xs font-medium text-ink-muted">Verified Quality Audited</span>
                  <Link href={`/hotels-resorts/${hotel.slug}`} className="link-arrow">
                    <span>View Property</span>
                    <ArrowRight />
                  </Link>
                </div>
              </div>
            </div>
            </React.Fragment>
          ))}
        </div>

        {hotels.length === 0 && (
          <div className="rounded-card bg-surface p-8 text-center text-sm text-ink-muted">
            No properties match these filters.
          </div>
        )}

        {pages > 1 && (
          <nav aria-label="Pagination" className="mt-10 flex items-center justify-center gap-3">
            {page > 1 && (
              <Link href={buildHref(sp, { page: String(page - 1) })} className="btn btn-outline btn-sm">
                Previous
              </Link>
            )}
            <span className="text-sm text-ink-muted">
              Page {page} of {pages}
            </span>
            {page < pages && (
              <Link href={buildHref(sp, { page: String(page + 1) })} className="btn btn-outline btn-sm">
                Next
              </Link>
            )}
          </nav>
        )}
      </div>
    </div>
  );
}
