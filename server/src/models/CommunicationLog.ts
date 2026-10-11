import mongoose, { Document, Schema } from 'mongoose';

export type CommunicationType =
  | 'call'
  | 'email'
  | 'whatsapp'
  | 'meeting'
  | 'internal_note'
  | 'quotation_activity';

export interface ICommunicationLog extends Document {
  enquiryRef: mongoose.Types.ObjectId;
  enquiryNumber: string;
  customerRef?: mongoose.Types.ObjectId;
  author: string;
  authorId?: mongoose.Types.ObjectId;
  type: CommunicationType;
  summary: string;
  notes: string;
  timestamp: Date;
  isDemoRecord: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CommunicationLogSchema = new Schema<ICommunicationLog>(
  {
    enquiryRef: { type: Schema.Types.ObjectId, ref: 'Enquiry', required: true, index: true },
    enquiryNumber: { type: String, required: true },
    customerRef: { type: Schema.Types.ObjectId, ref: 'Customer' },
    author: { type: String, required: true },
    authorId: { type: Schema.Types.ObjectId, ref: 'User' },
    type: {
      type: String,
      enum: ['call', 'email', 'whatsapp', 'meeting', 'internal_note', 'quotation_activity'],
      required: true,
      index: true,
    },
    summary: { type: String, required: true },
    notes: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    isDemoRecord: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export const CommunicationLog = mongoose.model<ICommunicationLog>(
  'CommunicationLog',
  CommunicationLogSchema
);
