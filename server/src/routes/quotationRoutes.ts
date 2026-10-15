import { Router } from 'express';
import {
  createQuotation,
  getQuotations,
  getQuotationById,
  updateQuotationStatus,
} from '../controllers/quotationController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

// All quotation routes require authentication
router.use(requireAuth);

// Accessible by sales, accounts, super_admin, and staff
router.get('/', requireRole('super_admin', 'sales', 'accounts', 'staff'), getQuotations);
router.get('/:id', requireRole('super_admin', 'sales', 'accounts', 'staff'), getQuotationById);
router.post('/', requireRole('super_admin', 'sales', 'staff'), createQuotation);
router.patch('/:id/status', requireRole('super_admin', 'sales', 'accounts', 'staff'), updateQuotationStatus);

export default router;
