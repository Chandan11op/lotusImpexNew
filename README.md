# Lotus Impex — Full-Stack B2B Platform & Unified CRM Demonstration

A full-stack enterprise B2B website and integrated enquiry-management CRM platform designed for **Lotus Impex**, a Mumbai-based distributor and supplier of precision stainless-steel sanitary products, tubes, pipes, valves, Tri-Clamp fittings, and fluid handling components.

---

## 1. System Architecture

The project features a decoupled, unified MERN architecture where the public-facing product catalogue and the private CRM dashboard share the exact same Node.js/Express backend, database, and business logic.

When a public visitor submits a product quotation request (RFQ) or contact enquiry, it is immediately persisted to MongoDB, linked to a customer account (with automatic email deduplication), assigned a unique reference code (e.g. `ENQ-20261011-0108`), and instantly pops up in the CRM dashboard.

```
lotusImpexNew/
├── client/                     # React 18 + Vite + TypeScript + Tailwind CSS
│   ├── src/
│   │   ├── components/         # UI Primitives & Public Visuals (360 Viewer, Modals, Cards)
│   │   ├── layouts/            # PublicLayout & CrmLayout (Protected)
│   │   ├── pages/              # Public Pages & CRM Dashboard Modules
│   │   ├── services/           # Centralized Fetch API client
│   │   ├── hooks/              # useAuth session hook
│   │   └── types/              # TypeScript interfaces
├── server/                     # Node.js + Express + TypeScript + Mongoose
│   ├── src/
│   │   ├── config/             # Dual MongoDB Connector (Real DB + In-Memory Fallback)
│   │   ├── controllers/        # Auth, Products, Enquiries, Customers, Follow-ups, Reports
│   │   ├── middleware/         # Auth & RBAC guards, Error handling, Rate limiters
│   │   ├── models/             # User, Product, Enquiry, Customer, FollowUp, CommLog, Settings
│   │   ├── routes/             # Versioned REST endpoints (/api/v1)
│   │   ├── seed/               # Idempotent Demonstration Dataset Seeder
│   │   └── validators/         # Zod request validation schemas
│   └── tests/                  # Automated Vitest test suite (15 integration tests)
├── docs/                       # Project Documentation
│   ├── PROJECT_PLAN.md
│   ├── REQUIREMENTS.md
│   └── API_SPECIFICATION.md
├── .env.example
├── package.json
└── README.md
```

---

## 2. Key Features

### A. Public Website
- **Industrial Aesthetic**: Clean, modern stainless steel and deep navy design tailored for international B2B procurement in dairy, pharma, and food processing industries.
- **Searchable Product Catalogue**: Filter by category, material grade (SS 316L / SS 304), and free-text search.
- **Interactive 360° Inspection Simulation**: Clearly labelled 360-degree rotation view with angle and bore zoom inspection.
- **Detailed Specifications**: Full dimensional data, standards (3-A, DIN, SMS, ASME BPE), surface roughness (Ra ≤ 0.8 µm / Ra ≤ 0.4 µm EP).
- **Public Quotation Modal (RFQ)**: Direct enquiry form that pre-populates product details and logs into the CRM.
- **Technical SEO Foundation**: Semantic HTML, meta tags, Open Graph headers, XML sitemap (`/sitemap.xml`), and `robots.txt`.

### B. Private CRM Dashboard (`/crm`)
- **Real-Time Database KPIs**: Total enquiries, new leads, active quotes, won orders, overdue follow-ups, and conversion rates derived directly from MongoDB queries.
- **Enquiry Lifecycle Management**: Status progression from `New` → `Contacted` → `Qualified` → `Quotation Sent` → `Negotiation` → `Won` / `Lost`.
- **Customer Directory**: Deduplicated customer profiles with historical quotation records and internal notes.
- **Product Administration**: Add, edit, and toggle public visibility of catalogue items with instant reflection on the website.
- **Follow-up Tasks Engine**: Automatic 24-hour reminder generation upon receiving RFQs; categorizes tasks into Due Today, Overdue, Upcoming, and Completed with completion notes.
- **Communication Timeline**: Log calls, emails, WhatsApp messages, meetings, and quotations into an auditable activity history.
- **Analytics & Structured CSV Export**: Visual trend graphs (Recharts) and one-click RFC 4180 CSV export for ERP integration.
- **Super Admin & Staff Role Controls**: Server-side enforced access control preventing unauthorized role escalation.

---

## 3. Demonstration Login Credentials

For local evaluation, use the pre-seeded Super Administrator account:

| Attribute | Local Demonstration Credential |
| :--- | :--- |
| **Email** | `chandan110906@gmail.com` |
| **Password** | `Chandan` |
| **Role** | `super_admin` |

*(A secondary staff account is also seeded: `staff@lotusimpex.com` / `StaffUser2026`)*

> [!NOTE]
> The login screen at `/login` provides one-click "Demo Autofill" buttons for rapid evaluation.

---

## 4. Getting Started & Installation

### Prerequisites
- Node.js (v18+ recommended; tested on Node.js v26)
- npm (v9+)
- *(Optional)* MongoDB instance (Local or MongoDB Atlas). If no database is configured, the server automatically starts an internal in-memory MongoDB instance for **zero-configuration out-of-the-box local testing**.

### Step 1: Install Dependencies
Run from the root directory:
```bash
# Install root orchestrator dependencies
npm install

# Install server dependencies
cd server && npm install && cd ..

# Install client dependencies
cd client && npm install && cd ..
```

### Step 2: Seed the Demonstration Database
The seed script initializes products across all required categories, realistic sample enquiries in every pipeline stage, customer records, follow-up reminders, and the Super Admin account:
```bash
npm run seed --prefix server
```

### Step 3: Run the Full-Stack Application
Start both the backend REST API (port 5000) and the Vite frontend (port 5173) concurrently:
```bash
npm run dev
```

Open your browser to:
- **Public Website**: [http://localhost:5173](http://localhost:5173)
- **CRM Login**: [http://localhost:5173/login](http://localhost:5173/login)
- **REST API Health Check**: [http://localhost:5000/api/v1/health](http://localhost:5000/api/v1/health)

---

## 5. Automated Test Suite

A comprehensive automated integration test suite is located in `server/tests/api.test.ts`.

To execute the tests:
```bash
npm test --prefix server
```

### Test Results Summary:
```
✓ tests/api.test.ts (15 tests passed)
  ✓ 1. Authentication & Security Tests (Valid demo login, invalid login rejection, /auth/me profile, 401 unauthenticated guard)
  ✓ 2. Role-Based Access Control (RBAC) (Super Admin access, staff 403 prevention, staff creation)
  ✓ 3. Public Catalogue & Product CRUD (Only published products returned, category & text search, admin product creation)
  ✓ 4. End-to-End Public Enquiry Submission & Persistence (Public RFQ submission, MongoDB persistence, customer deduplication, auto 24h follow-up generation, status progression timeline)
  ✓ 5. Follow-Up Task Management (Summary counts, complete task action)
  ✓ 6. Dashboard Overview Metrics (Live KPI aggregation, pipeline data calculations)

Test Files:  1 passed (1)
Tests:       15 passed (15)
```

---

## 6. Configurable Brand Architecture

- **Company Entity**: Lotus Impex (Mumbai, India).
- **Product Line Brand**: *Aeron* is provisionally designated as a configurable draft brand in `CompanySettings`. It is not forced across the company identity and can be updated anytime from the CRM Settings tab.

---

## 7. Production Readiness Checklist

Before moving from local demonstration to live internet deployment:

1. **Environment Variables**:
   - Set a strong, random `JWT_SECRET` and `COOKIE_SECRET` in `.env`.
   - Provide a persistent production MongoDB Atlas connection URI (`MONGODB_URI`).
2. **Cookie Security**:
   - In production (`NODE_ENV=production`), session cookies automatically enable `secure: true` (HTTPS only) and `sameSite: 'strict'`. Ensure SSL/TLS is terminated properly.
3. **Transactional Email**:
   - Integrate an email delivery service (SendGrid, AWS SES, or Resend) into `server/src/services/` to dispatch automatic email receipts when RFQs are received.
4. **WhatsApp Business API**:
   - Connect Meta Cloud API or a Business Solution Provider (Wati, Gupshup) for automated lead forwarding.
5. **Verified Company Documents**:
   - Replace sample company descriptions with finalized incorporation dates, factory addresses, GSTIN, and actual certified EN 10204 3.1 mill test reports.
