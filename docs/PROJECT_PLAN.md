# Lotus Impex — Full-Stack B2B Website & CRM Demonstration
## Project Architecture & Implementation Plan

### 1. Architectural Overview

The application is structured as a decoupled full-stack TypeScript monorepo with an Express/Node.js REST API backend and a React/Vite/Tailwind CSS frontend client.

```
lotusImpexNew/
├── client/                     # Vite + React 18/19 + TypeScript + Tailwind CSS
│   ├── src/
│   │   ├── assets/             # Logos, icons, SVGs, static assets
│   │   ├── components/         # Reusable UI primitives (Button, Modal, Toast, Badge, Card, etc.)
│   │   ├── layouts/            # PublicLayout, CrmLayout, AuthLayout
│   │   ├── pages/              # Public pages & CRM dashboard views
│   │   │   ├── public/         # Home, About, Catalogue, ProductDetail, Industries, Quality, Contact, NotFound
│   │   │   └── crm/            # Overview, Enquiries, Customers, Products, FollowUps, Reports, Users, Settings
│   │   ├── features/           # Domain-specific components & hooks
│   │   │   ├── products/
│   │   │   ├── enquiries/
│   │   │   ├── crm/
│   │   │   └── auth/
│   │   ├── services/           # Axios/Fetch API client with credentials & interceptors
│   │   ├── hooks/              # useAuth, useEnquiries, useProducts, etc.
│   │   ├── types/              # Frontend TypeScript interfaces
│   │   └── utils/              # Formatters, date helpers, CSV export utility
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── package.json
├── server/                     # Node.js + Express + TypeScript
│   ├── src/
│   │   ├── config/             # Environment, DB connection, Cookie/Auth configs
│   │   ├── middleware/         # Auth verify, Role authorize, Rate limiter, Error handler, Validation
│   │   ├── models/             # Mongoose schemas (User, Product, Enquiry, Customer, FollowUp, CommLog, Settings)
│   │   ├── controllers/        # Request handlers for auth, products, enquiries, customers, reports, etc.
│   │   ├── routes/             # REST API routes under /api/v1
│   │   ├── services/           # Business logic & customer deduplication
│   │   ├── validators/         # Zod schemas for input validation
│   │   ├── seed/               # Idempotent demo dataset seeder
│   │   ├── utils/              # JWT/Session tokens, password hashing, standard responses
│   │   └── app.ts / index.ts
│   ├── tests/                  # Automated integration & unit tests
│   ├── tsconfig.json
│   └── package.json
├── docs/                       # Project documentation
│   ├── PROJECT_PLAN.md
│   ├── REQUIREMENTS.md
│   └── API_SPECIFICATION.md
├── .env.example
├── package.json                # Root package with concurrently/scripts
└── README.md
```

---

### 2. Implementation Phases

#### Phase 1: Workspace Inspection & Architectural Design (Current)
- Inspect environment (Node v26, npm v11, empty workspace).
- Create `docs/PROJECT_PLAN.md` and `docs/REQUIREMENTS.md`.

#### Phase 2: Project Setup & Dependencies
- Initialize root `package.json` with workspace orchestrator scripts.
- Scaffold `server/` with Express, TypeScript, Mongoose, Zod, bcryptjs, jsonwebtoken / cookie-session, cors, helmet.
- Configure MongoDB connection with dual support: MongoDB URI (Atlas/Local) + automatic fallback to `mongodb-memory-server` if no external database is configured, ensuring the demo works 100% out-of-the-box.
- Scaffold `client/` with Vite, React, TypeScript, Tailwind CSS, Lucide React, Framer Motion, Recharts.

#### Phase 3: Data Layer, Seeders & Authentication
- Implement Mongoose models:
  - `User`: Email, hashed password, role (`super_admin`, `staff`), name, active status, lastLogin.
  - `Product`: Name, slug, category, material, grade, sizeRange, connectionType, surfaceFinish, industries, specs, images, published, seoTitle, seoDescription.
  - `Enquiry`: Customer details, company, country, productRef, quantity, unit, message, source, status (`new` → `contacted` → `qualified` → `quotation_sent` → `negotiation` → `won` / `lost`), priority, assignedUser, followUpDate, notes, activityHistory, lossReason.
  - `Customer`: Name, email, phone, company, country, linkedEnquiries, notes.
  - `FollowUp`: EnquiryRef, assignedUser, dueDate, taskDescription, priority, status (`pending`, `completed`), completedAt.
  - `CommunicationLog`: EnquiryRef, author, type (`call`, `email`, `whatsapp`, `meeting`, `internal_note`, `quotation_activity`), notes, timestamp.
  - `CompanySettings`: Company name, brand name ("Aeron" draft), contact email, phone, address, social links.
- Implement seed script with local Super Admin credentials: `chandan110906@gmail.com` / `Chandan`.
- Seed comprehensive realistic product taxonomy (tubes, dairy fittings, TC clamps, bends, valves, DIN unions, etc.) and pipeline enquiries.

#### Phase 4: Backend REST API (`/api/v1`)
- `/api/v1/auth`: login, logout, me, refresh.
- `/api/v1/products`: public listing & detail (filtered to published: true), admin CRUD, preview.
- `/api/v1/enquiries`: public submission, admin list/filter/pagination, status update, assign staff, add notes.
- `/api/v1/customers`: directory, search, detail, notes.
- `/api/v1/follow-ups`: list (due today, upcoming, overdue, completed), mark complete, create follow-up.
- `/api/v1/communications`: list by enquiry, create log entry.
- `/api/v1/reports`: aggregates over date range, category breakdown, pipeline conversion, CSV export.
- `/api/v1/users`: admin user management (create staff, toggle status, reset password).
- `/api/v1/settings`: company & brand profile.

#### Phase 5: Public Website Implementation
- Styling & design system: Industrial clean B2B aesthetic, deep navy/charcoal, steel grey accents, subtle borders.
- Responsive Navigation Bar with quick contact & Request Quote CTA.
- Homepage: Hero, Product Categories showcase, Featured Products, Industries & Applications, Quality & Sourcing process overview, Value Proposition, Contact CTA, Footer.
- Catalogue Page: Real-time search, category filters, material/grade filter, responsive cards, pagination/reset.
- Product Detail Page: Image gallery, detailed technical attributes table, interactive 360 viewer placeholder, Related Products, "Request a Quote" modal pre-populating product data.
- Industries Page: Dedicated sections for Dairy, Pharma, Chemical, Process Piping, and Food Processing.
- Quality Page: Sourcing principles, dimensional/surface finish inspection, material documentation approach.
- Contact Page: Working enquiry form, location details (Mumbai), interactive contact methods, business hours.
- Direct Enquiry Integration: Form submits directly to `/api/v1/enquiries`, returning immediate feedback and instantly appearing in CRM.

#### Phase 6: CRM Dashboard Implementation
- Secured route `/crm/*` with authentication guards & role access.
- CrmLayout: Collapsible sidebar, top navigation with breadcrumbs, current user display, quick notifications for overdue follow-ups, logout button.
- CRM Overview: Real-time KPIs derived directly from database queries, conversion pipeline chart, category distribution chart, recent activities feed.
- Enquiry Management: Filter by status, source, country, assigned user; search; detail modal/drawer with status progression timeline, staff assignment, follow-up scheduling, and communication log.
- Customer Directory: Searchable list of business clients, order/enquiry history, client notes.
- Product Management: Super Admin/Staff CRUD interface for products with publish toggle, SEO tags, specs editor.
- Follow-up Management: Tabbed view (Due Today, Overdue, Upcoming, Completed), direct completion button.
- Reporting & Analytics: Date filter, status & source metrics, one-click CSV download.
- User Management: Super Admin interface to add staff members, toggle active status, and view access roles.

#### Phase 7: Technical SEO & Internationalization Foundation
- SEO meta tags, Open Graph, canonical links, robots.txt, XML sitemap.
- Configurable international country selection and language readiness.

#### Phase 8: Testing & Verification
- Automated unit & integration tests covering authentication, RBAC, public enquiry submission, product CRUD, and follow-ups.
- End-to-end verification of Acceptance Flows A through F.
- Production deployment checklist and documentation in `README.md`.
