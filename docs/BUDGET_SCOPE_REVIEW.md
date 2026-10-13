# LOTUS IMPEX — BUDGET SCOPE REVIEW & VALIDATION
**Document Version:** 1.0  
**Review Date:** October 12, 2026  
**Auditor:** Senior Full-Stack Technical Auditor & Solution Architect  
**Client / Entity:** Lotus Impex, Mumbai, Maharashtra, India  
**Scope:** Public B2B Export Portal & Unified Internal CRM Enquiry System  

---

## 1. Budget Summary Overview

The client proposal specifies the following commercial baseline:

| Cost Item | Proposed Amount | Billing Type | Status in this Review |
|---|---|---|---|
| **One-time Full-Stack Development** | ₹2,70,000 | One-time Capital Expenditure | **Validated with Scope Boundary Adjustments** |
| **Monthly Hosting, Database & Media Infrastructure** | ₹6,000 | Recurring Operational Expenditure | **Validated (Subject to Media Storage Scaling)** |
| **Monthly Maintenance & Technical Support** | ₹10,000 | Recurring Operational Expenditure | **Validated with Service Level Definition (SLA)** |
| **Combined Monthly Management** | ₹16,000 | Monthly Recurring Total | **Realistic for Post-Launch Steady State** |

---

## 2. Line-by-Line Allocation & Deliverables Analysis

### Item 1: One-Time Full-Stack Development (Allocation: ₹2,70,000)

#### A. Actual Scope & Deliverables
1. **Public B2B Web Portal**:
   - High-performance responsive website (Desktop, Tablet, Mobile).
   - Dynamic product catalogue with multi-facet filtering (Taxonomy, Material Grades SS304/SS316L, End Connections, Standards ASME BPE/DIN 11850).
   - Product detail views with technical specifications, dimensional drawings, and compliance certificates.
   - Interactive 360° product inspection simulation component.
   - Public RFQ modal and quote capture pipeline with client-side & server-side validation.
   - Multilingual interface supporting 15 international languages with RTL layout for Arabic.
   - System theme detection (Light, Dark, and System modes) with persistent user preference.
2. **Unified Internal CRM System**:
   - Single shared backend and unified MongoDB database (no third-party CRM subscription needed).
   - Live KPI dashboard with active pipeline tracking, enquiry stage progression, and conversion analytics.
   - 7-stage enquiry workflow (`new` → `contacted` → `qualified` → `quotation_sent` → `negotiation` → `won` / `lost`).
   - Customer master ledger with automatic email deduplication and RFQ history.
   - Staff task manager with automated follow-up scheduling, overdue alerts, and completion tracking.
   - Multi-channel communication logger (Phone, Email, WhatsApp).
   - Immutable audit trail / activity history for each enquiry.
   - RFC 4180 compliant CSV export engine for offline analysis.
   - Role-based access control (Super Admin vs. Sales Staff).
3. **Quality Assurance, Security & Technical SEO**:
   - Zod schema validation and bcrypt password hashing.
   - HTTP-only cookie JWT session management.
   - Comprehensive automated unit and integration test suite.
   - Semantic HTML5, structured robots.txt, XML sitemaps, and Open Graph meta tags.

#### B. Work Already Completed (Audited in Repository)
- Decoupled monorepo initialized and configured.
- Complete backend API with 9 controllers, 7 models, and 15 passing Vitest tests.
- Complete frontend application with 17 routed views, Tailwind design system, and clean TypeScript compilation.
- Local persistent MongoDB and in-memory fallback architecture implemented.
- End-to-end integration verified from public RFQ submission to CRM audit history.

#### C. Remaining Work Before Production Launch
- Production domain provisioning and TLS/SSL certificate installation.
- Dedicated cloud database setup (e.g., MongoDB Atlas M10 or self-hosted replica set).
- Professional translation review of full product descriptions beyond the core UI dictionary.
- Collection of high-resolution multi-frame photographic assets for actual 360° turntable captures.
- Email / WhatsApp notification gateway integration (SendGrid, AWS SES, or Twilio).

#### D. Risk of Underestimation & Boundary Exclusions
- **Risk Level: Moderate.**
- **Excluded Items (Must be clearly communicated to client):**
  1. *Professional Product Photography & 360° Studio Rigs*: Studio turntable capture of physical stainless valves/pipes is an external media production cost, not software development.
  2. *Certified Technical Translation*: While the extensible i18n architecture and core UI translations are delivered, translating extensive technical engineering documentation into 15 languages requires certified native technical translators or external translation services.
  3. *Payment Gateway Integration*: B2B export transactions operate on Letters of Credit (LC), bank telegraphic transfers (TT), or advance invoices; consumer payment gateways (Razorpay/Stripe checkout) are excluded from the current RFQ scope.

#### E. Budget Recommendation for Item 1
**₹2,70,000 is fair and well-balanced** for the delivered scope, provided the exclusions above are formally documented.

---

### Item 2: Monthly Hosting, Database & Media Infrastructure (Allocation: ₹6,000 / month)

#### A. Actual Deliverables
- Cloud VPS / App Server (e.g., DigitalOcean Droplet, AWS Lightsail, or Hetzner Cloud: 2 vCPU, 4GB RAM).
- Managed Cloud MongoDB (e.g., MongoDB Atlas shared tier or dedicated cluster).
- Cloud Object Storage & CDN (e.g., Cloudflare R2 / AWS S3 + Cloudflare CDN) for product images, PDFs, and 360° photo assets.
- Automated daily database backups with 30-day snapshot retention.

#### B. Cost Breakdown Estimation (Indicative Third-Party Pass-Through)
- Application Server (Node.js API + Static Frontend): ~$15 - $20 / month (~₹1,300 - ₹1,700)
- Database (MongoDB Atlas M2/M5 or managed equivalent): ~$15 - $25 / month (~₹1,300 - ₹2,100)
- S3/R2 Media Storage & Global Cloudflare CDN: ~$5 - $10 / month (~₹450 - ₹900)
- Domain, SSL management, and automated backup storage: ~$5 / month (~₹450)
- **Estimated Net Third-Party Provider Cost: ~₹3,500 - ₹4,800 / month.**
- **Infrastructure Maintenance Buffer: ~₹1,200 - ₹2,500 / month.**

#### C. Risk of Underestimation
- **Risk Level: Low.**
- The ₹6,000/month allocation comfortably covers actual cloud resource consumption for a high-traffic B2B catalog and internal CRM with healthy headroom.

---

### Item 3: Monthly Maintenance & Technical Support (Allocation: ₹10,000 / month)

#### A. Actual Deliverables & SLA
- Up to 10 hours per month of proactive technical maintenance and reactive support.
- Dependency security updates (Node.js security patches, npm audit remediations).
- Operating system security updates and database indexing optimization.
- Regular database restore drills and automated backup verification.
- Bug fixing and minor UI adjustments (e.g., adding a new product category or modifying contact details).
- 99.9% uptime monitoring and alert triage.

#### B. Risk of Underestimation & Boundary Exclusions
- **Risk Level: Low to Moderate.**
- **Exclusions:** Major feature additions (e.g., building an ERP integration, inventory warehouse barcode scanner, or e-commerce payment checkout) must be billed as separate milestones and are not covered under standard maintenance.

---

### Item 4: Combined Monthly Management (Allocation: ₹16,000 / month)

#### Recommendation
The combined ₹16,000/month (₹6,000 infrastructure + ₹10,000 maintenance) provides an equitable, sustainable retainer that protects both the client (guaranteeing uptime and data integrity) and the engineering team (ensuring compensated support hours).
