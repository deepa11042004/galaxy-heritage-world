import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database.js';
import { AppError } from '../middlewares/error.js';
import { PackageSchema } from '../shared/index.js';

export async function getPackages(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { destinationId, featured, category, search } = req.query;

    const where: any = { isPublished: true, deletedAt: null };

    if (destinationId) where.destinationId = String(destinationId);
    if (featured === 'true') where.featured = true;
    if (category) where.category = String(category);

    if (typeof search === 'string' && search.trim()) {
      where.OR = [
        { title: { contains: search.trim() } },
        { locationLabel: { contains: search.trim() } },
        { overview: { contains: search.trim() } },
      ];
    }

    const packages = await prisma.package.findMany({
      where,
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
      include: {
        destination: { select: { id: true, name: true, slug: true, region: true } },
        features: true,
      },
    });

    res.json({ success: true, count: packages.length, data: packages });
  } catch (error) {
    next(error);
  }
}

export async function getPackageBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { slug } = req.params;

    const pkg = await prisma.package.findFirst({
      where: { slug, isPublished: true, deletedAt: null },
      include: {
        destination: true,
        features: true,
      },
    });

    if (!pkg) {
      throw new AppError(`Package '${slug}' not found`, 404);
    }

    res.json({ success: true, data: pkg });
  } catch (error) {
    next(error);
  }
}

export async function createPackage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = PackageSchema.parse(req.body);

    const pkg = await prisma.package.create({
      data: {
        ...data,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user?.id,
        action: 'CREATE_PACKAGE',
        entityType: 'Package',
        entityId: pkg.id,
      },
    });

    res.status(201).json({ success: true, data: pkg });
  } catch (error) {
    next(error);
  }
}

export async function updatePackage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const data = PackageSchema.partial().parse(req.body);

    const pkg = await prisma.package.update({
      where: { id },
      data,
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user?.id,
        action: 'UPDATE_PACKAGE',
        entityType: 'Package',
        entityId: pkg.id,
      },
    });

    res.json({ success: true, data: pkg });
  } catch (error) {
    next(error);
  }
}

export async function deletePackage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;

    await prisma.package.update({
      where: { id },
      data: { deletedAt: new Date(), isPublished: false },
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user?.id,
        action: 'DELETE_PACKAGE',
        entityType: 'Package',
        entityId: id,
      },
    });

    res.json({ success: true, message: 'Package removed successfully' });
  } catch (error) {
    next(error);
  }
}
