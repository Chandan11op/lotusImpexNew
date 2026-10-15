import mongoose, { Document, Schema } from 'mongoose';

export interface ICustomer extends Document {
  name: string;
  company: string;
  email: string;
  phone: string;
  country: string;
  address?: string;
  industry?: string;
  notes?: string;
  linkedEnquiries: mongoose.Types.ObjectId[];
  linkedQuotations: mongoose.Types.ObjectId[];
  isDemoRecord: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CustomerSchema = new Schema<ICustomer>(
  {
    name: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    phone: { type: String, required: true, trim: true },
    country: { type: String, required: true, default: 'India' },
    address: { type: String },
    industry: { type: String },
    notes: { type: String },
    linkedEnquiries: [{ type: Schema.Types.ObjectId, ref: 'Enquiry' }],
    linkedQuotations: [{ type: Schema.Types.ObjectId, ref: 'Quotation' }],
    isDemoRecord: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

CustomerSchema.index({ name: 'text', company: 'text', email: 'text' });

export const Customer = mongoose.model<ICustomer>('Customer', CustomerSchema);
