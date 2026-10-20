import { Router } from 'express';
import {
  getTestimonials,
  createTestimonial,
  deleteTestimonial,
} from '../controllers/testimonials.controller.js';
import { authenticate, authorizeRoles } from '../middlewares/auth.js';

export const testimonialsRouter = Router();

testimonialsRouter.get('/', getTestimonials);
testimonialsRouter.post('/', authenticate, authorizeRoles('ADMIN', 'SUPER_ADMIN'), createTestimonial);
testimonialsRouter.delete('/:id', authenticate, authorizeRoles('ADMIN', 'SUPER_ADMIN'), deleteTestimonial);
