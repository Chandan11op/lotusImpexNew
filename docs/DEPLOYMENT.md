# DEPLOYMENT & PRODUCTION RUNTIME GUIDE — LOTUS IMPEX & AERON PLATFORM

This guide specifies the hosting topology, environment variable provisioning, build pipeline, database connection setup, and production hardening procedures for the platform.

---

## 1. Hosting Architecture & Topology

The platform consists of a decoupled MERN architecture:

```
[ DNS / CDN (Cloudflare) ]
        │
   ┌────┴──────────────────────────┐
   │                               │
   ▼                               ▼
[ Frontend Web App ]     [ Backend API Server ]
(Vercel / Netlify / Node) (Render / Railway / AWS / VPS)
   │                               │
   │                               ▼
   │                     [ MongoDB Database ]
   │                     (MongoDB Atlas M0/M10 Cluster)
   │                               │
   └───────────────────────────────┘
```

- **Frontend Hosting:** Vercel, Netlify, or static CDN delivery of the Vite production build (`client/dist`).
- **Backend API Hosting:** Dedicated Node.js runtime (e.g. Render Web Service, Railway, AWS ECS/Lightsail, or DigitalOcean Droplet) with persistent process supervision (`pm2` or Docker).
- **Database:** MongoDB Atlas managed cluster (replica set) with automated daily snapshots and IP access whitelisting.
- **Media Storage:** Secure local storage with private permission guards for development; AWS S3 or Cloudflare R2 bucket recommended for production scale.

---

## 2. Environment Variables Configuration

Copy `.env.example` to `.env` on both Server and Client environments.

### Backend (`server/.env` or Host Environment)
```bash
# Server Port & Runtime
PORT=5000
NODE_ENV=production
CLIENT_URL=https://www.lotusimpex.com

# MongoDB Atlas Connection URI
MONGODB_URI=mongodb+srv://<db_user>:<db_password>@cluster0.lotus.mongodb.net/lotus_impex_prod?retryWrites=true&w=majority

# Security Keys (Generate 64+ char random strings)
JWT_SECRET=lotus_production_super_jwt_secret_key_random_string_2026
COOKIE_SECRET=lotus_production_cookie_secret_key_random_string_2026

# Initial Administrative Credentials (Used only on clean seed)
ADMIN_EMAIL=admin@lotusimpex.com
ADMIN_PASSWORD=Complex_Production_Password_#2026!
ADMIN_NAME=Lotus Administrator

# Business Defaults
COMPANY_NAME=Lotus Impex
PRODUCT_BRAND=Aeron
CONTACT_EMAIL=info@lotusimpex.com
CONTACT_PHONE=+91 98200 00000
CONTACT_ADDRESS=Unit 14, Industrial Area, Kanjurmarg West, Mumbai 400078, Maharashtra, India

# Storage & Uploads
UPLOAD_DIR=./uploads
MAX_FILE_SIZE_MB=25

# Optional WhatsApp Business API Credentials
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_WEBHOOK_VERIFY_TOKEN=lotus_whatsapp_verify_token_2026
```

### Frontend (`client/.env` or Vercel Build Environment)
```bash
VITE_API_URL=https://api.lotusimpex.com
VITE_COMPANY_NAME=Lotus Impex
VITE_PRODUCT_BRAND=Aeron
```

---

## 3. Build & Execution Commands

### Local Development
```bash
# Install all dependencies across root, server, and client
npm run install:all

# Launch both Server (port 5000) and Client (port 5173) concurrently
npm run dev

# Run automated tests
npm run test
```

### Production Build
```bash
# Build backend TypeScript
npm run build --prefix server

# Build frontend React bundle
npm run build --prefix client

# Start backend production server
npm run start --prefix server
```

---

## 4. Database Setup & Indexes

When connecting to MongoDB Atlas:
1. Ensure the database user has `readWrite` role on the target database.
2. In Atlas Network Access, add the static IP addresses of your backend API servers (or `0.0.0.0/0` with strong password authentication).
3. The server automatically ensures all required unique indexes (`User.email`, `Product.slug`, `Product.sku`, `Enquiry.enquiryNumber`, `Quotation.quotationNumber`) upon first connection.

---

## 5. Health Check & Monitoring

- **API Health Endpoint:** `GET /api/health`
  - Returns: `{ "status": "healthy", "timestamp": "...", "service": "lotus-impex-api" }`
- **WhatsApp Webhook Health:** `GET /api/integrations/whatsapp/status`
- Monitor logs via PM2 (`pm2 logs`) or platform dashboard.
