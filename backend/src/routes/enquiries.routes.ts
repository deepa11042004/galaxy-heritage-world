import { Router } from 'express';
import {
  createEnquiry,
  redeemVoucher,
  subscribeNewsletter,
  getEnquiries,
  getEnquiryById,
  updateEnquiry,
  getVoucherRedemptions,
} from '../controllers/enquiries.controller.js';
import { authenticate, authorizeRoles } from '../middlewares/auth.js';

export const enquiriesRouter = Router();

// Public endpoints
enquiriesRouter.post('/', createEnquiry);
enquiriesRouter.post('/voucher', redeemVoucher);
enquiriesRouter.post('/newsletter', subscribeNewsletter);

// Protected admin endpoints
enquiriesRouter.get('/', authenticate, authorizeRoles('ADMIN', 'SUPER_ADMIN', 'SALES', 'SUPPORT'), getEnquiries);
enquiriesRouter.get('/vouchers/list', authenticate, authorizeRoles('ADMIN', 'SUPER_ADMIN', 'SALES', 'SUPPORT'), getVoucherRedemptions);
enquiriesRouter.get('/:id', authenticate, authorizeRoles('ADMIN', 'SUPER_ADMIN', 'SALES', 'SUPPORT'), getEnquiryById);
enquiriesRouter.patch('/:id', authenticate, authorizeRoles('ADMIN', 'SUPER_ADMIN', 'SALES', 'SUPPORT'), updateEnquiry);
