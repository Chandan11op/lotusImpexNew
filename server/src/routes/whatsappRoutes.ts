import { Router } from 'express';
import { verifyWebhook, handleWebhookEvent, getIntegrationStatus } from '../controllers/whatsappController.js';

const router = Router();

// Meta WhatsApp Webhook Handshake & Ingestion
router.get('/webhook', verifyWebhook);
router.post('/webhook', handleWebhookEvent);

// Status endpoint for CRM settings
router.get('/status', getIntegrationStatus);

export default router;
