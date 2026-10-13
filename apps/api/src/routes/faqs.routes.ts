import { Router } from 'express';
import {
  getFaqs,
  createFaq,
  updateFaq,
  deleteFaq,
} from '../controllers/faqs.controller.js';
import { authenticate, authorizeRoles } from '../middlewares/auth.js';

export const faqsRouter = Router();

faqsRouter.get('/', getFaqs);
faqsRouter.post('/', authenticate, authorizeRoles('ADMIN', 'SUPER_ADMIN'), createFaq);
faqsRouter.put('/:id', authenticate, authorizeRoles('ADMIN', 'SUPER_ADMIN'), updateFaq);
faqsRouter.delete('/:id', authenticate, authorizeRoles('ADMIN', 'SUPER_ADMIN'), deleteFaq);
