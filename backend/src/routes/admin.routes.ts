import { Router } from 'express';
import { authenticate, authorizeRoles } from '../middlewares/auth.js';
import { adminLimiter } from '../middlewares/rateLimit.js';
import { resources } from '../admin/resources.js';
import { makeCrud } from '../admin/crud.js';
import { h } from '../admin/helpers.js';
import { getStats, getDestinationOptions } from '../admin/stats.controller.js';
import { imageUpload, uploadImages } from '../admin/uploads.controller.js';
import {
  listUsers,
  createUser,
  updateUser,
  resetUserPassword,
  getAccount,
  updateAccount,
  changePassword,
  listSessions,
  revokeOtherSessions,
} from '../admin/users.controller.js';

/**
 * Admin API (mounted at /api/v1/admin). Every route requires a signed-in user with a panel role.
 *   EDITOR       read, create, edit, publish/unpublish, upload images
 *   ADMIN        + delete content
 *   SUPER_ADMIN  + manage users
 * (authorizeRoles lets SUPER_ADMIN through every check.)
 */
export const adminRouter = Router();

const editor = authorizeRoles('EDITOR', 'ADMIN');
const admin = authorizeRoles('ADMIN');
const superAdmin = authorizeRoles('SUPER_ADMIN');

adminRouter.use(adminLimiter, authenticate, editor);

adminRouter.get('/stats', h(getStats));
adminRouter.get('/options/destinations', h(getDestinationOptions));

adminRouter.post('/uploads', imageUpload, h(uploadImages));

for (const cfg of Object.values(resources)) {
  const crud = makeCrud(cfg);
  const base = `/${cfg.key}`;
  adminRouter.get(base, h(crud.list));
  adminRouter.post(base, h(crud.create));
  adminRouter.get(`${base}/:id`, h(crud.get));
  adminRouter.put(`${base}/:id`, h(crud.update));
  adminRouter.patch(`${base}/:id/publish`, h(crud.setPublished));
  adminRouter.delete(`${base}/:id`, admin, h(crud.remove));
}

// Own account (any panel user)
adminRouter.get('/account', h(getAccount));
adminRouter.put('/account', h(updateAccount));
adminRouter.post('/account/password', h(changePassword));
adminRouter.get('/account/sessions', h(listSessions));
adminRouter.delete('/account/sessions', h(revokeOtherSessions));

// User management (Super Admin only)
adminRouter.get('/users', superAdmin, h(listUsers));
adminRouter.post('/users', superAdmin, h(createUser));
adminRouter.put('/users/:id', superAdmin, h(updateUser));
adminRouter.post('/users/:id/password', superAdmin, h(resetUserPassword));
