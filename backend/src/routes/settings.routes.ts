import { Router } from 'express';
import {
  getSettings,
  updateSetting,
  getPageBySlug,
  upsertPage,
} from '../controllers/settings.controller.js';
import { authenticate, authorizeRoles } from '../middlewares/auth.js';

export const settingsRouter = Router();

settingsRouter.get('/', getSettings);
settingsRouter.post('/', authenticate, authorizeRoles('ADMIN', 'SUPER_ADMIN'), updateSetting);
settingsRouter.get('/pages/:slug', getPageBySlug);
settingsRouter.post('/pages', authenticate, authorizeRoles('ADMIN', 'SUPER_ADMIN'), upsertPage);
