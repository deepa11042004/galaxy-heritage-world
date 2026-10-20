import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import { prisma } from '../config/database.js';

export async function getMediaAssets(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { category, search } = req.query;

    const where: any = {};
    if (category) where.category = String(category);
    if (typeof search === 'string' && search.trim()) {
      where.OR = [
        { filename: { contains: search.trim() } },
        { altText: { contains: search.trim() } },
      ];
    }

    const media = await prisma.mediaAsset.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    res.json({ success: true, count: media.length, data: media });
  } catch (error) {
    next(error);
  }
}

export async function getMediaManifest(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const manifestPath = path.resolve(process.cwd(), '../../public/media/galaxy-heritage-world/media-manifest.json');
    if (fs.existsSync(manifestPath)) {
      const data = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
      res.json({ success: true, total: data.length, data });
      return;
    }

    const fallbackPath = path.resolve(process.cwd(), 'public/media/galaxy-heritage-world/media-manifest.json');
    if (fs.existsSync(fallbackPath)) {
      const data = JSON.parse(fs.readFileSync(fallbackPath, 'utf-8'));
      res.json({ success: true, total: data.length, data });
      return;
    }

    res.json({ success: true, total: 0, data: [] });
  } catch (error) {
    next(error);
  }
}

export async function uploadMedia(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'No file uploaded' });
      return;
    }

    const file = req.file;
    const storagePath = `/media/uploads/${file.filename}`;

    const media = await prisma.mediaAsset.create({
      data: {
        filename: file.filename,
        originalUrl: null,
        storagePath,
        mimeType: file.mimetype,
        fileSize: file.size,
        altText: req.body.altText || file.originalname,
        category: req.body.category || 'uploads',
      },
    });

    res.status(201).json({ success: true, data: media });
  } catch (error) {
    next(error);
  }
}
