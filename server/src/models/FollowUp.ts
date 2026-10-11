import mongoose, { Document, Schema } from 'mongoose';

export type FollowUpStatus = 'pending' | 'completed';
export type FollowUpPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface IFollowUp extends Document {
  enquiryRef: mongoose.Types.ObjectId;
  enquiryNumber: string;
  customerName: string;
  company: string;
  assignedUser?: mongoose.Types.ObjectId;
  assignedUserName?: string;
  dueDate: Date;
  taskDescription: string;
  priority: FollowUpPriority;
  status: FollowUpStatus;
  completedAt?: Date;
  completionNotes?: string;
  isDemoRecord: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FollowUpSchema = new Schema<IFollowUp>(
  {
    enquiryRef: { type: Schema.Types.ObjectId, ref: 'Enquiry', required: true, index: true },
    enquiryNumber: { type: String, required: true },
    customerName: { type: String, required: true },
    company: { type: String, required: true },
    assignedUser: { type: Schema.Types.ObjectId, ref: 'User' },
    assignedUserName: { type: String },
    dueDate: { type: Date, required: true, index: true },
    taskDescription: { type: String, required: true },
    priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
    status: { type: String, enum: ['pending', 'completed'], default: 'pending', index: true },
    completedAt: { type: Date },
    completionNotes: { type: String },
    isDemoRecord: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export const FollowUp = mongoose.model<IFollowUp>('FollowUp', FollowUpSchema);
