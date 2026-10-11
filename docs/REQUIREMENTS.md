# Lotus Impex — Requirements & Scope Matrix

This document clarifies confirmed business requirements, working assumptions, demonstration-only features, and unresolved questions for the Lotus Impex project.

---

## 1. Confirmed Requirements

1. **Company Name & Identity**: Primary company name is **Lotus Impex**, based in Mumbai, India.
2. **Product Taxonomy**:
   - Stainless-steel sanitary tubes and pipes
   - Stainless-steel pipe fittings
   - SS dairy fittings
   - SS TC clamps and ferrules
   - Stainless-steel bends and elbows
   - Stainless-steel tees
   - Stainless-steel unions
   - Stainless-steel reducers
   - Stainless-steel flanges
   - Stainless-steel valves (butterfly valves, sanitary/dairy valves, DIN unions, electropolished fittings).
3. **Core Target Industries**: Dairy, Food Processing, Pharmaceutical, Chemical, and Process Piping.
4. **Unified System Architecture**:
   - Public B2B website for catalog discovery and enquiry generation.
   - Private CRM system for enquiry tracking, customer management, follow-ups, product management, and reporting.
   - Single backend and database: enquiries submitted publicly must immediately populate the CRM database.
5. **Demonstration Super Admin Account**:
   - Email: `chandan110906@gmail.com`
   - Initial local password: `Chandan` (hashed with bcrypt, never stored plaintext)
   - Role: `super_admin`
6. **Enquiry Lifecycle**:
   - Status transitions: `New` → `Contacted` → `Qualified` → `Quotation Sent` → `Negotiation` → `Won` / `Lost`
   - Reopen capability if needed.
   - Activity history and communication logging.
7. **Design Aesthetics**:
   - Premium industrial B2B aesthetic.
   - Stainless steel tones, deep navy/charcoal typography, restrained blue accents.
   - No fake claims, unsupported ISO certificates, or artificial statistics.

---

## 2. Working Assumptions

1. **Product Brand ("Aeron")**:
   - The proposed brand name "Aeron" is treated as an optional draft brand.
   - It is configurable in company settings rather than hardcoded everywhere.
2. **Database Resilience**:
   - If an external MongoDB instance (`MONGODB_URI`) is specified (local or Atlas), the system connects to it.
   - If no MongoDB instance is running locally, the server initializes `mongodb-memory-server` in development mode to provide a zero-friction, out-of-the-box local demonstration.
3. **Product Attributes**:
   - Standard sanitary specifications (e.g., SS304/SS316L, 0.5" to 4" OD, SMS/DIN/TC connections, Ra < 0.8 µm / Ra < 0.4 µm mirror/electropolished) are used as representative realistic data and flagged as demonstration data where appropriate.
4. **Role Permissions**:
   - `super_admin`: Full access to CRM, user management, product CRUD, settings, and reporting.
   - `staff`: Access to assigned/permitted enquiries, customer directory, logging follow-ups and communications. Cannot manage users or delete core configurations.

---

## 3. Demonstration-Only Functionality (Clearly Labelled)

1. **360-Degree Product View**:
   - Rendered as an interactive multi-angle rotation simulation / placeholder with real angle frames to showcase the intended UI/UX capability without claiming proprietary 3D CAD assets.
2. **External Email / WhatsApp Dispatch**:
   - The system records communication logs ("Log Call", "Log Email", "Log WhatsApp", "Log Meeting") into the database timeline. External automated mail/messaging gateways (e.g., SendGrid, Twilio WhatsApp API) are disabled until production API credentials are provided.
3. **Fictional Customer & Enquiry Data**:
   - Seeded records (e.g., Amul Dairy, Serum Biotech, Almarai Procurement) are clearly marked as realistic demo data for pipeline demonstration purposes.
4. **File Uploads**:
   - Technical specification enquiry files support client-side file selection and safe demo handling.

---

## 4. Unresolved Questions for Production Deployment

1. **Final Brand Confirmation**: Will "Aeron" be the official registered brand for sanitary fittings, or will products be sold under "Lotus Impex"?
2. **Company Credentials**: Exact incorporation date, factory/warehouse addresses in Mumbai, GSTIN, and actual certified testing reports (MTR/EN 10204 3.1).
3. **Email Delivery Provider**: SMTP or Transactional API (SendGrid, AWS SES, Resend) preferences for enquiry notification alerts.
4. **WhatsApp Business API**: Dedicated phone number and BSP (Meta Cloud API, Gupshup, Wati) for automatic lead dispatch.
5. **Production Hosting**: Preferred cloud infrastructure (e.g., AWS EC2, DigitalOcean, Render, or Vercel + Atlas).
