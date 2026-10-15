import mongoose, { Document, Schema } from 'mongoose';

export interface IUpload extends Document {
  fileId: string;
  originalName: string;
  storageFilename: string;
  mimeType: string;
  sizeBytes: number;
  category: 'boq' | 'drawing' | 'datasheet' | 'mtc' | 'catalog';
  linkedEnquiry?: mongoose.Types.ObjectId;
  uploadedBy?: mongoose.Types.ObjectId;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UploadSchema = new Schema<IUpload>(
  {
    fileId: { type: String, required: true, unique: true, index: true },
    originalName: { type: String, required: true, trim: true },
    storageFilename: { type: String, required: true, trim: true },
    mimeType: { type: String, required: true, trim: true },
    sizeBytes: { type: Number, required: true },
    category: {
      type: String,
      enum: ['boq', 'drawing', 'datasheet', 'mtc', 'catalog'],
      default: 'boq',
      index: true,
    },
    linkedEnquiry: { type: Schema.Types.ObjectId, ref: 'Enquiry', index: true },
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    isPublic: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const Upload = mongoose.model<IUpload>('Upload', UploadSchema);
