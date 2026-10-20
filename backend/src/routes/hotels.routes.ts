import { Router } from 'express';
import {
  getHotels,
  getHotelFilters,
  getHotelBySlug,
  createHotel,
  updateHotel,
  deleteHotel,
} from '../controllers/hotels.controller.js';
import { authenticate, authorizeRoles } from '../middlewares/auth.js';

export const hotelsRouter = Router();

hotelsRouter.get('/', getHotels);
hotelsRouter.get('/filters', getHotelFilters);
hotelsRouter.get('/:slug', getHotelBySlug);
hotelsRouter.post('/', authenticate, authorizeRoles('ADMIN', 'SUPER_ADMIN'), createHotel);
hotelsRouter.put('/:id', authenticate, authorizeRoles('ADMIN', 'SUPER_ADMIN'), updateHotel);
hotelsRouter.delete('/:id', authenticate, authorizeRoles('ADMIN', 'SUPER_ADMIN'), deleteHotel);
