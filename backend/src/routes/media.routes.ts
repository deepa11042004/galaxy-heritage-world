import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {
  getMediaAssets,
  getMediaManifest,
  uploadMedia,
} from '../controllers/media.controller.js';
import { authenticate, authorizeRoles } from '../middlewares/auth.js';

const uploadDir = path.resolve(process.cwd(), 'public/media/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `${base}-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

export const mediaRouter = Router();

mediaRouter.get('/', getMediaAssets);
mediaRouter.get('/manifest', getMediaManifest);
mediaRouter.post(
  '/upload',
  authenticate,
  authorizeRoles('ADMIN', 'SUPER_ADMIN'),
  upload.single('file'),
  uploadMedia
);
