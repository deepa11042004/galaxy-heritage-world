import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database.js';
import { AppError } from '../middlewares/error.js';
import { DestinationSchema } from '@ghw/shared';
import { DestinationType } from '@prisma/client';

export async function getDestinations(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { type, featured, search } = req.query;

    const where: any = { isPublished: true, deletedAt: null };

    if (type === 'DOMESTIC') where.type = DestinationType.DOMESTIC;
    if (type === 'INTERNATIONAL') where.type = DestinationType.INTERNATIONAL;
    if (featured === 'true') where.featured = true;

    if (typeof search === 'string' && search.trim()) {
      where.OR = [
        { name: { contains: search.trim() } },
        { region: { contains: search.trim() } },
        { description: { contains: search.trim() } },
      ];
    }

    const destinations = await prisma.destination.findMany({
      where,
      orderBy: [{ featured: 'desc' }, { name: 'asc' }],
      include: {
        _count: {
          select: { hotels: true, packages: true, itineraries: true },
        },
      },
    });

    res.json({ success: true, count: destinations.length, data: destinations });
  } catch (error) {
    next(error);
  }
}

export async function getDestinationBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { slug } = req.params;

    const destination = await prisma.destination.findFirst({
      where: { slug, isPublished: true, deletedAt: null },
      include: {
        hotels: { where: { isPublished: true } },
        packages: { where: { isPublished: true } },
        itineraries: { where: { isPublished: true }, include: { days: true } },
      },
    });

    if (!destination) {
      throw new AppError(`Destination '${slug}' not found`, 404);
    }

    res.json({ success: true, data: destination });
  } catch (error) {
    next(error);
  }
}

export async function createDestination(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = DestinationSchema.parse(req.body);

    const destination = await prisma.destination.create({
      data: {
        ...data,
        type: data.type === 'INTERNATIONAL' ? DestinationType.INTERNATIONAL : DestinationType.DOMESTIC,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user?.id,
        action: 'CREATE_DESTINATION',
        entityType: 'Destination',
        entityId: destination.id,
      },
    });

    res.status(201).json({ success: true, data: destination });
  } catch (error) {
    next(error);
  }
}

export async function updateDestination(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const data = DestinationSchema.partial().parse(req.body);

    const destination = await prisma.destination.update({
      where: { id },
      data: {
        ...data,
        type: data.type ? (data.type === 'INTERNATIONAL' ? DestinationType.INTERNATIONAL : DestinationType.DOMESTIC) : undefined,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user?.id,
        action: 'UPDATE_DESTINATION',
        entityType: 'Destination',
        entityId: destination.id,
      },
    });

    res.json({ success: true, data: destination });
  } catch (error) {
    next(error);
  }
}

export async function deleteDestination(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;

    // Soft delete
    await prisma.destination.update({
      where: { id },
      data: { deletedAt: new Date(), isPublished: false },
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user?.id,
        action: 'DELETE_DESTINATION',
        entityType: 'Destination',
        entityId: id,
      },
    });

    res.json({ success: true, message: 'Destination removed successfully' });
  } catch (error) {
    next(error);
  }
}
