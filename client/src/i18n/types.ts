export type LocaleCode =
  | 'en'
  | 'hi'
  | 'ar'
  | 'es'
  | 'fr'
  | 'de'
  | 'pt'
  | 'it'
  | 'ru'
  | 'zh'
  | 'ja'
  | 'ko'
  | 'tr'
  | 'id'
  | 'nl';

export interface LocaleDefinition {
  code: LocaleCode;
  name: string;
  nativeName: string;
  flag: string;
  dir: 'ltr' | 'rtl';
}

export interface TranslationDictionary {
  // Navigation
  navHome: string;
  navProducts: string;
  navIndustries: string;
  navQuality: string;
  navAbout: string;
  navContact: string;
  navRequestQuote: string;
  navCrmLogin: string;

  // Hero & Common CTAs
  heroTitle: string;
  heroSubtitle: string;
  btnExploreCatalogue: string;
  btnRequestQuote: string;
  btnViewDetails: string;
  btnDownloadSpecs: string;

  // RFQ Modal & Form
  rfqTitle: string;
  rfqSubtitle: string;
  lblCustomerName: string;
  lblCompany: string;
  lblEmail: string;
  lblPhone: string;
  lblCountry: string;
  lblProduct: string;
  lblQuantity: string;
  lblUnit: string;
  lblMessage: string;
  lblPreferredContact: string;
  btnSubmitRfq: string;
  msgSubmitting: string;
  msgSuccessTitle: string;
  msgSuccessDesc: string;

  // Filter & Search
  searchPlaceholder: string;
  filterAllCategories: string;
  filterAllGrades: string;
  filterAllIndustries: string;

  // Footer & Trust
  trustTagline: string;
  certifiedHeading: string;
  allRightsReserved: string;

  // Theme & Language
  themeLight: string;
  themeDark: string;
  themeSystem: string;
}

export const SUPPORTED_LOCALES: LocaleDefinition[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧', dir: 'ltr' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', dir: 'ltr' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇦🇪', dir: 'rtl' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', dir: 'ltr' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', dir: 'ltr' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', dir: 'ltr' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷', dir: 'ltr' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', dir: 'ltr' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', dir: 'ltr' },
  { code: 'zh', name: 'Chinese', nativeName: '简体中文', flag: '🇨🇳', dir: 'ltr' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', dir: 'ltr' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', dir: 'ltr' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷', dir: 'ltr' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩', dir: 'ltr' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱', dir: 'ltr' },
];
