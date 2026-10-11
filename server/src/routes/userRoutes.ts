import { Router } from 'express';
import {
  getUsers,
  createUser,
  toggleUserStatus,
  updateUserRole,
  resetUserPassword,
} from '../controllers/userController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

// All user management routes strictly require Super Admin role
router.use(requireAuth, requireRole('super_admin'));

router.get('/', getUsers);
router.post('/', createUser);
router.patch('/:id/toggle-status', toggleUserStatus);
router.patch('/:id/role', updateUserRole);
router.patch('/:id/reset-password', resetUserPassword);

export default router;
