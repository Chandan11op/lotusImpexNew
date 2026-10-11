import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { connectDB, disconnectDB } from '../config/db.js';
import { config } from '../config/env.js';
import { User } from '../models/User.js';
import { Product } from '../models/Product.js';
import { Customer } from '../models/Customer.js';
import { Enquiry } from '../models/Enquiry.js';
import { FollowUp } from '../models/FollowUp.js';
import { CommunicationLog } from '../models/CommunicationLog.js';
import { CompanySettings } from '../models/CompanySettings.js';
import { demoProducts, demoCustomers } from './seedData.js';

export async function seedDatabase(options: { silent?: boolean } = {}) {
  const log = (msg: string) => {
    if (!options.silent) console.log(`[Seed] ${msg}`);
  };

  log('Starting idempotent database seeding...');

  // 1. Seed or Update Super Admin User
  const adminSalt = await bcrypt.genSalt(10);
  const adminHash = await bcrypt.hash(config.adminPassword, adminSalt);

  let adminUser = await User.findOne({ email: config.adminEmail.toLowerCase() });
  if (!adminUser) {
    adminUser = await User.create({
      name: config.adminName,
      email: config.adminEmail.toLowerCase(),
      passwordHash: adminHash,
      role: 'super_admin',
      isActive: true,
      phone: '+91 98200 11000',
    });
    log(`Created Super Admin account: ${adminUser.email}`);
  } else {
    adminUser.passwordHash = adminHash;
    adminUser.role = 'super_admin';
    adminUser.isActive = true;
    await adminUser.save();
    log(`Updated existing Super Admin credentials: ${adminUser.email}`);
  }

  // 2. Seed Staff User
  const staffEmail = 'staff@lotusimpex.com';
  let staffUser = await User.findOne({ email: staffEmail });
  if (!staffUser) {
    const staffHash = await bcrypt.hash('StaffUser2026', 10);
    staffUser = await User.create({
      name: 'Pooja Sharma (Sales Engineer)',
      email: staffEmail,
      passwordHash: staffHash,
      role: 'staff',
      isActive: true,
      phone: '+91 98200 22000',
    });
    log(`Created Demo Staff account: ${staffUser.email}`);
  }

  // 3. Seed Company Settings
  let settings = await CompanySettings.findOne();
  if (!settings) {
    settings = await CompanySettings.create({
      companyName: config.companyName,
      productBrand: `${config.productBrand} (Draft Brand)`,
      email: 'sales@lotusimpex.com',
      phone: '+91 22 2847 0000',
      whatsapp: '+91 98200 00000',
      address: 'Industrial Complex, Kanjurmarg West, Mumbai 400078, Maharashtra, India',
      intro:
        'Lotus Impex is a Mumbai-based distributor and supplier of precision stainless-steel sanitary tubes, pipes, fittings, valves, TC clamps, and engineered fluid handling components for sanitary and process industries.',
      socialLinks: {
        linkedin: 'https://linkedin.com/company/lotus-impex',
        indiamart: 'https://www.indiamart.com/lotus-impex-mumbai',
      },
      supportedLanguages: ['en'],
      isDemoConfig: true,
    });
    log('Initialized default company and brand settings');
  }

  // 4. Seed Products
  const createdProducts: any[] = [];
  for (const prodData of demoProducts) {
    let product = await Product.findOne({ slug: prodData.slug });
    if (!product) {
      product = await Product.create(prodData);
    } else {
      Object.assign(product, prodData);
      await product.save();
    }
    createdProducts.push(product);
  }
  log(`Seeded ${createdProducts.length} sanitary products across taxonomy`);

  // 5. Seed Customers
  const createdCustomers: any[] = [];
  for (const custData of demoCustomers) {
    let customer = await Customer.findOne({ email: custData.email });
    if (!customer) {
      customer = await Customer.create({
        ...custData,
        linkedEnquiries: [],
        isDemoRecord: true,
      });
    }
    createdCustomers.push(customer);
  }
  log(`Seeded ${createdCustomers.length} demonstration customer accounts`);

  // 6. Seed Realistic Pipeline Enquiries
  const sampleEnquiries = [
    {
      enquiryNumber: 'ENQ-2026-1001',
      customerIndex: 0, // Amul
      productIndex: 0, // Tubes
      quantity: 1200,
      unit: 'Meters',
      status: 'won',
      priority: 'high',
      source: 'website_rfq',
      country: 'India',
      message:
        'Requirement for 1200 meters of ASTM A270 SS316L 1.5" OD dairy tubing for Anand milk processing plant line upgrade. Delivery required in 3 weeks.',
      notes: 'Purchase order received. Advance payment processed. Shipment dispatched via logistics partner.',
      assignedUser: adminUser._id,
      assignedUserName: adminUser.name,
      daysAgo: 14,
    },
    {
      enquiryNumber: 'ENQ-2026-1002',
      customerIndex: 1, // Serum BioPharma
      productIndex: 7, // Diaphragm valve
      quantity: 45,
      unit: 'Pieces',
      status: 'negotiation',
      priority: 'urgent',
      source: 'direct_rfq',
      country: 'India',
      message:
        'Urgent quotation needed for 45 pieces of forged SS316L weir diaphragm valves (1.5" TC ends) with electropolished Ra < 0.4 µm finish for vaccine cleanroom.',
      notes: 'Technical submittal approved by QC. Negotiating final commercial discount for 45 units.',
      assignedUser: staffUser._id,
      assignedUserName: staffUser.name,
      daysAgo: 8,
    },
    {
      enquiryNumber: 'ENQ-2026-1003',
      customerIndex: 2, // Almarai
      productIndex: 1, // TC Clamps
      quantity: 500,
      unit: 'Sets',
      status: 'quotation_sent',
      priority: 'high',
      source: 'website_catalogue',
      country: 'United Arab Emirates',
      message:
        'Looking for 500 sets of 13MHH double-bolt Tri-Clamp heavy duty clamps and SS316L long weld ferrules with food-grade EPDM gaskets for Dubai central depot.',
      notes: 'Quotation Q-2026-088 sent with CIF Jebel Ali pricing. Waiting for procurement decision.',
      assignedUser: adminUser._id,
      assignedUserName: adminUser.name,
      daysAgo: 5,
    },
    {
      enquiryNumber: 'ENQ-2026-1004',
      customerIndex: 3, // Parle Agro
      productIndex: 2, // Butterfly valve
      quantity: 60,
      unit: 'Pieces',
      status: 'qualified',
      priority: 'medium',
      source: 'website_rfq',
      country: 'India',
      message:
        'Need 60 sanitary pull-handle butterfly valves (2" SMS male ends) with food-grade silicone seat for fruit juice lines in Vapi.',
      notes: 'Customer verified. Line sizes and SMS threading confirmed.',
      assignedUser: staffUser._id,
      assignedUserName: staffUser.name,
      daysAgo: 3,
    },
    {
      enquiryNumber: 'ENQ-2026-1005',
      customerIndex: 4, // Cipla
      productIndex: 6, // Reducers
      quantity: 30,
      unit: 'Pieces',
      status: 'contacted',
      priority: 'medium',
      source: 'website_contact',
      country: 'India',
      message:
        'Requesting dimensional drawings and prices for self-draining eccentric reducers (2" x 1.5" and 3" x 2") in SS316L.',
      notes: 'Spoke with Alok Sengupta on phone. Sent catalog drawings.',
      assignedUser: staffUser._id,
      assignedUserName: staffUser.name,
      daysAgo: 2,
    },
    {
      enquiryNumber: 'ENQ-2026-1006',
      customerIndex: 5, // Celtic Craft
      productIndex: 3, // Bends
      quantity: 120,
      unit: 'Pieces',
      status: 'new',
      priority: 'high',
      source: 'website_rfq',
      country: 'Ireland',
      message:
        'Enquiring about export shipping to Dublin for 120 sanitary 90-degree weld bends and 60 equal tees in SS316L for distillery manifold expansion.',
      notes: '',
      daysAgo: 0,
    },
    {
      enquiryNumber: 'ENQ-2026-1007',
      customerIndex: 4, // Cipla
      productIndex: 11, // Flanges
      quantity: 20,
      unit: 'Pieces',
      status: 'lost',
      priority: 'low',
      source: 'website_rfq',
      country: 'India',
      message:
        'Non-standard 8" TC to ANSI 300# high pressure transition flanges.',
      notes: 'Customer opted for local cast competitor due to custom pressure class timeline.',
      lossReason: 'Delivery lead time for custom non-standard 8" tooling exceeded buyer deadline',
      assignedUser: adminUser._id,
      assignedUserName: adminUser.name,
      daysAgo: 10,
    },
  ];

  const createdEnquiries: any[] = [];
  for (const enqData of sampleEnquiries) {
    const cust = createdCustomers[enqData.customerIndex];
    const prod = createdProducts[enqData.productIndex];
    const createdAt = new Date(Date.now() - enqData.daysAgo * 24 * 60 * 60 * 1000);

    let enquiry = await Enquiry.findOne({ enquiryNumber: enqData.enquiryNumber });
    if (!enquiry) {
      enquiry = await Enquiry.create({
        enquiryNumber: enqData.enquiryNumber,
        customerName: cust.name,
        company: cust.company,
        email: cust.email,
        phone: cust.phone,
        country: enqData.country,
        productRef: prod._id,
        productName: prod.name,
        quantity: enqData.quantity,
        unit: enqData.unit,
        message: enqData.message,
        source: enqData.source,
        status: enqData.status,
        priority: enqData.priority,
        assignedUser: enqData.assignedUser,
        assignedUserName: enqData.assignedUserName,
        customerRef: cust._id,
        lossReason: enqData.lossReason,
        notes: enqData.notes,
        isDemoRecord: true,
        createdAt,
        updatedAt: createdAt,
        activityHistory: [
          {
            action: 'Enquiry Received',
            performedBy: 'Public Website Visitor',
            timestamp: createdAt,
            notes: 'Submitted via website quote form',
          },
          ...(enqData.status !== 'new'
            ? [
                {
                  action: `Status Updated to ${enqData.status.toUpperCase()}`,
                  performedBy: enqData.assignedUserName || 'Admin',
                  timestamp: new Date(createdAt.getTime() + 4 * 60 * 60 * 1000),
                  notes: enqData.notes || undefined,
                },
              ]
            : []),
        ],
      });
      // Link to customer
      if (!cust.linkedEnquiries.includes(enquiry._id)) {
        cust.linkedEnquiries.push(enquiry._id);
        await cust.save();
      }
    }
    createdEnquiries.push(enquiry);
  }
  log(`Seeded ${createdEnquiries.length} demonstration enquiries across all pipeline stages`);

  // 7. Seed Follow-ups (overdue, due today, upcoming, completed)
  const now = new Date();
  const sampleFollowUps = [
    {
      enquiryRef: createdEnquiries[4]._id, // Cipla contacted
      enquiryNumber: createdEnquiries[4].enquiryNumber,
      customerName: createdEnquiries[4].customerName,
      company: createdEnquiries[4].company,
      dueDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // Overdue by 2 days
      taskDescription: 'Send dimensional CAD drawings and Ra roughness test certs to Alok Sengupta',
      priority: 'high',
      status: 'pending',
      assignedUser: staffUser._id,
      assignedUserName: staffUser.name,
    },
    {
      enquiryRef: createdEnquiries[2]._id, // Almarai quote sent
      enquiryNumber: createdEnquiries[2].enquiryNumber,
      customerName: createdEnquiries[2].customerName,
      company: createdEnquiries[2].company,
      dueDate: new Date(now.getTime() + 2 * 60 * 60 * 1000), // Due today
      taskDescription: 'Follow up on Jebel Ali CIF shipping quotation Q-2026-088 with procurement lead',
      priority: 'urgent',
      status: 'pending',
      assignedUser: adminUser._id,
      assignedUserName: adminUser.name,
    },
    {
      enquiryRef: createdEnquiries[1]._id, // Serum negotiation
      enquiryNumber: createdEnquiries[1].enquiryNumber,
      customerName: createdEnquiries[1].customerName,
      company: createdEnquiries[1].company,
      dueDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), // Upcoming in 3 days
      taskDescription: 'Review final terms & delivery schedule for 45 weir diaphragm valves',
      priority: 'high',
      status: 'pending',
      assignedUser: staffUser._id,
      assignedUserName: staffUser.name,
    },
    {
      enquiryRef: createdEnquiries[0]._id, // Amul won
      enquiryNumber: createdEnquiries[0].enquiryNumber,
      customerName: createdEnquiries[0].customerName,
      company: createdEnquiries[0].company,
      dueDate: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
      taskDescription: 'Confirm dispatch of sample gasket set and Mill Test Certificate',
      priority: 'medium',
      status: 'completed',
      completedAt: new Date(now.getTime() - 9 * 24 * 60 * 60 * 1000),
      completionNotes: 'MTR 3.1 cert sent via email and physical copy attached with lorry receipt.',
      assignedUser: adminUser._id,
      assignedUserName: adminUser.name,
    },
  ];

  for (const fu of sampleFollowUps) {
    const existing = await FollowUp.findOne({
      enquiryRef: fu.enquiryRef,
      taskDescription: fu.taskDescription,
    });
    if (!existing) {
      await FollowUp.create({ ...fu, isDemoRecord: true });
    }
  }
  log('Seeded follow-up tasks with overdue, due today, upcoming, and completed states');

  // 8. Seed Communication Logs
  const sampleCommLogs = [
    {
      enquiryRef: createdEnquiries[0]._id,
      enquiryNumber: createdEnquiries[0].enquiryNumber,
      customerRef: createdEnquiries[0].customerRef,
      author: 'Chandan (Super Admin)',
      type: 'call',
      summary: 'Call with Rajesh Mehta regarding Anand Plant delivery milestone',
      notes: 'Customer confirmed all 1200m tubing must be capped with protective blue end-caps.',
      timestamp: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000),
    },
    {
      enquiryRef: createdEnquiries[2]._id,
      enquiryNumber: createdEnquiries[2].enquiryNumber,
      customerRef: createdEnquiries[2].customerRef,
      author: 'Pooja Sharma (Sales Engineer)',
      type: 'email',
      summary: 'Submitted Formal Quotation Q-2026-088 to Tariq Al-Mansoor',
      notes: 'Provided comprehensive CIF Dubai port container pricing with full material specification sheets.',
      timestamp: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
    },
    {
      enquiryRef: createdEnquiries[3]._id,
      enquiryNumber: createdEnquiries[3].enquiryNumber,
      customerRef: createdEnquiries[3].customerRef,
      author: 'Pooja Sharma (Sales Engineer)',
      type: 'whatsapp',
      summary: 'Shared butterfly valve dimensional technical drawing via WhatsApp',
      notes: 'Buyer verified SMS male thread pitch (SMS 1145 standard) matches existing juice headers.',
      timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
    },
  ];

  for (const cl of sampleCommLogs) {
    const existing = await CommunicationLog.findOne({
      enquiryRef: cl.enquiryRef,
      summary: cl.summary,
    });
    if (!existing) {
      await CommunicationLog.create({ ...cl, isDemoRecord: true });
    }
  }
  log('Seeded realistic communication history timeline records');

  log('✅ Seed completed successfully! Super Admin credentials:');
  log(`   Email:    ${config.adminEmail}`);
  log(`   Password: ${config.adminPassword}`);
  log('   Role:     super_admin');
}

// Direct CLI execution check
if (process.argv[1]?.endsWith('seed.ts') || process.argv[1]?.endsWith('seed.js')) {
  (async () => {
    try {
      await connectDB();
      await seedDatabase();
      await disconnectDB();
      process.exit(0);
    } catch (err) {
      console.error('[Seed Error]:', err);
      process.exit(1);
    }
  })();
}
