import { Router } from 'express';
import {
  getCustomers,
  getCustomerById,
  updateCustomer,
} from '../controllers/customerController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, getCustomers);
router.get('/:id', requireAuth, getCustomerById);
router.put('/:id', requireAuth, updateCustomer);

export default router;
