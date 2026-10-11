import { Router } from 'express';
import {
  getCompanySettings,
  updateCompanySettings,
} from '../controllers/settingsController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

// Public read of company info & brand
router.get('/', getCompanySettings);

// Super admin write
router.put('/', requireAuth, requireRole('super_admin'), updateCompanySettings);

export default router;
