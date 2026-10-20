import { Router } from 'express';
import {
  getPackages,
  getPackageBySlug,
  createPackage,
  updatePackage,
  deletePackage,
} from '../controllers/packages.controller.js';
import { authenticate, authorizeRoles } from '../middlewares/auth.js';

export const packagesRouter = Router();

packagesRouter.get('/', getPackages);
packagesRouter.get('/:slug', getPackageBySlug);
packagesRouter.post('/', authenticate, authorizeRoles('ADMIN', 'SUPER_ADMIN'), createPackage);
packagesRouter.put('/:id', authenticate, authorizeRoles('ADMIN', 'SUPER_ADMIN'), updatePackage);
packagesRouter.delete('/:id', authenticate, authorizeRoles('ADMIN', 'SUPER_ADMIN'), deletePackage);
