import mongoose, { Document, Schema } from 'mongoose';

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

export interface IEnquiryActivity {
  action: string;
  performedBy: string;
  timestamp: Date;
  notes?: string;
}

export interface IEnquiry extends Document {
  enquiryNumber: string;
  customerName: string;
  company: string;
  email: string;
  phone: string;
  whatsappNumber?: string;
  country: string;
  productRef?: mongoose.Types.ObjectId;
  productName?: string;
  materialGrade?: string;
  sizeRequirement?: string;
  quantity?: number;
  unit?: string;
  deliveryDestination?: string;
  requiredDate?: Date;
  message: string;
  source: string;
  status: EnquiryStatus;
  priority: EnquiryPriority;
  assignedUser?: mongoose.Types.ObjectId;
  assignedUserName?: string;
  customerRef?: mongoose.Types.ObjectId;
  nextFollowUpDate?: Date;
  lossReason?: string;
  notes?: string;
  preferredContactMethod?: string;
  attachments?: mongoose.Types.ObjectId[];
  activityHistory: IEnquiryActivity[];
  isDemoRecord: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const EnquiryActivitySchema = new Schema<IEnquiryActivity>(
  {
    action: { type: String, required: true },
    performedBy: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    notes: { type: String },
  },
  { _id: false }
);

const EnquirySchema = new Schema<IEnquiry>(
  {
    enquiryNumber: { type: String, required: true, unique: true, index: true },
    customerName: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    whatsappNumber: { type: String, trim: true },
    country: { type: String, required: true, default: 'India' },
    productRef: { type: Schema.Types.ObjectId, ref: 'Product' },
    productName: { type: String, trim: true },
    materialGrade: { type: String, trim: true },
    sizeRequirement: { type: String, trim: true },
    quantity: { type: Number, default: 1 },
    unit: { type: String, default: 'Pieces' },
    deliveryDestination: { type: String, trim: true },
    requiredDate: { type: Date },
    message: { type: String, required: true },
    source: { type: String, default: 'website_rfq' },
    status: {
      type: String,
      enum: ['new', 'contacted', 'qualified', 'quotation_sent', 'follow_up', 'negotiation', 'order_confirmed', 'won', 'lost', 'on_hold'],
      default: 'new',
      index: true,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
      index: true,
    },
    assignedUser: { type: Schema.Types.ObjectId, ref: 'User' },
    assignedUserName: { type: String },
    customerRef: { type: Schema.Types.ObjectId, ref: 'Customer' },
    nextFollowUpDate: { type: Date },
    lossReason: { type: String },
    notes: { type: String },
    preferredContactMethod: { type: String, default: 'Email' },
    attachments: [{ type: Schema.Types.ObjectId, ref: 'Upload' }],
    activityHistory: { type: [EnquiryActivitySchema], default: [] },
    isDemoRecord: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

EnquirySchema.index({ customerName: 'text', company: 'text', email: 'text', enquiryNumber: 'text' });

export const Enquiry = mongoose.model<IEnquiry>('Enquiry', EnquirySchema);
