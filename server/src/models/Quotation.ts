import mongoose, { Document, Schema } from 'mongoose';

export type QuotationStatus =
  | 'draft'
  | 'sent'
  | 'revised'
  | 'accepted'
  | 'rejected'
  | 'expired'
  | 'cancelled';

export interface IQuotationLineItem {
  productRef?: mongoose.Types.ObjectId;
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

export interface IQuotation extends Document {
  quotationNumber: string;
  revision: number;
  enquiryRef?: mongoose.Types.ObjectId;
  customerRef: mongoose.Types.ObjectId;
  customerName: string;
  company: string;
  email: string;
  phone: string;
  billingAddress?: string;
  shippingAddress?: string;
  country: string;
  currency: string;
  lineItems: IQuotationLineItem[];
  subtotal: number;
  discountTotal: number;
  taxPercent: number;
  taxTotal: number;
  grandTotal: number;
  deliveryTerms: string;
  paymentTerms: string;
  validityDate: Date;
  status: QuotationStatus;
  notes?: string;
  createdBy?: mongoose.Types.ObjectId;
  createdByName?: string;
  createdAt: Date;
  updatedAt: Date;
}

const QuotationLineItemSchema = new Schema<IQuotationLineItem>(
  {
    productRef: { type: Schema.Types.ObjectId, ref: 'Product' },
    productName: { type: String, required: true, trim: true },
    sku: { type: String, trim: true },
    description: { type: String },
    grade: { type: String, default: 'SS 316L' },
    size: { type: String },
    quantity: { type: Number, required: true, min: 1, default: 1 },
    unit: { type: String, default: 'Pieces' },
    unitPrice: { type: Number, required: true, min: 0, default: 0 },
    discountPercent: { type: Number, default: 0, min: 0, max: 100 },
    lineTotal: { type: Number, required: true, default: 0 },
  },
  { _id: false }
);

const QuotationSchema = new Schema<IQuotation>(
  {
    quotationNumber: { type: String, required: true, unique: true, index: true },
    revision: { type: Number, default: 0 },
    enquiryRef: { type: Schema.Types.ObjectId, ref: 'Enquiry', index: true },
    customerRef: { type: Schema.Types.ObjectId, ref: 'Customer', required: true, index: true },
    customerName: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    billingAddress: { type: String },
    shippingAddress: { type: String },
    country: { type: String, default: 'India' },
    currency: { type: String, default: 'INR', enum: ['INR', 'USD', 'EUR', 'AED', 'GBP'] },
    lineItems: { type: [QuotationLineItemSchema], default: [] },
    subtotal: { type: Number, required: true, default: 0 },
    discountTotal: { type: Number, default: 0 },
    taxPercent: { type: Number, default: 18 },
    taxTotal: { type: Number, required: true, default: 0 },
    grandTotal: { type: Number, required: true, default: 0 },
    deliveryTerms: { type: String, default: 'Ex-Works Mumbai / Delivery within 3-5 working days' },
    paymentTerms: { type: String, default: '100% advance against Proforma Invoice / LC for export' },
    validityDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ['draft', 'sent', 'revised', 'accepted', 'rejected', 'expired', 'cancelled'],
      default: 'draft',
      index: true,
    },
    notes: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    createdByName: { type: String },
  },
  {
    timestamps: true,
  }
);

QuotationSchema.index({ customerName: 'text', company: 'text', quotationNumber: 'text' });

export const Quotation = mongoose.model<IQuotation>('Quotation', QuotationSchema);
