# SECURITY & COMPLIANCE CHECKLIST — LOTUS IMPEX & AERON PLATFORM

This document outlines the security controls, authentication safeguards, access control policies, and compliance verifications implemented across the application.

---

## 1. Authentication & Session Security

- [x] **Password Hashing:** Passwords hashed with `bcryptjs` using a salt work factor of 10. Passwords are never stored in plaintext.
- [x] **JWT Token Generation:** Tokens signed using server-side `JWT_SECRET` with explicit expiry (24h standard session).
- [x] **Secure Cookie Storage:** Session JWT transmitted in HTTP-only, SameSite=Lax cookie with `secure: true` in production environments.
- [x] **No Password Leakage:** Schema and controllers explicitly omit `passwordHash` in all user retrieval queries (`select('-passwordHash')`).
- [x] **Initial Super Admin Security:** Default passwords are not hardcoded in source files; provisioned through environment variables (`ADMIN_EMAIL`, `ADMIN_PASSWORD`).
- [x] **Rate Limiting on Authentication:** Brute-force protection applied on `/api/auth/login` (maximum 10 attempts per 15 minutes per IP).

---

## 2. Authorization & Role-Based Access Control (RBAC)

- [x] **Server-Side Authorization on Every Protected Route:** Never rely on frontend route guards alone. Every protected API route enforces `authenticateJWT` and `requireRole()`.
- [x] **Role Segregation:**
  - `super_admin`: Full system control, employee management, system settings, audit logs.
  - `sales`: Enquiries, customer records, follow-ups, quotation creation and management.
  - `accounts`: Financial records, quotation verification, sales performance reports.
  - `inventory`: Product catalog fields, stock confirmation, dimensional availability.
- [x] **Tamper Resistance:** Users cannot elevate their own role or deactivate their own administrative session.

---

## 3. Input Validation & Data Sanitization

- [x] **Strict Schema Validation:** All incoming request bodies validated using `Zod` schemas before hitting controllers.
- [x] **NoSQL Injection Guard:** Queries cast against explicit Mongoose schema types. User input used in regex queries is sanitized of special characters (`\`, `$`, `^`, `*`).
- [x] **XSS Mitigation:** React JSX automatically escapes dangerous markup. Input strings are trimmed and stripped of script tags.
- [x] **Duplicate Submission Protection:** Public RFQ endpoint implements idempotent submission tracking and IP rate limiting (15 submissions/hour/IP).

---

## 4. File Upload Security & BOQ Protection

- [x] **Customer BOQ Confidentiality:** Uploaded customer documents, drawings, and spreadsheets are NOT placed in public directories.
- [x] **MIME & Extension Whitelisting:** Strict restriction to approved business formats: `.pdf`, `.xlsx`, `.xls`, `.csv`, `.dwg`, `.dxf`, `.png`, `.jpg`. Executable types (`.exe`, `.sh`, `.bat`, `.js`, `.php`) are blocked.
- [x] **Randomized Filenames (UUID):** Storage files assigned random UUID identifiers on disk to prevent path traversal (`../`) and filename collision.
- [x] **Size Quotas:** Maximum file upload limit enforced at 25 MB per file.
- [x] **Private Download Gatekeeper:** File access routed through authenticated endpoint `/api/uploads/download/:fileId`.

---

## 5. Network, Headers & Transport Security

- [x] **HTTP Security Headers:** Express `helmet()` configured with secure CSP and cross-origin resource policies.
- [x] **Safe CORS Configuration:** Whitelisted to authorized frontend client URLs (`CLIENT_URL`); wildcard origins (`*`) blocked for authenticated endpoints.
- [x] **HTTPS Enforcement:** Production deployment requires TLS 1.3 encryption for all public and API communication.
- [x] **Secure Secrets Management:** No production credentials, database URIs, or API keys committed to Git. Managed via `.env` and host environment injection.

---

## 6. Audit Trail & Compliance Logging

- [x] **Immutable Audit Log:** Administrative events (user creation, role assignment, password reset, quote generation, CSV export) appended to `AuditLog` collection.
- [x] **Log Integrity:** Audit log records store actor ID, IP address, timestamp, affected entity ID, and delta changes.
