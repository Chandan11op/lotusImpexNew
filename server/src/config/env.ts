import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env if present
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  mongoUri: process.env.MONGODB_URI || '',
  jwtSecret: process.env.JWT_SECRET || 'lotus_impex_super_secure_jwt_secret_demo_key_2026',
  cookieSecret: process.env.COOKIE_SECRET || 'lotus_impex_cookie_secret_key_demo',
  adminEmail: process.env.ADMIN_EMAIL || 'chandan110906@gmail.com',
  adminPassword: process.env.ADMIN_PASSWORD || 'Chandan',
  adminName: process.env.ADMIN_NAME || 'Chandan (Super Admin)',
  companyName: process.env.COMPANY_NAME || 'Lotus Impex',
  productBrand: process.env.PRODUCT_BRAND || 'Aeron',
  isProduction: process.env.NODE_ENV === 'production',
};
