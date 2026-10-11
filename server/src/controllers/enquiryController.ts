import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Enquiry, EnquiryStatus } from '../models/Enquiry.js';
import { Customer } from '../models/Customer.js';
import { FollowUp } from '../models/FollowUp.js';
import { User } from '../models/User.js';
import {
  publicEnquirySchema,
  updateEnquiryStatusSchema,
  assignEnquirySchema,
} from '../validators/index.js';

// Helper to generate unique human-readable enquiry number
async function generateEnquiryNumber(): Promise<string> {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const count = await Enquiry.countDocuments();
  const sequence = String(count + 101).padStart(4, '0');
  return `ENQ-${dateStr}-${sequence}`;
}

export async function createPublicEnquiry(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const validated = publicEnquirySchema.parse(req.body);

    const enquiryNumber = await generateEnquiryNumber();

    // 1. Find or create customer by email to ensure clean deduplication
    let customer = await Customer.findOne({ email: validated.email.toLowerCase() });
    if (!customer) {
      customer = await Customer.create({
        name: validated.customerName,
        company: validated.company,
        email: validated.email.toLowerCase(),
        phone: validated.phone,
        country: validated.country,
        notes: `Created via public RFQ: ${enquiryNumber}`,
        isDemoRecord: false,
      });
    }

    // 2. Create the enquiry record
    const enquiry = new Enquiry({
      enquiryNumber,
      customerName: validated.customerName,
      company: validated.company,
      email: validated.email.toLowerCase(),
      phone: validated.phone,
      country: validated.country,
      productRef: validated.productRef ? new mongoose.Types.ObjectId(validated.productRef) : undefined,
      productName: validated.productName || 'General Sanitary Products Enquiry',
      quantity: validated.quantity,
      unit: validated.unit,
      message: validated.message,
      preferredContactMethod: validated.preferredContactMethod,
      source: validated.source || 'website_rfq',
      status: 'new',
      priority: 'medium',
      customerRef: customer._id,
      isDemoRecord: false,
      activityHistory: [
        {
          action: 'Enquiry Received',
          performedBy: 'Public Website Visitor',
          timestamp: new Date(),
          notes: `Enquiry submitted for ${validated.productName || 'Sanitary Products'}`,
        },
      ],
    });

    await enquiry.save();

    // 3. Link enquiry to customer
    customer.linkedEnquiries.push(enquiry._id as mongoose.Types.ObjectId);
    await customer.save();

    // 4. Create an automatic FollowUp reminder due in 24 hours
    const followUpDueDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await FollowUp.create({
      enquiryRef: enquiry._id,
      enquiryNumber: enquiry.enquiryNumber,
      customerName: enquiry.customerName,
      company: enquiry.company,
      dueDate: followUpDueDate,
      taskDescription: `Initial response & specification review for enquiry ${enquiry.enquiryNumber}`,
      priority: 'high',
      status: 'pending',
      isDemoRecord: false,
    });

    res.status(201).json({
      success: true,
      message: 'Thank you! Your enquiry has been received. Our team will contact you shortly.',
      data: {
        enquiryNumber: enquiry.enquiryNumber,
        customerName: enquiry.customerName,
        company: enquiry.company,
        status: enquiry.status,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getEnquiries(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const {
      status,
      source,
      country,
      priority,
      assignedUserId,
      search,
      page = '1',
      limit = '15',
    } = req.query;

    const query: any = {};

    if (status && typeof status === 'string' && status !== 'all') {
      query.status = status;
    }

    if (source && typeof source === 'string' && source !== 'all') {
      query.source = source;
    }

    if (country && typeof country === 'string' && country !== 'all') {
      query.country = country;
    }

    if (priority && typeof priority === 'string' && priority !== 'all') {
      query.priority = priority;
    }

    if (assignedUserId && typeof assignedUserId === 'string' && assignedUserId !== 'all') {
      query.assignedUser = new mongoose.Types.ObjectId(assignedUserId);
    }

    if (search && typeof search === 'string' && search.trim() !== '') {
      query.$or = [
        { customerName: { $regex: search.trim(), $options: 'i' } },
        { company: { $regex: search.trim(), $options: 'i' } },
        { email: { $regex: search.trim(), $options: 'i' } },
        { enquiryNumber: { $regex: search.trim(), $options: 'i' } },
        { productName: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 15;
    const skip = (pageNum - 1) * limitNum;

    const [enquiries, total] = await Promise.all([
      Enquiry.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .populate('assignedUser', 'name email')
        .populate('productRef', 'name category images'),
      Enquiry.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: {
        enquiries,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getEnquiryById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const enquiry = await Enquiry.findById(id)
      .populate('assignedUser', 'name email')
      .populate('customerRef')
      .populate('productRef');

    if (!enquiry) {
      res.status(404).json({ success: false, message: 'Enquiry not found' });
      return;
    }

    // Get linked follow-ups
    const followUps = await FollowUp.find({ enquiryRef: enquiry._id }).sort({ dueDate: 1 });

    res.json({
      success: true,
      data: {
        enquiry,
        followUps,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function updateEnquiryStatus(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const { status, notes, lossReason } = updateEnquiryStatusSchema.parse(req.body);

    const enquiry = await Enquiry.findById(id);
    if (!enquiry) {
      res.status(404).json({ success: false, message: 'Enquiry not found' });
      return;
    }

    const oldStatus = enquiry.status;
    enquiry.status = status as EnquiryStatus;
    if (lossReason) enquiry.lossReason = lossReason;
    if (notes) enquiry.notes = notes;

    const performer = req.user?.name || 'Authorized Staff';

    enquiry.activityHistory.push({
      action: `Status Changed: ${oldStatus.toUpperCase()} → ${status.toUpperCase()}`,
      performedBy: performer,
      timestamp: new Date(),
      notes: notes || (lossReason ? `Reason: ${lossReason}` : undefined),
    });

    await enquiry.save();

    res.json({
      success: true,
      message: `Enquiry status updated to ${status}`,
      data: { enquiry },
    });
  } catch (error) {
    next(error);
  }
}

export async function assignEnquiry(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const { assignedUserId, notes } = assignEnquirySchema.parse(req.body);

    const [enquiry, staffUser] = await Promise.all([
      Enquiry.findById(id),
      User.findById(assignedUserId),
    ]);

    if (!enquiry) {
      res.status(404).json({ success: false, message: 'Enquiry not found' });
      return;
    }

    if (!staffUser) {
      res.status(404).json({ success: false, message: 'Assigned staff user not found' });
      return;
    }

    enquiry.assignedUser = staffUser._id as mongoose.Types.ObjectId;
    enquiry.assignedUserName = staffUser.name;

    const performer = req.user?.name || 'Administrator';

    enquiry.activityHistory.push({
      action: `Assigned to ${staffUser.name}`,
      performedBy: performer,
      timestamp: new Date(),
      notes: notes || undefined,
    });

    await enquiry.save();

    res.json({
      success: true,
      message: `Enquiry assigned to ${staffUser.name}`,
      data: { enquiry },
    });
  } catch (error) {
    next(error);
  }
}

export async function addEnquiryNote(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const { note } = req.body;

    if (!note || typeof note !== 'string') {
      res.status(400).json({ success: false, message: 'Note text is required' });
      return;
    }

    const enquiry = await Enquiry.findById(id);
    if (!enquiry) {
      res.status(404).json({ success: false, message: 'Enquiry not found' });
      return;
    }

    enquiry.notes = enquiry.notes ? `${enquiry.notes}\n[${new Date().toLocaleDateString()}] ${note}` : note;

    enquiry.activityHistory.push({
      action: 'Internal Note Added',
      performedBy: req.user?.name || 'Staff',
      timestamp: new Date(),
      notes: note,
    });

    await enquiry.save();

    res.json({
      success: true,
      message: 'Note added to enquiry',
      data: { enquiry },
    });
  } catch (error) {
    next(error);
  }
}
