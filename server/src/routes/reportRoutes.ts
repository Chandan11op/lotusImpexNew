import { Router } from 'express';
import {
  getDashboardOverview,
  getReports,
  exportEnquiriesCSV,
} from '../controllers/reportController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/overview', requireAuth, getDashboardOverview);
router.get('/analytics', requireAuth, getReports);
router.get('/export-csv', requireAuth, exportEnquiriesCSV);

export default router;
