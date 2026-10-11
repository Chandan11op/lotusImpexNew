import { Router } from 'express';
import {
  getEnquiryCommunications,
  createCommunicationLog,
} from '../controllers/communicationController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/enquiry/:enquiryId', requireAuth, getEnquiryCommunications);
router.post('/enquiry/:enquiryId', requireAuth, createCommunicationLog);

export default router;
