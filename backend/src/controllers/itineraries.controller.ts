import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database.js';
import { AppError } from '../middlewares/error.js';
import { ItinerarySchema } from '../shared/index.js';

export async function getItineraries(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { destinationId, featured, search } = req.query;

    const where: any = { isPublished: true, deletedAt: null };

    if (destinationId) where.destinationId = String(destinationId);
    if (featured === 'true') where.featured = true;

    if (typeof search === 'string' && search.trim()) {
      where.OR = [
        { title: { contains: search.trim() } },
        { locationLabel: { contains: search.trim() } },
        { summary: { contains: search.trim() } },
      ];
    }

    const itineraries = await prisma.itinerary.findMany({
      where,
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
      include: {
        destination: { select: { id: true, name: true, slug: true, region: true } },
        days: { orderBy: { dayNumber: 'asc' } },
      },
    });

    res.json({ success: true, count: itineraries.length, data: itineraries });
  } catch (error) {
    next(error);
  }
}

export async function getItineraryBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { slug } = req.params;

    const itinerary = await prisma.itinerary.findFirst({
      where: { slug, isPublished: true, deletedAt: null },
      include: {
        destination: true,
        days: { orderBy: { dayNumber: 'asc' } },
      },
    });

    if (!itinerary) {
      throw new AppError(`Itinerary '${slug}' not found`, 404);
    }

    res.json({ success: true, data: itinerary });
  } catch (error) {
    next(error);
  }
}

export async function createItinerary(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { days, ...data } = ItinerarySchema.parse(req.body);

    const itinerary = await prisma.itinerary.create({
      data: {
        ...data,
        days: {
          create: days.map((d, i) => ({
            dayNumber: d.dayNumber ?? i + 1,
            title: d.title,
            description: d.description,
            meals: d.meals,
            stayLocation: d.stayLocation,
          })),
        },
      },
      include: { days: true },
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user?.id,
        action: 'CREATE_ITINERARY',
        entityType: 'Itinerary',
        entityId: itinerary.id,
      },
    });

    res.status(201).json({ success: true, data: itinerary });
  } catch (error) {
    next(error);
  }
}

export async function updateItinerary(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const { days, ...data } = ItinerarySchema.partial().parse(req.body);

    const itinerary = await prisma.itinerary.update({
      where: { id },
      data,
      include: { days: true },
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user?.id,
        action: 'UPDATE_ITINERARY',
        entityType: 'Itinerary',
        entityId: itinerary.id,
      },
    });

    res.json({ success: true, data: itinerary });
  } catch (error) {
    next(error);
  }
}

export async function deleteItinerary(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;

    await prisma.itinerary.update({
      where: { id },
      data: { deletedAt: new Date(), isPublished: false },
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user?.id,
        action: 'DELETE_ITINERARY',
        entityType: 'Itinerary',
        entityId: id,
      },
    });

    res.json({ success: true, message: 'Itinerary removed successfully' });
  } catch (error) {
    next(error);
  }
}
