import { Router } from 'express';
import { uploadFile, downloadFile, getEnquiryUploads } from '../controllers/uploadController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Public/Client can upload BOQ documents during RFQ
router.post('/boq', uploadFile);

// Downloading customer files requires authentication (CRM staff)
router.get('/download/:fileId', requireAuth, downloadFile);

// Fetching uploads for an enquiry requires authentication
router.get('/enquiry/:enquiryId', requireAuth, getEnquiryUploads);

export default router;
