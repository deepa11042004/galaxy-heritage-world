import { Request, Response } from 'express';
import multer from 'multer';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import { prisma } from '../config/database.js';
import { AppError } from '../middlewares/error.js';
import { audit } from './helpers.js';

const MAX_BYTES = 8 * 1024 * 1024;
const MAX_FILES = 10;
const ALLOWED_FORMATS = new Set(['jpeg', 'png', 'webp']);
const FOLDERS = new Set(['destinations', 'hotels', 'packages', 'activities']);

export const uploadDir = path.resolve(process.cwd(), 'public/media/uploads');

/** Files are buffered in memory, verified by decoding them, then re-encoded; nothing client-supplied touches the disk. */
export const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_BYTES, files: MAX_FILES },
}).array('files', MAX_FILES);

export async function uploadImages(req: Request, res: Response): Promise<void> {
  const files = (req.files as Express.Multer.File[] | undefined) ?? [];
  if (files.length === 0) throw new AppError('No image selected', 400);

  const folder = FOLDERS.has(String(req.body.folder)) ? String(req.body.folder) : 'general';
  fs.mkdirSync(uploadDir, { recursive: true });

  const saved: { id: string; url: string; width: number; height: number; name: string }[] = [];

  for (const file of files) {
    let meta: sharp.Metadata;
    try {
      meta = await sharp(file.buffer).metadata();
    } catch {
      throw new AppError(`"${file.originalname}" is not a valid image`, 400);
    }
    if (!meta.format || !ALLOWED_FORMATS.has(meta.format)) {
      throw new AppError(`"${file.originalname}": only JPG, PNG and WebP images are allowed`, 400);
    }

    const filename = `${randomUUID()}.webp`;
    const info = await sharp(file.buffer)
      .rotate() // honour EXIF orientation, then strip metadata
      .resize({ width: 2000, height: 2000, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 88 })
      .toFile(path.join(uploadDir, filename));

    const asset = await prisma.mediaAsset.create({
      data: {
        filename,
        storagePath: `/media/uploads/${filename}`,
        mimeType: 'image/webp',
        fileSize: info.size,
        width: info.width,
        height: info.height,
        altText: path.basename(file.originalname, path.extname(file.originalname)).slice(0, 255),
        category: folder,
      },
    });
    saved.push({ id: asset.id, url: asset.storagePath, width: info.width, height: info.height, name: file.originalname });
  }

  await audit(req, 'UPLOAD_IMAGES', 'MediaAsset', undefined, { count: saved.length, folder });
  res.status(201).json({ success: true, data: saved });
}
