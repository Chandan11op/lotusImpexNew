# APPLICATION ROUTING SPECIFICATION — LOTUS IMPEX & AERON

This document provides the canonical map of all public web routes, internal CRM routes, and REST API endpoints for the Lotus Impex & Aeron industrial platform.

---

## 1. Public-Facing Web Routes

All public routes inherit the unified `PublicLayout`, including the industrial navbar, breadcrumb navigation, language switcher, theme toggle, and responsive footer.

| URL Route | Component | Purpose & Features |
|---|---|---|
| `/` | `HomePage` | Industrial hero, 20 Priority Products showcase, Category showcase, Industry overview, Quality & MTC process, RFQ CTA, WhatsApp integration. |
| `/about` | `AboutPage` | Company background (Lotus Impex distribution heritage), provisional product branding disclosure, partner network, compliance integrity. |
| `/products` | `CataloguePage` | Search by product name/SKU, category filter, material grade filter (SS 304 / SS 316L), finish filter (EP / MP), sorting, pagination. |
| `/products/:categorySlug` | `CategoryPage` | Focused category overview (e.g. Sanitary Pipes, Tri-Clamp Fittings, Sanitary Valves) with category-filtered products. |
| `/products/:categorySlug/:productSlug` | `ProductDetailPage` | Detailed product specifications, dimensional tables, surface finish Ra, MTC notice, 360 viewer, "Get Price on WhatsApp" / "Enquire for Size & Price". |
| `/products/:slug` | `ProductDetailPage` | Direct product lookup fallback by slug. |
| `/industries` | `IndustriesPage` | Overview of target process sectors (Pharma, Biotech, Dairy, Food & Beverage, Breweries, Chemical, Water Treatment). |
| `/industries/:slug` | `IndustryDetailPage` | Deep-dive technical application guidance, sanitary standards (ASME BPE, 3-A, EHEDG) and recommended components. |
| `/quality` | `QualityPage` | Standards and verification documentation: EN 10204 3.1 MTCs, surface roughness profilometry (Ra < 0.4 µm), hydrostatic testing. |
| `/supply-process` | `SupplyProcessPage` | Step-by-step RFQ to delivery workflow: Enquiry intake, dimensional verification, MTC validation, protective packaging, global logistics. |
| `/media` | `MediaPage` | Technical gallery: process photos, technical drawings, inspection protocols, downloadable product brochures. |
| `/request-quote` | `RequestQuotePage` | Dedicated high-conversion RFQ form capturing item specs, required grade, dimensional requirements, target delivery, and RFQ message. |
| `/submit-boq` | `SubmitBoqPage` | Secure Bill of Quantities submission portal: customer details, project description, drag-and-drop secure file attachment (.pdf, .xlsx, .dwg). |
| `/contact` | `ContactPage` | Full company contact channels, Google Map coordinates reference, business hours, WhatsApp chat trigger, enquiry form. |
| `/faq` | `FaqPage` | Categorized technical, commercial, quality, and export delivery FAQs. |
| `/privacy` | `PrivacyPage` | Corporate privacy policy, GDPR/DPDP data compliance, quote inquiry data retention terms. |
| `/terms` | `TermsPage` | B2B quotation terms, supply disclaimers, inspection terms, limitation of liability. |
| `*` | `NotFoundPage` | Custom industrial 404 error page with quick links back to catalogue and search. |

---

## 2. Authentication & CRM Dashboard Routes

All CRM routes require authenticated sessions and validate server-side Role-Based Access Control (RBAC).

| URL Route | Component | Minimum Role | Module Description |
|---|---|---|---|
| `/login` | `LoginPage` | Public | Secure credentials login (email & password) with rate-limiting and audit log recording. |
| `/admin` | `Navigate` | Public | Convenience redirect to `/crm`. |
| `/crm` | `CrmOverviewPage` | `sales` / `accounts` / `inventory` / `super_admin` | Operational KPI metrics, active pipeline breakdown, conversion rates, overdue follow-up alerts. |
| `/crm/enquiries` | `EnquiriesPage` | `sales` / `super_admin` | 8-stage pipeline management (New, Contacted, Quotation Sent, Follow-up, Negotiation, Order Confirmed, Lost, On Hold), lead assignment, internal notes, activity log. |
| `/crm/quotations` | `QuotationsPage` | `sales` / `accounts` / `super_admin` | Quotation generator, line items, automatic server totals, PDF generation/print view, status tracking (Draft, Sent, Revised, Accepted, Rejected). |
| `/crm/customers` | `CustomersPage` | `sales` / `accounts` / `super_admin` | Customer directory, email deduplication, linked RFQs and quotes, purchase ledgers. |
| `/crm/tasks` | `TasksPage` | `sales` / `accounts` / `inventory` / `super_admin` | Follow-up and task manager, priority flags, due dates, overdue badges, completion notes. |
| `/crm/products` | `ProductsPage` | `inventory` / `super_admin` | Product catalogue CRUD, priority configuration, published status, stock/procurement status updates. |
| `/crm/reports` | `ReportsPage` | `accounts` / `super_admin` | Analytical reporting by stage, country, and product demand; RFC 4180 CSV export. |
| `/crm/users` | `UsersPage` | `super_admin` | Staff account creation, role assignment (`super_admin`, `sales`, `accounts`, `inventory`), password reset, account deactivation. |
| `/crm/settings` | `SettingsPage` | `super_admin` | Company identity, provisional product brand name, contact channels, WhatsApp integration health status, audit logs inspection. |

---

## 3. Backend REST API Endpoints

Mounted under both `/api` and `/api/v1` for backward and versioned compatibility.

### Authentication & Users
- `POST /api/auth/login` — Authenticate user, issue HTTP-only cookie and JWT.
- `POST /api/auth/logout` — Clear session cookie.
- `GET /api/auth/me` — Return current authenticated user profile and permissions.
- `GET /api/users` — List staff members (Super Admin only).
- `POST /api/users` — Create new staff account with designated role.
- `PATCH /api/users/:id` — Update staff profile, role, or active status.
- `POST /api/users/:id/reset-password` — Administrative password reset.

### Product Catalogue
- `GET /api/products/public` — Public search and filtered products list (published only).
- `GET /api/products/public/priority` — Top 20 priority products for homepage and showcases.
- `GET /api/products/public/categories` — List distinct product categories.
- `GET /api/products/public/:slug` — Retrieve single product details by slug.
- `GET /api/products/admin` — CRM product list with stock status and priority.
- `POST /api/products/admin` — Create new product (Super Admin / Inventory).
- `PATCH /api/products/admin/:id` — Update product details and priority.
- `DELETE /api/products/admin/:id` — Remove product (Super Admin only).

### Enquiries & Leads
- `POST /api/enquiries/public` — Submit public RFQ; auto-creates/matches Customer record.
- `GET /api/enquiries` — CRM enquiries list with filters (status, priority, search, date range).
- `GET /api/enquiries/:id` — Get full enquiry details with activity history and customer link.
- `PATCH /api/enquiries/:id/status` — Update enquiry lifecycle status (8 statuses).
- `PATCH /api/enquiries/:id/assign` — Assign lead to a sales staff member.
- `POST /api/enquiries/:id/notes` — Add internal note and append to activity log.

### Quotations
- `GET /api/quotations` — List quotations with status, customer, and date filters.
- `GET /api/quotations/:id` — Retrieve quotation details, line items, and audit log.
- `POST /api/quotations` — Create quotation with server-calculated subtotal, tax, and grand total.
- `PATCH /api/quotations/:id` — Update quotation draft or create revision.
- `PATCH /api/quotations/:id/status` — Transition quotation status (Draft, Sent, Accepted, etc.).

### Tasks & Follow-ups
- `GET /api/tasks` — List tasks filtered by user, status, priority, and overdue flag.
- `POST /api/tasks` — Schedule task or follow-up linked to enquiry or customer.
- `PATCH /api/tasks/:id/complete` — Mark task as completed with resolution notes.

### Customers
- `GET /api/customers` — List deduplicated customer directory.
- `GET /api/customers/:id` — Retrieve customer details and historical RFQ/quote ledger.
- `PATCH /api/customers/:id` — Update customer notes and organization details.

### File Uploads & BOQs
- `POST /api/uploads/boq` — Secure file upload for customer RFQ documents (.pdf, .xlsx, .dwg).
- `GET /api/uploads/download/:fileId` — Authenticated/tokenized file download endpoint preventing unauthorized access.

### WhatsApp Integration
- `GET /api/integrations/whatsapp/webhook` — Meta Webhook verification handshake (`hub.challenge`).
- `POST /api/integrations/whatsapp/webhook` — Process incoming WhatsApp messages, customer matching, enquiry linking.
- `GET /api/integrations/whatsapp/status` — Health and configuration status.

### Company Settings & Audit Logs
- `GET /api/settings/public` — Public company identity, brand, contact channels.
- `GET /api/settings` — CRM company configuration details.
- `PUT /api/settings` — Update company settings, brand name, WhatsApp business number (Super Admin).
- `GET /api/audit-logs` — Immutable audit log of administrative and CRM operations.
- `GET /api/reports/kpis` — Real-time database metrics for CRM dashboard.
- `GET /api/reports/export` — Streamed RFC 4180 CSV export of enquiries.
