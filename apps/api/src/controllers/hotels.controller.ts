import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database.js';
import { AppError } from '../middlewares/error.js';
import { HotelSchema } from '@ghw/shared';
import { HotelCategory } from '@prisma/client';

export async function getHotels(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { destinationId, category, featured, search } = req.query;

    const where: any = { isPublished: true, deletedAt: null };

    if (destinationId) where.destinationId = String(destinationId);
    if (featured === 'true') where.featured = true;
    if (category) {
      if (category === 'ASSOCIATED') where.category = HotelCategory.ASSOCIATED;
      if (category === 'INTERNAL') where.category = HotelCategory.INTERNAL;
      if (category === 'EXCHANGE') where.category = HotelCategory.EXCHANGE;
    }

    if (typeof search === 'string' && search.trim()) {
      where.OR = [
        { name: { contains: search.trim() } },
        { locationName: { contains: search.trim() } },
        { state: { contains: search.trim() } },
        { description: { contains: search.trim() } },
      ];
    }

    const hotels = await prisma.hotel.findMany({
      where,
      orderBy: [{ featured: 'desc' }, { ratingStars: 'desc' }, { name: 'asc' }],
      include: {
        destination: { select: { id: true, name: true, slug: true, region: true } },
      },
    });

    res.json({ success: true, count: hotels.length, data: hotels });
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
