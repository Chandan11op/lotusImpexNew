# REST API DOCUMENTATION — LOTUS IMPEX & AERON PLATFORM

**Base URL:** `/api` (or `/api/v1`)  
**Format:** JSON  
**Authentication:** HTTP-only JWT Cookie or `Authorization: Bearer <token>`

---

## 1. Authentication & User Endpoints

### `POST /api/auth/login`
Authenticates a user and establishes session via HTTP-only cookie and Bearer token.
- **Request Body:**
  ```json
  {
    "email": "staff@lotusimpex.com",
    "password": "ValidPassword123"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "token": "eyJhbGciOi...",
      "user": {
        "id": "670a49...",
        "name": "Rajesh Sharma",
        "email": "staff@lotusimpex.com",
        "role": "sales"
      }
    }
  }
  ```

### `POST /api/auth/logout`
Clears session cookie and invalidates client session.

### `GET /api/auth/me`
Retrieves currently logged-in user profile, role, and granted permissions.

---

## 2. Product Endpoints

### `GET /api/products/public`
Publicly available catalog products with server-side filtering, search, and pagination.
- **Query Parameters:**
  - `category` (string, optional)
  - `grade` (string, e.g. "SS 316L")
  - `finish` (string, e.g. "EP", "MP")
  - `search` (string, text search across name, SKU, category)
  - `page` (number, default: 1)
  - `limit` (number, default: 12)
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "products": [...],
      "pagination": { "total": 24, "page": 1, "pages": 2, "limit": 12 }
    }
  }
  ```

### `GET /api/products/public/priority`
Retrieves the 20 featured priority products ordered by priority integer.

### `GET /api/products/public/:slug`
Retrieves single product specification details and related category items.

### `POST /api/products/admin` (Requires `super_admin` or `inventory` role)
Creates a new product with full technical specifications.

### `PATCH /api/products/admin/:id` (Requires `super_admin` or `inventory` role)
Updates existing product specifications, published status, or display priority.

---

## 3. Enquiry & Lead Endpoints

### `POST /api/enquiries/public`
Public endpoint to submit a Request for Quotation (RFQ).
- **Request Body:**
  ```json
  {
    "customerName": "Vikram Patel",
    "company": "Gujarat Bio-Pharma Ltd",
    "email": "vikram@gujaratbiopharma.com",
    "phone": "+91 98980 12345",
    "country": "India",
    "productName": "SS 316L Electro-Polished Sanitary Pipe",
    "quantity": 50,
    "unit": "Lengths",
    "materialGrade": "SS 316L",
    "sizeRequirement": "1.5\" OD x 1.65mm WT",
    "message": "Require 50 lengths with EN 10204 3.1 MTC for WFI loop expansion."
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "Enquiry registered successfully",
    "data": {
      "enquiryNumber": "ENQ-20261015-0012",
      "status": "new"
    }
  }
  ```

### `GET /api/enquiries` (Requires CRM login)
Retrieves CRM enquiries list with support for filtering by stage, priority, country, and sales rep.

### `PATCH /api/enquiries/:id/status` (Requires `sales` or `super_admin`)
Transitions enquiry status between 8 stages:
`new` → `contacted` → `quotation_sent` → `follow_up` → `negotiation` → `order_confirmed` → `lost` → `on_hold`.

---

## 4. Quotation Endpoints

### `POST /api/quotations` (Requires `sales` or `super_admin`)
Creates a new formal price quote. Server recalculates and validates all line item math, taxes, and totals.
- **Request Body:**
  ```json
  {
    "enquiryRef": "670c...",
    "customerRef": "670b...",
    "currency": "INR",
    "lineItems": [
      {
        "productName": "SS 316L Electro-Polished Sanitary Pipe 1.5\" OD",
        "sku": "LI-EP-316L-01",
        "quantity": 50,
        "unit": "Lengths",
        "unitPrice": 4200,
        "discountPercent": 5
      }
    ],
    "taxPercent": 18,
    "deliveryTerms": "Ex-Works Mumbai",
    "paymentTerms": "100% advance against PI",
    "validityDays": 15
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "success": true,
    "data": {
      "quotationNumber": "QT-2026-0001",
      "subtotal": 199500,
      "discountTotal": 10500,
      "taxTotal": 35910,
      "grandTotal": 235410,
      "status": "draft"
    }
  }
  ```

### `GET /api/quotations/:id`
Retrieves quotation details with populated line items and company signature block.

### `PATCH /api/quotations/:id/status` (Requires `sales`, `accounts`, or `super_admin`)
Updates quotation status: `draft` | `sent` | `revised` | `accepted` | `rejected` | `expired`.

---

## 5. Secure Uploads & BOQ

### `POST /api/uploads/boq`
Uploads customer BOQ documents or technical drawings. Enforces:
- Allowed file types: `.pdf`, `.xlsx`, `.xls`, `.csv`, `.dwg`, `.dxf`, `.png`, `.jpg`
- Maximum file size: 25 MB
- Path traversal prevention using UUID file storage
- **Response (201 Created):**
  ```json
  {
    "success": true,
    "data": {
      "fileId": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
      "originalName": "Biphasic_Reactor_BOQ_Rev2.xlsx",
      "size": 184520
    }
  }
  ```

### `GET /api/uploads/download/:fileId`
Private download endpoint. Requires valid authentication or one-time verification token.

---

## 6. WhatsApp Business Integration

### `GET /api/integrations/whatsapp/webhook`
Webhook verification endpoint for Meta WhatsApp Business Platform (`hub.mode`, `hub.verify_token`, `hub.challenge`).

### `POST /api/integrations/whatsapp/webhook`
Webhook listener for incoming WhatsApp inquiries. Validates payload, dedupes incoming message IDs, auto-matches customer by international phone number, and logs communication under CRM.

### `GET /api/integrations/whatsapp/status`
Returns integration connection health and verified phone channel.

---

## 7. Company Settings & Audit Logs

### `GET /api/settings/public`
Returns public business identity, configurable brand name, phone, email, and supported currencies.

### `PUT /api/settings` (Requires `super_admin`)
Updates company entity details, product brand name, and notification routing.

### `GET /api/audit-logs` (Requires `super_admin`)
Returns immutable security audit trail of staff logins, status changes, quotation generations, and CSV exports.
