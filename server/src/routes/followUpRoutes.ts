import { Router } from 'express';
import {
  getFollowUps,
  createFollowUp,
  completeFollowUp,
} from '../controllers/followUpController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, getFollowUps);
router.post('/enquiry/:enquiryId', requireAuth, createFollowUp);
router.patch('/:id/complete', requireAuth, completeFollowUp);

export default router;
