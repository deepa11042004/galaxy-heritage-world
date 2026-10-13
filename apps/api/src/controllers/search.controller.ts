import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database.js';

export async function searchAll(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const q = typeof req.query.q === 'string' ? req.query.q.trim() : '';

    if (!q || q.length < 2) {
      res.json({
        success: true,
        query: q,
        total: 0,
        results: {
          destinations: [],
          packages: [],
          hotels: [],
          itineraries: [],
          activities: [],
        },
      });
      return;
    }

    const [destinations, packages, hotels, itineraries, activities] = await Promise.all([
      prisma.destination.findMany({
        where: {
          isPublished: true,
          deletedAt: null,
          OR: [
            { name: { contains: q } },
            { region: { contains: q } },
            { description: { contains: q } },
          ],
        },
        take: 6,
        select: {
          id: true,
          slug: true,
          name: true,
          region: true,
          heroImageUrl: true,
          type: true,
        },
      }),

      prisma.package.findMany({
        where: {
          isPublished: true,
          deletedAt: null,
          OR: [
            { title: { contains: q } },
            { locationLabel: { contains: q } },
            { overview: { contains: q } },
          ],
        },
        take: 6,
        select: {
          id: true,
          slug: true,
          title: true,
          locationLabel: true,
          durationDays: true,
          durationNights: true,
          heroImageUrl: true,
          priceStarting: true,
        },
      }),

      prisma.hotel.findMany({
        where: {
          isPublished: true,
          deletedAt: null,
          OR: [
            { name: { contains: q } },
            { locationName: { contains: q } },
            { state: { contains: q } },
            { description: { contains: q } },
          ],
        },
        take: 6,
        select: {
          id: true,
          slug: true,
          name: true,
          locationName: true,
          state: true,
          imageUrl: true,
          ratingStars: true,
          category: true,
        },
      }),

      prisma.itinerary.findMany({
        where: {
          isPublished: true,
          deletedAt: null,
          OR: [
            { title: { contains: q } },
            { locationLabel: { contains: q } },
            { summary: { contains: q } },
          ],
        },
        take: 6,
        select: {
          id: true,
          slug: true,
          title: true,
          locationLabel: true,
          durationDays: true,
          durationNights: true,
          heroImageUrl: true,
          badgeText: true,
        },
      }),

      prisma.activity.findMany({
        where: {
          isPublished: true,
          deletedAt: null,
          OR: [
            { title: { contains: q } },
            { locationLabel: { contains: q } },
            { description: { contains: q } },
          ],
        },
        take: 6,
        select: {
          id: true,
          slug: true,
          title: true,
          locationLabel: true,
          durationLabel: true,
          imageUrl: true,
          category: true,
        },
      }),
    ]);

    const total =
      destinations.length +
      packages.length +
      hotels.length +
      itineraries.length +
      activities.length;

    res.json({
      success: true,
      query: q,
      total,
      results: {
        destinations,
        packages,
        hotels,
        itineraries,
        activities,
      },
    });
  } catch (error) {
    next(error);
  }
}
