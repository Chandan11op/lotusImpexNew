import mongoose, { Document, Schema } from 'mongoose';

export type UserRole = 'super_admin' | 'sales' | 'accounts' | 'inventory' | 'staff';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  isActive: boolean;
  phone?: string;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { 
      type: String, 
      enum: ['super_admin', 'sales', 'accounts', 'inventory', 'staff'], 
      default: 'sales' 
    },
    isActive: { type: Boolean, default: true },
    phone: { type: String, trim: true },
    lastLogin: { type: Date },
  },
  {
    timestamps: true,
  }
);

// Never expose passwordHash in JSON
UserSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete (ret as any).passwordHash;
    return ret;
  },
});

export const User = mongoose.model<IUser>('User', UserSchema);
