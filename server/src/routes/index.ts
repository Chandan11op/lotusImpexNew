import { Router } from 'express';
import authRoutes from './authRoutes.js';
import productRoutes from './productRoutes.js';
import enquiryRoutes from './enquiryRoutes.js';
import customerRoutes from './customerRoutes.js';
import followUpRoutes from './followUpRoutes.js';
import communicationRoutes from './communicationRoutes.js';
import reportRoutes from './reportRoutes.js';
import userRoutes from './userRoutes.js';
import settingsRoutes from './settingsRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/enquiries', enquiryRoutes);
router.use('/customers', customerRoutes);
router.use('/follow-ups', followUpRoutes);
router.use('/communications', communicationRoutes);
router.use('/reports', reportRoutes);
router.use('/users', userRoutes);
router.use('/settings', settingsRoutes);

// Health check endpoint
router.get('/health', (_req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'lotus-impex-api',
  });
});

export default router;
