import { Router } from 'express';
import {
  getDestinations,
  getDestinationBySlug,
  createDestination,
  updateDestination,
  deleteDestination,
} from '../controllers/destinations.controller.js';
import { authenticate, authorizeRoles } from '../middlewares/auth.js';

export const destinationsRouter = Router();

destinationsRouter.get('/', getDestinations);
destinationsRouter.get('/:slug', getDestinationBySlug);
destinationsRouter.post('/', authenticate, authorizeRoles('ADMIN', 'SUPER_ADMIN'), createDestination);
destinationsRouter.put('/:id', authenticate, authorizeRoles('ADMIN', 'SUPER_ADMIN'), updateDestination);
destinationsRouter.delete('/:id', authenticate, authorizeRoles('ADMIN', 'SUPER_ADMIN'), deleteDestination);
