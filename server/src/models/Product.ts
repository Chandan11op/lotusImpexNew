import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
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
  isDemoItem: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    category: { type: String, required: true, trim: true, index: true },
    shortDescription: { type: String, required: true },
    fullDescription: { type: String, required: true },
    material: { type: String, required: true, default: 'Stainless Steel AISI 304 / 316L' },
    grade: { type: String, required: true, default: 'SS 304 / 316L' },
    sizeRange: { type: String, required: true, default: '0.5" to 4" OD' },
    connectionType: { type: String, required: true, default: 'Tri-Clamp / Butt Weld / DIN / SMS' },
    surfaceFinish: { type: String, required: true, default: 'Ra < 0.8 µm / Ra < 0.4 µm (EP)' },
    applicableIndustries: { type: [String], default: [] },
    standards: { type: String, default: '3A, DIN 11850, SMS, ISO 2037, BS 4825' },
    images: { type: [String], default: [] },
    specs: { type: Schema.Types.Mixed, default: {} },
    isPublished: { type: Boolean, default: true, index: true },
    isFeatured: { type: Boolean, default: false },
    seoTitle: { type: String },
    seoDescription: { type: String },
    isDemoItem: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

ProductSchema.index({ name: 'text', shortDescription: 'text', category: 'text' });

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
