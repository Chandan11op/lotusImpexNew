import { Router } from 'express';
import { getAuditLogs } from '../controllers/auditLogController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);
router.get('/', requireRole('super_admin'), getAuditLogs);

export default router;
