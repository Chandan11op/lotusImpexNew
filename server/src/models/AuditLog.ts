import mongoose, { Document, Schema } from 'mongoose';

export interface IAuditLog extends Document {
  timestamp: Date;
  userId?: mongoose.Types.ObjectId;
  userName: string;
  userRole?: string;
  action: string;
  entityType: string;
  entityId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    timestamp: { type: Date, default: Date.now, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    userName: { type: String, default: 'System', trim: true },
    userRole: { type: String },
    action: { type: String, required: true, trim: true, index: true },
    entityType: { type: String, required: true, trim: true, index: true },
    entityId: { type: String, trim: true },
    details: { type: Schema.Types.Mixed },
    ipAddress: { type: String, trim: true },
  },
  {
    timestamps: false,
  }
);

AuditLogSchema.index({ timestamp: -1 });
AuditLogSchema.index({ action: 1, entityType: 1 });

export const AuditLog = mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
