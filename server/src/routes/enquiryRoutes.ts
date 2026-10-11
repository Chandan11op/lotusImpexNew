import { Router } from 'express';
import {
  createPublicEnquiry,
  getEnquiries,
  getEnquiryById,
  updateEnquiryStatus,
  assignEnquiry,
  addEnquiryNote,
} from '../controllers/enquiryController.js';
import { requireAuth } from '../middleware/auth.js';
import { publicEnquiryRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Public submission
router.post('/public', publicEnquiryRateLimiter, createPublicEnquiry);

// Private CRM endpoints
router.get('/', requireAuth, getEnquiries);
router.get('/:id', requireAuth, getEnquiryById);
router.patch('/:id/status', requireAuth, updateEnquiryStatus);
router.patch('/:id/assign', requireAuth, assignEnquiry);
router.post('/:id/notes', requireAuth, addEnquiryNote);

export default router;
