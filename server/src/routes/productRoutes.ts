import { Router } from 'express';
import {
  getPublicProducts,
  getPriorityProducts,
  getPublicProductBySlug,
  getCategories,
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

// Public endpoints
router.get('/public', getPublicProducts);
router.get('/public/priority', getPriorityProducts);
router.get('/public/categories', getCategories);
router.get('/public/:slug', getPublicProductBySlug);

// Admin / CRM endpoints
router.get('/admin', requireAuth, getAdminProducts);
router.post('/admin', requireAuth, createProduct);
router.put('/admin/:id', requireAuth, updateProduct);
router.patch('/admin/:id', requireAuth, updateProduct);
router.delete('/admin/:id', requireAuth, requireRole('super_admin'), deleteProduct);

export default router;
