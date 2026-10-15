export type UserRole = 'super_admin' | 'sales' | 'accounts' | 'inventory' | 'staff';

export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  isActive?: boolean;
  lastLogin?: string;
  createdAt?: string;
}

export interface Product {
  _id: string;
  name: string;
  sku: string;
  slug: string;
  category: string;
  priority: number;
  shortDescription: string;
  fullDescription: string;
  material: string;
  grade: string;
  finish: string;
  surfaceFinish: string;
  manufacturingType: 'Welded' | 'Seamless' | 'Forged' | 'Cast';
  sizeRange: string;
  wallThickness?: string;
  lengthOptions?: string;
  connectionType: string;
  applicableIndustries: string[];
  standards: string;
  availabilityStatus: string;
  mtcAvailable: string;
  images: string[];
  datasheetUrl?: string;
  specs: Record<string, string>;
  isPublished: boolean;
  isFeatured: boolean;
  seoTitle?: string;
  seoDescription?: string;
  isDemoItem?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type EnquiryStatus =
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'quotation_sent'
  | 'follow_up'
  | 'negotiation'
  | 'order_confirmed'
  | 'won'
  | 'lost'
  | 'on_hold';

export type EnquiryPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface EnquiryActivity {
  action: string;
  performedBy: string;
  timestamp: string;
  notes?: string;
}

export interface Enquiry {
  _id: string;
  enquiryNumber: string;
  customerName: string;
  company: string;
  email: string;
  phone: string;
  whatsappNumber?: string;
  country: string;
  productRef?: string | { _id: string; name: string; category: string; images: string[] };
  productName?: string;
  materialGrade?: string;
  sizeRequirement?: string;
  quantity?: number;
  unit?: string;
  deliveryDestination?: string;
  requiredDate?: string;
  message: string;
  source: string;
  status: EnquiryStatus;
  priority: EnquiryPriority;
  assignedUser?: { _id: string; name: string; email: string } | string;
  assignedUserName?: string;
  customerRef?: string | Customer;
  nextFollowUpDate?: string;
  lossReason?: string;
  notes?: string;
  preferredContactMethod?: string;
  attachments?: any[];
  activityHistory: EnquiryActivity[];
  isDemoRecord?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  _id: string;
  name: string;
  contactPerson?: string;
  company: string;
  email: string;
  phone: string;
  country: string;
  address?: string;
  industry?: string;
  notes?: string;
  linkedEnquiries?: (string | Enquiry)[];
  linkedQuotations?: (string | Quotation)[];
  isDemoRecord?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type QuotationStatus =
  | 'draft'
  | 'sent'
  | 'revised'
  | 'accepted'
  | 'rejected'
  | 'expired'
  | 'cancelled';

export interface QuotationLineItem {
  productRef?: string;
  productName: string;
  sku?: string;
  description?: string;
  grade?: string;
  size?: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  discountPercent: number;
  lineTotal: number;
}

export interface Quotation {
  _id: string;
  quotationNumber: string;
  revision: number;
  enquiryRef?: string | Enquiry;
  customerRef: string | Customer;
  customerName: string;
  company: string;
  email: string;
  phone: string;
  billingAddress?: string;
  shippingAddress?: string;
  country: string;
  currency: string;
  lineItems: QuotationLineItem[];
  subtotal: number;
  discountTotal: number;
  taxPercent: number;
  taxTotal: number;
  grandTotal: number;
  deliveryTerms: string;
  paymentTerms: string;
  validityDate: string;
  status: QuotationStatus;
  notes?: string;
  createdBy?: string;
  createdByName?: string;
  createdAt: string;
  updatedAt: string;
}

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export interface Task {
  _id: string;
  taskTitle: string;
  description?: string;
  assignedUser: { _id: string; name: string; email: string; role: string } | string;
  assignedUserName?: string;
  enquiryRef?: { _id: string; enquiryNumber: string; customerName: string; company: string; status: string } | string;
  customerRef?: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  completedAt?: string;
  completionNotes?: string;
  createdAt: string;
}

export type FollowUpStatus = 'pending' | 'completed';
export type FollowUpPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface FollowUp {
  _id: string;
  enquiryRef: string;
  enquiryNumber: string;
  customerName: string;
  company: string;
  assignedUser?: { _id: string; name: string; email: string } | string;
  assignedUserName?: string;
  dueDate: string;
  taskDescription: string;
  priority: FollowUpPriority;
  status: FollowUpStatus;
  completedAt?: string;
  completionNotes?: string;
  isDemoRecord?: boolean;
  createdAt: string;
}

export interface CommunicationLog {
  _id: string;
  enquiryRef: string;
  enquiryNumber: string;
  author: string;
  type: 'call' | 'email' | 'whatsapp' | 'meeting' | 'internal_note' | 'quotation_activity';
  summary: string;
  notes: string;
  timestamp: string;
}

export interface AuditLog {
  _id: string;
  timestamp: string;
  userName: string;
  userRole?: string;
  action: string;
  entityType: string;
  entityId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
}

export interface CompanySettings {
  companyName: string;
  productBrand: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  intro: string;
  socialLinks?: Record<string, string>;
  supportedLanguages?: string[];
  defaultCurrency?: string;
  availableCurrencies?: string[];
  whatsappWebhookVerified?: boolean;
  seoDefaultTitle?: string;
  seoDefaultDescription?: string;
  footerDisclaimer?: string;
  isDemoConfig?: boolean;
}

export interface DashboardKPIs {
  totalEnquiries: number;
  newEnquiries: number;
  contacted: number;
  qualified: number;
  quotationSent: number;
  negotiation: number;
  won: number;
  lost: number;
  overdueFollowUps: number;
  totalCustomers: number;
  totalProducts: number;
  conversionRate: string;
}
