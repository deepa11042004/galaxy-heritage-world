import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database.js';
import { AppError } from '../middlewares/error.js';
import { FaqSchema } from '@ghw/shared';

export async function getFaqs(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { category } = req.query;

    const where: any = { isPublished: true };
    if (category) {
      where.category = String(category);
    }

    const faqs = await prisma.faq.findMany({
      where,
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    });

    res.json({ success: true, count: faqs.length, data: faqs });
  } catch (error) {
    next(error);
  }
}

export async function createFaq(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = FaqSchema.parse(req.body);

    const faq = await prisma.faq.create({
      data,
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user?.id,
        action: 'CREATE_FAQ',
        entityType: 'Faq',
        entityId: faq.id,
      },
    });

    res.status(201).json({ success: true, data: faq });
  } catch (error) {
    next(error);
  }
}

export async function updateFaq(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const data = FaqSchema.partial().parse(req.body);

    const faq = await prisma.faq.update({
      where: { id },
      data,
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user?.id,
        action: 'UPDATE_FAQ',
        entityType: 'Faq',
        entityId: faq.id,
      },
    });

    res.json({ success: true, data: faq });
  } catch (error) {
    next(error);
  }
}

export async function deleteFaq(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;

    await prisma.faq.delete({
      where: { id },
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user?.id,
        action: 'DELETE_FAQ',
        entityType: 'Faq',
        entityId: id,
      },
    });

    res.json({ success: true, message: 'FAQ deleted successfully' });
  } catch (error) {
    next(error);
  }
}
