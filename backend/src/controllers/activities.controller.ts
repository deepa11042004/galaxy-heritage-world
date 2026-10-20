import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database.js';
import { AppError } from '../middlewares/error.js';
import { ActivitySchema } from '../shared/index.js';

export async function getActivities(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { category, featured, search } = req.query;

    const where: any = { isPublished: true, deletedAt: null };

    if (category) where.category = String(category);
    if (featured === 'true') where.featured = true;

    if (typeof search === 'string' && search.trim()) {
      where.OR = [
        { title: { contains: search.trim() } },
        { locationLabel: { contains: search.trim() } },
        { description: { contains: search.trim() } },
      ];
    }

    const activities = await prisma.activity.findMany({
      where,
      orderBy: [{ featured: 'desc' }, { title: 'asc' }],
    });

    res.json({ success: true, count: activities.length, data: activities });
  } catch (error) {
    next(error);
  }
}

export async function getActivityBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { slug } = req.params;

    const activity = await prisma.activity.findFirst({
      where: { slug, isPublished: true, deletedAt: null },
    });

    if (!activity) {
      throw new AppError(`Activity '${slug}' not found`, 404);
    }

    res.json({ success: true, data: activity });
  } catch (error) {
    next(error);
  }
}

export async function createActivity(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = ActivitySchema.parse(req.body);

    const activity = await prisma.activity.create({
      data,
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user?.id,
        action: 'CREATE_ACTIVITY',
        entityType: 'Activity',
        entityId: activity.id,
      },
    });

    res.status(201).json({ success: true, data: activity });
  } catch (error) {
    next(error);
  }
}

export async function updateActivity(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const data = ActivitySchema.partial().parse(req.body);

    const activity = await prisma.activity.update({
      where: { id },
      data,
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user?.id,
        action: 'UPDATE_ACTIVITY',
        entityType: 'Activity',
        entityId: activity.id,
      },
    });

    res.json({ success: true, data: activity });
  } catch (error) {
    next(error);
  }
}

export async function deleteActivity(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;

    await prisma.activity.update({
      where: { id },
      data: { deletedAt: new Date(), isPublished: false },
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user?.id,
        action: 'DELETE_ACTIVITY',
        entityType: 'Activity',
        entityId: id,
      },
    });

    res.json({ success: true, message: 'Activity removed successfully' });
  } catch (error) {
    next(error);
  }
}
