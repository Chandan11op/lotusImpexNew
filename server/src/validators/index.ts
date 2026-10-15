import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(4, 'Password must be at least 4 characters long'),
});

export const createUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Valid email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['super_admin', 'sales', 'accounts', 'inventory', 'staff']).default('sales'),
  phone: z.string().optional(),
});

export const updateRoleSchema = z.object({
  role: z.enum(['super_admin', 'sales', 'accounts', 'inventory', 'staff']),
  isActive: z.boolean().optional(),
});

export const publicEnquirySchema = z.object({
  customerName: z.string().min(2, 'Name is required'),
  company: z.string().min(2, 'Company name is required'),
  email: z.string().email('Valid business email is required'),
  phone: z.string().min(6, 'Contact phone number is required'),
  whatsappNumber: z.string().optional(),
  country: z.string().min(2, 'Country is required'),
  productRef: z.string().optional(),
  productName: z.string().optional(),
  materialGrade: z.string().optional(),
  sizeRequirement: z.string().optional(),
  quantity: z.coerce.number().min(1, 'Quantity must be at least 1').default(1),
  unit: z.string().default('Pieces'),
  deliveryDestination: z.string().optional(),
  requiredDate: z.string().optional(),
  message: z.string().min(5, 'Please provide enquiry details or requirements'),
  preferredContactMethod: z.enum(['Email', 'Phone', 'WhatsApp']).default('Email'),
  source: z.string().default('website_rfq'),
  attachments: z.array(z.string()).optional(),
});

export const updateEnquiryStatusSchema = z.object({
  status: z.enum([
    'new',
    'contacted',
    'qualified',
    'quotation_sent',
    'follow_up',
    'negotiation',
    'order_confirmed',
    'won',
    'lost',
    'on_hold',
  ]),
  notes: z.string().optional(),
  lossReason: z.string().optional(),
});

export const assignEnquirySchema = z.object({
  assignedUserId: z.string().min(1, 'Assigned user ID is required'),
  notes: z.string().optional(),
});

export const quotationLineItemSchema = z.object({
  productRef: z.string().optional(),
  productName: z.string().min(1, 'Product name is required'),
  sku: z.string().optional(),
  description: z.string().optional(),
  grade: z.string().default('SS 316L'),
  size: z.string().optional(),
  quantity: z.coerce.number().min(1, 'Quantity must be at least 1'),
  unit: z.string().default('Pieces'),
  unitPrice: z.coerce.number().min(0, 'Unit price must be non-negative'),
  discountPercent: z.coerce.number().min(0).max(100).default(0),
});

export const createQuotationSchema = z.object({
  enquiryRef: z.string().optional(),
  customerRef: z.string().min(1, 'Customer reference is required'),
  currency: z.enum(['INR', 'USD', 'EUR', 'AED', 'GBP']).default('INR'),
  lineItems: z.array(quotationLineItemSchema).min(1, 'At least one line item is required'),
  taxPercent: z.coerce.number().min(0).max(100).default(18),
  deliveryTerms: z.string().default('Ex-Works Mumbai'),
  paymentTerms: z.string().default('100% advance against PI / LC at sight'),
  validityDays: z.coerce.number().min(1).default(15),
  notes: z.string().optional(),
});

export const updateQuotationStatusSchema = z.object({
  status: z.enum(['draft', 'sent', 'revised', 'accepted', 'rejected', 'expired', 'cancelled']),
  notes: z.string().optional(),
});

export const taskSchema = z.object({
  taskTitle: z.string().min(2, 'Task title is required'),
  description: z.string().optional(),
  assignedUserId: z.string().min(1, 'Assigned user is required'),
  enquiryRef: z.string().optional(),
  customerRef: z.string().optional(),
  dueDate: z.string().min(1, 'Due date is required'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  status: z.enum(['pending', 'in_progress', 'completed', 'cancelled']).default('pending'),
  completionNotes: z.string().optional(),
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
  sku: z.string().min(2, 'SKU is required').optional(),
  slug: z.string().min(2, 'Product slug is required'),
  category: z.string().min(2, 'Category is required'),
  priority: z.coerce.number().default(50),
  shortDescription: z.string().min(5, 'Short description is required'),
  fullDescription: z.string().min(10, 'Full description is required'),
  material: z.string().default('Stainless Steel AISI 304 / 316L'),
  grade: z.string().default('SS 304 / 316L'),
  finish: z.string().default('Ra < 0.8 µm (MP) / Ra < 0.4 µm (EP)'),
  surfaceFinish: z.string().default('Ra < 0.8 µm / Ra < 0.4 µm (EP)'),
  manufacturingType: z.enum(['Welded', 'Seamless', 'Forged', 'Cast']).default('Welded'),
  sizeRange: z.string().default('0.5" to 4" OD'),
  wallThickness: z.string().optional(),
  lengthOptions: z.string().optional(),
  connectionType: z.string().default('Tri-Clamp / Butt Weld / DIN / SMS'),
  applicableIndustries: z.array(z.string()).default([]),
  standards: z.string().default('3A, DIN 11850, SMS, ISO 2037, BS 4825, ASTM A270'),
  availabilityStatus: z.enum(['In Stock - Subject to Prior Sale', 'Standard Procurement 3-5 Days', 'Custom Fabrication']).default('Standard Procurement 3-5 Days'),
  mtcAvailable: z.string().default('EN 10204 3.1 Mill Test Certificate Available'),
  images: z.array(z.string()).default([]),
  datasheetUrl: z.string().optional(),
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
  defaultCurrency: z.string().optional(),
  availableCurrencies: z.array(z.string()).optional(),
  seoDefaultTitle: z.string().optional(),
  seoDefaultDescription: z.string().optional(),
  footerDisclaimer: z.string().optional(),
});
