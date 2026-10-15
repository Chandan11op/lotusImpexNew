import { Request, Response, NextFunction } from 'express';
import { CompanySettings } from '../models/CompanySettings.js';
import { Customer } from '../models/Customer.js';
import { Enquiry } from '../models/Enquiry.js';
import { CommunicationLog } from '../models/CommunicationLog.js';
import { config } from '../config/env.js';

// Cache of processed message IDs to prevent duplicate webhook processing
const processedMessageIds = new Set<string>();

export async function verifyWebhook(req: Request, res: Response): Promise<void> {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  const expectedToken = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || 'lotus_whatsapp_verify_token_2026';

  if (mode === 'subscribe' && token === expectedToken) {
    console.log('[WhatsApp Webhook] Verification successful');
    res.status(200).send(challenge);
  } else {
    console.warn('[WhatsApp Webhook] Verification failed: token mismatch');
    res.sendStatus(403);
  }
}

export async function handleWebhookEvent(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const body = req.body;

    // Acknowledge Meta immediately to avoid retries
    res.status(200).json({ status: 'EVENT_RECEIVED' });

    if (!body || body.object !== 'whatsapp_business_account') {
      return;
    }

    const entries = body.entry || [];
    for (const entry of entries) {
      const changes = entry.changes || [];
      for (const change of changes) {
        const value = change.value;
        if (!value) continue;

        // Process incoming messages
        const messages = value.messages || [];
        for (const message of messages) {
          const messageId = message.id;

          // Duplicate webhook protection
          if (processedMessageIds.has(messageId)) {
            console.log(`[WhatsApp] Duplicate message ignored: ${messageId}`);
            continue;
          }
          processedMessageIds.add(messageId);
          // Keep cache size bounded
          if (processedMessageIds.size > 2000) {
            const first = processedMessageIds.values().next().value;
            if (first) processedMessageIds.delete(first);
          }

          const fromPhone = message.from; // International format e.g. "919820000000"
          const textBody = message.text?.body || message.button?.text || '[Media/Interactive Payload]';
          const senderName = value.contacts?.[0]?.profile?.name || 'WhatsApp Contact';

          console.log(`[WhatsApp Incoming] From: ${fromPhone} (${senderName}): ${textBody}`);

          // Match or create customer by phone
          let customer = await Customer.findOne({
            $or: [
              { phone: new RegExp(fromPhone.slice(-10) + '$') },
              { phone: fromPhone },
            ],
          });

          if (!customer) {
            customer = await Customer.create({
              name: senderName,
              company: `${senderName} (WhatsApp)`,
              email: `${fromPhone}@whatsapp.customer`,
              phone: `+${fromPhone}`,
              country: fromPhone.startsWith('91') ? 'India' : 'International',
              notes: `Auto-created from incoming WhatsApp message: "${textBody.slice(0, 100)}"`,
              isDemoRecord: false,
            });
          }

          // Link to existing active enquiry or create new enquiry
          let enquiry = await Enquiry.findOne({
            customerRef: customer._id,
            status: { $in: ['new', 'contacted', 'quotation_sent', 'follow_up', 'negotiation'] },
          }).sort({ updatedAt: -1 });

          if (!enquiry) {
            const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
            const count = await Enquiry.countDocuments();
            const enquiryNumber = `ENQ-${dateStr}-${String(count + 101).padStart(4, '0')}`;

            enquiry = await Enquiry.create({
              enquiryNumber,
              customerName: customer.name,
              company: customer.company,
              email: customer.email,
              phone: customer.phone,
              whatsappNumber: customer.phone,
              country: customer.country,
              productName: 'WhatsApp Channel Inquiry',
              quantity: 1,
              unit: 'Lot',
              message: textBody,
              source: 'whatsapp_business',
              status: 'new',
              priority: 'high',
              customerRef: customer._id,
              isDemoRecord: false,
              activityHistory: [
                {
                  action: 'WhatsApp Message Received',
                  performedBy: customer.name,
                  timestamp: new Date(),
                  notes: textBody,
                },
              ],
            });

            customer.linkedEnquiries.push(enquiry._id);
            await customer.save();
          } else {
            enquiry.activityHistory.push({
              action: 'WhatsApp Message Received',
              performedBy: customer.name,
              timestamp: new Date(),
              notes: textBody,
            });
            await enquiry.save();
          }

          // Log communication record
          await CommunicationLog.create({
            enquiryRef: enquiry._id,
            enquiryNumber: enquiry.enquiryNumber,
            author: customer.name,
            type: 'whatsapp',
            summary: `Incoming WhatsApp: ${textBody.slice(0, 40)}`,
            notes: textBody,
            timestamp: new Date(),
          });
        }
      }
    }
  } catch (error) {
    console.error('[WhatsApp Webhook Error]', error);
  }
}

export async function getIntegrationStatus(_req: Request, res: Response): Promise<void> {
  const isTokenConfigured = Boolean(process.env.WHATSAPP_ACCESS_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID);
  const settings = await CompanySettings.findOne();

  res.json({
    success: true,
    data: {
      provider: 'Meta WhatsApp Business Cloud API',
      configured: isTokenConfigured,
      webhookVerified: Boolean(settings?.whatsappWebhookVerified || isTokenConfigured),
      businessNumber: settings?.whatsapp || '+91 98200 00000',
      activeWebhookUrl: '/api/integrations/whatsapp/webhook',
      mode: isTokenConfigured ? 'live_cloud_api' : 'direct_click_to_chat_fallback',
      instructions:
        'When credentials are not yet configured in production, direct click-to-chat links continue to work seamlessly using the configured business phone number.',
    },
  });
}
