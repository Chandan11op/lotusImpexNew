import mongoose, { Document, Schema } from 'mongoose';

export interface ICompanySettings extends Document {
  companyName: string;
  productBrand: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  intro: string;
  socialLinks: Record<string, string>;
  supportedLanguages: string[];
  defaultCurrency: string;
  availableCurrencies: string[];
  whatsappWebhookVerified: boolean;
  seoDefaultTitle: string;
  seoDefaultDescription: string;
  footerDisclaimer: string;
  isDemoConfig: boolean;
  updatedAt: Date;
}

const CompanySettingsSchema = new Schema<ICompanySettings>(
  {
    companyName: { type: String, default: 'Lotus Impex' },
    productBrand: { type: String, default: 'Aeron' },
    email: { type: String, default: 'sales@lotusimpex.com' },
    phone: { type: String, default: '+91 22 2847 0000' },
    whatsapp: { type: String, default: '+91 98200 00000' },
    address: {
      type: String,
      default: 'Industrial Complex, Kanjurmarg West, Mumbai 400078, Maharashtra, India',
    },
    intro: {
      type: String,
      default:
        'Lotus Impex is a Mumbai-based distributor and supplier of precision stainless-steel sanitary tubes, pipes, fittings, valves, TC clamps, and engineered fluid handling components for sanitary and process applications.',
    },
    socialLinks: {
      type: Schema.Types.Mixed,
      default: {
        linkedin: 'https://linkedin.com/company/lotus-impex',
        indiamart: 'https://www.indiamart.com',
      },
    },
    supportedLanguages: { type: [String], default: ['en', 'hi', 'de', 'ar', 'es', 'fr'] },
    defaultCurrency: { type: String, default: 'INR' },
    availableCurrencies: { type: [String], default: ['INR', 'USD', 'EUR', 'AED', 'GBP'] },
    whatsappWebhookVerified: { type: Boolean, default: false },
    seoDefaultTitle: { type: String, default: 'Lotus Impex | Stainless Steel Sanitary Tubes, Fittings & Valves' },
    seoDefaultDescription: {
      type: String,
      default: 'High purity SS 304 and SS 316L sanitary tubes, tri-clamp fittings, valves, and process equipment for pharmaceutical, biotech, and food & beverage industries.',
    },
    footerDisclaimer: {
      type: String,
      default: 'Lotus Impex operates as an established trading and industrial supply partner. Product brand designations (including Aeron) are provisional trade labels subject to final commercial confirmation. Mill Test Certificates (EN 10204 3.1) provided upon request and verification.',
    },
    isDemoConfig: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export const CompanySettings = mongoose.model<ICompanySettings>(
  'CompanySettings',
  CompanySettingsSchema
);
