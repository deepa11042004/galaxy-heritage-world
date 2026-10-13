import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database.js';
import { AppError } from '../middlewares/error.js';
import { PageContentSchema } from '@ghw/shared';
import { z } from 'zod';

const UpdateSettingSchema = z.object({
  key: z.string().min(1),
  val: z.string(),
  groupName: z.string().optional().default('general'),
  isPublic: z.boolean().optional().default(true),
});

export async function getSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const settings = await prisma.siteSetting.findMany({
      where: { isPublic: true },
    });

    const settingsMap: Record<string, string> = {};
    settings.forEach((s: any) => {
      settingsMap[s.settingKey] = s.settingVal;
    });

    res.json({
      success: true,
      data: settingsMap,
      raw: settings,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateSetting(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { key, val, groupName, isPublic } = UpdateSettingSchema.parse(req.body);

    const setting = await prisma.siteSetting.upsert({
      where: { settingKey: key },
      update: { settingVal: val, isPublic, groupName },
      create: {
        settingKey: key,
        settingVal: val,
        groupName,
        isPublic,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user?.id,
        action: 'UPDATE_SETTING',
        entityType: 'SiteSetting',
        entityId: setting.id,
        details: { key, val },
      },
    });

    res.json({ success: true, data: setting });
  } catch (error) {
    next(error);
  }
}

export async function getPageBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { slug } = req.params;

    const page = await prisma.page.findFirst({
      where: { slug, isPublished: true, deletedAt: null },
    });

    if (!page) {
      throw new AppError(`Page '${slug}' not found`, 404);
    }

    res.json({ success: true, data: page });
  } catch (error) {
    next(error);
  }
}

export async function upsertPage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = PageContentSchema.parse(req.body);

    const page = await prisma.page.upsert({
      where: { slug: data.slug },
      update: {
        title: data.title,
        subtitle: data.subtitle,
        contentHtml: data.contentHtml,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        isPublished: data.isPublished,
      },
      create: {
        slug: data.slug,
        title: data.title,
        subtitle: data.subtitle,
        contentHtml: data.contentHtml,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        isPublished: data.isPublished,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user?.id,
        action: 'UPSERT_PAGE',
        entityType: 'Page',
        entityId: page.id,
      },
    });

    res.json({ success: true, data: page });
  } catch (error) {
    next(error);
  }
}
