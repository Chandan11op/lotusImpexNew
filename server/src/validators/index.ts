import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(4, 'Password must be at least 4 characters long'),
});

export const createUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Valid email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['super_admin', 'staff']).default('staff'),
  phone: z.string().optional(),
});

export const updateRoleSchema = z.object({
  role: z.enum(['super_admin', 'staff']),
});

export const publicEnquirySchema = z.object({
  customerName: z.string().min(2, 'Name is required'),
  company: z.string().min(2, 'Company name is required'),
  email: z.string().email('Valid business email is required'),
  phone: z.string().min(6, 'Contact phone number is required'),
  country: z.string().min(2, 'Country is required'),
  productRef: z.string().optional(),
  productName: z.string().optional(),
  quantity: z.coerce.number().min(1, 'Quantity must be at least 1').default(1),
  unit: z.string().default('Pieces'),
  message: z.string().min(5, 'Please provide enquiry details or requirements'),
  preferredContactMethod: z.enum(['Email', 'Phone', 'WhatsApp']).default('Email'),
  source: z.string().default('website_rfq'),
});

export const updateEnquiryStatusSchema = z.object({
  status: z.enum([
    'new',
    'contacted',
    'qualified',
    'quotation_sent',
    'negotiation',
    'won',
    'lost',
  ]),
  notes: z.string().optional(),
  lossReason: z.string().optional(),
});

export const assignEnquirySchema = z.object({
  assignedUserId: z.string().min(1, 'Assigned user ID is required'),
  notes: z.string().optional(),
});

export const scheduleFollowUpSchema = z.object({
  dueDate: z.string().datetime({ message: 'Valid ISO date is required' }),
  taskDescription: z.string().min(3, 'Task description is required'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  assignedUserId: z.string().optional(),
});

export const communicationLogSchema = z.object({
  type: z.enum(['call', 'email', 'whatsapp', 'meeting', 'internal_note', 'quotation_activity']),
  summary: z.string().min(2, 'Summary is required'),
  notes: z.string().min(2, 'Notes are required'),
  timestamp: z.string().optional(),
});

export const productSchema = z.object({
  name: z.string().min(2, 'Product name is required'),
  slug: z.string().min(2, 'Product slug is required'),
  category: z.string().min(2, 'Category is required'),
  shortDescription: z.string().min(5, 'Short description is required'),
  fullDescription: z.string().min(10, 'Full description is required'),
  material: z.string().default('Stainless Steel AISI 304 / 316L'),
  grade: z.string().default('SS 304 / 316L'),
  sizeRange: z.string().default('0.5" to 4" OD'),
  connectionType: z.string().default('Tri-Clamp / Butt Weld / DIN / SMS'),
  surfaceFinish: z.string().default('Ra < 0.8 µm / Ra < 0.4 µm (EP)'),
  applicableIndustries: z.array(z.string()).default([]),
  standards: z.string().default('3A, DIN 11850, SMS, ISO 2037, BS 4825'),
  images: z.array(z.string()).default([]),
  specs: z.record(z.string()).default({}),
  isPublished: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

export const companySettingsSchema = z.object({
  companyName: z.string().min(2),
  productBrand: z.string().min(2),
  email: z.string().email(),
  phone: z.string(),
  whatsapp: z.string(),
  address: z.string(),
  intro: z.string(),
  socialLinks: z.record(z.string()).optional(),
  supportedLanguages: z.array(z.string()).optional(),
});
