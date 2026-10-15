import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  sku: string;
  slug: string;
  category: string;
  priority: number;
  shortDescription: string;
  fullDescription: string;
  material: string;
  grade: string;
  finish: string;
  surfaceFinish: string;
  manufacturingType: string;
  sizeRange: string;
  wallThickness?: string;
  lengthOptions?: string;
  connectionType: string;
  applicableIndustries: string[];
  standards: string;
  availabilityStatus: string;
  mtcAvailable: string;
  images: string[];
  datasheetUrl?: string;
  specs: Record<string, string>;
  isPublished: boolean;
  isFeatured: boolean;
  seoTitle?: string;
  seoDescription?: string;
  isDemoItem: boolean;
  relatedProducts?: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    sku: { type: String, required: true, unique: true, uppercase: true, trim: true, index: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    category: { type: String, required: true, trim: true, index: true },
    priority: { type: Number, default: 50, index: true },
    shortDescription: { type: String, required: true },
    fullDescription: { type: String, required: true },
    material: { type: String, required: true, default: 'Stainless Steel AISI 304 / 316L' },
    grade: { type: String, required: true, default: 'SS 304 / 316L' },
    finish: { type: String, default: 'Ra < 0.8 µm (MP) / Ra < 0.4 µm (EP)' },
    surfaceFinish: { type: String, required: true, default: 'Ra < 0.8 µm / Ra < 0.4 µm (EP)' },
    manufacturingType: { type: String, enum: ['Welded', 'Seamless', 'Forged', 'Cast'], default: 'Welded' },
    sizeRange: { type: String, required: true, default: '0.5" to 4" OD' },
    wallThickness: { type: String, default: '1.2mm to 2.0mm (16G - 14G)' },
    lengthOptions: { type: String, default: '6 Meters / Cut-to-length' },
    connectionType: { type: String, required: true, default: 'Tri-Clamp / Butt Weld / DIN / SMS' },
    applicableIndustries: { type: [String], default: [] },
    standards: { type: String, default: '3A, DIN 11850, SMS, ISO 2037, BS 4825, ASTM A270' },
    availabilityStatus: {
      type: String,
      enum: ['In Stock - Subject to Prior Sale', 'Standard Procurement 3-5 Days', 'Custom Fabrication'],
      default: 'Standard Procurement 3-5 Days',
    },
    mtcAvailable: { type: String, default: 'EN 10204 3.1 Mill Test Certificate Available' },
    images: { type: [String], default: [] },
    datasheetUrl: { type: String },
    specs: { type: Schema.Types.Mixed, default: {} },
    isPublished: { type: Boolean, default: true, index: true },
    isFeatured: { type: Boolean, default: false },
    seoTitle: { type: String },
    seoDescription: { type: String },
    isDemoItem: { type: Boolean, default: true },
    relatedProducts: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  },
  {
    timestamps: true,
  }
);

ProductSchema.index({ name: 'text', shortDescription: 'text', category: 'text', sku: 'text' });
ProductSchema.index({ category: 1, priority: 1, isPublished: 1 });

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
