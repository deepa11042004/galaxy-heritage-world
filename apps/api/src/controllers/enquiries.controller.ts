import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database.js';
import { AppError } from '../middlewares/error.js';
import { sendEnquiryAcknowledgement } from '../services/email.js';
import {
  CreateEnquirySchema,
  UpdateEnquirySchema,
  VoucherRedemptionSchema,
  NewsletterSubscribeSchema,
} from '@ghw/shared';
import { EnquiryStatus } from '@prisma/client';

export async function createEnquiry(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = CreateEnquirySchema.parse(req.body);

    const referenceNumber = `GHW-ENQ-${Date.now().toString().slice(-6)}${Math.floor(100 + Math.random() * 900)}`;

    const enquiry = await prisma.enquiry.create({
      data: {
        referenceNumber,
        name: data.name,
        email: data.email,
        phone: data.phone,
        city: data.city,
        ageGroup: data.ageGroup,
        destinationInterest: data.destinationInterest,
        packageInterest: data.packageInterest,
        travelDates: data.travelDates,
        travelersCount: data.travelersCount,
        message: data.message,
        sourcePage: data.sourcePage || req.headers.referer || '/',
        status: EnquiryStatus.NEW,
        consent: data.consent,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'] || null,
      },
    });

    // Send email acknowledgement in background
    sendEnquiryAcknowledgement({
      referenceNumber: enquiry.referenceNumber,
      name: enquiry.name,
      email: enquiry.email,
      phone: enquiry.phone,
      destinationInterest: enquiry.destinationInterest,
    }).catch(() => {});

    res.status(201).json({
      success: true,
      message: 'Your enquiry has been submitted successfully. Our travel consultant will contact you shortly.',
      referenceNumber: enquiry.referenceNumber,
      data: enquiry,
    });
  } catch (error) {
    next(error);
  }
}

export async function redeemVoucher(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = VoucherRedemptionSchema.parse(req.body);

    const referenceNumber = `GHW-VOUCH-${Date.now().toString().slice(-6)}${Math.floor(100 + Math.random() * 900)}`;

    const voucher = await prisma.voucherRedemption.create({
      data: {
        referenceNumber,
        voucherCode: data.voucherCode,
        name: data.name,
        email: data.email,
        phone: data.phone,
        city: data.city,
        preferredDestination: data.preferredDestination,
        preferredDates: data.preferredDates,
        message: data.message,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Your voucher redemption request has been registered. Verification is under process.',
      referenceNumber: voucher.referenceNumber,
      data: voucher,
    });
  } catch (error) {
    next(error);
  }
}

export async function subscribeNewsletter(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = NewsletterSubscribeSchema.parse(req.body);

    const subscription = await prisma.newsletterSubscription.upsert({
      where: { email: data.email },
      update: { isActive: true, unsubscribed: null },
      create: {
        email: data.email,
        name: data.name,
        isActive: true,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for subscribing to Galaxy Heritage World updates.',
      data: subscription,
    });
  } catch (error) {
    next(error);
  }
}

export async function getEnquiries(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { status, search, page = '1', limit = '20' } = req.query;

    const pageNum = Math.max(1, parseInt(String(page), 10) || 1);
    const take = Math.min(100, Math.max(1, parseInt(String(limit), 10) || 20));
    const skip = (pageNum - 1) * take;

    const where: any = {};

    if (status && Object.values(EnquiryStatus).includes(status as EnquiryStatus)) {
      where.status = status as EnquiryStatus;
    }

    if (typeof search === 'string' && search.trim()) {
      const q = search.trim();
      where.OR = [
        { name: { contains: q } },
        { email: { contains: q } },
        { phone: { contains: q } },
        { referenceNumber: { contains: q } },
        { destinationInterest: { contains: q } },
        { city: { contains: q } },
      ];
    }

    const [total, enquiries] = await Promise.all([
      prisma.enquiry.count({ where }),
      prisma.enquiry.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
    ]);

    res.json({
      success: true,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / take),
      data: enquiries,
    });
  } catch (error) {
    next(error);
  }
}

export async function getEnquiryById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;

    const enquiry = await prisma.enquiry.findUnique({
      where: { id },
    });

    if (!enquiry) {
      throw new AppError('Enquiry not found', 404);
    }

    res.json({ success: true, data: enquiry });
  } catch (error) {
    next(error);
  }
}

export async function updateEnquiry(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const data = UpdateEnquirySchema.parse(req.body);

    const enquiry = await prisma.enquiry.update({
      where: { id },
      data: {
        status: data.status ? (data.status as EnquiryStatus) : undefined,
        notes: data.notes,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user?.id,
        action: 'UPDATE_ENQUIRY',
        entityType: 'Enquiry',
        entityId: id,
        details: { newStatus: data.status },
      },
    });

    res.json({ success: true, data: enquiry });
  } catch (error) {
    next(error);
  }
}

export async function getVoucherRedemptions(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { status, search } = req.query;

    const where: any = {};
    if (status) where.status = String(status);
    if (typeof search === 'string' && search.trim()) {
      const q = search.trim();
      where.OR = [
        { name: { contains: q } },
        { voucherCode: { contains: q } },
        { referenceNumber: { contains: q } },
        { phone: { contains: q } },
      ];
    }

    const vouchers = await prisma.voucherRedemption.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, count: vouchers.length, data: vouchers });
  } catch (error) {
    next(error);
  }
}
