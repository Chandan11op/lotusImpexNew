# Lotus Impex — REST API Specification (`/api/v1`)

All endpoints return JSON responses adhering to the following envelope:
```json
{
  "success": true,
  "message": "Optional descriptive status message",
  "data": { ... }
}
```

---

## 1. Authentication Endpoints

### `POST /api/v1/auth/login`
- **Rate Limit**: 30 attempts per 15 minutes per IP.
- **Body**:
  ```json
  {
    "email": "chandan110906@gmail.com",
    "password": "Chandan"
  }
  ```
- **Response**: Sets `lotus_auth_token` HTTP-only session cookie. Returns token and user profile object.

### `POST /api/v1/auth/logout`
- Clears session cookie.

### `GET /api/v1/auth/me`
- **Auth**: Required (`lotus_auth_token` cookie or `Bearer <token>`).
- **Response**: Current user profile (id, name, email, role, phone, lastLogin).

---

## 2. Product Endpoints

### `GET /api/v1/products/public`
- **Auth**: Public.
- **Query Parameters**:
  - `search`: Case-insensitive text query matching name, category, or description.
  - `category`: Filter by product category.
  - `grade`: Filter by steel grade (e.g., `316L`, `304`).
  - `page`: Page index (default: `1`).
  - `limit`: Items per page (default: `12`).
- **Response**: Paginated array of published products.

### `GET /api/v1/products/public/:slug`
- **Auth**: Public.
- **Response**: Single product detail and related items in the same category.

### `GET /api/v1/products/public/categories`
- **Auth**: Public.
- **Response**: Array of categories with counts.

### `GET /api/v1/products/admin`
- **Auth**: Required (`super_admin` or `staff`).
- **Response**: Complete catalog including unpublished items.

### `POST /api/v1/products/admin`
- **Auth**: Required.
- **Body**: Complete product specification with validation.

### `PUT /api/v1/products/admin/:id`
- **Auth**: Required. Updates product fields.

### `DELETE /api/v1/products/admin/:id`
- **Auth**: Required (`super_admin` only).

---

## 3. Enquiry & RFQ Endpoints

### `POST /api/v1/enquiries/public`
- **Auth**: Public.
- **Rate Limit**: 20 requests per 10 minutes per IP.
- **Body**:
  ```json
  {
    "customerName": "Rajesh Mehta",
    "company": "Amul Dairy Cooperative",
    "email": "rajesh@amuldairy.example.com",
    "phone": "+91 98250 12345",
    "country": "India",
    "productName": "Sanitary Stainless Steel Tubes ASTM A270",
    "quantity": 1200,
    "unit": "Meters",
    "message": "Specifications for Anand milk processing plant...",
    "preferredContactMethod": "Email"
  }
  ```
- **Behavior**:
  1. Deduplicates / creates `Customer` record.
  2. Generates sequential `enquiryNumber` (`ENQ-YYYYMMDD-XXXX`).
  3. Saves `Enquiry` with initial activity log.
  4. Automatically registers a 24-hour `FollowUp` task reminder for sales staff.

### `GET /api/v1/enquiries`
- **Auth**: Required.
- **Query Parameters**: `status`, `source`, `country`, `priority`, `assignedUserId`, `search`, `page`, `limit`.

### `GET /api/v1/enquiries/:id`
- **Auth**: Required. Returns enquiry detail, customer reference, and linked follow-ups.

### `PATCH /api/v1/enquiries/:id/status`
- **Auth**: Required.
- **Body**:
  ```json
  {
    "status": "contacted | qualified | quotation_sent | negotiation | won | lost",
    "notes": "Stage notes",
    "lossReason": "Optional loss explanation"
  }
  ```
- **Behavior**: Updates lifecycle stage and records entry in `activityHistory`.

### `PATCH /api/v1/enquiries/:id/assign`
- **Auth**: Required. Assigns staff owner and logs in audit timeline.

---

## 4. Customer Directory Endpoints

### `GET /api/v1/customers`
- **Auth**: Required.
- **Query Parameters**: `search`, `country`, `page`.

### `GET /api/v1/customers/:id`
- **Auth**: Required. Returns profile and linked enquiry history.

### `PUT /api/v1/customers/:id`
- **Auth**: Required. Updates customer notes and details.

---

## 5. Follow-Up Task Endpoints

### `GET /api/v1/follow-ups`
- **Auth**: Required.
- **Query Parameters**: `filter` (`all`, `due_today`, `overdue`, `upcoming`, `completed`).
- **Response**: List of follow-ups and live count badges.

### `POST /api/v1/follow-ups/enquiry/:enquiryId`
- **Auth**: Required. Creates task reminder linked to enquiry.

### `PATCH /api/v1/follow-ups/:id/complete`
- **Auth**: Required. Marks task completed with notes.

---

## 6. Communication Logging Endpoints

### `GET /api/v1/communications/enquiry/:enquiryId`
- **Auth**: Required. Returns interaction history.

### `POST /api/v1/communications/enquiry/:enquiryId`
- **Auth**: Required.
- **Body**:
  ```json
  {
    "type": "call | email | whatsapp | meeting | internal_note | quotation_activity",
    "summary": "Brief subject",
    "notes": "Detailed interaction notes"
  }
  ```

---

## 7. Reports & Analytics Endpoints

### `GET /api/v1/reports/overview`
- **Auth**: Required.
- **Response**: Live calculated KPIs, pipeline distribution, category breakdown, recent activity.

### `GET /api/v1/reports/analytics`
- **Auth**: Required.
- **Query Parameters**: `startDate`, `endDate`.

### `GET /api/v1/reports/export-csv`
- **Auth**: Required.
- **Response**: RFC 4180 CSV attachment stream with all enquiry fields.

---

## 8. User Administration Endpoints (Super Admin)

### `GET /api/v1/users`
- **Auth**: Required (`super_admin` only).

### `POST /api/v1/users`
- **Auth**: Required (`super_admin` only). Creates new staff account with bcrypt hash.

### `PATCH /api/v1/users/:id/toggle-status`
- **Auth**: Required (`super_admin` only). Activates / deactivates staff accounts.

### `PATCH /api/v1/users/:id/reset-password`
- **Auth**: Required (`super_admin` only). Resets user password.

---

## 9. Company Settings Endpoints

### `GET /api/v1/settings`
- **Auth**: Public read of company details and product brand.

### `PUT /api/v1/settings`
- **Auth**: Required (`super_admin` only). Updates corporate profile and brand settings.
