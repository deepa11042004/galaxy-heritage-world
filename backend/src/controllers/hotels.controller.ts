import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database.js';
import { AppError } from '../middlewares/error.js';
import { HotelSchema } from '../shared/index.js';
import { HotelCategory } from '@prisma/client';

export async function getHotels(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { destinationId, category, featured, search, locationType, location, hotelType, stayType, page, limit, imported } = req.query;

    const where: any = { isPublished: true, deletedAt: null };

    if (destinationId) where.destinationId = String(destinationId);
    if (featured === 'true') where.featured = true;
    if (category) {
      if (category === 'ASSOCIATED') where.category = HotelCategory.ASSOCIATED;
      if (category === 'INTERNAL') where.category = HotelCategory.INTERNAL;
      if (category === 'EXCHANGE') where.category = HotelCategory.EXCHANGE;
    }

    // imported=true: only catalogue hotels (have a hotel code and photos)
    if (imported === 'true') {
      where.hotelCode = { not: null };
      where.imageUrl = { not: '' };
    }
    if (locationType === 'DOMESTIC' || locationType === 'INTERNATIONAL') where.locationType = locationType;
    if (typeof location === 'string' && location.trim()) where.locationName = location.trim();
    if (typeof hotelType === 'string' && /^[A-Z_]{2,30}$/.test(hotelType)) where.hotelType = hotelType;
    if (typeof stayType === 'string' && /^[a-z-]{2,40}$/.test(stayType)) where.stayTypes = { array_contains: stayType };

    if (typeof search === 'string' && search.trim()) {
      where.OR = [
        { name: { contains: search.trim() } },
        { locationName: { contains: search.trim() } },
        { state: { contains: search.trim() } },
        { description: { contains: search.trim() } },
      ];
    }

    // Pagination is opt-in so existing callers keep receiving the full list.
    const paged = page !== undefined || limit !== undefined;
    const take = paged ? Math.min(Math.max(parseInt(String(limit), 10) || 24, 1), 100) : undefined;
    const pageNo = paged ? Math.max(parseInt(String(page), 10) || 1, 1) : 1;

    const [total, hotels] = await Promise.all([
      prisma.hotel.count({ where }),
      prisma.hotel.findMany({
        where,
        orderBy: [{ featured: 'desc' }, { locationName: 'asc' }, { ratingStars: 'desc' }, { name: 'asc' }],
        ...(paged ? { skip: (pageNo - 1) * take!, take } : {}),
        include: {
          destination: { select: { id: true, name: true, slug: true, region: true } },
        },
      }),
    ]);

    const sanitizedHotels = hotels.map((h) => ({
      ...h,
      imageUrl: h.imageUrl
        ? h.imageUrl
            .replace('Neelam-goa.jpg', 'neelam-goa.jpg')
            .replace('Divan-Clarks-Inn-Goa.jpg', 'divan-clarks-inn-goa.jpg')
            .replace('Untitled-1024-x-674-px.png', 'untitled-1024-x-674-px.png')
        : h.imageUrl,
    }));

    res.json({
      success: true,
      count: sanitizedHotels.length,
      total,
      page: pageNo,
      pages: paged ? Math.max(Math.ceil(total / take!), 1) : 1,
      data: sanitizedHotels,
    });
  } catch (error) {
    next(error);
  }
}

/** Number of published properties per stay type, for the Stays page. */
export async function getStayTypeCounts(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const rows = await prisma.hotel.findMany({
      where: { isPublished: true, deletedAt: null },
      select: { stayTypes: true },
    });
    const counts: Record<string, number> = {};
    for (const r of rows) {
      if (!Array.isArray(r.stayTypes)) continue;
      for (const t of r.stayTypes as string[]) counts[t] = (counts[t] ?? 0) + 1;
    }
    res.json({ success: true, data: counts });
  } catch (error) {
    next(error);
  }
}

export async function getHotelFilters(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const rows = await prisma.hotel.groupBy({
      by: ['locationType', 'locationName', 'country'],
      where: { isPublished: true, deletedAt: null },
      _count: { _all: true },
      orderBy: { locationName: 'asc' },
    });
    const covers = await prisma.hotel.findMany({
      where: { isPublished: true, deletedAt: null, imageUrl: { not: '' } },
      select: { locationName: true, imageUrl: true },
      orderBy: [{ featured: 'desc' }, { ratingStars: 'desc' }, { name: 'asc' }],
    });
    const cover = new Map<string, string>();
    for (const c of covers) if (!cover.has(c.locationName)) cover.set(c.locationName, c.imageUrl);

    const normalizeUrl = (url: string | null | undefined): string | null => {
      if (!url) return null;
      return url
        .replace('Neelam-goa.jpg', 'neelam-goa.jpg')
        .replace('Divan-Clarks-Inn-Goa.jpg', 'divan-clarks-inn-goa.jpg')
        .replace('Untitled-1024-x-674-px.png', 'untitled-1024-x-674-px.png');
    };

    // City cards are managed in the admin panel (Destinations): a city whose destination is
    // unpublished or deleted is hidden, and the destination's cover image wins over the hotel photo.
    const managed = await prisma.destination.findMany({
      select: { name: true, heroImageUrl: true, isPublished: true, deletedAt: true },
    });
    const managedByName = new Map(managed.map((d) => [d.name.toLowerCase(), d]));

    res.json({
      success: true,
      data: rows
        .filter((r) => {
          const d = managedByName.get(r.locationName.toLowerCase());
          return !d || (d.isPublished && !d.deletedAt);
        })
        .map((r) => {
          const d = managedByName.get(r.locationName.toLowerCase());
          return {
            locationType: r.locationType,
            location: r.locationName,
            country: r.country,
            count: r._count._all,
            imageUrl: normalizeUrl(d?.heroImageUrl || cover.get(r.locationName)),
          };
        }),
    });
  } catch (error) {
    next(error);
  }
}

export async function getHotelBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { slug } = req.params;

    const hotel = await prisma.hotel.findFirst({
      where: { slug, isPublished: true, deletedAt: null },
      include: {
        destination: true,
      },
    });

    if (!hotel) {
      throw new AppError(`Hotel '${slug}' not found`, 404);
    }

    res.json({ success: true, data: hotel });
  } catch (error) {
    next(error);
  }
}

export async function createHotel(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = HotelSchema.parse(req.body);

    const hotel = await prisma.hotel.create({
      data: {
        ...data,
        category:
          data.category === 'INTERNAL'
            ? HotelCategory.INTERNAL
            : data.category === 'EXCHANGE'
            ? HotelCategory.EXCHANGE
            : HotelCategory.ASSOCIATED,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user?.id,
        action: 'CREATE_HOTEL',
        entityType: 'Hotel',
        entityId: hotel.id,
      },
    });

    res.status(201).json({ success: true, data: hotel });
  } catch (error) {
    next(error);
  }
}

export async function updateHotel(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const data = HotelSchema.partial().parse(req.body);

    const hotel = await prisma.hotel.update({
      where: { id },
      data: {
        ...data,
        category: data.category
          ? data.category === 'INTERNAL'
            ? HotelCategory.INTERNAL
            : data.category === 'EXCHANGE'
            ? HotelCategory.EXCHANGE
            : HotelCategory.ASSOCIATED
          : undefined,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user?.id,
        action: 'UPDATE_HOTEL',
        entityType: 'Hotel',
        entityId: hotel.id,
      },
    });

    res.json({ success: true, data: hotel });
  } catch (error) {
    next(error);
  }
}

export async function deleteHotel(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;

    await prisma.hotel.update({
      where: { id },
      data: { deletedAt: new Date(), isPublished: false },
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user?.id,
        action: 'DELETE_HOTEL',
        entityType: 'Hotel',
        entityId: id,
      },
    });

    res.json({ success: true, message: 'Hotel removed successfully' });
  } catch (error) {
    next(error);
  }
}
