import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database.js';
import { TestimonialSchema } from '../shared/index.js';

export async function getTestimonials(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { isPublished: true, isVerified: true },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, count: testimonials.length, data: testimonials });
  } catch (error) {
    next(error);
  }
}

export async function createTestimonial(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = TestimonialSchema.parse(req.body);

    const testimonial = await prisma.testimonial.create({
      data,
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user?.id,
        action: 'CREATE_TESTIMONIAL',
        entityType: 'Testimonial',
        entityId: testimonial.id,
      },
    });

    res.status(201).json({ success: true, data: testimonial });
  } catch (error) {
    next(error);
  }
}

export async function deleteTestimonial(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;

    await prisma.testimonial.delete({
      where: { id },
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user?.id,
        action: 'DELETE_TESTIMONIAL',
        entityType: 'Testimonial',
        entityId: id,
      },
    });

    res.json({ success: true, message: 'Testimonial deleted successfully' });
  } catch (error) {
    next(error);
  }
}
