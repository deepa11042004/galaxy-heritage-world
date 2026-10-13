import { Router } from 'express';
import {
  getItineraries,
  getItineraryBySlug,
  createItinerary,
  updateItinerary,
  deleteItinerary,
} from '../controllers/itineraries.controller.js';
import { authenticate, authorizeRoles } from '../middlewares/auth.js';

export const itinerariesRouter = Router();

itinerariesRouter.get('/', getItineraries);
itinerariesRouter.get('/:slug', getItineraryBySlug);
itinerariesRouter.post('/', authenticate, authorizeRoles('ADMIN', 'SUPER_ADMIN'), createItinerary);
itinerariesRouter.put('/:id', authenticate, authorizeRoles('ADMIN', 'SUPER_ADMIN'), updateItinerary);
itinerariesRouter.delete('/:id', authenticate, authorizeRoles('ADMIN', 'SUPER_ADMIN'), deleteItinerary);
