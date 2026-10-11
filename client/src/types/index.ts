export type UserRole = 'super_admin' | 'staff';

export interface User {
  id: string;
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
  slug: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  material: string;
  grade: string;
  sizeRange: string;
  connectionType: string;
  surfaceFinish: string;
  applicableIndustries: string[];
  standards: string;
  images: string[];
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
  | 'negotiation'
  | 'won'
  | 'lost';

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
  country: string;
  productRef?: string | { _id: string; name: string; category: string; images: string[] };
  productName?: string;
  quantity?: number;
  unit?: string;
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
  activityHistory: EnquiryActivity[];
  isDemoRecord?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  _id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  country: string;
  notes?: string;
  linkedEnquiries?: (string | Enquiry)[];
  isDemoRecord?: boolean;
  createdAt: string;
  updatedAt: string;
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
