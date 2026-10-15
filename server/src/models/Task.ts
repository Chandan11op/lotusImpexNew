import mongoose, { Document, Schema } from 'mongoose';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export interface ITask extends Document {
  taskTitle: string;
  description?: string;
  assignedUser: mongoose.Types.ObjectId;
  assignedUserName?: string;
  enquiryRef?: mongoose.Types.ObjectId;
  customerRef?: mongoose.Types.ObjectId;
  dueDate: Date;
  priority: TaskPriority;
  status: TaskStatus;
  completedAt?: Date;
  completionNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
  {
    taskTitle: { type: String, required: true, trim: true },
    description: { type: String },
    assignedUser: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    assignedUserName: { type: String },
    enquiryRef: { type: Schema.Types.ObjectId, ref: 'Enquiry', index: true },
    customerRef: { type: Schema.Types.ObjectId, ref: 'Customer', index: true },
    dueDate: { type: Date, required: true, index: true },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
      index: true,
    },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed', 'cancelled'],
      default: 'pending',
      index: true,
    },
    completedAt: { type: Date },
    completionNotes: { type: String },
  },
  {
    timestamps: true,
  }
);

TaskSchema.index({ assignedUser: 1, status: 1, dueDate: 1 });

export const Task = mongoose.model<ITask>('Task', TaskSchema);
