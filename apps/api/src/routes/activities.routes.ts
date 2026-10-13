import { Router } from 'express';
import {
  getActivities,
  getActivityBySlug,
  createActivity,
  updateActivity,
  deleteActivity,
} from '../controllers/activities.controller.js';
import { authenticate, authorizeRoles } from '../middlewares/auth.js';

export const activitiesRouter = Router();

activitiesRouter.get('/', getActivities);
activitiesRouter.get('/:slug', getActivityBySlug);
activitiesRouter.post('/', authenticate, authorizeRoles('ADMIN', 'SUPER_ADMIN'), createActivity);
activitiesRouter.put('/:id', authenticate, authorizeRoles('ADMIN', 'SUPER_ADMIN'), updateActivity);
activitiesRouter.delete('/:id', authenticate, authorizeRoles('ADMIN', 'SUPER_ADMIN'), deleteActivity);
