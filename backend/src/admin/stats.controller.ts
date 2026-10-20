import { Request, Response } from 'express';
import { prisma } from '../config/database.js';

interface ModuleStat {
  total: number;
  published: number;
  draft: number;
}

/** One grouped query per table instead of separate count() calls (the database is remote). */
function summarise(groups: { isPublished: boolean; _count: { _all: number } }[]): ModuleStat {
  const published = groups.filter((g) => g.isPublished).reduce((n, g) => n + g._count._all, 0);
  const draft = groups.filter((g) => !g.isPublished).reduce((n, g) => n + g._count._all, 0);
  return { total: published + draft, published, draft };
}

export async function getStats(_req: Request, res: Response): Promise<void> {
  const live = { deletedAt: null };

  const [destinations, hotels, packages, activities, byType, activeUsers, recent] = await Promise.all([
    prisma.destination.groupBy({ by: ['isPublished'], where: live, _count: { _all: true } }),
    prisma.hotel.groupBy({ by: ['isPublished'], where: live, _count: { _all: true } }),
    prisma.package.groupBy({ by: ['isPublished'], where: live, _count: { _all: true } }),
    prisma.activity.groupBy({ by: ['isPublished'], where: live, _count: { _all: true } }),
    prisma.destination.groupBy({ by: ['type'], where: live, _count: { _all: true } }),
    prisma.user.count({ where: { isActive: true } }),
    prisma.auditLog.findMany({
      where: { entityType: { in: ['Destination', 'Hotel', 'Package', 'Activity', 'User'] } },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: { user: { select: { name: true } } },
    }),
  ]);

  const typeCount = (t: string) => byType.find((g) => g.type === t)?._count._all ?? 0;

  res.json({
    success: true,
    data: {
      destinations: summarise(destinations),
      hotels: summarise(hotels),
      packages: summarise(packages),
      activities: summarise(activities),
      destinationsByType: { domestic: typeCount('DOMESTIC'), international: typeCount('INTERNATIONAL') },
      activeUsers,
      recentActivity: recent.map((r) => ({
        id: r.id,
        action: r.action,
        entityType: r.entityType,
        entityId: r.entityId,
        userName: r.user?.name ?? null,
        createdAt: r.createdAt,
      })),
    },
  });
}

/** Lightweight id/name list for form dropdowns. */
export async function getDestinationOptions(_req: Request, res: Response): Promise<void> {
  const data = await prisma.destination.findMany({
    where: { deletedAt: null },
    select: { id: true, name: true, type: true, country: true },
    orderBy: { name: 'asc' },
  });
  res.json({ success: true, data });
}
