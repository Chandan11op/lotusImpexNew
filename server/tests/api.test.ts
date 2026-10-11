import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { connectDB, disconnectDB } from '../src/config/db.js';
import { seedDatabase } from '../src/seed/seed.js';
import { User } from '../src/models/User.js';
import { Product } from '../src/models/Product.js';
import { Enquiry } from '../src/models/Enquiry.js';
import { FollowUp } from '../src/models/FollowUp.js';
import { COOKIE_NAME } from '../src/utils/token.js';

let app: any;
let superAdminToken: string;
let superAdminCookie: string;
let staffToken: string;
let staffCookie: string;

beforeAll(async () => {
  await connectDB();
  await seedDatabase({ silent: true });
  app = createApp();

  // Login as Super Admin
  const adminRes = await request(app)
    .post('/api/v1/auth/login')
    .send({
      email: 'chandan110906@gmail.com',
      password: 'Chandan',
    });

  expect(adminRes.status).toBe(200);
  superAdminToken = adminRes.body.data.token;
  superAdminCookie = adminRes.headers['set-cookie']?.[0] || '';

  // Login as Staff
  const staffRes = await request(app)
    .post('/api/v1/auth/login')
    .send({
      email: 'staff@lotusimpex.com',
      password: 'StaffUser2026',
    });

  expect(staffRes.status).toBe(200);
  staffToken = staffRes.body.data.token;
  staffCookie = staffRes.headers['set-cookie']?.[0] || '';
}, 180000);

afterAll(async () => {
  await disconnectDB();
});

describe('1. Authentication & Security Tests', () => {
  it('should successfully log in Super Admin with valid demo credentials', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'chandan110906@gmail.com',
        password: 'Chandan',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.role).toBe('super_admin');
    expect(res.body.data.user.email).toBe('chandan110906@gmail.com');
    // Ensure password hash is NOT returned
    expect(res.body.data.user.passwordHash).toBeUndefined();
  });

  it('should reject login with invalid password', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'chandan110906@gmail.com',
        password: 'WrongPassword!',
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should return current authenticated user via /auth/me with Bearer token', async () => {
    const res = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${superAdminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.user.role).toBe('super_admin');
  });

  it('should return 401 when accessing protected route without authentication', async () => {
    const res = await request(app).get('/api/v1/auth/me');
    expect(res.status).toBe(401);
  });
});

describe('2. Role-Based Access Control (RBAC) Tests', () => {
  it('should permit Super Admin to access /api/v1/users', async () => {
    const res = await request(app)
      .get('/api/v1/users')
      .set('Authorization', `Bearer ${superAdminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.users)).toBe(true);
  });

  it('should forbid Staff user from accessing /api/v1/users with 403 status', async () => {
    const res = await request(app)
      .get('/api/v1/users')
      .set('Authorization', `Bearer ${staffToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('should allow Super Admin to create a new staff account', async () => {
    const res = await request(app)
      .post('/api/v1/users')
      .set('Authorization', `Bearer ${superAdminToken}`)
      .send({
        name: 'Test Staff User',
        email: 'teststaff@lotusimpex.example.com',
        password: 'Password123!',
        role: 'staff',
        phone: '+91 99999 88888',
      });

    expect(res.status).toBe(201);
    expect(res.body.data.user.email).toBe('teststaff@lotusimpex.example.com');
  });
});

describe('3. Public Catalogue & Product CRUD Tests', () => {
  it('should return only published products to public visitors', async () => {
    const res = await request(app).get('/api/v1/products/public');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.products.length).toBeGreaterThan(0);
    res.body.data.products.forEach((p: any) => {
      expect(p.isPublished).toBe(true);
    });
  });

  it('should allow searching products by category and query', async () => {
    const res = await request(app)
      .get('/api/v1/products/public')
      .query({ category: 'Valves & Butterfly Valves' });

    expect(res.status).toBe(200);
    expect(res.body.data.products.length).toBeGreaterThan(0);
    expect(res.body.data.products[0].category).toBe('Valves & Butterfly Valves');
  });

  it('should allow creating a new product via CRM', async () => {
    const newSlug = `test-sanitary-reducer-${Date.now()}`;
    const res = await request(app)
      .post('/api/v1/products/admin')
      .set('Authorization', `Bearer ${superAdminToken}`)
      .send({
        name: 'Test Sanitary Reducer',
        slug: newSlug,
        category: 'Reducers',
        shortDescription: 'High quality test reducer for testing suite',
        fullDescription: 'Full description of testing sanitary reducer with precision bore.',
        material: 'Stainless Steel AISI 316L',
        grade: 'SS 316L',
        sizeRange: '2" x 1"',
        connectionType: 'Tri-Clamp',
        surfaceFinish: 'Ra < 0.8 µm',
        applicableIndustries: ['Dairy & Milk Processing'],
        standards: '3-A Sanitary',
        isPublished: true,
      });

    expect(res.status).toBe(201);
    expect(res.body.data.product.slug).toBe(newSlug);
  });
});

describe('4. End-to-End Public Enquiry Submission & Persistence', () => {
  it('should allow a public visitor to submit an RFQ and immediately reflect in database', async () => {
    const testRfq = {
      customerName: 'Anil Kumar',
      company: 'Gujarat Cooperative Dairies Ltd',
      email: 'anil.kumar@gujaratdairy.example.com',
      phone: '+91 98765 43210',
      country: 'India',
      productName: 'Sanitary Stainless Steel Tubes ASTM A270',
      quantity: 500,
      unit: 'Meters',
      message: 'Need 500 meters of 2" OD SS316L tubes with mill test certificates.',
      preferredContactMethod: 'Email',
    };

    const res = await request(app).post('/api/v1/enquiries/public').send(testRfq);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.enquiryNumber).toMatch(/^ENQ-\d+-\d+$/);

    // Verify it exists in database
    const savedEnquiry = await Enquiry.findOne({
      enquiryNumber: res.body.data.enquiryNumber,
    });
    expect(savedEnquiry).not.toBeNull();
    expect(savedEnquiry?.customerName).toBe('Anil Kumar');
    expect(savedEnquiry?.status).toBe('new');

    // Verify an automatic follow-up was created for the sales team
    const followUp = await FollowUp.findOne({ enquiryRef: savedEnquiry?._id });
    expect(followUp).not.toBeNull();
    expect(followUp?.status).toBe('pending');
  });

  it('should allow staff to update enquiry status and record activity history', async () => {
    const enquiry = await Enquiry.findOne({ status: 'new' });
    expect(enquiry).not.toBeNull();

    const res = await request(app)
      .patch(`/api/v1/enquiries/${enquiry?._id}/status`)
      .set('Authorization', `Bearer ${staffToken}`)
      .send({
        status: 'contacted',
        notes: 'Called customer; discussed tube specifications and freight terms.',
      });

    expect(res.status).toBe(200);
    expect(res.body.data.enquiry.status).toBe('contacted');

    const updated = await Enquiry.findById(enquiry?._id);
    expect(updated?.status).toBe('contacted');
    expect(updated?.activityHistory.some((a) => a.action.includes('CONTACTED'))).toBe(true);
  });
});

describe('5. Follow-Up Task Management Tests', () => {
  it('should return pending, overdue, and completed follow-up counts', async () => {
    const res = await request(app)
      .get('/api/v1/follow-ups')
      .set('Authorization', `Bearer ${staffToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.counts).toBeDefined();
    expect(typeof res.body.data.counts.totalPending).toBe('number');
  });

  it('should allow marking a follow-up as completed', async () => {
    const followUp = await FollowUp.findOne({ status: 'pending' });
    expect(followUp).not.toBeNull();

    const res = await request(app)
      .patch(`/api/v1/follow-ups/${followUp?._id}/complete`)
      .set('Authorization', `Bearer ${staffToken}`)
      .send({
        completionNotes: 'Follow-up done via telephone. Specifications documented.',
      });

    expect(res.status).toBe(200);
    expect(res.body.data.followUp.status).toBe('completed');
  });
});

describe('6. Dashboard Overview Metrics Calculation', () => {
  it('should return genuine database-calculated KPI counts and pipeline metrics', async () => {
    const res = await request(app)
      .get('/api/v1/reports/overview')
      .set('Authorization', `Bearer ${superAdminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.kpis).toBeDefined();
    expect(res.body.data.kpis.totalEnquiries).toBeGreaterThan(0);
    expect(Array.isArray(res.body.data.pipelineData)).toBe(true);
    expect(Array.isArray(res.body.data.categoryBreakdown)).toBe(true);
  });
});
