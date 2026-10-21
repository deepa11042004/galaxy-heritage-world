import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, BedDouble, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { getHotels } from '@/lib/api';
import { getStayType, STAY_TYPES } from '@/lib/stays';
import { PageHero } from '@/components/ui/PageHero';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const revalidate = 60;

const PAGE_SIZE = 12;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const stay = getStayType(slug);
  if (!stay) return { title: 'Stay Not Found' };
  return {
    title: `${stay.name} | Stays | Galaxy Heritage World`,
    description: `Explore our curated selection of ${stay.name.toLowerCase()} (${stay.tagline.toLowerCase()}) tailored for your perfect getaway.`,
  };
}

export default async function StayCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const stay = getStayType(slug);
  if (!stay) notFound();

  const page = Math.max(parseInt((await searchParams).page ?? '1', 10) || 1, 1);
  const res = await getHotels({ stayType: slug, page, limit: PAGE_SIZE }).catch(() => null);
  const hotels: any[] = res?.data ?? [];
  const total = res?.total ?? hotels.length;
  const pages = res?.pages ?? 1;

  const others = STAY_TYPES.filter((s) => s.slug !== slug);

  return (
    <div>
      <PageHero
        icon={BedDouble}
        eyebrow={stay.tag}
        title={stay.name}
        subtitle={`Explore our curated selection of stunning ${stay.name.toLowerCase()} tailored for your perfect getaway.`}
      >
        <div className="mt-6 flex justify-center">
          <span className="pill-muted !px-4 !py-1.5 !text-xs">
            {total > 0 ? `${total} ${total === 1 ? 'Property' : 'Properties'} Available` : 'Coming soon'}
          </span>
        </div>
      </PageHero>

      <div className="container-page section">
        <Link href="/stays" className="mb-8 inline-flex items-center gap-1.5 text-xs font-semibold text-ink-muted hover:text-ink">
          <ArrowLeft className="size-3.5" /> All stays
        </Link>

        {hotels.length === 0 ? (
          <div className="card mx-auto max-w-2xl p-8 text-center sm:p-12">
            <h2 className="text-2xl font-medium tracking-tight text-ink">
              No {stay.name.toLowerCase()} listed <span className="text-ink-muted">just yet</span>
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted sm:text-base">
              We are adding new properties all the time. Tell our travel desk what you are looking for and we will arrange
              a {stay.name.toLowerCase().replace(/s$/, '')} stay for you.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Link href={`/contact?stay=${encodeURIComponent(stay.name)}`} className={buttonVariants({ size: 'lg' })}>
                <span>Enquire About {stay.name}</span>
                <ArrowRight />
              </Link>
              <Link href="/hotels-resorts" className={buttonVariants({ variant: 'outline', size: 'lg' })}>
                <span>Browse All Properties</span>
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {hotels.map((h) => (
                <Link key={h.id} href={`/hotels-resorts/${h.slug}`} className="card card-hover group flex flex-col p-2.5">
                  <div className="media-frame aspect-[4/3] rounded-[0.9rem]">
                    <Image
                      src={h.imageUrl || '/media/galaxy-heritage-world/homepage/images/3-2.png'}
                      alt={h.name}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      quality={90}
                    />
                  </div>
                  <div className="flex flex-1 flex-col px-2.5 pt-4 pb-2">
                    <div className="meta mb-1.5 tracking-wide uppercase">
                      <MapPin />
                      <span>
                        {h.locationName}
                        {h.country && h.country !== 'India' ? `, ${h.country}` : h.state ? `, ${h.state}` : ', India'}
                      </span>
                    </div>
                    <h2 className="text-xl font-semibold tracking-tight text-ink">{h.name}</h2>
                    <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-ink-muted">{h.description}</p>
                    <span className="link-arrow mt-4">
                      <span>View Property</span>
                      <ArrowRight />
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {pages > 1 && (
              <nav className="mt-10 flex items-center justify-between border-t border-line pt-6 text-sm" aria-label="Pagination">
                <span className="text-ink-muted">
                  Page {page} of {pages}
                </span>
                <div className="flex gap-2">
                  <Link
                    href={`/stays/${slug}?page=${page - 1}`}
                    aria-disabled={page <= 1}
                    className={cn('btn btn-outline btn-sm', page <= 1 && 'pointer-events-none opacity-40')}
                  >
                    <ChevronLeft /> Previous
                  </Link>
                  <Link
                    href={`/stays/${slug}?page=${page + 1}`}
                    aria-disabled={page >= pages}
                    className={cn('btn btn-outline btn-sm', page >= pages && 'pointer-events-none opacity-40')}
                  >
                    Next <ChevronRight />
                  </Link>
                </div>
              </nav>
            )}
          </>
        )}
      </div>

      <section className="container-page section section-plain">
        <h2 className="mb-6 text-2xl font-medium tracking-tight text-ink">
          More ways <span className="text-ink-muted">to stay</span>
        </h2>
        <div className="flex flex-wrap gap-2">
          {others.map((s) => (
            <Link key={s.slug} href={`/stays/${s.slug}`} className="chip">
              {s.name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
